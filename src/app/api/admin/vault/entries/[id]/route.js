import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { updateEntry, deleteEntry } from "@/app/lib/vault";

async function guard(params) {
  const admin = await getCurrentAdmin();
  const id = Number((await params).id);
  return { admin, id: Number.isInteger(id) && id > 0 ? id : null };
}

// PATCH — any of the POST fields; password / notes change only when sent.
export async function PATCH(req, { params }) {
  const { admin, id } = await guard(params);
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  try {
    const body = await req.json();
    await updateEntry(id, body);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_entry_updated",
      targetType: "vault_entries",
      targetId: String(id),
      // Field names only — never the values.
      details: { fields: Object.keys(body) },
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
    await deleteEntry(id);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_entry_deleted",
      targetType: "vault_entries",
      targetId: String(id),
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
