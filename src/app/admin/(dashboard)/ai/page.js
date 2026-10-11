import Link from "next/link";
import { query } from "@/app/lib/db";
import { OPENAI_MODEL } from "@/app/lib/ai";
import ActionButton from "../ActionButton";

export const metadata = {
  title: "AI Tools | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    const [reports, logs] = await Promise.all([
      query(
        `SELECT id, report_type, summary, data, created_at FROM ai_analysis_reports
         ORDER BY created_at DESC, id DESC LIMIT 10`
      ),
      query(
        `SELECT id, job_type, status, tokens_used, error_message, started_at FROM ai_generation_logs
         ORDER BY started_at DESC, id DESC LIMIT 20`
      ),
    ]);
    return { ok: true, reports, logs };
  } catch (error) {
    return { ok: false, error: error.message, reports: [], logs: [] };
  }
}

const STATUS_STYLES = {
  success: "text-emerald-300",
  failed: "text-red-300",
  started: "text-amber-300",
};

export default async function AdminAiPage() {
  const { ok, error, reports, logs } = await load();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">AI Tools</h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            AI reviews the latest Search Console data and live page titles/descriptions, then adds
            suggestions to{" "}
            <Link href="/admin/recommendations" className="text-violet-300 hover:underline">
              Recommendations
            </Link>{" "}
            for you to approve. Nothing on the site changes automatically. Model: {OPENAI_MODEL}.
          </p>
        </div>
        <ActionButton
          endpoint="/api/admin/ai/analyze"
          label="Run SEO analysis"
          busyLabel="Analyzing (up to a minute)..."
          kind="ai"
        />
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load AI data ({error}).
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">Analysis reports</h2>
        {reports.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
            No reports yet. Sync SEO data first, then run an analysis.
          </div>
        )}
        {reports.map((r) => (
          <div key={r.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
              <span>{r.report_type}</span>
              <span>{r.created_at}</span>
            </div>
            <p className="mt-2 text-sm text-slate-200">{r.summary}</p>
            {r.data && (
              <p className="mt-2 text-xs text-slate-500">
                {r.data.inserted} new recommendations · {r.data.skipped} skipped
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">AI usage log</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Time</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Job</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
                <th className="px-4 py-2 text-right font-medium text-slate-400">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No AI calls yet.
                  </td>
                </tr>
              )}
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-400">{l.started_at}</td>
                  <td className="px-4 py-2 text-slate-200">{l.job_type}</td>
                  <td className={`px-4 py-2 ${STATUS_STYLES[l.status] || "text-slate-400"}`}>
                    {l.status}
                    {l.error_message && (
                      <span className="block text-xs text-red-300/80">{l.error_message}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-slate-400">
                    {l.tokens_used?.toLocaleString() ?? "—"}
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
