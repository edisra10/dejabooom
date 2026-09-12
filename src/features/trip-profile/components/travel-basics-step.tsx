"use client";

import {
  destinationScopeOptions,
} from "../constants/options";
import { ChoiceGroup, TextField } from "./form-controls";
import type { TripProfileStepComponentProps } from "./questionnaire-types";

export function TravelBasicsStep({
  draft,
  errors,
  updateField,
}: TripProfileStepComponentProps) {
  return (
    <div className="space-y-6">
      <TextField
        id="contactEmail"
        label="Contact email"
        value={draft.contactEmail}
        error={errors.contactEmail}
        placeholder="you@example.com"
        autoComplete="email"
        onChange={(value) => updateField("contactEmail", value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          id="departureCity"
          label="Departure city"
          value={draft.departureCity}
          error={errors.departureCity}
          placeholder="Mexico City"
          autoComplete="address-level2"
          onChange={(value) => updateField("departureCity", value)}
        />
        <TextField
          id="departureAirport"
          label="Preferred departure airport"
          value={draft.departureAirport}
          error={errors.departureAirport}
          placeholder="MEX, AICM, or Felipe Angeles"
          autoComplete="off"
          onChange={(value) => updateField("departureAirport", value)}
        />
      </div>

      <ChoiceGroup
        name="destinationScope"
        label="Destination scope"
        value={draft.destinationScope}
        options={destinationScopeOptions}
        error={errors.destinationScope}
        columns="four"
        onChange={(value) => updateField("destinationScope", value)}
      />
    </div>
  );
}

