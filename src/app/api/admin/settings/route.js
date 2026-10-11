import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

const ALLOWED_KEYS = new Set(["auto_publish_blogs", "daily_blog_count", "ai_provider"]);

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await query("SELECT setting_key, setting_value FROM ai_settings");
    const settings = {};
    for (const row of rows) {
      // mysql2 already deserializes JSON columns into native JS values.
      settings[row.setting_key] = row.setting_value;
    }
    return Response.json({ success: true, settings });
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
    return Response.json({ success: false, error: "Unknown setting key." }, { status: 400 });
  }

  try {
    await query(
      `INSERT INTO ai_settings (setting_key, setting_value, updated_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)`,
      [key, JSON.stringify(value), admin.id]
    );
    await logAudit({
      adminUserId: admin.id,
      action: "settings_changed",
      targetType: "ai_settings",
      targetId: key,
      details: { value },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
