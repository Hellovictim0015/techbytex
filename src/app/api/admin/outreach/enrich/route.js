import { getCurrentAdmin } from "@/app/lib/auth";
import { enrichLead, nextLeadToEnrich } from "@/app/lib/outreach/leads";
import { query } from "@/app/lib/db";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

// POST { id? } — checks one lead's website (email + PageSpeed). Without an id
// it takes the next lead still waiting; the page calls it until none remain.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  try {
    const body = await req.json().catch(() => ({}));
    const id = Number(body?.id) > 0 ? Number(body.id) : await nextLeadToEnrich();
    if (id) await enrichLead(id);
    const [row] = await query("SELECT COUNT(*) AS n FROM outreach_leads WHERE enrich_status = 'pending'");
    return Response.json({ success: true, checkedId: id, remaining: Number(row.n) });
  } catch (error) {
    return fail(error, 500);
  }
}
