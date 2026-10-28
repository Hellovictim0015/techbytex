import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { sendNextBatch, retryFailed, getFailedRecipients } from "@/app/lib/sms";

export const maxDuration = 120;

// GET — failed recipients of a campaign (with the Fast2SMS error).
export async function GET(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    return Response.json({ success: true, failed: await getFailedRecipients(Number(id)) });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST { action: "send" | "retry" } — "send" delivers the next batch of
// pending recipients; "retry" re-queues failed ones.
export async function POST(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const { action } = await req.json();
    const result = action === "retry" ? await retryFailed(Number(id)) : await sendNextBatch(Number(id));
    if (action === "retry" || result.pending === 0) {
      await logAudit({
        adminUserId: admin.id,
        action: action === "retry" ? "sms_campaign_retry" : "sms_campaign_finished",
        targetType: "sms_campaigns",
        targetId: String(id),
        details: { sent: result.sent, failed: result.failed },
        ip: await getClientIp(),
      });
    }
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
