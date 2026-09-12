import { z } from "zod";

export const generatedItineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(3).max(120),
  morning: z.string().min(10).max(700),
  afternoon: z.string().min(10).max(700),
  evening: z.string().min(10).max(700),
  surpriseClue: z.string().min(5).max(240),
});

const generatedItineraryShape = {
  travelerProfileSummary: z.string().min(20).max(1200),
  matchExplanation: z.string().min(20).max(1600),
  tripTheme: z.string().min(5).max(160),
  restaurantAndActivityCategories: z.array(z.string().min(2).max(120)).min(3).max(10),
  packingSuggestions: z.array(z.string().min(2).max(160)).min(4).max(12),
  revealNarrative: z.string().min(20).max(1600),
  clues: z.array(z.string().min(5).max(220)).min(3).max(8),
  budgetGuidance: z.string().min(20).max(1000),
  importantNotes: z.array(z.string().min(5).max(240)).min(3).max(8),
};

export const generatedItinerarySchema = z.object({
  ...generatedItineraryShape,
  itinerary: z.array(generatedItineraryDaySchema).min(2).max(5),
});

export function getGeneratedItinerarySchema(tripDurationDays: number) {
  if (!Number.isInteger(tripDurationDays) || tripDurationDays < 2 || tripDurationDays > 5) {
    throw new Error("Trip duration must be between 2 and 5 days.");
  }

  return z.object({
    ...generatedItineraryShape,
    itinerary: z.array(generatedItineraryDaySchema).length(tripDurationDays),
  });
}

export type GeneratedItineraryContent = z.infer<typeof generatedItinerarySchema>;
