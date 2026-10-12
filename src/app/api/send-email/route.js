import nodemailer from "nodemailer";
import { headers } from "next/headers";
import {
  FORM_TYPES,
  normalizeSubmission,
  validateSubmission,
  isFormRateLimited,
  saveSubmission,
  markEmailSent,
} from "@/app/lib/forms";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendNotificationEmail(s) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const label = FORM_TYPES[s.formType] || "Website form";
  await transporter.sendMail({
    from: `"TechByteX Website" <${process.env.EMAIL_USER}>`,
    replyTo: s.email,
    to: process.env.EMAIL_TO || "techbytexsoftware@gmail.com",
    subject: `New TechByteX ${label.toLowerCase()} submission`,
    html: `
      <h2>New ${escapeHtml(label)} submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(s.name || "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(s.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(s.phone || "N/A")}</p>
      <p><strong>Service / interest:</strong> ${escapeHtml(s.service || "N/A")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(s.message || "No message provided")}</p>
    `,
  });
  return true;
}

// Receives every website form. The submission is saved to the database first
// (so it shows in Admin → Leads) and then emailed. The visitor sees success
// if at least one of the two worked, so a lead is never silently lost.
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const submission = normalizeSubmission(body || {});
  const invalid = validateSubmission(submission);
  if (invalid) {
    return Response.json({ success: false, error: invalid }, { status: 400 });
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  let pagePath = null;
  try {
    pagePath = new URL(h.get("referer") || "").pathname;
  } catch {
    // no referer
  }

  let savedId = null;
  try {
    if (await isFormRateLimited(ip)) {
      return Response.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }
    savedId = await saveSubmission(submission, { ip, userAgent: h.get("user-agent"), pagePath });
  } catch (error) {
    // Database unavailable (e.g. no hosted DB yet) — still try email below.
    console.error("Form save error:", error.message);
  }

  let emailed = false;
  try {
    emailed = await sendNotificationEmail(submission);
    if (emailed && savedId) await markEmailSent(savedId);
  } catch (error) {
    console.error("Email error:", error.message);
  }

  if (!savedId && !emailed) {
    return Response.json(
      { success: false, error: "Could not submit the form. Please call or WhatsApp us." },
      { status: 500 }
    );
  }
  return Response.json({ success: true });
}
