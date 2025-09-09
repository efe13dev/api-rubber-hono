import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

import { deleteColorStock } from "../controllers/deleteColorStock";
import { getAllColorsStock } from "../controllers/getAllColorsStock";
import { db } from "../db";
import { stockTable } from "../db/schema";
import { stockSchema } from "../schemas/stockSchema";

export const stockRouter = new Hono();

//obtener todo el stock
stockRouter.get("/", getAllColorsStock);

//agregar un nuevo color
stockRouter.post("/", zValidator("json", stockSchema), async (c) => {
  const { name, quantity = 0 } = c.req.valid("json");

  // Verificar si ya existe ese color
  const existingColor = await db
    .select()
    .from(stockTable)
    .where(sql`LOWER(${stockTable.name}) = ${name.toLowerCase()}`)
    .get();

  if (existingColor) {
    return c.json({ error: "Color with this name already exists" }, 400);
  }

  await db.insert(stockTable).values({ name: name.toLowerCase(), quantity });

  return c.json({ message: "Product created successfully" }, 201);
});

//actualizar un color
stockRouter.put("/:name", zValidator("json", stockSchema), async (c) => {
  const { name: newName, quantity } = c.req.valid("json");
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

  await db
    .update(stockTable)
    .set({
      name: newName.toLowerCase(),
      quantity: quantity ?? existingProduct.quantity,
    })
    .where(sql`LOWER(${stockTable.name}) = ${currentName}`);

  return c.json({ message: "Color updated successfully" }, 200);
});

//eliminar un color
stockRouter.delete("/:name", deleteColorStock);
