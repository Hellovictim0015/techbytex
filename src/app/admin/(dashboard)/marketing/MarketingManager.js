"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PLACEHOLDERS = ["name", "business", "phone", "website", "details"];
const inputCls =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50";
const btnPrimary = "rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50";
const btnGhost = "rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50";

const STATUS_STYLES = {
  ready: "text-slate-300",
  sending: "text-sky-300",
  completed: "text-emerald-300",
  partial: "text-amber-300",
  failed: "text-red-300",
};

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

// --- contact sheet parsing (same rules as the server) -------------------------

function normalizePhone(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === "," || ch === "\t" || ch === ";") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim()));
}

// Finds the name / phone columns from a header row, or guesses them from the data.
function rowsToContacts(rows) {
  if (rows.length === 0) return [];
  const header = rows[0].map((c) => String(c ?? "").toLowerCase().trim());
  let phoneCol = header.findIndex((h) => /(phone|mobile|number|contact|whatsapp|mob)/.test(h));
  let nameCol = header.findIndex((h) => /name/.test(h));
  let data = rows;
  if (phoneCol >= 0) data = rows.slice(1);
  else {
    const sample = rows.slice(0, 20);
    const width = Math.max(...sample.map((r) => r.length));
    let best = -1;
    let bestScore = 0;
    for (let c = 0; c < width; c++) {
      const score = sample.filter((r) => normalizePhone(r[c])).length;
      if (score > bestScore) {
        best = c;
        bestScore = score;
      }
    }
    phoneCol = best;
    nameCol = best === 0 ? 1 : 0;
    if (!normalizePhone(rows[0]?.[phoneCol])) data = rows.slice(1);
  }
  if (phoneCol < 0) return [];
  return data.map((r) => ({ name: String(r[nameCol] ?? "").trim(), phone: String(r[phoneCol] ?? "").trim() }));
}

function summarise(contacts) {
  const seen = new Set();
  const valid = [];
  let invalid = 0;
  let duplicates = 0;
  for (const c of contacts) {
    const phone = normalizePhone(c.phone);
    if (!phone) invalid++;
    else if (seen.has(phone)) duplicates++;
    else {
      seen.add(phone);
      valid.push({ name: c.name, phone });
    }
  }
  return { valid, invalid, duplicates };
}

function fill(text, contact, business) {
  const values = {
    name: contact?.name || "Customer",
    business: business.name || "",
    phone: business.phone || "",
    website: business.website || "",
    details: business.details || "",
  };
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
}

function smsParts(text) {
  const unicode = /[^\x00-\x7F]/.test(text);
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  return text.length <= single ? 1 : Math.ceil(text.length / multi);
}

function istHour() {
  return Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
}

// --- sections ----------------------------------------------------------------

function BusinessCard({ business, setBusiness }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const set = (k) => (e) => setBusiness((b) => ({ ...b, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/admin/marketing/business", { method: "POST", body: business });
      setMessage({ ok: true, text: "Saved." });
    } catch (error) {
      setMessage({ ok: false, text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 space-y-3">
      <div>
        <p className="text-sm text-white">1. Business details</p>
        <p className="text-xs text-slate-500">
          Used in messages as {"{business}"}, {"{phone}"}, {"{website}"} and {"{details}"}.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input value={business.name} onChange={set("name")} placeholder="Business name (TechByteX)" className={inputCls} />
        <input value={business.phone} onChange={set("phone")} placeholder="Phone (8827219873)" className={inputCls} />
        <input value={business.website} onChange={set("website")} placeholder="Website (techbytex.in)" className={inputCls} />
      </div>
      <input value={business.details} onChange={set("details")} placeholder="Offer / extra details (e.g. Website from Rs 15,000)" className={inputCls} />
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className={btnGhost}>
          {saving ? "Saving..." : "Save details"}
        </button>
        {message && <span className={`text-xs ${message.ok ? "text-emerald-300" : "text-red-300"}`}>{message.text}</span>}
      </div>
    </div>
  );
}

function Composer({ business, config, onCreated }) {
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [manual, setManual] = useState("");
  const [fileName, setFileName] = useState("");
  const [route, setRoute] = useState(config.whatsappMessageId ? "whatsapp" : config.dlt ? "dlt" : "q");
  const [message, setMessage] = useState(config.whatsappMessageId || config.dlt ? "{name}" : "Hi {name}, {business} builds websites & apps for your business. {details} Call {phone} / {website}");
  const [consent, setConsent] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [busy, setBusy] = useState(null);
  const [status, setStatus] = useState(null);
  const textRef = useRef(null);

  const manualContacts = useMemo(
    () => rowsToContacts(manual.split(/\r?\n/).filter(Boolean).map((l) => l.split(/[,\t;]/))),
    [manual]
  );
  const summary = useMemo(() => summarise([...contacts, ...manualContacts]), [contacts, manualContacts]);
  const preview = fill(message, summary.valid[0], business);
  const hour = istHour();
  // The 10 AM – 9 PM rule is for promotional SMS; WhatsApp isn't bound by it.
  const outsideHours = route !== "whatsapp" && (hour < 10 || hour >= 21);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(null);
    try {
      let rows;
      if (/\.(xlsx|xls)$/i.test(file.name)) {
        const { default: readXlsxFile } = await import("read-excel-file");
        rows = await readXlsxFile(file);
      } else {
        rows = parseCsv(await file.text());
      }
      const parsed = rowsToContacts(rows);
      if (parsed.length === 0) throw new Error("Could not find a phone number column in this sheet.");
      setContacts(parsed);
      setFileName(file.name);
    } catch (error) {
      setStatus({ ok: false, text: error.message.includes("phone") ? error.message : `Could not read the file: ${error.message}` });
    } finally {
      e.target.value = "";
    }
  }

  function insert(token) {
    const el = textRef.current;
    const at = el?.selectionStart ?? message.length;
    setMessage((m) => `${m.slice(0, at)}{${token}}${m.slice(at)}`);
  }

  async function sendTest() {
    setBusy("test");
    setStatus(null);
    try {
      await api("/api/admin/marketing/test", { method: "POST", body: { phone: testPhone, route, message } });
      setStatus({ ok: true, text: `Test ${route === "whatsapp" ? "WhatsApp" : "SMS"} sent to ${testPhone}.` });
    } catch (error) {
      setStatus({ ok: false, text: error.message });
    } finally {
      setBusy(null);
    }
  }

  async function createAndSend() {
    if (!confirm(`Send this ${route === "whatsapp" ? "WhatsApp message" : "SMS"} to ${summary.valid.length} numbers? Fast2SMS will charge your wallet.`)) return;
    setBusy("send");
    setStatus(null);
    try {
      const { result } = await api("/api/admin/marketing/campaigns", {
        method: "POST",
        body: { name, route, message, contacts: summary.valid },
      });
      onCreated(result.campaignId);
      setContacts([]);
      setManual("");
      setFileName("");
      setName("");
      setConsent(false);
    } catch (error) {
      setStatus({ ok: false, text: error.message });
    } finally {
      setBusy(null);
    }
  }

  const canSend =
    name.trim() && summary.valid.length > 0 && (route !== "q" || message.trim()) && consent && config.apiKey && !busy;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 space-y-5">
      <p className="text-sm text-white">2. New SMS campaign</p>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name (e.g. Diwali offer — Raipur shops)" className={inputCls} />

      {/* contacts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Upload sheet (.xlsx or .csv) — needs a Name and a Number / Mobile column</p>
          <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400 hover:border-violet-500 hover:text-violet-300">
            {fileName ? `${fileName} — ${contacts.length} rows` : "Click to choose a file"}
            <input type="file" accept=".csv,.xlsx,.xls,text/csv" onChange={onFile} className="hidden" />
          </label>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400">…or type / paste, one per line: Name, Number</p>
          <textarea value={manual} onChange={(e) => setManual(e.target.value)} rows={4} placeholder={"Ramesh, 9876543210\nSuresh, 9123456780"} className={inputCls} />
        </div>
      </div>
      <p className="text-xs text-slate-400">
        <span className="text-emerald-300">{summary.valid.length} valid numbers</span>
        {summary.invalid > 0 && <span className="text-amber-300"> · {summary.invalid} invalid skipped</span>}
        {summary.duplicates > 0 && <span className="text-slate-500"> · {summary.duplicates} duplicates removed</span>}
        {summary.valid.length > 0 && <span className="text-slate-500"> · first: {summary.valid[0].name || "(no name)"} {summary.valid[0].phone}</span>}
      </p>

      {/* message */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <select value={route} onChange={(e) => setRoute(e.target.value)} className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white">
            <option value="whatsapp">WhatsApp template {config.whatsappMessageId ? `(ID ${config.whatsappMessageId})` : "(not set up)"}</option>
            <option value="dlt">SMS — DLT template {config.dlt ? `(${config.senderId} / ${config.templateId})` : "(not set up)"}</option>
            <option value="q">SMS — Quick route (free text)</option>
          </select>
          <span className="text-xs text-slate-500">Insert:</span>
          {PLACEHOLDERS.map((p) => (
            <button key={p} type="button" onClick={() => insert(p)} className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-violet-300 hover:bg-slate-800">
              {`{${p}}`}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {route === "whatsapp"
            ? "Values for your WhatsApp template's {{1}}, {{2}}… in order, separated by | — e.g. {name} fills {{1}} with each person's name. The rest of the message, header, footer and buttons come from the approved template."
            : route === "dlt"
            ? "Values for the {#var#} slots of your approved DLT template, in order, separated by | — e.g. {name}. Leave empty if the template has no {#var#}. The template text itself is fixed by DLT."
            : "Full message text. Quick route costs more per SMS and is meant for transactional/service messages."}
        </p>
        <textarea ref={textRef} value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={inputCls} />
        <div className="rounded-md bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
          <span className="text-slate-500">Preview ({summary.valid[0]?.name || "Customer"}): </span>
          {preview}
          {route === "q" && <span className="text-slate-500"> · {preview.length} chars · {smsParts(preview)} SMS each</span>}
        </div>
      </div>

      {outsideHours && (
        <p className="rounded-md border border-amber-800 bg-amber-950/40 px-3 py-2 text-xs text-amber-300">
          It is {hour}:00 IST. Promotional SMS in India are only delivered between 10 AM and 9 PM — messages sent now may be held or dropped.
        </p>
      )}

      <label className="flex items-start gap-2 text-xs text-slate-300">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        These people have agreed to receive messages from my business. (SMS to DND numbers are blocked by operators; WhatsApp users who report spam can get your number restricted.)
      </label>

      <div className="flex flex-wrap items-end gap-3 border-t border-slate-800 pt-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-400">Test on your own number first</p>
          <div className="flex gap-2">
            <input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="98XXXXXXXX" className={`${inputCls} w-40`} />
            <button type="button" onClick={sendTest} disabled={!testPhone || !config.apiKey || Boolean(busy)} className={btnGhost}>
              {busy === "test" ? "Sending..." : "Send test"}
            </button>
          </div>
        </div>
        <button type="button" onClick={createAndSend} disabled={!canSend} className={`${btnPrimary} ml-auto`}>
          {busy === "send" ? "Saving..." : `Send to ${summary.valid.length} numbers`}
        </button>
      </div>
      {status && <p className={`text-xs ${status.ok ? "text-emerald-300" : "text-red-300"}`}>{status.text}</p>}
    </div>
  );
}

function CampaignRow({ c, running, onSend, onRetry }) {
  const [failed, setFailed] = useState(null);
  const pending = c.total - c.sent - c.failed;
  const pct = c.total ? Math.round(((c.sent + c.failed) / c.total) * 100) : 0;

  async function toggleFailed() {
    if (failed) return setFailed(null);
    const data = await api(`/api/admin/marketing/campaigns/${c.id}`).catch(() => ({ failed: [] }));
    setFailed(data.failed);
  }

  return (
    <>
      <tr className="align-top">
        <td className="px-4 py-2">
          <p className="text-slate-100">{c.name}</p>
          <p className="text-xs text-slate-500">
            {c.route === "whatsapp" ? `WhatsApp ${c.template_id || ""}` : c.route === "dlt" ? `SMS DLT ${c.sender_id || ""}` : "SMS Quick"} · {String(c.created_at).slice(0, 16)}
          </p>
          <div className="mt-1 h-1 w-40 rounded-full bg-slate-800">
            <div className="h-1 rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
          </div>
        </td>
        <td className="px-4 py-2 text-right tabular-nums text-slate-300">{c.total}</td>
        <td className="px-4 py-2 text-right tabular-nums text-emerald-300">{c.sent}</td>
        <td className="px-4 py-2 text-right tabular-nums text-red-300">{c.failed}</td>
        <td className={`px-4 py-2 ${STATUS_STYLES[c.status] || ""}`}>{running ? `sending ${pct}%` : c.status}</td>
        <td className="px-4 py-2 whitespace-nowrap space-x-2">
          {pending > 0 && !running && (
            <button type="button" onClick={() => onSend(c.id)} className="text-xs text-violet-300 hover:underline">
              {c.sent + c.failed > 0 ? "Resume" : "Send"}
            </button>
          )}
          {c.failed > 0 && !running && (
            <>
              <button type="button" onClick={toggleFailed} className="text-xs text-slate-300 hover:underline">
                {failed ? "Hide failed" : "View failed"}
              </button>
              <button type="button" onClick={() => onRetry(c.id)} className="text-xs text-amber-300 hover:underline">
                Retry failed
              </button>
            </>
          )}
        </td>
      </tr>
      {failed && (
        <tr>
          <td colSpan={6} className="px-4 pb-3">
            <div className="max-h-48 overflow-auto rounded-md bg-slate-950/60 p-2 text-xs text-slate-400">
              {failed.length === 0 && "No failed numbers."}
              {failed.map((f) => (
                <p key={f.phone}>
                  {f.phone} {f.name && `(${f.name})`} — <span className="text-red-300">{f.error_message}</span>
                </p>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function MarketingManager({ campaigns, business: initialBusiness, config }) {
  const router = useRouter();
  const [business, setBusiness] = useState({ name: "", phone: "", website: "", details: "", ...initialBusiness });
  const [running, setRunning] = useState(null);
  const [error, setError] = useState("");
  const stopRef = useRef(false);

  // Sends batch after batch until nothing is pending; each call is short.
  async function send(id) {
    setRunning(id);
    setError("");
    stopRef.current = false;
    try {
      for (;;) {
        const { result } = await api(`/api/admin/marketing/campaigns/${id}`, { method: "POST", body: { action: "send" } });
        router.refresh();
        if (result.pending === 0 || stopRef.current) break;
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(null);
      router.refresh();
    }
  }

  async function retry(id) {
    try {
      await api(`/api/admin/marketing/campaigns/${id}`, { method: "POST", body: { action: "retry" } });
      await send(id);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-6">
      <BusinessCard business={business} setBusiness={setBusiness} />
      <Composer business={business} config={config} onCreated={send} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white">3. Campaigns</p>
          {running && (
            <button type="button" onClick={() => (stopRef.current = true)} className="text-xs text-red-300 hover:underline">
              Pause after this batch
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-300">{error}</p>}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Campaign</th>
                <th className="px-4 py-2 text-right font-medium">Total</th>
                <th className="px-4 py-2 text-right font-medium">Sent</th>
                <th className="px-4 py-2 text-right font-medium">Failed</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">No campaigns yet.</td>
                </tr>
              )}
              {campaigns.map((c) => (
                <CampaignRow key={c.id} c={c} running={running === c.id} onSend={send} onRetry={retry} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
