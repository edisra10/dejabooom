import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock("@/server/env", () => ({
  getOptionalEnv: (name: string) => process.env[name],
  getPublicAppUrl: () => "https://example.com",
}));

vi.mock("@/server/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

import {
  sendQuestionnaireConfirmation,
  sendRevealReadyEmail,
} from "./email-service";

describe("transactional email delivery", () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM", "Dejabooom <sender@example.com>");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects critical reveal delivery when the provider returns an error", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Sender is not verified" },
    });

    await expect(
      sendRevealReadyEmail("traveler@example.com", "https://example.com/reveal/token"),
    ).rejects.toThrow("Sender is not verified");
  });

  it("does not fail profile creation when its confirmation email fails", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Temporary provider error" },
    });

    await expect(
      sendQuestionnaireConfirmation("traveler@example.com", "profile_123"),
    ).resolves.toBeUndefined();
  });

  it("accepts a successful reveal delivery", async () => {
    sendMock.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    await expect(
      sendRevealReadyEmail("traveler@example.com", "https://example.com/reveal/token"),
    ).resolves.toBeUndefined();
  });
});
