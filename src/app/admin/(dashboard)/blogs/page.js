import Link from "next/link";
import { query } from "@/app/lib/db";
import { getNextSuggestedTopic } from "@/app/lib/blog-generator";
import { getLatestTopicSuggestions } from "@/app/lib/topic-suggestions";
import GenerateBlogForm from "./GenerateBlogForm";

export const metadata = {
  title: "Blogs | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    const [posts, jobs, suggested, topicSuggestions] = await Promise.all([
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
    ]);
    return { ok: true, posts, jobs, suggested, topicSuggestions };
  } catch (error) {
    return { ok: false, error: error.message, posts: [], jobs: [], suggested: null, topicSuggestions: null };
  }
}

const STATUS_STYLES = {
  draft: "bg-amber-900/40 text-amber-300",
  published: "bg-emerald-900/40 text-emerald-300",
  rejected: "bg-slate-800 text-slate-500",
  scheduled: "bg-sky-900/40 text-sky-300",
};

export default async function AdminBlogsPage() {
  const { ok, error, posts, jobs, suggested, topicSuggestions } = await load();
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Blog Pipeline</h1>
        <p className="mt-1 text-sm text-slate-400">
          AI writes the article, generates a featured image (stored on Cloudinary) and saves it as a
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

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">All posts</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Title</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Category</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Source</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
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
                      {p.is_featured ? " · featured" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-2 text-slate-400">{p.category}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[p.status] || ""}`}>
                      {p.status}
                    </span>
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
