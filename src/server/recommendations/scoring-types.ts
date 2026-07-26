import type {
  DestinationScope,
  PassportAvailability,
  PreferenceLevel,
  PreferredClimate,
  PreferredCurrency,
  TravelPace,
} from "@/features/trip-profile/types";

export type RecommendationBudgetTier = "low" | "mid" | "high" | "luxury";

export interface RecommendationProfile {
  destinationScope: DestinationScope;
  tripDurationDays: number;
  totalBudget: number;
  preferredCurrency: PreferredCurrency;
  interests: string[];
  preferredClimate: PreferredClimate;
  travelPace: TravelPace;
  nightlifePreference: PreferenceLevel;
  naturePreference: PreferenceLevel;
  culturalPreference: PreferenceLevel;
  beachPreference: PreferenceLevel;
  adventurePreference: PreferenceLevel;
  destinationsVisited: string;
  excludedDestinations: string;
  maximumFlightDurationHours: number;
  hasPassport: PassportAvailability;
  visaRestrictions: string;
  accessibilityRequirements: string;
}

export interface DestinationAttributesForScoring {
  beachScore: number;
  cultureScore: number;
  foodScore: number;
  nightlifeScore: number;
  natureScore: number;
  romanceScore: number;
  adventureScore: number;
  relaxationScore: number;
  logisticsScore: number;
}

export interface DestinationForScoring {
  id: string;
  slug: string;
  country: string;
  city: string;
  region: string;
  isDomestic: boolean;
  destinationScope: "mexico" | "north_america" | "international";
  budgetTier: RecommendationBudgetTier;
  minFlightDurationHours: number;
  maxFlightDurationHours: number;
  climate: PreferredClimate;
  idealDurationMinDays: number;
  idealDurationMaxDays: number;
  interests: string[];
  restrictedConditions: string[];
  attributes: DestinationAttributesForScoring;
}

export interface ScoringWeights {
  interestMatch: number;
  budgetFit: number;
  travelStyleMatch: number;
  novelty: number;
  logistics: number;
  climateMatch: number;
  durationFit: number;
}

export interface DestinationScoreBreakdown {
  interestMatch: number;
  budgetFit: number;
  travelStyleMatch: number;
  novelty: number;
  logistics: number;
  climateMatch: number;
  durationFit: number;
}

export interface ScoredDestination {
  destination: DestinationForScoring;
  totalScore: number;
  breakdown: DestinationScoreBreakdown;
  hardFilterReasons: string[];
  passedHardFilters: boolean;
}

export interface RecommendationEngineResult {
  allCandidates: ScoredDestination[];
  eligibleCandidates: ScoredDestination[];
  topThreeCandidates: ScoredDestination[];
  selectedDestination: ScoredDestination | null;
}

