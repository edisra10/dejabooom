export function getRecommendationRetryDelayMs(attempts: number) {
  return Math.min(30 * 60 * 1000, 60_000 * 2 ** Math.max(0, attempts - 1));
}
