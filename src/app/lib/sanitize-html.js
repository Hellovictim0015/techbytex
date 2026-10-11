// Allowlist sanitizer for AI-written article HTML before it is stored or
// rendered with dangerouslySetInnerHTML. Unknown tags are dropped (their text
// is kept), every attribute except a safe <a href> is removed, and
// script/style/iframe blocks are deleted along with their contents.
const ALLOWED_TAGS = new Set([
  "h2", "h3", "h4", "p", "ul", "ol", "li", "strong", "em", "b", "i", "a",
  "blockquote", "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "br", "hr",
]);

function safeHref(attrs) {
  const href = attrs.match(/\shref\s*=\s*"([^"]*)"/i)?.[1] ?? attrs.match(/\shref\s*=\s*'([^']*)'/i)?.[1];
  if (!href) return null;
  const value = href.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(mailto|tel):/i.test(value)) return value;
  return null;
}

export function sanitizeHtml(html = "") {
  return String(html)
    .replace(/<(script|style|iframe|object|embed|noscript|template)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (tag, name, attrs) => {
      const lower = name.toLowerCase();
      if (!ALLOWED_TAGS.has(lower)) return "";
      if (tag.startsWith("</")) return `</${lower}>`;
      if (lower === "a") {
        const href = safeHref(attrs);
        if (!href) return "<a>";
        const external = /^https?:\/\//i.test(href) && !href.includes("techbytex.in");
        return external
          ? `<a href="${href.replace(/"/g, "&quot;")}" rel="noopener nofollow" target="_blank">`
          : `<a href="${href.replace(/"/g, "&quot;")}">`;
      }
      return `<${lower}>`;
    });
}

export function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
