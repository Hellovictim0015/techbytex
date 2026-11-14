"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  ExternalLink,
  History,
  Link2,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Trash2,
  UserPlus,
} from "lucide-react";
import { LEAD_STATUSES, statusInfo } from "@/app/lib/lead-status";

const inputCls =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
// Same look as inputCls, but only as wide as its content.
const selectCls = inputCls.replace("w-full", "w-auto");
const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-md bg-violet-700 px-3 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50";
const btnGhost =
  "inline-flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50";
const iconBtn = "rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40";

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

// The site origin is only known in the browser (localhost while testing).
function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}
const memberLink = (origin, m) => `${origin}/team/${m.access_token}`;
const when = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

// wa.me needs the number with country code and digits only.
function waNumber(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  return d;
}
function whatsappUrl(phone, message) {
  const n = waNumber(phone);
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

function leadSummary(lead) {
  return [
    `Name: ${lead.name}`,
    lead.phone && `Phone: ${lead.phone}`,
    lead.business && `Business: ${lead.business}`,
    lead.city && `City: ${lead.city}`,
    lead.website_url && `Website: ${lead.website_url}`,
    lead.requirement && `Requirement: ${lead.requirement}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// --- team members ------------------------------------------------------------------

function TeamPanel({ members, onChanged }) {
  const origin = useOrigin();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function add(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api("/api/admin/team-members", { method: "POST", body: form });
      setForm({ name: "", phone: "" });
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function patch(m, body, confirmText) {
    if (confirmText && !confirm(confirmText)) return;
    try {
      await api(`/api/admin/team-members/${m.id}`, { method: "PATCH", body });
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  }

  async function remove(m) {
    if (!confirm(`Remove ${m.name}? Their ${m.total} leads stay, but become unassigned.`)) return;
    try {
      await api(`/api/admin/team-members/${m.id}`, { method: "DELETE" });
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  }

  async function copyLink(m) {
    await navigator.clipboard.writeText(memberLink(origin, m));
    setMsg({ ok: true, text: `${m.name}'s link copied.` });
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-white">1. Team members</h2>
        <p className="text-xs text-slate-500">Each person gets a private link that shows only their leads.</p>
      </div>
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name, e.g. Rama" className={`${inputCls} max-w-[200px]`} />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="WhatsApp number" className={`${inputCls} max-w-[200px]`} />
        <button type="submit" disabled={busy} className={btnPrimary}>
          <UserPlus size={16} /> Add member
        </button>
      </form>
      {members.length === 0 ? (
        <p className="text-sm text-slate-500">No team members yet. Add Rama, Tushar… first, then give them leads.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className={`space-y-2 rounded-md border p-3 ${m.is_active ? "border-slate-700" : "border-slate-800 opacity-60"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">
                    {m.name} {!m.is_active && <span className="text-xs text-slate-500">(link off)</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    {m.phone || "no number"} · {m.open_leads} open · {m.converted} converted · {m.total} total
                  </p>
                </div>
                <button type="button" onClick={() => remove(m)} className={`${iconBtn} hover:text-red-300`} aria-label={`Remove ${m.name}`}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => copyLink(m)} className={btnGhost}>
                  <Copy size={12} /> Copy link
                </button>
                {m.phone && (
                  <a
                    href={whatsappUrl(m.phone, `Hi ${m.name}, your TechByteX leads are here. Open this link, call each lead and update the status:\n${memberLink(origin, m)}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhost}
                  >
                    <MessageCircle size={12} /> Send link on WhatsApp
                  </a>
                )}
                <a href={`/team/${m.access_token}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                  <ExternalLink size={12} /> Open
                </a>
                <button
                  type="button"
                  onClick={() => patch(m, { newLink: true }, `Make a new link for ${m.name}? The old link stops working.`)}
                  className={btnGhost}
                  title="Use if the link was shared with the wrong person"
                >
                  <RefreshCw size={12} /> New link
                </button>
                <button type="button" onClick={() => patch(m, { isActive: !m.is_active })} className={btnGhost}>
                  {m.is_active ? "Turn link off" : "Turn link on"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {msg && <p className={`text-xs ${msg.ok ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
    </section>
  );
}

// --- add many leads at once ------------------------------------------------------------

const blankRow = () => ({ name: "", phone: "", business: "", city: "", websiteUrl: "", requirement: "", assignedTo: "" });

function AddLeads({ members, onSaved }) {
  const [rows, setRows] = useState(() => Array.from({ length: 5 }, blankRow));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const active = members.filter((m) => m.is_active);
  const filled = rows.filter((r) => r.name.trim() || r.phone.trim());

  const setCell = (i, key) => (e) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [key]: e.target.value } : r)));

  function assignAll(value) {
    setRows((rs) => rs.map((r) => ({ ...r, assignedTo: value })));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const { ids } = await api("/api/admin/team-leads", { method: "POST", body: { leads: filled } });
      setRows(Array.from({ length: 5 }, blankRow));
      setMsg({ ok: true, text: `${ids.length} leads saved.` });
      onSaved();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const cols = [
    ["name", "Name *", "Client name"],
    ["phone", "Phone", "98XXXXXXXX"],
    ["business", "Business", "Shop / company"],
    ["city", "City", "Raipur"],
    ["websiteUrl", "Website", "example.com"],
    ["requirement", "Requirement / notes", "Needs website + app"],
  ];

  return (
    <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-white">2. Add leads — one per line</h2>
        <label className="flex items-center gap-2 text-xs text-slate-400">
          Give all to
          <select onChange={(e) => assignAll(e.target.value)} defaultValue="" className={selectCls}>
            <option value="">— choose —</option>
            {active.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="w-8 pb-2">#</th>
              {cols.map(([key, label]) => (
                <th key={key} className="pb-2 pr-2 font-medium">
                  {label}
                </th>
              ))}
              <th className="pb-2 pr-2 font-medium">Give to</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="py-1 text-xs text-slate-500">{i + 1}</td>
                {cols.map(([key, , placeholder]) => (
                  <td key={key} className="py-1 pr-2">
                    <input value={r[key]} onChange={setCell(i, key)} placeholder={placeholder} className={inputCls} />
                  </td>
                ))}
                <td className="py-1 pr-2">
                  <select value={r.assignedTo} onChange={setCell(i, "assignedTo")} className={inputCls}>
                    <option value="">Not assigned</option>
                    {active.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1">
                  <button
                    type="button"
                    onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : [blankRow()]))}
                    className={iconBtn}
                    aria-label={`Remove row ${i + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRows((rs) => [...rs, blankRow()])} className={btnGhost}>
          <Plus size={12} /> Add row
        </button>
        <button type="button" onClick={() => setRows((rs) => [...rs, ...Array.from({ length: 5 }, blankRow)])} className={btnGhost}>
          <Plus size={12} /> Add 5 rows
        </button>
        <button type="button" onClick={save} disabled={busy || filled.length === 0} className={`${btnPrimary} ml-auto`}>
          {busy ? "Saving..." : `Save ${filled.length} ${filled.length === 1 ? "lead" : "leads"}`}
        </button>
      </div>
      {msg && <p className={`text-xs ${msg.ok ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
    </section>
  );
}

// --- one lead ----------------------------------------------------------------------------

function LeadCard({ lead, members, onChanged }) {
  const origin = useOrigin();
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const member = members.find((m) => m.id === lead.assigned_to);
  const status = statusInfo(lead.status);

  async function patch(body) {
    setBusy(true);
    setError("");
    try {
      await api(`/api/admin/team-leads/${lead.id}`, { method: "PATCH", body });
      setNote("");
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete lead "${lead.name}" and its call history?`)) return;
    try {
      await api(`/api/admin/team-leads/${lead.id}`, { method: "DELETE" });
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  const shareMessage = member
    ? `Hi ${member.name}, new lead for you:\n\n${leadSummary(lead)}\n\nCall them and update the status here:\n${memberLink(origin, member)}`
    : "";

  return (
    <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-white">{lead.name}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] ${status.dark}`}>{status.label}</span>
          </div>
          <p className="text-xs text-slate-400">
            {[lead.business, lead.city].filter(Boolean).join(" · ") || "—"} · added {when(lead.created_at)}
          </p>
        </div>
        <button type="button" onClick={remove} className={`${iconBtn} hover:text-red-300`} aria-label="Delete lead">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 text-slate-200 hover:text-violet-300">
            <Phone size={13} /> {lead.phone}
          </a>
        )}
        {lead.website_url && (
          <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-violet-300 hover:underline">
            <Link2 size={13} /> <span className="truncate">{lead.website_url}</span>
          </a>
        )}
      </div>
      {lead.requirement && <p className="whitespace-pre-wrap text-sm text-slate-300">{lead.requirement}</p>}

      {/* assignment + share */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500">Given to</span>
        <select
          value={lead.assigned_to ?? ""}
          onChange={(e) => patch({ assignedTo: e.target.value })}
          disabled={busy}
          className={selectCls}
        >
          <option value="">Not assigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {member?.phone && (
          <a href={whatsappUrl(member.phone, shareMessage)} target="_blank" rel="noopener noreferrer" className={btnGhost}>
            <Share2 size={12} /> Share with {member.name}
          </a>
        )}
        {member && !member.phone && (
          <button type="button" onClick={() => navigator.clipboard.writeText(shareMessage)} className={btnGhost}>
            <Copy size={12} /> Copy for {member.name}
          </button>
        )}
      </div>

      {/* status */}
      <div className="flex flex-wrap gap-1.5">
        {LEAD_STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={busy || s.value === lead.status}
            onClick={() => patch({ status: s.value, note })}
            className={`rounded-md border px-2 py-1 text-xs ${s.value === lead.status ? s.dark : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (what the client said)…" className={inputCls} />
        <button type="button" disabled={busy || !note.trim()} onClick={() => patch({ note })} className={btnGhost}>
          Add note
        </button>
      </div>

      {lead.history.length > 0 && (
        <div>
          <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
            <History size={12} /> {open ? "Hide" : "Show"} history ({lead.history.length})
          </button>
          {open && (
            <ul className="mt-2 space-y-1.5 border-l border-slate-700 pl-3 text-xs">
              {lead.history.map((h) => (
                <li key={h.id} className="text-slate-400">
                  <span className="text-slate-500">{when(h.created_at)}</span> · <span className="text-slate-200">{h.actor_name}</span>
                  {h.status && <> → <span className="text-violet-300">{statusInfo(h.status).label}</span></>}
                  {h.note && <p className="whitespace-pre-wrap text-slate-300">{h.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

// --- page -------------------------------------------------------------------------------

export default function LeadAssignManager({ members, leads }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const [status, setStatus] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const c = { all: leads.length };
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  const q = search.trim().toLowerCase();
  const shown = leads.filter(
    (l) =>
      (status === "all" || l.status === status) &&
      (memberFilter === "all" ||
        (memberFilter === "none" ? !l.assigned_to : l.assigned_to === Number(memberFilter))) &&
      (!q ||
        [l.name, l.phone, l.business, l.city, l.website_url, l.requirement]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q)))
  );

  return (
    <div className="space-y-6">
      <TeamPanel members={members} onChanged={refresh} />
      <AddLeads members={members} onSaved={refresh} />

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-white">3. All leads</h2>
        <div className="flex flex-wrap gap-1.5">
          {[{ value: "all", label: "All", dark: "bg-slate-800 text-white border-slate-600" }, ...LEAD_STATUSES].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={`rounded-full border px-3 py-1 text-xs ${status === s.value ? s.dark : "border-slate-700 text-slate-400 hover:bg-slate-800"}`}
            >
              {s.label} ({counts[s.value] || 0})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, business, city…" className={`${inputCls} pl-8`} />
          </div>
          <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)} className={selectCls} aria-label="Filter by team member">
            <option value="all">Everyone</option>
            <option value="none">Not assigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {shown.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">No leads here.</p>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {shown.map((l) => (
              <LeadCard key={l.id} lead={l} members={members} onChanged={refresh} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
