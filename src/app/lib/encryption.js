import { randomBytes, createHash, createCipheriv, createDecipheriv } from "crypto";

// AES-256-GCM with the single ENCRYPTION_KEY from the server env file. Used by
// Admin → Lead Outreach settings. Losing or changing ENCRYPTION_KEY makes the
// saved secrets unreadable (they then have to be entered again).

const MIN_KEY_LENGTH = 32;

export function encryptionKeyProblem() {
  const key = process.env.ENCRYPTION_KEY || "";
  if (!key) return "ENCRYPTION_KEY is not set in the server env file.";
  if (key.length < MIN_KEY_LENGTH) return `ENCRYPTION_KEY must be at least ${MIN_KEY_LENGTH} characters.`;
  return null;
}

function key() {
  const problem = encryptionKeyProblem();
  if (problem) throw new Error(problem);
  return createHash("sha256").update(process.env.ENCRYPTION_KEY).digest();
}

// "v1:<iv>:<tag>:<ciphertext>" in hex.
export function encrypt(plaintext) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(String(plaintext), "utf8"), cipher.final()]);
  return ["v1", iv.toString("hex"), cipher.getAuthTag().toString("hex"), data.toString("hex")].join(":");
}

export function decrypt(stored) {
  const [version, iv, tag, data] = String(stored || "").split(":");
  if (version !== "v1" || !iv || !tag) throw new Error("Unreadable encrypted value.");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(data, "hex")), decipher.final()]).toString("utf8");
}
