// Live connectivity checks for each integration group on /admin/settings.
// Dependency-free on purpose: callers pass in how to resolve secrets and the
// Google access token, so these never touch the DB directly.
//
// Every check returns { name, ok, message } and never includes a secret value.

async function readError(res) {
  try {
    const data = await res.json();
    return data?.error?.message || data?.error_description || data?.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

function missing(name, keys) {
  return { name, ok: false, message: `Not set: ${keys.join(", ")}` };
}

async function testOpenAI({ getSecret }) {
  const key = await getSecret("OPENAI_API_KEY");
  if (!key) return [missing("OpenAI", ["OPENAI_API_KEY"])];
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
  });
  return [
    res.ok
      ? { name: "OpenAI", ok: true, message: "API key is valid." }
      : { name: "OpenAI", ok: false, message: `${res.status}: ${await readError(res)}` },
  ];
}

async function testAnthropic({ getSecret }) {
  const key = await getSecret("ANTHROPIC_API_KEY");
  if (!key) return [missing("Claude (Anthropic)", ["ANTHROPIC_API_KEY"])];
  const res = await fetch("https://api.anthropic.com/v1/models", {
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
  });
  return [
    res.ok
      ? { name: "Claude (Anthropic)", ok: true, message: "API key is valid." }
      : { name: "Claude (Anthropic)", ok: false, message: `${res.status}: ${await readError(res)}` },
  ];
}

async function testCloudinary({ getSecret }) {
  const [cloud, key, secret] = await Promise.all([
    getSecret("CLOUDINARY_CLOUD_NAME"),
    getSecret("CLOUDINARY_API_KEY"),
    getSecret("CLOUDINARY_API_SECRET"),
  ]);
  const unset = [
    !cloud && "CLOUDINARY_CLOUD_NAME",
    !key && "CLOUDINARY_API_KEY",
    !secret && "CLOUDINARY_API_SECRET",
  ].filter(Boolean);
  if (unset.length) return [missing("Cloudinary", unset)];

  const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/ping`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
  });
  return [
    res.ok
      ? { name: "Cloudinary", ok: true, message: `Connected to cloud "${cloud}".` }
      : { name: "Cloudinary", ok: false, message: `${res.status}: ${await readError(res)}` },
  ];
}

async function testGoogle({ getSecret, getGoogleAccessToken }) {
  const results = [];

  let token;
  try {
    token = await getGoogleAccessToken();
    results.push({ name: "Google OAuth", ok: true, message: "Refresh token works." });
  } catch (error) {
    results.push({ name: "Google OAuth", ok: false, message: error.message });
    return results;
  }
  const auth = { Authorization: `Bearer ${token}` };

  const siteUrl = await getSecret("GOOGLE_SEARCH_CONSOLE_SITE_URL");
  if (!siteUrl) {
    results.push(missing("Search Console", ["GOOGLE_SEARCH_CONSOLE_SITE_URL"]));
  } else {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`,
      { headers: auth }
    );
    if (res.ok) {
      const data = await res.json();
      results.push({
        name: "Search Console",
        ok: true,
        message: `Access to ${siteUrl} (${data.permissionLevel}).`,
      });
    } else {
      results.push({
        name: "Search Console",
        ok: false,
        message: `${res.status}: ${await readError(res)}`,
      });
    }
  }

  const propertyId = await getSecret("GOOGLE_ANALYTICS_PROPERTY_ID");
  if (!propertyId) {
    results.push(missing("Analytics (GA4)", ["GOOGLE_ANALYTICS_PROPERTY_ID"]));
  } else {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
      {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
          metrics: [{ name: "activeUsers" }],
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const users = data.rows?.[0]?.metricValues?.[0]?.value ?? "0";
      results.push({
        name: "Analytics (GA4)",
        ok: true,
        message: `Property ${propertyId}: ${users} active users in last 7 days.`,
      });
    } else {
      results.push({
        name: "Analytics (GA4)",
        ok: false,
        message: `${res.status}: ${await readError(res)}`,
      });
    }
  }

  return results;
}

async function testGoogleBusiness({ getSecret, getGoogleAccessToken }) {
  const results = [];

  let token;
  try {
    token = await getGoogleAccessToken("business");
    results.push({ name: "Business Profile login", ok: true, message: "Refresh token works." });
  } catch (error) {
    results.push({ name: "Business Profile login", ok: false, message: error.message });
    return results;
  }
  const auth = { Authorization: `Bearer ${token}` };

  const [accountId, locationId] = await Promise.all([
    getSecret("GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID"),
    getSecret("GOOGLE_BUSINESS_PROFILE_LOCATION_ID"),
  ]);
  if (!accountId || !locationId) {
    results.push(
      missing(
        "Business Profile",
        [
          !accountId && "GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID",
          !locationId && "GOOGLE_BUSINESS_PROFILE_LOCATION_ID",
        ].filter(Boolean)
      )
    );
  } else {
    const res = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${encodeURIComponent(locationId)}?readMask=title`,
      { headers: auth }
    );
    if (res.ok) {
      const data = await res.json();
      results.push({
        name: "Business Profile",
        ok: true,
        message: `Location found: ${data.title || locationId}.`,
      });
    } else {
      const reason = await readError(res);
      results.push({
        name: "Business Profile",
        ok: false,
        message:
          res.status === 429 || /quota/i.test(reason)
            ? `${res.status}: ${reason} — the Business Profile API needs access approval from Google (quota is 0 until approved).`
            : /insufficient authentication scopes/i.test(reason)
              ? `${res.status}: ${reason} — the Business Profile permission was not granted. Disconnect, click Connect again and tick the "Google business listings" checkbox.`
              : res.status === 403 || res.status === 404
              ? `${res.status}: ${reason} — the connected Google account must be an owner or manager of this Business Profile.`
              : `${res.status}: ${reason}`,
      });
    }
  }

  return results;
}

async function testScheduler({ getSecret }) {
  const secret = await getSecret("CRON_SECRET");
  if (!secret) return [missing("Cron Secret", ["CRON_SECRET"])];
  return [
    secret.length >= 32
      ? { name: "Cron Secret", ok: true, message: `Set (${secret.length} characters).` }
      : { name: "Cron Secret", ok: false, message: "Too short — use at least 32 random characters." },
  ];
}

const TESTS = {
  AI: async (deps) => [...(await testOpenAI(deps)), ...(await testAnthropic(deps))],
  Google: testGoogle,
  "Google Business": testGoogleBusiness,
  Cloudinary: testCloudinary,
  Scheduler: testScheduler,
};

export const TESTABLE_GROUPS = Object.keys(TESTS);

export async function runIntegrationTest(group, deps) {
  const test = TESTS[group];
  if (!test) throw new Error(`Unknown integration group: ${group}`);
  try {
    return await test(deps);
  } catch (error) {
    return [{ name: group, ok: false, message: `Request failed: ${error.message}` }];
  }
}
