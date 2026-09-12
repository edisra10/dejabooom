import { Prisma } from "@prisma/client";
import { after, NextResponse } from "next/server";
import type Stripe from "stripe";
import { trackServerEvent } from "@/server/analytics/events";
import { prisma } from "@/server/db/prisma";
import { sendPaymentConfirmation } from "@/server/email/email-service";
import { logger } from "@/server/logger";
import {
  getOrderIdFromCheckoutSession,
  getPaymentIntentIdFromCheckoutSession,
  isHandledStripeEvent,
  isStripeCheckoutSession,
} from "@/server/payments/webhook-events";
import { getStripeClient, getStripeWebhookSecret } from "@/server/payments/stripe";
import {
  enqueueRecommendationJob,
  processRecommendationJobs,
} from "@/server/recommendations/recommendation-jobs";

export const runtime = "nodejs";

async function getOrCreatePaymentEvent(event: Stripe.Event, orderId: string | null) {
  const existingEvent = await prisma.paymentEvent.findUnique({
    where: { providerEventId: event.id },
  });

  if (existingEvent) {
    return {
      paymentEvent: existingEvent,
      isDuplicate: Boolean(existingEvent.processedAt),
    };
  }

  const paymentEvent = await prisma.paymentEvent.create({
    data: {
      orderId,
      providerEventId: event.id,
      type: event.type,
      payload: event as unknown as Prisma.InputJsonValue,
    },
  });

  return { paymentEvent, isDuplicate: false };
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  paymentEventId: string,
) {
  const orderId = getOrderIdFromCheckoutSession(session);

  if (!orderId) {
    throw new Error("Stripe checkout session is missing order metadata.");
  }

  if (session.payment_status !== "paid") {
    logger.warn("Checkout completed before payment was verified.", {
      orderId,
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
    await prisma.paymentEvent.update({
      where: { id: paymentEventId },
      data: { processedAt: new Date() },
    });
    return;
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      providerCheckoutSessionId: session.id,
      providerPaymentIntentId: getPaymentIntentIdFromCheckoutSession(session),
      paidAt: new Date(),
    },
    include: {
      tripProfile: true,
    },
  });

  await enqueueRecommendationJob(order.id);

  await sendPaymentConfirmation(order.tripProfile.contactEmail, order.id);
  trackServerEvent("checkout_payment_verified", {
    orderId: order.id,
    tripProfileId: order.tripProfileId,
    serviceTier: order.serviceTier,
    amountCents: order.amountCents,
  });
  after(async () => {
    try {
      await processRecommendationJobs({ limit: 1 });
    } catch (error) {
      logger.error("Background recommendation processing failed.", {
        orderId: order.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  await prisma.paymentEvent.update({
    where: { id: paymentEventId },
    data: { processedAt: new Date() },
  });
}

async function handleCheckoutNotPaid(
  session: Stripe.Checkout.Session,
  paymentEventId: string,
) {
  const orderId = getOrderIdFromCheckoutSession(session);

  if (!orderId) {
    throw new Error("Stripe checkout session is missing order metadata.");
  }

  const status =
    session.status === "expired" || session.status === "open" ? "CANCELED" : "FAILED";

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      providerCheckoutSessionId: session.id,
    },
  });

  await prisma.paymentEvent.update({
    where: { id: paymentEventId },
    data: { processedAt: new Date() },
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe webhook signature." },
      { status: 400 },
    );
  }

  const payload = await request.text();
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    logger.warn("Stripe webhook signature verification failed.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 },
    );
  }

  const session = isStripeCheckoutSession(event.data.object)
    ? event.data.object
    : null;
  const orderId = session ? getOrderIdFromCheckoutSession(session) : null;
  const { paymentEvent, isDuplicate } = await getOrCreatePaymentEvent(event, orderId);

  if (isDuplicate) {
    logger.info("Duplicate Stripe webhook skipped.", {
      eventId: event.id,
      type: event.type,
    });
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (!isHandledStripeEvent(event.type)) {
    logger.info("Unhandled Stripe webhook logged.", {
      eventId: event.id,
      type: event.type,
    });
    await prisma.paymentEvent.update({
      where: { id: paymentEvent.id },
      data: { processedAt: new Date() },
    });
    return NextResponse.json({ received: true, ignored: true });
  }

  if (!session) {
    logger.warn("Handled Stripe event did not include a checkout session.", {
      eventId: event.id,
      type: event.type,
    });
    return NextResponse.json(
      { error: "Expected a Stripe checkout session event." },
      { status: 422 },
    );
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await handleCheckoutCompleted(session, paymentEvent.id);
    } else {
      await handleCheckoutNotPaid(session, paymentEvent.id);
    }
  } catch (error) {
    logger.error("Stripe webhook processing failed.", {
      eventId: event.id,
      type: event.type,
      orderId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Stripe webhook processing failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
