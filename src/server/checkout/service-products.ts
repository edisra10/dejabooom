import type { ServiceTier } from "@prisma/client";

export interface ServiceProduct {
  tier: ServiceTier;
  name: string;
  description: string;
  amountCents: number | null;
  currency: string;
  features: string[];
}

function parseAmount(name: string) {
  const value = process.env[name];

  if (!value) {
    return null;
  }

  const amount = Number(value);
  return Number.isInteger(amount) && amount > 0 ? amount : null;
}

export function getServiceProducts(): ServiceProduct[] {
  const currency = (process.env.PLANNING_SERVICE_CURRENCY ?? "usd").toLowerCase();

  return [
    {
      tier: "AI_SURPRISE_TRIP",
      name: process.env.AI_SURPRISE_TRIP_NAME ?? "AI Surprise Trip",
      description:
        "AI-personalized destination match, reveal story, itinerary, and planning guidance.",
      amountCents: parseAmount("AI_SURPRISE_TRIP_PRICE_CENTS"),
      currency,
      features: [
        "Destination matching",
        "AI-personalized itinerary",
        "Surprise reveal link",
      ],
    },
    {
      tier: "CONCIERGE_SURPRISE_TRIP",
      name: process.env.CONCIERGE_SURPRISE_TRIP_NAME ?? "Concierge Surprise Trip",
      description:
        "Everything in AI Surprise Trip plus operator review and concierge-style refinement.",
      amountCents: parseAmount("CONCIERGE_SURPRISE_TRIP_PRICE_CENTS"),
      currency,
      features: [
        "AI-personalized itinerary",
        "Operator review queue",
        "Reveal-ready email",
      ],
    },
  ];
}

export function getServiceProduct(tier: ServiceTier) {
  return getServiceProducts().find((product) => product.tier === tier) ?? null;
}

export function formatServicePrice(product: ServiceProduct) {
  if (!product.amountCents) {
    return "Configure price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency.toUpperCase(),
  }).format(product.amountCents / 100);
}

