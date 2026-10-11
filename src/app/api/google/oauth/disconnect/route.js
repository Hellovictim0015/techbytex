import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { disconnectGoogle, isConnectionKind } from "@/app/lib/google";

export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { kind = "main" } = await req.json().catch(() => ({}));
  if (!isConnectionKind(kind)) {
    return Response.json({ success: false, error: "Unknown connection type." }, { status: 400 });
  }
  await disconnectGoogle(kind);
  await logAudit({
    adminUserId: admin.id,
    action: kind === "business" ? "google_business_disconnected" : "google_disconnected",
    targetType: "integration",
    targetId: kind,
    ip: await getClientIp(),
  });
  return Response.json({ success: true });
}
