import nodemailer from "nodemailer";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      firstName,
      lastName,
      email,
      number,
      serviceType,
      projectType,
      message,
    } = body;

    const name = (fullName || `${firstName || ""} ${lastName || ""}`).trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const service = serviceType || projectType || "N/A";

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return Response.json(
        { success: false, error: "Please provide a valid name and email address." },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return Response.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TechByteX Website" <${process.env.EMAIL_USER}>`,
      replyTo: normalizedEmail,
      to: process.env.EMAIL_TO || "techbytexsoftware@gmail.com",
      subject: "New TechByteX consultation request",
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(number || "N/A")}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || "No message provided")}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json(
      { success: false, error: "Email failed to send" },
      { status: 500 }
    );
  }
}
