import { getAllBlogPosts } from "./lib/blog-posts";
import { getVisiblePortfolio } from "./lib/portfolio";
import { cities } from "./data/cities";
import { services } from "./data/services";
import { SITE_URL } from "./lib/seo";

// Picks up newly published AI blog posts (refreshed every 5 minutes or on publish).
export const revalidate = 300;

// Only pages we want indexed. Removed location pages are left out, and merged
// blog posts never come back from getAllBlogPosts (see lib/retired-urls.mjs).
// Static pages carry no lastmod — a build timestamp is not a real "content
// changed" date; blog posts use their publish date.
export default async function sitemap() {
  const [blogPosts, projects] = await Promise.all([getAllBlogPosts(), getVisiblePortfolio()]);
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/web-development-chhattisgarh", changeFrequency: "monthly", priority: 0.9 },
    { path: "/technology-insights", changeFrequency: "monthly", priority: 0.6 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/portfolio", changeFrequency: "weekly", priority: 0.85 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/book-demo", changeFrequency: "monthly", priority: 0.85 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { path: "/app-development-bhilai", changeFrequency: "monthly", priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      changeFrequency: "monthly",
      priority: 0.85,
    })),
    ...cities.map((city) => ({
      url: `${SITE_URL}/web-development-${city.slug}`,
      changeFrequency: "monthly",
      priority: 0.75,
    })),
    ...projects
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${SITE_URL}/portfolio/${p.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.isoDate ? new Date(post.isoDate) : undefined,
      changeFrequency: "monthly",
      priority: post.featured ? 0.85 : 0.7,
    })),
  ];
}
