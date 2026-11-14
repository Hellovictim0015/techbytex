import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { updateLead, deleteLead } from "@/app/lib/outreach/leads";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

async function idFrom(params) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// PATCH { email, status, draftSubject, draftBody, draftStatus }
export async function PATCH(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  const id = await idFrom(params);
  if (!id) return fail(new Error("Bad id."));
  try {
    await updateLead(id, (await req.json()) || {});
    return Response.json({ success: true });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  const id = await idFrom(params);
  if (!id) return fail(new Error("Bad id."));
  try {
    await deleteLead(id);
    await logAudit({ adminUserId: admin.id, action: "outreach_lead_deleted", targetType: "outreach_leads", targetId: String(id), ip: await getClientIp() });
    return Response.json({ success: true });
  } catch (error) {
    return fail(error);
  }
}
