import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { createCampaign } from "@/app/lib/sms";

// POST { name, route, message, contacts: [{ name, phone, service }] } — saves a campaign
// and its recipients. Sending happens batch by batch via /campaigns/:id/send.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const result = await createCampaign({
      name: String(body.name || "").trim(),
      route: body.route,
      message: String(body.message || "").slice(0, 2000),
      contacts: Array.isArray(body.contacts) ? body.contacts : [],
      adminUserId: admin.id,
    });
    await logAudit({
      adminUserId: admin.id,
      action: "sms_campaign_created",
      targetType: "sms_campaigns",
      targetId: String(result.campaignId),
      details: { total: result.total, route: body.route },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
