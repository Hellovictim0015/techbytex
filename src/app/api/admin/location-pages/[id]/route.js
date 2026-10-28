import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

const STATUSES = new Set(["draft", "published", "rejected"]);

// PATCH /api/admin/location-pages/:id  { status: "published" | "draft" | "rejected" }
export async function PATCH(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const { status } = await req.json();
    if (!STATUSES.has(status)) throw new Error("Invalid status.");
    const rows = await query("SELECT slug, status, body_html FROM location_pages WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }
    if (status === "published" && !rows[0].body_html) {
      throw new Error("Generate the content before publishing.");
    }
    await query(
      `UPDATE location_pages
       SET status = ?, published_at = IF(? = 'published', COALESCE(published_at, NOW()), published_at)
       WHERE id = ?`,
      [status, status, id]
    );
    revalidatePath(`/${rows[0].slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/locations");
    await logAudit({
      adminUserId: admin.id,
      action: `location_page_${status}`,
      targetType: "location_pages",
      targetId: String(id),
      details: { slug: rows[0].slug, from: rows[0].status },
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
    const rows = await query("SELECT slug FROM location_pages WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }
    await query("DELETE FROM location_pages WHERE id = ?", [id]);
    revalidatePath(`/${rows[0].slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/locations");
    await logAudit({
      adminUserId: admin.id,
      action: "location_page_deleted",
      targetType: "location_pages",
      targetId: String(id),
      details: { slug: rows[0].slug },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
