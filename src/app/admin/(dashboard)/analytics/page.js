import { getLatestAnalyticsSnapshot } from "@/app/lib/analytics";
import StatCard from "../StatCard";
import ActionButton from "../ActionButton";
import DailyBars from "../DailyBars";
import MetricTable, { fmt } from "../MetricTable";

export const metadata = {
  title: "Analytics | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    return { ok: true, snapshot: await getLatestAnalyticsSnapshot() };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export default async function AdminAnalyticsPage() {
  const { ok, error, snapshot } = await load();
  const noTraffic = snapshot && snapshot.users === 0 && snapshot.sessions === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            {snapshot
              ? `Google Analytics 4 · ${snapshot.date_range_start} → ${snapshot.date_range_end} · synced ${snapshot.fetched_at}`
              : "Users, sessions, page views, engagement, landing pages, and traffic sources."}
          </p>
        </div>
        <ActionButton endpoint="/api/admin/analytics/sync" label="Sync now" busyLabel="Syncing..." kind="analytics" />
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load analytics ({error}).
        </div>
      )}

      {ok && !snapshot && (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center text-sm text-slate-400">
          No data yet. Click <span className="text-white">Sync now</span> to pull the last 28 days from GA4.
        </div>
      )}

      {noTraffic && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          GA4 is connected but recorded no visits. The website does not have the Google Analytics tag
          installed yet, so no data is being collected.
        </div>
      )}

      {snapshot && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Users" value={fmt.int(snapshot.users)} hint="Last 28 days" />
            <StatCard label="Sessions" value={fmt.int(snapshot.sessions)} />
            <StatCard label="Page Views" value={fmt.int(snapshot.page_views)} />
            <StatCard label="Engagement Rate" value={fmt.pct(snapshot.engagement_rate)} />
          </div>

          <DailyBars title="Users per day" data={snapshot.daily} valueKey="users" valueLabel="users" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <MetricTable
              title="Top pages"
              columns={[
                { key: "path", label: "Page" },
                { key: "views", label: "Views", align: "right", format: fmt.int },
                { key: "users", label: "Users", align: "right", format: fmt.int },
              ]}
              rows={snapshot.pages}
            />
            <MetricTable
              title="Traffic sources"
              columns={[
                { key: "source", label: "Source / medium" },
                { key: "sessions", label: "Sessions", align: "right", format: fmt.int },
              ]}
              rows={snapshot.sources}
            />
          </div>
        </>
      )}
    </div>
  );
}
