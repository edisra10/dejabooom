"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getNextTripProfileStepId,
  getPreviousTripProfileStepId,
  getTripProfileProgress,
  getTripProfileStepIndex,
  isFinalTripProfileStep,
  isFirstTripProfileStep,
  tripProfileSteps,
} from "../constants/steps";
import {
  DEFAULT_TRIP_PROFILE_DRAFT,
  validateTripProfile,
  validateTripProfileStep,
} from "../schemas/trip-profile-schema";
import {
  clearTripProfileDraft,
  loadTripProfileDraft,
  saveTripProfileDraft,
} from "../storage/trip-profile-draft-storage";
import type {
  TripProfileDraft,
  TripProfileErrors,
  TripProfileField,
  TripProfileStepId,
} from "../types";
import { BudgetStep } from "./budget-step";
import { DatesTravelersStep } from "./dates-travelers-step";
import { PreferencesStep } from "./preferences-step";
import { RestrictionsStep } from "./restrictions-step";
import { ReviewStep } from "./review-step";
import { SurpriseStyleStep } from "./surprise-style-step";
import { TravelBasicsStep } from "./travel-basics-step";
import type {
  ToggleTripProfileArrayValue,
  UpdateTripProfileField,
} from "./questionnaire-types";

const firstStepId: TripProfileStepId = "travel-basics";

export function TripProfileQuestionnaire() {
  const router = useRouter();
  const [draft, setDraft] = useState<TripProfileDraft>(
    DEFAULT_TRIP_PROFILE_DRAFT,
  );
  const [currentStepId, setCurrentStepId] =
    useState<TripProfileStepId>(firstStepId);
  const [errors, setErrors] = useState<TripProfileErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  useEffect(() => {
    setDraft(loadTripProfileDraft());
    setHasLoadedDraft(true);
  }, []);

  useEffect(() => {
    if (hasLoadedDraft) {
      saveTripProfileDraft(draft);
    }
  }, [draft, hasLoadedDraft]);

  const progress = useMemo(
    () => getTripProfileProgress(currentStepId),
    [currentStepId],
  );
  const currentStep = tripProfileSteps[getTripProfileStepIndex(currentStepId)];

  const clearFieldError = useCallback((field: TripProfileField) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }, []);

  const updateField = useCallback<UpdateTripProfileField>(
    (field, value) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        [field]: value,
      }));
      clearFieldError(field);
    },
    [clearFieldError],
  );

  const toggleArrayValue = useCallback<ToggleTripProfileArrayValue>(
    (field, value) => {
      setDraft((currentDraft) => {
        const currentValues = currentDraft[field];
        const nextValues = currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value];

        return {
          ...currentDraft,
          [field]: nextValues,
        };
      });
      clearFieldError(field);
    },
    [clearFieldError],
  );

  const goToPreviousStep = () => {
    setErrors({});
    setCurrentStepId((stepId) => getPreviousTripProfileStepId(stepId));
  };

  const completeQuestionnaire = async () => {
    const validation = validateTripProfile(draft);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/trip-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });
      const payload = (await response.json()) as {
        checkoutPath?: string;
        errors?: TripProfileErrors;
        error?: string;
      };

      if (!response.ok) {
        if (payload.errors) {
          setErrors(payload.errors);
        }

        setSubmitError(
          payload.error ?? "We could not save your trip profile. Please try again.",
        );
        return;
      }

      clearTripProfileDraft();
      router.push(payload.checkoutPath ?? "/surprise-trip/results");
    } catch {
      setSubmitError("We could not save your trip profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = async () => {
    if (isFinalTripProfileStep(currentStepId)) {
      await completeQuestionnaire();
      return;
    }

    const validation = validateTripProfileStep(currentStepId, draft);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setCurrentStepId((stepId) => getNextTripProfileStepId(stepId));
  };

  const resetDraft = () => {
    clearTripProfileDraft();
    setDraft(DEFAULT_TRIP_PROFILE_DRAFT);
    setErrors({});
    setCurrentStepId(firstStepId);
  };

  const stepProps = {
    draft,
    errors,
    updateField,
    toggleArrayValue,
  };

  const errorMessages = Object.values(errors);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Dejabooom
          </Link>
          <span className="rounded-md border border-white/15 px-3 py-1 text-xs font-medium text-white/75">
            Trip profile
          </span>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
              <Sparkles className="size-3.5" />
              AI-personalized surprise trip
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Create your trip profile
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Share your dates, budget, travel style, and constraints. Dejabooom
              will use this profile to shape a surprise match in the next phase.
            </p>
          </div>

          <form
            className="rounded-md border border-slate-200 bg-white shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              goToNextStep();
            }}
          >
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Step {progress.currentStep} of {progress.totalSteps}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    {currentStep.label}
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {hasLoadedDraft ? "Draft saved locally" : "Loading draft"}
                </p>
              </div>

              <div
                className="mt-5 h-2 rounded-full bg-slate-100"
                aria-label={`Questionnaire progress ${progress.percent}%`}
                role="progressbar"
                aria-valuenow={progress.percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-slate-950 transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <ol className="mt-4 grid grid-cols-4 gap-2 text-xs font-medium text-slate-500 sm:grid-cols-7">
                {tripProfileSteps.map((step) => {
                  const active =
                    getTripProfileStepIndex(step.id) <=
                    getTripProfileStepIndex(currentStepId);

                  return (
                    <li
                      key={step.id}
                      className={cn(
                        "truncate rounded-md border px-2 py-2 text-center",
                        active
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-slate-50",
                      )}
                    >
                      {step.shortLabel}
                    </li>
                  );
                })}
              </ol>
            </div>

            {errorMessages.length > 0 ? (
              <div
                role="alert"
                className="mx-5 mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-6"
              >
                Fix the highlighted fields before continuing.
              </div>
            ) : null}

            {submitError ? (
              <div
                role="alert"
                className="mx-5 mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-6"
              >
                {submitError}
              </div>
            ) : null}

            <div className="p-5 sm:p-6">
              {currentStepId === "travel-basics" ? (
                <TravelBasicsStep {...stepProps} />
              ) : null}
              {currentStepId === "dates-travelers" ? (
                <DatesTravelersStep {...stepProps} />
              ) : null}
              {currentStepId === "budget" ? <BudgetStep {...stepProps} /> : null}
              {currentStepId === "preferences" ? (
                <PreferencesStep {...stepProps} />
              ) : null}
              {currentStepId === "restrictions" ? (
                <RestrictionsStep {...stepProps} />
              ) : null}
              {currentStepId === "surprise-style" ? (
                <SurpriseStyleStep {...stepProps} />
              ) : null}
              {currentStepId === "review" ? <ReviewStep draft={draft} /> : null}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <Button
                type="button"
                variant="ghost"
                className="justify-center text-slate-600"
                onClick={resetDraft}
              >
                <RotateCcw className="size-4" />
                Clear draft
              </Button>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isFirstTripProfileStep(currentStepId)}
                  onClick={goToPreviousStep}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-950 text-white"
                  disabled={isSubmitting}
                >
                  {isFinalTripProfileStep(currentStepId)
                    ? isSubmitting
                      ? "Saving Profile"
                      : "Generate My Surprise Match"
                    : "Continue"}
                  {!isFinalTripProfileStep(currentStepId) ? (
                    <ArrowRight className="size-4" />
                  ) : null}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

