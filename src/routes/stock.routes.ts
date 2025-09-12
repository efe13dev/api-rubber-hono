import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createStock } from "../controllers/stock/createStock";
import { deleteColorStock } from "../controllers/stock/deleteColorStock";
import { getAllColorsStock } from "../controllers/stock/getAllColorsStock";
import { updateStock } from "../controllers/stock/updateStock";
import { stockSchema } from "../schemas/stockSchema";

export const stockRouter = new Hono();

//obtener todo el stock
stockRouter.get("/", getAllColorsStock);

//agregar un nuevo color
stockRouter.post("/", zValidator("json", stockSchema), createStock);

//actualizar un color
stockRouter.put("/:name", zValidator("json", stockSchema), updateStock);

//eliminar un color
stockRouter.delete("/:name", deleteColorStock);
