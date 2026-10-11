"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIORITY_COLORS = {
  high: "bg-red-900/40 text-red-300",
  medium: "bg-amber-900/40 text-amber-300",
  low: "bg-slate-800 text-slate-400",
};

export default function RecommendationRow({ rec }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(status) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/recommendations/${rec.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr>
      <td className="px-4 py-3 align-top text-slate-200">
        <p className="font-medium">{rec.type}</p>
        {rec.page_path && <p className="text-xs text-slate-500">{rec.page_path}</p>}
      </td>
      <td className="px-4 py-3 align-top text-slate-400 max-w-md">
        <p className="text-slate-200">{rec.issue}</p>
        {rec.current_value && (
          <p className="mt-2 text-xs">
            <span className="text-slate-500">Current: </span>
            <span className="text-slate-400">{rec.current_value}</span>
          </p>
        )}
        {rec.suggested_value && (
          <p className="mt-1 text-xs">
            <span className="text-slate-500">Suggested: </span>
            <span className="text-emerald-300">{rec.suggested_value}</span>
          </p>
        )}
        {rec.reason && <p className="mt-1 text-xs text-slate-500">{rec.reason}</p>}
      </td>
      <td className="px-4 py-3 align-top">
        <span className={`rounded-full px-2 py-0.5 text-xs ${PRIORITY_COLORS[rec.priority] || ""}`}>
          {rec.priority}
        </span>
      </td>
      <td className="px-4 py-3 align-top">
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
          {rec.status}
        </span>
      </td>
      <td className="px-4 py-3 align-top">
        {rec.status === "pending" && (
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => updateStatus("approved")}
              className="rounded-md bg-emerald-700 px-2.5 py-1 text-xs text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={busy}
              onClick={() => updateStatus("rejected")}
              className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
        {rec.status === "approved" && (
          <button
            disabled={busy}
            onClick={() => updateStatus("applied")}
            className="rounded-md bg-violet-700 px-2.5 py-1 text-xs text-white hover:bg-violet-600 disabled:opacity-50"
          >
            Mark applied
          </button>
        )}
      </td>
    </tr>
  );
}
