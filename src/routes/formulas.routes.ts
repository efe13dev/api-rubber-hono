import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

import { deleteFormula } from "../controllers/deleteFormula";
import { getAllFormulas } from "../controllers/getAllFormulas";
import { getOneFormula } from "../controllers/getOneFormula";
import { db } from "../db";
import { formulaIngredientTable, formulaTable } from "../db/schema";
import { formulaSchema } from "../schemas/formulaSchema";

export const formulasRouter = new Hono();

//obtener todas las formulas
formulasRouter.get("/", getAllFormulas);

//obtener una formula
formulasRouter.get("/:name", getOneFormula);

//agregar una nueva formula
formulasRouter.post("/", zValidator("json", formulaSchema), async (c) => {
  const { name, ingredients } = c.req.valid("json");

  // Verificar si ya existe esa fórmula
  const existingFormula = await db
    .select()
    .from(formulaTable)
    .where(sql`LOWER(${formulaTable.name}) = ${name.toLowerCase()}`)
    .get();

  if (existingFormula) {
    return c.json({ error: "Formula with this name already exists" }, 400);
  }

  // Crear la fórmula
  const result = await db
    .insert(formulaTable)
    .values({
      name: name.toLowerCase(),
    })
    .returning();

  const formulaId = result[0].id;

  // Insertar los ingredientes
  for (const ingredient of ingredients) {
    await db.insert(formulaIngredientTable).values({
      formulaId,
      name: ingredient.name.toLowerCase(),
      quantity: ingredient.quantity,
    });
  }

  return c.json(
    {
      message: "Formula created successfully",
      formula: {
        id: formulaId,
        name: name.toLowerCase(),
        ingredients,
      },
    },
    201,
  );
});

//actualizar una formula
formulasRouter.put("/:name", zValidator("json", formulaSchema), async (c) => {
  const { name: newName, ingredients } = c.req.valid("json");
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

  // Actualizar la fórmula
  await db
    .update(formulaTable)
    .set({ name: newName.toLowerCase() })
    .where(sql`${formulaTable.id} = ${existingFormula.id}`);

  // Eliminar los ingredientes actuales
  await db
    .delete(formulaIngredientTable)
    .where(sql`${formulaIngredientTable.formulaId} = ${existingFormula.id}`);

  // Insertar los nuevos ingredientes
  for (const ingredient of ingredients) {
    await db.insert(formulaIngredientTable).values({
      formulaId: existingFormula.id,
      name: ingredient.name.toLowerCase(),
      quantity: ingredient.quantity,
    });
  }

  return c.json({
    message: "Formula updated successfully",
    formula: {
      id: existingFormula.id,
      name: newName.toLowerCase(),
      ingredients,
    },
  });
});

//eliminar una formula
formulasRouter.delete("/:name", deleteFormula);
