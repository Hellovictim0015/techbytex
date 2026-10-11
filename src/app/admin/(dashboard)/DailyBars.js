"use client";
import { useState } from "react";

// Single-series daily bar chart (one hue, no legend — the title names it).
// Hover/focus a day to see its exact value.
export default function DailyBars({ title, data, valueKey, valueLabel }) {
  const [active, setActive] = useState(null);
  if (!data?.length) return null;

  const max = Math.max(1, ...data.map((d) => d[valueKey]));
  const total = data.reduce((sum, d) => sum + d[valueKey], 0);
  const current = active != null ? data[active] : null;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-slate-300">{title}</p>
        <p className="text-xs text-slate-400 tabular-nums">
          {current
            ? `${current.date}: ${current[valueKey].toLocaleString()} ${valueLabel}`
            : `${total.toLocaleString()} ${valueLabel} total · max ${max.toLocaleString()}/day`}
        </p>
      </div>
      <div
        className="mt-4 flex h-32 items-end gap-[2px] border-b border-slate-700"
        onMouseLeave={() => setActive(null)}
      >
        {data.map((d, i) => (
          <button
            key={d.date}
            type="button"
            aria-label={`${d.date}: ${d[valueKey]} ${valueLabel}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="group relative flex h-full flex-1 items-end focus:outline-none"
          >
            <span
              className={`w-full rounded-t-[4px] transition-colors ${
                active === i ? "bg-violet-300" : "bg-violet-500 group-hover:bg-violet-400"
              }`}
              style={{ height: d[valueKey] > 0 ? `${Math.max(3, (d[valueKey] / max) * 100)}%` : "0%" }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500 tabular-nums">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
