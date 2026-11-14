import nodemailer from "nodemailer";

// Builds and sends outreach emails over the SMTP account in Lead Outreach →
// Settings. Every email carries an unsubscribe link, one-click unsubscribe
// headers, and the sender's postal address.

export function smtpProblem(s) {
  if (!s.smtp_host || !s.smtp_user || !s.smtp_password) return "SMTP host, user and password must be set.";
  if (!s.from_email) return "From email must be set.";
  if (!s.unsubscribe_base_url) return "Unsubscribe base URL must be set.";
  return null;
}

function transport(s) {
  return nodemailer.createTransport({
    host: s.smtp_host,
    port: Number(s.smtp_port) || 587,
    secure: s.smtp_secure === "true",
    auth: { user: s.smtp_user, pass: s.smtp_password },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });
}

export const unsubscribeUrl = (s, token) => `${s.unsubscribe_base_url}/unsubscribe/${token}`;

const escapeHtml = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildMessage(s, { to, subject, body, token }) {
  const unsub = unsubscribeUrl(s, token);
  const signature = (s.email_signature || "").trim();
  const footer = `${s.business_address || ""}\nDon't want emails from us? Unsubscribe: ${unsub}`;
  const text = [body.trim(), signature, "—", footer].filter(Boolean).join("\n\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1e293b">
${escapeHtml(body.trim()).replace(/\n/g, "<br>")}
${signature ? `<p style="margin-top:16px">${escapeHtml(signature).replace(/\n/g, "<br>")}</p>` : ""}
<p style="margin-top:24px;font-size:12px;color:#64748b">${escapeHtml(s.business_address || "")}<br>
Don't want emails from us? <a href="${escapeHtml(unsub)}">Unsubscribe</a></p></div>`;
  return {
    from: { name: s.from_name || "TechByteX", address: s.from_email },
    to,
    subject,
    text,
    html,
    headers: {
      "List-Unsubscribe": `<${unsub}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

export async function sendMail(s, message) {
  const problem = smtpProblem(s);
  if (problem) throw new Error(problem);
  const info = await transport(s).sendMail(message);
  return { messageId: info.messageId || null };
}

export async function testSmtp(s, to) {
  const problem = smtpProblem(s);
  if (problem) throw new Error(problem);
  const t = transport(s);
  await t.verify();
  const info = await t.sendMail({
    from: { name: s.from_name || "TechByteX", address: s.from_email },
    to,
    subject: "TechByteX Lead Outreach — SMTP test",
    text: "This is a test email from Admin → Lead Outreach. Your SMTP settings work.",
  });
  return { messageId: info.messageId || null };
}
