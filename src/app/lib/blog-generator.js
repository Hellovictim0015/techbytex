import { query } from "./db";
import { getSecret } from "./secrets";
import { generateJson } from "./ai";
import { saveUpload } from "./uploads";
import { sanitizeHtml, stripHtml } from "./sanitize-html";
import { blogTopics } from "../data/blogTopics";
import { blogPosts as staticPosts, categories as blogCategories } from "../data/blogData";
import { services } from "../data/services";
import { cities } from "../data/cities";
import { getLocationLinksForBlogs } from "./location-pages";

export const IMAGE_MODEL = "gpt-image-1";
const FALLBACK_IMAGE_MODEL = "gpt-image-1-mini";
const IMAGE_QUALITY = "high";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function usedSlugs() {
  const rows = await query("SELECT slug FROM ai_blog_posts");
  return new Set([...staticPosts.map((p) => p.slug), ...rows.map((r) => r.slug)]);
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "for", "to", "of", "in", "on", "with", "how", "what", "why",
  "your", "you", "is", "are", "vs", "guide", "complete", "best", "top", "india", "2025", "2026", "2027",
]);

function titleWords(title) {
  return new Set(
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

// Jaccard overlap of meaningful title words: "Business Website Development:
// Complete Checklist for 2026" vs "... Complete 2026 Checklist" scores 1.0.
export function titleSimilarity(a, b) {
  const wa = titleWords(a);
  const wb = titleWords(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  const shared = [...wa].filter((w) => wb.has(w)).length;
  return shared / new Set([...wa, ...wb]).size;
}

// Every post title that already exists (any status except rejected).
export async function existingPostTitles() {
  const rows = await query("SELECT title, status FROM ai_blog_posts WHERE status <> 'rejected'");
  return [...new Set([...rows.map((r) => r.title), ...staticPosts.map((p) => p.title)])];
}

export async function findSimilarPost(title, threshold = 0.6) {
  const titles = await existingPostTitles();
  let best = null;
  for (const existing of titles) {
    const score = titleSimilarity(title, existing);
    if (score >= threshold && (!best || score > best.score)) best = { title: existing, score };
  }
  return best;
}

// Next planned topic from the content calendar that has no post yet.
export async function getNextSuggestedTopic() {
  const used = await usedSlugs();
  const titles = await existingPostTitles();
  return (
    blogTopics.find(
      (t) =>
        t.status !== "published" &&
        !used.has(t.slug) &&
        !titles.some((existing) => titleSimilarity(t.title, existing) >= 0.6)
    ) || null
  );
}

async function uniqueSlug(base) {
  const used = await usedSlugs();
  let slug = base || `article-${Date.now()}`;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

async function createJob(topic) {
  const [{ next }] = await query(
    "SELECT COALESCE(MAX(job_number), 0) + 1 AS next FROM blog_ai_jobs WHERE job_date = CURDATE()"
  );
  const result = await query(
    `INSERT INTO blog_ai_jobs (job_date, job_number, status, topic, started_at)
     VALUES (CURDATE(), ?, 'running', ?, NOW())`,
    [Math.min(next, 255), topic.slice(0, 512)]
  );
  return result.insertId;
}

async function logStep(jobId, step, status, message = null) {
  await query(
    "INSERT INTO blog_generation_logs (job_id, step, status, message) VALUES (?, ?, ?, ?)",
    [jobId, step, status, message ? String(message).slice(0, 2000) : null]
  );
}

// Appended to every featured-image prompt so posts get modern, realistic
// photos instead of dated clip-art style illustrations.
const PHOTO_STYLE = `Style: photorealistic modern editorial stock photograph. Real people — Indian professionals with natural, varied looks in contemporary business-casual clothing — in a bright, modern, uncluttered setting with current devices (slim laptops, smartphones, large monitors). Shot on a full-frame camera, 35mm lens, soft natural window light, shallow depth of field, true-to-life skin texture and realistic hands, clean neutral colour grading, 3:2 landscape composition.
Avoid: illustration, cartoon, vector art, 3D render, clip art, vintage or retro look, oversaturated colours, distorted faces or hands, and any text, letters, numbers, logos or watermarks (screens show abstract interfaces only).`;

// Returns { b64, ext } for one featured image. Falls back to the cheaper model
// if the account has no access to IMAGE_MODEL.
export async function generateImage(scene) {
  const apiKey = await getSecret("OPENAI_API_KEY");
  const request = (model) =>
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: `${scene}\n\n${PHOTO_STYLE}`,
        size: "1536x1024",
        quality: IMAGE_QUALITY,
        output_format: "webp",
        output_compression: 85,
        n: 1,
      }),
    });

  let res = await request(IMAGE_MODEL);
  let data = await res.json();
  if (!res.ok && /model|access|verif/i.test(data?.error?.message || "")) {
    res = await request(FALLBACK_IMAGE_MODEL);
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.error?.message || `Image generation failed (${res.status})`);
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image API returned no image data.");
  return { b64, ext: "webp" };
}

export function imageSceneForPost({ title, excerpt }) {
  return `A realistic photo that fits a blog article titled "${title}". ${excerpt || ""} Show people actually doing the work the article is about, in a modern Indian business setting.`;
}

const INTERNAL_LINKS = [
  ...services.map((s) => ({ path: `/services/${s.slug}`, label: s.title })),
  ...cities.map((c) => ({ path: `/web-development-${c.slug}`, label: `Website development in ${c.name}` })),
  { path: "/contact", label: "Contact TechByteX" },
  { path: "/book-demo", label: "Book a free consultation" },
];

// Generates one blog post end-to-end and saves it to ai_blog_posts.
// Status is 'draft' unless the admin enabled auto-publish in Settings.
export async function generateBlogPost({
  topic: requestedTopic,
  targetKeyword,
  secondaryKeywords,
  angle,
  allowSimilar = false,
} = {}) {
  const calendarTopic = requestedTopic ? null : await getNextSuggestedTopic();
  const topicTitle = requestedTopic?.trim() || calendarTopic?.title;
  if (!topicTitle) throw new Error("No topic given and the content calendar has no unused topics left.");

  // Guard against writing the same article twice (hurts SEO as duplicate content).
  if (!allowSimilar) {
    const similar = await findSimilarPost(topicTitle);
    if (similar) {
      throw new Error(
        `A very similar post already exists: "${similar.title}". Pick a different topic.`
      );
    }
  }

  const jobId = await createJob(topicTitle);
  try {
    await logStep(jobId, "topic", "success", topicTitle);

    const categories = blogCategories.filter((c) => c !== "All");
    // Admin-created city pages (e.g. Indore) get links from new articles too.
    const internalLinks = [
      ...INTERNAL_LINKS,
      ...(await getLocationLinksForBlogs()),
      { path: "/locations", label: "Locations we serve" },
    ];
    const system = `You are a senior content writer for TechByteX, a website, app, ecommerce, AI and custom software development company based in Dalli Rajhara, Chhattisgarh, India (phone +91 8827219873, website https://www.techbytex.in). You write genuinely helpful, accurate SEO articles for Indian business owners and startup founders.
Return ONLY JSON with these keys:
{"title": string (<= 70 chars), "slug": string (lowercase-hyphenated, <= 70 chars), "excerpt": string (1-2 sentences, <= 200 chars), "category": one of ${JSON.stringify(categories)}, "keywords": string[] (4-8), "meta_title": string (<= 60 chars, ends with "| TechByteX"), "meta_description": string (140-160 chars, includes a call to action), "content_html": string, "faq": [{"q": string, "a": string}] (4-5 items), "image_prompt": string, "image_alt": string (<= 120 chars)}
Rules for content_html:
- 1,200-1,800 words. Use only <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a href>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>. No <h1>, no inline styles, no scripts, no images.
- Start with a short intro paragraph (no heading). Use clear H2 sections and H3 sub-sections. Practical, specific, Indian context (₹ pricing ranges are fine when realistic and clearly approximate).
- Add 2-4 internal links, chosen only from this list (use the exact path); prefer a city page only when the article is about that place: ${JSON.stringify(internalLinks)}.
- End with a short section inviting the reader to contact TechByteX.
- Do NOT invent statistics, studies, client names, testimonials, awards or reviews. Do NOT put the FAQ inside content_html (it goes in "faq").
Rules for image_prompt: describe ONE specific, realistic photo scene that matches this article — who is in it (e.g. a young Indian shop owner, a developer and a client), what they are doing, where (a modern office, clinic, retail store, co-working space) and 1-2 key objects. 2-3 plain sentences. Do not describe the art style (a photorealistic style is added automatically) and do not ask for any text in the image.`;

    const user = JSON.stringify({
      topic: topicTitle,
      targetKeyword: targetKeyword || calendarTopic?.targetKeyword,
      secondaryKeywords: secondaryKeywords || calendarTopic?.secondaryKeywords,
      angle,
      suggestedOutline: calendarTopic?.outline,
      faqSeeds: calendarTopic?.faqs,
    });

    const draft = await generateJson({
      jobType: "blog_generation",
      system,
      user,
      inputSummary: `Blog: ${topicTitle}`,
    });
    const content = sanitizeHtml(draft.content_html || "");
    const words = stripHtml(content).split(" ").length;
    if (!draft.title || words < 300) {
      throw new Error(`AI returned an incomplete article (${words} words).`);
    }
    await logStep(jobId, "draft", "success", `${words} words`);

    const slug = await uniqueSlug(slugify(calendarTopic?.slug || draft.slug || draft.title));

    let imageUrl = null;
    try {
      const { b64, ext } = await generateImage(
        draft.image_prompt || imageSceneForPost({ title: draft.title, excerpt: draft.excerpt })
      );
      imageUrl = await saveUpload(Buffer.from(b64, "base64"), { folder: "blog", ext, name: slug });
      await logStep(jobId, "image", "success", imageUrl);
    } catch (error) {
      // A missing image shouldn't throw away a good article — the default OG image is used instead.
      await logStep(jobId, "image", "failed", error.message);
    }

    const faq = (Array.isArray(draft.faq) ? draft.faq : [])
      .filter((f) => f?.q && f?.a)
      .map((f) => ({ q: stripHtml(f.q), a: stripHtml(f.a) }));
    const settings = await query("SELECT setting_value FROM ai_settings WHERE setting_key = 'auto_publish_blogs'");
    const autoPublish = settings[0]?.setting_value === true;

    const result = await query(
      `INSERT INTO ai_blog_posts
         (slug, title, excerpt, content, category, keywords, meta_title, meta_description, faq,
          featured_image_url, featured_image_alt, status, job_id, generated_by, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        stripHtml(draft.title).slice(0, 512),
        stripHtml(draft.excerpt || "").slice(0, 1000),
        content,
        categories.includes(draft.category) ? draft.category : "Web Development",
        JSON.stringify((draft.keywords || []).map(String).slice(0, 10)),
        stripHtml(draft.meta_title || draft.title).slice(0, 255),
        stripHtml(draft.meta_description || draft.excerpt || "").slice(0, 512),
        JSON.stringify(faq),
        imageUrl,
        stripHtml(draft.image_alt || draft.title).slice(0, 512),
        autoPublish ? "published" : "draft",
        jobId,
        "ai",
        autoPublish ? new Date() : null,
      ]
    );

    await logStep(jobId, "save", "success", `ai_blog_posts #${result.insertId} (${autoPublish ? "published" : "draft"})`);
    await query(
      "UPDATE blog_ai_jobs SET status = 'completed', blog_slug = ?, completed_at = NOW() WHERE id = ?",
      [slug, jobId]
    );
    return { postId: result.insertId, jobId, slug, title: draft.title, words, image: Boolean(imageUrl), status: autoPublish ? "published" : "draft" };
  } catch (error) {
    await logStep(jobId, "error", "failed", error.message).catch(() => {});
    await query(
      "UPDATE blog_ai_jobs SET status = 'failed', error_message = ?, completed_at = NOW() WHERE id = ?",
      [error.message.slice(0, 2000), jobId]
    ).catch(() => {});
    throw error;
  }
}
