// Lead statuses for Admin → Lead Assign and the team member page. Plain data
// (no server imports) so client components can use it too.
export const LEAD_STATUSES = [
  { value: "new", label: "New", style: "bg-slate-100 text-slate-700 border-slate-300", dark: "bg-slate-800 text-slate-200 border-slate-600" },
  { value: "call_done", label: "Call done", style: "bg-sky-50 text-sky-700 border-sky-300", dark: "bg-sky-900/40 text-sky-300 border-sky-700" },
  { value: "follow_up", label: "Follow-up", style: "bg-amber-50 text-amber-700 border-amber-300", dark: "bg-amber-900/40 text-amber-300 border-amber-700" },
  { value: "converted", label: "Converted (lead done)", style: "bg-emerald-50 text-emerald-700 border-emerald-300", dark: "bg-emerald-900/40 text-emerald-300 border-emerald-700" },
  { value: "cancelled", label: "Cancelled", style: "bg-red-50 text-red-700 border-red-300", dark: "bg-red-900/40 text-red-300 border-red-700" },
];

export const statusInfo = (value) => LEAD_STATUSES.find((s) => s.value === value) || LEAD_STATUSES[0];
