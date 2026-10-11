import { headers } from "next/headers";
import {
  findAdminByEmail,
  verifyPassword,
  createSession,
  isLoginRateLimited,
  logAudit,
  getClientIp,
} from "@/app/lib/auth";

export async function POST(req) {
  const ip = await getClientIp();

  try {
    if (await isLoginRateLimited(ip)) {
      return Response.json(
        { success: false, error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await findAdminByEmail(email);
    const valid = admin && admin.is_active && (await verifyPassword(password, admin.password_hash));

    if (!valid) {
      await logAudit({
        action: "admin_login_failed",
        actorLabel: String(email).slice(0, 255),
        ip,
      });
      return Response.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userAgent = (await headers()).get("user-agent") || "";
    await createSession(admin.id, { ip, userAgent });
    await logAudit({
      adminUserId: admin.id,
      action: "admin_login_success",
      ip,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
