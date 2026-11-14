"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Gauge, Mail, Phone, RefreshCw, Search, Send, Sparkles, Star, Trash2 } from "lucide-react";
import { api, inputCls, btnPrimary, btnGhost, STATUS_STYLE } from "../ui";

const STATUSES = ["new", "emailed", "replied", "unsubscribed", "bounced"];
const scoreColor = (s) => (s == null ? "text-slate-500" : s >= 90 ? "text-emerald-300" : s >= 50 ? "text-amber-300" : "text-red-300");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- one lead -------------------------------------------------------------------------

function LeadCard({ lead, onChanged }) {
  const [subject, setSubject] = useState(lead.draft_subject || "");
  const [body, setBody] = useState(lead.draft_body || "");
  const [email, setEmail] = useState(lead.email || "");
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);

  // Keep the editors in step when the server data changes (e.g. after "Write email").
  useEffect(() => {
    setSubject(lead.draft_subject || "");
    setBody(lead.draft_body || "");
    setEmail(lead.email || "");
  }, [lead.draft_subject, lead.draft_body, lead.email]);

  const dirty = subject !== (lead.draft_subject || "") || body !== (lead.draft_body || "");
  const locked = lead.status !== "new" || lead.suppressed;

  async function run(label, fn, okText) {
    setBusy(label);
    setMsg(null);
    try {
      await fn();
      if (okText) setMsg({ ok: true, text: okText });
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(null);
    }
  }

  const patch = (b) => api(`/api/admin/outreach/leads/${lead.id}`, { method: "PATCH", body: b });

  return (
    <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-white">
              {lead.business_name}
              {lead.contact_name && <span className="font-normal text-slate-400"> · {lead.contact_name}</span>}
            </p>
            {lead.source !== "places" && <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">{lead.source}</span>}
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${STATUS_STYLE[lead.status]}`}>{lead.status}</span>
            {lead.draft_status === "approved" && lead.status === "new" && (
              <span className="rounded-full bg-violet-900/50 px-2 py-0.5 text-[11px] text-violet-200">approved · in send queue</span>
            )}
            {lead.suppressed && <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-[11px] text-red-300">do not contact</span>}
          </div>
          <p className="text-xs text-slate-400">
            {[lead.category, lead.city, lead.country].filter(Boolean).join(" · ")}
            {lead.rating != null && (
              <span className="ml-2 inline-flex items-center gap-0.5">
                <Star size={11} className="text-amber-300" /> {lead.rating} ({lead.rating_count ?? 0})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={lead.status}
            onChange={(e) => run("status", () => patch({ status: e.target.value }))}
            className={`${inputCls.replace("w-full", "w-auto")} py-1 text-xs`}
            aria-label="Lead status"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => confirm(`Delete ${lead.business_name}?`) && run("delete", () => api(`/api/admin/outreach/leads/${lead.id}`, { method: "DELETE" }))}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-300"
            aria-label="Delete lead"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {lead.website && (
          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-violet-300 hover:underline">
            <ExternalLink size={13} /> <span className="truncate">{lead.website_domain || lead.website}</span>
          </a>
        )}
        {lead.phone && (
          <span className="inline-flex items-center gap-1 text-slate-300">
            <Phone size={13} /> {lead.phone}
          </span>
        )}
        {lead.address && <span className="text-xs text-slate-500">{lead.address}</span>}
      </div>

      {/* website check */}
      <div className="rounded-md bg-slate-950/50 p-3 text-sm">
        {!lead.website ? (
          <p className="text-xs text-slate-400">No website on Google — the email can offer to build one.</p>
        ) : lead.enrich_status === "pending" ? (
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-400">Website not checked yet.</p>
            <button type="button" disabled={Boolean(busy)} onClick={() => run("enrich", () => api("/api/admin/outreach/enrich", { method: "POST", body: { id: lead.id } }))} className={btnGhost}>
              <Gauge size={12} /> {busy === "enrich" ? "Checking…" : "Check website"}
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`font-semibold ${scoreColor(lead.pagespeed_score)}`}>
                Mobile speed: {lead.pagespeed_score ?? "—"}/100
              </span>
              <button type="button" disabled={Boolean(busy)} onClick={() => run("enrich", () => api("/api/admin/outreach/enrich", { method: "POST", body: { id: lead.id } }))} className="text-slate-500 hover:text-white" title="Check again">
                <RefreshCw size={11} />
              </button>
            </p>
            {lead.pagespeed_issues.length > 0 && (
              <ul className="list-disc pl-5 text-xs text-slate-300">
                {lead.pagespeed_issues.map((i) => (
                  <li key={i.title}>{i.title}</li>
                ))}
              </ul>
            )}
            {lead.enrich_error && <p className="text-xs text-amber-300">{lead.enrich_error}</p>}
          </div>
        )}
      </div>

      {/* email address */}
      <div className="flex flex-wrap items-center gap-2">
        <Mail size={14} className="text-slate-500" />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="No public email found — type one if you know it"
          className={`${inputCls} max-w-xs py-1`}
          disabled={locked}
        />
        {email !== (lead.email || "") && (
          <button type="button" onClick={() => run("email", () => patch({ email }), "Email saved.")} className={btnGhost}>
            Save email
          </button>
        )}
        {lead.email_source && (
          <a href={lead.email_source} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-500 hover:underline">
            found on site
          </a>
        )}
      </div>

      {/* draft */}
      {!locked && (
        <div className="space-y-2 border-t border-slate-800 pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-300">Email draft</p>
            <button
              type="button"
              disabled={Boolean(busy) || lead.enrich_status === "pending"}
              title={lead.enrich_status === "pending" ? "Check the website first" : undefined}
              onClick={() => run("draft", () => api(`/api/admin/outreach/leads/${lead.id}/draft`, { method: "POST" }), "Draft written — read and edit it before approving.")}
              className={btnGhost}
            >
              <Sparkles size={12} /> {busy === "draft" ? "Writing…" : lead.draft_body ? "Rewrite with AI" : "Write email with AI"}
            </button>
          </div>
          {(lead.draft_body || subject || body) && (
            <>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className={inputCls} />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className={`${inputCls} font-sans`} />
              <p className="text-[11px] text-slate-500">Your signature, business address and an unsubscribe link are added automatically when sending.</p>
              <div className="flex flex-wrap gap-2">
                {dirty && (
                  <button type="button" disabled={Boolean(busy)} onClick={() => run("save", () => patch({ draftSubject: subject, draftBody: body, draftStatus: "draft" }), "Draft saved.")} className={btnGhost}>
                    Save changes
                  </button>
                )}
                {lead.draft_status !== "approved" ? (
                  <button
                    type="button"
                    disabled={Boolean(busy) || !lead.email || !email}
                    title={!lead.email ? "Add an email address first" : undefined}
                    onClick={() => run("approve", () => patch({ draftSubject: subject, draftBody: body, draftStatus: "approved" }), "Approved — it will go out with the next send.")}
                    className={btnPrimary}
                  >
                    <CheckCircle2 size={14} /> Approve for sending
                  </button>
                ) : (
                  <button type="button" disabled={Boolean(busy)} onClick={() => run("unapprove", () => patch({ draftStatus: "draft" }))} className={btnGhost}>
                    Take out of send queue
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {lead.status !== "new" && lead.draft_subject && (
        <details className="text-xs text-slate-400">
          <summary className="cursor-pointer">Sent email</summary>
          <p className="mt-2 font-medium text-slate-200">{lead.draft_subject}</p>
          <p className="whitespace-pre-wrap text-slate-300">{lead.draft_body}</p>
        </details>
      )}
      {msg && <p className={`text-xs ${msg.ok ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
    </div>
  );
}

// --- page --------------------------------------------------------------------------------

export default function LeadsManager({ leads, stats, canSend, dailyLimit }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [job, setJob] = useState(null); // { kind, text }
  const stopRef = useRef(false);

  const pendingChecks = leads.filter((l) => l.enrich_status === "pending").length;
  const needDraft = leads.filter((l) => l.status === "new" && !l.suppressed && l.email && l.enrich_status !== "pending" && !l.draft_body);
  const queued = leads.filter((l) => l.status === "new" && l.draft_status === "approved" && l.email && !l.suppressed).length;

  // Website checks, one lead per request (PageSpeed can take ~30 s each).
  async function checkAll() {
    stopRef.current = false;
    let done = 0;
    try {
      for (;;) {
        setJob({ kind: "check", text: `Checking websites… ${done} done` });
        const r = await api("/api/admin/outreach/enrich", { method: "POST", body: {} });
        if (!r.checkedId) break;
        done++;
        refresh();
        if (r.remaining === 0 || stopRef.current) break;
      }
      setJob({ kind: "info", text: `Checked ${done} websites.` });
    } catch (err) {
      setJob({ kind: "error", text: err.message });
    }
    refresh();
  }

  async function draftAll() {
    stopRef.current = false;
    let done = 0;
    try {
      for (const lead of needDraft) {
        if (stopRef.current) break;
        setJob({ kind: "draft", text: `Writing emails… ${done}/${needDraft.length}` });
        await api(`/api/admin/outreach/leads/${lead.id}/draft`, { method: "POST" });
        done++;
        refresh();
      }
      setJob({ kind: "info", text: `Wrote ${done} drafts — read and approve them before sending.` });
    } catch (err) {
      setJob({ kind: "error", text: err.message });
    }
    refresh();
  }

  // Sends approved emails one by one, waiting the random delay the server returns.
  async function sendAll() {
    if (!confirm(`Send ${queued} approved emails? They go out one by one with a random pause between them (keep this tab open).`)) return;
    stopRef.current = false;
    let sent = 0;
    try {
      for (;;) {
        const r = await api("/api/admin/outreach/send-next", { method: "POST" });
        if (r.sent) sent++;
        refresh();
        if (r.done) {
          setJob({ kind: "info", text: `${sent} sent. ${r.reason}` });
          break;
        }
        for (let s = r.waitSeconds || 0; s > 0; s--) {
          if (stopRef.current) break;
          setJob({
            kind: "send",
            text: `${sent} sent${r.failed ? ` · last failed: ${r.failed.error}` : ""} · next email in ${s}s (today ${r.sentToday}/${dailyLimit})`,
          });
          await sleep(1000);
        }
        if (stopRef.current) {
          setJob({ kind: "info", text: `Stopped. ${sent} sent.` });
          break;
        }
      }
    } catch (err) {
      setJob({ kind: "error", text: err.message });
    }
    refresh();
  }

  const running = job && ["check", "draft", "send"].includes(job.kind);
  const q = search.trim().toLowerCase();
  const shown = leads.filter(
    (l) =>
      (filter === "all" ||
        (filter === "queued" ? l.status === "new" && l.draft_status === "approved" : filter === "noemail" ? !l.email : l.status === filter)) &&
      (!q || [l.business_name, l.city, l.email, l.website_domain, l.category].filter(Boolean).some((v) => v.toLowerCase().includes(q)))
  );

  const tabs = [
    ["all", `All (${leads.length})`],
    ["queued", `Ready to send (${queued})`],
    ["noemail", `No email (${leads.filter((l) => !l.email).length})`],
    ...STATUSES.map((s) => [s, `${s} (${stats[s === "new" ? "new_count" : s] ?? 0})`]),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3">
        <button type="button" disabled={running || pendingChecks === 0} onClick={checkAll} className={btnGhost}>
          <Gauge size={12} /> Check websites ({pendingChecks})
        </button>
        <button type="button" disabled={running || needDraft.length === 0} onClick={draftAll} className={btnGhost}>
          <Sparkles size={12} /> Write emails ({needDraft.length})
        </button>
        <button type="button" disabled={running || !canSend || queued === 0} onClick={sendAll} className={`${btnPrimary} ml-auto`}>
          <Send size={14} /> Send approved ({queued})
        </button>
        {running && (
          <button type="button" onClick={() => (stopRef.current = true)} className="text-xs text-red-300 hover:underline">
            Stop
          </button>
        )}
        {job && (
          <p className={`w-full text-xs ${job.kind === "error" ? "text-red-300" : running ? "text-sky-300" : "text-emerald-300"}`}>{job.text}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-3 py-1 text-xs ${filter === value ? "border-violet-500 bg-violet-900/40 text-white" : "border-slate-700 text-slate-400 hover:bg-slate-800"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative max-w-md">
        <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search business, city, email, website…" className={`${inputCls} pl-8`} />
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
          {leads.length === 0 ? "No leads yet — use Find leads first." : "Nothing here."}
        </p>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {shown.map((l) => (
            <LeadCard key={l.id} lead={l} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
