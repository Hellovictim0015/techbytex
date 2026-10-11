import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (pool) return pool;

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error(
      "Database is not configured. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in your environment."
    );
  }

  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    user: DB_USER,
    password: DB_PASSWORD || "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
    dateStrings: true,
  });

  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

export async function withTransaction(fn) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
