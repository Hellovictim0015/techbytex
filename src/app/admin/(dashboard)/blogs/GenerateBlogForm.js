"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIORITY_STYLES = {
  high: "bg-red-900/40 text-red-300",
  medium: "bg-amber-900/40 text-amber-300",
  low: "bg-slate-800 text-slate-400",
};

function TopicSuggestions({ suggestions, busy, onGenerate, onRefresh, refreshing }) {
  return (
    <div className="space-y-3 border-t border-slate-800 pt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-sm text-white">Best topics to rank</p>
          <p className="text-xs text-slate-500">
            AI picks these from your Search Console keywords, Analytics pages and open AI
            recommendations. Topics you have already written are left out.
            {suggestions?.createdAt && ` Last updated ${suggestions.createdAt}.`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing || busy}
          className="rounded-md border border-violet-700 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-900/40 disabled:opacity-50"
        >
          {refreshing ? "Analyzing data (~30s)..." : suggestions ? "Refresh suggestions" : "Suggest best topics"}
        </button>
      </div>

      {suggestions?.summary && <p className="text-xs text-slate-400">{suggestions.summary}</p>}

      {suggestions && suggestions.topics.length === 0 && (
        <p className="text-xs text-slate-500">All suggested topics have been written. Refresh for new ideas.</p>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {suggestions?.topics.map((t) => (
          <div key={t.title} className="rounded-md border border-slate-800 bg-slate-950/60 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">{t.title}</p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.low}`}>
                {t.priority}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              <span className="text-slate-500">Keyword:</span> {t.target_keyword}
              {t.search_intent && <span className="text-slate-500"> · {t.search_intent}</span>}
              {t.supports_page && <span className="text-slate-500"> · helps {t.supports_page}</span>}
            </p>
            <p className="text-xs text-slate-500">{t.reason}</p>
            <button
              type="button"
              disabled={busy}
              onClick={() => onGenerate(t)}
              className="rounded-md bg-violet-700 px-3 py-1 text-xs text-white hover:bg-violet-600 disabled:opacity-50"
            >
              Generate this
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GenerateBlogForm({ suggestedTopic, initialSuggestions }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [refreshing, setRefreshing] = useState(false);

  async function generate(payload) {
    setBusy(true);
    setMessage({ ok: true, text: `Writing "${payload.topic || suggestedTopic}" + image (1–2 min)...` });
    try {
      const res = await fetch("/api/admin/blogs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ ok: false, text: data.error || "Generation failed." });
      } else {
        const r = data.result;
        setMessage({
          ok: true,
          text: `Created "${r.title}" (${r.words} words${r.image ? ", with image" : ", no image"}) as ${r.status}.`,
          href: `/admin/blogs/${r.postId}`,
        });
        setTopic("");
        // Hide the topic we just used from the suggestion list.
        setSuggestions((prev) =>
          prev ? { ...prev, topics: prev.topics.filter((t) => t.title !== payload.topic) } : prev
        );
        router.refresh();
      }
    } catch {
      setMessage({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(false);
    }
  }

  async function refreshSuggestions() {
    setRefreshing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/blogs/suggest-topics", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ ok: false, text: data.error || "Could not get suggestions." });
      } else {
        setSuggestions({ ...data.result, createdAt: "just now" });
      }
    } catch {
      setMessage({ ok: false, text: "Could not reach the server." });
    } finally {
      setRefreshing(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    generate({ topic });
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <p className="text-sm text-white">Generate a new blog post</p>
          <p className="text-xs text-slate-500">
            Type your own topic, pick one of the suggestions below, or leave it empty to use the next
            content-calendar topic
            {suggestedTopic ? (
              <>
                : <span className="text-slate-300">{suggestedTopic}</span>
              </>
            ) : (
              "."
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={suggestedTopic || "e.g. Website development cost in Raipur"}
            disabled={busy}
            className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50"
          >
            {busy ? "Generating..." : "Generate blog"}
          </button>
        </div>
        {message && (
          <p className={`text-xs ${message.ok ? "text-emerald-300" : "text-red-300"}`}>
            {message.text}{" "}
            {message.href && (
              <a href={message.href} className="underline">
                Review it →
              </a>
            )}
          </p>
        )}
      </form>

      <TopicSuggestions
        suggestions={suggestions}
        busy={busy}
        refreshing={refreshing}
        onRefresh={refreshSuggestions}
        onGenerate={(t) =>
          generate({
            topic: t.title,
            targetKeyword: t.target_keyword,
            secondaryKeywords: t.secondary_keywords,
            angle: t.angle,
          })
        }
      />
    </div>
  );
}
