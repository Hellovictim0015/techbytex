import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/auth";
import { getLocationPageForPreview, toLandingProps } from "@/app/lib/location-pages";
import CityLandingPage from "@/app/components/CityLandingPage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Preview | TechByteX Admin",
  robots: { index: false, follow: false },
};

// Draft preview in the real site layout — outside the (dashboard) group so it
// gets the public Navbar/Footer instead of the admin sidebar.
export default async function LocationPreviewPage({ params }) {
  const { id } = await params;
  if (!(await requireAdmin())) redirect(`/admin/login?next=/admin/location-preview/${id}`);
  const page = await getLocationPageForPreview(Number(id));
  if (!page || !page.body_html) notFound();

  return (
    <>
      <div className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-slate-900">
        Preview · status: {page.status} · will be live at /{page.slug} after publishing
      </div>
      <CityLandingPage {...toLandingProps(page)} />
    </>
  );
}
