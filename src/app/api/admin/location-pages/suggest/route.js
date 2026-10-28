import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { suggestLocations } from "@/app/lib/location-pages";

export const maxDuration = 120;

// POST — AI reads Search Console + Analytics and proposes places to target.
export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await suggestLocations({ adminUserId: admin.id });
    await logAudit({
      adminUserId: admin.id,
      action: "location_suggestions_generated",
      targetType: "ai_analysis_reports",
      targetId: String(result.reportId),
      details: { count: result.locations.length },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
