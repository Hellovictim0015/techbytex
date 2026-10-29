import { FileSpreadsheet } from "lucide-react";
import { listCampaigns, getSmsConfig } from "@/app/lib/sms";
import MarketingManager from "./MarketingManager";

export const metadata = {
  title: "Marketing | TechByteX Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function load() {
  try {
    const [campaigns, config] = await Promise.all([listCampaigns(), getSmsConfig()]);
    return {
      ok: true,
      campaigns,
      config: {
        apiKey: Boolean(config.apiKey),
        dlt: Boolean(config.senderId && config.templateId),
        senderId: config.senderId,
        templateId: config.templateId,
        whatsappMessageId: config.whatsappMessageId,
      },
    };
  } catch (error) {
    return { ok: false, error: error.message, campaigns: [], config: {} };
  }
}

export default async function AdminMarketingPage() {
  const { ok, error, campaigns, config } = await load();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Marketing — Bulk WhatsApp</h1>
          <p className="mt-1 text-sm text-slate-400">
            Send the approved enquiry-update WhatsApp template (Utility) to people who contacted you, through Fast2SMS.
          </p>
        </div>
        {/* Static sample in public/ — the exact columns the uploader expects. */}
        <a
          href="/marketing-contacts-format.xlsx"
          download="TechByteX-contacts-format.xlsx"
          className="flex items-center gap-2 rounded-md border border-emerald-700 bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-900/50"
        >
          <FileSpreadsheet size={16} /> Download Excel format
        </a>
      </div>
      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load marketing data ({error}). Run <code className="font-mono">npm run db:migrate</code>.
        </div>
      )}
      {ok && !config.apiKey && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Fast2SMS is not set up. Add <code className="font-mono">FAST2SMS_API_KEY</code> and{" "}
          <code className="font-mono">FAST2SMS_WHATSAPP_MESSAGE_ID</code> to the server env file and restart the app.
        </div>
      )}
      <MarketingManager campaigns={campaigns} config={config} />
    </div>
  );
}
