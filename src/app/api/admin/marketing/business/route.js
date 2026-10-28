import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { saveBusinessDetails } from "@/app/lib/sms";

// POST { name, phone, website, details } — business details used in SMS placeholders.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const details = await saveBusinessDetails(await req.json(), admin.id);
    await logAudit({
      adminUserId: admin.id,
      action: "marketing_business_saved",
      targetType: "ai_settings",
      targetId: "marketing_business",
      ip: await getClientIp(),
    });
    return Response.json({ success: true, details });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
