import { describe, expect, it } from "vitest";
import {
  DEFAULT_TRIP_PROFILE_DRAFT,
  validateTripProfile,
  validateTripProfileStep,
} from "./trip-profile-schema";
import type { TripProfileDraft } from "../types";

const validDraft: TripProfileDraft = {
  ...DEFAULT_TRIP_PROFILE_DRAFT,
  departureCity: "Mexico City",
  departureAirport: "MEX",
  approximateStartDate: "2026-10-10",
  approximateEndDate: "2026-10-15",
  tripDurationDays: 5,
  travelerCount: 3,
  adultTravelers: 2,
  childTravelers: 1,
  totalBudget: 2500,
  interests: ["Food", "Nature"],
  foodInterests: ["Street food"],
};

describe("trip profile validation", () => {
  it("requires departure city and airport before leaving travel basics", () => {
    const result = validateTripProfileStep(
      "travel-basics",
      DEFAULT_TRIP_PROFILE_DRAFT,
    );

    expect(result.success).toBe(false);
    expect(result.errors.departureCity).toBe("Enter your departure city.");
    expect(result.errors.departureAirport).toBe(
      "Enter your preferred departure airport.",
    );
  });

  it("rejects budgets below the MVP minimum", () => {
    const result = validateTripProfileStep("budget", {
      ...validDraft,
      totalBudget: 299,
    });

    expect(result.success).toBe(false);
    expect(result.errors.totalBudget).toBe("Enter a budget of at least 300.");
  });

  it("rejects date ranges that end before they start", () => {
    const result = validateTripProfileStep("dates-travelers", {
      ...validDraft,
      approximateStartDate: "2026-10-15",
      approximateEndDate: "2026-10-10",
    });

    expect(result.success).toBe(false);
    expect(result.errors.approximateEndDate).toBe(
      "End date must be on or after the start date.",
    );
  });

  it("requires traveler count to equal adults plus children", () => {
    const result = validateTripProfileStep("dates-travelers", {
      ...validDraft,
      travelerCount: 4,
      adultTravelers: 2,
      childTravelers: 1,
    });

    expect(result.success).toBe(false);
    expect(result.errors.travelerCount).toBe(
      "Traveler count must equal adults plus children.",
    );
  });

  it("accepts a complete profile draft", () => {
    const result = validateTripProfile(validDraft);

    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });
});

