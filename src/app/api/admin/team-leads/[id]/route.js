import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { updateLead, deleteLead } from "@/app/lib/team-leads";

async function guard(params) {
  const admin = await getCurrentAdmin();
  const id = Number((await params).id);
  return { admin, id: Number.isInteger(id) && id > 0 ? id : null };
}

// PATCH — any lead field, plus { status, note } for the history.
export async function PATCH(req, { params }) {
  const { admin, id } = await guard(params);
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  try {
    const body = await req.json();
    await updateLead(id, body, `${admin.name || "Admin"} (admin)`);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { admin, id } = await guard(params);
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  try {
    await deleteLead(id);
    await logAudit({
      adminUserId: admin.id,
      action: "team_lead_deleted",
      targetType: "sales_leads",
      targetId: String(id),
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
