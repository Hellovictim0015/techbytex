import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { getSecret } from "@/app/lib/secrets";
import { getGoogleAccessToken } from "@/app/lib/google";
import { runIntegrationTest, TESTABLE_GROUPS } from "@/app/lib/integration-tests";

export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { group } = await req.json();
  if (!TESTABLE_GROUPS.includes(group)) {
    return Response.json({ success: false, error: "Unknown integration group." }, { status: 400 });
  }

  const results = await runIntegrationTest(group, { getSecret, getGoogleAccessToken });
  await logAudit({
    adminUserId: admin.id,
    action: "integration_tested",
    targetType: "integration",
    targetId: group,
    details: { results: results.map(({ name, ok }) => ({ name, ok })) },
    ip: await getClientIp(),
  });

  return Response.json({ success: true, results });
}
