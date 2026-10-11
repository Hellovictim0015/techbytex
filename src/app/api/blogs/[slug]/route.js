import { getBlogPostBySlug } from "@/app/lib/blog-posts";

export const revalidate = 300;

// GET /api/blogs/:slug — one published post with full HTML content and FAQ.
export async function GET(request, { params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(decodeURIComponent(slug));
  if (!post) {
    return Response.json({ success: false, error: "Not found." }, { status: 404 });
  }

  return Response.json({
    success: true,
    post: {
      slug: post.slug,
      title: post.title,
      metaTitle: post.metaTitle || null,
      metaDescription: post.metaDescription || post.excerpt,
      excerpt: post.excerpt,
      category: post.category,
      keywords: post.keywords,
      image: post.image,
      imageAlt: post.imageAlt || post.title,
      date: post.isoDate,
      readTime: post.readTime,
      author: post.author?.name,
      content: post.content,
      faq: post.faq || [],
      url: `/blogg/${post.slug}`,
    },
  });
}
