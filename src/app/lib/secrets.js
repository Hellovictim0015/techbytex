import { randomBytes, createHash, createCipheriv, createDecipheriv } from "crypto";
import { query } from "./db";

// Registry of externally-configurable secrets. Admins set these from
// /admin/settings instead of editing .env directly. Each is stored encrypted
// in ai_settings (key = `secret:<ENV_NAME>`); process.env stays as the
// fallback for anything not yet set from the UI.
export const INTEGRATION_FIELDS = [
  { key: "OPENAI_API_KEY", group: "AI", label: "OpenAI API Key" },
  { key: "ANTHROPIC_API_KEY", group: "AI", label: "Claude (Anthropic) API Key" },
  { key: "GOOGLE_CLIENT_ID", group: "Google", label: "Google Client ID" },
  { key: "GOOGLE_CLIENT_SECRET", group: "Google", label: "Google Client Secret" },
  { key: "GOOGLE_REDIRECT_URI", group: "Google", label: "Google Redirect URI", notSecret: true },
  {
    key: "GOOGLE_SEARCH_CONSOLE_SITE_URL",
    group: "Google",
    label: "Search Console Site URL",
    notSecret: true,
  },
  {
    key: "GOOGLE_ANALYTICS_PROPERTY_ID",
    group: "Google",
    label: "Analytics Property ID",
    notSecret: true,
  },
  {
    key: "GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID",
    group: "Google Business",
    label: "Business Profile Account ID",
    notSecret: true,
  },
  {
    key: "GOOGLE_BUSINESS_PROFILE_LOCATION_ID",
    group: "Google Business",
    label: "Business Profile Location ID",
    notSecret: true,
  },
  { key: "CRON_SECRET", group: "Scheduler", label: "Cron Secret" },
];

const ALLOWED_KEYS = new Set(INTEGRATION_FIELDS.map((f) => f.key));

function settingKeyFor(envKey) {
  return `secret:${envKey}`;
}

function getEncryptionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must be set to store integration keys.");
  }
  return createHash("sha256").update(secret).digest();
}

function encrypt(plaintext) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ciphertext.toString("hex") };
}

function decrypt({ iv, tag, ciphertext }) {
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "hex")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

// Saves one integration value (encrypted at rest). Pass an empty value to clear it.
export async function setIntegrationValue(envKey, value) {
  if (!ALLOWED_KEYS.has(envKey)) {
    throw new Error(`Unknown integration key: ${envKey}`);
  }
  if (!value) {
    await query("DELETE FROM ai_settings WHERE setting_key = ?", [settingKeyFor(envKey)]);
    return;
  }
  const payload = encrypt(value);
  await query(
    `INSERT INTO ai_settings (setting_key, setting_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [settingKeyFor(envKey), JSON.stringify(payload)]
  );
}

// Server-only: resolves a secret's live value — DB (admin-entered) first, then
// process.env as a fallback. Use this from any future Phase 2-4 integration code.
export async function getSecret(envKey) {
  if (!ALLOWED_KEYS.has(envKey)) {
    throw new Error(`Unknown integration key: ${envKey}`);
  }
  const rows = await query("SELECT setting_value FROM ai_settings WHERE setting_key = ?", [
    settingKeyFor(envKey),
  ]);
  if (rows.length > 0) {
    // mysql2 already deserializes the JSON column into a native object.
    try {
      return decrypt(rows[0].setting_value);
    } catch {
      // Falls through to env fallback if ADMIN_SESSION_SECRET changed.
    }
  }
  return process.env[envKey] || "";
}

// Returns { [envKey]: { configured, source, preview } } for the settings UI.
// Never returns the full decrypted value.
export async function getIntegrationStatuses() {
  const rows = await query(
    "SELECT setting_key, setting_value FROM ai_settings WHERE setting_key LIKE 'secret:%'"
  );
  const dbValues = new Map();
  for (const row of rows) {
    const envKey = row.setting_key.replace(/^secret:/, "");
    try {
      dbValues.set(envKey, decrypt(row.setting_value));
    } catch {
      // ignore undecryptable rows
    }
  }

  const statuses = {};
  for (const field of INTEGRATION_FIELDS) {
    const dbValue = dbValues.get(field.key);
    const envValue = process.env[field.key];
    const value = dbValue || envValue || "";
    statuses[field.key] = {
      configured: Boolean(value),
      source: dbValue ? "admin" : envValue ? "env" : null,
      preview: value ? maskValue(value, field.notSecret) : "",
    };
  }
  return statuses;
}

// Server-only: stores an arbitrary JSON object (e.g. OAuth tokens) encrypted in
// ai_settings. Kept under the `secret:` prefix so it never shows up in the
// plain settings list. Pass null to delete it.
export async function setEncryptedSetting(name, data) {
  const settingKey = settingKeyFor(name);
  if (data == null) {
    await query("DELETE FROM ai_settings WHERE setting_key = ?", [settingKey]);
    return;
  }
  const payload = encrypt(JSON.stringify(data));
  await query(
    `INSERT INTO ai_settings (setting_key, setting_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [settingKey, JSON.stringify(payload)]
  );
}

export async function getEncryptedSetting(name) {
  const rows = await query("SELECT setting_value FROM ai_settings WHERE setting_key = ?", [
    settingKeyFor(name),
  ]);
  if (rows.length === 0) return null;
  try {
    return JSON.parse(decrypt(rows[0].setting_value));
  } catch {
    return null;
  }
}

function maskValue(value, notSecret) {
  if (notSecret) return value;
  if (value.length <= 4) return "••••";
  return `••••${value.slice(-4)}`;
}
