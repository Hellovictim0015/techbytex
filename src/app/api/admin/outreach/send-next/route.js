import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { sendNext } from "@/app/lib/outreach/leads";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

// POST — sends the next approved email (respecting the daily limit and the
// delay between emails) and says how long to wait before the next call.
export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  try {
    const result = await sendNext();
    if (result.sent) {
      await logAudit({ adminUserId: admin.id, action: "outreach_email_sent", targetType: "outreach_leads", targetId: String(result.sent.id), ip: await getClientIp() });
    }
    return Response.json({ success: true, ...result });
  } catch (error) {
    return fail(error);
  }
}
