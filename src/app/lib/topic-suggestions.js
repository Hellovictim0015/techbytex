import { query } from "./db";
import { generateJson } from "./ai";
import { getLatestSeoSnapshot, findOpportunities } from "./search-console";
import { getLatestAnalyticsSnapshot } from "./analytics";
import { existingPostTitles, titleSimilarity } from "./blog-generator";
import { blogTopics } from "../data/blogTopics";
import { services } from "../data/services";
import { cities } from "../data/cities";

const REPORT_TYPE = "blog_topic_suggestions";
const SIMILAR = 0.6;

const pct = (v) => `${(Number(v) * 100).toFixed(1)}%`;

// Builds blog topic ideas most likely to rank, from Search Console queries,
// GA4 pages, open AI recommendations and the content calendar — excluding
// anything we've already written. Saved as an analysis report so the Blogs
// page can show the latest list without calling the AI again.
export async function suggestBlogTopics({ adminUserId = null } = {}) {
  const [seo, analytics, recs, existing] = await Promise.all([
    getLatestSeoSnapshot(),
    getLatestAnalyticsSnapshot().catch(() => null),
    query(
      `SELECT type, page_path, issue, suggested_value FROM ai_recommendations
       WHERE status IN ('pending', 'approved') AND type IN ('new_content', 'content')
       ORDER BY FIELD(priority, 'high', 'medium', 'low') LIMIT 20`
    ),
    existingPostTitles(),
  ]);
  if (!seo) throw new Error('No Search Console data yet. Click "Sync now" on the SEO page first.');

  const { strikingKeywords } = findOpportunities(seo);
  const plannedTopics = blogTopics
    .filter((t) => t.status !== "published")
    .filter((t) => !existing.some((title) => titleSimilarity(t.title, title) >= SIMILAR))
    .slice(0, 40)
    .map((t) => ({ title: t.title, targetKeyword: t.targetKeyword }));

  const input = {
    business:
      "TechByteX — website, mobile app (React Native), ecommerce, AI and custom software development company in Dalli Rajhara, Chhattisgarh, India. Serves Raipur, Bhilai, Durg, Bilaspur and all of Chhattisgarh plus clients across India.",
    searchConsolePeriod: `${seo.date_range_start} to ${seo.date_range_end}`,
    searchQueries: seo.keywords.slice(0, 80).map((k) => ({
      query: k.query,
      impressions: k.impressions,
      clicks: k.clicks,
      ctr: pct(k.ctr),
      position: Number(k.position).toFixed(1),
    })),
    strikingDistanceQueries: strikingKeywords.map((k) => k.query),
    topPagesInSearch: seo.pages.slice(0, 20).map((p) => ({
      page: p.page_path,
      impressions: p.impressions,
      position: Number(p.position).toFixed(1),
    })),
    analyticsTopPages: (analytics?.pages || []).slice(0, 15),
    aiContentRecommendations: recs.map((r) => ({
      type: r.type,
      page: r.page_path,
      issue: r.issue,
      suggestion: r.suggested_value,
    })),
    contentCalendarIdeas: plannedTopics,
    servicePages: services.map((s) => `/services/${s.slug}`),
    cityPages: cities.map((c) => `/web-development-${c.slug}`),
    alreadyPublishedOrDraftedTitles: existing,
  };

  const system = `You are an SEO content strategist for a small Indian software agency. Pick the blog topics with the best realistic chance to rank on Google and bring enquiries, using ONLY the data provided.
Return ONLY JSON: {"summary": string, "topics": [{"title": string (<= 70 chars), "target_keyword": string, "secondary_keywords": string[] (3-6), "search_intent": "informational"|"commercial"|"local", "angle": string (1 sentence: what makes this article different/useful), "reason": string (1-2 sentences citing the specific data: query, impressions, position, recommendation), "priority": "high"|"medium"|"low", "supports_page": string|null (existing service/city page this blog should link to and help rank)}]}.
Rules:
- 8 topics, best first. Prefer: queries with impressions but no strong page, striking-distance queries (position 4-20), local Chhattisgarh/city intent, and AI content recommendations. Use calendar ideas only when data supports them.
- Ignore misspelled or other-brand navigational queries (e.g. "techbasti", "techslassh", "techbuniyaad") — they are not TechByteX demand.
- NEVER suggest a topic that overlaps with alreadyPublishedOrDraftedTitles (same subject with different wording counts as overlap).
- No two suggested topics may target the same keyword.
- Titles must be natural and specific (city, cost, comparison, checklist, how-to), not clickbait. Do not invent statistics.
- "summary": 2 sentences on the overall content strategy.`;

  const output = await generateJson({
    jobType: "blog_topic_suggestions",
    system,
    user: JSON.stringify(input),
    inputSummary: `Topic suggestions from ${input.searchQueries.length} queries, ${recs.length} recommendations, ${existing.length} existing posts`,
  });

  // Belt and braces: drop anything the model still returned that overlaps an existing post.
  const topics = (Array.isArray(output.topics) ? output.topics : [])
    .filter((t) => t?.title && t?.target_keyword)
    .filter((t) => !existing.some((title) => titleSimilarity(t.title, title) >= SIMILAR))
    .slice(0, 10);

  const report = await query(
    "INSERT INTO ai_analysis_reports (report_type, summary, data, created_by) VALUES (?, ?, ?, ?)",
    [REPORT_TYPE, String(output.summary || ""), JSON.stringify({ topics, seoSnapshotId: seo.id }), adminUserId]
  );
  return { reportId: report.insertId, summary: output.summary, topics };
}

// Latest saved suggestions, minus any topic that has since been written.
export async function getLatestTopicSuggestions() {
  const rows = await query(
    `SELECT id, summary, data, created_at FROM ai_analysis_reports
     WHERE report_type = ? ORDER BY id DESC LIMIT 1`,
    [REPORT_TYPE]
  );
  if (!rows[0]) return null;
  const existing = await existingPostTitles();
  const topics = (rows[0].data?.topics || []).filter(
    (t) => !existing.some((title) => titleSimilarity(t.title, title) >= SIMILAR)
  );
  return { id: rows[0].id, summary: rows[0].summary, createdAt: rows[0].created_at, topics };
}
