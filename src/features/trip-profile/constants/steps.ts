import type { TripProfileField, TripProfileStepId } from "../types";

export interface TripProfileStep {
  id: TripProfileStepId;
  label: string;
  shortLabel: string;
}

export const tripProfileSteps: TripProfileStep[] = [
  {
    id: "travel-basics",
    label: "Starting point",
    shortLabel: "Start",
  },
  {
    id: "dates-travelers",
    label: "Dates and travelers",
    shortLabel: "Dates",
  },
  {
    id: "budget",
    label: "Budget",
    shortLabel: "Budget",
  },
  {
    id: "preferences",
    label: "Travel style",
    shortLabel: "Style",
  },
  {
    id: "restrictions",
    label: "Restrictions",
    shortLabel: "Needs",
  },
  {
    id: "surprise-style",
    label: "Reveal style",
    shortLabel: "Reveal",
  },
  {
    id: "review",
    label: "Review",
    shortLabel: "Review",
  },
];

export const tripProfileStepFields: Record<TripProfileStepId, TripProfileField[]> = {
  "travel-basics": [
    "contactEmail",
    "departureCity",
    "departureAirport",
    "destinationScope",
  ],
  "dates-travelers": [
    "approximateStartDate",
    "approximateEndDate",
    "flexibleDateRange",
    "tripDurationDays",
    "travelerCount",
    "adultTravelers",
    "childTravelers",
  ],
  budget: ["totalBudget", "preferredCurrency", "maximumFlightDurationHours"],
  preferences: [
    "interests",
    "preferredClimate",
    "travelPace",
    "accommodationPreference",
    "foodInterests",
    "nightlifePreference",
    "naturePreference",
    "culturalPreference",
    "beachPreference",
    "adventurePreference",
  ],
  restrictions: [
    "destinationsVisited",
    "excludedDestinations",
    "hasPassport",
    "visaRestrictions",
    "accessibilityRequirements",
    "dietaryRestrictions",
  ],
  "surprise-style": ["surpriseLevel"],
  review: [],
};

export function getTripProfileStepIndex(stepId: TripProfileStepId) {
  return tripProfileSteps.findIndex((step) => step.id === stepId);
}

export function getTripProfileProgress(stepId: TripProfileStepId) {
  const index = getTripProfileStepIndex(stepId);
  const safeIndex = index >= 0 ? index : 0;
  const currentStep = safeIndex + 1;
  const totalSteps = tripProfileSteps.length;

  return {
    currentStep,
    totalSteps,
    percent: Math.round((currentStep / totalSteps) * 100),
  };
}

export function getNextTripProfileStepId(stepId: TripProfileStepId) {
  const index = getTripProfileStepIndex(stepId);
  return tripProfileSteps[Math.min(index + 1, tripProfileSteps.length - 1)].id;
}

export function getPreviousTripProfileStepId(stepId: TripProfileStepId) {
  const index = getTripProfileStepIndex(stepId);
  return tripProfileSteps[Math.max(index - 1, 0)].id;
}

export function isFirstTripProfileStep(stepId: TripProfileStepId) {
  return getTripProfileStepIndex(stepId) === 0;
}

export function isFinalTripProfileStep(stepId: TripProfileStepId) {
  return stepId === "review";
}

