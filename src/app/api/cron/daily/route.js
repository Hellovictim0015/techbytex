import { timingSafeEqual } from "crypto";
import { getSecret } from "@/app/lib/secrets";
import { logAudit } from "@/app/lib/auth";
import { syncSearchConsole } from "@/app/lib/search-console";
import { syncAnalytics } from "@/app/lib/analytics";

export const maxDuration = 120;

function authorized(header, secret) {
  if (!secret || !header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Daily job: refreshes Search Console + Analytics snapshots. Called by Vercel
// Cron (or any scheduler) with `Authorization: Bearer <CRON_SECRET>`.
export async function GET(request) {
  const secret = await getSecret("CRON_SECRET");
  if (!authorized(request.headers.get("authorization"), secret)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const jobs = { searchConsole: syncSearchConsole, analytics: syncAnalytics };
  const results = {};
  for (const [name, job] of Object.entries(jobs)) {
    try {
      results[name] = { ok: true, ...(await job()) };
    } catch (error) {
      results[name] = { ok: false, error: error.message };
    }
  }

  await logAudit({
    actorLabel: "cron",
    action: "cron_daily_run",
    details: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.ok])),
  });

  return Response.json({ success: true, results });
}
