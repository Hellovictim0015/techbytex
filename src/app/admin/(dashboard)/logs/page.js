import { query } from "@/app/lib/db";

export const metadata = {
  title: "Audit Logs | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function loadLogs() {
  try {
    const rows = await query(
      `SELECT l.id, l.action, l.target_type, l.target_id, l.actor_label, l.ip_address, l.created_at,
              u.email AS admin_email
       FROM admin_audit_logs l
       LEFT JOIN admin_users u ON u.id = l.admin_user_id
       ORDER BY l.created_at DESC
       LIMIT 100`
    );
    return { ok: true, rows };
  } catch (error) {
    return { ok: false, error: error.message, rows: [] };
  }
}

export default async function AdminLogsPage() {
  const { ok, error, rows } = await loadLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-400">
          Last 100 admin and AI actions (logins, generations, approvals, settings changes).
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load logs ({error}). Is the database configured and migrated?
        </div>
      )}

      {ok && (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Time</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Action</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Actor</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">Target</th>
                <th className="px-4 py-2 text-left font-medium text-slate-400">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No activity yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-400">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-slate-200">{row.action}</td>
                  <td className="px-4 py-2 text-slate-400">{row.admin_email || row.actor_label || "—"}</td>
                  <td className="px-4 py-2 text-slate-400">
                    {row.target_type ? `${row.target_type}${row.target_id ? ` #${row.target_id}` : ""}` : "—"}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{row.ip_address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
