// One-time import of the original /portfolio projects (src/app/data/portfolio.js)
// into the portfolio_projects table. Each image is copied into uploads/portfolio/.
// Safe to re-run: does nothing if the table already has rows.
// Usage: npm run portfolio:import   (after `npm run db:migrate`)
import { fileURLToPath, pathToFileURL } from "url";
import { readFile, mkdir, copyFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import mysql from "mysql2/promise";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { portfolioSeed } = await import(pathToFileURL(path.join(ROOT, "src", "app", "data", "portfolio.js")));

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error("Missing DB env vars. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (or use node --env-file=.env).");
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASSWORD || "",
  database: DB_NAME,
});

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);

try {
  const [[{ n }]] = await connection.query("SELECT COUNT(*) AS n FROM portfolio_projects");
  if (n > 0) {
    console.log(`portfolio_projects already has ${n} rows — nothing imported.`);
  } else {
    const dir = path.join(ROOT, "uploads", "portfolio");
    await mkdir(dir, { recursive: true });
    let order = 1;
    for (const p of portfolioSeed) {
      const ext = path.extname(p.imageFile);
      const fileName = `${slug(p.title)}-${Date.now()}-${randomBytes(3).toString("hex")}${ext}`;
      await readFile(path.join(ROOT, p.imageFile)); // fail early with a clear error if missing
      await copyFile(path.join(ROOT, p.imageFile), path.join(dir, fileName));

      await connection.execute(
        `INSERT INTO portfolio_projects
           (title, subtitle, seo_heading, description, image_url, alt_text, category, client_type, role,
            stats, technologies, features, case_problem, case_solution, case_result, link_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.title,
          p.subtitle || null,
          p.seoHeading || null,
          p.description || null,
          `/uploads/portfolio/${fileName}`,
          p.altText || p.title,
          p.category || "Website",
          p.clientType || null,
          p.role || null,
          JSON.stringify(p.stats || []),
          JSON.stringify(p.technologies || []),
          JSON.stringify(p.features || []),
          p.caseStudy?.problem || null,
          p.caseStudy?.solution || null,
          p.caseStudy?.result || null,
          p.link || null,
          order++,
        ]
      );
      console.log(`Imported: ${p.title}`);
    }
    console.log(`Done. ${portfolioSeed.length} projects imported.`);
  }
} catch (error) {
  console.error("Import failed:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
