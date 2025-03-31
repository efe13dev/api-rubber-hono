import type { Context } from 'hono';
import { db } from '../db';
import { stockTable } from '../db/schema';
import { sql } from 'drizzle-orm';

export const createNewColorStock = async (c: Context) => {
	const { name, quantity = 0 } = await c.req.json();

	// Verificar si ya existe ese color
	const existingProduct = await db
		.select()
		.from(stockTable)
		.where(sql`LOWER(${stockTable.name}) = ${name.toLowerCase()}`)
		.get();

	if (existingProduct) {
		return c.json({ error: 'Product with this name already exists' }, 400);
	}

	await db.insert(stockTable).values({ name: name.toLowerCase(), quantity });

	return c.json({ message: 'Product created successfully' }, 201);
};
