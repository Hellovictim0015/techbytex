"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { uploadImage } from "../uploadImage";

const EMPTY = { title: "", subtitle: "", image_url: "", link_url: "", is_visible: true };

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500";

function ProjectForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const editing = Boolean(initial?.id);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, "projects");
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
      const res = await fetch(editing ? `/api/admin/projects/${initial.id}` : "/api/admin/projects", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          image_url: form.image_url,
          link_url: form.link_url,
          is_visible: form.is_visible,
        }),
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
    <form onSubmit={handleSubmit} className="rounded-lg border border-violet-800/60 bg-slate-900 p-5 space-y-4">
      <p className="text-sm font-medium text-white">{editing ? `Edit "${initial.title}"` : "Add a project"}</p>
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs text-slate-400">Project name *</span>
              <input required value={form.title} onChange={set("title")} placeholder="e.g. Florestawud" className={inputClass} />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-slate-400">Type</span>
              <input value={form.subtitle || ""} onChange={set("subtitle")} placeholder="e.g. E-Commerce Website" className={inputClass} />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs text-slate-400">Live link (optional)</span>
            <input value={form.link_url || ""} onChange={set("link_url")} placeholder="https://client-website.com" className={inputClass} />
          </label>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Image * — upload, or paste a URL</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={form.image_url} onChange={set("image_url")} placeholder="https://… or /image.png" className={inputClass} />
              <label className="shrink-0 cursor-pointer rounded-md border border-slate-700 px-3 py-2 text-center text-xs text-slate-300 hover:bg-slate-800">
                {uploading ? "Uploading..." : "Upload image"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" onChange={handleFile} disabled={uploading} className="hidden" />
              </label>
            </div>
            <p className="text-[11px] text-slate-500">Portrait screenshots look best (card is 260×340). Max 5 MB.</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.is_visible} onChange={set("is_visible")} className="rounded border-slate-600 bg-slate-800 text-violet-600" />
            Show on homepage
          </label>
        </div>
        <div className="flex items-start justify-center">
          <div className="relative h-[220px] w-[168px] overflow-hidden rounded-lg border border-slate-700 bg-white">
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="Preview" className="h-full w-full object-contain" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">Preview</span>
            )}
          </div>
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

export default function ProjectsManager({ projects }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null); // null | "new" | project
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function patch(id, body) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
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

  async function remove(project) {
    if (!window.confirm(`Delete "${project.title}" from the homepage? This cannot be undone.`)) return;
    setBusyId(project.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || "Delete failed.");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  function saved() {
    setEditing(null);
    router.refresh();
  }

  const iconBtn = "rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30";

  return (
    <div className="space-y-4">
      {editing ? (
        <ProjectForm
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : { ...editing, is_visible: Boolean(editing.is_visible) }}
          onCancel={() => setEditing(null)}
          onSaved={saved}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
        >
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
              <th className="px-4 py-2 text-left font-medium text-slate-400">Link</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">On homepage</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No projects yet. Add your first one.
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
                    <div className="h-14 w-11 shrink-0 overflow-hidden rounded border border-slate-700 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-slate-100">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.subtitle || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.link_url ? (
                    <a href={p.link_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-violet-300 hover:underline">
                      {p.link_url.replace(/^https?:\/\//, "").slice(0, 32)} <ExternalLink size={12} />
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
