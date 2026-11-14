import { randomBytes, randomInt } from "crypto";
import { query } from "../db";
import { getOutreachSettings } from "./settings";
import { searchPlaces, runPageSpeed } from "./google";
import { findBusinessEmail } from "./scrape";
import { writeEmail, fillPrompt } from "./ai-email";
import { buildMessage, sendMail, smtpProblem } from "./mailer";

export const LEAD_STATUSES = ["new", "emailed", "replied", "unsubscribed", "bounced"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (v, max) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};
const newToken = () => randomBytes(32).toString("base64url");

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// mysql2 returns JSON columns parsed already, but be safe.
function shape(row) {
  let issues = row.pagespeed_issues;
  if (typeof issues === "string") {
    try {
      issues = JSON.parse(issues);
    } catch {
      issues = [];
    }
  }
  return { ...row, pagespeed_issues: Array.isArray(issues) ? issues : [], rating: row.rating == null ? null : Number(row.rating) };
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

// Finds businesses with Google Places and saves the new ones (duplicates by
// place_id or website domain are skipped).
export async function searchAndSave({ country, city, category, keyword, maxResults }) {
  const cleanCountry = text(country, 120);
  const cleanCity = text(city, 120);
  const what = text(keyword, 120) || text(category, 120);
  if (!cleanCountry || !cleanCity || !what) throw new Error("Choose a country, a city and a business category or keyword.");
  const settings = await getOutreachSettings();
  const places = await searchPlaces({
    apiKey: settings.places_api_key,
    textQuery: `${what} in ${cleanCity}, ${cleanCountry}`,
    maxResults,
  });
  let added = 0;
  for (const p of places) {
    const result = await query(
      `INSERT IGNORE INTO outreach_leads
         (place_id, business_name, category, city, country, address, phone, website, website_domain,
          rating, rating_count, enrich_status, unsubscribe_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.placeId,
        p.name.slice(0, 255),
        what,
        cleanCity,
        cleanCountry,
        p.address?.slice(0, 512) ?? null,
        p.phone?.slice(0, 40) ?? null,
        p.website?.slice(0, 1024) ?? null,
        p.website ? domainOf(p.website) : null,
        p.rating,
        p.ratingCount,
        // Nothing to check on a lead without a website.
        p.website ? "pending" : "done",
        newToken(),
      ]
    );
    added += result.affectedRows;
  }
  return { found: places.length, added, duplicates: places.length - added };
}

// ---------------------------------------------------------------------------
// Import (uploaded sheet) and manual add
// ---------------------------------------------------------------------------

export const MAX_IMPORT_ROWS = 1000;

// rows: [{ email, businessName, name, website?, city?, country? }].
// Skips rows without a valid email or business name, addresses already in the
// list, and addresses that unsubscribed or bounced. Returns the new lead ids.
export async function importLeads(rows, source = "import") {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) throw new Error("No rows to import.");
  if (list.length > MAX_IMPORT_ROWS) throw new Error(`Import at most ${MAX_IMPORT_ROWS} rows at a time.`);
  const [existing, suppressed] = await Promise.all([
    query("SELECT email FROM outreach_leads WHERE email IS NOT NULL"),
    query("SELECT email FROM outreach_suppressions"),
  ]);
  const taken = new Set(existing.map((r) => r.email.toLowerCase()));
  const blocked = new Set(suppressed.map((r) => r.email.toLowerCase()));
  const ids = [];
  const skipped = { invalid: 0, duplicate: 0, unsubscribed: 0 };
  for (const row of list) {
    const email = text(row?.email, 255)?.toLowerCase();
    const business = text(row?.businessName, 255);
    if (!email || !EMAIL_RE.test(email) || !business) {
      skipped.invalid++;
      continue;
    }
    if (blocked.has(email)) {
      skipped.unsubscribed++;
      continue;
    }
    if (taken.has(email)) {
      skipped.duplicate++;
      continue;
    }
    let website = text(row.website, 1024);
    if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
    const domain = website ? domainOf(website) : null;
    try {
      const result = await query(
        `INSERT INTO outreach_leads
           (business_name, contact_name, source, email, website, website_domain, city, country, enrich_status, unsubscribe_token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          business,
          text(row.name, 255),
          source === "manual" ? "manual" : "import",
          email,
          domain ? website : null,
          domain,
          text(row.city, 120),
          text(row.country, 120),
          // Only leads with a website get the email/PageSpeed check.
          domain ? "pending" : "done",
          newToken(),
        ]
      );
      ids.push(result.insertId);
      taken.add(email);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") skipped.duplicate++; // same website already in the list
      else throw error;
    }
  }
  return { added: ids.length, ids, skipped };
}

// ---------------------------------------------------------------------------
// Website check (email + PageSpeed)
// ---------------------------------------------------------------------------

export async function enrichLead(id) {
  const rows = await query("SELECT id, website FROM outreach_leads WHERE id = ?", [id]);
  const lead = rows[0];
  if (!lead) throw new Error("Lead not found.");
  if (!lead.website) {
    await query("UPDATE outreach_leads SET enrich_status = 'done' WHERE id = ?", [id]);
    return;
  }
  const settings = await getOutreachSettings();
  const errors = [];
  const [emailResult, speedResult] = await Promise.allSettled([
    findBusinessEmail(lead.website),
    runPageSpeed({ apiKey: settings.pagespeed_api_key, url: lead.website }),
  ]);
  const cols = { enrich_status: "done" };
  if (emailResult.status === "fulfilled") {
    // Never wipe an address the admin typed in just because the site shows none.
    if (emailResult.value.email) {
      cols.email = emailResult.value.email;
      cols.email_source = emailResult.value.source?.slice(0, 1024) ?? null;
    }
  } else errors.push(`Email: ${emailResult.reason.message}`);
  if (speedResult.status === "fulfilled") {
    cols.pagespeed_score = speedResult.value.score;
    cols.pagespeed_issues = JSON.stringify(speedResult.value.issues);
  } else errors.push(speedResult.reason.message); // already starts with "PageSpeed:"
  if (errors.length === 2) cols.enrich_status = "failed";
  cols.enrich_error = errors.length ? errors.join(" · ").slice(0, 500) : null;
  const keys = Object.keys(cols);
  await query(`UPDATE outreach_leads SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`, [
    ...keys.map((k) => cols[k]),
    id,
  ]);
}

// The next lead still waiting for a website check, or null.
export async function nextLeadToEnrich() {
  const rows = await query("SELECT id FROM outreach_leads WHERE enrich_status = 'pending' ORDER BY id LIMIT 1");
  return rows[0]?.id ?? null;
}

// ---------------------------------------------------------------------------
// Drafts
// ---------------------------------------------------------------------------

export async function generateDraft(id) {
  const rows = await query("SELECT * FROM outreach_leads WHERE id = ?", [id]);
  if (!rows[0]) throw new Error("Lead not found.");
  const lead = shape(rows[0]);
  const settings = await getOutreachSettings();
  const email = await writeEmail({ settings, prompt: fillPrompt(settings.prompt_template, lead, settings) });
  await query("UPDATE outreach_leads SET draft_subject = ?, draft_body = ?, draft_status = 'draft' WHERE id = ?", [
    email.subject,
    email.body,
    id,
  ]);
  return email;
}

// Admin edits: { email, status, draftSubject, draftBody, draftStatus }.
export async function updateLead(id, body) {
  const cols = {};
  if (Object.hasOwn(body, "email")) {
    const e = text(body.email, 255)?.toLowerCase() ?? null;
    if (e && !EMAIL_RE.test(e)) throw new Error("Not a valid email address.");
    cols.email = e;
  }
  if (Object.hasOwn(body, "draftSubject")) cols.draft_subject = text(body.draftSubject, 255);
  if (Object.hasOwn(body, "draftBody")) cols.draft_body = text(body.draftBody, 10000);
  if (Object.hasOwn(body, "draftStatus")) {
    if (!["none", "draft", "approved"].includes(body.draftStatus)) throw new Error("Unknown draft status.");
    cols.draft_status = body.draftStatus;
  }
  if (Object.hasOwn(body, "status")) {
    if (!LEAD_STATUSES.includes(body.status)) throw new Error("Unknown status.");
    cols.status = body.status;
  }
  if (cols.draft_status === "approved") {
    const [row] = await query("SELECT draft_subject, draft_body FROM outreach_leads WHERE id = ?", [id]);
    if (!(cols.draft_subject ?? row?.draft_subject) || !(cols.draft_body ?? row?.draft_body)) {
      throw new Error("Write or generate the email before approving it.");
    }
  }
  const keys = Object.keys(cols);
  if (keys.length) {
    await query(`UPDATE outreach_leads SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`, [
      ...keys.map((k) => cols[k]),
      id,
    ]);
  }
  // Bounced / unsubscribed addresses are never contacted again.
  if (["bounced", "unsubscribed"].includes(cols.status)) {
    const [row] = await query("SELECT email FROM outreach_leads WHERE id = ?", [id]);
    if (row?.email) await suppress(row.email, cols.status);
  }
}

export async function deleteLead(id) {
  await query("DELETE FROM outreach_leads WHERE id = ?", [id]);
}

async function suppress(email, reason) {
  await query("INSERT IGNORE INTO outreach_suppressions (email, reason) VALUES (?, ?)", [email.toLowerCase(), reason]);
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

async function sentToday() {
  const [row] = await query("SELECT COUNT(*) AS n FROM email_logs WHERE status = 'sent' AND sent_at >= CURDATE()");
  return Number(row.n);
}

// Sends the next approved email. The admin page calls this repeatedly and
// waits the returned number of seconds in between; the server also refuses to
// send sooner than the minimum delay, so the gap holds even across tabs.
export async function sendNext() {
  const s = await getOutreachSettings();
  const problem = smtpProblem(s);
  if (problem) throw new Error(problem);
  const limit = Number(s.daily_limit) || 0;
  const today = await sentToday();
  if (today >= limit) return { done: true, reason: `Daily limit reached (${today}/${limit}).`, sentToday: today };

  const minDelay = Number(s.min_delay_seconds) || 0;
  const maxDelay = Math.max(minDelay, Number(s.max_delay_seconds) || minDelay);
  const [last] = await query("SELECT TIMESTAMPDIFF(SECOND, MAX(sent_at), NOW()) AS ago FROM email_logs WHERE status IN ('sent','failed')");
  if (last?.ago != null && Number(last.ago) < minDelay) {
    return { done: false, waitSeconds: minDelay - Number(last.ago), sentToday: today };
  }

  const rows = await query(
    `SELECT l.* FROM outreach_leads l
     LEFT JOIN outreach_suppressions s ON s.email = l.email
     WHERE l.draft_status = 'approved' AND l.status = 'new' AND l.email IS NOT NULL AND s.email IS NULL
     ORDER BY l.updated_at, l.id LIMIT 1`
  );
  const lead = rows[0];
  if (!lead) return { done: true, reason: "No approved emails left to send.", sentToday: today };

  const message = buildMessage(s, { to: lead.email, subject: lead.draft_subject, body: lead.draft_body, token: lead.unsubscribe_token });
  try {
    const { messageId } = await sendMail(s, message);
    await query("INSERT INTO email_logs (lead_id, to_email, subject, status, message_id) VALUES (?, ?, ?, 'sent', ?)", [
      lead.id,
      lead.email,
      lead.draft_subject,
      messageId?.slice(0, 255) ?? null,
    ]);
    await query("UPDATE outreach_leads SET status = 'emailed', last_emailed_at = NOW() WHERE id = ?", [lead.id]);
    return { done: false, sent: { id: lead.id, to: lead.email }, waitSeconds: randomInt(minDelay, maxDelay + 1), sentToday: today + 1 };
  } catch (error) {
    await query("INSERT INTO email_logs (lead_id, to_email, subject, status, error_message) VALUES (?, ?, ?, 'failed', ?)", [
      lead.id,
      lead.email,
      lead.draft_subject,
      error.message.slice(0, 1000),
    ]);
    // Unapprove so one broken address does not block the queue.
    await query("UPDATE outreach_leads SET draft_status = 'draft' WHERE id = ?", [lead.id]);
    return { done: false, failed: { id: lead.id, to: lead.email, error: error.message }, waitSeconds: minDelay, sentToday: today };
  }
}

// ---------------------------------------------------------------------------
// Unsubscribe (public, by token)
// ---------------------------------------------------------------------------

export async function leadByUnsubscribeToken(token) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(String(token || ""))) return null;
  const rows = await query("SELECT id, business_name, email, status FROM outreach_leads WHERE unsubscribe_token = ?", [token]);
  return rows[0] || null;
}

export async function unsubscribe(token) {
  const lead = await leadByUnsubscribeToken(token);
  if (!lead) return false;
  await query("UPDATE outreach_leads SET status = 'unsubscribed', draft_status = 'none' WHERE id = ?", [lead.id]);
  if (lead.email) await suppress(lead.email, "unsubscribed");
  return true;
}

// ---------------------------------------------------------------------------
// Admin views
// ---------------------------------------------------------------------------

export async function listLeads() {
  const rows = await query(
    `SELECT l.*, (s.email IS NOT NULL) AS suppressed FROM outreach_leads l
     LEFT JOIN outreach_suppressions s ON s.email = l.email
     ORDER BY l.id DESC LIMIT 1000`
  );
  return rows.map((r) => ({ ...shape(r), suppressed: Boolean(r.suppressed) }));
}

export async function getStats() {
  const [leads] = await query(
    `SELECT COUNT(*) AS total,
            SUM(status = 'new') AS new_count, SUM(status = 'emailed') AS emailed,
            SUM(status = 'replied') AS replied, SUM(status = 'unsubscribed') AS unsubscribed,
            SUM(status = 'bounced') AS bounced, SUM(l.email IS NOT NULL) AS with_email,
            SUM(enrich_status = 'pending') AS to_check,
            SUM(draft_status = 'approved' AND status = 'new' AND l.email IS NOT NULL AND s.email IS NULL) AS queued
     FROM outreach_leads l LEFT JOIN outreach_suppressions s ON s.email = l.email`
  );
  const [mail] = await query(
    `SELECT SUM(status = 'sent') AS sent_total, SUM(status = 'failed') AS failed_total,
            SUM(status = 'sent' AND sent_at >= CURDATE()) AS sent_today
     FROM email_logs`
  );
  const n = (v) => Number(v) || 0;
  return Object.fromEntries(Object.entries({ ...leads, ...mail }).map(([k, v]) => [k, n(v)]));
}

export async function listLogs(limit = 200) {
  return query(
    `SELECT g.id, g.lead_id, g.to_email, g.subject, g.status, g.error_message, g.sent_at, l.business_name
     FROM email_logs g LEFT JOIN outreach_leads l ON l.id = g.lead_id
     ORDER BY g.id DESC LIMIT ${Number(limit) || 200}`
  );
}

// Test sends are logged as 'test' (with the error if it failed) so they never
// count towards the daily limit or the delay between real emails.
export async function logTestEmail(to, error) {
  await query("INSERT INTO email_logs (to_email, subject, status, error_message) VALUES (?, 'SMTP test', 'test', ?)", [
    to,
    error ? String(error).slice(0, 1000) : null,
  ]);
}
