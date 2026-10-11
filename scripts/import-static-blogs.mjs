// One-time import of the static posts in src/app/data/blogData.js into the
// ai_blog_posts table, so the database becomes the single source of blog
// content. Safe to re-run: posts whose slug already exists are skipped.
// Usage: npm run blog:import  (after `npm run db:migrate`)
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { blogPosts } = await import(
  pathToFileURL(path.join(__dirname, "..", "src", "app", "data", "blogData.js"))
);

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error("Missing DB env vars. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.");
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASSWORD || "",
  database: DB_NAME,
});

let imported = 0;
let skipped = 0;
try {
  for (const post of blogPosts) {
    const [existing] = await connection.execute("SELECT id FROM ai_blog_posts WHERE slug = ?", [post.slug]);
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    await connection.execute(
      `INSERT INTO ai_blog_posts
         (slug, title, excerpt, content, category, keywords, meta_title, meta_description, faq,
          featured_image_url, featured_image_alt, status, is_featured, generated_by, published_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, 'static_import', ?, ?)`,
      [
        post.slug,
        post.title,
        post.excerpt || null,
        post.content.trim(),
        post.category || null,
        JSON.stringify(post.keywords || []),
        null,
        post.excerpt || null,
        JSON.stringify(post.faq || []),
        post.image || null,
        post.title,
        post.featured ? 1 : 0,
        `${post.isoDate} 09:00:00`,
        `${post.isoDate} 09:00:00`,
      ]
    );
    imported++;
    console.log(`Imported: ${post.slug}`);
  }
  console.log(`Done. ${imported} imported, ${skipped} already in the database.`);
} catch (error) {
  console.error("Import failed:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
