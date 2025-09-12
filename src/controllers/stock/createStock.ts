import type { Context } from "hono";
import type { StockRequest } from "../../schemas/stockSchema";

import { sql } from "drizzle-orm";

import { db } from "../../db";
import { stockTable } from "../../db/schema";

export async function createStock(c: Context) {
  try {
    // Los datos ya están validados por zValidator
    const body = (await c.req.json()) as StockRequest;
    const { name, quantity = 0 } = body;

    // Verificar si ya existe ese color
    const existingColor = await db
      .select()
      .from(stockTable)
      .where(sql`LOWER(${stockTable.name}) = ${name.toLowerCase()}`)
      .get();

    if (existingColor) {
      return c.json({ error: "Color with this name already exists" }, 400);
    }

    // Usar transacción para consistencia
    const result = await db.transaction(async (tx) => {
      const insertResult = await tx
        .insert(stockTable)
        .values({
          name: name.toLowerCase(),
          quantity: Math.floor(quantity),
        })
        .returning();

      return insertResult[0];
    });

    return c.json(
      {
        message: "Product created successfully",
        product: result,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating stock:", error);

    return c.json(
      {
        error: "Internal server error",
        message: "Failed to create stock",
      },
      500,
    );
  }
}
