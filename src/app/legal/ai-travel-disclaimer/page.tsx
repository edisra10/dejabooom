import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "AI and Travel Information Disclaimer | Dejabooom",
};

export default function AiTravelDisclaimerPage() {
  return (
    <LegalPage
      title="AI and Travel Information Disclaimer"
      updated="September 12, 2026"
    >
      <p>
        Dejabooom uses deterministic filtering and scoring to select from a
        curated destination catalog. AI-generated content personalizes the
        explanation, itinerary, reveal narrative, and planning suggestions for
        the selected destination.
      </p>
      <p>
        AI output must not be treated as real-time pricing, flight availability,
        hotel availability, visa advice, medical advice, safety guidance, or
        legal advice. Customers are responsible for verifying all practical
        travel requirements with official sources and third-party providers.
      </p>
      <p>
        Dejabooom may use approximate catalog data for early planning. Any
        estimates should be treated as directional and must be checked before a
        customer books travel.
      </p>
    </LegalPage>
  );
}
