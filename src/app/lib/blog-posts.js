import { query } from "./db";
import { blogPosts as staticPosts } from "../data/blogData";
import { DEFAULT_OG_IMAGE } from "./seo";
import { stripHtml } from "./sanitize-html";

const AUTHOR = staticPosts[0]?.author || {
  name: "TechByteX Team",
  role: "Software Development",
  image: "/hello.png",
  bio: "",
};

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Maps an ai_blog_posts row (AI-generated or imported) into the shape the
// public blog components expect — the same shape as entries in blogData.js.
export function toPublicPost(row) {
  const isoDate = String(row.published_at || row.created_at).slice(0, 10);
  const words = stripHtml(row.content).split(" ").length;
  return {
    id: `db-${row.id}`,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || row.meta_description || "",
    image: row.featured_image_url || DEFAULT_OG_IMAGE,
    imageAlt: row.featured_image_alt || row.title,
    category: row.category || "Web Development",
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    faq: Array.isArray(row.faq) ? row.faq : [],
    author: AUTHOR,
    isoDate,
    date: formatDate(isoDate),
    readTime: `${Math.max(1, Math.round(words / 220))} min read`,
    featured: Boolean(row.is_featured),
    content: row.content,
  };
}

// The database (ai_blog_posts) is the source of truth for every blog post —
// imported static articles and AI-generated ones alike. If the database is
// unreachable (e.g. a deployment without a hosted DB yet) this falls back to
// the bundled blogData.js so the public blog never goes blank.
export async function getAllBlogPosts() {
  try {
    const rows = await query(
      `SELECT * FROM ai_blog_posts WHERE status = 'published' ORDER BY published_at DESC, id DESC`
    );
    return rows.map(toPublicPost);
  } catch {
    return staticPosts;
  }
}

export async function getBlogPostBySlug(slug) {
  const posts = await getAllBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
