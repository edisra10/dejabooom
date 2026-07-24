"use client";

import { preferredCurrencyOptions } from "../constants/options";
import { NumberField, SelectField } from "./form-controls";
import type { TripProfileStepComponentProps } from "./questionnaire-types";

export function BudgetStep({
  draft,
  errors,
  updateField,
}: TripProfileStepComponentProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <NumberField
        id="totalBudget"
        label="Total trip budget"
        value={draft.totalBudget}
        min={300}
        max={100000}
        error={errors.totalBudget}
        onChange={(value) => updateField("totalBudget", value)}
      />
      <SelectField
        id="preferredCurrency"
        label="Preferred currency"
        value={draft.preferredCurrency}
        options={preferredCurrencyOptions}
        error={errors.preferredCurrency}
        onChange={(value) => updateField("preferredCurrency", value)}
      />
      <NumberField
        id="maximumFlightDurationHours"
        label="Maximum flight duration"
        value={draft.maximumFlightDurationHours}
        min={1}
        max={24}
        error={errors.maximumFlightDurationHours}
        onChange={(value) => updateField("maximumFlightDurationHours", value)}
      />
    </div>
  );
}

