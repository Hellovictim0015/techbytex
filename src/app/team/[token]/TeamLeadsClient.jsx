"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Globe, MessageCircle, Phone } from "lucide-react";
import { LEAD_STATUSES, statusInfo } from "@/app/lib/lead-status";

const OPEN = new Set(["new", "call_done", "follow_up"]);
const when = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");
const waNumber = (phone) => {
  const d = String(phone || "").replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
};

function LeadCard({ token, lead, onSaved }) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const current = statusInfo(lead.status);

  async function save() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/team/${token}/leads/${lead.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status || undefined, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not save. Try again.");
      setStatus("");
      setNote("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900">{lead.name}</h2>
          {(lead.business || lead.city) && (
            <p className="text-sm text-slate-500">{[lead.business, lead.city].filter(Boolean).join(" · ")}</p>
          )}
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${current.style}`}>{current.label}</span>
      </div>

      {lead.requirement && <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{lead.requirement}</p>}

      <div className="flex flex-wrap gap-2">
        {lead.phone && (
          <>
            <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-bold text-white">
              <Phone size={16} /> Call {lead.phone}
            </a>
            <a
              href={`https://wa.me/${waNumber(lead.phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-4 py-2.5 text-sm font-semibold text-green-700"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </>
        )}
        {lead.website_url && (
          <a
            href={lead.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <Globe size={16} /> <span className="truncate">Website</span>
          </a>
        )}
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-800">After the call — update</p>
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.filter((s) => s.value !== "new").map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(status === s.value ? "" : s.value)}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${status === s.value ? s.style : "border-slate-200 text-slate-600"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="What did the client say? e.g. Interested, call back on Monday, budget ₹30,000"
          className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={busy || (!status && !note.trim())}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            {busy ? "Saving..." : "Save update"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm text-green-700">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {lead.history.length > 0 && (
        <div>
          <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-sm text-slate-500">
            <ChevronDown size={16} className={open ? "rotate-180" : ""} /> Previous updates ({lead.history.length})
          </button>
          {open && (
            <ul className="mt-2 space-y-2 border-l-2 border-slate-100 pl-3 text-sm">
              {lead.history.map((h) => (
                <li key={h.id}>
                  <p className="text-xs text-slate-400">
                    {when(h.created_at)} · {h.actor_name}
                    {h.status && ` → ${statusInfo(h.status).label}`}
                  </p>
                  {h.note && <p className="whitespace-pre-wrap text-slate-700">{h.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}

export default function TeamLeadsClient({ token, memberName, leads }) {
  const router = useRouter();
  const [tab, setTab] = useState("open");
  const openLeads = leads.filter((l) => OPEN.has(l.status));
  const closedLeads = leads.filter((l) => !OPEN.has(l.status));
  const shown = tab === "open" ? openLeads : closedLeads;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 font-sans">
      <div className="mx-auto max-w-2xl space-y-5">
        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">TechByteX · Leads</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Hi {memberName}</h1>
          <p className="text-sm text-slate-500">
            Call each lead, then update the status and write what the client said. This link is only for you — please
            don&apos;t share it.
          </p>
        </header>

        <div className="flex gap-2">
          {[
            ["open", `To do (${openLeads.length})`],
            ["closed", `Done (${closedLeads.length})`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === value ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            {tab === "open" ? "No leads to call right now. New leads appear here when they are given to you." : "Nothing finished yet."}
          </p>
        ) : (
          <div className="space-y-4">
            {shown.map((lead) => (
              <LeadCard key={lead.id} token={token} lead={lead} onSaved={() => router.refresh()} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
