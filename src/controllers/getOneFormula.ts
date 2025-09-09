import type { Context } from "hono";

import { sql } from "drizzle-orm";

import { db } from "../db";
import { formulaIngredientTable, formulaTable } from "../db/schema";

export async function getOneFormula(c: Context) {
  const name = c.req.param("name").toLowerCase();

  // Buscar la fórmula por nombre
  const formula = await db
    .select()
    .from(formulaTable)
    .where(sql`LOWER(${formulaTable.name}) = ${name}`)
    .get();

  if (!formula) {
    return c.json({ error: "Formula not found" }, 404);
  }

  // Obtener los ingredientes de la fórmula
  const ingredients = await db
    .select()
    .from(formulaIngredientTable)
    .where(sql`${formulaIngredientTable.formulaId} = ${formula.id}`)
    .all();

  return c.json({
    ...formula,
    ingredients,
  });
}
