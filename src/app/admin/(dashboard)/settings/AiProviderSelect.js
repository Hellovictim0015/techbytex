"use client";
import { useState } from "react";

const PROVIDERS = [
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "anthropic", label: "Claude (Anthropic)" },
];

export default function AiProviderSelect({ initialValue }) {
  const [provider, setProvider] = useState(initialValue || "openai");
  const [saving, setSaving] = useState(false);

  async function handleChange(e) {
    const next = e.target.value;
    setProvider(next);
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ai_provider", value: next }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-slate-800 bg-slate-900 px-4 py-3">
      <div>
        <p className="text-sm text-white">Preferred AI provider</p>
        <p className="text-xs text-slate-500">
          Used for blog generation, SEO analysis, and recommendations once Phase 3 is live.
          Requires the matching API key below to be set.
        </p>
      </div>
      <select
        value={provider}
        onChange={handleChange}
        disabled={saving}
        className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {PROVIDERS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  );
}
