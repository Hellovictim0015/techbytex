import { query } from "./db";
import { fallbackProjects } from "../data/projects";

function toPublicProject(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image_url,
    link: row.link_url,
  };
}

// Visible homepage projects in admin-defined order. Falls back to the bundled
// list if the database is unreachable so the section never renders empty.
export async function getVisibleProjects() {
  try {
    const rows = await query(
      "SELECT * FROM projects WHERE is_visible = 1 ORDER BY sort_order ASC, id ASC"
    );
    return rows.map(toPublicProject);
  } catch {
    return fallbackProjects;
  }
}

export async function getAllProjectsForAdmin() {
  return query("SELECT * FROM projects ORDER BY sort_order ASC, id ASC");
}

// Image and link values must be a site path or an http(s) URL. A bare domain
// typed without a scheme ("www.client.com", "youtu.be/abc") gets https:// added.
export function cleanUrl(value, { required = false, label = "Image" } = {}) {
  const v = String(value ?? "").trim();
  if (!v) {
    if (required) throw new Error(`${label} is required.`);
    return null;
  }
  if ((v.startsWith("/") && !v.startsWith("//")) || /^https?:\/\//i.test(v)) return v.slice(0, 1024);
  if (/^(\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?([/?#]\S*)?$/i.test(v)) {
    return `https://${v.replace(/^\/\//, "")}`.slice(0, 1024);
  }
  throw new Error(`${label}: "${v.slice(0, 60)}" is not a valid link. Use https://… (or / for images in the public folder).`);
}
