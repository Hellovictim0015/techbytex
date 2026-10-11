"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogStatusButtons({ id, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function update(next) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || "Update failed.");
      else router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  const btn = "rounded-md px-3 py-1.5 text-sm disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "published" && (
        <button disabled={busy} onClick={() => update("published")} className={`${btn} bg-emerald-700 text-white hover:bg-emerald-600`}>
          Publish
        </button>
      )}
      {status === "published" && (
        <button disabled={busy} onClick={() => update("draft")} className={`${btn} bg-slate-800 text-slate-200 hover:bg-slate-700`}>
          Unpublish
        </button>
      )}
      {status !== "rejected" && status !== "published" && (
        <button disabled={busy} onClick={() => update("rejected")} className={`${btn} bg-slate-800 text-slate-300 hover:bg-slate-700`}>
          Reject
        </button>
      )}
      {status === "rejected" && (
        <button disabled={busy} onClick={() => update("draft")} className={`${btn} bg-slate-800 text-slate-300 hover:bg-slate-700`}>
          Move back to draft
        </button>
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
