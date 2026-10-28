"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Generates a realistic featured photo for every post that has no image or a
// placeholder one — one request at a time so each stays under the time limit.
export default function FixImagesButton({ ids }) {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  async function run() {
    if (!confirm(`Generate new AI photos for ${ids.length} post(s)? (~1 min each)`)) return;
    setError("");
    let done = 0;
    for (const id of ids) {
      setProgress(`${done + 1}/${ids.length}`);
      try {
        const res = await fetch(`/api/admin/blogs/${id}/image`, { method: "POST" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) setError(`Post #${id}: ${data.error || res.status}`);
      } catch {
        setError(`Post #${id}: could not reach the server.`);
      }
      done++;
    }
    setProgress(null);
    router.refresh();
  }

  if (ids.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={Boolean(progress)}
        className="rounded-md border border-amber-700 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-900/30 disabled:opacity-50"
      >
        {progress ? `Generating photos ${progress}...` : `Fix ${ids.length} missing / placeholder image(s)`}
      </button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
