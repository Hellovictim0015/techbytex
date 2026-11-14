import { listMembers, listLeads } from "@/app/lib/team-leads";
import LeadAssignManager from "./LeadAssignManager";

export const metadata = {
  title: "Lead Assign | TechByteX Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function load() {
  try {
    const [members, leads] = await Promise.all([listMembers(), listLeads()]);
    return { ok: true, members, leads };
  } catch (error) {
    return { ok: false, error: error.message, members: [], leads: [] };
  }
}

export default async function AdminLeadAssignPage() {
  const { ok, error, members, leads } = await load();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Lead Assign</h1>
        <p className="mt-1 text-sm text-slate-400">
          Add leads, give each one to a team member, and share their private link — they see only their own leads and
          update the status after every call.
        </p>
      </div>
      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load leads ({error}). Run <code className="font-mono">npm run db:migrate</code>.
        </div>
      )}
      <LeadAssignManager
        members={members.map((m) => ({ ...m, total: Number(m.total), open_leads: Number(m.open_leads), converted: Number(m.converted) }))}
        leads={leads}
      />
    </div>
  );
}
