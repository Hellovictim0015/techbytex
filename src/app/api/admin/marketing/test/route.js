import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { sendTestSms } from "@/app/lib/sms";

// POST { phone, route, message } — sends one test SMS before a campaign.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { phone, route, message } = await req.json();
    const result = await sendTestSms({ phone, route, message: String(message || "").slice(0, 2000) });
    await logAudit({
      adminUserId: admin.id,
      action: "sms_test_sent",
      targetType: "sms",
      details: { route },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
