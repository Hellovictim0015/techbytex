import Link from "next/link";
import { query } from "@/app/lib/db";
import { FORM_TYPES } from "@/app/lib/forms";
import StatCard from "../StatCard";
import LeadRow from "./LeadRow";

export const metadata = {
  title: "Leads | TechByteX Admin",
  robots: { index: false, follow: false },
};

const STATUSES = ["new", "contacted", "closed", "spam"];

async function load({ type, status }) {
  try {
    const where = [];
    const params = [];
    if (type && FORM_TYPES[type]) {
      where.push("form_type = ?");
      params.push(type);
    }
    if (status && STATUSES.includes(status)) {
      where.push("status = ?");
      params.push(status);
    } else {
      where.push("status <> 'spam'");
    }

    const [leads, counts] = await Promise.all([
      query(
        `SELECT * FROM form_submissions
         ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
         ORDER BY created_at DESC, id DESC LIMIT 300`,
        params
      ),
      query(
        `SELECT
           COUNT(*) AS total,
           SUM(status = 'new') AS new_count,
           SUM(created_at > (NOW() - INTERVAL 7 DAY) AND status <> 'spam') AS week,
           SUM(form_type = 'book_demo' AND status <> 'spam') AS demos
         FROM form_submissions`
      ),
    ]);
    return { ok: true, leads, counts: counts[0] };
  } catch (error) {
    return { ok: false, error: error.message, leads: [], counts: {} };
  }
}

function FilterLink({ label, href, active }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs ${
        active ? "bg-violet-700 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
      }`}
    >
      {label}
    </Link>
  );
}

export default async function AdminLeadsPage({ searchParams }) {
  const { type, status } = await searchParams;
  const { ok, error, leads, counts } = await load({ type, status });

  const href = (next) => {
    const params = new URLSearchParams({ ...(type && { type }), ...(status && { status }), ...next });
    for (const [k, v] of [...params]) if (!v) params.delete(k);
    const qs = params.toString();
    return `/admin/leads${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Leads</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every form submitted on the website — contact, free consultation and newsletter.
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load leads ({error}). Run <code className="font-mono">npm run db:migrate</code> if the
          form_submissions table is missing.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="New (not contacted)" value={Number(counts.new_count || 0)} />
        <StatCard label="Last 7 days" value={Number(counts.week || 0)} />
        <StatCard label="Consultation requests" value={Number(counts.demos || 0)} />
        <StatCard label="All submissions" value={Number(counts.total || 0)} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterLink label="All forms" href={href({ type: "" })} active={!type} />
        {Object.entries(FORM_TYPES)
          .filter(([k]) => k !== "other")
          .map(([k, label]) => (
            <FilterLink key={k} label={label} href={href({ type: k })} active={type === k} />
          ))}
        <span className="mx-2 h-4 w-px bg-slate-700" />
        <FilterLink label="All (no spam)" href={href({ status: "" })} active={!status} />
        {STATUSES.map((s) => (
          <FilterLink key={s} label={s} href={href({ status: s })} active={status === s} />
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Received</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Contact</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Form / Service</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Message</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No submissions yet{type || status ? " for this filter" : ""}.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} formLabel={FORM_TYPES[lead.form_type] || lead.form_type} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
