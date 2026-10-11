import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { generateBlogPost } from "@/app/lib/blog-generator";

// Text + image generation together can take 1-2 minutes.
export const maxDuration = 300;

export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : undefined);
  const topic = str(body.topic, 300) || "";

  try {
    const result = await generateBlogPost({
      topic,
      targetKeyword: str(body.targetKeyword, 200),
      secondaryKeywords: Array.isArray(body.secondaryKeywords)
        ? body.secondaryKeywords.filter((k) => typeof k === "string").slice(0, 8).map((k) => k.slice(0, 100))
        : undefined,
      angle: str(body.angle, 500),
    });
    await logAudit({
      adminUserId: admin.id,
      action: "blog_generated",
      targetType: "ai_blog_posts",
      targetId: String(result.postId),
      details: { slug: result.slug, words: result.words, image: result.image },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
