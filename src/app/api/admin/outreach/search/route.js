import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { searchAndSave } from "@/app/lib/outreach/leads";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

// POST { country, city, category, keyword, maxResults } — Google Places search.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const result = await searchAndSave(body || {});
    await logAudit({
      adminUserId: admin.id,
      action: "outreach_search",
      targetType: "outreach_leads",
      details: { city: body.city, country: body.country, category: body.keyword || body.category, ...result },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, ...result });
  } catch (error) {
    return fail(error);
  }
}
