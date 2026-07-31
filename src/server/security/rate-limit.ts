import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitRow {
  count: number;
  resetAt: Date;
}

export async function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = new Date();
  const nextResetAt = new Date(now.getTime() + windowMs);
  const [bucket] = await prisma.$queryRaw<RateLimitRow[]>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, ${nextResetAt}, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN ${nextResetAt}
        ELSE "RateLimitBucket"."resetAt"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;

  if (!bucket) {
    throw new Error("Rate limit bucket could not be persisted.");
  }

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt.getTime(),
  };
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export function rateLimitResponse(resetAt: number) {
  return NextResponse.json(
    {
      error: "Too many requests. Please try again shortly.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))),
      },
    },
  );
}
