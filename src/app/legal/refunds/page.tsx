import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy | Dejabooom",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Cancellation and Refund Policy" updated="September 12, 2026">
      <p>
        Dejabooom sells a personalized digital planning service. A customer may
        request cancellation and a full refund before recommendation generation
        begins. Include the order reference and the email used at checkout in the
        request. Generation may begin immediately after payment is verified.
      </p>
      <p>
        If Dejabooom cannot deliver a recommendation after verified payment, the
        customer may choose another delivery attempt or a full refund of the
        Dejabooom planning-service fee. Duplicate charges and confirmed billing
        errors are also eligible for a full refund.
      </p>
      <p>
        Because the result is created for the customer&apos;s individual profile,
        completed and delivered recommendations are generally non-refundable.
        This does not limit refunds required by applicable consumer law. Approved
        refunds are returned to the original payment method; the payment provider
        and bank determine when the credit appears.
      </p>
      <p>
        Flights, hotels, activities, and other external bookings are governed by
        the policies of the third-party providers selected by the customer.
      </p>
    </LegalPage>
  );
}
