import { query } from "@/app/lib/db";
import StatCard from "../StatCard";
import { fmt } from "../MetricTable";

export const metadata = {
  title: "Dashboard | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function loadDbStats() {
  try {
    const [[pending], [adminCount], [recentLogins], [seo], [ga], [blogs]] = await Promise.all([
      query("SELECT COUNT(*) AS n FROM ai_recommendations WHERE status = 'pending'"),
      query("SELECT COUNT(*) AS n FROM admin_users WHERE is_active = 1"),
      query(
        "SELECT COUNT(*) AS n FROM admin_audit_logs WHERE action = 'admin_login_success' AND created_at > (NOW() - INTERVAL 7 DAY)"
      ),
      query(
        "SELECT total_clicks, total_impressions, average_ctr, date_range_start, date_range_end FROM seo_snapshots ORDER BY fetched_at DESC, id DESC LIMIT 1"
      ),
      query(
        "SELECT users, date_range_start, date_range_end FROM analytics_snapshots ORDER BY fetched_at DESC, id DESC LIMIT 1"
      ),
      query(
        "SELECT SUM(status = 'published') AS published, SUM(status = 'draft') AS drafts FROM ai_blog_posts"
      ),
    ]);
    return {
      ok: true,
      pendingRecommendations: pending.n,
      activeAdmins: adminCount.n,
      recentLogins: recentLogins.n,
      seo: seo || null,
      ga: ga || null,
      publishedBlogs: Number(blogs.published || 0),
      draftBlogs: Number(blogs.drafts || 0),
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export default async function AdminDashboardPage() {
  const db = await loadDbStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">TechByteX AI Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Website health, SEO, traffic, and AI recommendations at a glance.
        </p>
      </div>

      {!db.ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Database not configured or unreachable ({db.error}). Set DB_HOST/DB_USER/DB_PASSWORD/DB_NAME
          in your environment and run <code className="font-mono">npm run db:migrate</code>.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Published Blogs"
          value={db.ok ? db.publishedBlogs : "—"}
          hint={db.ok && db.draftBlogs ? `${db.draftBlogs} draft(s) awaiting review` : "From the database"}
        />
        <StatCard
          label="Pending AI Recommendations"
          value={db.ok ? db.pendingRecommendations : "—"}
        />
        <StatCard label="Active Admins" value={db.ok ? db.activeAdmins : "—"} />
        <StatCard label="Admin Logins (7d)" value={db.ok ? db.recentLogins : "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatCard
          label="Search Clicks"
          value={db.seo ? fmt.int(db.seo.total_clicks) : "Not synced"}
          hint={db.seo ? `${db.seo.date_range_start} → ${db.seo.date_range_end}` : "Sync on the SEO page"}
        />
        <StatCard
          label="Search Impressions"
          value={db.seo ? fmt.int(db.seo.total_impressions) : "Not synced"}
          hint={db.seo ? "Google Search Console" : "Sync on the SEO page"}
        />
        <StatCard
          label="Average CTR"
          value={db.seo ? fmt.pct(db.seo.average_ctr) : "Not synced"}
          hint={db.seo ? "Google Search Console" : "Sync on the SEO page"}
        />
        <StatCard
          label="Website Users"
          value={db.ga ? fmt.int(db.ga.users) : "Not synced"}
          hint={db.ga ? `GA4 · ${db.ga.date_range_start} → ${db.ga.date_range_end}` : "Sync on the Analytics page"}
        />
      </div>
    </div>
  );
}
