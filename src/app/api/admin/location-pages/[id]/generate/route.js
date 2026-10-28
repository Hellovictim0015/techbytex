import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { generateLocationPageContent } from "@/app/lib/location-pages";

export const maxDuration = 180;

// POST — AI writes (or rewrites) one page's content and saves it as a draft.
export async function POST(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const result = await generateLocationPageContent(Number(id));
    await logAudit({
      adminUserId: admin.id,
      action: "location_page_generated",
      targetType: "location_pages",
      targetId: String(id),
      details: { slug: result.slug, words: result.words },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
