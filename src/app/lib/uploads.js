import { mkdir, writeFile, readFile, unlink, stat } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { query } from "./db";

// Admin-uploaded images live in <project root>/uploads/<folder>/ (not /public)
// and are served by src/app/uploads/[...path]/route.js at /uploads/<folder>/<file>.
// NOTE: this needs a persistent disk (VPS / normal hosting). Serverless hosts
// like Vercel have a read-only, per-deploy filesystem.
export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
export const UPLOAD_FOLDERS = new Set(["projects", "portfolio", "blog"]);

export const IMAGE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export const MIME_BY_EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

function slugPart(text) {
  return String(text || "image")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "image";
}

// Saves an image buffer and returns its public URL path ("/uploads/...").
export async function saveUpload(buffer, { folder, ext, name }) {
  if (!UPLOAD_FOLDERS.has(folder)) throw new Error(`Unknown upload folder: ${folder}`);
  if (!MIME_BY_EXT[ext]) throw new Error(`Unsupported image type: ${ext}`);

  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const fileName = `${slugPart(name)}-${Date.now()}-${randomBytes(3).toString("hex")}.${ext}`;
  await writeFile(path.join(dir, fileName), buffer);
  return `/uploads/${folder}/${fileName}`;
}

// Resolves "/uploads/<folder>/<file>" to an absolute path inside UPLOAD_ROOT,
// or null for anything that would escape it.
export function resolveUploadPath(segments) {
  const parts = segments.map((s) => decodeURIComponent(s));
  if (parts.length !== 2 || !UPLOAD_FOLDERS.has(parts[0])) return null;
  if (parts.some((p) => !p || p.includes("/") || p.includes("\\") || p.startsWith("."))) return null;
  const full = path.resolve(UPLOAD_ROOT, parts[0], parts[1]);
  return full.startsWith(UPLOAD_ROOT + path.sep) ? full : null;
}

export async function readUpload(segments) {
  const full = resolveUploadPath(segments);
  if (!full) return null;
  const ext = path.extname(full).slice(1).toLowerCase();
  if (!MIME_BY_EXT[ext]) return null;
  try {
    const info = await stat(full);
    if (!info.isFile()) return null;
    return { body: await readFile(full), contentType: MIME_BY_EXT[ext], size: info.size };
  } catch {
    return null;
  }
}

// Deletes an uploaded file once no project, portfolio item or blog post still uses it.
export async function removeUploadIfUnused(url) {
  if (!url || !String(url).startsWith("/uploads/")) return;
  const [[a], [b], [c]] = await Promise.all([
    query("SELECT COUNT(*) AS n FROM projects WHERE image_url = ?", [url]),
    query("SELECT COUNT(*) AS n FROM portfolio_projects WHERE image_url = ?", [url]),
    query("SELECT COUNT(*) AS n FROM ai_blog_posts WHERE featured_image_url = ?", [url]),
  ]);
  if (a.n + b.n + c.n > 0) return;
  const full = resolveUploadPath(String(url).replace(/^\/uploads\//, "").split("/"));
  if (full) await unlink(full).catch(() => {});
}
