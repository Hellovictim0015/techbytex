import { query } from "./db";
import { generateJson } from "./ai";
import { SITE_URL } from "./seo";
import { isProtectedPage, PROTECTED_PAGES } from "./protected-pages";
import { getLatestSeoSnapshot, findOpportunities } from "./search-console";

const REC_TYPES = new Set([
  "meta_title",
  "meta_description",
  "content",
  "internal_linking",
  "new_content",
  "technical",
]);
const PRIORITIES = new Set(["low", "medium", "high"]);

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// Reads the live <title> and meta description so suggestions compare against
// what Google actually sees.
async function fetchPageMeta(path) {
  try {
    const res = await fetch(`${SITE_URL}${path}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { title: null, description: null };
    const html = await res.text();
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1];
    return {
      title: title ? decodeEntities(title.trim()) : null,
      description: description ? decodeEntities(description.trim()) : null,
    };
  } catch {
    return { title: null, description: null };
  }
}

const pct = (v) => `${(v * 100).toFixed(1)}%`;

// Runs one AI SEO review over the latest Search Console snapshot and stores the
// output as pending recommendations. Nothing on the live site is changed.
export async function runSeoAnalysis({ adminUserId = null } = {}) {
  const snapshot = await getLatestSeoSnapshot();
  if (!snapshot) throw new Error("No Search Console data yet. Click \"Sync now\" on the SEO page first.");

  const { lowCtrPages, strikingKeywords } = findOpportunities(snapshot);
  const pagesToReview = [
    ...new Set([...lowCtrPages, ...snapshot.pages.slice(0, 15)].map((p) => p.page_path)),
  ]
    .filter((path) => !isProtectedPage(path))
    .slice(0, 15);

  const pageMeta = await Promise.all(
    pagesToReview.map(async (path) => {
      const metrics = snapshot.pages.find((p) => p.page_path === path);
      const meta = await fetchPageMeta(path);
      return { path, ...meta, ...metrics };
    })
  );

  const input = {
    site: SITE_URL,
    business:
      "TechByteX — website, app, ecommerce and custom software development company based in Dalli Rajhara, Chhattisgarh, India. Targets local cities in Chhattisgarh and clients across India.",
    period: `${snapshot.date_range_start} to ${snapshot.date_range_end}`,
    totals: {
      clicks: snapshot.total_clicks,
      impressions: snapshot.total_impressions,
      ctr: pct(snapshot.average_ctr),
      avgPosition: snapshot.average_position.toFixed(1),
    },
    topQueries: snapshot.keywords.slice(0, 40).map((k) => ({
      query: k.query,
      clicks: k.clicks,
      impressions: k.impressions,
      ctr: pct(k.ctr),
      position: k.position.toFixed(1),
    })),
    strikingDistanceKeywords: strikingKeywords.map((k) => ({
      query: k.query,
      impressions: k.impressions,
      position: k.position.toFixed(1),
    })),
    pages: pageMeta.map((p) => ({
      path: p.path,
      currentTitle: p.title,
      currentDescription: p.description,
      clicks: p.clicks,
      impressions: p.impressions,
      ctr: p.ctr != null ? pct(p.ctr) : null,
      position: p.position != null ? p.position.toFixed(1) : null,
    })),
  };

  const system = `You are a senior technical SEO consultant reviewing Google Search Console data for a small Indian software agency.
Return ONLY JSON: {"summary": string, "recommendations": [{"type": one of "meta_title"|"meta_description"|"content"|"internal_linking"|"new_content"|"technical", "page_path": string|null, "issue": string, "current_value": string|null, "suggested_value": string|null, "reason": string, "priority": "low"|"medium"|"high"}]}.
Rules:
- 5 to 12 recommendations, highest-impact first, each grounded in the numbers provided (cite them in "reason").
- meta_title: <= 60 characters, include the main query and "TechByteX". meta_description: 140-160 characters with a clear call to action. Put the live value in current_value.
- new_content: suggest a blog/page topic for queries with impressions but no matching page; page_path null, suggested_value = proposed title.
- Never recommend changes to these protected pages: ${PROTECTED_PAGES.join(", ")}.
- Do not invent metrics, reviews, ratings or claims. Write in English.
- "summary": 2-3 sentences on overall search performance and the biggest opportunity.`;

  const output = await generateJson({
    jobType: "seo_analysis",
    system,
    user: JSON.stringify(input),
    inputSummary: `SEO analysis for snapshot #${snapshot.id} (${input.period}), ${pageMeta.length} pages, ${input.topQueries.length} queries`,
  });

  const recs = Array.isArray(output.recommendations) ? output.recommendations : [];
  let inserted = 0;
  let skipped = 0;
  for (const rec of recs) {
    const type = REC_TYPES.has(rec.type) ? rec.type : "content";
    const pagePath = rec.page_path || null;
    if (!rec.issue || (pagePath && isProtectedPage(pagePath))) {
      skipped++;
      continue;
    }
    // Don't pile up duplicate open suggestions for the same page + type.
    const existing = await query(
      `SELECT id FROM ai_recommendations
       WHERE type = ? AND page_path <=> ? AND status IN ('pending', 'approved')
         AND (? IS NOT NULL OR issue = ?)`,
      [type, pagePath, pagePath, String(rec.issue)]
    );
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    await query(
      `INSERT INTO ai_recommendations
         (type, page_path, issue, current_value, suggested_value, reason, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        pagePath,
        String(rec.issue),
        rec.current_value ?? null,
        rec.suggested_value ?? null,
        rec.reason ?? null,
        PRIORITIES.has(rec.priority) ? rec.priority : "medium",
      ]
    );
    inserted++;
  }

  const report = await query(
    `INSERT INTO ai_analysis_reports (report_type, summary, data, created_by) VALUES ('seo_analysis', ?, ?, ?)`,
    [
      String(output.summary || "No summary returned."),
      JSON.stringify({ snapshotId: snapshot.id, inserted, skipped, totalSuggested: recs.length }),
      adminUserId,
    ]
  );

  return { reportId: report.insertId, summary: output.summary, inserted, skipped };
}
