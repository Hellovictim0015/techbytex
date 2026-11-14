import OutreachNav from "../OutreachNav";
import ImportManager from "./ImportManager";
import { getSettingsForAdmin, getOutreachSettings, AI_DEFAULT_MODELS } from "@/app/lib/outreach/settings";
import { smtpProblem } from "@/app/lib/outreach/mailer";
import { encryptionKeyProblem } from "@/app/lib/encryption";

export const metadata = { title: "Import emails | Lead Outreach", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OutreachImportPage() {
  let masked = null;
  let sendProblem = null;
  let loadError = null;
  try {
    masked = await getSettingsForAdmin();
    sendProblem = smtpProblem(await getOutreachSettings());
  } catch (error) {
    loadError = error.message;
  }
  const warning = encryptionKeyProblem() || (loadError ? `Could not load settings (${loadError}). Run npm run db:migrate.` : null);
  return (
    <div className="space-y-6">
      <OutreachNav active="/admin/outreach/import" warning={warning} />
      {masked && (
        <ImportManager
          ai={{ provider: masked.ai_provider, model: masked.ai_model, savedKey: masked.ai_api_key }}
          defaultModels={AI_DEFAULT_MODELS}
          sendProblem={sendProblem}
          dailyLimit={Number(masked.daily_limit) || 0}
        />
      )}
    </div>
  );
}
