import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

const ALLOWED_STATUSES = new Set(["published", "draft", "rejected"]);

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
    const rows = await query("SELECT id, slug FROM ai_blog_posts WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, error: "Not found." }, { status: 404 });
    }

    await query(
      `UPDATE ai_blog_posts
       SET status = ?, published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END
       WHERE id = ?`,
      [status, status, id]
    );

    // Public blog pages are cached; refresh them so the change shows immediately.
    revalidatePath("/blog");
    revalidatePath(`/blogg/${rows[0].slug}`);
    revalidatePath("/sitemap.xml");

    await logAudit({
      adminUserId: admin.id,
      action: `blog_${status}`,
      targetType: "ai_blog_posts",
      targetId: String(id),
      details: { slug: rows[0].slug },
      ip: await getClientIp(),
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
