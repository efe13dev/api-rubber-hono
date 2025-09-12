import type { Context } from "hono";

import { asc, eq } from "drizzle-orm";

import { db } from "../../db";
import { formulaIngredientTable, formulaTable } from "../../db/schema";

/**
 * Obtiene una fórmula específica con todos sus ingredientes usando una query optimizada
 * @param c - Contexto de Hono con parámetro 'name'
 * @returns Fórmula completa con sus ingredientes
 */
export async function getOneFormula(c: Context) {
  try {
    const nameParam = c.req.param("name");

    // Validación de entrada
    if (!nameParam || nameParam.trim() === "") {
      return c.json({ error: "Formula name is required" }, 400);
    }

    const name = nameParam.toLowerCase().trim();

    // 🔥 UNA SOLA QUERY optimizada con LEFT JOIN (en lugar de 2 queries)
    const formulaWithIngredients = await db
      .select({
        // Datos de la fórmula
        id: formulaTable.id,
        name: formulaTable.name,

        // Datos de los ingredientes (pueden ser null si no hay ingredientes)
        ingredientId: formulaIngredientTable.id,
        ingredientName: formulaIngredientTable.name,
        quantity: formulaIngredientTable.quantity,
      })
      .from(formulaTable)
      .leftJoin(formulaIngredientTable, eq(formulaTable.id, formulaIngredientTable.formulaId))
      .where(eq(formulaTable.name, name))
      .orderBy(asc(formulaIngredientTable.id))
      .all();

    // Verificar si la fórmula existe
    if (formulaWithIngredients.length === 0) {
      return c.json(
        {
          error: "Formula not found",
          message: `No formula found with name: ${nameParam}`,
        },
        404,
      );
    }

    // Extraer la información de la fórmula (primer registro)
    const formulaInfo = {
      id: formulaWithIngredients[0].id,
      name: formulaWithIngredients[0].name,
    };

    // Extraer solo los ingredientes válidos (filtrar nulls)
    const ingredients = formulaWithIngredients
      .filter((row) => row.ingredientId !== null)
      .map((row) => ({
        id: row.ingredientId,
        name: row.ingredientName,
        quantity: row.quantity,
      }));

    return c.json({
      ...formulaInfo,
      ingredients,
    });
  } catch (error) {
    console.error("Error fetching formula:", error);

    return c.json(
      {
        error: "Internal server error",
        message: "Failed to retrieve formula",
      },
      500,
    );
  }
}
