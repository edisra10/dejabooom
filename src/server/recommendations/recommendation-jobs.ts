import { trackServerEvent } from "@/server/analytics/events";
import { prisma } from "@/server/db/prisma";
import { logger } from "@/server/logger";
import { generateRecommendationForOrder } from "./generate-recommendation";
import { getRecommendationRetryDelayMs } from "./recommendation-job-policy";

const MAX_ATTEMPTS = 3;
const STALE_LOCK_MS = 15 * 60 * 1000;

export async function enqueueRecommendationJob(orderId: string) {
  return prisma.recommendationJob.upsert({
    where: { orderId },
    create: { orderId },
    update: {},
  });
}

async function releaseStaleJobs() {
  const staleBefore = new Date(Date.now() - STALE_LOCK_MS);

  await prisma.recommendationJob.updateMany({
    where: {
      status: "PROCESSING",
      lockedAt: { lt: staleBefore },
    },
    data: {
      status: "FAILED",
      availableAt: new Date(),
      lockedAt: null,
      lastError: "Processing lock expired before completion.",
    },
  });
}

async function claimNextJob() {
  const now = new Date();
  const candidate = await prisma.recommendationJob.findFirst({
    where: {
      status: { in: ["PENDING", "FAILED"] },
      attempts: { lt: MAX_ATTEMPTS },
      availableAt: { lte: now },
    },
    orderBy: [{ availableAt: "asc" }, { createdAt: "asc" }],
  });

  if (!candidate) {
    return null;
  }

  const claim = await prisma.recommendationJob.updateMany({
    where: {
      id: candidate.id,
      status: candidate.status,
      attempts: candidate.attempts,
    },
    data: {
      status: "PROCESSING",
      attempts: { increment: 1 },
      lockedAt: now,
      lastError: null,
    },
  });

  if (claim.count !== 1) {
    return null;
  }

  return prisma.recommendationJob.findUniqueOrThrow({
    where: { id: candidate.id },
  });
}

async function processJob(job: Awaited<ReturnType<typeof claimNextJob>>) {
  if (!job) {
    return false;
  }

  trackServerEvent("recommendation_generation_started", {
    orderId: job.orderId,
    attempt: job.attempts,
  });

  let recommendation = null;
  let processingError: unknown;

  try {
    recommendation = await generateRecommendationForOrder(job.orderId);
  } catch (error) {
    processingError = error;
    logger.error("Recommendation job execution failed unexpectedly.", {
      orderId: job.orderId,
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  if (recommendation) {
    await prisma.recommendationJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        lockedAt: null,
        lastError: null,
      },
    });
    trackServerEvent("recommendation_generation_completed", {
      orderId: job.orderId,
      recommendationId: recommendation.id,
      attempt: job.attempts,
    });
    return true;
  }

  const failedRecommendation = await prisma.recommendation.findUnique({
    where: { orderId: job.orderId },
    select: { generationError: true },
  });
  const lastError = processingError
    ? processingError instanceof Error
      ? processingError.message
      : String(processingError)
    : (failedRecommendation?.generationError ??
      "Recommendation generation failed.");
  const exhausted = job.attempts >= MAX_ATTEMPTS;

  await prisma.recommendationJob.update({
    where: { id: job.id },
    data: {
      status: "FAILED",
      availableAt: new Date(
        Date.now() + getRecommendationRetryDelayMs(job.attempts),
      ),
      lockedAt: null,
      lastError,
    },
  });
  trackServerEvent("recommendation_generation_failed", {
    orderId: job.orderId,
    attempt: job.attempts,
    exhausted,
  });
  return true;
}

export async function processRecommendationJobs({ limit = 1 } = {}) {
  const safeLimit = Math.max(1, Math.min(limit, 5));
  await releaseStaleJobs();

  let processed = 0;

  for (let index = 0; index < safeLimit; index += 1) {
    const job = await claimNextJob();

    if (!job) {
      break;
    }

    await processJob(job);
    processed += 1;
  }

  await prisma.rateLimitBucket.deleteMany({
    where: {
      resetAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  logger.info("Recommendation job batch completed.", { processed, safeLimit });
  return { processed };
}
