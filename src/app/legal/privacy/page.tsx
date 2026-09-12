import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Dejabooom",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 12, 2026">
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
        maintain operational and fraud-prevention records.
      </p>
      <p>
        Dejabooom shares only the information needed for each provider to perform
        its role: Stripe processes hosted payments, OpenAI processes the trip
        context used to create the recommendation, Resend delivers transactional
        email, and infrastructure providers host the application and database.
        Dejabooom does not sell customer personal information.
      </p>
      <p>
        Records are retained only as long as needed to provide the service,
        support customers, meet accounting or legal obligations, and resolve
        disputes. Customers may request access, correction, or deletion by using
        the support address below. A request may be limited where retention is
        required by law or needed to protect the service and other users.
      </p>
    </LegalPage>
  );
}
