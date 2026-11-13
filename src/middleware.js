import { NextResponse } from "next/server";
import { isRetiredLocationPath, replacementForRetiredLocation } from "./app/lib/retired-urls.mjs";

const SESSION_COOKIE = "tbx_admin_session";

// Removed location pages answer 410 Gone so Google drops them quickly, with a
// short page pointing people to the matching service.
function gone(pathname) {
  const next = replacementForRetiredLocation(pathname);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Page removed | TechByteX</title>
<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;color:#0f172a;background:#fff}
a{color:#7c3aed;font-weight:600}</style></head><body>
<h1>This page has been removed</h1>
<p>We no longer have a separate page for this location. The service is still available — TechByteX works with clients across India from Dalli Rajhara, Chhattisgarh.</p>
<p><a href="${next}">See the service</a> · <a href="/contact">Contact us</a> · <a href="/">Home</a></p>
</body></html>`;
  return new NextResponse(html, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

// Lightweight, Edge-safe gate: only checks cookie presence for fast redirects.
// The authoritative check (DB-backed session validity + expiry) happens in
// src/app/admin/layout.js via requireAdmin(), which cannot run on the Edge
// runtime because it needs a MySQL connection.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isRetiredLocationPath(pathname)) {
    return gone(pathname);
  }

  if (pathname.startsWith("/admin")) {
    // Admin pages must never be indexed, even if a URL leaks.
    const noindex = (res) => {
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    };
    if (pathname === "/admin/login") {
      return noindex(NextResponse.next());
    }
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return noindex(NextResponse.redirect(loginUrl));
    }
    return noindex(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  // Admin, plus top-level single-segment paths (where location pages live).
  matcher: ["/admin/:path*", "/((?!api|_next|uploads|.*\\..*)[^/]+)"],
};
