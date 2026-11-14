import OutreachNav from "../OutreachNav";
import LeadsManager from "./LeadsManager";
import { listLeads, getStats } from "@/app/lib/outreach/leads";
import { getOutreachSettings } from "@/app/lib/outreach/settings";
import { smtpProblem } from "@/app/lib/outreach/mailer";

export const metadata = { title: "Leads & emails | Lead Outreach", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function load() {
  try {
    const [leads, stats, settings] = await Promise.all([listLeads(), getStats(), getOutreachSettings()]);
    return { ok: true, leads, stats, settings };
  } catch (error) {
    return { ok: false, error: error.message, leads: [], stats: {}, settings: {} };
  }
}

export default async function OutreachLeadsPage() {
  const { ok, error, leads, stats, settings } = await load();
  const warning = !ok
    ? `Could not load leads (${error}). Run npm run db:migrate.`
    : !settings.ai_api_key
    ? "Add the AI API key in Settings to write emails."
    : smtpProblem(settings)
    ? `Sending is off until SMTP is set up in Settings: ${smtpProblem(settings)}`
    : null;
  return (
    <div className="space-y-6">
      <OutreachNav active="/admin/outreach/leads" warning={warning} />
      <LeadsManager
        leads={leads}
        stats={stats}
        canSend={ok && !smtpProblem(settings)}
        dailyLimit={Number(settings.daily_limit) || 0}
      />
    </div>
  );
}
