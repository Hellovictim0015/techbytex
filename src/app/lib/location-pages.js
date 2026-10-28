import { cache } from "react";
import { query, withTransaction } from "./db";
import { generateJson } from "./ai";
import { sanitizeHtml, stripHtml } from "./sanitize-html";
import { getLatestSeoSnapshot, findOpportunities } from "./search-console";
import { getLatestAnalyticsSnapshot } from "./analytics";
import { services } from "../data/services";
import { cities } from "../data/cities";

const SUGGESTIONS_REPORT = "location_suggestions";
const PRIORITIES = new Set(["low", "medium", "high"]);
// Pages of one plan sharing more words than this are flagged for a rewrite.
export const SIMILARITY_WARNING = 0.45;

const BUSINESS =
  "TechByteX — website, mobile app (React Native), ecommerce, AI and custom software development company based in Dalli Rajhara, Chhattisgarh, India (phone +91 8827219873). Works with clients remotely across India and abroad over calls, video meetings and WhatsApp; it has no office outside Dalli Rajhara.";

// URL prefix per service. Website development keeps the existing
// /web-development-{city} pattern and app development matches
// /app-development-bhilai so new pages line up with the ones that already rank.
const URL_PREFIX = {
  "website-development": "web-development",
  "ecommerce-development": "ecommerce-website-development",
  "mobile-app-development": "app-development",
};

export const LOCATION_SERVICES = services.map((s) => ({
  slug: s.slug,
  label: s.title,
  prefix: URL_PREFIX[s.slug] || s.slug,
}));
const SERVICE_BY_SLUG = new Map(LOCATION_SERVICES.map((s) => [s.slug, s]));

// Top-level paths that already exist as real folders in src/app — a location
// page must never shadow (or be shadowed by) one of these.
const RESERVED_SLUGS = new Set([
  "about", "admin", "api", "blog", "blogg", "book-demo", "contact", "cookie-policy",
  "locations", "portfolio", "privacy", "services", "technology-insights", "terms", "uploads",
  "app-development-bhilai", "web-development-chhattisgarh",
  ...cities.map((c) => `web-development-${c.slug}`),
]);

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildSlug(serviceSlug, city, area) {
  const service = SERVICE_BY_SLUG.get(serviceSlug);
  if (!service) return null;
  const parts = [service.prefix, area && slugify(area), slugify(city)].filter(Boolean);
  return parts.join("-").slice(0, 180);
}

const str = (v, max) => (typeof v === "string" ? stripHtml(v).trim().slice(0, max) : "");
const strList = (v, maxItems, maxLen) =>
  (Array.isArray(v) ? v : [])
    .map((x) => str(x, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
const asArray = (v) => (Array.isArray(v) ? v : []);
const pct = (v) => `${(Number(v) * 100).toFixed(1)}%`;

function placeLabel({ city, district, state, country }) {
  return [city, district && district !== city ? district : null, state, country].filter(Boolean).join(", ");
}

// ---------------------------------------------------------------------------
// Public site
// ---------------------------------------------------------------------------

// Published page by slug (null when missing, unpublished, or the DB is down).
export const getPublishedLocationPage = cache(async (slug) => {
  // Bot probes like /wp-login.php never need a database round trip.
  if (!/^[a-z0-9-]{3,191}$/.test(slug)) return null;
  try {
    const rows = await query(
      `SELECT p.*, l.country, l.state, l.district, l.city
       FROM location_pages p JOIN location_plans l ON l.id = p.plan_id
       WHERE p.slug = ? AND p.status = 'published'`,
      [slug]
    );
    if (!rows[0]) return null;
    const related = await query(
      `SELECT slug, h1, service_label, area_name FROM location_pages
       WHERE plan_id = ? AND status = 'published' AND id <> ?
       ORDER BY FIELD(priority, 'high', 'medium', 'low'), id LIMIT 24`,
      [rows[0].plan_id, rows[0].id]
    );
    return { ...rows[0], related };
  } catch {
    return null;
  }
});

// Published pages grouped by place, for the /locations hub.
export async function getPublishedLocationsByPlace() {
  try {
    const rows = await query(
      `SELECT p.slug, p.service_label, p.area_name, l.id AS plan_id, l.country, l.state, l.city
       FROM location_pages p JOIN location_plans l ON l.id = p.plan_id
       WHERE p.status = 'published'
       ORDER BY l.country, l.state, l.city, p.area_name IS NOT NULL, p.service_label, p.area_name`
    );
    const places = new Map();
    for (const r of rows) {
      if (!places.has(r.plan_id)) {
        places.set(r.plan_id, { city: r.city, state: r.state, country: r.country, pages: [] });
      }
      places.get(r.plan_id).pages.push({
        href: `/${r.slug}`,
        label: r.area_name ? `${r.service_label} in ${r.area_name}` : r.service_label,
      });
    }
    return [...places.values()];
  } catch {
    return [];
  }
}

// City-wide published pages, offered to the AI blog writer as internal links.
export async function getLocationLinksForBlogs(limit = 25) {
  try {
    const rows = await query(
      `SELECT p.slug, p.service_label, l.city FROM location_pages p JOIN location_plans l ON l.id = p.plan_id
       WHERE p.status = 'published' AND p.area_name IS NULL
       ORDER BY FIELD(p.priority, 'high', 'medium', 'low'), p.id DESC LIMIT ?`,
      [String(limit)]
    );
    return rows.map((r) => ({ path: `/${r.slug}`, label: `${r.service_label} in ${r.city}` }));
  } catch {
    return [];
  }
}

export async function getPublishedLocationSlugs() {
  try {
    return await query(
      "SELECT slug, COALESCE(published_at, updated_at) AS updated FROM location_pages WHERE status = 'published'"
    );
  } catch {
    return [];
  }
}

// Shape CityLandingPage expects, from a location_pages row (+ plan columns).
export function toLandingProps(row) {
  const name = row.area_name ? `${row.area_name}, ${row.city}` : row.city;
  return {
    city: {
      slug: row.slug,
      name,
      district: row.district || row.city,
      region: row.region_label || placeLabel(row),
      tagline: row.meta_description || row.h1,
      intro: asArray(row.intro),
      industries: asArray(row.industries),
      nearbyAreas: asArray(row.nearby_areas),
      faqs: asArray(row.faqs),
    },
    path: `/${row.slug}`,
    h1: row.h1,
    serviceLabel: row.service_label,
    bodyHtml: row.body_html,
    heroText: `TechByteX builds ${row.service_label.toLowerCase()} projects for businesses in ${name}${
      row.state ? `, ${row.state}` : ""
    } — fast, SEO-ready and built to bring enquiries, with the whole project run remotely over calls and video meetings.`,
    relatedLinks: asArray(row.related).map((r) => ({
      href: `/${r.slug}`,
      label: r.area_name ? `${r.service_label} in ${r.area_name}` : `${r.service_label} in ${row.city}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// Admin listing
// ---------------------------------------------------------------------------

export async function getPlansForAdmin() {
  const [plans, pages] = await Promise.all([
    query("SELECT * FROM location_plans ORDER BY id DESC"),
    query(
      `SELECT id, plan_id, slug, service_slug, service_label, area_name, target_keyword, reason,
              priority, h1, word_count, similarity, status, error_message, published_at, updated_at
       FROM location_pages ORDER BY FIELD(priority, 'high', 'medium', 'low'), id`
    ),
  ]);
  return plans.map((plan) => ({
    ...plan,
    pages: pages
      .filter((p) => p.plan_id === plan.id)
      .map((p) => ({ ...p, similarity: p.similarity == null ? null : Number(p.similarity) })),
  }));
}

// ---------------------------------------------------------------------------
// AI: where should we build pages next?
// ---------------------------------------------------------------------------

async function existingLocations() {
  const rows = await query("SELECT country, state, district, city FROM location_plans").catch(() => []);
  return [
    ...cities.map((c) => `${c.name}, ${c.district}, Chhattisgarh, India`),
    ...rows.map(placeLabel),
  ];
}

// Analyses Search Console + Analytics data and proposes new places to target.
// Saved as an analysis report so the admin page shows it without a new AI call.
export async function suggestLocations({ adminUserId = null } = {}) {
  const [seo, analytics, covered] = await Promise.all([
    getLatestSeoSnapshot().catch(() => null),
    getLatestAnalyticsSnapshot().catch(() => null),
    existingLocations(),
  ]);
  if (!seo && !analytics) {
    throw new Error('No Search Console or Analytics data yet. Click "Sync now" on the SEO and Analytics pages first.');
  }

  const input = {
    business: BUSINESS,
    alreadyTargetedLocations: covered,
    services: LOCATION_SERVICES.map((s) => s.label),
    searchConsole: seo && {
      period: `${seo.date_range_start} to ${seo.date_range_end}`,
      queries: seo.keywords.slice(0, 120).map((k) => ({
        query: k.query,
        impressions: k.impressions,
        clicks: k.clicks,
        ctr: pct(k.ctr),
        position: Number(k.position).toFixed(1),
      })),
      strikingDistanceQueries: findOpportunities(seo).strikingKeywords.map((k) => k.query),
      topPages: seo.pages.slice(0, 30).map((p) => ({
        page: p.page_path,
        impressions: p.impressions,
        clicks: p.clicks,
        position: Number(p.position).toFixed(1),
      })),
    },
    analytics: analytics && {
      period: `${analytics.date_range_start} to ${analytics.date_range_end}`,
      visitorCities: analytics.raw_data?.cities || [],
      visitorCountries: analytics.raw_data?.countries || [],
      topPages: analytics.pages.slice(0, 20),
      trafficSources: analytics.sources,
    },
  };

  const system = `You are a local SEO strategist for a small Indian software agency that wants to grow beyond Chhattisgarh. Using ONLY the data provided, recommend the next places to build local landing pages for.
Return ONLY JSON: {"summary": string, "locations": [{"country": string, "state": string|null, "district": string|null, "city": string, "areas": string[] (3-8 well-known business localities in that city), "services": string[] (labels from the services list that fit this place best), "priority": "high"|"medium"|"low", "estimated_pages": number (20-40: one page per relevant service city-wide plus locality pages for the main services; bigger cities get more), "reason": string (1-2 sentences citing the specific data: queries, impressions, visitor cities/countries)}]}.
Rules:
- 6 to 10 locations, best first. Prefer places that already show demand in the data (queries naming the place, visitor cities/countries, pages with impressions), then large business cities near existing demand.
- Mix: mostly Indian cities outside Chhattisgarh, plus international cities only if the data shows visitors or queries from that country.
- NEVER suggest a place in alreadyTargetedLocations.
- Use correct real names for state and district. Do not invent data or numbers.
- "summary": 2-3 sentences on where the demand is and the expansion strategy.`;

  const output = await generateJson({
    jobType: "location_suggestions",
    system,
    user: JSON.stringify(input),
    inputSummary: `Location suggestions from ${seo?.keywords.length || 0} queries, ${
      input.analytics?.visitorCities.length || 0
    } visitor cities, ${covered.length} covered places`,
  });

  const locations = asArray(output.locations)
    .filter((l) => l?.city && l?.country)
    .map((l) => ({
      country: str(l.country, 100),
      state: str(l.state, 150) || null,
      district: str(l.district, 150).replace(/\s+district$/i, "") || null,
      city: str(l.city, 150),
      areas: strList(l.areas, 10, 100),
      services: strList(l.services, 12, 100),
      priority: PRIORITIES.has(l.priority) ? l.priority : "medium",
      estimated_pages: Math.min(Math.max(Number(l.estimated_pages) || 30, 5), 50),
      reason: str(l.reason, 600),
    }))
    .slice(0, 10);

  const report = await query(
    "INSERT INTO ai_analysis_reports (report_type, summary, data, created_by) VALUES (?, ?, ?, ?)",
    [SUGGESTIONS_REPORT, String(output.summary || ""), JSON.stringify({ locations }), adminUserId]
  );
  return { reportId: report.insertId, summary: output.summary || "", locations };
}

export async function getLatestLocationSuggestions() {
  const rows = await query(
    `SELECT id, summary, data, created_at FROM ai_analysis_reports
     WHERE report_type = ? ORDER BY id DESC LIMIT 1`,
    [SUGGESTIONS_REPORT]
  );
  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    summary: rows[0].summary,
    createdAt: rows[0].created_at,
    locations: asArray(rows[0].data?.locations),
  };
}

// ---------------------------------------------------------------------------
// AI: place pickers (states → districts → cities → localities)
// ---------------------------------------------------------------------------

export async function listPlaces({ country, state, district, city }) {
  if (!country) throw new Error("Pick a country first.");
  const level = city
    ? "localities"
    : district
      ? "cities"
      : state
        ? "districts"
        : "states";
  const asks = {
    states: `All states / provinces / regions of ${country}.`,
    districts: `All districts (or counties / equivalent second-level divisions) of ${state}, ${country}.`,
    cities: `The main cities and towns of ${district} district, ${state}, ${country}, largest first (max 40).`,
    localities: `The best-known commercial and residential localities / neighbourhoods of ${city}${
      district ? `, ${district}` : ""
    }${state ? `, ${state}` : ""}, ${country}, most business-relevant first (max 30).`,
  };
  const output = await generateJson({
    jobType: "location_places",
    system:
      'You are a geography reference. Return ONLY JSON: {"places": string[]}. Use the commonly used English names, no duplicates, no descriptions. Return an empty array if you are not sure the place exists.',
    user: asks[level],
    inputSummary: asks[level],
  });
  return { level, places: strList(output.places, 60, 120) };
}

// ---------------------------------------------------------------------------
// AI: plan the pages for one place
// ---------------------------------------------------------------------------

async function takenSlugs() {
  const rows = await query("SELECT slug FROM location_pages");
  return new Set([...RESERVED_SLUGS, ...rows.map((r) => r.slug)]);
}

function relevantQueries(seo, place) {
  if (!seo) return [];
  const names = [place.city, place.district, place.state]
    .filter(Boolean)
    .map((n) => n.toLowerCase());
  const local = seo.keywords.filter((k) => names.some((n) => k.query.toLowerCase().includes(n)));
  const rest = seo.keywords.filter((k) => !local.includes(k)).slice(0, 40);
  return [...local, ...rest].slice(0, 80).map((k) => ({
    query: k.query,
    impressions: k.impressions,
    clicks: k.clicks,
    position: Number(k.position).toFixed(1),
  }));
}

// Asks the AI for the best set of service × area pages for one place and saves
// them as 'planned' rows. No content is written yet — that's one call per page.
export async function planLocationPages({
  country,
  state,
  district,
  city,
  areas = [],
  serviceSlugs = [],
  count = 35,
  notes = "",
  adminUserId = null,
}) {
  if (!country || !city) throw new Error("Country and city are required.");
  district = district?.replace(/\s+district$/i, "") || district;
  const place = { country, state, district, city };
  const allowedServices = serviceSlugs.length
    ? LOCATION_SERVICES.filter((s) => serviceSlugs.includes(s.slug))
    : LOCATION_SERVICES;
  if (allowedServices.length === 0) throw new Error("Pick at least one service.");
  const target = Math.min(Math.max(Number(count) || 35, 5), 50);

  const seo = await getLatestSeoSnapshot().catch(() => null);

  const system = `You are a local SEO strategist planning landing pages for ${placeLabel(place)}.
Business: ${BUSINESS}
Return ONLY JSON: {"summary": string, "pages": [{"service_slug": string, "area": string|null, "target_keyword": string, "secondary_keywords": string[] (3-6), "priority": "high"|"medium"|"low", "reason": string (1 sentence)}]}.
Rules:
- About ${target} pages. Each page must target a DIFFERENT search intent; never two pages for the same service + area.
- service_slug must be one of: ${JSON.stringify(allowedServices.map((s) => s.slug))}.
- area = null for a city-wide page, or the name of one real locality inside ${city}. Give every chosen service a city-wide page first, then add locality pages only for the services people actually search for by locality (mostly website development and app development) in the busiest business localities.
${areas.length ? `- Prefer these localities chosen by the admin: ${JSON.stringify(areas)}.` : ""}
- target_keyword = how a business owner would really search, e.g. "website development company in ${city}". Use the Search Console queries to judge demand when they mention this place.
- priority high = clear demand / commercial intent; low = speculative long tail.
- "summary": 2 sentences on the plan.${notes ? `\nAdmin notes: ${notes}` : ""}`;

  const output = await generateJson({
    jobType: "location_plan",
    system,
    user: JSON.stringify({ place, searchConsoleQueries: relevantQueries(seo, place) }),
    inputSummary: `Location plan: ${placeLabel(place)} (${target} pages)`,
  });

  const taken = await takenSlugs();
  const planned = [];
  const skipped = [];
  for (const p of asArray(output.pages)) {
    const service = SERVICE_BY_SLUG.get(p?.service_slug);
    if (!service || !allowedServices.includes(service) || !p.target_keyword) continue;
    const area = str(p.area, 150) || null;
    const slug = buildSlug(service.slug, city, area);
    if (!slug || taken.has(slug)) {
      skipped.push(slug);
      continue;
    }
    taken.add(slug);
    planned.push({
      slug,
      service,
      area,
      target_keyword: str(p.target_keyword, 255),
      secondary_keywords: strList(p.secondary_keywords, 8, 120),
      priority: PRIORITIES.has(p.priority) ? p.priority : "medium",
      reason: str(p.reason, 600),
    });
  }
  if (planned.length === 0) {
    throw new Error(
      skipped.length
        ? "Every page the AI planned already exists for this place."
        : "The AI returned no usable pages. Try again."
    );
  }

  const planId = await withTransaction(async (conn) => {
    const [plan] = await conn.execute(
      `INSERT INTO location_plans (country, state, district, city, notes, ai_summary, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [country, state || null, district || null, city, notes || null, str(output.summary, 2000) || null, adminUserId]
    );
    for (const p of planned) {
      await conn.execute(
        `INSERT INTO location_pages
           (plan_id, slug, service_slug, service_label, area_name, target_keyword, secondary_keywords, reason, priority)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plan.insertId,
          p.slug,
          p.service.slug,
          p.service.label,
          p.area,
          p.target_keyword,
          JSON.stringify(p.secondary_keywords),
          p.reason,
          p.priority,
        ]
      );
    }
    return plan.insertId;
  });

  return { planId, planned: planned.length, skipped: skipped.length, summary: output.summary || "" };
}

// ---------------------------------------------------------------------------
// AI: write one page
// ---------------------------------------------------------------------------

const SIM_STOP = new Set(["that", "with", "from", "your", "have", "this", "will", "they", "their", "more", "about", "into", "what", "when", "which", "techbytex"]);

function wordSet(text, placeWords) {
  return new Set(
    stripHtml(text)
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !SIM_STOP.has(w) && !placeWords.has(w))
  );
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / (a.size + b.size - shared);
}

function pageText(row) {
  return [...asArray(row.intro), row.body_html || "", ...asArray(row.faqs).map((f) => `${f.q} ${f.a}`)].join(" ");
}

// Writes the full content for one planned page and saves it as a draft.
export async function generateLocationPageContent(id) {
  const rows = await query(
    `SELECT p.*, l.country, l.state, l.district, l.city, l.notes
     FROM location_pages p JOIN location_plans l ON l.id = p.plan_id WHERE p.id = ?`,
    [id]
  );
  const page = rows[0];
  if (!page) throw new Error("Page not found.");
  if (page.status === "published") throw new Error("Unpublish the page before rewriting it.");

  const siblings = await query(
    `SELECT id, slug, service_slug, service_label, area_name, target_keyword, intro, body_html, faqs, status
     FROM location_pages WHERE plan_id = ? AND id <> ? AND status <> 'rejected'`,
    [page.plan_id, id]
  );
  const service = services.find((s) => s.slug === page.service_slug);
  const place = page.area_name ? `${page.area_name}, ${page.city}` : page.city;
  const internalLinks = [
    { path: `/services/${page.service_slug}`, label: page.service_label },
    ...siblings
      .filter((s) => s.status === "published" || s.status === "draft")
      .slice(0, 15)
      .map((s) => ({ path: `/${s.slug}`, label: `${s.service_label}${s.area_name ? ` in ${s.area_name}` : ""}` })),
    { path: "/portfolio", label: "Our portfolio" },
    { path: "/contact", label: "Contact TechByteX" },
  ];
  const isIndia = /^india$/i.test(page.country);

  const system = `You write local SEO landing pages for TechByteX.
Business: ${BUSINESS}
Page: "${page.service_label}" for businesses in ${placeLabel({ ...page, city: place })}. Target keyword: "${page.target_keyword}". Secondary: ${JSON.stringify(asArray(page.secondary_keywords))}.
Return ONLY JSON:
{"h1": string (<= 70 chars, contains the service and "${place}"), "region_label": string (<= 40 chars, e.g. "Commercial hub of ${page.city}"), "meta_title": string (<= 55 chars, NO brand name — it is appended automatically), "meta_description": string (140-160 chars, with a call to action), "intro": string[] (exactly 2 paragraphs, 60-100 words each), "body_html": string, "industries": [{"name": string, "note": string}] (exactly 4), "nearby_areas": string[] (6-10 real nearby localities/towns), "faqs": [{"q": string, "a": string}] (exactly 5)}
Rules:
- Write for a business owner in ${place} looking for ${page.service_label.toLowerCase()}. Be concrete about the local economy, the kinds of businesses there and what they need from this service. Use real, well-known facts about ${place} only; if unsure, stay general rather than inventing.
- body_html: 450-700 words using only <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a href>. 3-4 <h2> sections that are specific to this service in this place (e.g. what businesses here need, features we build, pricing approach, how a remote project with TechByteX works). No <h1>, no FAQ inside it.
- Add 2-3 internal links in body_html, chosen only from: ${JSON.stringify(internalLinks)}.
- HONESTY: TechByteX has no office in ${page.city}; say projects are run remotely (calls, video meetings, WhatsApp). Never invent an address, client names, projects, reviews, ratings, awards or statistics.
- Pricing: ${isIndia ? "only use the site's published starting price — a business website typically starts around ₹15,000–₹40,000 depending on pages and features; for every other service say it is quoted after a short requirement call, with no numbers." : "do not quote prices; say a fixed quote is shared after a requirement call."}
- These sibling pages exist for the same city — your page must take a clearly different angle and must not repeat their wording: ${JSON.stringify(
    siblings.map((s) => ({ service: s.service_label, area: s.area_name, keyword: s.target_keyword }))
  )}.
${service ? `- Service background: ${stripHtml(`${service.shortDesc || ""} ${service.intro?.[0] || ""}`).slice(0, 600)}` : ""}${
    page.notes ? `\n- Admin notes: ${page.notes}` : ""
  }`;

  try {
    const draft = await generateJson({
      jobType: "location_page",
      system,
      user: `Write the page for ${page.slug}.`,
      inputSummary: `Location page #${id}: ${page.slug}`,
    });

    const intro = strList(draft.intro, 3, 1500);
    const bodyHtml = sanitizeHtml(draft.body_html || "");
    const industries = asArray(draft.industries)
      .filter((i) => i?.name && i?.note)
      .slice(0, 6)
      .map((i) => ({ name: str(i.name, 120), note: str(i.note, 400) }));
    const faqs = asArray(draft.faqs)
      .filter((f) => f?.q && f?.a)
      .slice(0, 6)
      .map((f) => ({ q: str(f.q, 300), a: str(f.a, 1200) }));
    const words = stripHtml([...intro, bodyHtml, ...faqs.map((f) => `${f.q} ${f.a}`)].join(" ")).split(" ").length;
    if (!draft.h1 || intro.length === 0 || words < 400) {
      throw new Error(`AI returned an incomplete page (${words} words).`);
    }

    const placeWords = new Set(
      [page.city, page.district, page.state, page.country, ...siblings.map((s) => s.area_name), page.area_name]
        .filter(Boolean)
        .flatMap((n) => n.toLowerCase().split(/\s+/))
    );
    const mine = wordSet(pageText({ intro, body_html: bodyHtml, faqs }), placeWords);
    const similarity = siblings
      .filter((s) => s.body_html)
      .reduce((max, s) => Math.max(max, jaccard(mine, wordSet(pageText(s), placeWords))), 0);

    await query(
      `UPDATE location_pages SET
         h1 = ?, region_label = ?, meta_title = ?, meta_description = ?, intro = ?, body_html = ?,
         industries = ?, nearby_areas = ?, faqs = ?, word_count = ?, similarity = ?,
         status = 'draft', error_message = NULL
       WHERE id = ?`,
      [
        str(draft.h1, 255),
        str(draft.region_label, 150) || null,
        str(draft.meta_title, 255) || str(draft.h1, 255),
        str(draft.meta_description, 512) || null,
        JSON.stringify(intro),
        bodyHtml,
        JSON.stringify(industries),
        JSON.stringify(strList(draft.nearby_areas, 12, 100)),
        JSON.stringify(faqs),
        words,
        similarity.toFixed(3),
        id,
      ]
    );
    return { id, slug: page.slug, words, similarity };
  } catch (error) {
    await query("UPDATE location_pages SET status = 'failed', error_message = ? WHERE id = ?", [
      error.message.slice(0, 2000),
      id,
    ]).catch(() => {});
    throw error;
  }
}

// Full row for the admin preview (any status).
export async function getLocationPageForPreview(id) {
  const rows = await query(
    `SELECT p.*, l.country, l.state, l.district, l.city
     FROM location_pages p JOIN location_plans l ON l.id = p.plan_id WHERE p.id = ?`,
    [id]
  );
  if (!rows[0]) return null;
  const related = await query(
    `SELECT slug, h1, service_label, area_name FROM location_pages
     WHERE plan_id = ? AND status IN ('published', 'draft') AND id <> ? LIMIT 24`,
    [rows[0].plan_id, rows[0].id]
  );
  return { ...rows[0], related };
}
