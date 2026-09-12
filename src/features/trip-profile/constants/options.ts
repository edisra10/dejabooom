import type {
  AccommodationPreference,
  DestinationScope,
  PassportAvailability,
  PreferenceLevel,
  PreferredClimate,
  PreferredCurrency,
  SurpriseLevel,
  TravelPace,
  TripProfileOption,
} from "../types";

export const destinationScopeValues = [
  "mexico",
  "north_america",
  "international",
  "open_to_anything",
] as const;

export const preferredCurrencyValues = ["USD", "MXN", "EUR"] as const;

export const preferredClimateValues = [
  "warm",
  "mild",
  "cool",
  "varied",
  "no_preference",
] as const;

export const travelPaceValues = ["slow", "balanced", "packed"] as const;

export const accommodationPreferenceValues = [
  "boutique",
  "comfort",
  "luxury",
  "local_stay",
  "flexible",
] as const;

export const preferenceLevelValues = ["low", "moderate", "high"] as const;

export const passportAvailabilityValues = ["yes", "no", "not_sure"] as const;

export const surpriseLevelValues = [
  "full_surprise",
  "reveal_country",
  "reveal_region",
] as const;

export const destinationScopeOptions: TripProfileOption<DestinationScope>[] = [
  {
    value: "mexico",
    label: "Mexico",
    description: "Keep the surprise focused on Mexican destinations.",
  },
  {
    value: "north_america",
    label: "North America",
    description: "Consider Mexico, the United States, Canada, and nearby regions.",
  },
  {
    value: "international",
    label: "International",
    description: "Include longer-haul options when they fit your profile.",
  },
  {
    value: "open_to_anything",
    label: "Open to anything",
    description: "Let Dejabooom choose from the broadest set of matches.",
  },
];

export const preferredCurrencyOptions: TripProfileOption<PreferredCurrency>[] = [
  { value: "USD", label: "USD" },
  { value: "MXN", label: "MXN" },
  { value: "EUR", label: "EUR" },
];

export const preferredClimateOptions: TripProfileOption<PreferredClimate>[] = [
  { value: "warm", label: "Warm" },
  { value: "mild", label: "Mild" },
  { value: "cool", label: "Cool" },
  { value: "varied", label: "Varied" },
  { value: "no_preference", label: "No preference" },
];

export const travelPaceOptions: TripProfileOption<TravelPace>[] = [
  { value: "slow", label: "Slow", description: "More downtime and fewer moves." },
  {
    value: "balanced",
    label: "Balanced",
    description: "A mix of anchors, flexibility, and room to wander.",
  },
  {
    value: "packed",
    label: "Packed",
    description: "Full days, more activities, and a faster rhythm.",
  },
];

export const accommodationPreferenceOptions: TripProfileOption<AccommodationPreference>[] =
  [
    { value: "boutique", label: "Boutique" },
    { value: "comfort", label: "Comfort-focused" },
    { value: "luxury", label: "Luxury" },
    { value: "local_stay", label: "Local stay" },
    { value: "flexible", label: "Flexible" },
  ];

export const preferenceLevelOptions: TripProfileOption<PreferenceLevel>[] = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

export const passportAvailabilityOptions: TripProfileOption<PassportAvailability>[] =
  [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "Not sure" },
  ];

export const surpriseLevelOptionsList: TripProfileOption<SurpriseLevel>[] = [
  {
    value: "full_surprise",
    label: "Full surprise",
    description: "Keep the destination hidden until the reveal moment.",
  },
  {
    value: "reveal_country",
    label: "Reveal country only",
    description: "Share the country while keeping the city or region hidden.",
  },
  {
    value: "reveal_region",
    label: "Reveal region only",
    description: "Give a broad regional hint before the final reveal.",
  },
];

export const interestOptions = [
  "Architecture",
  "Art",
  "Beach time",
  "Design hotels",
  "Food",
  "History",
  "Local festivals",
  "Museums",
  "Nature",
  "Photography",
  "Shopping",
  "Wellness",
] as const;

export const foodInterestOptions = [
  "Street food",
  "Fine dining",
  "Markets",
  "Coffee",
  "Wine and spirits",
  "Vegetarian-friendly",
  "Local classics",
  "Cooking classes",
] as const;

