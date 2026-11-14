import Link from "next/link";

const TABS = [
  { href: "/admin/outreach", label: "Dashboard" },
  { href: "/admin/outreach/search", label: "Find leads" },
  { href: "/admin/outreach/import", label: "Import emails" },
  { href: "/admin/outreach/leads", label: "Leads & emails" },
  { href: "/admin/outreach/settings", label: "Settings" },
];

// Header + tabs shared by every Lead Outreach page.
export default function OutreachNav({ active, warning }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Lead Outreach</h1>
        <p className="mt-1 text-sm text-slate-400">
          Find businesses, check their website, write a personal email with AI, review it, then send.
        </p>
      </div>
      <nav className="flex flex-wrap gap-1 border-b border-slate-800">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${
              active === t.href ? "border-violet-500 text-white" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {warning && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">{warning}</div>
      )}
    </div>
  );
}
