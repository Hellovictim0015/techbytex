import { getAllBlogPosts } from "@/app/lib/blog-posts";

export const revalidate = 300;

// GET /api/blogs — published posts (summary only; fetch one by slug for content).
// Optional ?category=Web%20Development filter.
export async function GET(request) {
  const category = new URL(request.url).searchParams.get("category");
  const posts = await getAllBlogPosts();
  const filtered = category ? posts.filter((p) => p.category === category) : posts;

  return Response.json({
    success: true,
    count: filtered.length,
    posts: filtered.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      image: post.image,
      date: post.isoDate,
      readTime: post.readTime,
      featured: post.featured,
      url: `/blogg/${post.slug}`,
    })),
  });
}
