import type { Context } from 'hono';
import { db } from '../db';
import { stockTable } from '../db/schema';

export const getAllColorsStock = async (c: Context) => {
	const products = await db.select().from(stockTable);
	return c.json(products);
}
