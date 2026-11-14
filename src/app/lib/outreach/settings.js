import { query } from "../db";
import { encrypt, decrypt } from "../encryption";
import { SITE_URL } from "../seo";

// Admin → Lead Outreach → Settings. Everything is stored in outreach_settings
// (never .env); secrets are encrypted and only ever shown masked.

export const DEFAULT_PROMPT = `Write a short, friendly cold email (90–140 words) in plain English to {contact_name} at "{business_name}", a {category} in {city}, {country}. Greet them by first name if a real name is given.
Their website is {website}. We checked it and found this real issue: {issue}.
Mention that one issue in a helpful, specific way (no exaggeration, no fake compliments), explain in one sentence how fixing it helps them get more customers, and offer TechByteX's website and app development services.
End with one simple question asking if they would like a free quick review call.
No links, no prices, no emojis, no subject line in the body. Sign off with just the sender's first name: {from_name}.`;

// key → { secret, default } for every setting the page edits.
export const SETTINGS = {
  places_api_key: { secret: true },
  pagespeed_api_key: { secret: true },
  ai_provider: { default: "anthropic" },
  ai_model: { default: "" },
  ai_api_key: { secret: true },
  smtp_host: { default: "" },
  smtp_port: { default: "587" },
  smtp_user: { default: "" },
  smtp_password: { secret: true },
  smtp_secure: { default: "false" },
  from_name: { default: "TechByteX" },
  from_email: { default: "" },
  daily_limit: { default: "30" },
  min_delay_seconds: { default: "45" },
  max_delay_seconds: { default: "120" },
  unsubscribe_base_url: { default: SITE_URL },
  business_address: { default: "TechByteX Software Solutions, Dalli Rajhara, Chhattisgarh 491228, India" },
  email_signature: { default: "TechByteX Software Solutions\n+91 8827219873 · www.techbytex.in" },
  prompt_template: { default: DEFAULT_PROMPT },
};

export const AI_DEFAULT_MODELS = { anthropic: "claude-opus-5-5", openai: "gpt-5.4-mini" };

const mask = (value) => (value ? `••••••••${value.slice(-4)}` : "");

// Full settings with secrets decrypted — server-side use only.
export async function getOutreachSettings() {
  const rows = await query("SELECT setting_key, setting_value, is_secret FROM outreach_settings");
  const stored = Object.fromEntries(rows.map((r) => [r.setting_key, r]));
  const out = {};
  for (const [key, def] of Object.entries(SETTINGS)) {
    const row = stored[key];
    if (!row || row.setting_value == null) out[key] = def.secret ? "" : def.default ?? "";
    else if (def.secret) {
      try {
        out[key] = decrypt(row.setting_value);
      } catch {
        out[key] = ""; // ENCRYPTION_KEY changed — the secret must be entered again
      }
    } else out[key] = row.setting_value;
  }
  out.ai_model = out.ai_model || AI_DEFAULT_MODELS[out.ai_provider] || AI_DEFAULT_MODELS.anthropic;
  return out;
}

// For the settings page: secrets replaced by "••••1234" (or "" when unset).
export async function getSettingsForAdmin() {
  const s = await getOutreachSettings();
  return Object.fromEntries(Object.entries(s).map(([k, v]) => [k, SETTINGS[k]?.secret ? mask(v) : v]));
}

function validate(key, value) {
  const v = String(value ?? "").trim();
  switch (key) {
    case "ai_provider":
      if (!["anthropic", "openai"].includes(v)) throw new Error("AI provider must be Anthropic or OpenAI.");
      return v;
    case "smtp_port": {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1 || n > 65535) throw new Error("SMTP port must be 1–65535.");
      return String(n);
    }
    case "smtp_secure":
      return v === "true" ? "true" : "false";
    case "daily_limit":
    case "min_delay_seconds":
    case "max_delay_seconds": {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0 || n > 10000) throw new Error(`${key.replace(/_/g, " ")} must be a whole number.`);
      return String(n);
    }
    case "from_email":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Error("From email is not a valid address.");
      return v;
    case "unsubscribe_base_url":
      if (v && !/^https?:\/\/[^\s]+$/i.test(v)) throw new Error("Unsubscribe base URL must start with http(s)://");
      return v.replace(/\/+$/, "");
    default:
      return String(value ?? "").slice(0, 10000);
  }
}

// Saves the fields that were sent. An empty secret keeps the stored value.
export async function saveOutreachSettings(body) {
  const updates = [];
  for (const [key, def] of Object.entries(SETTINGS)) {
    if (!Object.hasOwn(body, key)) continue;
    if (def.secret) {
      const v = String(body[key] ?? "").trim();
      if (!v || v.startsWith("••••")) continue;
      updates.push([key, encrypt(v), 1]);
    } else {
      updates.push([key, validate(key, body[key]), 0]);
    }
  }
  const s = Object.fromEntries(updates.map(([k, v]) => [k, v]));
  const min = Number(s.min_delay_seconds ?? body.min_delay_seconds);
  const max = Number(s.max_delay_seconds ?? body.max_delay_seconds);
  if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
    throw new Error("Minimum delay cannot be more than the maximum delay.");
  }
  for (const [key, value, secret] of updates) {
    await query(
      `INSERT INTO outreach_settings (setting_key, setting_value, is_secret) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), is_secret = VALUES(is_secret)`,
      [key, value, secret]
    );
  }
  return updates.length;
}
