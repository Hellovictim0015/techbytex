import { NextResponse } from "next/server";
import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { connectGoogleWithCode, isConnectionKind } from "@/app/lib/google";

const STATE_COOKIE = "tbx_google_oauth_state";

export async function GET(request) {
  const url = new URL(request.url);
  const back = new URL("/admin/settings", request.url);

  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const [kind, expectedState] = (request.cookies.get(STATE_COOKIE)?.value || "").split(".");
  const googleError = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (googleError) {
    back.searchParams.set("google_error", googleError);
  } else if (!code || !state || !expectedState || state !== expectedState || !isConnectionKind(kind)) {
    back.searchParams.set("google_error", "Invalid or expired OAuth state. Try connecting again.");
  } else {
    try {
      const { email } = await connectGoogleWithCode(code, kind);
      await logAudit({
        adminUserId: admin.id,
        action: kind === "business" ? "google_business_connected" : "google_connected",
        targetType: "integration",
        targetId: kind,
        details: { email },
        ip: await getClientIp(),
      });
      back.searchParams.set("google", kind === "business" ? "business_connected" : "connected");
    } catch (error) {
      back.searchParams.set("google_error", error.message);
    }
  }

  const response = NextResponse.redirect(back);
  response.cookies.set(STATE_COOKIE, "", { path: "/api/google/oauth", maxAge: 0 });
  return response;
}
