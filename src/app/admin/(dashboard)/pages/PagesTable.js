"use client";
import { useMemo, useState } from "react";

const SOURCE_STYLES = {
  code: "bg-sky-900/40 text-sky-300",
  admin: "bg-violet-900/50 text-violet-200",
};

const STATUS_STYLES = {
  published: "text-emerald-300",
  draft: "text-sky-300",
  planned: "text-slate-400",
  scheduled: "text-sky-300",
  rejected: "text-slate-500",
  failed: "text-red-300",
};

const COLUMNS = [
  { key: "title", label: "Page" },
  { key: "source", label: "Source" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "views", label: "Views", numeric: true },
  { key: "users", label: "Users", numeric: true },
  { key: "clicks", label: "Search clicks", numeric: true },
  { key: "impressions", label: "Impressions", numeric: true },
  { key: "position", label: "Avg position", numeric: true },
];

const selectCls =
  "rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500";

const int = (n) => Number(n || 0).toLocaleString("en-IN");

export default function PagesTable({ pages }) {
  const [source, setSource] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("published");
  const [traffic, setTraffic] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "views", dir: "desc" });

  const types = useMemo(() => [...new Set(pages.map((p) => p.type))], [pages]);
  const statuses = useMemo(() => [...new Set(pages.map((p) => p.status))], [pages]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = pages.filter(
      (p) =>
        (source === "all" || p.source === source) &&
        (type === "all" || p.type === type) &&
        (status === "all" || p.status === status) &&
        (traffic === "all" || (traffic === "none" ? p.views === 0 : p.views > 0)) &&
        (!q || p.title.toLowerCase().includes(q) || p.path.toLowerCase().includes(q))
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      // Pages without a search position always sort last.
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (typeof av === "number" ? av - bv : String(av).localeCompare(String(bv))) * dir;
    });
  }, [pages, source, type, status, traffic, search, sort]);

  function toggleSort(key, numeric) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: numeric ? "desc" : "asc" }));
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or URL"
          className={`${selectCls} min-w-[200px] flex-1 placeholder:text-slate-600`}
        />
        <select value={source} onChange={(e) => setSource(e.target.value)} className={selectCls}>
          <option value="all">All sources</option>
          <option value="code">Code pages</option>
          <option value="admin">Admin-created</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
          <option value="all">Any status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "published" ? "Live" : s}
            </option>
          ))}
        </select>
        <select value={traffic} onChange={(e) => setTraffic(e.target.value)} className={selectCls}>
          <option value="all">Any traffic</option>
          <option value="some">Getting views</option>
          <option value="none">0 views</option>
        </select>
        <span className="text-xs text-slate-500">{rows.length} pages</span>
      </div>

      <div className="max-h-[640px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-900">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className={`px-3 py-2 font-medium text-slate-400 ${c.numeric ? "text-right" : "text-left"}`}>
                  <button type="button" onClick={() => toggleSort(c.key, c.numeric)} className="hover:text-white">
                    {c.label}
                    {sort.key === c.key && (sort.dir === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-slate-500">
                  No pages match these filters.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.path} className={p.status === "published" && p.views === 0 ? "bg-amber-950/10" : ""}>
                <td className="px-3 py-2">
                  <p className="text-slate-100">{p.title}</p>
                  <div className="flex flex-wrap gap-x-3 text-xs">
                    {p.status === "published" ? (
                      <a href={p.path} target="_blank" className="font-mono text-violet-300 hover:underline break-all">
                        {p.path}
                      </a>
                    ) : (
                      <span className="font-mono text-slate-500 break-all">{p.path}</span>
                    )}
                    {p.editHref && (
                      <a href={p.editHref} className="text-slate-400 hover:underline">
                        Manage
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${SOURCE_STYLES[p.source]}`}>
                    {p.source === "code" ? "Code" : "Admin"}
                    {p.sourceNote && ` · ${p.sourceNote}`}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-300">{p.type}</td>
                <td className={`px-3 py-2 ${STATUS_STYLES[p.status] || "text-slate-300"}`}>
                  {p.status === "published" ? "Live" : p.status}
                </td>
                <td className={`px-3 py-2 text-right tabular-nums ${p.views === 0 ? "text-amber-300" : "text-slate-200"}`}>{int(p.views)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(p.users)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(p.clicks)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(p.impressions)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-300">{p.position ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
