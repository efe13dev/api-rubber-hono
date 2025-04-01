import type { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import { formulaTable, formulaIngredientTable } from '../db/schema';

export async function getAllFormulas(c: Context) {
	// Obtener todas las fórmulas
	const formulas = await db.select().from(formulaTable).all();

	// Para cada fórmula, obtener sus ingredientes
	const result = await Promise.all(
		formulas.map(async (formula) => {
			const ingredients = await db
				.select()
				.from(formulaIngredientTable)
				.where(sql`${formulaIngredientTable.formulaId} = ${formula.id}`)
				.all();

			return {
				...formula,
				ingredients,
			};
		}),
	);

	return c.json(result);
}
