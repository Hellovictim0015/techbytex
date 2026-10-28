import { getPlansForAdmin, getLatestLocationSuggestions, LOCATION_SERVICES } from "@/app/lib/location-pages";
import LocationPagesManager from "./LocationPagesManager";

export const metadata = {
  title: "Location Pages | TechByteX Admin",
  robots: { index: false, follow: false },
};

async function load() {
  try {
    const [plans, suggestions] = await Promise.all([
      getPlansForAdmin(),
      getLatestLocationSuggestions().catch(() => null),
    ]);
    return { ok: true, plans, suggestions };
  } catch (error) {
    return { ok: false, error: error.message, plans: [], suggestions: null };
  }
}

export default async function AdminLocationPagesPage() {
  const { ok, error, plans, suggestions } = await load();
  const pages = plans.flatMap((p) => p.pages);
  const published = pages.filter((p) => p.status === "published").length;
  const drafts = pages.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Location Pages</h1>
        <p className="mt-1 text-sm text-slate-400">
          AI-planned local SEO pages for any country, state, district or city. {plans.length} places ·{" "}
          {published} live · {drafts} drafts waiting for review. Nothing goes live until you publish it.
        </p>
      </div>

      {!ok && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          Could not load location pages ({error}). Run <code className="font-mono">npm run db:migrate</code>.
        </div>
      )}

      <LocationPagesManager
        plans={plans}
        initialSuggestions={suggestions}
        services={LOCATION_SERVICES.map(({ slug, label }) => ({ slug, label }))}
      />
    </div>
  );
}
