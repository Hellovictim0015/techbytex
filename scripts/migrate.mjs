// Runs scripts/schema.sql, then every scripts/migrations/*.sql file that has
// not been applied yet (tracked in schema_migrations). schema.sql is all
// CREATE TABLE IF NOT EXISTS; numbered migrations hold later additive changes
// (e.g. ALTER TABLE ... ADD COLUMN) and each runs exactly once.
import { readFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "migrations");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error(
    "Missing DB env vars. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (see .env.example) before running this script."
  );
  process.exit(1);
}

const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

const connection = await mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASSWORD || "",
  database: DB_NAME,
  multipleStatements: true,
});

try {
  console.log(`Connecting to ${DB_HOST}/${DB_NAME} ...`);
  await connection.query(sql);
  console.log("Base schema OK. All tables created (or already existed).");

  await connection.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name VARCHAR(255) PRIMARY KEY,
       applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );
  const [appliedRows] = await connection.query("SELECT name FROM schema_migrations");
  const applied = new Set(appliedRows.map((r) => r.name));

  const files = existsSync(MIGRATIONS_DIR)
    ? readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()
    : [];
  for (const file of files) {
    if (applied.has(file)) continue;
    console.log(`Applying ${file} ...`);
    await connection.query(readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8"));
    await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
  }
  console.log("Migration complete.");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
