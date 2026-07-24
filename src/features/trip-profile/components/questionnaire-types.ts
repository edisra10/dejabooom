import type {
  TripProfileDraft,
  TripProfileErrors,
  TripProfileField,
} from "../types";

export type UpdateTripProfileField = <TField extends TripProfileField>(
  field: TField,
  value: TripProfileDraft[TField],
) => void;

export type TripProfileArrayField = "interests" | "foodInterests";

export type ToggleTripProfileArrayValue = (
  field: TripProfileArrayField,
  value: string,
) => void;

export interface TripProfileStepComponentProps {
  draft: TripProfileDraft;
  errors: TripProfileErrors;
  updateField: UpdateTripProfileField;
  toggleArrayValue: ToggleTripProfileArrayValue;
}

