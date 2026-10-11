import { query } from "./db";
import { getSecret } from "./secrets";
import { getGoogleAccessToken } from "./google";
import { dateRange } from "./search-console";

async function runReport(propertyId, token, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Analytics error ${res.status}`);
  return data.rows || [];
}

const num = (v) => Number(v?.value || 0);

// Pulls the last `days` of GA4 data into one analytics_snapshots row.
export async function syncAnalytics(days = 28) {
  const propertyId = await getSecret("GOOGLE_ANALYTICS_PROPERTY_ID");
  if (!propertyId) throw new Error("Analytics Property ID is not set.");
  const token = await getGoogleAccessToken();
  const range = dateRange(days, 0);
  const dateRanges = [range];

  const [totalsRows, dailyRows, pageRows, sourceRows] = await Promise.all([
    runReport(propertyId, token, {
      dateRanges,
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
      ],
    }),
    runReport(propertyId, token, {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
    runReport(propertyId, token, {
      dateRanges,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 25,
    }),
    runReport(propertyId, token, {
      dateRanges,
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 15,
    }),
  ]);

  const t = totalsRows[0]?.metricValues || [];
  const totals = {
    users: num(t[0]),
    sessions: num(t[1]),
    pageViews: num(t[2]),
    engagementRate: num(t[3]),
  };
  const raw = {
    propertyId,
    daily: dailyRows.map((r) => {
      const d = r.dimensionValues[0].value; // YYYYMMDD
      return {
        date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
        users: num(r.metricValues[0]),
        sessions: num(r.metricValues[1]),
      };
    }),
    pages: pageRows.map((r) => ({
      path: r.dimensionValues[0].value,
      views: num(r.metricValues[0]),
      users: num(r.metricValues[1]),
    })),
    sources: sourceRows.map((r) => ({
      source: r.dimensionValues[0].value,
      sessions: num(r.metricValues[0]),
    })),
  };

  const result = await query(
    `INSERT INTO analytics_snapshots
       (date_range_start, date_range_end, users, sessions, page_views, engagement_rate, raw_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      range.startDate,
      range.endDate,
      totals.users,
      totals.sessions,
      totals.pageViews,
      totals.engagementRate,
      JSON.stringify(raw),
    ]
  );

  return { snapshotId: result.insertId, ...range, ...totals };
}

export async function getLatestAnalyticsSnapshot() {
  const rows = await query(
    "SELECT * FROM analytics_snapshots ORDER BY fetched_at DESC, id DESC LIMIT 1"
  );
  const s = rows[0];
  if (!s) return null;
  return {
    ...s,
    engagement_rate: Number(s.engagement_rate),
    daily: s.raw_data?.daily || [],
    pages: s.raw_data?.pages || [],
    sources: s.raw_data?.sources || [],
  };
}
