import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { runSeoAnalysis } from "@/app/lib/seo-analysis";

export const maxDuration = 120;

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runSeoAnalysis({ adminUserId: admin.id });
    await logAudit({
      adminUserId: admin.id,
      action: "ai_seo_analysis_run",
      targetType: "ai_analysis_reports",
      targetId: String(result.reportId),
      details: { inserted: result.inserted, skipped: result.skipped },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
