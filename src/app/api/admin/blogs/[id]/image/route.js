import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";
import { generateImage, imageSceneForPost } from "@/app/lib/blog-generator";
import { saveUpload, removeUploadIfUnused } from "@/app/lib/uploads";

export const maxDuration = 180;

// POST /api/admin/blogs/:id/image — replaces the featured image with a new
// realistic AI photo. The old file is deleted once nothing uses it.
export async function POST(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const rows = await query("SELECT id, slug, title, excerpt, featured_image_url FROM ai_blog_posts WHERE id = ?", [id]);
    const post = rows[0];
    if (!post) return Response.json({ success: false, error: "Not found." }, { status: 404 });

    const { b64, ext } = await generateImage(imageSceneForPost(post));
    const url = await saveUpload(Buffer.from(b64, "base64"), { folder: "blog", ext, name: post.slug });
    await query("UPDATE ai_blog_posts SET featured_image_url = ? WHERE id = ?", [url, id]);
    await removeUploadIfUnused(post.featured_image_url);

    revalidatePath("/blog");
    revalidatePath(`/blogg/${post.slug}`);
    await logAudit({
      adminUserId: admin.id,
      action: "blog_image_regenerated",
      targetType: "ai_blog_posts",
      targetId: String(id),
      details: { url },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, url });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
