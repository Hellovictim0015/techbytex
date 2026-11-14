import Link from "next/link";
import { getStats, listLogs } from "@/app/lib/outreach/leads";
import { getOutreachSettings } from "@/app/lib/outreach/settings";
import { encryptionKeyProblem } from "@/app/lib/encryption";
import OutreachNav from "./OutreachNav";

export const metadata = { title: "Lead Outreach | TechByteX Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const when = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");
const LOG_STYLE = { sent: "text-emerald-300", failed: "text-red-300", test: "text-slate-400" };

async function load() {
  try {
    const [stats, logs, settings] = await Promise.all([getStats(), listLogs(), getOutreachSettings()]);
    return { ok: true, stats, logs, dailyLimit: Number(settings.daily_limit) || 0 };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function Stat({ label, value, sub, href }) {
  const body = (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function OutreachDashboard() {
  const data = await load();
  const warning = !data.ok
    ? `Could not load outreach data (${data.error}). Run npm run db:migrate.`
    : encryptionKeyProblem();
  return (
    <div className="space-y-6">
      <OutreachNav active="/admin/outreach" warning={warning} />
      {data.ok && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Sent today" value={`${data.stats.sent_today} / ${data.dailyLimit}`} sub="daily limit from Settings" />
            <Stat label="Ready to send" value={data.stats.queued} sub="approved, not sent yet" href="/admin/outreach/leads" />
            <Stat label="Emails sent (all time)" value={data.stats.sent_total} sub={`${data.stats.failed_total} failed`} />
            <Stat
              label="Reply rate"
              value={data.stats.emailed + data.stats.replied ? `${Math.round((data.stats.replied / (data.stats.emailed + data.stats.replied)) * 100)}%` : "—"}
              sub={`${data.stats.replied} replied`}
            />
            <Stat label="Leads" value={data.stats.total} sub={`${data.stats.with_email} with an email`} href="/admin/outreach/leads" />
            <Stat label="Websites to check" value={data.stats.to_check} href="/admin/outreach/leads" />
            <Stat label="Unsubscribed" value={data.stats.unsubscribed} sub="never emailed again" />
            <Stat label="Bounced" value={data.stats.bounced} />
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-medium text-white">Email log</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900 text-left text-xs text-slate-400">
                  <tr>
                    <th className="px-3 py-2 font-medium">When</th>
                    <th className="px-3 py-2 font-medium">To</th>
                    <th className="px-3 py-2 font-medium">Business</th>
                    <th className="px-3 py-2 font-medium">Subject</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {data.logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-slate-500">No emails sent yet.</td>
                    </tr>
                  )}
                  {data.logs.map((l) => (
                    <tr key={l.id} className="align-top">
                      <td className="whitespace-nowrap px-3 py-2 text-slate-400">{when(l.sent_at)}</td>
                      <td className="px-3 py-2 text-slate-200">{l.to_email}</td>
                      <td className="px-3 py-2 text-slate-300">{l.business_name || "—"}</td>
                      <td className="px-3 py-2 text-slate-300">{l.subject}</td>
                      <td className={`px-3 py-2 ${LOG_STYLE[l.status] || ""}`}>
                        {l.status}
                        {l.error_message && <p className="max-w-xs text-xs text-red-300">{l.error_message}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
