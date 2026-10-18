import { revalidatePath } from "next/cache";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { query } from "@/app/lib/db";
import { portfolioColumnsFromBody } from "@/app/lib/portfolio";
import { nextSortOrder } from "@/app/lib/ordering";

// POST /api/admin/portfolio — add a project to the end of the /portfolio page.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cols = portfolioColumnsFromBody(await req.json(), { requireAll: true });
    cols.sort_order = await nextSortOrder("portfolio_projects");
    if (cols.is_visible === undefined) cols.is_visible = 1;

    const keys = Object.keys(cols);
    const result = await query(
      `INSERT INTO portfolio_projects (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
      keys.map((k) => cols[k])
    );

    revalidatePath("/portfolio");
    await logAudit({
      adminUserId: admin.id,
      action: "portfolio_created",
      targetType: "portfolio_projects",
      targetId: String(result.insertId),
      details: { title: cols.title },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
