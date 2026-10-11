import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { getIntegrationStatuses, setIntegrationValue, INTEGRATION_FIELDS } from "@/app/lib/secrets";

const ALLOWED_KEYS = new Set(INTEGRATION_FIELDS.map((f) => f.key));

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const statuses = await getIntegrationStatuses();
    return Response.json({ success: true, statuses });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { key, value } = await req.json();
  if (!ALLOWED_KEYS.has(key)) {
    return Response.json({ success: false, error: "Unknown integration key." }, { status: 400 });
  }

  try {
    await setIntegrationValue(key, String(value || "").trim());
    // Never log the secret value itself, only which key changed.
    await logAudit({
      adminUserId: admin.id,
      action: value ? "integration_key_set" : "integration_key_cleared",
      targetType: "ai_settings",
      targetId: key,
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
