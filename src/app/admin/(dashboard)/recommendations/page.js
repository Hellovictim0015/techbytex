import { query } from "@/app/lib/db";
import RecommendationRow from "./RecommendationRow";

export const metadata = {
  title: "Recommendations | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function loadRecommendations() {
  try {
    const rows = await query(
      `SELECT id, type, page_path, issue, current_value, suggested_value, reason, priority, status, created_at
       FROM ai_recommendations
       ORDER BY FIELD(status, 'pending', 'approved', 'rejected', 'applied'), created_at DESC
       LIMIT 200`
    );
    return { ok: true, rows };
  } catch (error) {
    return { ok: false, error: error.message, rows: [] };
  }
}

export default async function AdminRecommendationsPage() {
  const { ok, error, rows } = await loadRecommendations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Recommendations</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review AI-generated suggestions before anything is applied. Nothing here changes the
          live site automatically.
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load recommendations ({error}). Is the database configured and migrated?
        </div>
      )}

      {ok && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center text-sm text-slate-400">
          No recommendations yet. Run an SEO analysis from the AI page to populate this list.
        </div>
      )}

      {ok && rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Type / Page</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Issue</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Priority</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {rows.map((rec) => (
                <RecommendationRow key={rec.id} rec={rec} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
