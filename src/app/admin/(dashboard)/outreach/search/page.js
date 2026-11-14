import OutreachNav from "../OutreachNav";
import SearchForm from "./SearchForm";
import { getOutreachSettings } from "@/app/lib/outreach/settings";

export const metadata = { title: "Find leads | Lead Outreach", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OutreachSearchPage() {
  const settings = await getOutreachSettings().catch(() => ({}));
  const warning = !settings.places_api_key
    ? "Add the Google Places API key in Lead Outreach → Settings before searching."
    : null;
  return (
    <div className="space-y-6">
      <OutreachNav active="/admin/outreach/search" warning={warning} />
      <SearchForm />
    </div>
  );
}
