CREATE TYPE "RecommendationJobStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TABLE "RecommendationJob" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "status" "RecommendationJobStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RecommendationJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RateLimitBucket" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "RecommendationJob_orderId_key"
  ON "RecommendationJob"("orderId");
CREATE INDEX "RecommendationJob_status_availableAt_idx"
  ON "RecommendationJob"("status", "availableAt");
CREATE INDEX "RecommendationJob_lockedAt_idx"
  ON "RecommendationJob"("lockedAt");
CREATE INDEX "RateLimitBucket_resetAt_idx"
  ON "RateLimitBucket"("resetAt");

ALTER TABLE "RecommendationJob"
  ADD CONSTRAINT "RecommendationJob_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
