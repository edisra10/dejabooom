import type {
  DestinationForScoring,
  DestinationScoreBreakdown,
  RecommendationBudgetTier,
  RecommendationEngineResult,
  RecommendationProfile,
  ScoredDestination,
  ScoringWeights,
} from "./scoring-types";

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  interestMatch: 0.3,
  budgetFit: 0.2,
  travelStyleMatch: 0.15,
  novelty: 0.1,
  logistics: 0.1,
  climateMatch: 0.1,
  durationFit: 0.05,
};

const scoringWeightKeys = Object.keys(
  DEFAULT_SCORING_WEIGHTS,
) as (keyof ScoringWeights)[];

const budgetRank: Record<RecommendationBudgetTier, number> = {
  low: 1,
  mid: 2,
  high: 3,
  luxury: 4,
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizeList(values: string[]) {
  return new Set(values.map(normalize).filter(Boolean));
}

function tokenizeNotes(value: string) {
  return normalize(value)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getProfileBudgetTier(profile: RecommendationProfile) {
  const usdBudget =
    profile.preferredCurrency === "MXN"
      ? profile.totalBudget / 18
      : profile.preferredCurrency === "EUR"
        ? profile.totalBudget * 1.1
        : profile.totalBudget;

  if (usdBudget < 900) {
    return "low" satisfies RecommendationBudgetTier;
  }

  if (usdBudget < 2200) {
    return "mid" satisfies RecommendationBudgetTier;
  }

  if (usdBudget < 5500) {
    return "high" satisfies RecommendationBudgetTier;
  }

  return "luxury" satisfies RecommendationBudgetTier;
}

function matchesDestinationScope(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  if (profile.destinationScope === "open_to_anything") {
    return true;
  }

  if (profile.destinationScope === "mexico") {
    return destination.country === "Mexico";
  }

  if (profile.destinationScope === "north_america") {
    return ["Mexico", "United States", "Canada"].includes(destination.country);
  }

  return true;
}

function destinationMatchesNote(destination: DestinationForScoring, note: string) {
  const haystack = [
    destination.slug,
    destination.city,
    destination.region,
    destination.country,
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(note);
}

function getHardFilterReasons(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  const reasons: string[] = [];
  const excludedDestinations = tokenizeNotes(profile.excludedDestinations);
  const profileBudgetTier = getProfileBudgetTier(profile);
  const hasAccessibilityRequirements =
    profile.accessibilityRequirements.trim().length > 0;
  const visaRestrictions = normalize(profile.visaRestrictions);

  if (excludedDestinations.some((note) => destinationMatchesNote(destination, note))) {
    reasons.push("Destination was explicitly excluded by the traveler.");
  }

  if (!matchesDestinationScope(profile, destination)) {
    reasons.push("Destination does not match the requested destination scope.");
  }

  if (
    profile.hasPassport === "no" &&
    !destination.isDomestic
  ) {
    reasons.push("Traveler does not have a passport for an international option.");
  }

  if (
    visaRestrictions &&
    (visaRestrictions.includes(normalize(destination.country)) ||
      visaRestrictions.includes("no visa") ||
      visaRestrictions.includes("visa-free only"))
  ) {
    reasons.push("Visa restrictions may conflict with this destination.");
  }

  if (profile.tripDurationDays < destination.idealDurationMinDays) {
    reasons.push("Trip duration is shorter than the destination's ideal minimum.");
  }

  if (profile.tripDurationDays > destination.idealDurationMaxDays + 2) {
    reasons.push("Trip duration is much longer than the destination's ideal range.");
  }

  if (destination.minFlightDurationHours > profile.maximumFlightDurationHours) {
    reasons.push("Estimated flight duration exceeds the traveler maximum.");
  }

  if (budgetRank[destination.budgetTier] > budgetRank[profileBudgetTier]) {
    reasons.push("Destination budget tier is above the traveler budget tier.");
  }

  if (
    hasAccessibilityRequirements &&
    destination.restrictedConditions.includes("limited_accessibility")
  ) {
    reasons.push("Destination has accessibility constraints flagged in the catalog.");
  }

  if (
    profile.preferredClimate !== "no_preference" &&
    profile.preferredClimate !== "varied" &&
    destination.climate !== "varied" &&
    destination.climate !== profile.preferredClimate
  ) {
    reasons.push("Destination climate conflicts with the traveler preference.");
  }

  return reasons;
}

function scoreInterestMatch(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  const profileInterests = normalizeList(profile.interests);
  const destinationInterests = normalizeList(destination.interests);

  if (profileInterests.size === 0) {
    return 0.5;
  }

  let matches = 0;
  for (const interest of profileInterests) {
    if (destinationInterests.has(interest)) {
      matches += 1;
    }
  }

  return matches / profileInterests.size;
}

function scoreBudgetFit(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  const profileTier = getProfileBudgetTier(profile);
  const delta = Math.abs(budgetRank[profileTier] - budgetRank[destination.budgetTier]);
  return Math.max(0, 1 - delta * 0.35);
}

function preferenceMultiplier(value: "low" | "moderate" | "high") {
  if (value === "high") {
    return 1;
  }

  if (value === "moderate") {
    return 0.65;
  }

  return 0.25;
}

function scoreTravelStyle(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  const preferenceScores = [
    destination.attributes.nightlifeScore *
      preferenceMultiplier(profile.nightlifePreference),
    destination.attributes.natureScore * preferenceMultiplier(profile.naturePreference),
    destination.attributes.cultureScore *
      preferenceMultiplier(profile.culturalPreference),
    destination.attributes.beachScore * preferenceMultiplier(profile.beachPreference),
    destination.attributes.adventureScore *
      preferenceMultiplier(profile.adventurePreference),
  ];

  const paceFit =
    profile.travelPace === "slow"
      ? destination.attributes.relaxationScore
      : profile.travelPace === "packed"
        ? destination.attributes.adventureScore
        : (destination.attributes.logisticsScore + destination.attributes.cultureScore) / 2;

  const total =
    preferenceScores.reduce((sum, score) => sum + score, paceFit) /
    (preferenceScores.length + 1);

  return Math.min(1, total / 10);
}

function scoreNovelty(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  const visitedNotes = tokenizeNotes(profile.destinationsVisited);

  if (visitedNotes.length === 0) {
    return 1;
  }

  return visitedNotes.some((note) => destinationMatchesNote(destination, note))
    ? 0.15
    : 1;
}

function scoreLogistics(destination: DestinationForScoring) {
  return Math.min(1, destination.attributes.logisticsScore / 10);
}

function scoreClimateMatch(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  if (
    profile.preferredClimate === "no_preference" ||
    profile.preferredClimate === "varied" ||
    destination.climate === "varied"
  ) {
    return 1;
  }

  return profile.preferredClimate === destination.climate ? 1 : 0;
}

function scoreDurationFit(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
) {
  if (
    profile.tripDurationDays >= destination.idealDurationMinDays &&
    profile.tripDurationDays <= destination.idealDurationMaxDays
  ) {
    return 1;
  }

  const distance =
    profile.tripDurationDays < destination.idealDurationMinDays
      ? destination.idealDurationMinDays - profile.tripDurationDays
      : profile.tripDurationDays - destination.idealDurationMaxDays;

  return Math.max(0, 1 - distance * 0.25);
}

function calculateBreakdown(
  profile: RecommendationProfile,
  destination: DestinationForScoring,
): DestinationScoreBreakdown {
  return {
    interestMatch: scoreInterestMatch(profile, destination),
    budgetFit: scoreBudgetFit(profile, destination),
    travelStyleMatch: scoreTravelStyle(profile, destination),
    novelty: scoreNovelty(profile, destination),
    logistics: scoreLogistics(destination),
    climateMatch: scoreClimateMatch(profile, destination),
    durationFit: scoreDurationFit(profile, destination),
  };
}

function calculateTotalScore(
  breakdown: DestinationScoreBreakdown,
  weights: ScoringWeights,
) {
  return Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + breakdown[key as keyof DestinationScoreBreakdown] * weight;
  }, 0);
}

export function normalizeScoringWeights(weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS) {
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  if (total <= 0) {
    return DEFAULT_SCORING_WEIGHTS;
  }

  return scoringWeightKeys.reduce<ScoringWeights>(
    (normalizedWeights, key) => ({
      ...normalizedWeights,
      [key]: weights[key] / total,
    }),
    { ...DEFAULT_SCORING_WEIGHTS },
  );
}

export function parseScoringWeights(value: string | undefined) {
  if (!value) {
    return DEFAULT_SCORING_WEIGHTS;
  }

  try {
    const parsed = JSON.parse(value) as Partial<Record<keyof ScoringWeights, unknown>>;
    const weights = { ...DEFAULT_SCORING_WEIGHTS };

    for (const key of scoringWeightKeys) {
      const parsedValue = parsed[key];

      if (typeof parsedValue === "number" && Number.isFinite(parsedValue)) {
        weights[key] = parsedValue;
      }
    }

    return normalizeScoringWeights(weights);
  } catch {
    return DEFAULT_SCORING_WEIGHTS;
  }
}

export function scoreDestinations(
  profile: RecommendationProfile,
  destinations: DestinationForScoring[],
  weights = DEFAULT_SCORING_WEIGHTS,
): RecommendationEngineResult {
  const normalizedWeights = normalizeScoringWeights(weights);
  const allCandidates: ScoredDestination[] = destinations.map((destination) => {
    const hardFilterReasons = getHardFilterReasons(profile, destination);
    const breakdown = calculateBreakdown(profile, destination);

    return {
      destination,
      totalScore: hardFilterReasons.length
        ? 0
        : Math.round(calculateTotalScore(breakdown, normalizedWeights) * 1000) / 10,
      breakdown,
      hardFilterReasons,
      passedHardFilters: hardFilterReasons.length === 0,
    };
  });

  const eligibleCandidates = allCandidates
    .filter((candidate) => candidate.passedHardFilters)
    .sort((first, second) => second.totalScore - first.totalScore);

  return {
    allCandidates,
    eligibleCandidates,
    topThreeCandidates: eligibleCandidates.slice(0, 3),
    selectedDestination: eligibleCandidates[0] ?? null,
  };
}
