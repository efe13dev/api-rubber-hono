import type { Context } from "hono";

import { sql } from "drizzle-orm";

import { db } from "../../db";
import { formulaIngredientTable, formulaTable } from "../../db/schema";

export async function updateFormula(c: Context) {
  try {
    // Los datos ya están validados por zValidator
    const body = await c.req.json();

    const { name: newName, ingredients } = body;
    const currentName = c.req.param("name").toLowerCase();

    // Verificar si existe la fórmula a actualizar
    const existingFormula = await db
      .select()
      .from(formulaTable)
      .where(sql`LOWER(${formulaTable.name}) = ${currentName}`)
      .get();

    if (!existingFormula) {
      return c.json({ error: "Formula not found" }, 404);
    }

    // Si el nombre nuevo es diferente, verificar que no exista
    if (newName.toLowerCase() !== currentName) {
      const duplicateName = await db
        .select()
        .from(formulaTable)
        .where(sql`LOWER(${formulaTable.name}) = ${newName.toLowerCase()}`)
        .get();

      if (duplicateName) {
        return c.json({ error: "Formula with new name already exists" }, 400);
      }
    }

    // Usar transacción para garantizar consistencia
    const result = await db.transaction(async (tx) => {
      // Actualizar la fórmula
      await tx
        .update(formulaTable)
        .set({ name: newName.toLowerCase() })
        .where(sql`${formulaTable.id} = ${existingFormula.id}`);

      // Eliminar los ingredientes actuales
      await tx
        .delete(formulaIngredientTable)
        .where(sql`${formulaIngredientTable.formulaId} = ${existingFormula.id}`);

      // Insertar los nuevos ingredientes
      for (const ingredient of ingredients) {
        await tx.insert(formulaIngredientTable).values({
          formulaId: existingFormula.id,
          name: ingredient.name.toLowerCase(),
          quantity: Math.floor(ingredient.quantity),
        });
      }

      return {
        id: existingFormula.id,
        name: newName.toLowerCase(),
        ingredients,
      };
    });

    return c.json({
      message: "Formula updated successfully",
      formula: result,
    });
  } catch (error) {
    console.error("Error updating formula:", error);

    return c.json(
      {
        error: "Internal server error",
        message: "Failed to update formula",
      },
      500,
    );
  }
}
