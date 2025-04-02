import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v3.10.0/mod.ts";

// Crear una aplicación Hono
const app = new Hono();

// Rutas básicas para demostrar que funciona
app.get('/stock', (c) => c.json({ message: 'Stock API endpoint' }));
app.get('/formulas', (c) => c.json({ message: 'Formulas API endpoint' }));

// Iniciar el servidor
serve(app.fetch);
