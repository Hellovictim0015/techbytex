import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { createClient } from "@/app/lib/vault";

// POST { name, contact, notes } — a new client (category) to save logins under.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const result = await createClient(body);
    await logAudit({
      adminUserId: admin.id,
      action: "vault_client_created",
      targetType: "vault_clients",
      targetId: String(result.id),
      details: { name: String(body.name || "").slice(0, 100) },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
