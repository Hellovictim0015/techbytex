import { query } from "./db";

// Known website forms. Anything else posted is stored as "other".
export const FORM_TYPES = {
  contact: "Contact page",
  book_demo: "Free consultation",
  newsletter: "Newsletter",
  get_in_touch: "Homepage email",
  other: "Other",
};

// Forms that collect a name; email-only forms (newsletter, homepage capture) don't.
const NAME_REQUIRED = new Set(["contact", "book_demo"]);

const MAX_PER_IP_PER_HOUR = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v, max) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};

// Turns any of the site's form payloads into one consistent lead record.
export function normalizeSubmission(body) {
  const formType = Object.hasOwn(FORM_TYPES, body.formType) ? body.formType : "other";
  const name = clean(body.fullName || `${body.firstName || ""} ${body.lastName || ""}`, 255);
  const email = clean(body.email, 255)?.toLowerCase() || null;
  const extras = [body.role && `Role: ${body.role}`, body.industry && `Industry: ${body.industry}`]
    .filter(Boolean)
    .join(" · ");

  // Keep the full original payload (minus our own routing field) for the admin.
  const { formType: _ignored, ...data } = body;

  return {
    formType,
    name,
    email,
    phone: clean(body.number || body.phone, 50),
    service: clean(
      body.serviceType || body.projectType || (Array.isArray(body.interests) ? body.interests.join(", ") : null),
      255
    ),
    message: clean(body.message || extras, 5000),
    data,
  };
}

export function validateSubmission(s) {
  if (!s.email || !EMAIL_RE.test(s.email)) return "Please provide a valid email address.";
  if (NAME_REQUIRED.has(s.formType) && !s.name) return "Please provide your name.";
  return null;
}

export async function isFormRateLimited(ip) {
  const rows = await query(
    `SELECT COUNT(*) AS n FROM form_submissions
     WHERE ip_address = ? AND created_at > (NOW() - INTERVAL 1 HOUR)`,
    [ip]
  );
  return rows[0].n >= MAX_PER_IP_PER_HOUR;
}

export async function saveSubmission(s, { ip, userAgent, pagePath }) {
  const result = await query(
    `INSERT INTO form_submissions
       (form_type, name, email, phone, service, message, data, page_path, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      s.formType,
      s.name,
      s.email,
      s.phone,
      s.service,
      s.message,
      JSON.stringify(s.data),
      clean(pagePath, 512),
      clean(ip, 64),
      clean(userAgent, 512),
    ]
  );
  return result.insertId;
}

export async function markEmailSent(id) {
  await query("UPDATE form_submissions SET email_sent = 1 WHERE id = ?", [id]);
}
