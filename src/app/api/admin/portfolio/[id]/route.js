import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";
import { portfolioColumnsFromBody } from "@/app/lib/portfolio";
import { moveRow } from "@/app/lib/ordering";
import { removeUploadIfUnused } from "@/app/lib/uploads";

// PATCH /api/admin/portfolio/:id  — edit any fields, or { move: "up" | "down" }
export async function PATCH(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const body = await req.json();
    const rows = await query("SELECT id, image_url FROM portfolio_projects WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }

    if (body.move === "up" || body.move === "down") {
      await moveRow("portfolio_projects", id, body.move);
    } else {
      const cols = portfolioColumnsFromBody(body);
      const keys = Object.keys(cols);
      if (keys.length === 0) throw new Error("Nothing to update.");
      await query(
        `UPDATE portfolio_projects SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
        [...keys.map((k) => cols[k]), id]
      );
      if (cols.image_url && cols.image_url !== rows[0].image_url) {
        await removeUploadIfUnused(rows[0].image_url);
      }
    }

    revalidatePath("/portfolio");
    revalidatePath("/");
    await logAudit({
      adminUserId: admin.id,
      action: "portfolio_updated",
      targetType: "portfolio_projects",
      targetId: String(id),
      details: body.move ? { move: body.move } : { fields: Object.keys(body) },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const rows = await query("SELECT title, image_url FROM portfolio_projects WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }
    await query("DELETE FROM portfolio_projects WHERE id = ?", [id]);
    await removeUploadIfUnused(rows[0].image_url);
    revalidatePath("/portfolio");
    revalidatePath("/");
    await logAudit({
      adminUserId: admin.id,
      action: "portfolio_deleted",
      targetType: "portfolio_projects",
      targetId: String(id),
      details: { title: rows[0].title },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
