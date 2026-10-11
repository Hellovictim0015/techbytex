import { randomBytes, randomUUID, createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { query } from "./db";

const SESSION_COOKIE = "tbx_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const LOGIN_WINDOW_MINUTES = 15;
const LOGIN_MAX_ATTEMPTS = 8;

function hashToken(token) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret
    ? createHmac("sha256", secret).update(token).digest("hex")
    : createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : h.get("x-real-ip") || "unknown";
}

export async function isLoginRateLimited(ip) {
  const rows = await query(
    `SELECT COUNT(*) AS attempts FROM admin_audit_logs
     WHERE action = 'admin_login_failed' AND ip_address = ?
       AND created_at > (NOW() - INTERVAL ? MINUTE)`,
    [ip, LOGIN_WINDOW_MINUTES]
  );
  return rows[0].attempts >= LOGIN_MAX_ATTEMPTS;
}

export async function findAdminByEmail(email) {
  const rows = await query(
    "SELECT id, email, password_hash, name, role, is_active FROM admin_users WHERE email = ?",
    [email.trim().toLowerCase()]
  );
  return rows[0] || null;
}

export async function createSession(adminUserId, { ip, userAgent } = {}) {
  const id = randomUUID();
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await query(
    `INSERT INTO admin_sessions (id, admin_user_id, token_hash, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, adminUserId, tokenHash, ip || null, (userAgent || "").slice(0, 512), expiresAt]
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE, `${id}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { id, expiresAt };
}

export async function destroySession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) {
    const [id] = raw.split(".");
    if (id) {
      await query("UPDATE admin_sessions SET revoked_at = NOW() WHERE id = ?", [id]);
    }
  }
  jar.delete(SESSION_COOKIE);
}

// Returns the active admin user for the current request, or null.
// Safe to call from Server Components, Server Actions, and Route Handlers.
export async function getCurrentAdmin() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw || !raw.includes(".")) return null;

  const [id, token] = raw.split(".");
  if (!id || !token) return null;

  const rows = await query(
    `SELECT s.id, s.token_hash, s.expires_at, s.revoked_at,
            u.id AS user_id, u.email, u.name, u.role, u.is_active
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.id = ?`,
    [id]
  );
  const session = rows[0];
  if (!session || session.revoked_at) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) return null;
  if (!session.is_active) return null;

  const expectedHash = Buffer.from(session.token_hash, "hex");
  const actualHash = Buffer.from(hashToken(token), "hex");
  if (
    expectedHash.length !== actualHash.length ||
    !timingSafeEqual(expectedHash, actualHash)
  ) {
    return null;
  }

  query("UPDATE admin_sessions SET last_seen_at = NOW() WHERE id = ?", [id]).catch(() => {});

  return {
    id: session.user_id,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}

// Throws-free guard for use in Server Components: returns the admin or null.
// Pages/layouts under /admin should redirect("/admin/login") when this is null.
export async function requireAdmin() {
  return getCurrentAdmin();
}

export async function logAudit({
  adminUserId = null,
  actorLabel = null,
  action,
  targetType = null,
  targetId = null,
  details = null,
  ip = null,
}) {
  await query(
    `INSERT INTO admin_audit_logs (admin_user_id, actor_label, action, target_type, target_id, details, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      actorLabel,
      action,
      targetType,
      targetId,
      details ? JSON.stringify(details) : null,
      ip,
    ]
  );
}
