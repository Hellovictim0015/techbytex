import { unsubscribe } from "@/app/lib/outreach/leads";

// POST — one-click unsubscribe (RFC 8058 List-Unsubscribe-Post) and the
// button on /unsubscribe/<token>. Public: the token is the only key.
export async function POST(req, { params }) {
  const { token } = await params;
  const ok = await unsubscribe(token).catch(() => false);
  return Response.json(
    ok ? { success: true } : { success: false, error: "This unsubscribe link is not valid." },
    { status: ok ? 200 : 404, headers: { "Cache-Control": "no-store" } }
  );
}
