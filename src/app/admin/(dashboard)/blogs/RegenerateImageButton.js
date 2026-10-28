"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegenerateImageButton({ id, hasImage }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function regenerate() {
    if (hasImage && !confirm("Replace the current featured image with a new AI photo?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/blogs/${id}/image`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) setError(data.error || `Failed (${res.status}).`);
      else router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={regenerate}
        disabled={busy}
        className="rounded-md border border-violet-700 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-900/40 disabled:opacity-50"
      >
        {busy ? "Generating realistic photo (~1 min)..." : hasImage ? "Regenerate image" : "Generate image"}
      </button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
