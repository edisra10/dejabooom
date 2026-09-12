import { describe, expect, it } from "vitest";
import {
  getOrderIdFromCheckoutSession,
  getPaymentIntentIdFromCheckoutSession,
  isHandledStripeEvent,
} from "./webhook-events";

describe("Stripe webhook helpers", () => {
  it("accepts only payment lifecycle events handled by the app", () => {
    expect(isHandledStripeEvent("checkout.session.completed")).toBe(true);
    expect(isHandledStripeEvent("checkout.session.async_payment_succeeded")).toBe(true);
    expect(isHandledStripeEvent("customer.created")).toBe(false);
  });

  it("extracts order metadata from checkout sessions", () => {
    expect(
      getOrderIdFromCheckoutSession({
        object: "checkout.session",
        metadata: {
          orderId: "order_123",
        },
      } as never),
    ).toBe("order_123");
  });

  it("normalizes string payment intent identifiers", () => {
    expect(
      getPaymentIntentIdFromCheckoutSession({
        object: "checkout.session",
        payment_intent: "pi_123",
      } as never),
    ).toBe("pi_123");
  });
});
