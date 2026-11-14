"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Save } from "lucide-react";
import { api, inputCls, btnPrimary, btnGhost } from "../ui";

function Field({ label, hint, children, wide }) {
  return (
    <label className={`block space-y-1 text-xs text-slate-400 ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
      {hint && <span className="block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

// Secret fields show the saved value masked; typing replaces it, leaving it
// empty keeps it.
function SecretInput({ value, onChange, saved }) {
  return (
    <input
      type="password"
      autoComplete="new-password"
      value={value}
      onChange={onChange}
      placeholder={saved ? `Saved (${saved}) — leave empty to keep` : "Not set"}
      className={inputCls}
    />
  );
}

const SECRETS = ["places_api_key", "pagespeed_api_key", "ai_api_key", "smtp_password"];

export default function SettingsForm({ initial, defaultModels, defaultPrompt, canSave }) {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    const f = { ...initial };
    for (const k of SECRETS) f[k] = ""; // never prefill secrets
    return f;
  });
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const [testTo, setTestTo] = useState("");
  const [keyResults, setKeyResults] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? String(e.target.checked) : e.target.value }));

  async function save(e) {
    e?.preventDefault();
    setBusy("save");
    setMsg(null);
    try {
      await api("/api/admin/outreach/settings", { method: "PUT", body: form });
      setForm((f) => ({ ...f, ...Object.fromEntries(SECRETS.map((k) => [k, ""])) }));
      setMsg({ ok: true, text: "Settings saved." });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(null);
    }
  }

  async function testSmtp() {
    setBusy("smtp");
    setMsg(null);
    try {
      await api("/api/admin/outreach/settings/test-smtp", { method: "POST", body: { to: testTo } });
      setMsg({ ok: true, text: `Test email sent to ${testTo}. (Uses saved settings — save first if you changed anything.)` });
    } catch (err) {
      setMsg({ ok: false, text: `SMTP test failed: ${err.message}` });
    } finally {
      setBusy(null);
    }
  }

  async function testKeys() {
    setBusy("keys");
    setKeyResults(null);
    try {
      const { results } = await api("/api/admin/outreach/settings/test-keys", { method: "POST" });
      setKeyResults(results);
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(null);
    }
  }

  return (
    <form onSubmit={save} className="max-w-4xl space-y-5">
      <Section title="API keys">
        <Field label="Google Places API key" hint="Google Cloud → enable “Places API (New)”.">
          <SecretInput value={form.places_api_key} onChange={set("places_api_key")} saved={initial.places_api_key} />
        </Field>
        <Field label="Google PageSpeed API key" hint="Google Cloud → enable “PageSpeed Insights API”.">
          <SecretInput value={form.pagespeed_api_key} onChange={set("pagespeed_api_key")} saved={initial.pagespeed_api_key} />
        </Field>
        <Field label="AI provider">
          <select value={form.ai_provider} onChange={(e) => setForm((f) => ({ ...f, ai_provider: e.target.value, ai_model: defaultModels[e.target.value] }))} className={inputCls}>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="openai">OpenAI</option>
          </select>
        </Field>
        <Field label="AI model" hint={`Default: ${defaultModels[form.ai_provider]}`}>
          <input value={form.ai_model} onChange={set("ai_model")} className={inputCls} />
        </Field>
        <Field label="AI API key" wide>
          <SecretInput value={form.ai_api_key} onChange={set("ai_api_key")} saved={initial.ai_api_key} />
        </Field>
        <div className="sm:col-span-2 space-y-2">
          <button type="button" onClick={testKeys} disabled={Boolean(busy)} className={btnGhost}>
            <KeyRound size={12} /> {busy === "keys" ? "Testing (PageSpeed can take ~30s)…" : "Test API keys"}
          </button>
          <p className="text-[11px] text-slate-500">Tests the saved keys — save first if you changed them.</p>
          {keyResults && (
            <ul className="space-y-1 text-xs">
              {[
                ["Google Places", keyResults.places],
                ["PageSpeed", keyResults.pagespeed],
                ["AI", keyResults.ai],
              ].map(([name, r]) => (
                <li key={name} className={r.ok ? "text-emerald-300" : "text-red-300"}>
                  {r.ok ? "✓" : "✗"} {name}: {r.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section title="Sending (SMTP)">
        <Field label="SMTP host">
          <input value={form.smtp_host} onChange={set("smtp_host")} placeholder="smtp.hostinger.com" className={inputCls} />
        </Field>
        <Field label="Port" hint="587 with TLS off (STARTTLS), or 465 with TLS on.">
          <input value={form.smtp_port} onChange={set("smtp_port")} className={inputCls} />
        </Field>
        <Field label="SMTP user">
          <input value={form.smtp_user} onChange={set("smtp_user")} autoComplete="off" className={inputCls} />
        </Field>
        <Field label="SMTP password">
          <SecretInput value={form.smtp_password} onChange={set("smtp_password")} saved={initial.smtp_password} />
        </Field>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" checked={form.smtp_secure === "true"} onChange={set("smtp_secure")} /> Secure connection (TLS, usually port 465)
        </label>
        <div />
        <Field label="From name">
          <input value={form.from_name} onChange={set("from_name")} className={inputCls} />
        </Field>
        <Field label="From email" hint="Use an address on your own domain with SPF/DKIM set up.">
          <input value={form.from_email} onChange={set("from_email")} placeholder="hello@techbytex.in" className={inputCls} />
        </Field>
        <Field label="Daily email limit">
          <input type="number" min={0} value={form.daily_limit} onChange={set("daily_limit")} className={inputCls} />
        </Field>
        <Field label="Random delay between emails (seconds)">
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={form.min_delay_seconds} onChange={set("min_delay_seconds")} className={inputCls} />
            <span>to</span>
            <input type="number" min={0} value={form.max_delay_seconds} onChange={set("max_delay_seconds")} className={inputCls} />
          </div>
        </Field>
        <Field label="Unsubscribe base URL" hint="Links become <base>/unsubscribe/<token>.">
          <input value={form.unsubscribe_base_url} onChange={set("unsubscribe_base_url")} className={inputCls} />
        </Field>
        <Field label="Business postal address (shown in every email footer)">
          <input value={form.business_address} onChange={set("business_address")} className={inputCls} />
        </Field>
        <Field label="Email signature" wide>
          <textarea value={form.email_signature} onChange={set("email_signature")} rows={3} className={inputCls} />
        </Field>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
          <input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="Send test email to…" className={`${inputCls} max-w-xs`} />
          <button type="button" onClick={testSmtp} disabled={Boolean(busy) || !testTo} className={btnGhost}>
            <Mail size={12} /> {busy === "smtp" ? "Sending…" : "Test SMTP"}
          </button>
        </div>
      </Section>

      <Section title="AI email prompt">
        <Field
          label="Prompt template"
          wide
          hint="Placeholders: {contact_name} {business_name} {category} {city} {country} {website} {issue} {from_name}. {issue} is the main website problem found by PageSpeed."
        >
          <textarea value={form.prompt_template} onChange={set("prompt_template")} rows={9} className={`${inputCls} font-mono text-xs`} />
        </Field>
        <button type="button" onClick={() => setForm((f) => ({ ...f, prompt_template: defaultPrompt }))} className={`${btnGhost} w-fit`}>
          Reset to default prompt
        </button>
      </Section>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-slate-800 bg-slate-950/95 py-3">
        <button type="submit" disabled={!canSave || Boolean(busy)} className={btnPrimary}>
          <Save size={14} /> {busy === "save" ? "Saving…" : "Save settings"}
        </button>
        {msg && <p className={`text-sm ${msg.ok ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
      </div>
    </form>
  );
}
