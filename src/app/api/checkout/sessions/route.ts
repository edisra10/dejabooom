import { NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/server/analytics/events";
import { prisma } from "@/server/db/prisma";
import { getPublicAppUrl } from "@/server/env";
import { logger } from "@/server/logger";
import { getServiceProduct } from "@/server/checkout/service-products";
import { getStripeClient } from "@/server/payments/stripe";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/server/security/rate-limit";

export const runtime = "nodejs";

const checkoutRequestSchema = z.object({
  profileId: z.string().min(8),
  serviceTier: z.enum(["AI_SURPRISE_TRIP", "CONCIERGE_SURPRISE_TRIP"]),
});

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    key: `checkout:${getRequestIp(request)}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt);
  }

  const formData = await request.formData();
  const parsed = checkoutRequestSchema.safeParse({
    profileId: formData.get("profileId"),
    serviceTier: formData.get("serviceTier"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 422 });
  }

  const product = getServiceProduct(parsed.data.serviceTier);

  if (!product?.amountCents) {
    return NextResponse.json(
      {
        error: "Checkout pricing is not configured.",
      },
      { status: 503 },
    );
  }

  const tripProfile = await prisma.tripProfile.findUnique({
    where: { id: parsed.data.profileId },
  });

  if (!tripProfile) {
    return NextResponse.json({ error: "Trip profile not found." }, { status: 404 });
  }

  const order = await prisma.order.create({
    data: {
      tripProfileId: tripProfile.id,
      serviceTier: product.tier,
      currency: product.currency,
      amountCents: product.amountCents,
    },
  });

  const appUrl = getPublicAppUrl();
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: tripProfile.contactEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.amountCents,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      },
    ],
    metadata: {
      orderId: order.id,
      tripProfileId: tripProfile.id,
      serviceTier: product.tier,
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/${tripProfile.id}`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      providerCheckoutSessionId: session.id,
      checkoutUrl: session.url,
    },
  });

  logger.info("Stripe checkout session created.", {
    orderId: order.id,
    sessionId: session.id,
  });
  trackServerEvent("checkout_session_created", {
    orderId: order.id,
    tripProfileId: tripProfile.id,
    serviceTier: product.tier,
    amountCents: product.amountCents,
  });

  if (!session.url) {
    return NextResponse.json(
      {
        error: "Hosted checkout session did not return a URL.",
      },
      { status: 502 },
    );
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
