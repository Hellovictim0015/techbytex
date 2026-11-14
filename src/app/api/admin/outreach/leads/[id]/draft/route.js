import { getCurrentAdmin } from "@/app/lib/auth";
import { generateDraft } from "@/app/lib/outreach/leads";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

async function idFrom(params) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// POST — asks the AI for a personal email for this lead (saved as a draft).
export async function POST(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  const id = await idFrom(params);
  if (!id) return fail(new Error("Bad id."));
  try {
    const email = await generateDraft(id);
    return Response.json({ success: true, ...email });
  } catch (error) {
    return fail(error);
  }
}
