import type { Context } from "hono";

import { sql } from "drizzle-orm";

import { db } from "../db";
import { formulaIngredientTable, formulaTable } from "../db/schema";

export async function deleteFormula(c: Context) {
  const name = c.req.param("name").toLowerCase();

  // Verificar si existe la fórmula
  const formula = await db
    .select()
    .from(formulaTable)
    .where(sql`LOWER(${formulaTable.name}) = ${name}`)
    .get();

  if (!formula) {
    return c.json({ error: "Formula not found" }, 404);
  }

  // Eliminar primero los ingredientes (para mantener la integridad referencial)
  await db
    .delete(formulaIngredientTable)
    .where(sql`${formulaIngredientTable.formulaId} = ${formula.id}`);

  // Eliminar la fórmula
  await db.delete(formulaTable).where(sql`${formulaTable.id} = ${formula.id}`);

  return c.json({ message: "Formula deleted successfully" });
}
