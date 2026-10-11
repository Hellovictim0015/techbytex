import JsonLd from "../components/JsonLd";
import { categories as baseCategories } from "../data/blogData";
import { getAllBlogPosts } from "../lib/blog-posts";
import { breadcrumbSchema, createMetadata, SITE_URL } from "../lib/seo";
import BlogPageClient from "./BlogPageClient";

export const metadata = createMetadata({
  title: "Software Development Blog",
  description:
    "SEO guides and practical insights on app development, website development, AI development, ecommerce websites, React Native, Next.js, Shopify, and startup technology.",
  path: "/blog",
  keywords: ["AI development", "startup tech", "ecommerce website"],
});

// Re-check the database for newly published AI posts every 5 minutes.
export const revalidate = 300;

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  const categories = [...new Set([...baseCategories, ...blogPosts.map((p) => p.category)])];
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TechByteX Software Development Blog",
    url: `${SITE_URL}/blog`,
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blogg/${post.slug}`,
      image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
      publisher: {
        "@type": "Organization",
        name: "TechByteX",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/hello.png`,
        },
      },
      datePublished: post.isoDate,
      dateModified: post.isoDate,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]), blogSchema]} />
      <BlogPageClient posts={blogPosts} categories={categories} />
    </>
  );
}
