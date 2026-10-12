import { headers } from "next/headers";
import {
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
    if (await isLoginRateLimited(ip)) {
      return Response.json(
        { success: false, error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    const { pin } = await req.json();
    if (!pin) {
      return Response.json({ success: false, error: "PIN is required." }, { status: 400 });
    }

    if (!verifyPin(pin)) {
      await logAudit({ action: "admin_login_failed", actorLabel: "pin", ip });
      return Response.json({ success: false, error: "Wrong PIN." }, { status: 401 });
    }

    const admin = await getPinAdmin();
    const userAgent = (await headers()).get("user-agent") || "";
    await createSession(admin.id, { ip, userAgent });
    await logAudit({
      adminUserId: admin.id,
      action: "admin_login_success",
      actorLabel: "pin",
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
