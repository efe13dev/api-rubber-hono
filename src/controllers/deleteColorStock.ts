import type { Context } from 'hono';
import { db } from '../db';
import { stockTable } from '../db/schema';
import { sql } from 'drizzle-orm';

export async function deleteColorStock(c: Context) {
	const name = c.req.param('name').toLowerCase();

	const result = await db
		.delete(stockTable)
		.where(sql`LOWER(${stockTable.name}) = ${name}`);

	if (result.rowsAffected === 0) {
		return c.json({ error: 'Product not found' }, 404);
	}

	return c.json({ message: 'Product deleted successfully' }, 200);
}
