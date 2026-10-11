import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { blogPosts } from "../../data/blogData";
import { getAllBlogPosts } from "../../lib/blog-posts";
import { absoluteUrl, breadcrumbSchema, createMetadata, faqPageSchema, SITE_URL } from "../../lib/seo";
import BlogDetailsClient from "./BlogDetailsClient";

// Static posts are prebuilt; published AI posts render on first request and
// are cached, refreshing every 5 minutes (or immediately on publish).
export const revalidate = 300;

async function getPost(id) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === decodeURIComponent(id));
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.slug }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return createMetadata({
      title: "Article Not Found",
      description: "The requested TechByteX article could not be found.",
      path: "/blog",
    });
  }

  return createMetadata({
    // createMetadata appends "| TechByteX" itself.
    title: (post.metaTitle || post.title).replace(/\s*\|\s*TechByteX\s*$/i, ""),
    description: post.metaDescription || post.excerpt,
    path: `/blogg/${post.slug}`,
    image: post.image,
    type: "article",
    publishedTime: post.isoDate,
    modifiedTime: post.isoDate,
    keywords: [post.category, ...(post.keywords || [])],
  });
}

export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  const allPosts = await getAllBlogPosts();
  const post = allPosts.find((p) => p.slug === decodeURIComponent(id));
  if (!post) notFound();

  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith("http") ? post.image : absoluteUrl(post.image),
    url: `${SITE_URL}/blogg/${post.slug}`,
    datePublished: post.isoDate,
    dateModified: post.isoDate,
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
    mainEntityOfPage: `${SITE_URL}/blogg/${post.slug}`,
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blogg/${post.slug}` },
          ]),
          articleSchema,
          ...(post.faq?.length ? [faqPageSchema(post.faq)] : []),
        ]}
      />
      <BlogDetailsClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
