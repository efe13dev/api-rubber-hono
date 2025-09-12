import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createFormula } from "../controllers/formulas/createFormula";
import { deleteFormula } from "../controllers/formulas/deleteFormula";
import { getAllFormulas } from "../controllers/formulas/getAllFormulas";
import { getAllFormulasNames } from "../controllers/formulas/getAllFormulasNames";
import { getOneFormula } from "../controllers/formulas/getOneFormula";
import { updateFormula } from "../controllers/formulas/updateFormula";
import { formulaSchema } from "../schemas/formulaSchema";

export const formulasRouter = new Hono();

//obtener todas las formulas
formulasRouter.get("/", getAllFormulas);

//obtener solo los nombres de todas las formulas (sin ingredientes)
formulasRouter.get("/names", getAllFormulasNames);

//obtener una formula
formulasRouter.get("/:name", getOneFormula);

//agregar una nueva formula
formulasRouter.post("/", zValidator("json", formulaSchema), createFormula);

//actualizar una formula
formulasRouter.put("/:name", zValidator("json", formulaSchema), updateFormula);

//eliminar una formula
formulasRouter.delete("/:name", deleteFormula);
