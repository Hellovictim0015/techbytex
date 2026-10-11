"use client";
import { useState } from "react";

export default function AutoPublishToggle({ initialValue }) {
  const [enabled, setEnabled] = useState(Boolean(initialValue));
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    const next = !enabled;
    setSaving(true);
    setEnabled(next);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "auto_publish_blogs", value: next }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-slate-800 bg-slate-900 px-4 py-3">
      <div>
        <p className="text-sm text-white">Auto-publish AI blogs</p>
        <p className="text-xs text-slate-500">
          Off (default): AI blogs are saved as drafts for admin review. On: approved blogs publish automatically.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={saving}
        onClick={handleToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          enabled ? "bg-violet-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
