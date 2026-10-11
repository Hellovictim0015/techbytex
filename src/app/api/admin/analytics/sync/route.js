import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { syncAnalytics } from "@/app/lib/analytics";

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await syncAnalytics();
    await logAudit({
      adminUserId: admin.id,
      action: "analytics_synced",
      targetType: "analytics_snapshots",
      targetId: String(result.snapshotId),
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
