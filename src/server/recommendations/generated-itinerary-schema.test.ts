import { describe, expect, it } from "vitest";
import { getGeneratedItinerarySchema } from "./generated-itinerary-schema";

function itineraryFor(days: number) {
  return {
    travelerProfileSummary: "A traveler who values food, culture, and a relaxed pace.",
    matchExplanation: "This destination fits the stated interests, timing, and budget.",
    tripTheme: "A relaxed cultural escape",
    itinerary: Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title: `Day ${index + 1} exploration`,
      morning: "Start with a calm neighborhood walk and a local breakfast.",
      afternoon: "Visit a cultural landmark and leave room for spontaneous stops.",
      evening: "Choose a local restaurant and enjoy an unhurried evening.",
      surpriseClue: "Listen for the sounds that define this place.",
    })),
    restaurantAndActivityCategories: ["Local food", "Museums", "Walking tours"],
    packingSuggestions: ["Comfortable shoes", "Light layer", "Day bag", "Water bottle"],
    revealNarrative: "Your destination brings together the experiences you value most.",
    clues: ["A regional flavor", "A historic center", "A memorable evening"],
    budgetGuidance: "Use the stated budget as a planning range and verify current prices.",
    importantNotes: ["Verify entry rules", "Check current prices", "Book externally"],
  };
}

describe("generated itinerary duration", () => {
  it("requires one itinerary entry for every requested trip day", () => {
    const schema = getGeneratedItinerarySchema(4);

    expect(schema.safeParse(itineraryFor(4)).success).toBe(true);
    expect(schema.safeParse(itineraryFor(3)).success).toBe(false);
  });

  it("rejects durations outside the launch range", () => {
    expect(() => getGeneratedItinerarySchema(1)).toThrow();
    expect(() => getGeneratedItinerarySchema(6)).toThrow();
  });
});
