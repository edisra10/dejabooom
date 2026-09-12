import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getOptionalEnv } from "@/server/env";
import { processRecommendationJobs } from "@/server/recommendations/recommendation-jobs";

export const runtime = "nodejs";
export const maxDuration = 60;

function hasValidAuthorization(request: Request) {
  const secret = getOptionalEnv("CRON_SECRET");
  const authorization = request.headers.get("authorization");

  if (!secret || !authorization) {
    return false;
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorization);

  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function processJobs(request: Request) {
  if (!hasValidAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const configuredLimit = Number(
    getOptionalEnv("RECOMMENDATION_JOB_BATCH_SIZE") ?? "1",
  );
  const result = await processRecommendationJobs({
    limit: Number.isFinite(configuredLimit) ? configuredLimit : 1,
  });

  return NextResponse.json(result);
}

export const GET = processJobs;
export const POST = processJobs;
