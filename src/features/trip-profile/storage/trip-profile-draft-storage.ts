import {
  DEFAULT_TRIP_PROFILE_DRAFT,
  normalizeTripProfileDraft,
} from "../schemas/trip-profile-schema";
import type { TripProfileDraft } from "../types";

export const TRIP_PROFILE_DRAFT_STORAGE_KEY =
  "dejabooom.trip-profile.draft.v1";

const TRIP_PROFILE_DRAFT_STORAGE_VERSION = 1;

export interface TripProfileDraftStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface PersistedTripProfileDraft {
  version: number;
  draft: TripProfileDraft;
}

function getBrowserStorage(): TripProfileDraftStorageAdapter | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function serializeTripProfileDraft(draft: TripProfileDraft) {
  const persistedDraft: PersistedTripProfileDraft = {
    version: TRIP_PROFILE_DRAFT_STORAGE_VERSION,
    draft,
  };

  return JSON.stringify(persistedDraft);
}

export function deserializeTripProfileDraft(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<PersistedTripProfileDraft>;
    const normalizedDraft = normalizeTripProfileDraft(parsed.draft);
    return normalizedDraft;
  } catch {
    return null;
  }
}

export function loadTripProfileDraft(
  storage: TripProfileDraftStorageAdapter | null = getBrowserStorage(),
) {
  if (!storage) {
    return DEFAULT_TRIP_PROFILE_DRAFT;
  }

  return (
    deserializeTripProfileDraft(storage.getItem(TRIP_PROFILE_DRAFT_STORAGE_KEY)) ??
    DEFAULT_TRIP_PROFILE_DRAFT
  );
}

export function saveTripProfileDraft(
  draft: TripProfileDraft,
  storage: TripProfileDraftStorageAdapter | null = getBrowserStorage(),
) {
  if (!storage) {
    return false;
  }

  storage.setItem(TRIP_PROFILE_DRAFT_STORAGE_KEY, serializeTripProfileDraft(draft));
  return true;
}

export function clearTripProfileDraft(
  storage: TripProfileDraftStorageAdapter | null = getBrowserStorage(),
) {
  if (!storage) {
    return false;
  }

  storage.removeItem(TRIP_PROFILE_DRAFT_STORAGE_KEY);
  return true;
}

