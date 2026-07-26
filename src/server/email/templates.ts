interface TemplateInput {
  appUrl: string;
  revealUrl?: string;
  profileId?: string;
  orderId?: string;
  errorMessage?: string;
}

export function questionnaireConfirmationTemplate({ appUrl, profileId }: TemplateInput) {
  return {
    subject: "Your Dejabooom trip profile was received",
    text: [
      "Thanks for creating your Dejabooom trip profile.",
      "",
      `Profile reference: ${profileId ?? "pending"}`,
      "Next, choose a planning service and complete hosted checkout.",
      "",
      `Return to Dejabooom: ${appUrl}`,
    ].join("\n"),
  };
}

export function paymentConfirmationTemplate({ appUrl, orderId }: TemplateInput) {
  return {
    subject: "Your Dejabooom planning order is confirmed",
    text: [
      "Your payment was verified. Dejabooom will now generate your private surprise recommendation.",
      "",
      `Order reference: ${orderId ?? "pending"}`,
      "You will receive a reveal-ready email when the recommendation is complete.",
      "",
      `Return to Dejabooom: ${appUrl}`,
    ].join("\n"),
  };
}

export function revealReadyTemplate({ revealUrl }: TemplateInput) {
  return {
    subject: "Your Dejabooom surprise reveal is ready",
    text: [
      "Your private surprise trip recommendation is ready.",
      "",
      `Open your reveal: ${revealUrl ?? "Reveal link unavailable"}`,
      "",
      "Prices, availability, passport, visa, and entry requirements must be verified directly with third-party providers before booking.",
    ].join("\n"),
  };
}

export function generationErrorTemplate({
  appUrl,
  orderId,
  errorMessage,
}: TemplateInput) {
  return {
    subject: "Dejabooom generation error",
    text: [
      "A recommendation generation attempt failed.",
      "",
      `Order reference: ${orderId ?? "unknown"}`,
      `Error: ${errorMessage ?? "Unknown error"}`,
      "",
      `Admin: ${appUrl}/admin`,
    ].join("\n"),
  };
}

