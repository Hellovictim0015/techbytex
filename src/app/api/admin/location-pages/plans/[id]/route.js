import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

// DELETE /api/admin/location-pages/plans/:id — removes a place and all its pages.
export async function DELETE(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const plans = await query("SELECT city FROM location_plans WHERE id = ?", [id]);
    if (plans.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }
    const pages = await query("SELECT slug FROM location_pages WHERE plan_id = ?", [id]);
    await query("DELETE FROM location_plans WHERE id = ?", [id]);
    for (const p of pages) revalidatePath(`/${p.slug}`);
    revalidatePath("/sitemap.xml");
    await logAudit({
      adminUserId: admin.id,
      action: "location_plan_deleted",
      targetType: "location_plans",
      targetId: String(id),
      details: { city: plans[0].city, pages: pages.length },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
