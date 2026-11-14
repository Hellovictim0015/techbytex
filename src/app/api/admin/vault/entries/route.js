import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { createEntry } from "@/app/lib/vault";

// POST { clientId, title, entryType, loginUrl, websiteUrl, username, password, notes, expiresOn }
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const result = await createEntry(body, admin.id);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_entry_created",
      targetType: "vault_entries",
      targetId: String(result.id),
      details: { clientId: body.clientId, title: String(body.title || "").slice(0, 100) },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
