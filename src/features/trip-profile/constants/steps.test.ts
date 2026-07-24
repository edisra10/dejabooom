import { describe, expect, it } from "vitest";
import {
  getNextTripProfileStepId,
  getPreviousTripProfileStepId,
  getTripProfileProgress,
  isFinalTripProfileStep,
  tripProfileSteps,
} from "./steps";

describe("trip profile steps", () => {
  it("reports progress for the first step", () => {
    expect(getTripProfileProgress("travel-basics")).toEqual({
      currentStep: 1,
      totalSteps: tripProfileSteps.length,
      percent: 14,
    });
  });

  it("moves forward and backward between adjacent steps", () => {
    expect(getNextTripProfileStepId("travel-basics")).toBe("dates-travelers");
    expect(getPreviousTripProfileStepId("dates-travelers")).toBe(
      "travel-basics",
    );
  });

  it("identifies the review step as the final step", () => {
    expect(getNextTripProfileStepId("surprise-style")).toBe("review");
    expect(isFinalTripProfileStep("review")).toBe(true);
  });
});

