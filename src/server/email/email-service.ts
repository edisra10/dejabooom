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
    logger.error("Transactional email could not be sent because configuration is missing.", {
      hasClient: Boolean(client),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
      subject,
    });
    throw new Error("Transactional email is not configured.");
  }

  const { error } = await client.emails.send({
    from,
    to,
    subject,
    text,
  });

  if (error) {
    throw new Error(`Transactional email provider rejected the message: ${error.message}`);
  }
}

async function sendBestEffortEmail(
  operation: () => Promise<void>,
  context: Record<string, unknown>,
) {
  try {
    await operation();
  } catch (error) {
    logger.error("Non-critical transactional email failed.", {
      ...context,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function sendQuestionnaireConfirmation(
  to: string,
  profileId: string,
) {
  await sendBestEffortEmail(
    () =>
      sendEmail({
        to,
        ...questionnaireConfirmationTemplate({
          appUrl: getPublicAppUrl(),
          profileId,
        }),
      }),
    { emailType: "questionnaire_confirmation", profileId },
  );
}

export async function sendPaymentConfirmation(to: string, orderId: string) {
  await sendBestEffortEmail(
    () =>
      sendEmail({
        to,
        ...paymentConfirmationTemplate({
          appUrl: getPublicAppUrl(),
          orderId,
        }),
      }),
    { emailType: "payment_confirmation", orderId },
  );
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
  await sendBestEffortEmail(
    () =>
      sendEmail({
        to: getOptionalEnv("ADMIN_ALERT_EMAIL"),
        ...generationErrorTemplate({
          appUrl: getPublicAppUrl(),
          orderId,
          errorMessage: error instanceof Error ? error.message : String(error),
        }),
      }),
    { emailType: "generation_error", orderId },
  );
}
