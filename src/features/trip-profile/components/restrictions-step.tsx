"use client";

import { passportAvailabilityOptions } from "../constants/options";
import { ChoiceGroup, TextAreaField } from "./form-controls";
import type { TripProfileStepComponentProps } from "./questionnaire-types";

export function RestrictionsStep({
  draft,
  errors,
  updateField,
}: TripProfileStepComponentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextAreaField
          id="destinationsVisited"
          label="Destinations already visited"
          value={draft.destinationsVisited}
          error={errors.destinationsVisited}
          placeholder="Cities, countries, or regions you have already explored."
          onChange={(value) => updateField("destinationsVisited", value)}
        />
        <TextAreaField
          id="excludedDestinations"
          label="Excluded destinations"
          value={draft.excludedDestinations}
          error={errors.excludedDestinations}
          placeholder="Places you do not want included in the match."
          onChange={(value) => updateField("excludedDestinations", value)}
        />
      </div>

      <ChoiceGroup
        name="hasPassport"
        label="Passport availability"
        value={draft.hasPassport}
        options={passportAvailabilityOptions}
        error={errors.hasPassport}
        onChange={(value) => updateField("hasPassport", value)}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <TextAreaField
          id="visaRestrictions"
          label="Visa restrictions"
          value={draft.visaRestrictions}
          error={errors.visaRestrictions}
          placeholder="Countries or rules that affect where you can travel."
          onChange={(value) => updateField("visaRestrictions", value)}
        />
        <TextAreaField
          id="accessibilityRequirements"
          label="Accessibility requirements"
          value={draft.accessibilityRequirements}
          error={errors.accessibilityRequirements}
          placeholder="Mobility, sensory, or planning needs to account for."
          onChange={(value) => updateField("accessibilityRequirements", value)}
        />
        <TextAreaField
          id="dietaryRestrictions"
          label="Dietary restrictions"
          value={draft.dietaryRestrictions}
          error={errors.dietaryRestrictions}
          placeholder="Allergies, dietary needs, or food restrictions."
          onChange={(value) => updateField("dietaryRestrictions", value)}
        />
      </div>
    </div>
  );
}

