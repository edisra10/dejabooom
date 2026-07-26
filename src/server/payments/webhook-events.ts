import type Stripe from "stripe";

export const handledStripeEventTypes = new Set([
  "checkout.session.completed",
  "checkout.session.expired",
  "checkout.session.async_payment_failed",
]);

export function isHandledStripeEvent(eventType: string) {
  return handledStripeEventTypes.has(eventType);
}

export function isStripeCheckoutSession(
  value: Stripe.Event.Data.Object,
): value is Stripe.Checkout.Session {
  return "object" in value && value.object === "checkout.session";
}

export function getOrderIdFromCheckoutSession(session: Stripe.Checkout.Session) {
  return session.metadata?.orderId ?? null;
}

export function getPaymentIntentIdFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  if (!session.payment_intent) {
    return null;
  }

  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
}

