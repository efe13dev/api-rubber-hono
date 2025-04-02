import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v4.7.5/mod.ts";
import { stockRouter } from "./src/routes/stock.routes.ts";
import { formulasRouter } from "./src/routes/formulas.routes.ts";

const app = new Hono();

app.route('/stock', stockRouter);
app.route('/formulas', formulasRouter);

serve(app.fetch);
