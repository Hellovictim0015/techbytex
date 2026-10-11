import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";
import { isProtectedPage } from "@/app/lib/protected-pages";

const ALLOWED_STATUSES = new Set(["approved", "rejected", "applied"]);

export async function PATCH(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();
  if (!ALLOWED_STATUSES.has(status)) {
    return Response.json({ success: false, error: "Invalid status." }, { status: 400 });
  }

  try {
    const rows = await query(
      "SELECT id, status, page_path FROM ai_recommendations WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }

    if (status === "applied" && isProtectedPage(rows[0].page_path)) {
      return Response.json(
        { success: false, error: "This page is protected and cannot be auto-applied." },
        { status: 403 }
      );
    }

    if (status === "applied") {
      // Applying is a manual, reviewed action — the AI never auto-applies changes.
      // The actual page/content mutation for a given recommendation type is wired
      // up per-type in later phases; here we only record that a human approved
      // and marked it applied.
      await query(
        "UPDATE ai_recommendations SET status = ?, reviewed_by = ?, reviewed_at = NOW(), applied_at = NOW() WHERE id = ?",
        [status, admin.id, id]
      );
    } else {
      await query(
        "UPDATE ai_recommendations SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?",
        [status, admin.id, id]
      );
    }

    await logAudit({
      adminUserId: admin.id,
      action: `recommendation_${status}`,
      targetType: "ai_recommendations",
      targetId: id,
      ip: await getClientIp(),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
