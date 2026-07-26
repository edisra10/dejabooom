import { Resend } from "resend";
import { getOptionalEnv, getPublicAppUrl } from "@/server/env";
import { logger } from "@/server/logger";
import {
  generationErrorTemplate,
  paymentConfirmationTemplate,
  questionnaireConfirmationTemplate,
  revealReadyTemplate,
} from "./templates";

let resendClient: Resend | null = null;

function getResendClient() {
  const apiKey = getOptionalEnv("RESEND_API_KEY");

  if (!apiKey) {
    return null;
  }

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string | undefined;
  subject: string;
  text: string;
}) {
  const from = getOptionalEnv("EMAIL_FROM");
  const client = getResendClient();

  if (!client || !from || !to) {
    logger.warn("Transactional email skipped because configuration is missing.", {
      hasClient: Boolean(client),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
      subject,
    });
    return;
  }

  await client.emails.send({
    from,
    to,
    subject,
    text,
  });
}

export async function sendQuestionnaireConfirmation(
  to: string,
  profileId: string,
) {
  await sendEmail({
    to,
    ...questionnaireConfirmationTemplate({
      appUrl: getPublicAppUrl(),
      profileId,
    }),
  });
}

export async function sendPaymentConfirmation(to: string, orderId: string) {
  await sendEmail({
    to,
    ...paymentConfirmationTemplate({
      appUrl: getPublicAppUrl(),
      orderId,
    }),
  });
}

export async function sendRevealReadyEmail(to: string, revealUrl: string) {
  await sendEmail({
    to,
    ...revealReadyTemplate({
      appUrl: getPublicAppUrl(),
      revealUrl,
    }),
  });
}

export async function sendGenerationErrorAlert(orderId: string, error: unknown) {
  await sendEmail({
    to: getOptionalEnv("ADMIN_ALERT_EMAIL"),
    ...generationErrorTemplate({
      appUrl: getPublicAppUrl(),
      orderId,
      errorMessage: error instanceof Error ? error.message : String(error),
    }),
  });
}

