"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DESCRIBE = {
  seo: (r) => `Synced ${r.startDate} → ${r.endDate}: ${r.clicks} clicks, ${r.queries} queries, ${r.pages} pages.`,
  analytics: (r) => `Synced ${r.startDate} → ${r.endDate}: ${r.users} users, ${r.sessions} sessions.`,
  ai: (r) => `Analysis done: ${r.inserted} new recommendations${r.skipped ? `, ${r.skipped} duplicates skipped` : ""}.`,
};

// POSTs to an admin endpoint, then refreshes the server-rendered page.
export default function ActionButton({ endpoint, label, busyLabel, kind }) {
  const describe = DESCRIBE[kind];
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  async function run() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ ok: false, text: data.error || "Request failed." });
      } else {
        setMessage({ ok: true, text: describe ? describe(data.result) : "Done." });
        router.refresh();
      }
    } catch {
      setMessage({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50"
      >
        {busy ? busyLabel || "Working..." : label}
      </button>
      {message && (
        <p className={`text-xs max-w-sm text-right ${message.ok ? "text-emerald-300" : "text-red-300"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
