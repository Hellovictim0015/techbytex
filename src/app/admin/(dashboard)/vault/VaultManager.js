"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wand2,
  X,
  CalendarClock,
  Users,
} from "lucide-react";

const inputCls =
  "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-md bg-violet-700 px-3 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50";
const iconBtn = "rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40";

const REVEAL_SECONDS = 30;
const EXPIRY_WARN_DAYS = 30;

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

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const ms = new Date(`${isoDate}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

function ExpiryBadge({ date }) {
  const days = daysUntil(date);
  if (days === null) return null;
  const cls =
    days < 0
      ? "bg-red-900/50 text-red-300"
      : days <= EXPIRY_WARN_DAYS
      ? "bg-amber-900/50 text-amber-300"
      : "bg-slate-800 text-slate-400";
  const label = days < 0 ? `expired ${-days}d ago` : days === 0 ? "renews today" : `renews in ${days}d`;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${cls}`} title={date}>
      <CalendarClock size={11} /> {label}
    </span>
  );
}

// Strong random password from the browser's crypto (no look-alike characters).
function generatePassword(length = 18) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*-_=+";
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

// Dates arrive from the server as Date objects (or ISO strings).
const day = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");
const minute = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

async function copy(text) {
  await navigator.clipboard.writeText(text);
}

// --- add / edit form -----------------------------------------------------------

const EMPTY = {
  clientId: "",
  entryType: "website",
  title: "",
  loginUrl: "",
  websiteUrl: "",
  username: "",
  password: "",
  notes: "",
  expiresOn: "",
};

function EntryForm({ entry, clientId, clients, types, onClose, onSaved }) {
  const editing = Boolean(entry);
  const [form, setForm] = useState(() =>
    editing
      ? {
          ...EMPTY,
          clientId: String(entry.client_id),
          entryType: entry.entry_type,
          title: entry.title,
          loginUrl: entry.login_url || "",
          websiteUrl: entry.website_url || "",
          username: entry.username || "",
          expiresOn: entry.expires_on || "",
        }
      : { ...EMPTY, clientId: clientId ? String(clientId) : "" }
  );
  // On edit the password/notes stay untouched unless the admin types new ones.
  const [changeSecret, setChangeSecret] = useState(!editing);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = { ...form };
    if (!changeSecret) {
      delete body.password;
      delete body.notes;
    }
    try {
      if (editing) await api(`/api/admin/vault/entries/${entry.id}`, { method: "PATCH", body });
      else await api("/api/admin/vault/entries", { method: "POST", body });
      onSaved(Number(form.clientId));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
      <form onSubmit={save} className="w-full max-w-2xl space-y-4 rounded-lg border border-slate-700 bg-slate-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{editing ? "Edit login" : "Add login"}</h2>
          <button type="button" onClick={onClose} className={iconBtn} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-xs text-slate-400">
            Client
            <select required value={form.clientId} onChange={set("clientId")} className={inputCls}>
              <option value="" disabled>
                Select client…
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-400">
            Type
            <select value={form.entryType} onChange={set("entryType")} className={inputCls}>
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-400 sm:col-span-2">
            Name of this login
            <input required value={form.title} onChange={set("title")} placeholder="e.g. WordPress admin, Hostinger, GoDaddy domain" className={inputCls} />
          </label>
          <label className="space-y-1 text-xs text-slate-400">
            Login / admin link
            <input value={form.loginUrl} onChange={set("loginUrl")} placeholder="example.com/wp-admin" className={inputCls} />
          </label>
          <label className="space-y-1 text-xs text-slate-400">
            Website link
            <input value={form.websiteUrl} onChange={set("websiteUrl")} placeholder="example.com" className={inputCls} />
          </label>
          <label className="space-y-1 text-xs text-slate-400">
            ID / username / email
            <input value={form.username} onChange={set("username")} autoComplete="off" className={inputCls} />
          </label>
          <label className="space-y-1 text-xs text-slate-400">
            Renewal date (domain, hosting, SSL)
            <input type="date" value={form.expiresOn} onChange={set("expiresOn")} className={inputCls} />
          </label>
        </div>

        {editing && (
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={changeSecret} onChange={(e) => setChangeSecret(e.target.checked)} />
            Change the password / secure notes (leave unticked to keep the saved ones)
          </label>
        )}

        {changeSecret && (
          <div className="grid gap-4">
            <label className="space-y-1 text-xs text-slate-400">
              Password
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  autoComplete="new-password"
                  className={`${inputCls} font-mono`}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className={iconBtn} aria-label="Show password">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, password: generatePassword() }));
                    setShowPassword(true);
                  }}
                  className={iconBtn}
                  title="Generate a strong password"
                  aria-label="Generate password"
                >
                  <Wand2 size={16} />
                </button>
              </div>
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              Secure notes (encrypted — PINs, security questions, FTP port, anything sensitive)
              <textarea value={form.notes} onChange={set("notes")} rows={3} className={inputCls} />
            </label>
          </div>
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Saving..." : editing ? "Save changes" : "Save login"}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- add client --------------------------------------------------------------------

function ClientForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", contact: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { id } = await api("/api/admin/vault/clients", { method: "POST", body: form });
      onSaved(id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
      <form onSubmit={save} className="w-full max-w-lg space-y-4 rounded-lg border border-slate-700 bg-slate-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add client</h2>
          <button type="button" onClick={onClose} className={iconBtn} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <label className="block space-y-1 text-xs text-slate-400">
          Client name
          <input required autoFocus value={form.name} onChange={set("name")} placeholder="e.g. Balod Eco Tourism" className={inputCls} />
        </label>
        <label className="block space-y-1 text-xs text-slate-400">
          Phone / email (optional)
          <input value={form.contact} onChange={set("contact")} className={inputCls} />
        </label>
        <label className="block space-y-1 text-xs text-slate-400">
          Notes (optional, not encrypted — no passwords here)
          <textarea value={form.notes} onChange={set("notes")} rows={2} className={inputCls} />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Saving..." : "Create client"}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- one saved login -------------------------------------------------------------

function EntryCard({ entry, typeLabel, clientName, showClient, onEdit, onDeleted }) {
  const [secret, setSecret] = useState(null); // { password, notes } while revealed
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function notice(text) {
    setFlash(text);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchSecret() {
    setError("");
    const data = await api(`/api/admin/vault/entries/${entry.id}/reveal`, { method: "POST" });
    return { password: data.password, notes: data.notes };
  }

  async function toggleReveal() {
    if (secret) {
      setSecret(null);
      return;
    }
    try {
      setSecret(await fetchSecret());
      clearTimeout(timer.current);
      // Hide again automatically so a password never stays on screen.
      timer.current = setTimeout(() => setSecret(null), REVEAL_SECONDS * 1000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function copyPassword() {
    try {
      await copy((secret || (await fetchSecret())).password);
      notice("Password copied");
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${entry.title}" for ${clientName}? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/vault/entries/${entry.id}`, { method: "DELETE" });
      onDeleted();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-white">{entry.title}</p>
            <span className="rounded-full bg-violet-900/40 px-2 py-0.5 text-[11px] text-violet-300">{typeLabel}</span>
            <ExpiryBadge date={entry.expires_on} />
          </div>
          {showClient && <p className="text-xs text-slate-500">{clientName}</p>}
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={onEdit} className={iconBtn} aria-label="Edit">
            <Pencil size={15} />
          </button>
          <button type="button" onClick={remove} className={`${iconBtn} hover:text-red-300`} aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-[110px_1fr]">
        {entry.login_url && (
          <>
            <dt className="text-xs text-slate-500">Login link</dt>
            <dd className="min-w-0">
              <a href={entry.login_url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-violet-300 hover:underline">
                <span className="truncate">{entry.login_url}</span> <ExternalLink size={13} className="shrink-0" />
              </a>
            </dd>
          </>
        )}
        {entry.website_url && (
          <>
            <dt className="text-xs text-slate-500">Website</dt>
            <dd className="min-w-0">
              <a href={entry.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-violet-300 hover:underline">
                <span className="truncate">{entry.website_url}</span> <ExternalLink size={13} className="shrink-0" />
              </a>
            </dd>
          </>
        )}
        {entry.username && (
          <>
            <dt className="text-xs text-slate-500">ID / username</dt>
            <dd className="flex min-w-0 items-center gap-1">
              <span className="truncate font-mono text-slate-200">{entry.username}</span>
              <button
                type="button"
                onClick={() => copy(entry.username).then(() => notice("Username copied"))}
                className={iconBtn}
                aria-label="Copy username"
              >
                <Copy size={13} />
              </button>
            </dd>
          </>
        )}
        {entry.has_password && (
          <>
            <dt className="text-xs text-slate-500">Password</dt>
            <dd className="flex min-w-0 items-center gap-1">
              <span className="truncate font-mono text-slate-200">{secret ? secret.password : "••••••••••"}</span>
              <button type="button" onClick={toggleReveal} className={iconBtn} aria-label={secret ? "Hide password" : "Show password"}>
                {secret ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button type="button" onClick={copyPassword} className={iconBtn} aria-label="Copy password">
                <Copy size={13} />
              </button>
            </dd>
          </>
        )}
        {entry.has_notes && (
          <>
            <dt className="text-xs text-slate-500">Secure notes</dt>
            <dd className="whitespace-pre-wrap text-slate-300">
              {secret ? secret.notes : <span className="text-slate-500">Hidden — click the eye to show</span>}
            </dd>
          </>
        )}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>
          Updated {day(entry.updated_at)}
          {entry.last_revealed_at && ` · last viewed ${minute(entry.last_revealed_at)}`}
        </span>
        {flash && <span className="text-emerald-300">{flash}</span>}
        {error && <span className="text-red-300">{error}</span>}
      </div>
    </div>
  );
}

// --- client details ---------------------------------------------------------------

function ClientHeader({ client, count, onChanged, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: client.name, contact: client.contact || "", notes: client.notes || "" });
  const [error, setError] = useState("");

  useEffect(() => {
    setEditing(false);
    setForm({ name: client.name, contact: client.contact || "", notes: client.notes || "" });
  }, [client]);

  async function save() {
    try {
      await api(`/api/admin/vault/clients/${client.id}`, { method: "PATCH", body: form });
      setEditing(false);
      onChanged(form.name.trim());
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!confirm(`Delete client "${client.name}" and all ${count} saved logins? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/vault/clients/${client.id}`, { method: "DELETE" });
      onDeleted();
    } catch (err) {
      setError(err.message);
    }
  }

  if (editing) {
    return (
      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Client name" className={inputCls} />
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone / email" className={inputCls} />
        </div>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Notes about this client (not encrypted — no passwords here)" className={inputCls} />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={save} className={btnPrimary}>Save</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white">{client.name}</h2>
        <p className="text-xs text-slate-400">
          {count} saved {count === 1 ? "login" : "logins"}
          {client.contact && ` · ${client.contact}`}
        </p>
        {client.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{client.notes}</p>}
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </div>
      <div className="flex gap-1">
        <button type="button" onClick={() => setEditing(true)} className={iconBtn} aria-label="Edit client">
          <Pencil size={15} />
        </button>
        <button type="button" onClick={remove} className={`${iconBtn} hover:text-red-300`} aria-label="Delete client">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// --- page -------------------------------------------------------------------------

export default function VaultManager({ clients, entries, types, canSave }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null); // client id, or null for "all"
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null); // { entry? } while the add/edit form is open
  const [addingClient, setAddingClient] = useState(false);

  const typeLabel = useMemo(() => Object.fromEntries(types.map((t) => [t.value, t.label])), [types]);
  const clientById = useMemo(() => new Map(clients.map((c) => [c.id, c])), [clients]);
  const counts = useMemo(() => {
    const m = new Map();
    for (const e of entries) m.set(e.client_id, (m.get(e.client_id) || 0) + 1);
    return m;
  }, [entries]);

  const q = search.trim().toLowerCase();
  const matches = (e) =>
    !q ||
    [e.title, e.username, e.login_url, e.website_url, typeLabel[e.entry_type], clientById.get(e.client_id)?.name]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  const shown = entries.filter((e) => (selected === null || e.client_id === selected) && matches(e));
  const visibleClients = clients.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || entries.some((e) => e.client_id === c.id && matches(e))
  );
  const expiring = entries
    .filter((e) => {
      const d = daysUntil(e.expires_on);
      return d !== null && d <= EXPIRY_WARN_DAYS;
    })
    .sort((a, b) => a.expires_on.localeCompare(b.expires_on));
  const current = selected === null ? null : clientById.get(selected);

  // After a save, show the client the login (or new client) belongs to.
  function showClient(clientId) {
    setForm(null);
    setAddingClient(false);
    setSelected(clientId);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {expiring.length > 0 && (
        <div className="rounded-lg border border-amber-800 bg-amber-950/30 p-3">
          <p className="mb-2 text-sm text-amber-300">Renewals due in the next {EXPIRY_WARN_DAYS} days</p>
          <ul className="space-y-1 text-sm">
            {expiring.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setSelected(e.client_id)} className="text-slate-200 hover:underline">
                  {clientById.get(e.client_id)?.name} — {e.title}
                </button>
                <ExpiryBadge date={e.expires_on} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client, login name, username or link"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(e.target.value ? Number(e.target.value) : null)}
          className={`${inputCls} w-auto min-w-[200px]`}
          aria-label="Filter by client"
        >
          <option value="">All clients ({entries.length})</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({counts.get(c.id) || 0})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setAddingClient(true)}
          disabled={!canSave}
          className="inline-flex items-center gap-1.5 rounded-md border border-violet-700 px-3 py-2 text-sm font-medium text-violet-200 hover:bg-violet-900/40 disabled:opacity-50"
        >
          <Users size={16} /> Add client
        </button>
        <button
          type="button"
          onClick={() => setForm({})}
          disabled={!canSave || clients.length === 0}
          title={clients.length === 0 ? "Add a client first" : undefined}
          className={btnPrimary}
        >
          <Plus size={16} /> Add login
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        {/* clients = categories */}
        <aside className="h-fit rounded-lg border border-slate-800 bg-slate-900 p-2">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${selected === null ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <span className="flex items-center gap-2">
              <Users size={15} /> All clients
            </span>
            <span className="text-xs text-slate-500">{entries.length}</span>
          </button>
          <div className="mt-1 max-h-[60vh] space-y-0.5 overflow-y-auto">
            {visibleClients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${selected === c.id ? "bg-violet-900/40 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                <span className="truncate">{c.name}</span>
                <span className="ml-2 text-xs text-slate-500">{counts.get(c.id) || 0}</span>
              </button>
            ))}
            {clients.length === 0 && <p className="px-3 py-2 text-xs text-slate-500">No clients yet — click Add client.</p>}
          </div>
        </aside>

        <section className="min-w-0 space-y-3">
          {current && (
            <ClientHeader
              client={current}
              count={counts.get(current.id) || 0}
              onChanged={() => router.refresh()}
              onDeleted={() => {
                setSelected(null);
                router.refresh();
              }}
            />
          )}
          {current && canSave && (
            <button type="button" onClick={() => setForm({})} className="inline-flex items-center gap-1.5 text-sm text-violet-300 hover:underline">
              <KeyRound size={14} /> Add a login for {current.name}
            </button>
          )}
          {shown.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
              {q ? "Nothing matches your search." : "No logins saved here yet."}
            </p>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {shown.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  typeLabel={typeLabel[e.entry_type] || "Other"}
                  clientName={clientById.get(e.client_id)?.name || ""}
                  showClient={selected === null}
                  onEdit={() => setForm({ entry: e })}
                  onDeleted={() => router.refresh()}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {addingClient && <ClientForm onClose={() => setAddingClient(false)} onSaved={showClient} />}
      {form && (
        <EntryForm
          entry={form.entry}
          clientId={current?.id}
          clients={clients}
          types={types}
          onClose={() => setForm(null)}
          onSaved={showClient}
        />
      )}
    </div>
  );
}
