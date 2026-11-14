import { randomBytes } from "crypto";
import { query, withTransaction } from "./db";
import { LEAD_STATUSES } from "./lead-status";

// Admin → Lead Assign. The admin adds leads by hand and hands each one to a
// marketing team member. Every member has a private link (/team/<token>)
// that shows only their own leads, where they update the status and note
// what the client said after a call.

export { LEAD_STATUSES };
const STATUS_VALUES = new Set(LEAD_STATUSES.map((s) => s.value));
export const MAX_LEADS_PER_SAVE = 100;

const text = (v, max) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};

function phone(v) {
  const s = text(v, 20);
  if (!s) return null;
  if (!/^[+\d][\d\s-]{6,19}$/.test(s)) throw new Error(`Not a valid phone number: ${s}`);
  return s;
}

// Accepts "example.com" and adds https://; only http(s) links are kept.
function url(v) {
  const s = text(v, 1024);
  if (!s) return null;
  try {
    const parsed = new URL(/^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    return parsed.toString();
  } catch {
    throw new Error(`Not a valid website link: ${s}`);
  }
}

const newToken = () => randomBytes(32).toString("base64url"); // 43 characters

// ---------------------------------------------------------------------------
// Team members
// ---------------------------------------------------------------------------

export async function listMembers() {
  return query(
    `SELECT m.id, m.name, m.phone, m.access_token, m.is_active, m.created_at,
            COUNT(l.id) AS total,
            COALESCE(SUM(l.status IN ('new','call_done','follow_up')), 0) AS open_leads,
            COALESCE(SUM(l.status = 'converted'), 0) AS converted
     FROM team_members m LEFT JOIN sales_leads l ON l.assigned_to = m.id
     GROUP BY m.id ORDER BY m.is_active DESC, m.name`
  );
}

export async function createMember(body) {
  const name = text(body.name, 120);
  if (!name) throw new Error("Enter the team member's name.");
  const result = await query("INSERT INTO team_members (name, phone, access_token) VALUES (?, ?, ?)", [
    name,
    phone(body.phone),
    newToken(),
  ]);
  return { id: result.insertId };
}

// { name, phone, isActive, newLink: true } — a new link makes the old one stop working.
export async function updateMember(id, body) {
  const cols = {};
  if (Object.hasOwn(body, "name")) {
    cols.name = text(body.name, 120);
    if (!cols.name) throw new Error("Name cannot be empty.");
  }
  if (Object.hasOwn(body, "phone")) cols.phone = phone(body.phone);
  if (Object.hasOwn(body, "isActive")) cols.is_active = body.isActive ? 1 : 0;
  if (body.newLink) cols.access_token = newToken();
  const keys = Object.keys(cols);
  if (keys.length === 0) return;
  await query(`UPDATE team_members SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`, [
    ...keys.map((k) => cols[k]),
    id,
  ]);
}

// Their leads stay, unassigned.
export async function deleteMember(id) {
  await query("DELETE FROM team_members WHERE id = ?", [id]);
}

// The member a private link belongs to (active members only), or null.
export async function memberByToken(token) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(String(token || ""))) return null;
  const rows = await query("SELECT id, name FROM team_members WHERE access_token = ? AND is_active = 1", [token]);
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

const LEAD_COLUMNS = `l.id, l.name, l.phone, l.business, l.city, l.website_url, l.requirement,
  l.assigned_to, l.status, l.created_at, l.updated_at`;

async function withHistory(leads) {
  if (leads.length === 0) return leads;
  const updates = await query(
    `SELECT id, lead_id, status, note, actor_name, created_at FROM sales_lead_updates
     WHERE lead_id IN (${leads.map(() => "?").join(",")}) ORDER BY id DESC`,
    leads.map((l) => l.id)
  );
  return leads.map((l) => ({ ...l, history: updates.filter((u) => u.lead_id === l.id) }));
}

export async function listLeads() {
  const leads = await query(`SELECT ${LEAD_COLUMNS} FROM sales_leads l ORDER BY l.id DESC LIMIT 1000`);
  return withHistory(leads);
}

export async function leadsForMember(memberId) {
  const leads = await query(
    `SELECT ${LEAD_COLUMNS} FROM sales_leads l WHERE l.assigned_to = ?
     ORDER BY FIELD(l.status, 'new', 'follow_up', 'call_done', 'converted', 'cancelled'), l.id DESC`,
    [memberId]
  );
  return withHistory(leads);
}

function leadColumns(row, { partial }) {
  const has = (k) => !partial || Object.hasOwn(row, k);
  const cols = {};
  if (has("name")) {
    cols.name = text(row.name, 255);
    if (!cols.name) throw new Error("Every lead needs a name.");
  }
  if (has("phone")) cols.phone = phone(row.phone);
  if (has("business")) cols.business = text(row.business, 255);
  if (has("city")) cols.city = text(row.city, 120);
  if (has("websiteUrl")) cols.website_url = url(row.websiteUrl);
  if (has("requirement")) cols.requirement = text(row.requirement, 5000);
  if (has("assignedTo")) cols.assigned_to = Number(row.assignedTo) > 0 ? Number(row.assignedTo) : null;
  return cols;
}

// Saves several leads at once (the admin's "add 10–15 leads" table).
export async function createLeads(rows, adminUserId) {
  const list = (Array.isArray(rows) ? rows : []).filter((r) => text(r?.name, 255) || text(r?.phone, 20));
  if (list.length === 0) throw new Error("Fill in at least one lead.");
  if (list.length > MAX_LEADS_PER_SAVE) throw new Error(`Add at most ${MAX_LEADS_PER_SAVE} leads at a time.`);
  const prepared = list.map((row, i) => {
    try {
      return leadColumns(row, { partial: false });
    } catch (error) {
      throw new Error(`Row ${i + 1}: ${error.message}`);
    }
  });
  return withTransaction(async (conn) => {
    const ids = [];
    for (const cols of prepared) {
      cols.created_by = adminUserId;
      const keys = Object.keys(cols);
      const [result] = await conn.execute(
        `INSERT INTO sales_leads (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
        keys.map((k) => cols[k])
      );
      ids.push(result.insertId);
    }
    return ids;
  });
}

// Admin edit: any lead field, plus optional { status, note }.
export async function updateLead(id, body, actorName) {
  const cols = leadColumns(body, { partial: true });
  await withTransaction(async (conn) => {
    const keys = Object.keys(cols);
    if (keys.length > 0) {
      const [result] = await conn.execute(
        `UPDATE sales_leads SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
        [...keys.map((k) => cols[k]), id]
      );
      if (result.affectedRows === 0) throw new Error("Lead not found.");
    }
    await recordUpdate(conn, id, body, actorName);
  });
}

// A status change and/or call note from the admin or a team member.
async function recordUpdate(conn, leadId, { status, note }, actorName) {
  const cleanNote = text(note, 2000);
  const newStatus = status === undefined || status === null || status === "" ? null : status;
  if (newStatus !== null && !STATUS_VALUES.has(newStatus)) throw new Error("Unknown status.");
  if (newStatus === null && !cleanNote) return;
  if (newStatus !== null) {
    await conn.execute("UPDATE sales_leads SET status = ? WHERE id = ?", [newStatus, leadId]);
  }
  await conn.execute("INSERT INTO sales_lead_updates (lead_id, status, note, actor_name) VALUES (?, ?, ?, ?)", [
    leadId,
    newStatus,
    cleanNote,
    actorName,
  ]);
}

// Team member update through their private link — only their own leads.
export async function updateLeadAsMember(member, leadId, body) {
  await withTransaction(async (conn) => {
    const [rows] = await conn.execute("SELECT id FROM sales_leads WHERE id = ? AND assigned_to = ?", [
      leadId,
      member.id,
    ]);
    if (!rows[0]) throw new Error("This lead is not assigned to you.");
    if (!body.status && !text(body.note, 2000)) throw new Error("Pick a status or write what the client said.");
    await recordUpdate(conn, leadId, body, member.name);
  });
}

export async function deleteLead(id) {
  await query("DELETE FROM sales_leads WHERE id = ?", [id]);
}
