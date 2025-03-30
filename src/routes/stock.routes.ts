import { Hono } from 'hono';
import { db } from '../db';
import { stockTable } from '../db/schema';
import { sql } from 'drizzle-orm';
import { stockSchema } from '../schemas/stockSchema';
import { zValidator } from '@hono/zod-validator';

export const stockRouter = new Hono();

//obtener todo el stock
stockRouter.get('/', async (c) => {
	const products = await db.select().from(stockTable);
	return c.json(products);
});

//agregar un nuevo color
stockRouter.post('/', zValidator('json', stockSchema), async (c) => {
	const { name, quantity = 0 } = c.req.valid('json');

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
});

stockRouter.put('/:name', zValidator('json', stockSchema), async (c) => {
    const { name: newName, quantity } = c.req.valid('json');
    const currentName = c.req.param('name').toLowerCase();

    // Verificar si existe el color a actualizar
    const existingProduct = await db
        .select()
        .from(stockTable)
        .where(sql`LOWER(${stockTable.name}) = ${currentName}`)
        .get();

    if (!existingProduct) {
        return c.json({ error: 'Color not found' }, 404);
    }

    // Si el nombre nuevo es diferente, verificar que no exista
    if (newName.toLowerCase() !== currentName) {
        const duplicateName = await db
            .select()
            .from(stockTable)
            .where(sql`LOWER(${stockTable.name}) = ${newName.toLowerCase()}`)
            .get();

        if (duplicateName) {
            return c.json({ error: 'Color with new name already exists' }, 400);
        }
    }

    await db
        .update(stockTable)
        .set({ 
            name: newName.toLowerCase(), 
            quantity: quantity ?? existingProduct.quantity 
        })
        .where(sql`LOWER(${stockTable.name}) = ${currentName}`);

    return c.json({ message: 'Color updated successfully' }, 200);
});

//eliminar un color
stockRouter.delete('/:name', async (c) => {
	const name = c.req.param('name').toLowerCase();

	const result = await db
		.delete(stockTable)
		.where(sql`LOWER(${stockTable.name}) = ${name}`);

	if (result.rowsAffected === 0) {
		return c.json({ error: 'Product not found' }, 404);
	}

	return c.json({ message: 'Product deleted successfully' }, 200);
});
