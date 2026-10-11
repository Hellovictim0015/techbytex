"use client";
import { useState } from "react";

function FieldRow({ field, status, onSaved }) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  async function handleSave() {
    if (!value.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: field.key, value }),
      });
      if (res.ok) {
        setValue("");
        setJustSaved(true);
        onSaved();
        setTimeout(() => setJustSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: field.key, value: "" }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2">
      <div className="sm:w-56 shrink-0">
        <p className="text-sm text-slate-200">{field.label}</p>
        <p className="text-xs text-slate-500 font-mono">{field.key}</p>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <input
          type={field.notSecret ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={status?.configured ? status.preview : "Not set"}
          className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !value.trim()}
          className="rounded-md bg-violet-700 px-3 py-1.5 text-xs text-white hover:bg-violet-600 disabled:opacity-40"
        >
          {justSaved ? "Saved" : "Save"}
        </button>
        {status?.configured && status.source === "admin" && (
          <button
            type="button"
            onClick={handleClear}
            disabled={saving}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700 disabled:opacity-40"
          >
            Clear
          </button>
        )}
      </div>
      <span
        className={`text-xs shrink-0 rounded-full px-2 py-0.5 ${
          status?.configured
            ? "bg-emerald-900/40 text-emerald-300"
            : "bg-slate-800 text-slate-500"
        }`}
      >
        {status?.configured ? (status.source === "admin" ? "Set in admin" : "From .env") : "Not set"}
      </span>
    </div>
  );
}

function TestResults({ results }) {
  if (!results) return null;
  return (
    <ul className="mt-2 space-y-1 rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
      {results.map((r) => (
        <li key={r.name} className="flex gap-2 text-xs">
          <span className={r.ok ? "text-emerald-400" : "text-red-400"}>{r.ok ? "✓" : "✗"}</span>
          <span className="text-slate-300 shrink-0">{r.name}:</span>
          <span className={r.ok ? "text-slate-400" : "text-red-300"}>{r.message}</span>
        </li>
      ))}
    </ul>
  );
}

// Settings groups that own a Google OAuth connection, and which one.
const GROUP_CONNECTION = {
  Google: { kind: "main", connectLabel: "Connect Google" },
  "Google Business": { kind: "business", connectLabel: "Connect Business Profile account" },
};

function GroupHeader({ group, testing, onTest, connection, onDisconnect }) {
  const groupConnection = GROUP_CONNECTION[group];
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group}</h3>
      <div className="flex items-center gap-2">
        {groupConnection &&
          (connection?.connected ? (
            <>
              <span className="text-xs text-emerald-300">
                Connected{connection.email ? ` as ${connection.email}` : ""}
              </span>
              <button
                type="button"
                onClick={() => onDisconnect(groupConnection.kind)}
                className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400 hover:bg-slate-700"
              >
                Disconnect
              </button>
            </>
          ) : (
            <a
              href={`/api/google/oauth/start?kind=${groupConnection.kind}`}
              className="rounded-md bg-white px-3 py-1 text-xs font-medium text-slate-900 hover:bg-slate-200"
            >
              {groupConnection.connectLabel}
            </a>
          ))}
        <button
          type="button"
          onClick={onTest}
          disabled={testing}
          className="rounded-md border border-violet-700 px-3 py-1 text-xs text-violet-300 hover:bg-violet-900/40 disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test"}
        </button>
      </div>
    </div>
  );
}

export default function IntegrationsForm({ fields, initialStatuses, googleConnections: initialConnections }) {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [connections, setConnections] = useState(initialConnections || {});
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(null);

  async function runTest(group) {
    setTesting(group);
    try {
      const res = await fetch("/api/admin/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [group]: data.success
          ? data.results
          : [{ name: group, ok: false, message: data.error || "Test failed." }],
      }));
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [group]: [{ name: group, ok: false, message: "Could not reach the server." }],
      }));
    } finally {
      setTesting(null);
    }
  }

  async function disconnectGoogle(kind) {
    const res = await fetch("/api/google/oauth/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind }),
    });
    if (res.ok) {
      setConnections((prev) => ({ ...prev, [kind]: { connected: false } }));
      const group = Object.keys(GROUP_CONNECTION).find((g) => GROUP_CONNECTION[g].kind === kind);
      setTestResults((prev) => ({ ...prev, [group]: undefined }));
    }
  }

  async function refresh() {
    const res = await fetch("/api/admin/integrations");
    const data = await res.json();
    if (data.success) setStatuses(data.statuses);
  }

  const groups = fields.reduce((acc, field) => {
    acc[field.group] = acc[field.group] || [];
    acc[field.group].push(field);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([group, groupFields]) => (
        <div key={group}>
          <GroupHeader
            group={group}
            testing={testing === group}
            onTest={() => runTest(group)}
            connection={GROUP_CONNECTION[group] ? connections[GROUP_CONNECTION[group].kind] : null}
            onDisconnect={disconnectGoogle}
          />
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 divide-y divide-slate-800">
            {groupFields.map((field) => (
              <FieldRow
                key={field.key}
                field={field}
                status={statuses[field.key]}
                onSaved={refresh}
              />
            ))}
          </div>
          <TestResults results={testResults[group]} />
        </div>
      ))}
    </div>
  );
}
