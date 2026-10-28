import { query } from "./db";
import { getSecret } from "./secrets";

const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";
const BUSINESS_SETTING = "marketing_business";
// Numbers per Fast2SMS request when the message is the same for everyone.
const NUMBERS_PER_REQUEST = 200;
// Recipients handled per /send call, so one call stays well under the timeout.
export const SEND_BATCH = 100;

export const PLACEHOLDERS = ["name", "business", "phone", "website", "details"];

// Indian mobile number → 10 digits, or null if it can't be one.
export function normalizePhone(raw) {
  let digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export async function getBusinessDetails() {
  const rows = await query("SELECT setting_value FROM ai_settings WHERE setting_key = ?", [BUSINESS_SETTING]);
  return { name: "", phone: "", website: "", details: "", ...(rows[0]?.setting_value || {}) };
}

export async function saveBusinessDetails(details, adminUserId) {
  const clean = Object.fromEntries(
    ["name", "phone", "website", "details"].map((k) => [k, String(details?.[k] ?? "").trim().slice(0, 300)])
  );
  await query(
    `INSERT INTO ai_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)`,
    [BUSINESS_SETTING, JSON.stringify(clean), adminUserId]
  );
  return clean;
}

// Fills {name}, {business}, {phone}, {website}, {details}.
export function fillTemplate(text, contact, business) {
  const values = {
    name: contact?.name || "Customer",
    business: business?.name || "",
    phone: business?.phone || "",
    website: business?.website || "",
    details: business?.details || "",
  };
  return String(text).replace(/\{(\w+)\}/g, (m, key) => (key in values ? values[key] : m));
}

export const isPersonalised = (text) => /\{name\}/.test(text);

export async function getSmsConfig() {
  const [apiKey, senderId, templateId, whatsappMessageId] = await Promise.all([
    getSecret("FAST2SMS_API_KEY"),
    getSecret("FAST2SMS_SENDER_ID"),
    getSecret("FAST2SMS_TEMPLATE_ID"),
    getSecret("FAST2SMS_WHATSAPP_MESSAGE_ID"),
  ]);
  return { apiKey, senderId, templateId, whatsappMessageId };
}

function fast2SmsResult(res, data) {
  if (res.ok && (data.return === true || data.status === true || data.success === true)) {
    return { ok: true, requestId: data.request_id || data.requestId || null };
  }
  const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message;
  return { ok: false, error: String(msg || `Fast2SMS error ${res.status}`).slice(0, 500) };
}

// Approved WhatsApp template via Fast2SMS. `text` holds the {{1}}|{{2}} values.
async function callFast2SmsWhatsApp({ apiKey, whatsappMessageId, text, numbers }) {
  const params = new URLSearchParams({ authorization: apiKey, message_id: whatsappMessageId, numbers: numbers.join(",") });
  if (text) params.set("variables_values", text);
  try {
    const res = await fetch(`https://www.fast2sms.com/dev/whatsapp?${params}`, { signal: AbortSignal.timeout(20000) });
    return fast2SmsResult(res, await res.json().catch(() => ({})));
  } catch (error) {
    return { ok: false, error: error.message.slice(0, 500) };
  }
}

// One Fast2SMS request. `text` is the full message (Quick route) or the
// | separated variable values (DLT / WhatsApp). Returns { ok, requestId, error }.
async function callFast2Sms({ apiKey, route, senderId, templateId, text, numbers, whatsappMessageId }) {
  if (route === "whatsapp") return callFast2SmsWhatsApp({ apiKey, whatsappMessageId, text, numbers });
  const body =
    route === "dlt"
      ? {
          route: "dlt",
          sender_id: senderId,
          message: templateId,
          ...(text ? { variables_values: text } : {}),
          numbers: numbers.join(","),
          flash: 0,
        }
      : {
          route: "q",
          message: text,
          // Hindi / emoji need unicode; plain English is cheaper as english.
          language: /[^\x00-\x7F]/.test(text) ? "unicode" : "english",
          numbers: numbers.join(","),
          flash: 0,
        };
  try {
    const res = await fetch(FAST2SMS_URL, {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    return fast2SmsResult(res, await res.json().catch(() => ({})));
  } catch (error) {
    return { ok: false, error: error.message.slice(0, 500) };
  }
}

function assertConfig(config, route) {
  if (!config.apiKey) throw new Error("Fast2SMS API key is not set (Settings → SMS).");
  if (route === "dlt" && (!config.senderId || !config.templateId)) {
    throw new Error("DLT Sender ID and Template ID are required for the DLT route (Settings → SMS).");
  }
  if (route === "whatsapp" && !config.whatsappMessageId) {
    throw new Error("WhatsApp template Message ID is not set (Settings → SMS).");
  }
}

// Sends one test SMS — used before a campaign goes out.
export async function sendTestSms({ phone, route, message }) {
  const number = normalizePhone(phone);
  if (!number) throw new Error("Enter a valid 10-digit Indian mobile number.");
  const config = await getSmsConfig();
  assertConfig(config, route);
  const business = await getBusinessDetails();
  const result = await callFast2Sms({
    ...config,
    route,
    text: fillTemplate(message, { name: "Test" }, business),
    numbers: [number],
  });
  if (!result.ok) throw new Error(result.error);
  return result;
}

export async function createCampaign({ name, route, message, contacts, adminUserId }) {
  if (!name) throw new Error("Give the campaign a name.");
  if (!["dlt", "q", "whatsapp"].includes(route)) throw new Error("Pick a route.");
  // A DLT / WhatsApp template with no variable slots needs no values at all.
  if (route === "q" && !message?.trim()) throw new Error("Write the message.");
  message = message?.trim() || "";

  const seen = new Set();
  const rows = [];
  for (const c of contacts) {
    const phone = normalizePhone(c?.phone);
    if (!phone || seen.has(phone)) continue;
    seen.add(phone);
    rows.push([String(c.name ?? "").trim().slice(0, 255) || null, phone]);
  }
  if (rows.length === 0) throw new Error("No valid mobile numbers in the list.");
  if (rows.length > 50000) throw new Error("Too many contacts in one campaign (max 50,000).");

  const config = await getSmsConfig();
  assertConfig(config, route);

  const result = await query(
    `INSERT INTO sms_campaigns (name, route, message, template_id, sender_id, total, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name.slice(0, 255),
      route,
      message,
      route === "dlt" ? config.templateId : route === "whatsapp" ? config.whatsappMessageId : null,
      route === "dlt" ? config.senderId : null,
      rows.length,
      adminUserId,
    ]
  );
  const campaignId = result.insertId;
  for (let i = 0; i < rows.length; i += 1000) {
    const chunk = rows.slice(i, i + 1000);
    await query(
      `INSERT INTO sms_recipients (campaign_id, name, phone) VALUES ${chunk.map(() => "(?, ?, ?)").join(", ")}`,
      chunk.flatMap(([n, p]) => [campaignId, n, p])
    );
  }
  return { campaignId, total: rows.length };
}

async function refreshCounts(campaignId) {
  const [counts] = await query(
    `SELECT SUM(status = 'sent') AS sent, SUM(status = 'failed') AS failed, SUM(status = 'pending') AS pending
     FROM sms_recipients WHERE campaign_id = ?`,
    [campaignId]
  );
  const sent = Number(counts.sent) || 0;
  const failed = Number(counts.failed) || 0;
  const pending = Number(counts.pending) || 0;
  const status = pending > 0 ? "sending" : failed === 0 ? "completed" : sent === 0 ? "failed" : "partial";
  await query(
    `UPDATE sms_campaigns SET sent = ?, failed = ?, status = ?,
       completed_at = IF(? = 'sending', NULL, COALESCE(completed_at, NOW()))
     WHERE id = ?`,
    [sent, failed, status, status, campaignId]
  );
  return { sent, failed, pending, status };
}

// Sends the next batch of pending recipients. The admin page calls this
// repeatedly until `pending` is 0, so a big list never hits a request timeout.
export async function sendNextBatch(campaignId) {
  const campaigns = await query("SELECT * FROM sms_campaigns WHERE id = ?", [campaignId]);
  const campaign = campaigns[0];
  if (!campaign) throw new Error("Campaign not found.");

  const recipients = await query(
    `SELECT id, name, phone FROM sms_recipients WHERE campaign_id = ? AND status = 'pending' ORDER BY id LIMIT ${SEND_BATCH}`,
    [campaignId]
  );
  if (recipients.length === 0) return refreshCounts(campaignId);

  const config = await getSmsConfig();
  assertConfig(config, campaign.route);
  if (campaign.route === "dlt") {
    config.senderId = campaign.sender_id || config.senderId;
    config.templateId = campaign.template_id || config.templateId;
  }
  if (campaign.route === "whatsapp") {
    config.whatsappMessageId = campaign.template_id || config.whatsappMessageId;
  }
  const business = await getBusinessDetails();

  const mark = async (ids, result) => {
    if (ids.length === 0) return;
    await query(
      `UPDATE sms_recipients SET status = ?, request_id = ?, error_message = ?, sent_at = IF(? = 'sent', NOW(), NULL)
       WHERE id IN (${ids.map(() => "?").join(",")})`,
      [result.ok ? "sent" : "failed", result.requestId || null, result.ok ? null : result.error, result.ok ? "sent" : "failed", ...ids]
    );
  };

  if (isPersonalised(campaign.message)) {
    // Different text per person → one request each, 5 at a time.
    for (let i = 0; i < recipients.length; i += 5) {
      await Promise.all(
        recipients.slice(i, i + 5).map(async (r) => {
          const result = await callFast2Sms({
            ...config,
            route: campaign.route,
            text: fillTemplate(campaign.message, r, business),
            numbers: [r.phone],
          });
          await mark([r.id], result);
        })
      );
    }
  } else {
    const text = fillTemplate(campaign.message, null, business);
    for (let i = 0; i < recipients.length; i += NUMBERS_PER_REQUEST) {
      const chunk = recipients.slice(i, i + NUMBERS_PER_REQUEST);
      const result = await callFast2Sms({ ...config, route: campaign.route, text, numbers: chunk.map((r) => r.phone) });
      await mark(chunk.map((r) => r.id), result);
    }
  }
  return refreshCounts(campaignId);
}

// Puts failed recipients back in the queue so "Send" retries them.
export async function retryFailed(campaignId) {
  await query(
    "UPDATE sms_recipients SET status = 'pending', error_message = NULL WHERE campaign_id = ? AND status = 'failed'",
    [campaignId]
  );
  return refreshCounts(campaignId);
}

export async function listCampaigns() {
  return query("SELECT * FROM sms_campaigns ORDER BY id DESC LIMIT 50");
}

export async function getFailedRecipients(campaignId) {
  return query(
    "SELECT name, phone, error_message FROM sms_recipients WHERE campaign_id = ? AND status = 'failed' ORDER BY id LIMIT 200",
    [campaignId]
  );
}
