"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_STYLES = {
  new: "bg-violet-900/50 text-violet-200",
  contacted: "bg-sky-900/40 text-sky-300",
  closed: "bg-emerald-900/40 text-emerald-300",
  spam: "bg-slate-800 text-slate-500",
};

function whatsappLink(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

export default function LeadRow({ lead, formLabel }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(lead.notes || "");
  const [busy, setBusy] = useState(false);

  async function update(patch) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const wa = whatsappLink(lead.phone);
  const extra = Object.entries(lead.data || {}).filter(
    ([k, v]) =>
      v !== "" && v != null &&
      !["fullName", "firstName", "lastName", "email", "number", "phone", "message", "serviceType", "projectType"].includes(k)
  );

  return (
    <>
      <tr className={lead.status === "new" ? "bg-violet-950/20" : ""}>
        <td className="px-4 py-3 align-top whitespace-nowrap text-slate-400 text-xs">{lead.created_at}</td>
        <td className="px-4 py-3 align-top">
          <p className="text-slate-100">{lead.name || "—"}</p>
          <p className="text-xs text-slate-400">{lead.email}</p>
          {lead.phone && <p className="text-xs text-slate-400">{lead.phone}</p>}
        </td>
        <td className="px-4 py-3 align-top text-xs">
          <p className="text-slate-300">{formLabel}</p>
          {lead.service && <p className="text-slate-500">{lead.service}</p>}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-400 max-w-sm">
          <p className={open ? "whitespace-pre-wrap" : "line-clamp-2"}>{lead.message || "—"}</p>
        </td>
        <td className="px-4 py-3 align-top">
          <select
            value={lead.status}
            disabled={busy}
            onChange={(e) => update({ status: e.target.value })}
            className={`rounded-full border-0 px-2 py-0.5 text-xs focus:ring-2 focus:ring-violet-500 ${STATUS_STYLES[lead.status]}`}
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="closed">closed</option>
            <option value="spam">spam</option>
          </select>
        </td>
        <td className="px-4 py-3 align-top">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="rounded bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700">
                Email
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="rounded bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700">
                Call
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener" className="rounded bg-emerald-900/50 px-2 py-1 text-emerald-300 hover:bg-emerald-900">
                WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="rounded bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700"
            >
              {open ? "Less" : "More"}
            </button>
          </div>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6} className="px-4 pb-4">
            <div className="grid gap-4 rounded-md border border-slate-800 bg-slate-950/60 p-4 text-xs md:grid-cols-2">
              <div className="space-y-1 text-slate-400">
                <p><span className="text-slate-500">Page:</span> {lead.page_path || "—"}</p>
                <p><span className="text-slate-500">Email notification:</span> {lead.email_sent ? "sent" : "not sent"}</p>
                <p><span className="text-slate-500">IP:</span> {lead.ip_address || "—"}</p>
                {extra.map(([k, v]) => (
                  <p key={k}>
                    <span className="text-slate-500">{k}:</span> {Array.isArray(v) ? v.join(", ") : String(v)}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <label className="block text-slate-500">Notes (only visible to admins)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="button"
                  disabled={busy || notes === (lead.notes || "")}
                  onClick={() => update({ notes })}
                  className="rounded-md bg-violet-700 px-3 py-1 text-xs text-white hover:bg-violet-600 disabled:opacity-40"
                >
                  Save notes
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
