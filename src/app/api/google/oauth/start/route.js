import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/app/lib/auth";
import { buildGoogleAuthUrl, isConnectionKind } from "@/app/lib/google";
import { SITE_URL } from "@/app/lib/seo";

const STATE_COOKIE = "tbx_google_oauth_state";

// GET /api/google/oauth/start?kind=main|business
export async function GET(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const kind = new URL(request.url).searchParams.get("kind") || "main";
  const back = new URL("/admin/settings", SITE_URL);
  if (!isConnectionKind(kind)) {
    back.searchParams.set("google_error", "Unknown connection type.");
    return NextResponse.redirect(back);
  }

  const state = randomBytes(24).toString("hex");
  try {
    const response = NextResponse.redirect(await buildGoogleAuthUrl(state, kind));
    // The callback URL is shared, so the cookie remembers which connection this is.
    response.cookies.set(STATE_COOKIE, `${kind}.${state}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/google/oauth",
      maxAge: 600,
    });
    return response;
  } catch (error) {
    back.searchParams.set("google_error", error.message);
    return NextResponse.redirect(back);
  }
}
