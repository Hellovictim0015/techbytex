import Link from "next/link";
import { query } from "@/app/lib/db";
import { getNextSuggestedTopic } from "@/app/lib/blog-generator";
import { getLatestTopicSuggestions } from "@/app/lib/topic-suggestions";
import { getPageViews } from "@/app/lib/site-pages";
import GenerateBlogForm from "./GenerateBlogForm";
import FixImagesButton from "./FixImagesButton";

const needsImage = (p) => !p.featured_image_url || /placehold\.co/i.test(p.featured_image_url);

export const metadata = {
  title: "Blogs | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    const [posts, jobs, suggested, topicSuggestions, pageViews] = await Promise.all([
      query(
        `SELECT id, slug, title, category, status, is_featured, generated_by, featured_image_url, created_at, published_at
         FROM ai_blog_posts ORDER BY FIELD(status, 'draft', 'published', 'rejected', 'scheduled'), COALESCE(published_at, created_at) DESC
         LIMIT 200`
      ),
      query(
        `SELECT j.id, j.topic, j.status, j.blog_slug, j.error_message, j.started_at,
                (SELECT GROUP_CONCAT(CONCAT(l.step, ':', l.status) ORDER BY l.id SEPARATOR ' → ')
                 FROM blog_generation_logs l WHERE l.job_id = j.id) AS steps
         FROM blog_ai_jobs j ORDER BY j.id DESC LIMIT 10`
      ),
      getNextSuggestedTopic(),
      getLatestTopicSuggestions(),
      getPageViews(),
    ]);
    const withViews = posts.map((p) => {
      const v = pageViews.views.get(`/blogg/${p.slug}`);
      return { ...p, views: v?.views ?? 0, users: v?.users ?? 0 };
    });
    return { ok: true, posts: withViews, jobs, suggested, topicSuggestions, viewsPeriod: pageViews.period };
  } catch (error) {
    return { ok: false, error: error.message, posts: [], jobs: [], suggested: null, topicSuggestions: null };
  }
}

const int = (n) => Number(n || 0).toLocaleString("en-IN");

const STATUS_STYLES = {
  draft: "bg-amber-900/40 text-amber-300",
  published: "bg-emerald-900/40 text-emerald-300",
  rejected: "bg-slate-800 text-slate-500",
  scheduled: "bg-sky-900/40 text-sky-300",
};

export default async function AdminBlogsPage({ searchParams }) {
  const { sort } = await searchParams;
  const byViews = sort === "views";
  const { ok, error, posts: loaded, jobs, suggested, topicSuggestions, viewsPeriod } = await load();
  const posts = byViews ? [...loaded].sort((a, b) => b.views - a.views || b.users - a.users) : loaded;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const live = loaded.filter((p) => p.status === "published");
  const topViewed = [...live].sort((a, b) => b.views - a.views).filter((p) => p.views > 0).slice(0, 5);
  const maxViews = topViewed[0]?.views || 1;
  const totalViews = live.reduce((sum, p) => sum + p.views, 0);
  const unread = live.filter((p) => p.views === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Blog Pipeline</h1>
        <p className="mt-1 text-sm text-slate-400">
          AI writes the article, generates a featured image (saved in the uploads folder) and saves it as a
          draft. Nothing goes live until you open it and click Publish.
          {drafts > 0 && <span className="text-amber-300"> {drafts} draft(s) waiting for review.</span>}
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load blogs ({error}).
        </div>
      )}

      <GenerateBlogForm suggestedTopic={suggested?.title} initialSuggestions={topicSuggestions} />

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-white">Most viewed blogs</p>
          <p className="text-xs text-slate-500">
            {viewsPeriod
              ? `Google Analytics, ${viewsPeriod} · ${int(totalViews)} views on ${live.length} live posts · ${unread} with 0 views`
              : "No Analytics data yet — sync it on the Analytics page."}
          </p>
        </div>
        {topViewed.length === 0 ? (
          <p className="text-xs text-slate-500">No blog views recorded in the last Analytics sync.</p>
        ) : (
          <div className="space-y-2">
            {topViewed.map((p) => (
              <div key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/blogs/${p.id}`} className="block truncate text-sm text-slate-200 hover:text-violet-300">
                    {p.title}
                  </Link>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                    <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${Math.max(4, (p.views / maxViews) * 100)}%` }} />
                  </div>
                </div>
                <p className="text-sm tabular-nums text-slate-300">{int(p.views)} views</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-medium text-slate-300">All posts</h2>
            <FixImagesButton ids={loaded.filter((p) => p.status !== "rejected" && needsImage(p)).map((p) => p.id)} />
          </div>
          <p className="text-xs text-slate-500">
            Sort:{" "}
            <Link href="/admin/blogs" className={byViews ? "text-slate-400 hover:underline" : "text-violet-300"}>
              Latest
            </Link>
            {" · "}
            <Link href="/admin/blogs?sort=views" className={byViews ? "text-violet-300" : "text-slate-400 hover:underline"}>
              Most viewed
            </Link>
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Title</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Category</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
                <th className="px-4 py-2 text-right font-medium text-slate-400">Views</th>
                <th className="px-4 py-2 text-right font-medium text-slate-400">Users</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Source</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    No posts yet. Generate one above or run npm run blog:import.
                  </td>
                </tr>
              )}
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2">
                    <Link href={`/admin/blogs/${p.id}`} className="text-slate-100 hover:text-violet-300">
                      {p.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      /blogg/{p.slug}
                      {!p.featured_image_url && " · no image"}
                      {p.featured_image_url && needsImage(p) && <span className="text-amber-300"> · placeholder image</span>}
                      {p.is_featured ? " · featured" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-2 text-slate-400">{p.category}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[p.status] || ""}`}>
                      {p.status}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2 text-right tabular-nums ${
                      p.status === "published" && p.views === 0 ? "text-amber-300" : "text-slate-200"
                    }`}
                  >
                    {p.status === "published" ? int(p.views) : "—"}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-slate-400">
                    {p.status === "published" ? int(p.users) : "—"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {p.generated_by === "ai" ? "AI" : p.generated_by === "static_import" ? "Imported" : p.generated_by}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-500">
                    {String(p.published_at || p.created_at).slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">Recent generation jobs</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {jobs.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500">No jobs yet.</td>
                </tr>
              )}
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-500">{j.started_at}</td>
                  <td className="px-4 py-2 text-slate-200">
                    {j.topic}
                    <p className="text-xs text-slate-500">{j.steps}</p>
                    {j.error_message && <p className="text-xs text-red-300">{j.error_message}</p>}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      j.status === "completed" ? "text-emerald-300" : j.status === "failed" ? "text-red-300" : "text-amber-300"
                    }`}
                  >
                    {j.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
