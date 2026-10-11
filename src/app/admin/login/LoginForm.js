"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      const next = searchParams.get("next") || "/admin/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoComplete="current-password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
