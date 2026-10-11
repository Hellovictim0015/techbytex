import { query } from "@/app/lib/db";
import { getIntegrationStatuses, INTEGRATION_FIELDS } from "@/app/lib/secrets";
import { getGoogleConnection } from "@/app/lib/google";
import AutoPublishToggle from "./AutoPublishToggle";
import AiProviderSelect from "./AiProviderSelect";
import IntegrationsForm from "./IntegrationsForm";

export const metadata = {
  title: "Settings | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function loadSettingsData() {
  try {
    const [settingsRows, admins, integrationStatuses, mainConnection, businessConnection] = await Promise.all([
      query("SELECT setting_key, setting_value FROM ai_settings WHERE setting_key NOT LIKE 'secret:%'"),
      query(
        "SELECT id, email, name, role, is_active, created_at FROM admin_users ORDER BY created_at ASC"
      ),
      getIntegrationStatuses(),
      getGoogleConnection("main"),
      getGoogleConnection("business"),
    ]);
    const googleConnections = { main: mainConnection, business: businessConnection };
    const settings = {};
    for (const row of settingsRows) {
      // mysql2 already deserializes JSON columns into native JS values.
      settings[row.setting_key] = row.setting_value;
    }
    return { ok: true, settings, admins, integrationStatuses, googleConnections };
  } catch (error) {
    return { ok: false, error: error.message, settings: {}, admins: [], integrationStatuses: {}, googleConnections: {} };
  }
}

export default async function AdminSettingsPage({ searchParams }) {
  const { google, google_error: googleError } = await searchParams;
  const { ok, error, settings, admins, integrationStatuses, googleConnections } =
    await loadSettingsData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Admin users and AI system defaults.
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load settings ({error}). Is the database configured and migrated?
        </div>
      )}

      {ok && (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-slate-300">AI Blog Automation</h2>
            <AutoPublishToggle initialValue={settings.auto_publish_blogs} />
            <AiProviderSelect initialValue={settings.ai_provider} />
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-medium text-slate-300">API Keys & Integrations</h2>
              <p className="text-xs text-slate-500">
                Stored encrypted in the database. Values are never shown back in full once saved —
                only a masked preview. These override the matching variable in .env.
              </p>
            </div>
            {google === "business_connected" && (
              <div className="rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
                Business Profile account connected. Click &quot;Test&quot; in the Google Business section to verify it.
              </div>
            )}
            {google === "connected" && (
              <div className="rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
                Google connected. Click &quot;Test&quot; in the Google section to verify each API.
              </div>
            )}
            {googleError && (
              <div className="rounded-md border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                Google connection failed: {googleError}
              </div>
            )}
            <IntegrationsForm
              fields={INTEGRATION_FIELDS}
              initialStatuses={integrationStatuses}
              googleConnections={googleConnections}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-medium text-slate-300">Admin Users</h2>
            <p className="text-xs text-slate-500">
              New admins are created from the server with{" "}
              <code className="font-mono">npm run admin:create</code> — there is no public
              sign-up form.
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-400">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-400">Email</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-400">Role</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {admins.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-2 text-slate-200">{a.name}</td>
                      <td className="px-4 py-2 text-slate-400">{a.email}</td>
                      <td className="px-4 py-2 text-slate-400">{a.role}</td>
                      <td className="px-4 py-2 text-slate-400">
                        {a.is_active ? "Active" : "Disabled"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
