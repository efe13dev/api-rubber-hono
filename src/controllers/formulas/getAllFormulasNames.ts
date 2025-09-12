import type { Context } from "hono";

import { db } from "../../db";
import { formulaTable } from "../../db/schema";

/**
 * Obtiene todos los nombres de las fórmulas (sin ingredientes) de forma optimizada
 * @param c - Contexto de Hono
 * @returns Lista de nombres de fórmulas
 */
export async function getAllFormulasNames(c: Context) {
  try {
    // 🔥 Query optimizada: solo seleccionar nombre e id (muy eficiente)
    const formulas = await db
      .select({
        id: formulaTable.id,
        name: formulaTable.name,
      })
      .from(formulaTable)
      .all();

    return c.json(formulas);
  } catch (error) {
    console.error("Error fetching formula names:", error);

    return c.json(
      {
        error: "Internal server error",
        message: "Failed to retrieve formula names",
      },
      500,
    );
  }
}
