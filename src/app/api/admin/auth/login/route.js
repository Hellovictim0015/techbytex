import { headers } from "next/headers";
import {
  adminPasswordProblem,
  verifyPin,
  getPinAdmin,
  createSession,
  isLoginRateLimited,
  logAudit,
  getClientIp,
} from "@/app/lib/auth";

export async function POST(req) {
  const ip = await getClientIp();

  try {
    const problem = adminPasswordProblem();
    if (problem) {
      return Response.json({ success: false, error: problem }, { status: 503 });
    }
    if (await isLoginRateLimited(ip)) {
      return Response.json(
        { success: false, error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = body.password ?? body.pin;
    if (!password) {
      return Response.json({ success: false, error: "Password is required." }, { status: 400 });
    }

    if (!verifyPin(password)) {
      await logAudit({ action: "admin_login_failed", actorLabel: "password", ip });
      // A short fixed delay slows guessing without bothering a real user.
      await new Promise((r) => setTimeout(r, 800));
      return Response.json({ success: false, error: "Wrong password." }, { status: 401 });
    }

    const admin = await getPinAdmin();
    const userAgent = (await headers()).get("user-agent") || "";
    await createSession(admin.id, { ip, userAgent });
    await logAudit({
      adminUserId: admin.id,
      action: "admin_login_success",
      actorLabel: "password",
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
