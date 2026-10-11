import { destroySession, getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";

export async function POST() {
  const admin = await getCurrentAdmin();
  await destroySession();
  if (admin) {
    await logAudit({
      adminUserId: admin.id,
      action: "admin_logout",
      ip: await getClientIp(),
    });
  }
  return Response.json({ success: true });
}
