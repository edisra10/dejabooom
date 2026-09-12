import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

function getEncryptionKey() {
  const value = process.env.REVEAL_TOKEN_ENCRYPTION_KEY;

  if (!value) {
    return null;
  }

  const key = Buffer.from(value, "base64");

  if (key.length !== 32) {
    throw new Error("REVEAL_TOKEN_ENCRYPTION_KEY must be a 32-byte base64 value.");
  }

  return key;
}

export function createRevealToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashRevealToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function encryptRevealToken(token: string) {
  const key = getEncryptionKey();

  if (!key) {
    return null;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptRevealToken(value: string | null) {
  const key = getEncryptionKey();

  if (!key || !value) {
    return null;
  }

  const [ivValue, authTagValue, encryptedValue] = value.split(".");

  if (!ivValue || !authTagValue || !encryptedValue) {
    return null;
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function getRevealTokenLastFour(token: string) {
  return token.slice(-4);
}

