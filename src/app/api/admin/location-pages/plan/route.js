import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { planLocationPages } from "@/app/lib/location-pages";

export const maxDuration = 120;

// POST { country, state, district, city, areas[], services[], count, notes }
// — AI plans the page list for one place; pages are saved as 'planned'.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const s = (v, max = 150) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const list = (v) =>
    (Array.isArray(v) ? v : [])
      .filter((x) => typeof x === "string" && x.trim())
      .slice(0, 30)
      .map((x) => s(x, 100));

  try {
    const result = await planLocationPages({
      country: s(body.country),
      state: s(body.state),
      district: s(body.district),
      city: s(body.city),
      areas: list(body.areas),
      serviceSlugs: list(body.services),
      count: Number(body.count) || 35,
      notes: s(body.notes, 1000),
      adminUserId: admin.id,
    });
    await logAudit({
      adminUserId: admin.id,
      action: "location_plan_created",
      targetType: "location_plans",
      targetId: String(result.planId),
      details: { city: body.city, planned: result.planned, skipped: result.skipped },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
