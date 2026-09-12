import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { trackServerEvent } from "@/server/analytics/events";
import { prisma } from "@/server/db/prisma";
import { getPublicAppUrl } from "@/server/env";
import { logger } from "@/server/logger";
import { getServiceProduct } from "@/server/checkout/service-products";
import { getStripeClient } from "@/server/payments/stripe";
import { scoreAndPersistTripProfile } from "@/server/recommendations/persist-scores";
import {
  checkRateLimit,
  getRequestIp,
} from "@/server/security/rate-limit";

export const runtime = "nodejs";

const checkoutRequestSchema = z.object({
  profileId: z.string().min(8),
  serviceTier: z.literal("AI_SURPRISE_TRIP"),
});

function checkoutErrorRedirect(profileId: string, reason: string) {
  const url = new URL(`/checkout/${profileId}`, getPublicAppUrl());
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = checkoutRequestSchema.safeParse({
    profileId: formData.get("profileId"),
    serviceTier: formData.get("serviceTier"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 422 });
  }

  const rateLimit = await checkRateLimit({
    key: `checkout:${getRequestIp(request)}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return checkoutErrorRedirect(parsed.data.profileId, "rate-limit");
  }

  const product = getServiceProduct(parsed.data.serviceTier);

  if (!product?.amountCents) {
    return checkoutErrorRedirect(parsed.data.profileId, "pricing");
  }

  const tripProfile = await prisma.tripProfile.findUnique({
    where: { id: parsed.data.profileId },
  });

  if (!tripProfile) {
    return NextResponse.json({ error: "Trip profile not found." }, { status: 404 });
  }

  try {
    const scoringResult = await scoreAndPersistTripProfile(tripProfile.id);

    if (!scoringResult.selectedDestination) {
      return checkoutErrorRedirect(tripProfile.id, "no-match");
    }
  } catch (error) {
    logger.error("Checkout eligibility check failed.", {
      tripProfileId: tripProfile.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return checkoutErrorRedirect(tripProfile.id, "eligibility");
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
  let session: Stripe.Checkout.Session;

  try {
    const stripe = getStripeClient();
    session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    logger.error("Stripe checkout session creation failed.", {
      orderId: order.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return checkoutErrorRedirect(tripProfile.id, "provider");
  }

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
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return checkoutErrorRedirect(tripProfile.id, "provider");
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
