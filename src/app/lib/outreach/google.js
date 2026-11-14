// Google Places API (New) Text Search and PageSpeed Insights for Lead Outreach.

const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACES_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.internationalPhoneNumber",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "nextPageToken",
].join(",");
export const MAX_PLACES_RESULTS = 60; // Text Search returns at most 3 pages of 20

function googleError(data, status, service) {
  const msg = data?.error?.message || `${service} error ${status}`;
  if (status === 403 || /API key|not authorized|has not been used/i.test(msg)) {
    return new Error(`${service}: ${msg} (check the API key and that the API is enabled in Google Cloud).`);
  }
  return new Error(`${service}: ${msg}`);
}

// Businesses for "<category> in <city>, <country>", up to maxResults.
export async function searchPlaces({ apiKey, textQuery, maxResults }) {
  if (!apiKey) throw new Error("Google Places API key is not set (Lead Outreach → Settings).");
  const limit = Math.min(Math.max(1, Number(maxResults) || 20), MAX_PLACES_RESULTS);
  const places = [];
  let pageToken;
  while (places.length < limit) {
    const res = await fetch(PLACES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": PLACES_FIELDS },
      body: JSON.stringify({ textQuery, pageSize: Math.min(20, limit - places.length), ...(pageToken ? { pageToken } : {}) }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw googleError(data, res.status, "Google Places");
    for (const p of data.places || []) {
      places.push({
        placeId: p.id,
        name: p.displayName?.text || "Unknown business",
        address: p.formattedAddress || null,
        phone: p.internationalPhoneNumber || p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        rating: typeof p.rating === "number" ? p.rating : null,
        ratingCount: p.userRatingCount ?? null,
      });
    }
    pageToken = data.nextPageToken;
    if (!pageToken || !data.places?.length) break;
  }
  return places.slice(0, limit);
}

// Mobile performance score (0–100) and the biggest problems Lighthouse found.
export async function runPageSpeed({ apiKey, url }) {
  const params = new URLSearchParams({ url, strategy: "mobile", category: "performance" });
  if (apiKey) params.set("key", apiKey);
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, {
    signal: AbortSignal.timeout(90000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw googleError(data, res.status, "PageSpeed");
  const lh = data.lighthouseResult;
  const score = lh?.categories?.performance?.score;
  const audits = lh?.audits || {};
  const issues = [];
  const metric = (id, label) => {
    const a = audits[id];
    if (a && typeof a.score === "number" && a.score < 0.9 && a.displayValue) {
      issues.push({ title: `${label} is ${a.displayValue}`, impact: a.score < 0.5 ? "high" : "medium" });
    }
  };
  metric("largest-contentful-paint", "Largest content takes");
  metric("total-blocking-time", "Page is blocked for");
  metric("cumulative-layout-shift", "Layout shift score");
  metric("speed-index", "Speed Index");
  // Biggest fix-able opportunities first.
  Object.values(audits)
    .filter((a) => a?.details?.type === "opportunity" && typeof a.score === "number" && a.score < 0.9)
    .sort((a, b) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0))
    .slice(0, 4)
    .forEach((a) => issues.push({ title: a.title + (a.displayValue ? ` (${a.displayValue})` : ""), impact: "medium" }));
  return { score: typeof score === "number" ? Math.round(score * 100) : null, issues: issues.slice(0, 6) };
}

export async function testPlacesKey(apiKey) {
  await searchPlaces({ apiKey, textQuery: "cafe in Raipur, India", maxResults: 1 });
}

export async function testPageSpeedKey(apiKey) {
  const params = new URLSearchParams({ url: "https://example.com", strategy: "mobile", category: "performance", key: apiKey });
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, {
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw googleError(await res.json().catch(() => ({})), res.status, "PageSpeed");
}
