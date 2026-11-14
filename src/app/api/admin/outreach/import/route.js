import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { importLeads } from "@/app/lib/outreach/leads";

// POST { rows: [{ email, businessName, name, website?, city?, country? }], source: "import" | "manual" }
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const result = await importLeads(body?.rows, body?.source);
    await logAudit({
      adminUserId: admin.id,
      action: "outreach_leads_imported",
      targetType: "outreach_leads",
      details: { source: body?.source, added: result.added, skipped: result.skipped },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
