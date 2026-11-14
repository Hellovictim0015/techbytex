import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { updateMember, deleteMember } from "@/app/lib/team-leads";

async function guard(params) {
  const admin = await getCurrentAdmin();
  const id = Number((await params).id);
  return { admin, id: Number.isInteger(id) && id > 0 ? id : null };
}

// PATCH { name, phone, isActive, newLink }
export async function PATCH(req, { params }) {
  const { admin, id } = await guard(params);
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  try {
    const body = await req.json();
    await updateMember(id, body);
    await logAudit({
      adminUserId: admin.id,
      action: body.newLink ? "team_member_link_reset" : "team_member_updated",
      targetType: "team_members",
      targetId: String(id),
      ip: await getClientIp(),
    });
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
    await deleteMember(id);
    await logAudit({
      adminUserId: admin.id,
      action: "team_member_deleted",
      targetType: "team_members",
      targetId: String(id),
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
