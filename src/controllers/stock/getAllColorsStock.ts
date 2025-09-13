import type { Context } from "hono";

import { desc } from "drizzle-orm";

import { db } from "../../db";
import { stockTable } from "../../db/schema";

export async function getAllColorsStock(c: Context) {
  const stock = await db.select().from(stockTable).orderBy(desc(stockTable.quantity));

  return c.json(stock);
}
