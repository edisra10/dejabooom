import type {
  AccommodationPreference,
  BudgetTier,
  Destination,
  DestinationAttribute,
  DestinationScope,
  PassportAvailability,
  PreferenceLevel,
  PreferredClimate,
  PreferredCurrency,
  TravelPace,
  TripProfile,
} from "@prisma/client";
import type { TripProfileDraft } from "@/features/trip-profile/types";
import type {
  DestinationForScoring,
  RecommendationBudgetTier,
  RecommendationProfile,
} from "./scoring-types";

const destinationScopeToDb: Record<
  TripProfileDraft["destinationScope"],
  DestinationScope
> = {
  mexico: "MEXICO",
  north_america: "NORTH_AMERICA",
  international: "INTERNATIONAL",
  open_to_anything: "OPEN_TO_ANYTHING",
};

const preferredCurrencyToDb: Record<
  TripProfileDraft["preferredCurrency"],
  PreferredCurrency
> = {
  USD: "USD",
  MXN: "MXN",
  EUR: "EUR",
};

const preferredClimateToDb: Record<
  TripProfileDraft["preferredClimate"],
  PreferredClimate
> = {
  warm: "WARM",
  mild: "MILD",
  cool: "COOL",
  varied: "VARIED",
  no_preference: "NO_PREFERENCE",
};

const travelPaceToDb: Record<TripProfileDraft["travelPace"], TravelPace> = {
  slow: "SLOW",
  balanced: "BALANCED",
  packed: "PACKED",
};

const accommodationPreferenceToDb: Record<
  TripProfileDraft["accommodationPreference"],
  AccommodationPreference
> = {
  boutique: "BOUTIQUE",
  comfort: "COMFORT",
  luxury: "LUXURY",
  local_stay: "LOCAL_STAY",
  flexible: "FLEXIBLE",
};

const preferenceLevelToDb: Record<"low" | "moderate" | "high", PreferenceLevel> = {
  low: "LOW",
  moderate: "MODERATE",
  high: "HIGH",
};

const passportAvailabilityToDb: Record<
  TripProfileDraft["hasPassport"],
  PassportAvailability
> = {
  yes: "YES",
  no: "NO",
  not_sure: "NOT_SURE",
};

const dbDestinationScopeToScoring: Record<
  Exclude<DestinationScope, "OPEN_TO_ANYTHING">,
  DestinationForScoring["destinationScope"]
> = {
  MEXICO: "mexico",
  NORTH_AMERICA: "north_america",
  INTERNATIONAL: "international",
};

const dbBudgetTierToScoring: Record<BudgetTier, RecommendationBudgetTier> = {
  LOW: "low",
  MID: "mid",
  HIGH: "high",
  LUXURY: "luxury",
};

const dbPreferredClimateToScoring: Record<
  PreferredClimate,
  TripProfileDraft["preferredClimate"]
> = {
  WARM: "warm",
  MILD: "mild",
  COOL: "cool",
  VARIED: "varied",
  NO_PREFERENCE: "no_preference",
};

const dbDestinationScopeToProfile: Record<
  DestinationScope,
  TripProfileDraft["destinationScope"]
> = {
  MEXICO: "mexico",
  NORTH_AMERICA: "north_america",
  INTERNATIONAL: "international",
  OPEN_TO_ANYTHING: "open_to_anything",
};

const dbTravelPaceToProfile: Record<TravelPace, TripProfileDraft["travelPace"]> = {
  SLOW: "slow",
  BALANCED: "balanced",
  PACKED: "packed",
};

const dbPreferenceLevelToProfile: Record<
  PreferenceLevel,
  TripProfileDraft["nightlifePreference"]
> = {
  LOW: "low",
  MODERATE: "moderate",
  HIGH: "high",
};

const dbPassportToProfile: Record<
  PassportAvailability,
  TripProfileDraft["hasPassport"]
> = {
  YES: "yes",
  NO: "no",
  NOT_SURE: "not_sure",
};

export function mapTripProfileDraftToDb(draft: TripProfileDraft) {
  return {
    contactEmail: draft.contactEmail,
    departureCity: draft.departureCity,
    departureAirport: draft.departureAirport,
    destinationScope: destinationScopeToDb[draft.destinationScope],
    approximateStartDate: new Date(`${draft.approximateStartDate}T00:00:00.000Z`),
    approximateEndDate: new Date(`${draft.approximateEndDate}T00:00:00.000Z`),
    flexibleDateRange: draft.flexibleDateRange,
    tripDurationDays: draft.tripDurationDays,
    totalBudget: draft.totalBudget,
    preferredCurrency: preferredCurrencyToDb[draft.preferredCurrency],
    interests: draft.interests,
    preferredClimate: preferredClimateToDb[draft.preferredClimate],
    travelPace: travelPaceToDb[draft.travelPace],
    accommodationPreference:
      accommodationPreferenceToDb[draft.accommodationPreference],
    foodInterests: draft.foodInterests,
    nightlifePreference: preferenceLevelToDb[draft.nightlifePreference],
    naturePreference: preferenceLevelToDb[draft.naturePreference],
    culturalPreference: preferenceLevelToDb[draft.culturalPreference],
    beachPreference: preferenceLevelToDb[draft.beachPreference],
    adventurePreference: preferenceLevelToDb[draft.adventurePreference],
    destinationsVisited: draft.destinationsVisited,
    excludedDestinations: draft.excludedDestinations,
    maximumFlightDurationHours: draft.maximumFlightDurationHours,
    hasPassport: passportAvailabilityToDb[draft.hasPassport],
    visaRestrictions: draft.visaRestrictions,
    accessibilityRequirements: draft.accessibilityRequirements,
    dietaryRestrictions: draft.dietaryRestrictions,
    surpriseLevel:
      draft.surpriseLevel === "full_surprise"
        ? "FULL_SURPRISE"
        : draft.surpriseLevel === "reveal_country"
          ? "REVEAL_COUNTRY"
          : draft.surpriseLevel === "reveal_region"
            ? "REVEAL_REGION"
            : "SHOW_THREE_FINALISTS",
  } satisfies Omit<
    TripProfile,
    | "id"
    | "travelerGroupId"
    | "questionnaireVersion"
    | "source"
    | "createdAt"
    | "updatedAt"
  >;
}

export function mapTripProfileToScoring(profile: TripProfile): RecommendationProfile {
  return {
    destinationScope: dbDestinationScopeToProfile[profile.destinationScope],
    tripDurationDays: profile.tripDurationDays,
    totalBudget: profile.totalBudget,
    preferredCurrency: profile.preferredCurrency,
    interests: profile.interests,
    preferredClimate: dbPreferredClimateToScoring[profile.preferredClimate],
    travelPace: dbTravelPaceToProfile[profile.travelPace],
    nightlifePreference: dbPreferenceLevelToProfile[profile.nightlifePreference],
    naturePreference: dbPreferenceLevelToProfile[profile.naturePreference],
    culturalPreference: dbPreferenceLevelToProfile[profile.culturalPreference],
    beachPreference: dbPreferenceLevelToProfile[profile.beachPreference],
    adventurePreference: dbPreferenceLevelToProfile[profile.adventurePreference],
    destinationsVisited: profile.destinationsVisited,
    excludedDestinations: profile.excludedDestinations,
    maximumFlightDurationHours: profile.maximumFlightDurationHours,
    hasPassport: dbPassportToProfile[profile.hasPassport],
    visaRestrictions: profile.visaRestrictions,
    accessibilityRequirements: profile.accessibilityRequirements,
  };
}

export function mapDestinationToScoring(
  destination: Destination & { attributes: DestinationAttribute | null },
): DestinationForScoring | null {
  if (!destination.attributes) {
    return null;
  }

  const destinationScope =
    destination.destinationScope === "OPEN_TO_ANYTHING"
      ? "international"
      : dbDestinationScopeToScoring[destination.destinationScope];

  return {
    id: destination.id,
    slug: destination.slug,
    country: destination.country,
    city: destination.city,
    region: destination.region,
    isDomestic: destination.isDomestic,
    destinationScope,
    budgetTier: dbBudgetTierToScoring[destination.budgetTier],
    minFlightDurationHours: destination.minFlightDurationHours,
    maxFlightDurationHours: destination.maxFlightDurationHours,
    climate: dbPreferredClimateToScoring[destination.climate],
    idealDurationMinDays: destination.idealDurationMinDays,
    idealDurationMaxDays: destination.idealDurationMaxDays,
    interests: destination.interests,
    restrictedConditions: destination.restrictedConditions,
    attributes: {
      beachScore: destination.attributes.beachScore,
      cultureScore: destination.attributes.cultureScore,
      foodScore: destination.attributes.foodScore,
      nightlifeScore: destination.attributes.nightlifeScore,
      natureScore: destination.attributes.natureScore,
      romanceScore: destination.attributes.romanceScore,
      adventureScore: destination.attributes.adventureScore,
      relaxationScore: destination.attributes.relaxationScore,
      logisticsScore: destination.attributes.logisticsScore,
    },
  };
}

