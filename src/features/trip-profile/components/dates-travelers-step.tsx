"use client";

import { DateField, NumberField } from "./form-controls";
import type { TripProfileStepComponentProps } from "./questionnaire-types";

export function DatesTravelersStep({
  draft,
  errors,
  updateField,
}: TripProfileStepComponentProps) {
  const updateAdultTravelers = (adultTravelers: number) => {
    updateField("adultTravelers", adultTravelers);
    updateField("travelerCount", adultTravelers + draft.childTravelers);
  };

  const updateChildTravelers = (childTravelers: number) => {
    updateField("childTravelers", childTravelers);
    updateField("travelerCount", draft.adultTravelers + childTravelers);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <DateField
          id="approximateStartDate"
          label="Approximate start date"
          value={draft.approximateStartDate}
          error={errors.approximateStartDate}
          onChange={(value) => updateField("approximateStartDate", value)}
        />
        <DateField
          id="approximateEndDate"
          label="Approximate end date"
          value={draft.approximateEndDate}
          error={errors.approximateEndDate}
          onChange={(value) => updateField("approximateEndDate", value)}
        />
      </div>

      <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <input
          type="checkbox"
          checked={draft.flexibleDateRange}
          className="mt-1"
          onChange={(event) =>
            updateField("flexibleDateRange", event.target.checked)
          }
        />
        <span>
          <span className="block font-semibold">Flexible dates</span>
          <span className="mt-1 block text-slate-500">
            The trip can shift within a nearby date range if that creates a better
            match.
          </span>
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NumberField
          id="tripDurationDays"
          label="Trip duration in days"
          value={draft.tripDurationDays}
          min={2}
          max={5}
          error={errors.tripDurationDays}
          onChange={(value) => updateField("tripDurationDays", value)}
        />
        <NumberField
          id="adultTravelers"
          label="Adult travelers"
          value={draft.adultTravelers}
          min={1}
          max={12}
          error={errors.adultTravelers}
          onChange={updateAdultTravelers}
        />
        <NumberField
          id="childTravelers"
          label="Child travelers"
          value={draft.childTravelers}
          min={0}
          max={12}
          error={errors.childTravelers}
          onChange={updateChildTravelers}
        />
        <NumberField
          id="travelerCount"
          label="Total travelers"
          value={draft.travelerCount}
          min={1}
          max={12}
          readOnly
          error={errors.travelerCount}
          onChange={(value) => updateField("travelerCount", value)}
        />
      </div>
    </div>
  );
}

