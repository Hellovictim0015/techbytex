import { query } from "./db";
import { getLatestAnalyticsSnapshot } from "./analytics";
import { getLatestSeoSnapshot } from "./search-console";
import { services } from "../data/services";
import { cities } from "../data/cities";
import { blogPosts as staticPosts } from "../data/blogData";

// Pages that exist as folders in src/app (written in code, changed only by a deploy).
const CORE_PAGES = [
  { path: "/", title: "Home" },
  { path: "/about", title: "About" },
  { path: "/services", title: "Services" },
  { path: "/portfolio", title: "Portfolio" },
  { path: "/contact", title: "Contact" },
  { path: "/book-demo", title: "Book a Demo" },
  { path: "/blog", title: "Blog" },
  { path: "/locations", title: "Locations" },
  { path: "/technology-insights", title: "Technology Insights" },
  { path: "/privacy", title: "Privacy Policy" },
  { path: "/terms", title: "Terms" },
  { path: "/cookie-policy", title: "Cookie Policy" },
];

function codePages() {
  return [
    ...CORE_PAGES.map((p) => ({ ...p, type: "Core" })),
    ...services.map((s) => ({ path: `/services/${s.slug}`, title: s.title, type: "Service" })),
    { path: "/web-development-chhattisgarh", title: "Website Development in Chhattisgarh", type: "City" },
    ...cities.map((c) => ({ path: `/web-development-${c.slug}`, title: `Website Development in ${c.name}`, type: "City" })),
    { path: "/app-development-bhilai", title: "App Development in Bhilai", type: "City" },
  ].map((p) => ({ ...p, source: "code", status: "published" }));
}

// Blog posts and location pages created or managed from the admin panel.
// Imported posts started life in code (blogData.js) and are marked as such.
async function databasePages() {
  const [blogs, locations] = await Promise.all([
    query("SELECT id, slug, title, status, generated_by FROM ai_blog_posts ORDER BY id DESC").catch(() => null),
    query("SELECT id, slug, h1, target_keyword, service_label, status FROM location_pages ORDER BY id DESC").catch(() => []),
  ]);

  const blogPages = blogs
    ? blogs.map((b) => ({
        path: `/blogg/${b.slug}`,
        title: b.title,
        type: "Blog",
        source: b.generated_by === "ai" ? "admin" : "code",
        sourceNote: b.generated_by === "ai" ? "AI" : "Imported",
        status: b.status,
        editHref: `/admin/blogs/${b.id}`,
      }))
    : staticPosts.map((b) => ({
        path: `/blogg/${b.slug}`,
        title: b.title,
        type: "Blog",
        source: "code",
        status: "published",
      }));

  const locationPages = locations.map((l) => ({
    path: `/${l.slug}`,
    title: l.h1 || l.target_keyword,
    type: "Location",
    source: "admin",
    sourceNote: "AI",
    status: l.status,
    editHref: "/admin/location-pages",
  }));

  return [...blogPages, ...locationPages];
}

// "/about/" , "/about?x=1" and "/web-development-raipur#faq" all count as one page.
function normalizePath(path) {
  if (!path || !path.startsWith("/")) return null;
  let p = path.split(/[?#]/)[0];
  try {
    p = decodeURI(p);
  } catch {
    // keep the raw path
  }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

function sumBy(rows, pathKey, fields) {
  const map = new Map();
  for (const row of rows) {
    const path = normalizePath(row[pathKey]);
    if (!path) continue;
    const cur = map.get(path) || Object.fromEntries(fields.map((f) => [f, 0]));
    for (const f of fields) cur[f] += Number(row[f]) || 0;
    map.set(path, cur);
  }
  return map;
}

// Views and users per page path from the latest Analytics sync.
export async function getPageViews() {
  const analytics = await getLatestAnalyticsSnapshot().catch(() => null);
  return {
    views: sumBy(analytics?.pages || [], "path", ["views", "users"]),
    period: analytics ? `${analytics.date_range_start} to ${analytics.date_range_end}` : null,
    pageCount: analytics?.pages?.length || 0,
  };
}

// Every public page with its source (code / admin) and traffic from the latest
// Analytics (views, users) and Search Console (clicks, impressions, position) syncs.
export async function getSitePagesWithStats() {
  const [dbPages, pageViews, seo] = await Promise.all([
    databasePages(),
    getPageViews(),
    getLatestSeoSnapshot().catch(() => null),
  ]);

  const { views } = pageViews;
  const search = new Map();
  for (const p of seo?.pages || []) {
    const path = normalizePath(p.page_path);
    if (!path) continue;
    const cur = search.get(path) || { clicks: 0, impressions: 0, weighted: 0 };
    cur.clicks += Number(p.clicks) || 0;
    cur.impressions += Number(p.impressions) || 0;
    cur.weighted += (Number(p.position) || 0) * (Number(p.impressions) || 0);
    search.set(path, cur);
  }

  const pages = [...codePages(), ...dbPages].map((p) => {
    const v = views.get(p.path);
    const s = search.get(p.path);
    return {
      ...p,
      views: v?.views ?? 0,
      users: v?.users ?? 0,
      clicks: s?.clicks ?? 0,
      impressions: s?.impressions ?? 0,
      position: s && s.impressions ? Number((s.weighted / s.impressions).toFixed(1)) : null,
    };
  });

  // Paths with traffic that aren't in the inventory (old URLs, typos, removed pages).
  const known = new Set(pages.map((p) => p.path));
  const other = [...views.entries()]
    .filter(([path]) => !known.has(path) && !path.startsWith("/admin"))
    .map(([path, v]) => ({ path, views: v.views, users: v.users }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 50);

  return {
    pages,
    other,
    analyticsPeriod: pageViews.period,
    analyticsPageCount: pageViews.pageCount,
    searchPeriod: seo ? `${seo.date_range_start} to ${seo.date_range_end}` : null,
  };
}
