import { query } from "./db";
import { cleanUrl } from "./projects";
import { portfolioFallback } from "../data/portfolio-fallback";

const asArray = (v) => (Array.isArray(v) ? v : []);

// Shape expected by newcom/OurProjects.js.
function toPublicProject(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    seoHeading: row.seo_heading,
    description: row.description,
    image: row.image_url,
    altText: row.alt_text || row.title,
    category: row.category,
    clientType: row.client_type,
    role: row.role,
    stats: asArray(row.stats),
    technologies: asArray(row.technologies),
    features: asArray(row.features),
    caseStudy: {
      problem: row.case_problem,
      solution: row.case_solution,
      result: row.case_result,
    },
    link: row.link_url,
    videoUrl: row.video_url,
  };
}

// Visible /portfolio projects in admin-defined order; bundled fallback if the
// database is unreachable so the page never renders empty.
export async function getVisiblePortfolio() {
  try {
    const rows = await query(
      "SELECT * FROM portfolio_projects WHERE is_visible = 1 ORDER BY sort_order ASC, id ASC"
    );
    return rows.map(toPublicProject);
  } catch {
    return portfolioFallback;
  }
}

export async function getAllPortfolioForAdmin() {
  return query("SELECT * FROM portfolio_projects ORDER BY sort_order ASC, id ASC");
}

const text = (v, max) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};
const list = (v, maxItems = 20) =>
  JSON.stringify(
    (Array.isArray(v) ? v : String(v ?? "").split("\n"))
      .map((x) => String(x).trim())
      .filter(Boolean)
      .slice(0, maxItems)
      .map((x) => x.slice(0, 200))
  );

// Maps an admin form payload to DB columns. Only keys present in `body` are
// returned, so the same function serves create (all fields) and partial edits.
export function portfolioColumnsFromBody(body, { requireAll = false } = {}) {
  const cols = {};
  const has = (k) => requireAll || body[k] !== undefined;

  if (has("title")) {
    cols.title = text(body.title, 255);
    if (!cols.title) throw new Error("Project name is required.");
  }
  if (has("image_url")) cols.image_url = cleanUrl(body.image_url, { required: true, label: "Image" });
  if (has("subtitle")) cols.subtitle = text(body.subtitle, 255);
  if (has("seo_heading")) cols.seo_heading = text(body.seo_heading, 255);
  if (has("description")) cols.description = text(body.description, 5000);
  if (has("alt_text")) cols.alt_text = text(body.alt_text, 512);
  if (has("category")) cols.category = text(body.category, 100) || "Website";
  if (has("client_type")) cols.client_type = text(body.client_type, 255);
  if (has("role")) cols.role = text(body.role, 255);
  if (has("stats")) cols.stats = list(body.stats, 6);
  if (has("technologies")) cols.technologies = list(body.technologies, 20);
  if (has("features")) cols.features = list(body.features, 12);
  if (has("case_problem")) cols.case_problem = text(body.case_problem, 2000);
  if (has("case_solution")) cols.case_solution = text(body.case_solution, 2000);
  if (has("case_result")) cols.case_result = text(body.case_result, 2000);
  if (has("link_url")) cols.link_url = cleanUrl(body.link_url, { label: "Live link" });
  if (has("video_url")) cols.video_url = cleanUrl(body.video_url, { label: "Demo video link" });
  if (body.is_visible !== undefined) cols.is_visible = body.is_visible ? 1 : 0;
  return cols;
}
