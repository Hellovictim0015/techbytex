import { getAllBlogPosts } from "./lib/blog-posts";
import { cities } from "./data/cities";
import { services } from "./data/services";
import { SITE_URL } from "./lib/seo";
import { getPublishedLocationSlugs } from "./lib/location-pages";

// Picks up newly published AI blog posts (refreshed every 5 minutes or on publish).
export const revalidate = 300;

export default async function sitemap() {
  const [blogPosts, locationPages] = await Promise.all([getAllBlogPosts(), getPublishedLocationSlugs()]);
  const now = new Date();
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/web-development-chhattisgarh", changeFrequency: "monthly", priority: 0.9 },
    { path: "/locations", changeFrequency: "weekly", priority: 0.8 },
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
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    })),
    ...cities.map((city) => ({
      url: `${SITE_URL}/web-development-${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    })),
    ...locationPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: new Date(page.updated || now),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blogg/${post.slug}`,
      lastModified: new Date(post.isoDate || now),
      changeFrequency: "monthly",
      priority: post.featured ? 0.85 : 0.7,
    })),
  ];
}
