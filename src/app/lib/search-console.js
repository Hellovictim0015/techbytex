import { query, withTransaction } from "./db";
import { getSecret } from "./secrets";
import { getGoogleAccessToken } from "./google";
import { SITE_URL } from "./seo";

// Search Console data lags ~2-3 days, so ranges end 3 days ago.
const DATA_LAG_DAYS = 3;

export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function dateRange(days, lagDays = 0) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - lagDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

// Main-domain pages become a bare path ("/about"); any other origin (non-www,
// http, subdomains) keeps its full URL so duplicate-host indexing stays visible.
function toPath(pageUrl) {
  try {
    const url = new URL(pageUrl);
    const path = url.pathname + url.search;
    return url.origin === SITE_URL ? path : url.origin + path;
  } catch {
    return pageUrl;
  }
}

async function searchAnalytics(siteUrl, token, body) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Search Console error ${res.status}`);
  return data.rows || [];
}

// Pulls the last `days` of Search Console data and stores it as one snapshot
// (totals + daily series in raw_data, top queries and pages in their tables).
export async function syncSearchConsole(days = 28) {
  const siteUrl = await getSecret("GOOGLE_SEARCH_CONSOLE_SITE_URL");
  if (!siteUrl) throw new Error("Search Console Site URL is not set.");
  const token = await getGoogleAccessToken();
  const range = dateRange(days, DATA_LAG_DAYS);

  const [totalsRows, dailyRows, queryRows, pageRows] = await Promise.all([
    searchAnalytics(siteUrl, token, { ...range }),
    searchAnalytics(siteUrl, token, { ...range, dimensions: ["date"] }),
    searchAnalytics(siteUrl, token, { ...range, dimensions: ["query"], rowLimit: 250 }),
    searchAnalytics(siteUrl, token, { ...range, dimensions: ["page"], rowLimit: 250 }),
  ]);

  const totals = totalsRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const daily = dailyRows.map((r) => ({
    date: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
  }));

  const snapshotId = await withTransaction(async (conn) => {
    const [result] = await conn.execute(
      `INSERT INTO seo_snapshots
         (date_range_start, date_range_end, total_clicks, total_impressions, average_ctr, average_position, raw_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        range.startDate,
        range.endDate,
        totals.clicks,
        totals.impressions,
        totals.ctr,
        totals.position,
        JSON.stringify({ siteUrl, daily }),
      ]
    );
    const id = result.insertId;

    for (const r of queryRows) {
      await conn.execute(
        `INSERT INTO seo_keyword_metrics (snapshot_id, query, clicks, impressions, ctr, position)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, r.keys[0], r.clicks, r.impressions, r.ctr, r.position]
      );
    }
    for (const r of pageRows) {
      await conn.execute(
        `INSERT INTO seo_page_metrics (snapshot_id, page_path, clicks, impressions, ctr, position)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, toPath(r.keys[0]).slice(0, 512), r.clicks, r.impressions, r.ctr, r.position]
      );
    }
    return id;
  });

  return {
    snapshotId,
    ...range,
    clicks: totals.clicks,
    impressions: totals.impressions,
    queries: queryRows.length,
    pages: pageRows.length,
  };
}

// Latest stored snapshot with its keywords and pages, or null if never synced.
export async function getLatestSeoSnapshot() {
  const snapshots = await query("SELECT * FROM seo_snapshots ORDER BY fetched_at DESC, id DESC LIMIT 1");
  const snapshot = snapshots[0];
  if (!snapshot) return null;

  const [keywords, pages] = await Promise.all([
    query(
      `SELECT query, clicks, impressions, ctr, position FROM seo_keyword_metrics
       WHERE snapshot_id = ? ORDER BY clicks DESC, impressions DESC`,
      [snapshot.id]
    ),
    query(
      `SELECT page_path, clicks, impressions, ctr, position FROM seo_page_metrics
       WHERE snapshot_id = ? ORDER BY clicks DESC, impressions DESC`,
      [snapshot.id]
    ),
  ]);

  const toNum = (row) => ({
    ...row,
    ctr: Number(row.ctr),
    position: Number(row.position),
  });

  return {
    ...snapshot,
    average_ctr: Number(snapshot.average_ctr),
    average_position: Number(snapshot.average_position),
    daily: snapshot.raw_data?.daily || [],
    keywords: keywords.map(toNum),
    pages: pages.map(toNum),
  };
}

// Pages/queries that are cheap wins: lots of impressions but few clicks, or
// ranking just off page one (positions 4-20, "striking distance").
export function findOpportunities(snapshot) {
  if (!snapshot) return { lowCtrPages: [], strikingKeywords: [] };
  const lowCtrPages = snapshot.pages
    .filter((p) => p.impressions >= 50 && p.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);
  const strikingKeywords = snapshot.keywords
    .filter((k) => k.position >= 4 && k.position <= 20 && k.impressions >= 10)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);
  return { lowCtrPages, strikingKeywords };
}
