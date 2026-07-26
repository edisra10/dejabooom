export type DestinationScope =
  | "mexico"
  | "north_america"
  | "international"
  | "open_to_anything";

export type PreferredCurrency = "USD" | "MXN" | "EUR";

export type PreferredClimate =
  | "warm"
  | "mild"
  | "cool"
  | "varied"
  | "no_preference";

export type TravelPace = "slow" | "balanced" | "packed";

export type AccommodationPreference =
  | "boutique"
  | "comfort"
  | "luxury"
  | "local_stay"
  | "flexible";

export type PreferenceLevel = "low" | "moderate" | "high";

export type PassportAvailability = "yes" | "no" | "not_sure";

export type SurpriseLevel =
  | "full_surprise"
  | "reveal_country"
  | "reveal_region"
  | "show_three_finalists";

export interface TripProfileDraft {
  contactEmail: string;
  departureCity: string;
  departureAirport: string;
  destinationScope: DestinationScope;
  approximateStartDate: string;
  approximateEndDate: string;
  flexibleDateRange: boolean;
  tripDurationDays: number;
  travelerCount: number;
  adultTravelers: number;
  childTravelers: number;
  totalBudget: number;
  preferredCurrency: PreferredCurrency;
  interests: string[];
  preferredClimate: PreferredClimate;
  travelPace: TravelPace;
  accommodationPreference: AccommodationPreference;
  foodInterests: string[];
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
  dietaryRestrictions: string;
  surpriseLevel: SurpriseLevel;
}

export type TripProfileField = keyof TripProfileDraft;

export type TripProfileErrors = Partial<Record<TripProfileField, string>>;

export type TripProfileStepId =
  | "travel-basics"
  | "dates-travelers"
  | "budget"
  | "preferences"
  | "restrictions"
  | "surprise-style"
  | "review";

export interface TripProfileOption<TValue extends string = string> {
  value: TValue;
  label: string;
  description?: string;
}

