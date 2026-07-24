"use client";

import { surpriseLevelOptionsList } from "../constants/options";
import { ChoiceGroup } from "./form-controls";
import type { TripProfileStepComponentProps } from "./questionnaire-types";

export function SurpriseStyleStep({
  draft,
  errors,
  updateField,
}: TripProfileStepComponentProps) {
  return (
    <ChoiceGroup
      name="surpriseLevel"
      label="Preferred surprise level"
      value={draft.surpriseLevel}
      options={surpriseLevelOptionsList}
      error={errors.surpriseLevel}
      columns="four"
      onChange={(value) => updateField("surpriseLevel", value)}
    />
  );
}

