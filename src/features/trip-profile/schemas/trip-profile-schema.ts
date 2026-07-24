import { z } from "zod";
import {
  accommodationPreferenceValues,
  destinationScopeValues,
  passportAvailabilityValues,
  preferenceLevelValues,
  preferredClimateValues,
  preferredCurrencyValues,
  surpriseLevelValues,
  travelPaceValues,
} from "../constants/options";
import type {
  TripProfileDraft,
  TripProfileErrors,
  TripProfileField,
  TripProfileStepId,
} from "../types";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.");

const shortTextSchema = z.string().trim().max(160, "Keep this under 160 characters.");
const notesSchema = z.string().trim().max(700, "Keep this under 700 characters.");

const travelBasicsShape = {
  departureCity: z
    .string()
    .trim()
    .min(2, "Enter your departure city.")
    .max(120, "Keep the city under 120 characters."),
  departureAirport: z
    .string()
    .trim()
    .min(2, "Enter your preferred departure airport.")
    .max(120, "Keep the airport under 120 characters."),
  destinationScope: z.enum(destinationScopeValues),
};

const datesTravelersShape = {
  approximateStartDate: isoDateSchema,
  approximateEndDate: isoDateSchema,
  flexibleDateRange: z.boolean(),
  tripDurationDays: z
    .number()
    .int("Trip duration must be a whole number of days.")
    .min(2, "Choose at least 2 days.")
    .max(30, "Keep the trip at 30 days or fewer."),
  travelerCount: z
    .number()
    .int("Traveler count must be a whole number.")
    .min(1, "Add at least 1 traveler.")
    .max(12, "Use 12 travelers or fewer for this MVP."),
  adultTravelers: z
    .number()
    .int("Adult travelers must be a whole number.")
    .min(1, "At least 1 adult traveler is required.")
    .max(12, "Use 12 adults or fewer for this MVP."),
  childTravelers: z
    .number()
    .int("Child travelers must be a whole number.")
    .min(0, "Child travelers cannot be negative.")
    .max(12, "Use 12 children or fewer for this MVP."),
};

const budgetShape = {
  totalBudget: z
    .number()
    .int("Budget must be a whole number.")
    .min(300, "Enter a budget of at least 300.")
    .max(100000, "Enter a budget under 100,000."),
  preferredCurrency: z.enum(preferredCurrencyValues),
  maximumFlightDurationHours: z
    .number()
    .int("Maximum flight duration must be a whole number.")
    .min(1, "Choose at least 1 hour.")
    .max(24, "Choose 24 hours or fewer."),
};

const preferencesShape = {
  interests: z.array(shortTextSchema).min(1, "Select at least one interest."),
  preferredClimate: z.enum(preferredClimateValues),
  travelPace: z.enum(travelPaceValues),
  accommodationPreference: z.enum(accommodationPreferenceValues),
  foodInterests: z.array(shortTextSchema).min(1, "Select at least one food interest."),
  nightlifePreference: z.enum(preferenceLevelValues),
  naturePreference: z.enum(preferenceLevelValues),
  culturalPreference: z.enum(preferenceLevelValues),
  beachPreference: z.enum(preferenceLevelValues),
  adventurePreference: z.enum(preferenceLevelValues),
};

const restrictionsShape = {
  destinationsVisited: notesSchema,
  excludedDestinations: notesSchema,
  hasPassport: z.enum(passportAvailabilityValues),
  visaRestrictions: notesSchema,
  accessibilityRequirements: notesSchema,
  dietaryRestrictions: notesSchema,
};

const surpriseStyleShape = {
  surpriseLevel: z.enum(surpriseLevelValues),
};

export const DEFAULT_TRIP_PROFILE_DRAFT: TripProfileDraft = {
  departureCity: "",
  departureAirport: "",
  destinationScope: "open_to_anything",
  approximateStartDate: "",
  approximateEndDate: "",
  flexibleDateRange: true,
  tripDurationDays: 4,
  travelerCount: 2,
  adultTravelers: 2,
  childTravelers: 0,
  totalBudget: 1500,
  preferredCurrency: "USD",
  interests: [],
  preferredClimate: "no_preference",
  travelPace: "balanced",
  accommodationPreference: "flexible",
  foodInterests: [],
  nightlifePreference: "moderate",
  naturePreference: "moderate",
  culturalPreference: "moderate",
  beachPreference: "moderate",
  adventurePreference: "moderate",
  destinationsVisited: "",
  excludedDestinations: "",
  maximumFlightDurationHours: 6,
  hasPassport: "not_sure",
  visaRestrictions: "",
  accessibilityRequirements: "",
  dietaryRestrictions: "",
  surpriseLevel: "full_surprise",
};

function addDateAndTravelerIssues(
  draft: Pick<
    TripProfileDraft,
    | "approximateStartDate"
    | "approximateEndDate"
    | "travelerCount"
    | "adultTravelers"
    | "childTravelers"
  >,
  context: z.RefinementCtx,
) {
  const start = Date.parse(`${draft.approximateStartDate}T00:00:00.000Z`);
  const end = Date.parse(`${draft.approximateEndDate}T00:00:00.000Z`);

  if (Number.isFinite(start) && Number.isFinite(end) && end < start) {
    context.addIssue({
      code: "custom",
      path: ["approximateEndDate"],
      message: "End date must be on or after the start date.",
    });
  }

  if (draft.travelerCount !== draft.adultTravelers + draft.childTravelers) {
    context.addIssue({
      code: "custom",
      path: ["travelerCount"],
      message: "Traveler count must equal adults plus children.",
    });
  }
}

export const travelBasicsStepSchema = z.object(travelBasicsShape);

export const datesTravelersStepSchema = z
  .object(datesTravelersShape)
  .superRefine(addDateAndTravelerIssues);

export const budgetStepSchema = z.object(budgetShape);

export const preferencesStepSchema = z.object(preferencesShape);

export const restrictionsStepSchema = z.object(restrictionsShape);

export const surpriseStyleStepSchema = z.object(surpriseStyleShape);

export const tripProfileSchema = z
  .object({
    ...travelBasicsShape,
    ...datesTravelersShape,
    ...budgetShape,
    ...preferencesShape,
    ...restrictionsShape,
    ...surpriseStyleShape,
  })
  .superRefine(addDateAndTravelerIssues);

export const persistedTripProfileDraftSchema = z
  .object({
    departureCity: z.string(),
    departureAirport: z.string(),
    destinationScope: z.enum(destinationScopeValues),
    approximateStartDate: z.string(),
    approximateEndDate: z.string(),
    flexibleDateRange: z.boolean(),
    tripDurationDays: z.number(),
    travelerCount: z.number(),
    adultTravelers: z.number(),
    childTravelers: z.number(),
    totalBudget: z.number(),
    preferredCurrency: z.enum(preferredCurrencyValues),
    interests: z.array(z.string()),
    preferredClimate: z.enum(preferredClimateValues),
    travelPace: z.enum(travelPaceValues),
    accommodationPreference: z.enum(accommodationPreferenceValues),
    foodInterests: z.array(z.string()),
    nightlifePreference: z.enum(preferenceLevelValues),
    naturePreference: z.enum(preferenceLevelValues),
    culturalPreference: z.enum(preferenceLevelValues),
    beachPreference: z.enum(preferenceLevelValues),
    adventurePreference: z.enum(preferenceLevelValues),
    destinationsVisited: z.string(),
    excludedDestinations: z.string(),
    maximumFlightDurationHours: z.number(),
    hasPassport: z.enum(passportAvailabilityValues),
    visaRestrictions: z.string(),
    accessibilityRequirements: z.string(),
    dietaryRestrictions: z.string(),
    surpriseLevel: z.enum(surpriseLevelValues),
  })
  .partial();

const stepSchemas = {
  "travel-basics": travelBasicsStepSchema,
  "dates-travelers": datesTravelersStepSchema,
  budget: budgetStepSchema,
  preferences: preferencesStepSchema,
  restrictions: restrictionsStepSchema,
  "surprise-style": surpriseStyleStepSchema,
  review: tripProfileSchema,
} satisfies Record<TripProfileStepId, z.ZodType>;

export type TripProfileStepValidationResult =
  | { success: true; errors: TripProfileErrors }
  | { success: false; errors: TripProfileErrors };

export type TripProfileValidationResult =
  | { success: true; errors: TripProfileErrors; data: TripProfileDraft }
  | { success: false; errors: TripProfileErrors; data: null };

export function normalizeTripProfileDraft(
  candidate: unknown,
): TripProfileDraft | null {
  const result = persistedTripProfileDraftSchema.safeParse(candidate);

  if (!result.success) {
    return null;
  }

  return {
    ...DEFAULT_TRIP_PROFILE_DRAFT,
    ...result.data,
  };
}

export function formatTripProfileErrors(error: z.ZodError): TripProfileErrors {
  const errors: TripProfileErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      Object.prototype.hasOwnProperty.call(DEFAULT_TRIP_PROFILE_DRAFT, field)
    ) {
      const typedField = field as TripProfileField;
      errors[typedField] ??= issue.message;
    }
  }

  return errors;
}

export function validateTripProfileStep(
  stepId: TripProfileStepId,
  draft: TripProfileDraft,
): TripProfileStepValidationResult {
  const result = stepSchemas[stepId].safeParse(draft);

  if (result.success) {
    return {
      success: true as const,
      errors: {},
    };
  }

  return {
    success: false as const,
    errors: formatTripProfileErrors(result.error),
  };
}

export function validateTripProfile(
  draft: TripProfileDraft,
): TripProfileValidationResult {
  const result = tripProfileSchema.safeParse(draft);

  if (result.success) {
    return {
      success: true as const,
      errors: {},
      data: result.data,
    };
  }

  return {
    success: false as const,
    errors: formatTripProfileErrors(result.error),
    data: null,
  };
}
