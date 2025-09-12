import type { Context } from "hono";
import type { StockRequest } from "../../schemas/stockSchema";

import { sql } from "drizzle-orm";

import { db } from "../../db";
import { stockTable } from "../../db/schema";

export async function updateStock(c: Context) {
  try {
    // Los datos ya están validados por zValidator
    const body = (await c.req.json()) as StockRequest;
    const { name: newName, quantity } = body;
    const currentName = c.req.param("name").toLowerCase();

    // Verificar si existe el color a actualizar
    const existingProduct = await db
      .select()
      .from(stockTable)
      .where(sql`LOWER(${stockTable.name}) = ${currentName}`)
      .get();

    if (!existingProduct) {
      return c.json({ error: "Color not found" }, 404);
    }

    // Si el nombre nuevo es diferente, verificar que no exista
    if (newName.toLowerCase() !== currentName) {
      const duplicateName = await db
        .select()
        .from(stockTable)
        .where(sql`LOWER(${stockTable.name}) = ${newName.toLowerCase()}`)
        .get();

      if (duplicateName) {
        return c.json({ error: "Color with new name already exists" }, 400);
      }
    }

    // Usar transacción para consistencia
    const result = await db.transaction(async (tx) => {
      const updateResult = await tx
        .update(stockTable)
        .set({
          name: newName.toLowerCase(),
          quantity: quantity !== undefined ? Math.floor(quantity) : existingProduct.quantity,
        })
        .where(sql`LOWER(${stockTable.name}) = ${currentName}`)
        .returning();

      return updateResult[0];
    });

    return c.json({
      message: "Color updated successfully",
      product: result,
    });
  } catch (error) {
    console.error("Error updating stock:", error);

    return c.json(
      {
        error: "Internal server error",
        message: "Failed to update stock",
      },
      500,
    );
  }
}
