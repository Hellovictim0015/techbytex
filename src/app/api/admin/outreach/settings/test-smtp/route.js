import { getCurrentAdmin } from "@/app/lib/auth";
import { getOutreachSettings } from "@/app/lib/outreach/settings";
import { testSmtp } from "@/app/lib/outreach/mailer";
import { logTestEmail } from "@/app/lib/outreach/leads";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

// POST { to } — connects with the saved SMTP settings and sends one test email.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  const to = String((await req.json().catch(() => ({})))?.to || "").trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);
  try {
    if (!valid) throw new Error("Enter the email address to send the test to.");
    const result = await testSmtp(await getOutreachSettings(), to);
    await logTestEmail(to, null);
    return Response.json({ success: true, ...result });
  } catch (error) {
    if (valid) await logTestEmail(to, error.message).catch(() => {});
    return fail(error);
  }
}
