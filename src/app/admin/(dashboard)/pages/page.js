import Link from "next/link";
import { getSitePagesWithStats } from "@/app/lib/site-pages";
import StatCard from "../StatCard";
import PagesTable from "./PagesTable";

export const metadata = {
  title: "All Pages | TechByteX Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminAllPagesPage() {
  const { pages, other, analyticsPeriod, analyticsPageCount, searchPeriod } = await getSitePagesWithStats();
  const live = pages.filter((p) => p.status === "published");
  const code = pages.filter((p) => p.source === "code").length;
  const admin = pages.filter((p) => p.source === "admin").length;
  const noViews = live.filter((p) => p.views === 0).length;
  const totalViews = live.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">All Pages</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every page on the site — written in code or created from the admin — with its traffic.{" "}
          {analyticsPeriod ? `Views: Google Analytics, ${analyticsPeriod}.` : "No Analytics data yet."}{" "}
          {searchPeriod ? `Search: Search Console, ${searchPeriod}.` : "No Search Console data yet."}
        </p>
      </div>

      {analyticsPeriod && analyticsPageCount <= 25 && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          The last Analytics sync only saved the top {analyticsPageCount} pages, so other pages show 0 views. Click{" "}
          <Link href="/admin/analytics" className="underline">Sync now on the Analytics page</Link> to load views for every page.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total pages" value={pages.length} hint={`${live.length} live`} />
        <StatCard label="Code pages" value={code} hint={`Admin-created: ${admin}`} />
        <StatCard label="Views (live pages)" value={totalViews.toLocaleString("en-IN")} hint="Last Analytics sync" />
        <StatCard label="Live pages with 0 views" value={noViews} hint="Need links, SEO or removal" />
      </div>

      <PagesTable pages={pages} />

      {other.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="text-sm text-slate-200">Other URLs with traffic</p>
            <p className="text-xs text-slate-500">
              Visited URLs that are not a current page — old links, typos or removed pages. Consider redirects for busy ones.
            </p>
          </div>
          <div className="max-h-[320px] overflow-auto">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-slate-800">
                {other.map((o) => (
                  <tr key={o.path}>
                    <td className="px-4 py-2 font-mono text-xs text-slate-300 break-all">{o.path}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-slate-300">{o.views.toLocaleString("en-IN")} views</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
