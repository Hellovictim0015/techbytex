"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { api, inputCls, btnPrimary } from "../ui";

const CATEGORIES = [
  "restaurant",
  "cafe",
  "clinic",
  "dentist",
  "hospital",
  "salon",
  "spa",
  "gym",
  "real estate agency",
  "e-commerce store",
  "hotel",
  "school",
  "coaching institute",
  "travel agency",
  "car dealer",
  "furniture store",
  "jewellery store",
  "law firm",
  "accounting firm",
  "interior designer",
];

// Every country name, from the browser's own region list (A–Z).
function allCountries() {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const list = [];
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      const name = names.of(code);
      // Unknown codes come back as the code itself; skip groupings like "European Union".
      if (name && name !== code && !/Union|Nations|Unknown|Pseudo|Outlying|^World$/.test(name)) list.push(name);
    }
  }
  return [...new Set(list)].sort((x, y) => x.localeCompare(y));
}

export default function SearchForm() {
  // Built in the browser only, so server and browser HTML always match.
  const [countries, setCountries] = useState([]);
  useEffect(() => setCountries(allCountries()), []);
  const [form, setForm] = useState({ country: "India", city: "", category: "restaurant", keyword: "", maxResults: 20 });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function search(e) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const data = await api("/api/admin/outreach/search", { method: "POST", body: { ...form, maxResults: Number(form.maxResults) } });
      setResult({ ok: true, ...data });
    } catch (err) {
      setResult({ ok: false, error: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={search} className="max-w-3xl space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-xs text-slate-400">
          Country (type to search)
          <input list="outreach-countries" required value={form.country} onChange={set("country")} className={inputCls} />
          <datalist id="outreach-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className="space-y-1 text-xs text-slate-400">
          City
          <input required value={form.city} onChange={set("city")} placeholder="e.g. Raipur" className={inputCls} />
        </label>
        <label className="space-y-1 text-xs text-slate-400">
          Business category
          <select value={form.category} onChange={set("category")} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs text-slate-400">
          …or your own keyword (overrides the category)
          <input value={form.keyword} onChange={set("keyword")} placeholder="e.g. organic bakery" className={inputCls} />
        </label>
        <label className="space-y-1 text-xs text-slate-400">
          Max results (1–60)
          <input type="number" min={1} max={60} value={form.maxResults} onChange={set("maxResults")} className={inputCls} />
        </label>
      </div>
      <button type="submit" disabled={busy} className={btnPrimary}>
        <Search size={16} /> {busy ? "Searching Google..." : "Find businesses"}
      </button>
      {result?.ok && (
        <p className="text-sm text-emerald-300">
          Found {result.found} businesses — {result.added} new leads saved, {result.duplicates} already in your list.{" "}
          <Link href="/admin/outreach/leads" className="underline">
            Check their websites →
          </Link>
        </p>
      )}
      {result && !result.ok && <p className="text-sm text-red-300">{result.error}</p>}
    </form>
  );
}
