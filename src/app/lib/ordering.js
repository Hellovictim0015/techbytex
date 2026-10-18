import { query, withTransaction } from "./db";

const ORDERED_TABLES = new Set(["projects", "portfolio_projects"]);

// Swaps a row's sort_order with its neighbour above ("up") or below ("down").
export async function moveRow(table, id, direction) {
  if (!ORDERED_TABLES.has(table)) throw new Error(`Table ${table} is not orderable.`);
  const rows = await query(`SELECT id, sort_order FROM ${table} WHERE id = ?`, [id]);
  const current = rows[0];
  if (!current) return false;

  const neighbour = await query(
    direction === "up"
      ? `SELECT id, sort_order FROM ${table} WHERE (sort_order, id) < (?, ?) ORDER BY sort_order DESC, id DESC LIMIT 1`
      : `SELECT id, sort_order FROM ${table} WHERE (sort_order, id) > (?, ?) ORDER BY sort_order ASC, id ASC LIMIT 1`,
    [current.sort_order, current.id]
  );
  if (!neighbour[0]) return true;

  const a = current.sort_order;
  // Nudge apart if both rows share the same sort_order.
  const b = neighbour[0].sort_order === a ? a + (direction === "up" ? -1 : 1) : neighbour[0].sort_order;
  await withTransaction(async (conn) => {
    await conn.execute(`UPDATE ${table} SET sort_order = ? WHERE id = ?`, [b, current.id]);
    await conn.execute(`UPDATE ${table} SET sort_order = ? WHERE id = ?`, [a, neighbour[0].id]);
  });
  return true;
}

export async function nextSortOrder(table) {
  if (!ORDERED_TABLES.has(table)) throw new Error(`Table ${table} is not orderable.`);
  const [{ next }] = await query(`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM ${table}`);
  return next;
}
