import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Dejabooom",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="September 12, 2026">
      <p>
        Dejabooom provides travel-planning and personalization services. The
        service may include destination matching, AI-assisted recommendations,
        itinerary ideas, trip themes, reveal content, packing guidance, and
        third-party booking suggestions.
      </p>
      <p>
        Dejabooom does not sell, reserve, ticket, or operate flights, hotels,
        transportation, tours, restaurants, insurance, visas, or activities.
        Customers book travel directly with third-party providers and are
        responsible for reviewing those providers&apos; terms.
      </p>
      <p>
        Recommendations are planning guidance, not guarantees. Prices,
        schedules, availability, safety conditions, accessibility details,
        passport rules, visa rules, and entry requirements can change and must
        be verified before booking.
      </p>
      <h2 className="text-xl font-semibold text-slate-950">Orders and delivery</h2>
      <p>
        The launch service provides one AI-personalized destination match and a
        private planning reveal for a trip of two to five days. Payment is
        collected through hosted checkout. Delivery is complete when the private
        reveal link is sent to the email address supplied in the trip profile.
        Personalized generation may begin immediately after payment is verified.
      </p>
      <p>
        Customers must provide accurate contact and trip information and must not
        misuse the service, attempt to access another customer&apos;s private reveal,
        or submit unlawful or harmful content.
      </p>
      <h2 className="text-xl font-semibold text-slate-950">Service problems</h2>
      <p>
        If Dejabooom cannot deliver a paid recommendation, the customer may
        request completion of the service or a refund under the Cancellation and
        Refund Policy. Liability for the planning-service fee is limited to the
        amount paid where permitted by applicable law. Nothing in these terms
        limits rights that cannot legally be limited.
      </p>
    </LegalPage>
  );
}
