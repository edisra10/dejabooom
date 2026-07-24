"use client";

import {
  accommodationPreferenceOptions,
  destinationScopeOptions,
  passportAvailabilityOptions,
  preferenceLevelOptions,
  preferredClimateOptions,
  surpriseLevelOptionsList,
  travelPaceOptions,
} from "../constants/options";
import type { TripProfileDraft, TripProfileOption } from "../types";

interface ReviewStepProps {
  draft: TripProfileDraft;
}

function getOptionLabel<TValue extends string>(
  options: readonly TripProfileOption<TValue>[],
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "None selected";
}

function formatText(value: string) {
  return value.trim() || "None listed";
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-slate-950">{value}</dd>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

export function ReviewStep({ draft }: ReviewStepProps) {
  const preferenceLabel = (value: TripProfileDraft["nightlifePreference"]) =>
    getOptionLabel(preferenceLevelOptions, value);

  return (
    <div className="space-y-5">
      <ReviewSection title="Trip frame">
        <ReviewItem label="Departure city" value={draft.departureCity} />
        <ReviewItem label="Departure airport" value={draft.departureAirport} />
        <ReviewItem
          label="Destination scope"
          value={getOptionLabel(destinationScopeOptions, draft.destinationScope)}
        />
        <ReviewItem
          label="Dates"
          value={`${draft.approximateStartDate} to ${draft.approximateEndDate}`}
        />
        <ReviewItem
          label="Flexible range"
          value={draft.flexibleDateRange ? "Yes" : "No"}
        />
        <ReviewItem
          label="Duration"
          value={`${draft.tripDurationDays} days`}
        />
      </ReviewSection>

      <ReviewSection title="Travelers and budget">
        <ReviewItem
          label="Travelers"
          value={`${draft.travelerCount} total, ${draft.adultTravelers} adults, ${draft.childTravelers} children`}
        />
        <ReviewItem
          label="Budget"
          value={`${draft.preferredCurrency} ${draft.totalBudget.toLocaleString()}`}
        />
        <ReviewItem
          label="Maximum flight duration"
          value={`${draft.maximumFlightDurationHours} hours`}
        />
        <ReviewItem
          label="Passport availability"
          value={getOptionLabel(passportAvailabilityOptions, draft.hasPassport)}
        />
      </ReviewSection>

      <ReviewSection title="Travel style">
        <ReviewItem label="Interests" value={formatList(draft.interests)} />
        <ReviewItem label="Food interests" value={formatList(draft.foodInterests)} />
        <ReviewItem
          label="Climate"
          value={getOptionLabel(preferredClimateOptions, draft.preferredClimate)}
        />
        <ReviewItem
          label="Pace"
          value={getOptionLabel(travelPaceOptions, draft.travelPace)}
        />
        <ReviewItem
          label="Accommodation"
          value={getOptionLabel(
            accommodationPreferenceOptions,
            draft.accommodationPreference,
          )}
        />
        <ReviewItem label="Nightlife" value={preferenceLabel(draft.nightlifePreference)} />
        <ReviewItem label="Nature" value={preferenceLabel(draft.naturePreference)} />
        <ReviewItem label="Culture" value={preferenceLabel(draft.culturalPreference)} />
        <ReviewItem label="Beach" value={preferenceLabel(draft.beachPreference)} />
        <ReviewItem label="Adventure" value={preferenceLabel(draft.adventurePreference)} />
      </ReviewSection>

      <ReviewSection title="Restrictions">
        <ReviewItem
          label="Already visited"
          value={formatText(draft.destinationsVisited)}
        />
        <ReviewItem
          label="Excluded destinations"
          value={formatText(draft.excludedDestinations)}
        />
        <ReviewItem
          label="Visa restrictions"
          value={formatText(draft.visaRestrictions)}
        />
        <ReviewItem
          label="Accessibility"
          value={formatText(draft.accessibilityRequirements)}
        />
        <ReviewItem
          label="Dietary restrictions"
          value={formatText(draft.dietaryRestrictions)}
        />
        <ReviewItem
          label="Surprise level"
          value={getOptionLabel(surpriseLevelOptionsList, draft.surpriseLevel)}
        />
      </ReviewSection>
    </div>
  );
}

