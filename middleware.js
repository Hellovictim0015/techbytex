import { NextResponse } from "next/server";

const SESSION_COOKIE = "tbx_admin_session";

// Lightweight, Edge-safe gate: only checks cookie presence for fast redirects.
// The authoritative check (DB-backed session validity + expiry) happens in
// src/app/admin/layout.js via requireAdmin(), which cannot run on the Edge
// runtime because it needs a MySQL connection.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
