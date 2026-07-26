import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Dejabooom",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 24, 2026">
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
    </LegalPage>
  );
}
