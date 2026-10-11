// Plain server-rendered table for metric lists. `columns` = [{ key, label, align, format }].
export default function MetricTable({ title, hint, columns, rows, emptyText = "No data." }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-3">
        <p className="text-sm text-slate-200">{title}</p>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-900">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-2 font-medium text-slate-400 ${c.align === "right" ? "text-right" : "text-left"}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 py-2 ${
                      c.align === "right" ? "text-right tabular-nums text-slate-300" : "text-slate-200 break-all"
                    }`}
                  >
                    {c.format ? c.format(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const fmt = {
  int: (v) => Number(v || 0).toLocaleString(),
  pct: (v) => `${(Number(v || 0) * 100).toFixed(1)}%`,
  pos: (v) => Number(v || 0).toFixed(1),
};
