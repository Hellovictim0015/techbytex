import { getAllProjectsForAdmin } from "@/app/lib/projects";
import ProjectsManager from "./ProjectsManager";

export const metadata = {
  title: "Projects | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    return { ok: true, projects: await getAllProjectsForAdmin() };
  } catch (error) {
    return { ok: false, error: error.message, projects: [] };
  }
}

export default async function AdminProjectsPage() {
  const { ok, error, projects } = await load();
  const visible = projects.filter((p) => p.is_visible).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Recent Projects</h1>
        <p className="mt-1 text-sm text-slate-400">
          The scrolling &quot;Recent Projects&quot; strip on the homepage. {visible} of {projects.length} shown.
          Changes appear on the site right away.
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load projects ({error}). Run <code className="font-mono">npm run db:migrate</code> if the
          projects table is missing.
        </div>
      )}

      <ProjectsManager projects={projects} />
    </div>
  );
}
