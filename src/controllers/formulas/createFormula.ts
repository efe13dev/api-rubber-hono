import type { Context } from "hono";
import type { FormulaRequest } from "../../schemas/formulaSchema";

import { sql } from "drizzle-orm";

import { db } from "../../db";
import { formulaIngredientTable, formulaTable } from "../../db/schema";

export async function createFormula(c: Context) {
  try {
    // Los datos ya están validados por zValidator
    const body = (await c.req.json()) as FormulaRequest;

    const { name, ingredients } = body;

    // Verificar si ya existe esa fórmula
    const existingFormula = await db
      .select()
      .from(formulaTable)
      .where(sql`LOWER(${formulaTable.name}) = ${name.toLowerCase()}`)
      .get();

    if (existingFormula) {
      return c.json({ error: "Formula with this name already exists" }, 400);
    }

    // Usar transacción para garantizar consistencia
    const result = await db.transaction(async (tx) => {
      // Crear la fórmula
      const formulaResult = await tx
        .insert(formulaTable)
        .values({
          name: name.toLowerCase(),
        })
        .returning();

      const formulaId = formulaResult[0].id;

      // Insertar los ingredientes
      for (const ingredient of ingredients) {
        await tx.insert(formulaIngredientTable).values({
          formulaId,
          name: ingredient.name.toLowerCase(),
          quantity: Math.floor(ingredient.quantity),
        });
      }

      return {
        id: formulaId,
        name: name.toLowerCase(),
        ingredients,
      };
    });

    return c.json(
      {
        message: "Formula created successfully",
        formula: result,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating formula:", error);

    return c.json(
      {
        error: "Internal server error",
        message: "Failed to create formula",
      },
      500,
    );
  }
}
