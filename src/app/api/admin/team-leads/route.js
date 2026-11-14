import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { createLeads } from "@/app/lib/team-leads";

// POST { leads: [{ name, phone, business, city, websiteUrl, requirement, assignedTo }] }
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { leads } = await req.json();
    const ids = await createLeads(leads, admin.id);
    await logAudit({
      adminUserId: admin.id,
      action: "team_leads_created",
      targetType: "sales_leads",
      details: { count: ids.length },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ids });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
