import { describe, expect, it } from "vitest";
import { DEFAULT_TRIP_PROFILE_DRAFT } from "../schemas/trip-profile-schema";
import type { TripProfileDraft } from "../types";
import {
  TRIP_PROFILE_DRAFT_STORAGE_KEY,
  deserializeTripProfileDraft,
  loadTripProfileDraft,
  saveTripProfileDraft,
  serializeTripProfileDraft,
  type TripProfileDraftStorageAdapter,
} from "./trip-profile-draft-storage";

class MemoryStorage implements TripProfileDraftStorageAdapter {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const validDraft: TripProfileDraft = {
  ...DEFAULT_TRIP_PROFILE_DRAFT,
  contactEmail: "traveler@example.com",
  departureCity: "Guadalajara",
  departureAirport: "GDL",
  approximateStartDate: "2026-11-05",
  approximateEndDate: "2026-11-09",
  interests: ["Architecture"],
  foodInterests: ["Markets"],
};

describe("trip profile draft storage", () => {
  it("serializes and deserializes the local draft format", () => {
    const serialized = serializeTripProfileDraft(validDraft);
    const parsed = JSON.parse(serialized) as { draft: Record<string, unknown> };

    expect(parsed.draft.cardNumber).toBeUndefined();
    expect(parsed.draft.cvv).toBeUndefined();
    expect(parsed.draft.passportNumber).toBeUndefined();
    expect(deserializeTripProfileDraft(serialized)).toEqual(validDraft);
  });

  it("loads a saved draft from the provided storage adapter", () => {
    const storage = new MemoryStorage();

    expect(saveTripProfileDraft(validDraft, storage)).toBe(true);
    expect(storage.getItem(TRIP_PROFILE_DRAFT_STORAGE_KEY)).not.toBeNull();
    expect(loadTripProfileDraft(storage)).toEqual(validDraft);
  });

  it("falls back to the default draft for malformed storage values", () => {
    const storage = new MemoryStorage();
    storage.setItem(TRIP_PROFILE_DRAFT_STORAGE_KEY, "{not valid json");

    expect(loadTripProfileDraft(storage)).toEqual(DEFAULT_TRIP_PROFILE_DRAFT);
  });
});

