import { getAllPortfolioForAdmin } from "@/app/lib/portfolio";
import PortfolioManager from "./PortfolioManager";

export const metadata = {
  title: "Portfolio | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    return { ok: true, projects: await getAllPortfolioForAdmin() };
  } catch (error) {
    return { ok: false, error: error.message, projects: [] };
  }
}

export default async function AdminPortfolioPage() {
  const { ok, error, projects } = await load();
  const visible = projects.filter((p) => p.is_visible).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Portfolio</h1>
        <p className="mt-1 text-sm text-slate-400">
          Projects on the{" "}
          <a href="/portfolio" target="_blank" className="text-violet-300 hover:underline">
            /portfolio
          </a>{" "}
          page. {visible} of {projects.length} shown. Images are saved in the uploads folder.
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load portfolio ({error}). Run <code className="font-mono">npm run db:migrate</code> and{" "}
          <code className="font-mono">npm run portfolio:import</code>.
        </div>
      )}

      <PortfolioManager projects={projects} />
    </div>
  );
}
