import { getCurrentAdmin } from "@/app/lib/auth";
import { getOutreachSettings } from "@/app/lib/outreach/settings";
import { testPlacesKey, testPageSpeedKey } from "@/app/lib/outreach/google";
import { testAiKey } from "@/app/lib/outreach/ai-email";

const unauthorized = () => Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
const fail = (error, status = 400) => Response.json({ success: false, error: error.message || String(error) }, { status });

// POST — checks each saved API key with one small real request.
export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();
  const s = await getOutreachSettings();
  const check = async (key, fn) => {
    if (!key) return { ok: false, message: "Not set" };
    try {
      await fn();
      return { ok: true, message: "Working" };
    } catch (error) {
      return { ok: false, message: error.message.slice(0, 300) };
    }
  };
  const [places, pagespeed, ai] = await Promise.all([
    check(s.places_api_key, () => testPlacesKey(s.places_api_key)),
    check(s.pagespeed_api_key, () => testPageSpeedKey(s.pagespeed_api_key)),
    check(s.ai_api_key, () => testAiKey(s)),
  ]);
  return Response.json({ success: true, results: { places, pagespeed, ai } });
}
