import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy | Dejabooom",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Cancellation and Refund Policy" updated="July 24, 2026">
      <p>
        Dejabooom currently sells a planning and personalization service, not
        refundable travel inventory. Cancellation and refund handling should be
        defined before public launch and aligned with payment-provider settings.
      </p>
      <p>
        If a recommendation cannot be generated after a verified payment,
        Dejabooom should review the order manually and either complete the
        service, retry generation, or issue an appropriate refund through the
        payment provider.
      </p>
      <p>
        Flights, hotels, activities, and other external bookings are governed by
        the policies of the third-party providers selected by the customer.
      </p>
    </LegalPage>
  );
}
