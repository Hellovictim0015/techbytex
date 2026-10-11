import { getLatestSeoSnapshot, findOpportunities } from "@/app/lib/search-console";
import StatCard from "../StatCard";
import ActionButton from "../ActionButton";
import DailyBars from "../DailyBars";
import MetricTable, { fmt } from "../MetricTable";

export const metadata = {
  title: "SEO Analytics | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    return { ok: true, snapshot: await getLatestSeoSnapshot() };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

const queryColumns = [
  { key: "query", label: "Query" },
  { key: "clicks", label: "Clicks", align: "right", format: fmt.int },
  { key: "impressions", label: "Impr.", align: "right", format: fmt.int },
  { key: "ctr", label: "CTR", align: "right", format: fmt.pct },
  { key: "position", label: "Pos.", align: "right", format: fmt.pos },
];
const pageColumns = [{ ...queryColumns[0], key: "page_path", label: "Page" }, ...queryColumns.slice(1)];

export default async function AdminSeoPage() {
  const { ok, error, snapshot } = await load();
  const { lowCtrPages, strikingKeywords } = findOpportunities(snapshot);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">SEO Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            {snapshot
              ? `Google Search Console · ${snapshot.date_range_start} → ${snapshot.date_range_end} · synced ${snapshot.fetched_at}`
              : "Google Search Console performance: clicks, impressions, CTR and positions."}
          </p>
        </div>
        <ActionButton endpoint="/api/admin/seo/sync" label="Sync now" busyLabel="Syncing..." kind="seo" />
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load SEO data ({error}).
        </div>
      )}

      {ok && !snapshot && (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center text-sm text-slate-400">
          No data yet. Click <span className="text-white">Sync now</span> to pull the last 28 days from
          Search Console.
        </div>
      )}

      {snapshot && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Clicks" value={fmt.int(snapshot.total_clicks)} hint="Last 28 days" />
            <StatCard label="Impressions" value={fmt.int(snapshot.total_impressions)} hint="Last 28 days" />
            <StatCard label="Average CTR" value={fmt.pct(snapshot.average_ctr)} />
            <StatCard label="Average Position" value={fmt.pos(snapshot.average_position)} />
          </div>

          <DailyBars title="Clicks per day" data={snapshot.daily} valueKey="clicks" valueLabel="clicks" />
          <DailyBars
            title="Impressions per day"
            data={snapshot.daily}
            valueKey="impressions"
            valueLabel="impressions"
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <MetricTable
              title="Striking-distance keywords"
              hint="Position 4–20 with impressions — a small push can move these onto page 1."
              columns={queryColumns}
              rows={strikingKeywords}
              emptyText="None yet."
            />
            <MetricTable
              title="High impressions, low CTR pages"
              hint="≥50 impressions and CTR under 2% — usually a title/description problem."
              columns={pageColumns}
              rows={lowCtrPages}
              emptyText="None — good."
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <MetricTable title="Top queries" columns={queryColumns} rows={snapshot.keywords.slice(0, 100)} />
            <MetricTable title="Top pages" columns={pageColumns} rows={snapshot.pages.slice(0, 100)} />
          </div>
        </>
      )}
    </div>
  );
}
