import { NextResponse } from "next/server";
import { trackServerEvent } from "@/server/analytics/events";
import { prisma } from "@/server/db/prisma";
import { sendQuestionnaireConfirmation } from "@/server/email/email-service";
import { logger } from "@/server/logger";
import { scoreAndPersistTripProfile } from "@/server/recommendations/persist-scores";
import { mapTripProfileDraftToDb } from "@/server/recommendations/profile-mappers";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/server/security/rate-limit";
import { validateTripProfile } from "@/features/trip-profile/schemas/trip-profile-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit({
    key: `trip-profile:${getRequestIp(request)}`,
    limit: 8,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt);
  }

  const body = (await request.json()) as unknown;
  const validation = validateTripProfile(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        errors: validation.errors,
      },
      { status: 422 },
    );
  }

  const draft = validation.data;
  const tripProfileData = mapTripProfileDraftToDb(draft);

  const tripProfile = await prisma.tripProfile.create({
    data: {
      ...tripProfileData,
      travelerGroup: {
        create: {
          travelerCount: draft.travelerCount,
          adultTravelers: draft.adultTravelers,
          childTravelers: draft.childTravelers,
        },
      },
    },
  });

  let scoringResult;

  try {
    scoringResult = await scoreAndPersistTripProfile(tripProfile.id);
  } catch (error) {
    logger.error("Initial destination scoring failed.", {
      tripProfileId: tripProfile.id,
      error: error instanceof Error ? error.message : String(error),
    });

    await prisma.travelerGroup.delete({
      where: { id: tripProfile.travelerGroupId },
    });

    return NextResponse.json(
      {
        error: "We could not check destination availability. Please try again.",
      },
      { status: 503 },
    );
  }

  if (!scoringResult.selectedDestination) {
    await prisma.travelerGroup.delete({
      where: { id: tripProfile.travelerGroupId },
    });

    return NextResponse.json(
      {
        error:
          "We could not find a destination that fits every constraint. Adjust your budget, flight time, climate, or exclusions and try again.",
      },
      { status: 422 },
    );
  }

  await sendQuestionnaireConfirmation(draft.contactEmail, tripProfile.id);

  logger.info("Trip profile created.", {
    tripProfileId: tripProfile.id,
  });
  trackServerEvent("trip_profile_created", {
    tripProfileId: tripProfile.id,
    destinationScope: draft.destinationScope,
    travelerCount: draft.travelerCount,
    preferredCurrency: draft.preferredCurrency,
  });

  return NextResponse.json(
    {
      profileId: tripProfile.id,
      checkoutPath: `/checkout/${tripProfile.id}`,
    },
    { status: 201 },
  );
}
