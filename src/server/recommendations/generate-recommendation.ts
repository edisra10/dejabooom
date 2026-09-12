import type { Prisma, Recommendation } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getPublicAppUrl } from "@/server/env";
import {
  sendGenerationErrorAlert,
  sendRevealReadyEmail,
} from "@/server/email/email-service";
import { logger } from "@/server/logger";
import {
  createRevealToken,
  encryptRevealToken,
  decryptRevealToken,
  getRevealTokenLastFour,
  hashRevealToken,
} from "@/server/security/reveal-token";
import { generateItineraryWithOpenAI } from "./openai-itinerary";
import { scoreAndPersistTripProfile } from "./persist-scores";

function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function generateRecommendationForOrder(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      tripProfile: {
        include: {
          travelerGroup: true,
        },
      },
      recommendation: {
        include: {
          generatedItinerary: true,
          revealTokens: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (order.status !== "PAID") {
    logger.warn("Recommendation generation skipped for unpaid order.", {
      orderId,
      status: order.status,
    });
    return null;
  }

  if (order.recommendation?.status === "GENERATED") {
    logger.info("Recommendation already generated; skipping duplicate run.", {
      orderId,
      recommendationId: order.recommendation.id,
    });
    return order.recommendation;
  }

  let recommendation: Recommendation | null = order.recommendation;

  try {
    const storedRevealToken = order.recommendation?.revealTokens[0];

    if (
      order.recommendation?.generatedItinerary &&
      recommendation &&
      storedRevealToken?.encryptedToken &&
      (!storedRevealToken.expiresAt || storedRevealToken.expiresAt > new Date())
    ) {
      const existingToken = decryptRevealToken(storedRevealToken.encryptedToken);

      if (existingToken) {
        await sendRevealReadyEmail(
          order.tripProfile.contactEmail,
          `${getPublicAppUrl()}/reveal/${existingToken}`,
        );

        return prisma.recommendation.update({
          where: { id: recommendation.id },
          data: {
            status: "GENERATED",
            generatedAt: new Date(),
            generationError: null,
          },
        });
      }
    }

    const scoringResult = await scoreAndPersistTripProfile(order.tripProfileId);
    const selected = scoringResult.selectedDestination;

    if (!selected) {
      throw new Error("No eligible destination after deterministic filtering.");
    }

    recommendation = await prisma.recommendation.upsert({
      where: { orderId },
      create: {
        orderId,
        tripProfileId: order.tripProfileId,
        selectedDestinationId: selected.destination.id,
        status: "GENERATING",
        topCandidateIds: scoringResult.topThreeCandidates.map(
          (candidate) => candidate.destination.id,
        ),
        scoringBreakdown: toJsonInput(selected.breakdown),
        hardFilterReasons: toJsonInput(
          scoringResult.allCandidates.map((candidate) => ({
            destinationId: candidate.destination.id,
            reasons: candidate.hardFilterReasons,
          })),
        ),
      },
      update: {
        selectedDestinationId: selected.destination.id,
        status: "GENERATING",
        generationError: null,
        topCandidateIds: scoringResult.topThreeCandidates.map(
          (candidate) => candidate.destination.id,
        ),
        scoringBreakdown: toJsonInput(selected.breakdown),
        hardFilterReasons: toJsonInput(
          scoringResult.allCandidates.map((candidate) => ({
            destinationId: candidate.destination.id,
            reasons: candidate.hardFilterReasons,
          })),
        ),
      },
    });

    const destination = await prisma.destination.findUniqueOrThrow({
      where: { id: selected.destination.id },
    });

    const generated = await generateItineraryWithOpenAI({
      profile: order.tripProfile,
      destination,
      scoreSummary: {
        totalScore: selected.totalScore,
        breakdown: selected.breakdown,
        topThreeCandidates: scoringResult.topThreeCandidates.map((candidate) => ({
          destination: `${candidate.destination.city}, ${candidate.destination.country}`,
          score: candidate.totalScore,
        })),
      },
    });

    const token = createRevealToken();
    const revealUrl = `${getPublicAppUrl()}/reveal/${token}`;
    const encryptedToken = encryptRevealToken(token);

    if (!encryptedToken) {
      throw new Error("Reveal token encryption is not configured.");
    }

    await prisma.$transaction([
      prisma.generatedItinerary.upsert({
        where: { recommendationId: recommendation.id },
        create: {
          recommendationId: recommendation.id,
          travelerProfileSummary: generated.content.travelerProfileSummary,
          matchExplanation: generated.content.matchExplanation,
          tripTheme: generated.content.tripTheme,
          itinerary: generated.content.itinerary,
          restaurantAndActivityCategories:
            generated.content.restaurantAndActivityCategories,
          packingSuggestions: generated.content.packingSuggestions,
          revealNarrative: generated.content.revealNarrative,
          clues: generated.content.clues,
          budgetGuidance: generated.content.budgetGuidance,
          importantNotes: generated.content.importantNotes,
          generatedByModel: generated.model,
        },
        update: {
          travelerProfileSummary: generated.content.travelerProfileSummary,
          matchExplanation: generated.content.matchExplanation,
          tripTheme: generated.content.tripTheme,
          itinerary: generated.content.itinerary,
          restaurantAndActivityCategories:
            generated.content.restaurantAndActivityCategories,
          packingSuggestions: generated.content.packingSuggestions,
          revealNarrative: generated.content.revealNarrative,
          clues: generated.content.clues,
          budgetGuidance: generated.content.budgetGuidance,
          importantNotes: generated.content.importantNotes,
          generatedByModel: generated.model,
        },
      }),
      prisma.revealToken.create({
        data: {
          recommendationId: recommendation.id,
          tokenHash: hashRevealToken(token),
          encryptedToken,
          tokenLastFour: getRevealTokenLastFour(token),
          expiresAt: process.env.REVEAL_TOKEN_TTL_DAYS
            ? new Date(
                Date.now() +
                  Number(process.env.REVEAL_TOKEN_TTL_DAYS) * 24 * 60 * 60 * 1000,
              )
            : null,
        },
      }),
    ]);

    await sendRevealReadyEmail(order.tripProfile.contactEmail, revealUrl);
    const deliveredRecommendation = await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: {
        status: "GENERATED",
        generatedAt: new Date(),
        generationError: null,
      },
    });
    logger.info("Recommendation generated after verified payment.", {
      orderId,
      recommendationId: recommendation.id,
    });

    return deliveredRecommendation;
  } catch (error) {
    logger.error("Recommendation generation failed.", {
      orderId,
      error: error instanceof Error ? error.message : String(error),
    });

    if (recommendation) {
      await prisma.recommendation.update({
        where: { id: recommendation.id },
        data: {
          status: "FAILED",
          generationError: error instanceof Error ? error.message : String(error),
        },
      });
    } else {
      await prisma.recommendation.create({
        data: {
          orderId,
          tripProfileId: order.tripProfileId,
          status: "FAILED",
          topCandidateIds: [],
          scoringBreakdown: {},
          hardFilterReasons: [],
          generationError: error instanceof Error ? error.message : String(error),
        },
      });
    }

    await sendGenerationErrorAlert(orderId, error);
    return null;
  }
}
