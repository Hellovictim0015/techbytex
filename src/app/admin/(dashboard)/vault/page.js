import { getVault, vaultKeyProblem, ENTRY_TYPES } from "@/app/lib/vault";
import VaultManager from "./VaultManager";

export const metadata = {
  title: "Client Vault | TechByteX Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function load() {
  try {
    return { ok: true, ...(await getVault()) };
  } catch (error) {
    return { ok: false, error: error.message, clients: [], entries: [] };
  }
}

export default async function AdminVaultPage() {
  const { ok, error, clients, entries } = await load();
  const keyProblem = vaultKeyProblem();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Client Vault</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every client&apos;s website links, logins and renewal dates in one place. Passwords are encrypted and
          every reveal is logged.
        </p>
      </div>
      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load the vault ({error}). Run <code className="font-mono">npm run db:migrate</code>.
        </div>
      )}
      {keyProblem && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          {keyProblem} Add a long random <code className="font-mono">VAULT_KEY</code> (32+ characters) and restart
          the app. Keep a copy of it safe — without it saved passwords cannot be read.
        </div>
      )}
      <VaultManager clients={clients} entries={entries} types={ENTRY_TYPES} canSave={ok && !keyProblem} />
    </div>
  );
}
