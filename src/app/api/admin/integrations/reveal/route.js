import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { getSecret, INTEGRATION_FIELDS } from "@/app/lib/secrets";

const ALLOWED_KEYS = new Set(INTEGRATION_FIELDS.map((f) => f.key));

// Returns one integration value in full so the admin can copy it to the clipboard.
// Authenticated admins only; every reveal is audit-logged (key name only, never the value).
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await req.json();
  if (!ALLOWED_KEYS.has(key)) {
    return Response.json({ success: false, error: "Unknown integration key." }, { status: 400 });
  }

  try {
    const value = await getSecret(key);
    if (!value) {
      return Response.json({ success: false, error: "Not set." }, { status: 404 });
    }
    await logAudit({
      adminUserId: admin.id,
      action: "integration_key_copied",
      targetType: "ai_settings",
      targetId: key,
      ip: await getClientIp(),
    });
    return Response.json({ success: true, value }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
