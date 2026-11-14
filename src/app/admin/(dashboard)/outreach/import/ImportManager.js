"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileSpreadsheet, KeyRound, Play, Square, UserPlus } from "lucide-react";
import { api, inputCls, btnPrimary, btnGhost } from "../ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- sheet parsing ------------------------------------------------------------------------

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
    else if (ch === "," || ch === ";" || ch === "\t") {
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
  return rows.filter((r) => r.some((c) => String(c ?? "").trim()));
}

// Finds the Email / Business Name / Name columns by their header.
function rowsToLeads(rows) {
  if (rows.length < 2) throw new Error("The sheet needs a header row and at least one lead.");
  const header = rows[0].map((h) => String(h ?? "").toLowerCase().trim());
  const col = (re) => header.findIndex((h) => re.test(h));
  const emailCol = col(/e-?mail/);
  const businessCol = col(/business|company|shop|firm|organi[sz]ation/);
  const nameCol = header.findIndex((h, i) => i !== businessCol && /name|contact|owner|person/.test(h));
  const websiteCol = col(/website|site|url/);
  const cityCol = col(/city|location/);
  if (emailCol < 0 || businessCol < 0) {
    throw new Error('Could not find the "Email" and "Business Name" columns. Download the format and use the same headers.');
  }
  const cell = (r, i) => (i >= 0 ? String(r[i] ?? "").trim() : "");
  return rows.slice(1).map((r) => ({
    email: cell(r, emailCol).toLowerCase(),
    businessName: cell(r, businessCol),
    name: cell(r, nameCol),
    website: cell(r, websiteCol),
    city: cell(r, cityCol),
  }));
}

// --- AI key box -----------------------------------------------------------------------------

function AiKeyBox({ ai, defaultModels }) {
  const router = useRouter();
  const [provider, setProvider] = useState(ai.provider);
  const [model, setModel] = useState(ai.model);
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState(null);

  async function save() {
    setMsg(null);
    try {
      await api("/api/admin/outreach/settings", { method: "PUT", body: { ai_provider: provider, ai_model: model, ai_api_key: key } });
      setKey("");
      setMsg({ ok: true, text: "AI settings saved." });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h2 className="flex items-center gap-2 text-sm font-medium text-white">
        <KeyRound size={15} /> AI that writes the emails
      </h2>
      <div className="grid gap-3 sm:grid-cols-[180px_200px_1fr_auto]">
        <select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            setModel(defaultModels[e.target.value]);
          }}
          className={inputCls}
          aria-label="AI provider"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>
        <input value={model} onChange={(e) => setModel(e.target.value)} className={inputCls} aria-label="AI model" />
        <input
          type="password"
          autoComplete="new-password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={ai.savedKey ? `Key saved (${ai.savedKey}) — type to replace` : provider === "openai" ? "OpenAI API key (sk-...)" : "Anthropic API key"}
          className={inputCls}
          aria-label="AI API key"
        />
        <button type="button" onClick={save} className={btnPrimary}>
          Save
        </button>
      </div>
      {msg && <p className={`text-xs ${msg.ok ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
    </section>
  );
}

// --- page --------------------------------------------------------------------------------------

export default function ImportManager({ ai, defaultModels, sendProblem, dailyLimit }) {
  const router = useRouter();
  const [mode, setMode] = useState("review"); // "auto" | "review"
  const [sheet, setSheet] = useState(null); // { fileName, rows }
  const [manual, setManual] = useState({ email: "", businessName: "", name: "", website: "", city: "" });
  const [job, setJob] = useState(null); // { running, text, error }
  const stopRef = useRef(false);

  const validRows = sheet ? sheet.rows.filter((r) => EMAIL_RE.test(r.email) && r.businessName) : [];

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setJob(null);
    try {
      let rows;
      if (/\.(xlsx|xls)$/i.test(file.name)) {
        const { default: readXlsxFile } = await import("read-excel-file");
        rows = await readXlsxFile(file);
      } else rows = parseCsv(await file.text());
      setSheet({ fileName: file.name, rows: rowsToLeads(rows) });
    } catch (err) {
      setSheet(null);
      setJob({ error: true, text: err.message });
    }
  }

  // Import → (website check) → AI draft → approve → send, one lead at a time.
  async function run(rows, source) {
    if (mode === "auto" && sendProblem) {
      setJob({ error: true, text: `Auto-send needs SMTP: ${sendProblem}` });
      return;
    }
    if (mode === "auto" && !confirm(`Import ${rows.length} contacts, let AI write each email and send them automatically (up to ${dailyLimit} per day)?`)) return;
    stopRef.current = false;
    try {
      setJob({ running: true, text: "Importing…" });
      const imported = await api("/api/admin/outreach/import", { method: "POST", body: { rows, source } });
      const skippedText = Object.entries(imported.skipped)
        .filter(([, n]) => n)
        .map(([k, n]) => `${n} ${k}`)
        .join(", ");
      let drafted = 0;
      for (const id of imported.ids) {
        if (stopRef.current) break;
        setJob({ running: true, text: `Imported ${imported.added}${skippedText ? ` (skipped: ${skippedText})` : ""} · AI writing emails ${drafted}/${imported.ids.length}…` });
        try {
          await api("/api/admin/outreach/enrich", { method: "POST", body: { id } }); // no-op without a website
          await api(`/api/admin/outreach/leads/${id}/draft`, { method: "POST" });
          if (mode === "auto") await api(`/api/admin/outreach/leads/${id}`, { method: "PATCH", body: { draftStatus: "approved" } });
          drafted++;
        } catch (err) {
          setJob({ running: true, text: `Lead ${id}: ${err.message}` });
          if (/API key|not set|rate limit/i.test(err.message)) throw err; // no point trying the rest
        }
      }
      router.refresh();
      if (mode !== "auto" || stopRef.current) {
        setJob({
          running: false,
          text: `Imported ${imported.added}${skippedText ? ` (skipped: ${skippedText})` : ""}, ${drafted} emails written.${mode === "review" ? " Review and approve them in Leads & emails." : ""}`,
          link: mode === "review",
        });
        return;
      }
      let sent = 0;
      for (;;) {
        const r = await api("/api/admin/outreach/send-next", { method: "POST" });
        if (r.sent) sent++;
        if (r.done) {
          setJob({ running: false, text: `Done: ${drafted} emails written, ${sent} sent. ${r.reason}` });
          break;
        }
        for (let s = r.waitSeconds || 0; s > 0 && !stopRef.current; s--) {
          setJob({ running: true, text: `${sent} sent${r.failed ? ` · last failed: ${r.failed.error}` : ""} · next in ${s}s (today ${r.sentToday}/${dailyLimit}) — keep this tab open` });
          await sleep(1000);
        }
        if (stopRef.current) {
          setJob({ running: false, text: `Stopped. ${sent} sent; the rest stay approved in Leads & emails.` });
          break;
        }
      }
      router.refresh();
    } catch (err) {
      setJob({ running: false, error: true, text: err.message });
      router.refresh();
    }
  }

  const running = Boolean(job?.running);

  return (
    <div className="space-y-5">
      <AiKeyBox ai={ai} defaultModels={defaultModels} />

      <section className="space-y-2 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-sm font-medium text-white">After import</h2>
        <label className="flex items-start gap-2 text-sm text-slate-300">
          <input type="radio" name="mode" checked={mode === "review"} onChange={() => setMode("review")} className="mt-1" />
          <span>
            AI writes each email, <strong>I review and approve</strong> in Leads &amp; emails (recommended)
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-300">
          <input type="radio" name="mode" checked={mode === "auto"} onChange={() => setMode("auto")} className="mt-1" />
          <span>
            AI writes each email and <strong>sends automatically</strong> — daily limit, random delay and unsubscribe rules still apply
          </span>
        </label>
        {mode === "auto" && sendProblem && <p className="text-xs text-amber-300">Set up SMTP in Settings first: {sendProblem}</p>}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-medium text-white">
              <FileSpreadsheet size={15} /> Upload Excel / CSV
            </h2>
            <a href="/outreach-import-format.xlsx" download="TechByteX-outreach-import-format.xlsx" className={btnGhost}>
              Download format
            </a>
          </div>
          <p className="text-xs text-slate-400">
            Columns: <strong>Email</strong>, <strong>Business Name</strong>, <strong>Name</strong> (optional: Website, City). First row = headers.
          </p>
          <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400 hover:border-violet-500 hover:text-violet-300">
            {sheet ? `${sheet.fileName} — ${sheet.rows.length} rows` : "Click to choose a .xlsx or .csv file"}
            <input type="file" accept=".xlsx,.xls,.csv,text/csv" onChange={onFile} disabled={running} className="hidden" />
          </label>
          {sheet && (
            <>
              <p className="text-xs text-slate-400">
                <span className="text-emerald-300">{validRows.length} valid</span>
                {sheet.rows.length - validRows.length > 0 && (
                  <span className="text-amber-300"> · {sheet.rows.length - validRows.length} without a valid email or business name (skipped)</span>
                )}
              </p>
              <div className="max-h-48 overflow-auto rounded border border-slate-800">
                <table className="w-full text-xs">
                  <thead className="bg-slate-950 text-left text-slate-500">
                    <tr>
                      <th className="px-2 py-1">Email</th>
                      <th className="px-2 py-1">Business</th>
                      <th className="px-2 py-1">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.rows.slice(0, 50).map((r, i) => (
                      <tr key={i} className={EMAIL_RE.test(r.email) && r.businessName ? "text-slate-300" : "text-red-300"}>
                        <td className="px-2 py-1">{r.email}</td>
                        <td className="px-2 py-1">{r.businessName}</td>
                        <td className="px-2 py-1">{r.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" disabled={running || validRows.length === 0} onClick={() => run(validRows, "import")} className={btnPrimary}>
                <Play size={14} /> {mode === "auto" ? `Import & send ${validRows.length}` : `Import & write ${validRows.length} emails`}
              </button>
            </>
          )}
        </section>

        <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <h2 className="flex items-center gap-2 text-sm font-medium text-white">
            <UserPlus size={15} /> Add one by hand
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["email", "Email *"],
              ["businessName", "Business name *"],
              ["name", "Contact name"],
              ["website", "Website (optional)"],
              ["city", "City (optional)"],
            ].map(([k, label]) => (
              <input
                key={k}
                value={manual[k]}
                onChange={(e) => setManual((m) => ({ ...m, [k]: e.target.value }))}
                placeholder={label}
                className={inputCls}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={running || !EMAIL_RE.test(manual.email.trim()) || !manual.businessName.trim()}
            onClick={async () => {
              await run([{ ...manual, email: manual.email.trim().toLowerCase() }], "manual");
              setManual({ email: "", businessName: "", name: "", website: "", city: "" });
            }}
            className={btnPrimary}
          >
            <Play size={14} /> {mode === "auto" ? "Add & send" : "Add & write email"}
          </button>
        </section>
      </div>

      {job && (
        <div className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm ${job.error ? "border-red-900 text-red-300" : running ? "border-sky-900 text-sky-300" : "border-emerald-900 text-emerald-300"}`}>
          <span>{job.text}</span>
          {job.link && (
            <Link href="/admin/outreach/leads" className="underline">
              Open Leads &amp; emails →
            </Link>
          )}
          {running && (
            <button type="button" onClick={() => (stopRef.current = true)} className={`${btnGhost} ml-auto`}>
              <Square size={12} /> Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
