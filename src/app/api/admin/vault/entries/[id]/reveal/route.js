import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { revealEntry } from "@/app/lib/vault";

// POST — returns the decrypted password and notes of one entry. Every reveal
// is audit-logged (which entry, never the value).
export async function POST(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ success: false, error: "Bad id." }, { status: 400 });
  }
  try {
    const secret = await revealEntry(id);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_password_revealed",
      targetType: "vault_entries",
      targetId: String(id),
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ...secret }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
