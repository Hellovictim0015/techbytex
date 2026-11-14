import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { createMember } from "@/app/lib/team-leads";

// POST { name, phone } — a marketing team member who can be given leads.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const result = await createMember(body);
    await logAudit({
      adminUserId: admin.id,
      action: "team_member_created",
      targetType: "team_members",
      targetId: String(result.id),
      details: { name: String(body.name || "").slice(0, 100) },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
