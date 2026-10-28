import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";
import { cleanUrl } from "@/app/lib/projects";
import { nextSortOrder } from "@/app/lib/ordering";

// POST /api/admin/projects — add a project to the end of the homepage list.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = String(body.title || "").trim().slice(0, 255);
    if (!title) throw new Error("Title is required.");
    const subtitle = String(body.subtitle || "").trim().slice(0, 255) || null;
    const imageUrl = cleanUrl(body.image_url, { required: true, label: "Image" });
    const linkUrl = cleanUrl(body.link_url, { label: "Live link" });

    const next = await nextSortOrder("projects");
    const result = await query(
      `INSERT INTO projects (title, subtitle, image_url, link_url, sort_order, is_visible)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, subtitle, imageUrl, linkUrl, next, body.is_visible === false ? 0 : 1]
    );

    revalidatePath("/");
    await logAudit({
      adminUserId: admin.id,
      action: "project_created",
      targetType: "projects",
      targetId: String(result.insertId),
      details: { title },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
