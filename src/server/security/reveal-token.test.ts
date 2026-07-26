import { Buffer } from "node:buffer";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createRevealToken,
  decryptRevealToken,
  encryptRevealToken,
  getRevealTokenLastFour,
  hashRevealToken,
} from "./reveal-token";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("reveal token security helpers", () => {
  it("creates high-entropy non-predictable URL tokens", () => {
    const first = createRevealToken();
    const second = createRevealToken();

    expect(first).toHaveLength(43);
    expect(second).toHaveLength(43);
    expect(first).not.toBe(second);
  });

  it("stores a hash that does not expose the raw token", () => {
    const token = "private-reveal-token";
    const hash = hashRevealToken(token);

    expect(hash).toHaveLength(64);
    expect(hash).not.toContain(token);
    expect(hashRevealToken(token)).toBe(hash);
  });

  it("encrypts and decrypts tokens when an encryption key is configured", () => {
    vi.stubEnv(
      "REVEAL_TOKEN_ENCRYPTION_KEY",
      Buffer.alloc(32, 7).toString("base64"),
    );

    const token = createRevealToken();
    const encrypted = encryptRevealToken(token);

    expect(encrypted).not.toBeNull();
    expect(encrypted).not.toContain(token);
    expect(decryptRevealToken(encrypted)).toBe(token);
    expect(getRevealTokenLastFour(token)).toBe(token.slice(-4));
  });

  it("returns null for encrypted storage when no key is configured", () => {
    expect(encryptRevealToken("private-reveal-token")).toBeNull();
    expect(decryptRevealToken(null)).toBeNull();
  });
});
