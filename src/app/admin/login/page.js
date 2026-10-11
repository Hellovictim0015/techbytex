import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login | TechByteX",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">TechByteX Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage SEO, analytics, and AI tools.</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
