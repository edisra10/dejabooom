import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { parseScoringWeights, scoreDestinations } from "./scoring-engine";
import {
  mapDestinationToScoring,
  mapTripProfileToScoring,
} from "./profile-mappers";

function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function scoreAndPersistTripProfile(tripProfileId: string) {
  const [tripProfile, destinations] = await Promise.all([
    prisma.tripProfile.findUniqueOrThrow({
      where: { id: tripProfileId },
    }),
    prisma.destination.findMany({
      where: { active: true },
      include: { attributes: true },
    }),
  ]);

  const scoringDestinations = destinations
    .map(mapDestinationToScoring)
    .filter((destination) => destination !== null);

  const result = scoreDestinations(
    mapTripProfileToScoring(tripProfile),
    scoringDestinations,
    parseScoringWeights(process.env.RECOMMENDATION_WEIGHTS_JSON),
  );

  await prisma.$transaction(
    result.allCandidates.map((candidate) =>
      prisma.destinationScore.upsert({
        where: {
          tripProfileId_destinationId: {
            tripProfileId,
            destinationId: candidate.destination.id,
          },
        },
        create: {
          tripProfileId,
          destinationId: candidate.destination.id,
          totalScore: candidate.totalScore,
          breakdown: toJsonInput(candidate.breakdown),
          hardFilterReasons: candidate.hardFilterReasons,
          passedHardFilters: candidate.passedHardFilters,
        },
        update: {
          totalScore: candidate.totalScore,
          breakdown: toJsonInput(candidate.breakdown),
          hardFilterReasons: candidate.hardFilterReasons,
          passedHardFilters: candidate.passedHardFilters,
        },
      }),
    ),
  );

  return result;
}
