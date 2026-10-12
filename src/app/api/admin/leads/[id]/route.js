import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

const ALLOWED_STATUSES = new Set(["new", "contacted", "closed", "spam"]);

// PATCH /api/admin/leads/:id  { status?, notes? }
export async function PATCH(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, notes } = await req.json().catch(() => ({}));
  if (status !== undefined && !ALLOWED_STATUSES.has(status)) {
    return Response.json({ success: false, error: "Invalid status." }, { status: 400 });
  }
  if (status === undefined && notes === undefined) {
    return Response.json({ success: false, error: "Nothing to update." }, { status: 400 });
  }

  try {
    const result = await query(
      `UPDATE form_submissions
       SET status = COALESCE(?, status), notes = COALESCE(?, notes)
       WHERE id = ?`,
      [status ?? null, notes === undefined ? null : String(notes).slice(0, 5000), id]
    );
    if (result.affectedRows === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }
    await logAudit({
      adminUserId: admin.id,
      action: "lead_updated",
      targetType: "form_submissions",
      targetId: String(id),
      details: { status, notesChanged: notes !== undefined },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
