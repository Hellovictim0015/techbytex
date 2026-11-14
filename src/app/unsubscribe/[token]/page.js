import { leadByUnsubscribeToken } from "@/app/lib/outreach/leads";
import UnsubscribeButton from "./UnsubscribeButton";

// Public unsubscribe page linked from every outreach email. Unsubscribing takes
// a click (POST) so link scanners in mail filters can't do it by accident;
// mail clients' one-click unsubscribe POSTs to /api/unsubscribe/<token>.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unsubscribe | TechByteX",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function UnsubscribePage({ params }) {
  const { token } = await params;
  const lead = await leadByUnsubscribeToken(token).catch(() => null);
  return (
    <main className="min-h-[70vh] bg-white px-4 pt-32 pb-20 font-sans">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Unsubscribe</h1>
        {!lead ? (
          <p className="mt-3 text-slate-600">This link is not valid. If you keep getting emails from us, reply with &quot;unsubscribe&quot; and we will remove you.</p>
        ) : lead.status === "unsubscribed" ? (
          <p className="mt-3 text-slate-600">You are unsubscribed. TechByteX will not email {lead.email || "you"} again.</p>
        ) : (
          <>
            <p className="mt-3 text-slate-600">
              Stop all emails from TechByteX to <strong>{lead.email || "this address"}</strong>?
            </p>
            <UnsubscribeButton token={token} />
          </>
        )}
      </div>
    </main>
  );
}
