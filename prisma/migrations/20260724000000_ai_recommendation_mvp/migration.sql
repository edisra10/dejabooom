CREATE TYPE "DestinationScope" AS ENUM (
  'MEXICO',
  'NORTH_AMERICA',
  'INTERNATIONAL',
  'OPEN_TO_ANYTHING'
);

CREATE TYPE "PreferredCurrency" AS ENUM ('USD', 'MXN', 'EUR');

CREATE TYPE "PreferredClimate" AS ENUM (
  'WARM',
  'MILD',
  'COOL',
  'VARIED',
  'NO_PREFERENCE'
);

CREATE TYPE "TravelPace" AS ENUM ('SLOW', 'BALANCED', 'PACKED');

CREATE TYPE "AccommodationPreference" AS ENUM (
  'BOUTIQUE',
  'COMFORT',
  'LUXURY',
  'LOCAL_STAY',
  'FLEXIBLE'
);

CREATE TYPE "PreferenceLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

CREATE TYPE "PassportAvailability" AS ENUM ('YES', 'NO', 'NOT_SURE');

CREATE TYPE "SurpriseLevel" AS ENUM (
  'FULL_SURPRISE',
  'REVEAL_COUNTRY',
  'REVEAL_REGION',
  'SHOW_THREE_FINALISTS'
);

CREATE TYPE "BudgetTier" AS ENUM ('LOW', 'MID', 'HIGH', 'LUXURY');

CREATE TYPE "ServiceTier" AS ENUM (
  'AI_SURPRISE_TRIP',
  'CONCIERGE_SURPRISE_TRIP'
);

CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING',
  'PAID',
  'FAILED',
  'CANCELED',
  'REFUNDED'
);

CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');

CREATE TYPE "RecommendationStatus" AS ENUM (
  'PENDING',
  'GENERATING',
  'GENERATED',
  'FAILED'
);

CREATE TABLE "TravelerGroup" (
  "id" TEXT NOT NULL,
  "travelerCount" INTEGER NOT NULL,
  "adultTravelers" INTEGER NOT NULL,
  "childTravelers" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TravelerGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripProfile" (
  "id" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "departureCity" TEXT NOT NULL,
  "departureAirport" TEXT NOT NULL,
  "destinationScope" "DestinationScope" NOT NULL,
  "approximateStartDate" TIMESTAMP(3) NOT NULL,
  "approximateEndDate" TIMESTAMP(3) NOT NULL,
  "flexibleDateRange" BOOLEAN NOT NULL,
  "tripDurationDays" INTEGER NOT NULL,
  "totalBudget" INTEGER NOT NULL,
  "preferredCurrency" "PreferredCurrency" NOT NULL,
  "interests" TEXT[],
  "preferredClimate" "PreferredClimate" NOT NULL,
  "travelPace" "TravelPace" NOT NULL,
  "accommodationPreference" "AccommodationPreference" NOT NULL,
  "foodInterests" TEXT[],
  "nightlifePreference" "PreferenceLevel" NOT NULL,
  "naturePreference" "PreferenceLevel" NOT NULL,
  "culturalPreference" "PreferenceLevel" NOT NULL,
  "beachPreference" "PreferenceLevel" NOT NULL,
  "adventurePreference" "PreferenceLevel" NOT NULL,
  "destinationsVisited" TEXT NOT NULL,
  "excludedDestinations" TEXT NOT NULL,
  "maximumFlightDurationHours" INTEGER NOT NULL,
  "hasPassport" "PassportAvailability" NOT NULL,
  "visaRestrictions" TEXT NOT NULL,
  "accessibilityRequirements" TEXT NOT NULL,
  "dietaryRestrictions" TEXT NOT NULL,
  "surpriseLevel" "SurpriseLevel" NOT NULL,
  "questionnaireVersion" INTEGER NOT NULL DEFAULT 2,
  "source" TEXT NOT NULL DEFAULT 'web_questionnaire',
  "travelerGroupId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TripProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Destination" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "isDomestic" BOOLEAN NOT NULL,
  "destinationScope" "DestinationScope" NOT NULL,
  "budgetTier" "BudgetTier" NOT NULL,
  "minFlightDurationHours" INTEGER NOT NULL,
  "maxFlightDurationHours" INTEGER NOT NULL,
  "climate" "PreferredClimate" NOT NULL,
  "idealDurationMinDays" INTEGER NOT NULL,
  "idealDurationMaxDays" INTEGER NOT NULL,
  "interests" TEXT[],
  "preferredSeasons" TEXT[],
  "visaConsiderations" TEXT NOT NULL,
  "restrictedConditions" TEXT[],
  "externalBookingSearchLabel" TEXT NOT NULL,
  "approximateDataNote" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DestinationAttribute" (
  "id" TEXT NOT NULL,
  "destinationId" TEXT NOT NULL,
  "beachScore" INTEGER NOT NULL,
  "cultureScore" INTEGER NOT NULL,
  "foodScore" INTEGER NOT NULL,
  "nightlifeScore" INTEGER NOT NULL,
  "natureScore" INTEGER NOT NULL,
  "romanceScore" INTEGER NOT NULL,
  "adventureScore" INTEGER NOT NULL,
  "relaxationScore" INTEGER NOT NULL,
  "logisticsScore" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DestinationAttribute_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DestinationScore" (
  "id" TEXT NOT NULL,
  "tripProfileId" TEXT NOT NULL,
  "destinationId" TEXT NOT NULL,
  "totalScore" DOUBLE PRECISION NOT NULL,
  "breakdown" JSONB NOT NULL,
  "hardFilterReasons" TEXT[],
  "passedHardFilters" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DestinationScore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Recommendation" (
  "id" TEXT NOT NULL,
  "tripProfileId" TEXT NOT NULL,
  "orderId" TEXT,
  "selectedDestinationId" TEXT,
  "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
  "topCandidateIds" TEXT[],
  "scoringBreakdown" JSONB NOT NULL,
  "hardFilterReasons" JSONB NOT NULL,
  "generationError" TEXT,
  "generatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "tripProfileId" TEXT NOT NULL,
  "serviceTier" "ServiceTier" NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "currency" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
  "providerCheckoutSessionId" TEXT,
  "providerPaymentIntentId" TEXT,
  "checkoutUrl" TEXT,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT,
  "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
  "providerEventId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GeneratedItinerary" (
  "id" TEXT NOT NULL,
  "recommendationId" TEXT NOT NULL,
  "travelerProfileSummary" TEXT NOT NULL,
  "matchExplanation" TEXT NOT NULL,
  "tripTheme" TEXT NOT NULL,
  "itinerary" JSONB NOT NULL,
  "restaurantAndActivityCategories" TEXT[],
  "packingSuggestions" TEXT[],
  "revealNarrative" TEXT NOT NULL,
  "clues" TEXT[],
  "budgetGuidance" TEXT NOT NULL,
  "importantNotes" TEXT[],
  "generatedByModel" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GeneratedItinerary_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevealToken" (
  "id" TEXT NOT NULL,
  "recommendationId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "encryptedToken" TEXT,
  "tokenLastFour" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RevealToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");
CREATE UNIQUE INDEX "DestinationAttribute_destinationId_key" ON "DestinationAttribute"("destinationId");
CREATE UNIQUE INDEX "DestinationScore_tripProfileId_destinationId_key" ON "DestinationScore"("tripProfileId", "destinationId");
CREATE UNIQUE INDEX "Recommendation_orderId_key" ON "Recommendation"("orderId");
CREATE UNIQUE INDEX "Order_providerCheckoutSessionId_key" ON "Order"("providerCheckoutSessionId");
CREATE UNIQUE INDEX "PaymentEvent_providerEventId_key" ON "PaymentEvent"("providerEventId");
CREATE UNIQUE INDEX "GeneratedItinerary_recommendationId_key" ON "GeneratedItinerary"("recommendationId");
CREATE UNIQUE INDEX "RevealToken_tokenHash_key" ON "RevealToken"("tokenHash");

CREATE INDEX "TripProfile_contactEmail_idx" ON "TripProfile"("contactEmail");
CREATE INDEX "TripProfile_createdAt_idx" ON "TripProfile"("createdAt");
CREATE INDEX "Destination_country_city_idx" ON "Destination"("country", "city");
CREATE INDEX "Destination_destinationScope_idx" ON "Destination"("destinationScope");
CREATE INDEX "Destination_budgetTier_idx" ON "Destination"("budgetTier");
CREATE INDEX "Destination_active_idx" ON "Destination"("active");
CREATE INDEX "DestinationScore_tripProfileId_totalScore_idx" ON "DestinationScore"("tripProfileId", "totalScore");
CREATE INDEX "Recommendation_tripProfileId_idx" ON "Recommendation"("tripProfileId");
CREATE INDEX "Recommendation_status_idx" ON "Recommendation"("status");
CREATE INDEX "Order_tripProfileId_idx" ON "Order"("tripProfileId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "PaymentEvent_orderId_idx" ON "PaymentEvent"("orderId");
CREATE INDEX "PaymentEvent_type_idx" ON "PaymentEvent"("type");
CREATE INDEX "RevealToken_recommendationId_idx" ON "RevealToken"("recommendationId");
CREATE INDEX "RevealToken_expiresAt_idx" ON "RevealToken"("expiresAt");

ALTER TABLE "TripProfile" ADD CONSTRAINT "TripProfile_travelerGroupId_fkey"
  FOREIGN KEY ("travelerGroupId") REFERENCES "TravelerGroup"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DestinationAttribute" ADD CONSTRAINT "DestinationAttribute_destinationId_fkey"
  FOREIGN KEY ("destinationId") REFERENCES "Destination"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DestinationScore" ADD CONSTRAINT "DestinationScore_tripProfileId_fkey"
  FOREIGN KEY ("tripProfileId") REFERENCES "TripProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DestinationScore" ADD CONSTRAINT "DestinationScore_destinationId_fkey"
  FOREIGN KEY ("destinationId") REFERENCES "Destination"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_tripProfileId_fkey"
  FOREIGN KEY ("tripProfileId") REFERENCES "TripProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_selectedDestinationId_fkey"
  FOREIGN KEY ("selectedDestinationId") REFERENCES "Destination"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_tripProfileId_fkey"
  FOREIGN KEY ("tripProfileId") REFERENCES "TripProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GeneratedItinerary" ADD CONSTRAINT "GeneratedItinerary_recommendationId_fkey"
  FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RevealToken" ADD CONSTRAINT "RevealToken_recommendationId_fkey"
  FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

