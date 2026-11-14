import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { updateClient, deleteClient } from "@/app/lib/vault";

async function guard(params) {
  const admin = await getCurrentAdmin();
  const id = Number((await params).id);
  return { admin, id: Number.isInteger(id) && id > 0 ? id : null };
}

// PATCH { name, contact, notes }
export async function PATCH(req, { params }) {
  const { admin, id } = await guard(params);
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  try {
    const body = await req.json();
    await updateClient(id, body);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_client_updated",
      targetType: "vault_clients",
      targetId: String(id),
      details: { name: String(body.name || "").slice(0, 100) },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE — removes the client and every login saved under it.
export async function DELETE(req, { params }) {
  const { admin, id } = await guard(params);
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  try {
    await deleteClient(id);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_client_deleted",
      targetType: "vault_clients",
      targetId: String(id),
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
