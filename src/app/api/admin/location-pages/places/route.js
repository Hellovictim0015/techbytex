import { getCurrentAdmin } from "@/app/lib/auth";
import { listPlaces } from "@/app/lib/location-pages";

export const maxDuration = 60;

// POST { country, state?, district?, city? } — next level of place names for the pickers.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const s = (v) => (typeof v === "string" ? v.trim().slice(0, 150) : "");
  try {
    const result = await listPlaces({
      country: s(body.country),
      state: s(body.state),
      district: s(body.district),
      city: s(body.city),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
