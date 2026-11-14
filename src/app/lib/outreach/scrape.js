import { lookup } from "dns/promises";
import net from "net";

// Finds a public business email on a company's own website: the homepage plus
// up to two contact/about pages it links to. Only public http(s) sites are
// fetched (never private / local addresses), with short timeouts and size caps.

const MAX_BYTES = 1_500_000;
const USER_AGENT = "Mozilla/5.0 (compatible; TechByteXSiteCheck/1.0; +https://www.techbytex.in)";
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/gi;
const JUNK_EMAIL = /(\.(png|jpe?g|gif|webp|svg|css|js)$)|example\.|sentry|wixpress|domain\.com|your(name|email)|@email\.|noreply|no-reply|godaddy|cloudflare/i;

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
  }
  const v = ip.toLowerCase();
  return v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("::ffff:127.");
}

async function assertPublic(url) {
  const u = new URL(url);
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("Only http(s) websites can be checked.");
  const addresses = await lookup(u.hostname, { all: true });
  if (addresses.some((a) => isPrivateIp(a.address))) throw new Error("Website points to a private address.");
}

async function fetchPage(url) {
  await assertPublic(url);
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`Website returned ${res.status}`);
  if (!/text\/html|xhtml/i.test(res.headers.get("content-type") || "")) return { html: "", finalUrl: res.url };
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    chunks.push(value);
    if (size > MAX_BYTES) {
      await reader.cancel();
      break;
    }
  }
  return { html: Buffer.concat(chunks).toString("utf8"), finalUrl: res.url };
}

function emailsIn(html) {
  const found = new Set();
  for (const m of html.matchAll(/mailto:([^"'?\s>]+)/gi)) found.add(decodeURIComponent(m[1]).toLowerCase());
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ");
  for (const m of text.match(EMAIL_RE) || []) found.add(m.toLowerCase());
  return [...found].filter((e) => !JUNK_EMAIL.test(e) && e.length <= 254);
}

function contactLinks(html, baseUrl) {
  const base = new URL(baseUrl);
  const links = new Set();
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    if (!/contact|about|reach|enquir|support/i.test(m[1])) continue;
    try {
      const u = new URL(m[1], base);
      if (u.hostname.replace(/^www\./, "") === base.hostname.replace(/^www\./, "")) links.add(u.toString());
    } catch {
      // ignore bad links
    }
  }
  return [...links].slice(0, 2);
}

// Prefers an address on the company's own domain, then info@/contact@ style ones.
function pickBest(emails, domain) {
  const score = (e) =>
    (e.endsWith(`@${domain}`) || e.endsWith(`.${domain}`) ? 10 : 0) + (/^(info|contact|hello|sales|enquiry|office)@/.test(e) ? 3 : 0);
  return [...emails].sort((a, b) => score(b) - score(a))[0] || null;
}

export async function findBusinessEmail(website) {
  const home = await fetchPage(website);
  const domain = new URL(home.finalUrl || website).hostname.replace(/^www\./, "");
  let emails = emailsIn(home.html);
  let source = home.finalUrl || website;
  if (!emails.some((e) => e.endsWith(domain))) {
    for (const link of contactLinks(home.html, source)) {
      try {
        const page = await fetchPage(link);
        const found = emailsIn(page.html);
        if (found.length) {
          emails = [...emails, ...found];
          source = link;
          if (found.some((e) => e.endsWith(domain))) break;
        }
      } catch {
        // a broken contact page is not fatal
      }
    }
  }
  return { email: pickBest(emails, domain), source };
}
