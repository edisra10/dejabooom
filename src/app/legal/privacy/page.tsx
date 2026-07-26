import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Dejabooom",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 24, 2026">
      <p>
        Dejabooom collects trip profile information that customers submit in the
        questionnaire, including contact email, departure details, approximate
        dates, budget, interests, travel style, and travel restrictions.
      </p>
      <p>
        Dejabooom does not request or store raw card information, CVV, passport
        numbers, or sensitive identity documents. Hosted checkout is handled by
        the payment provider, and AI personalization is performed server-side.
      </p>
      <p>
        Trip profile data is used to provide the planning service, process
        order status, generate recommendations, send transactional emails, and
        maintain operational records. Environment secrets must never be exposed
        to the browser.
      </p>
    </LegalPage>
  );
}
