import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { saveOutreachSettings } from "@/app/lib/outreach/settings";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

// PUT — saves Lead Outreach settings. Empty secret fields keep the stored value.
export async function PUT(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const changed = await saveOutreachSettings(body || {});
    await logAudit({
      adminUserId: admin.id,
      action: "outreach_settings_saved",
      targetType: "outreach_settings",
      // Names only — never values.
      details: { fields: Object.keys(body || {}) },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, changed });
  } catch (error) {
    return fail(error);
  }
}
