import type { Context } from 'hono';
import { db } from '../db';
import { stockTable } from '../db/schema';

export async function getAllColorsStock(c: Context) {
	const stock = await db.select().from(stockTable);
	return c.json(stock);
}
