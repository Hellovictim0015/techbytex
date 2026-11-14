import { memberByToken, updateLeadAsMember } from "@/app/lib/team-leads";

// POST { status, note } — a team member updates one of their own leads.
// The private link token is the only credential, so it is checked on every call.
export async function POST(req, { params }) {
  const { token, id } = await params;
  const member = await memberByToken(token);
  if (!member) {
    return Response.json({ success: false, error: "This link is no longer active." }, { status: 404 });
  }
  const leadId = Number(id);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return Response.json({ success: false, error: "Bad lead." }, { status: 400 });
  }
  try {
    const body = await req.json();
    await updateLeadAsMember(member, leadId, { status: body.status, note: body.note });
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
