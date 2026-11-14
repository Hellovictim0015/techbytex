"use client";
import { useState } from "react";

export default function UnsubscribeButton({ token }) {
  const [state, setState] = useState("idle"); // idle | busy | done | error

  async function unsubscribe() {
    setState("busy");
    const res = await fetch(`/api/unsubscribe/${token}`, { method: "POST" }).catch(() => null);
    setState(res?.ok ? "done" : "error");
  }

  if (state === "done") return <p className="mt-6 font-semibold text-green-700">Done — you will not receive any more emails from us.</p>;
  return (
    <>
      <button
        type="button"
        onClick={unsubscribe}
        disabled={state === "busy"}
        className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white disabled:opacity-50"
      >
        {state === "busy" ? "Unsubscribing..." : "Yes, unsubscribe me"}
      </button>
      {state === "error" && <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again.</p>}
    </>
  );
}
