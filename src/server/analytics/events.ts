import { logger } from "@/server/logger";

type AnalyticsEventName =
  | "trip_profile_created"
  | "checkout_session_created"
  | "checkout_payment_verified"
  | "recommendation_generation_started"
  | "recommendation_generation_completed"
  | "recommendation_generation_failed"
  | "reveal_viewed";

type AnalyticsEventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

const sensitivePropertyNames = new Set([
  "contactEmail",
  "email",
  "token",
  "tokenHash",
  "encryptedToken",
  "stripeSignature",
  "apiKey",
]);

export function trackServerEvent(
  name: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
) {
  const redactedProperties = Object.fromEntries(
    Object.entries(properties).filter(([key]) => !sensitivePropertyNames.has(key)),
  );

  logger.info("Analytics event.", {
    event: name,
    ...redactedProperties,
  });
}
