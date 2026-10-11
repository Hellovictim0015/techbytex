// Creates (or promotes) an admin user. Run after `npm run db:migrate`.
// Usage:
//   node scripts/create-admin.mjs --email you@example.com --password "strongpass" --name "Your Name"
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

function readArg(flag) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const email = (readArg("--email") || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = readArg("--password") || process.env.ADMIN_PASSWORD;
const name = readArg("--name") || process.env.ADMIN_NAME || "Admin";

if (!email || !password) {
  console.error(
    'Usage: node scripts/create-admin.mjs --email you@example.com --password "strongpass" --name "Your Name"'
  );
  process.exit(1);
}

if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

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

try {
  const passwordHash = await bcrypt.hash(password, 12);

  const [existing] = await connection.execute(
    "SELECT id FROM admin_users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    await connection.execute(
      "UPDATE admin_users SET password_hash = ?, name = ?, is_active = 1 WHERE email = ?",
      [passwordHash, name, email]
    );
    console.log(`Updated existing admin user: ${email}`);
  } else {
    await connection.execute(
      "INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES (?, ?, ?, 'admin', 1)",
      [email, passwordHash, name]
    );
    console.log(`Created admin user: ${email}`);
  }
} catch (error) {
  console.error("Failed to create admin user:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
