import { randomBytes, createHash, createCipheriv, createDecipheriv } from "crypto";
import { query, withTransaction } from "./db";

// Admin → Client Vault. Passwords and notes are encrypted with AES-256-GCM
// using VAULT_KEY from the server env file. VAULT_KEY is separate from
// ADMIN_SESSION_SECRET so rotating sessions never makes saved logins
// unreadable — and losing VAULT_KEY means losing every saved password, so
// keep a copy of it somewhere safe.

export const ENTRY_TYPES = [
  { value: "website", label: "Website admin" },
  { value: "hosting", label: "Hosting / cPanel" },
  { value: "domain", label: "Domain registrar" },
  { value: "server", label: "Server / SSH / FTP" },
  { value: "database", label: "Database" },
  { value: "email", label: "Email" },
  { value: "google", label: "Google (Analytics, Search Console, GBP)" },
  { value: "social", label: "Social media" },
  { value: "payment", label: "Payment gateway" },
  { value: "app_store", label: "App store / Play Console" },
  { value: "other", label: "Other" },
];
const TYPE_VALUES = new Set(ENTRY_TYPES.map((t) => t.value));
const MIN_KEY_LENGTH = 32;

export function vaultKeyProblem() {
  const key = process.env.VAULT_KEY || "";
  if (!key) return "VAULT_KEY is not set in the server env file.";
  if (key.length < MIN_KEY_LENGTH) return `VAULT_KEY must be at least ${MIN_KEY_LENGTH} characters.`;
  return null;
}

function key() {
  const problem = vaultKeyProblem();
  if (problem) throw new Error(problem);
  return createHash("sha256").update(process.env.VAULT_KEY).digest();
}

// "v1:<iv>:<tag>:<ciphertext>" (hex) — one column, versioned for later changes.
function encrypt(plaintext) {
  if (!plaintext) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(String(plaintext), "utf8"), cipher.final()]);
  return ["v1", iv.toString("hex"), cipher.getAuthTag().toString("hex"), data.toString("hex")].join(":");
}

function decrypt(stored) {
  if (!stored) return "";
  const [version, iv, tag, data] = String(stored).split(":");
  if (version !== "v1") throw new Error("Unknown vault format.");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(data, "hex")), decipher.final()]).toString("utf8");
}

const text = (v, max) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};

// Accepts "example.com" and adds https://; rejects anything that is not http(s).
function url(v) {
  const s = text(v, 1024);
  if (!s) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  let parsed;
  try {
    parsed = new URL(withScheme);
  } catch {
    throw new Error(`Not a valid link: ${s}`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`Only http(s) links are allowed: ${s}`);
  return parsed.toString();
}

function date(v) {
  const s = text(v, 10);
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error("Renewal date must be YYYY-MM-DD.");
  return s;
}

// ---------------------------------------------------------------------------
// Reading (never returns secrets)
// ---------------------------------------------------------------------------

export async function getVault() {
  const [clients, entries] = await Promise.all([
    query("SELECT id, name, contact, notes, created_at, updated_at FROM vault_clients ORDER BY name"),
    query(
      `SELECT id, client_id, entry_type, title, login_url, website_url, username,
              password_enc IS NOT NULL AS has_password, notes_enc IS NOT NULL AS has_notes,
              DATE_FORMAT(expires_on, '%Y-%m-%d') AS expires_on, last_revealed_at, created_at, updated_at
       FROM vault_entries ORDER BY title`
    ),
  ]);
  return {
    clients,
    entries: entries.map((e) => ({ ...e, has_password: Boolean(e.has_password), has_notes: Boolean(e.has_notes) })),
  };
}

// The password and notes of one entry, for the admin who asked. Logged by the caller.
export async function revealEntry(id) {
  const rows = await query("SELECT password_enc, notes_enc FROM vault_entries WHERE id = ?", [id]);
  if (!rows[0]) throw new Error("Entry not found.");
  const result = { password: decrypt(rows[0].password_enc), notes: decrypt(rows[0].notes_enc) };
  await query("UPDATE vault_entries SET last_revealed_at = NOW() WHERE id = ?", [id]);
  return result;
}

// ---------------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------------

// Clients are created first (Add client); every login is then saved under
// one of them, picked from a dropdown. The client is the "category".
export async function createClient(body) {
  const name = text(body.name, 191);
  if (!name) throw new Error("Enter the client name.");
  const existing = await query("SELECT id FROM vault_clients WHERE LOWER(name) = LOWER(?)", [name]);
  if (existing[0]) throw new Error(`A client named "${name}" already exists.`);
  const result = await query("INSERT INTO vault_clients (name, contact, notes) VALUES (?, ?, ?)", [
    name,
    text(body.contact, 255),
    text(body.notes, 5000),
  ]);
  return { id: result.insertId };
}

async function existingClientId(conn, value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Pick the client this login belongs to.");
  const [rows] = await conn.execute("SELECT id FROM vault_clients WHERE id = ?", [id]);
  if (!rows[0]) throw new Error("That client no longer exists.");
  return id;
}

function entryColumns(body, { partial }) {
  const cols = {};
  const has = (k) => !partial || Object.hasOwn(body, k);
  if (has("title")) {
    cols.title = text(body.title, 255);
    if (!cols.title) throw new Error("Give the login a name, e.g. \"WordPress admin\".");
  }
  if (has("entryType")) cols.entry_type = TYPE_VALUES.has(body.entryType) ? body.entryType : "other";
  if (has("loginUrl")) cols.login_url = url(body.loginUrl);
  if (has("websiteUrl")) cols.website_url = url(body.websiteUrl);
  if (has("username")) cols.username = text(body.username, 255);
  if (has("expiresOn")) cols.expires_on = date(body.expiresOn);
  // Secrets change only when sent; an empty string clears them.
  if (Object.hasOwn(body, "password")) cols.password_enc = encrypt(String(body.password ?? "").slice(0, 2000));
  if (Object.hasOwn(body, "notes")) cols.notes_enc = encrypt(String(body.notes ?? "").trim().slice(0, 5000));
  return cols;
}

export async function createEntry(body, adminUserId) {
  const cols = entryColumns(body, { partial: false });
  return withTransaction(async (conn) => {
    cols.client_id = await existingClientId(conn, body.clientId);
    cols.created_by = adminUserId;
    const keys = Object.keys(cols);
    const [result] = await conn.execute(
      `INSERT INTO vault_entries (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
      keys.map((k) => cols[k] ?? null)
    );
    return { id: result.insertId, clientId: cols.client_id };
  });
}

export async function updateEntry(id, body) {
  const cols = entryColumns(body, { partial: true });
  return withTransaction(async (conn) => {
    if (Object.hasOwn(body, "clientId")) cols.client_id = await existingClientId(conn, body.clientId);
    const keys = Object.keys(cols);
    if (keys.length === 0) return;
    const [result] = await conn.execute(
      `UPDATE vault_entries SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
      [...keys.map((k) => cols[k] ?? null), id]
    );
    if (result.affectedRows === 0) throw new Error("Entry not found.");
  });
}

export async function deleteEntry(id) {
  await query("DELETE FROM vault_entries WHERE id = ?", [id]);
}

export async function updateClient(id, body) {
  const name = text(body.name, 191);
  if (!name) throw new Error("Client name cannot be empty.");
  try {
    await query("UPDATE vault_clients SET name = ?, contact = ?, notes = ? WHERE id = ?", [
      name,
      text(body.contact, 255),
      text(body.notes, 5000),
      id,
    ]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") throw new Error(`A client named "${name}" already exists.`);
    throw error;
  }
}

// Deletes the client and every login saved under it.
export async function deleteClient(id) {
  await query("DELETE FROM vault_clients WHERE id = ?", [id]);
}
