import { describe, expect, it } from "vitest";
import { getRecommendationRetryDelayMs } from "./recommendation-job-policy";

describe("recommendation job retries", () => {
  it("backs off exponentially between attempts", () => {
    expect(getRecommendationRetryDelayMs(1)).toBe(60_000);
    expect(getRecommendationRetryDelayMs(2)).toBe(120_000);
    expect(getRecommendationRetryDelayMs(3)).toBe(240_000);
  });

  it("caps retry delays at thirty minutes", () => {
    expect(getRecommendationRetryDelayMs(20)).toBe(30 * 60 * 1000);
  });
});
