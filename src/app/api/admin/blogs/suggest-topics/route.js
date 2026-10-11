import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { suggestBlogTopics } from "@/app/lib/topic-suggestions";

export const maxDuration = 120;

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await suggestBlogTopics({ adminUserId: admin.id });
    await logAudit({
      adminUserId: admin.id,
      action: "blog_topics_suggested",
      targetType: "ai_analysis_reports",
      targetId: String(result.reportId),
      details: { count: result.topics.length },
      ip: await getClientIp(),
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
