"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { uploadImage } from "../uploadImage";

const CATEGORIES = ["Website", "App", "Government", "E-Commerce", "Software"];

const EMPTY = {
  title: "",
  subtitle: "",
  seo_heading: "",
  description: "",
  image_url: "",
  alt_text: "",
  category: "Website",
  client_type: "",
  role: "",
  stats: "",
  technologies: "",
  features: "",
  case_problem: "",
  case_solution: "",
  case_result: "",
  link_url: "",
  video_url: "",
  is_visible: true,
};

// DB row → form state (JSON arrays become one-item-per-line text).
function toForm(row) {
  const lines = (v) => (Array.isArray(v) ? v.join("\n") : "");
  const out = { ...EMPTY };
  for (const k of Object.keys(EMPTY)) if (row[k] !== null && row[k] !== undefined) out[k] = row[k];
  out.stats = lines(row.stats);
  out.technologies = lines(row.technologies);
  out.features = lines(row.features);
  out.is_visible = Boolean(row.is_visible);
  return out;
}

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500";

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className="text-xs text-slate-400">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

function PortfolioForm({ initial, onCancel, onSaved }) {
  const editing = Boolean(initial?.id);
  const [form, setForm] = useState(initial ? toForm(initial) : EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, "portfolio");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(editing ? `/api/admin/portfolio/${initial.id}` : "/api/admin/portfolio", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || "Save failed.");
      else onSaved();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-violet-800/60 bg-slate-900 p-5 space-y-5">
      <p className="text-sm font-medium text-white">{editing ? `Edit "${initial.title}"` : "Add a portfolio project"}</p>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name *">
              <input required value={form.title} onChange={set("title")} placeholder="e.g. Floresta Wud" className={inputClass} />
            </Field>
            <Field label="Short tagline">
              <input value={form.subtitle} onChange={set("subtitle")} placeholder="e.g. Premium Wood & Interior Solutions" className={inputClass} />
            </Field>
            <Field label="Category">
              <input list="portfolio-categories" value={form.category} onChange={set("category")} className={inputClass} />
              <datalist id="portfolio-categories">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Client type">
              <input value={form.client_type} onChange={set("client_type")} placeholder="e.g. Private Startup" className={inputClass} />
            </Field>
            <Field label="Our role">
              <input value={form.role} onChange={set("role")} placeholder="e.g. Full Stack Development" className={inputClass} />
            </Field>
            <Field label="SEO heading">
              <input value={form.seo_heading} onChange={set("seo_heading")} placeholder="e.g. Floresta Wud – Next.js E-Commerce Website" className={inputClass} />
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={set("description")} className={inputClass} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Problem">
              <textarea rows={3} value={form.case_problem} onChange={set("case_problem")} className={inputClass} />
            </Field>
            <Field label="Solution">
              <textarea rows={3} value={form.case_solution} onChange={set("case_solution")} className={inputClass} />
            </Field>
            <Field label="Result" hint="Only real, verifiable numbers.">
              <textarea rows={3} value={form.case_result} onChange={set("case_result")} className={inputClass} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Highlights" hint="One per line (max 6), e.g. 📱 Cross-Platform">
              <textarea rows={4} value={form.stats} onChange={set("stats")} className={inputClass} />
            </Field>
            <Field label="Tech stack" hint="One per line, e.g. Next.js">
              <textarea rows={4} value={form.technologies} onChange={set("technologies")} className={inputClass} />
            </Field>
            <Field label="Key features" hint="One per line (max 12)">
              <textarea rows={4} value={form.features} onChange={set("features")} className={inputClass} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Live link" hint="Leave empty to hide the Visit / View Live buttons.">
              <input value={form.link_url} onChange={set("link_url")} placeholder="https://client-website.com" className={inputClass} />
            </Field>
            <Field label="Demo video link" hint="Shows a Watch Demo button when set.">
              <input value={form.video_url} onChange={set("video_url")} placeholder="https://youtube.com/…" className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-slate-700 bg-white">
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="Preview" className="h-full w-full object-contain" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">Image preview</span>
            )}
          </div>
          <label className="block cursor-pointer rounded-md border border-slate-700 px-3 py-2 text-center text-xs text-slate-300 hover:bg-slate-800">
            {uploading ? "Uploading..." : "Upload image"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" onChange={handleFile} disabled={uploading} className="hidden" />
          </label>
          <Field label="…or image URL *" hint="Landscape (16:10) works best. Max 5 MB.">
            <input value={form.image_url} onChange={set("image_url")} placeholder="/uploads/portfolio/…" className={inputClass} />
          </Field>
          <Field label="Image alt text (SEO)">
            <input value={form.alt_text} onChange={set("alt_text")} placeholder="Describe the screenshot" className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.is_visible} onChange={set("is_visible")} className="rounded border-slate-600 bg-slate-800 text-violet-600" />
            Show on portfolio page
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-red-300">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy || uploading} className="rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50">
          {busy ? "Saving..." : editing ? "Save changes" : "Add project"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function PortfolioManager({ projects }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null); // null | "new" | row
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function patch(id, body) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || "Update failed.");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p) {
    if (!window.confirm(`Delete "${p.title}" from the portfolio? This cannot be undone.`)) return;
    setBusyId(p.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/portfolio/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || "Delete failed.");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  const iconBtn = "rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30";

  return (
    <div className="space-y-4">
      {editing ? (
        <PortfolioForm
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      ) : (
        <button type="button" onClick={() => setEditing("new")} className="rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600">
          + Add project
        </button>
      )}

      {error && <p className="text-xs text-red-300">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Order</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Project</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Category</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Link</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">On page</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No portfolio projects yet. Add one, or run <code className="font-mono">npm run portfolio:import</code>.
                </td>
              </tr>
            )}
            {projects.map((p, i) => (
              <tr key={p.id} className={p.is_visible ? "" : "opacity-50"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label="Move up" disabled={i === 0 || busyId === p.id} onClick={() => patch(p.id, { move: "up" })} className={iconBtn}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" aria-label="Move down" disabled={i === projects.length - 1 || busyId === p.id} onClick={() => patch(p.id, { move: "down" })} className={iconBtn}>
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded border border-slate-700 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-slate-100">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.subtitle || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{p.category}</td>
                <td className="px-4 py-3 text-xs">
                  {p.link_url ? (
                    <a href={p.link_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-violet-300 hover:underline">
                      {p.link_url.replace(/^https?:\/\//, "").slice(0, 28)} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-slate-600">No link</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => patch(p.id, { is_visible: !p.is_visible })}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                      p.is_visible ? "bg-emerald-900/40 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {p.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {p.is_visible ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label="Edit" onClick={() => setEditing(p)} className={iconBtn}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" aria-label="Delete" disabled={busyId === p.id} onClick={() => remove(p)} className={`${iconBtn} hover:text-red-300`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
