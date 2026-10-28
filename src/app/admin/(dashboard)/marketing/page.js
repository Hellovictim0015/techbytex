import Link from "next/link";
import { listCampaigns, getBusinessDetails, getSmsConfig } from "@/app/lib/sms";
import MarketingManager from "./MarketingManager";

export const metadata = {
  title: "Marketing | TechByteX Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function load() {
  try {
    const [campaigns, business, config] = await Promise.all([listCampaigns(), getBusinessDetails(), getSmsConfig()]);
    return {
      ok: true,
      campaigns,
      business,
      config: {
        apiKey: Boolean(config.apiKey),
        dlt: Boolean(config.senderId && config.templateId),
        senderId: config.senderId,
        templateId: config.templateId,
        whatsappMessageId: config.whatsappMessageId,
      },
    };
  } catch (error) {
    return { ok: false, error: error.message, campaigns: [], business: {}, config: {} };
  }
}

export default async function AdminMarketingPage() {
  const { ok, error, campaigns, business, config } = await load();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Marketing — Bulk SMS &amp; WhatsApp</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload a contact sheet, pick SMS or your approved WhatsApp template, and send it to everyone through Fast2SMS.
        </p>
      </div>
      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load marketing data ({error}). Run <code className="font-mono">npm run db:migrate</code>.
        </div>
      )}
      {ok && !config.apiKey && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Fast2SMS API key is not set. Add it in <Link href="/admin/settings" className="underline">Settings → SMS (Fast2SMS)</Link> or as
          FAST2SMS_API_KEY in the server env file.
        </div>
      )}
      <MarketingManager campaigns={campaigns} business={business} config={config} />
    </div>
  );
}
