import { query } from "./db";
import { getSecret } from "./secrets";

export const OPENAI_MODEL = "gpt-5.4-mini";

// Calls OpenAI and returns parsed JSON. Every call is recorded in
// ai_generation_logs (status, tokens, error) so the admin can audit usage.
export async function generateJson({ jobType, system, user, inputSummary }) {
  const apiKey = await getSecret("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OpenAI API key is not set (Settings → AI).");

  const log = await query(
    "INSERT INTO ai_generation_logs (job_type, status, input_summary) VALUES (?, 'started', ?)",
    [jobType, (inputSummary || "").slice(0, 2000)]
  );
  const logId = log.insertId;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `OpenAI error ${res.status}`);

    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    await query(
      `UPDATE ai_generation_logs
       SET status = 'success', output_summary = ?, tokens_used = ?, finished_at = NOW()
       WHERE id = ?`,
      [content.slice(0, 2000), data.usage?.total_tokens || null, logId]
    );
    return parsed;
  } catch (error) {
    await query(
      "UPDATE ai_generation_logs SET status = 'failed', error_message = ?, finished_at = NOW() WHERE id = ?",
      [error.message.slice(0, 2000), logId]
    );
    throw error;
  }
}
