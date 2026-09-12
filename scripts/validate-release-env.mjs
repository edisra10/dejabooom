import { Buffer } from "node:buffer";
import "dotenv/config";

const releaseEnvironment = process.env.RELEASE_ENV ?? "staging";
const errors = [];

function requireValue(name, validator, message) {
  const value = process.env[name];

  if (!value) {
    errors.push(`${name}: missing`);
    return;
  }

  if (validator && !validator(value)) {
    errors.push(`${name}: ${message}`);
  }
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPositiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

function hasMinimumLength(length) {
  return (value) => value.length >= length;
}

requireValue(
  "NEXT_PUBLIC_SITE_URL",
  isHttpsUrl,
  "must be a public HTTPS URL",
);
requireValue("NEXT_PUBLIC_SUPPORT_EMAIL", isEmail, "must be a valid public email");
requireValue("DATABASE_URL", (value) => value.startsWith("postgresql://"), "must use PostgreSQL");
requireValue("OPENAI_API_KEY", hasMinimumLength(20), "does not look like an API key");
requireValue("OPENAI_RECOMMENDATION_MODEL", hasMinimumLength(2), "must name a model");
requireValue("STRIPE_SECRET_KEY", (value) => {
  return releaseEnvironment === "production"
    ? value.startsWith("sk_live_")
    : value.startsWith("sk_test_");
}, `must be a ${releaseEnvironment === "production" ? "live" : "test"} secret key`);
requireValue("STRIPE_WEBHOOK_SECRET", (value) => value.startsWith("whsec_"), "must be a webhook secret");
requireValue("PLANNING_SERVICE_CURRENCY", (value) => /^[a-zA-Z]{3}$/.test(value), "must be a three-letter currency");
requireValue("AI_SURPRISE_TRIP_NAME", hasMinimumLength(2), "must name the service");
requireValue("AI_SURPRISE_TRIP_PRICE_CENTS", isPositiveInteger, "must be a positive integer");
requireValue("RESEND_API_KEY", (value) => value.startsWith("re_"), "does not look like a Resend API key");
requireValue("EMAIL_FROM", (value) => value.includes("@"), "must contain a sender address");
requireValue("ADMIN_ALERT_EMAIL", isEmail, "must be a valid email");
requireValue("ADMIN_USERNAME", hasMinimumLength(4), "must contain at least 4 characters");
requireValue("ADMIN_PASSWORD", hasMinimumLength(16), "must contain at least 16 characters");
requireValue("REVEAL_TOKEN_ENCRYPTION_KEY", (value) => {
  try {
    return Buffer.from(value, "base64").length === 32;
  } catch {
    return false;
  }
}, "must decode to exactly 32 bytes");
requireValue("REVEAL_TOKEN_TTL_DAYS", (value) => {
  const days = Number(value);
  return Number.isInteger(days) && days >= 1 && days <= 365;
}, "must be an integer from 1 to 365");
requireValue("CRON_SECRET", hasMinimumLength(32), "must contain at least 32 characters");
requireValue("RECOMMENDATION_JOB_BATCH_SIZE", (value) => {
  const size = Number(value);
  return Number.isInteger(size) && size >= 1 && size <= 5;
}, "must be an integer from 1 to 5");

if (process.env.RECOMMENDATION_WEIGHTS_JSON) {
  try {
    const weights = JSON.parse(process.env.RECOMMENDATION_WEIGHTS_JSON);
    if (!weights || typeof weights !== "object" || Array.isArray(weights)) {
      errors.push("RECOMMENDATION_WEIGHTS_JSON: must be a JSON object");
    }
  } catch {
    errors.push("RECOMMENDATION_WEIGHTS_JSON: must be valid JSON");
  }
}

if (errors.length > 0) {
  console.error(`Release environment validation failed for ${releaseEnvironment}:`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Release environment validation passed for ${releaseEnvironment}.`);
  console.log("All required settings are present and structurally valid; secret values were not printed.");
}
