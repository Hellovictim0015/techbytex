import Anthropic from "@anthropic-ai/sdk";

// Writes one short personal cold email for a lead with the AI provider chosen
// in Lead Outreach → Settings. Returns { subject, body }.

const EMAIL_SCHEMA = {
  type: "object",
  properties: {
    subject: { type: "string", description: "Short, specific subject line, under 70 characters" },
    body: { type: "string", description: "Plain-text email body without the subject" },
  },
  required: ["subject", "body"],
  additionalProperties: false,
};

const SYSTEM =
  "You write short, honest, personal B2B cold emails for TechByteX, a website and app development company in India. " +
  "Only mention facts given to you. Never invent results, clients, prices or statistics. " +
  'Reply with JSON: {"subject": string, "body": string}.';

// The single most useful issue to mention for this lead.
export function mainIssue(lead) {
  if (!lead.website && lead.source && lead.source !== "places") {
    // Imported / hand-added contact: we haven't looked at their site, so don't claim a problem.
    return "we have not reviewed their website yet — offer a free quick review of their website or app instead of naming a problem";
  }
  if (!lead.website) return "they have no website listed on their Google Business profile";
  const issues = Array.isArray(lead.pagespeed_issues) ? lead.pagespeed_issues : [];
  if (issues[0]) {
    return `${issues[0].title} on mobile${lead.pagespeed_score != null ? ` (Google PageSpeed mobile score ${lead.pagespeed_score}/100)` : ""}`;
  }
  if (lead.pagespeed_score != null && lead.pagespeed_score < 90) {
    return `the site scores ${lead.pagespeed_score}/100 for mobile speed on Google PageSpeed`;
  }
  return "the website could convert more mobile visitors with a faster, clearer enquiry flow";
}

export function fillPrompt(template, lead, settings) {
  const values = {
    business_name: lead.business_name,
    contact_name: lead.contact_name || "the owner",
    category: lead.category || "business",
    city: lead.city || "their area",
    country: lead.country || "",
    website: lead.website || "(no website)",
    issue: mainIssue(lead),
    from_name: (settings.from_name || "TechByteX").split(" ")[0],
  };
  return String(template).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
}

function parseEmail(text) {
  const json = JSON.parse(String(text).replace(/^```(?:json)?\s*|\s*```$/g, ""));
  const subject = String(json.subject || "").trim().slice(0, 255);
  const body = String(json.body || "").trim();
  if (!subject || !body) throw new Error("The AI reply had no subject or body.");
  return { subject, body };
}

async function withAnthropic({ apiKey, model, prompt }) {
  const client = new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });
  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 2000, // a ~150-word email plus JSON
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: EMAIL_SCHEMA } },
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });
    if (response.stop_reason === "refusal") throw new Error("The AI declined to write this email.");
    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return parseEmail(text);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) throw new Error("Anthropic API key is not valid.");
    if (error instanceof Anthropic.RateLimitError) throw new Error("Anthropic rate limit reached — try again in a minute.");
    if (error instanceof Anthropic.APIError) throw new Error(`Anthropic error ${error.status}: ${error.message}`);
    throw error;
  }
}

async function withOpenAI({ apiKey, model, prompt }) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(60000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${data?.error?.message || "request failed"}`);
  return parseEmail(data.choices?.[0]?.message?.content || "{}");
}

export async function writeEmail({ settings, prompt }) {
  if (!settings.ai_api_key) throw new Error("AI API key is not set (Lead Outreach → Settings).");
  const args = { apiKey: settings.ai_api_key, model: settings.ai_model, prompt };
  return settings.ai_provider === "openai" ? withOpenAI(args) : withAnthropic(args);
}

export async function testAiKey(settings) {
  await writeEmail({
    settings,
    prompt: 'Write a two-sentence test email to "Test Cafe" saying this is only a connection test.',
  });
}
