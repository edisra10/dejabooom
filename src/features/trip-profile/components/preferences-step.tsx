"use client";

import {
  accommodationPreferenceOptions,
  foodInterestOptions,
  interestOptions,
  preferenceLevelOptions,
  preferredClimateOptions,
  travelPaceOptions,
} from "../constants/options";
import { CheckboxGroup, ChoiceGroup } from "./form-controls";
import type { TripProfileStepComponentProps } from "./questionnaire-types";

export function PreferencesStep({
  draft,
  errors,
  updateField,
  toggleArrayValue,
}: TripProfileStepComponentProps) {
  return (
    <div className="space-y-7">
      <CheckboxGroup
        name="interests"
        label="Interests"
        values={draft.interests}
        options={interestOptions}
        error={errors.interests}
        onToggle={(value) => toggleArrayValue("interests", value)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChoiceGroup
          name="preferredClimate"
          label="Preferred climate"
          value={draft.preferredClimate}
          options={preferredClimateOptions}
          error={errors.preferredClimate}
          onChange={(value) => updateField("preferredClimate", value)}
        />
        <ChoiceGroup
          name="travelPace"
          label="Travel pace"
          value={draft.travelPace}
          options={travelPaceOptions}
          error={errors.travelPace}
          onChange={(value) => updateField("travelPace", value)}
        />
      </div>

      <ChoiceGroup
        name="accommodationPreference"
        label="Accommodation preference"
        value={draft.accommodationPreference}
        options={accommodationPreferenceOptions}
        error={errors.accommodationPreference}
        columns="four"
        onChange={(value) => updateField("accommodationPreference", value)}
      />

      <CheckboxGroup
        name="foodInterests"
        label="Food interests"
        values={draft.foodInterests}
        options={foodInterestOptions}
        error={errors.foodInterests}
        onToggle={(value) => toggleArrayValue("foodInterests", value)}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChoiceGroup
          name="nightlifePreference"
          label="Nightlife preference"
          value={draft.nightlifePreference}
          options={preferenceLevelOptions}
          error={errors.nightlifePreference}
          onChange={(value) => updateField("nightlifePreference", value)}
        />
        <ChoiceGroup
          name="naturePreference"
          label="Nature preference"
          value={draft.naturePreference}
          options={preferenceLevelOptions}
          error={errors.naturePreference}
          onChange={(value) => updateField("naturePreference", value)}
        />
        <ChoiceGroup
          name="culturalPreference"
          label="Cultural preference"
          value={draft.culturalPreference}
          options={preferenceLevelOptions}
          error={errors.culturalPreference}
          onChange={(value) => updateField("culturalPreference", value)}
        />
        <ChoiceGroup
          name="beachPreference"
          label="Beach preference"
          value={draft.beachPreference}
          options={preferenceLevelOptions}
          error={errors.beachPreference}
          onChange={(value) => updateField("beachPreference", value)}
        />
        <ChoiceGroup
          name="adventurePreference"
          label="Adventure preference"
          value={draft.adventurePreference}
          options={preferenceLevelOptions}
          error={errors.adventurePreference}
          onChange={(value) => updateField("adventurePreference", value)}
        />
      </div>
    </div>
  );
}

