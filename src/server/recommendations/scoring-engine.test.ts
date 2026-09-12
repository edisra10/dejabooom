import { describe, expect, it } from "vitest";
import { scoreDestinations } from "./scoring-engine";
import type {
  DestinationForScoring,
  RecommendationProfile,
} from "./scoring-types";

const profile: RecommendationProfile = {
  destinationScope: "mexico",
  tripDurationDays: 5,
  totalBudget: 1800,
  preferredCurrency: "USD",
  interests: ["Food", "Nature"],
  preferredClimate: "warm",
  travelPace: "balanced",
  nightlifePreference: "moderate",
  naturePreference: "high",
  culturalPreference: "moderate",
  beachPreference: "high",
  adventurePreference: "moderate",
  destinationsVisited: "Mexico City",
  excludedDestinations: "",
  maximumFlightDurationHours: 6,
  hasPassport: "no",
  visaRestrictions: "",
  accessibilityRequirements: "",
};

const warmBeach: DestinationForScoring = {
  id: "beach",
  slug: "bacalar",
  country: "Mexico",
  city: "Bacalar",
  region: "Quintana Roo",
  isDomestic: true,
  destinationScope: "mexico",
  budgetTier: "mid",
  minFlightDurationHours: 2,
  maxFlightDurationHours: 5,
  climate: "warm",
  idealDurationMinDays: 3,
  idealDurationMaxDays: 7,
  interests: ["Nature", "Beach time", "Food"],
  restrictedConditions: [],
  attributes: {
    beachScore: 9,
    cultureScore: 6,
    foodScore: 7,
    nightlifeScore: 3,
    natureScore: 10,
    romanceScore: 8,
    adventureScore: 6,
    relaxationScore: 10,
    logisticsScore: 8,
  },
};

const internationalCity: DestinationForScoring = {
  id: "international",
  slug: "new-orleans",
  country: "United States",
  city: "New Orleans",
  region: "Louisiana",
  isDomestic: false,
  destinationScope: "north_america",
  budgetTier: "high",
  minFlightDurationHours: 3,
  maxFlightDurationHours: 8,
  climate: "warm",
  idealDurationMinDays: 3,
  idealDurationMaxDays: 6,
  interests: ["Food", "Nightlife", "History"],
  restrictedConditions: [],
  attributes: {
    beachScore: 1,
    cultureScore: 9,
    foodScore: 10,
    nightlifeScore: 10,
    natureScore: 4,
    romanceScore: 7,
    adventureScore: 5,
    relaxationScore: 5,
    logisticsScore: 8,
  },
};

describe("scoreDestinations", () => {
  it("hard-filters destinations outside scope and passport constraints", () => {
    const result = scoreDestinations(profile, [warmBeach, internationalCity]);

    expect(result.selectedDestination?.destination.slug).toBe("bacalar");
    expect(result.allCandidates[1].passedHardFilters).toBe(false);
    expect(result.allCandidates[1].hardFilterReasons).toContain(
      "Destination does not match the requested destination scope.",
    );
    expect(result.allCandidates[1].hardFilterReasons).toContain(
      "Traveler does not have a passport for an international option.",
    );
  });

  it("hard-filters explicit excluded destinations", () => {
    const result = scoreDestinations(
      {
        ...profile,
        excludedDestinations: "Bacalar",
      },
      [warmBeach],
    );

    expect(result.selectedDestination).toBeNull();
    expect(result.allCandidates[0].hardFilterReasons).toContain(
      "Destination was explicitly excluded by the traveler.",
    );
  });

  it("returns top three eligible candidates ordered by score", () => {
    const result = scoreDestinations(
      {
        ...profile,
        hasPassport: "yes",
        destinationScope: "open_to_anything",
      },
      [
        warmBeach,
        {
          ...warmBeach,
          id: "culture",
          slug: "oaxaca",
          city: "Oaxaca",
          attributes: {
            ...warmBeach.attributes,
            beachScore: 1,
            cultureScore: 10,
            natureScore: 5,
          },
        },
        {
          ...warmBeach,
          id: "nightlife",
          slug: "cancun",
          city: "Cancun",
          attributes: {
            ...warmBeach.attributes,
            nightlifeScore: 9,
            logisticsScore: 10,
          },
        },
        internationalCity,
      ],
    );

    expect(result.topThreeCandidates).toHaveLength(3);
    expect(result.topThreeCandidates[0].totalScore).toBeGreaterThanOrEqual(
      result.topThreeCandidates[1].totalScore,
    );
  });
});

