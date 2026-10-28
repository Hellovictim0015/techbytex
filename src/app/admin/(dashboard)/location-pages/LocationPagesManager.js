"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SIMILARITY_WARNING = 0.45;

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates",
  "Saudi Arabia", "Qatar", "Germany", "Singapore", "Nepal", "New Zealand",
];

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const PRIORITY_STYLES = {
  high: "bg-red-900/40 text-red-300",
  medium: "bg-amber-900/40 text-amber-300",
  low: "bg-slate-800 text-slate-400",
};

const STATUS_STYLES = {
  planned: "bg-slate-800 text-slate-300",
  draft: "bg-sky-900/40 text-sky-300",
  published: "bg-emerald-900/40 text-emerald-300",
  rejected: "bg-slate-800 text-slate-500 line-through",
  failed: "bg-red-900/40 text-red-300",
};

const inputCls =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50";
const btnPrimary =
  "rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50";
const btnGhost =
  "rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50";

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status}).`);
  return data.result;
}

function Message({ message }) {
  if (!message) return null;
  return <p className={`text-xs ${message.ok ? "text-emerald-300" : "text-red-300"}`}>{message.text}</p>;
}

// ---------------------------------------------------------------------------

function Suggestions({ suggestions, onUse, onRefresh, refreshing }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-sm text-white">1. AI location suggestions</p>
          <p className="text-xs text-slate-500">
            AI reads your Search Console queries, Analytics visitor cities/countries and top pages, then
            suggests where to build pages next. Places you already target are left out.
            {suggestions?.createdAt && ` Last updated ${suggestions.createdAt}.`}
          </p>
        </div>
        <button type="button" onClick={onRefresh} disabled={refreshing} className={btnGhost}>
          {refreshing ? "Analyzing data (~30s)..." : suggestions ? "Refresh suggestions" : "Analyze & suggest"}
        </button>
      </div>

      {!suggestions && !refreshing && (
        <p className="text-xs text-slate-500">No suggestions yet. Click “Analyze & suggest” to let AI study your data.</p>
      )}
      {suggestions?.summary && <p className="text-xs text-slate-400">{suggestions.summary}</p>}

      <div className="grid gap-3 lg:grid-cols-2">
        {suggestions?.locations.map((l) => (
          <div key={`${l.city}-${l.state}-${l.country}`} className="rounded-md border border-slate-800 bg-slate-950/60 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">
                {l.city}
                <span className="text-slate-500 font-normal">
                  {" "}· {[l.district, l.state, l.country].filter(Boolean).join(", ")}
                </span>
              </p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${PRIORITY_STYLES[l.priority] || PRIORITY_STYLES.low}`}>
                {l.priority}
              </span>
            </div>
            <p className="text-xs text-slate-500">{l.reason}</p>
            {l.areas?.length > 0 && (
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Areas:</span> {l.areas.join(", ")}
              </p>
            )}
            <button type="button" onClick={() => onUse(l)} className="rounded-md bg-violet-700 px-3 py-1 text-xs text-white hover:bg-violet-600">
              Use this (~{l.estimated_pages} pages)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function PlaceField({ label, value, onChange, options, listId, onLoad, loading, canLoad, placeholder }) {
  return (
    <label className="block space-y-1">
      <span className="flex items-center justify-between text-xs text-slate-400">
        {label}
        {onLoad && (
          <button type="button" onClick={onLoad} disabled={!canLoad || loading} className="text-violet-300 hover:underline disabled:opacity-40 disabled:no-underline">
            {loading ? "loading..." : "AI list"}
          </button>
        )}
      </span>
      <input list={listId} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </label>
  );
}

function PlanForm({ form, setForm, services, onPlanned }) {
  const [options, setOptions] = useState({ states: [], districts: [], cities: [], localities: [] });
  const [loadingLevel, setLoadingLevel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const stateOptions = /^india$/i.test(form.country) ? INDIA_STATES : options.states;
  const areas = form.areas.split(",").map((a) => a.trim()).filter(Boolean);

  async function loadPlaces(level, body) {
    setLoadingLevel(level);
    setMessage(null);
    try {
      const result = await api("/api/admin/location-pages/places", { method: "POST", body });
      setOptions((o) => ({ ...o, [result.level]: result.places }));
      if (result.places.length === 0) setMessage({ ok: false, text: "AI found no places for that — type it yourself." });
    } catch (error) {
      setMessage({ ok: false, text: error.message });
    } finally {
      setLoadingLevel(null);
    }
  }

  function toggleArea(name) {
    const next = areas.includes(name) ? areas.filter((a) => a !== name) : [...areas, name];
    setForm((f) => ({ ...f, areas: next.join(", ") }));
  }

  function toggleService(slug) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(slug) ? f.services.filter((s) => s !== slug) : [...f.services, slug],
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage({ ok: true, text: `AI is planning pages for ${form.city} (~30-60s)...` });
    try {
      const result = await api("/api/admin/location-pages/plan", {
        method: "POST",
        body: { ...form, areas },
      });
      setMessage({
        ok: true,
        text: `Planned ${result.planned} pages${result.skipped ? ` (${result.skipped} skipped — duplicates or pages that already exist)` : ""}. Review them below, then generate content.`,
      });
      onPlanned();
    } catch (error) {
      setMessage({ ok: false, text: error.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-800 bg-slate-900 p-5 space-y-4">
      <div>
        <p className="text-sm text-white">2. Target a place</p>
        <p className="text-xs text-slate-500">
          Pick country → state → district → city. “AI list” fills the dropdown for the next level. AI then plans a
          mix of service pages and locality pages for that city.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PlaceField label="Country" value={form.country} onChange={set("country")} options={COUNTRIES} listId="lp-countries" placeholder="India" />
        <PlaceField
          label="State"
          value={form.state}
          onChange={set("state")}
          options={stateOptions}
          listId="lp-states"
          placeholder="Madhya Pradesh"
          onLoad={/^india$/i.test(form.country) ? null : () => loadPlaces("states", { country: form.country })}
          loading={loadingLevel === "states"}
          canLoad={Boolean(form.country)}
        />
        <PlaceField
          label="District"
          value={form.district}
          onChange={set("district")}
          options={options.districts}
          listId="lp-districts"
          placeholder="Indore"
          onLoad={() => loadPlaces("districts", { country: form.country, state: form.state })}
          loading={loadingLevel === "districts"}
          canLoad={Boolean(form.country && form.state)}
        />
        <PlaceField
          label="City"
          value={form.city}
          onChange={set("city")}
          options={options.cities}
          listId="lp-cities"
          placeholder="Indore"
          onLoad={() => loadPlaces("cities", { country: form.country, state: form.state, district: form.district })}
          loading={loadingLevel === "cities"}
          canLoad={Boolean(form.country && form.state && form.district)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Localities to target (optional — AI picks if empty)</span>
          <button
            type="button"
            onClick={() => loadPlaces("localities", form)}
            disabled={!form.city || loadingLevel === "localities"}
            className="text-violet-300 hover:underline disabled:opacity-40 disabled:no-underline"
          >
            {loadingLevel === "localities" ? "loading..." : "AI list"}
          </button>
        </div>
        <input value={form.areas} onChange={(e) => set("areas")(e.target.value)} placeholder="Vijay Nagar, Palasia, Rajwada" className={inputCls} />
        {options.localities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {options.localities.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleArea(name)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] border ${
                  areas.includes(name) ? "border-violet-500 bg-violet-900/50 text-violet-200" : "border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-400">Services ({form.services.length} of {services.length})</p>
        <div className="flex flex-wrap gap-1.5">
          {services.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => toggleService(s.slug)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] border ${
                form.services.includes(s.slug) ? "border-violet-500 bg-violet-900/50 text-violet-200" : "border-slate-700 text-slate-500 hover:bg-slate-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Number of pages</span>
          <input type="number" min={5} max={50} value={form.count} onChange={(e) => set("count")(e.target.value)} className={inputCls} />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Notes for AI (optional)</span>
          <input value={form.notes} onChange={(e) => set("notes")(e.target.value)} placeholder="e.g. focus on hospitals and coaching institutes" className={inputCls} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy || !form.country || !form.city || form.services.length === 0} className={btnPrimary}>
          {busy ? "Planning..." : "Plan pages with AI"}
        </button>
        <Message message={message} />
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function PlanCard({ plan, onChanged }) {
  const [open, setOpen] = useState(plan.pages.some((p) => p.status !== "published"));
  const [selected, setSelected] = useState(new Set());
  const [running, setRunning] = useState(null);
  const [message, setMessage] = useState(null);
  const stopRef = useRef(false);

  const counts = plan.pages.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }), {});
  const place = [plan.city, plan.district !== plan.city ? plan.district : null, plan.state, plan.country].filter(Boolean).join(", ");
  const selectedPages = plan.pages.filter((p) => selected.has(p.id));

  function toggle(id) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Runs one request per page in sequence so each stays well under the
  // serverless time limit; the list refreshes after every page.
  async function runBatch(label, pages, fn) {
    if (pages.length === 0) return;
    stopRef.current = false;
    let done = 0;
    let failed = 0;
    for (const page of pages) {
      if (stopRef.current) break;
      setRunning({ label, done, total: pages.length, current: page.slug });
      try {
        await fn(page);
      } catch (error) {
        failed++;
        setMessage({ ok: false, text: `${page.slug}: ${error.message}` });
      }
      done++;
      onChanged();
    }
    setRunning(null);
    setSelected(new Set());
    if (!failed) setMessage({ ok: true, text: `${label}: ${done} of ${pages.length} done.` });
  }

  const generate = (pages) =>
    runBatch("Writing content", pages, (p) => api(`/api/admin/location-pages/${p.id}/generate`, { method: "POST" }));
  const setStatus = (pages, status, label) =>
    runBatch(label, pages, (p) => api(`/api/admin/location-pages/${p.id}`, { method: "PATCH", body: { status } }));
  const remove = (pages) => {
    if (!confirm(`Delete ${pages.length} page(s)? Live pages will return 404.`)) return;
    runBatch("Deleting", pages, (p) => api(`/api/admin/location-pages/${p.id}`, { method: "DELETE" }));
  };

  async function deletePlan() {
    if (!confirm(`Delete ${plan.city} and all ${plan.pages.length} of its pages? Live pages will return 404.`)) return;
    try {
      await api(`/api/admin/location-pages/plans/${plan.id}`, { method: "DELETE" });
      onChanged();
    } catch (error) {
      setMessage({ ok: false, text: error.message });
    }
  }

  const busy = Boolean(running);
  const toWrite = plan.pages.filter((p) => p.status === "planned" || p.status === "failed");
  const drafts = plan.pages.filter((p) => p.status === "draft");

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-left">
          <p className="text-sm font-medium text-white">
            {open ? "▾" : "▸"} {place}
          </p>
          <p className="text-xs text-slate-500">
            {plan.pages.length} pages ·{" "}
            {["published", "draft", "planned", "failed", "rejected"]
              .filter((s) => counts[s])
              .map((s) => `${counts[s]} ${s}`)
              .join(" · ")}
          </p>
        </button>
        <div className="flex flex-wrap gap-2">
          {toWrite.length > 0 && (
            <button type="button" disabled={busy} onClick={() => generate(toWrite)} className={btnGhost}>
              Write all ({toWrite.length})
            </button>
          )}
          {drafts.length > 0 && (
            <button type="button" disabled={busy} onClick={() => setStatus(drafts, "published", "Publishing")} className={btnGhost}>
              Publish all drafts ({drafts.length})
            </button>
          )}
          <button type="button" disabled={busy} onClick={deletePlan} className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950 disabled:opacity-50">
            Delete place
          </button>
        </div>
      </div>

      {(running || message) && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 px-4 py-2">
          {running ? (
            <>
              <p className="text-xs text-violet-300">
                {running.label} {running.done + 1}/{running.total} — {running.current} (~30s each)
              </p>
              <button type="button" onClick={() => (stopRef.current = true)} className="text-xs text-red-300 hover:underline">
                Stop after this page
              </button>
            </>
          ) : (
            <Message message={message} />
          )}
        </div>
      )}

      {open && (
        <div className="border-t border-slate-800">
          {plan.ai_summary && <p className="px-4 pt-3 text-xs text-slate-400">{plan.ai_summary}</p>}

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
              <span className="text-xs text-slate-400">{selected.size} selected:</span>
              <button type="button" disabled={busy} onClick={() => generate(selectedPages.filter((p) => p.status !== "published"))} className={btnGhost}>
                Write / rewrite
              </button>
              <button type="button" disabled={busy} onClick={() => setStatus(selectedPages.filter((p) => p.status === "draft"), "published", "Publishing")} className={btnGhost}>
                Publish
              </button>
              <button type="button" disabled={busy} onClick={() => setStatus(selectedPages.filter((p) => p.status === "published"), "draft", "Unpublishing")} className={btnGhost}>
                Unpublish
              </button>
              <button type="button" disabled={busy} onClick={() => remove(selectedPages)} className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950 disabled:opacity-50">
                Delete
              </button>
            </div>
          )}

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.size === plan.pages.length && plan.pages.length > 0}
                      onChange={(e) => setSelected(e.target.checked ? new Set(plan.pages.map((p) => p.id)) : new Set())}
                    />
                  </th>
                  <th className="pb-2 pr-3">Page URL</th>
                  <th className="pb-2 pr-3">Target keyword</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Quality</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {plan.pages.map((p) => (
                  <tr key={p.id} className="align-top">
                    <td className="py-2 pr-2">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                    </td>
                    <td className="py-2 pr-3">
                      <p className="font-mono text-slate-200">/{p.slug}</p>
                      <p className="text-slate-500">
                        {p.service_label}
                        {p.area_name && ` · ${p.area_name}`}{" "}
                        <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${PRIORITY_STYLES[p.priority]}`}>{p.priority}</span>
                      </p>
                    </td>
                    <td className="py-2 pr-3 text-slate-300">
                      {p.target_keyword}
                      {p.reason && <p className="text-slate-500">{p.reason}</p>}
                    </td>
                    <td className="py-2 pr-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                      {p.error_message && p.status === "failed" && <p className="mt-1 text-red-300">{p.error_message}</p>}
                    </td>
                    <td className="py-2 pr-3 text-slate-400">
                      {p.word_count ? `${p.word_count} words` : "—"}
                      {p.similarity != null && (
                        <p className={p.similarity >= SIMILARITY_WARNING ? "text-amber-300" : "text-slate-500"}>
                          {Math.round(p.similarity * 100)}% overlap
                          {p.similarity >= SIMILARITY_WARNING && " — rewrite"}
                        </p>
                      )}
                    </td>
                    <td className="py-2 whitespace-nowrap space-x-2">
                      {p.status !== "published" && (
                        <button type="button" disabled={busy} onClick={() => generate([p])} className="text-violet-300 hover:underline disabled:opacity-40">
                          {p.status === "planned" ? "Write" : "Rewrite"}
                        </button>
                      )}
                      {p.word_count > 0 && (
                        <a href={p.status === "published" ? `/${p.slug}` : `/admin/location-preview/${p.id}`} target="_blank" className="text-sky-300 hover:underline">
                          {p.status === "published" ? "View" : "Preview"}
                        </a>
                      )}
                      {p.status === "draft" && (
                        <button type="button" disabled={busy} onClick={() => setStatus([p], "published", "Publishing")} className="text-emerald-300 hover:underline disabled:opacity-40">
                          Publish
                        </button>
                      )}
                      {p.status === "published" && (
                        <button type="button" disabled={busy} onClick={() => setStatus([p], "draft", "Unpublishing")} className="text-amber-300 hover:underline disabled:opacity-40">
                          Unpublish
                        </button>
                      )}
                      {p.status !== "published" && p.status !== "rejected" && (
                        <button type="button" disabled={busy} onClick={() => setStatus([p], "rejected", "Rejecting")} className="text-slate-400 hover:underline disabled:opacity-40">
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

const EMPTY_FORM = { country: "India", state: "", district: "", city: "", areas: "", count: 35, notes: "" };

export default function LocationPagesManager({ plans, initialSuggestions, services }) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, services: services.map((s) => s.slug) });

  async function refreshSuggestions() {
    setRefreshing(true);
    setMessage(null);
    try {
      const result = await api("/api/admin/location-pages/suggest", { method: "POST" });
      setSuggestions({ ...result, createdAt: "just now" });
    } catch (error) {
      setMessage({ ok: false, text: error.message });
    } finally {
      setRefreshing(false);
    }
  }

  function applySuggestion(l) {
    const labels = new Set(l.services.map((s) => s.toLowerCase()));
    const picked = services.filter((s) => labels.has(s.label.toLowerCase())).map((s) => s.slug);
    setForm({
      ...EMPTY_FORM,
      country: l.country,
      state: l.state || "",
      district: l.district || "",
      city: l.city,
      areas: (l.areas || []).join(", "),
      count: l.estimated_pages || 35,
      services: picked.length ? picked : services.map((s) => s.slug),
    });
    document.getElementById("lp-plan-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <Suggestions suggestions={suggestions} onUse={applySuggestion} onRefresh={refreshSuggestions} refreshing={refreshing} />
      <Message message={message} />

      <div id="lp-plan-form">
        <PlanForm form={form} setForm={setForm} services={services} onPlanned={() => router.refresh()} />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-white">3. Review, write and publish</p>
          <p className="text-xs text-slate-500">
            Write content (AI, ~30s per page), preview drafts, then publish. Pages over{" "}
            {Math.round(SIMILARITY_WARNING * 100)}% word overlap with another page of the same city should be rewritten —
            near-duplicate pages can hurt the whole site in Google. Publish in small batches (5-10 a day).
          </p>
        </div>
        {plans.length === 0 && <p className="text-xs text-slate-500">No places yet.</p>}
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onChanged={() => router.refresh()} />
        ))}
      </div>
    </div>
  );
}
