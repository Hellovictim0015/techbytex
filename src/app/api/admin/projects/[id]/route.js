import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";
import { cleanUrl } from "@/app/lib/projects";
import { moveRow } from "@/app/lib/ordering";
import { removeUploadIfUnused } from "@/app/lib/uploads";

// PATCH /api/admin/projects/:id
//   { title?, subtitle?, image_url?, link_url?, is_visible? }  — edit fields
//   { move: "up" | "down" }                                     — reorder
export async function PATCH(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const body = await req.json();
    const rows = await query("SELECT id, image_url FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }

    if (body.move === "up" || body.move === "down") {
      await moveRow("projects", id, body.move);
    } else {
      const sets = [];
      const values = [];
      if (body.title !== undefined) {
        const title = String(body.title).trim().slice(0, 255);
        if (!title) throw new Error("Title is required.");
        sets.push("title = ?");
        values.push(title);
      }
      if (body.subtitle !== undefined) {
        sets.push("subtitle = ?");
        values.push(String(body.subtitle).trim().slice(0, 255) || null);
      }
      if (body.image_url !== undefined) {
        sets.push("image_url = ?");
        values.push(cleanUrl(body.image_url, { required: true }));
      }
      if (body.link_url !== undefined) {
        sets.push("link_url = ?");
        values.push(cleanUrl(body.link_url));
      }
      if (body.is_visible !== undefined) {
        sets.push("is_visible = ?");
        values.push(body.is_visible ? 1 : 0);
      }
      if (sets.length === 0) throw new Error("Nothing to update.");
      await query(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`, [...values, id]);
      if (body.image_url !== undefined && body.image_url !== rows[0].image_url) {
        await removeUploadIfUnused(rows[0].image_url);
      }
    }

    revalidatePath("/");
    await logAudit({
      adminUserId: admin.id,
      action: "project_updated",
      targetType: "projects",
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
    const rows = await query("SELECT title, image_url FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }
    await query("DELETE FROM projects WHERE id = ?", [id]);
    await removeUploadIfUnused(rows[0].image_url);
    revalidatePath("/");
    await logAudit({
      adminUserId: admin.id,
      action: "project_deleted",
      targetType: "projects",
      targetId: String(id),
      details: { title: rows[0].title },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
