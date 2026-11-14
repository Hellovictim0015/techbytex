// Shared bits for the Lead Outreach admin pages (client components).

export const inputCls =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50";
export const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-md bg-violet-700 px-3 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center gap-1 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50";

export async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

export const STATUS_STYLE = {
  new: "bg-slate-800 text-slate-200",
  emailed: "bg-sky-900/50 text-sky-300",
  replied: "bg-emerald-900/50 text-emerald-300",
  unsubscribed: "bg-amber-900/50 text-amber-300",
  bounced: "bg-red-900/50 text-red-300",
};

export const when = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");
