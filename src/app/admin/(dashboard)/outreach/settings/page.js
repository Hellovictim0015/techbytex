import OutreachNav from "../OutreachNav";
import SettingsForm from "./SettingsForm";
import { getSettingsForAdmin, AI_DEFAULT_MODELS, DEFAULT_PROMPT } from "@/app/lib/outreach/settings";
import { encryptionKeyProblem } from "@/app/lib/encryption";

export const metadata = { title: "Settings | Lead Outreach", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OutreachSettingsPage() {
  const keyProblem = encryptionKeyProblem();
  let settings = null;
  let loadError = null;
  try {
    settings = await getSettingsForAdmin();
  } catch (error) {
    loadError = error.message;
  }
  const warning = keyProblem
    ? `${keyProblem} Add a long random ENCRYPTION_KEY (32+ characters) and restart the app — API keys and the SMTP password can't be saved until then.`
    : loadError
    ? `Could not load settings (${loadError}). Run npm run db:migrate.`
    : null;
  return (
    <div className="space-y-6">
      <OutreachNav active="/admin/outreach/settings" warning={warning} />
      {settings && (
        <SettingsForm initial={settings} defaultModels={AI_DEFAULT_MODELS} defaultPrompt={DEFAULT_PROMPT} canSave={!keyProblem} />
      )}
    </div>
  );
}
