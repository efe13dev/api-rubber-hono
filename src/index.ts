import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { stockRouter } from './routes/stock.routes';
import { formulasRouter } from './routes/formulas.routes';

const app = new Hono();

// Configuración de CORS - aplicado a todas las rutas
app.use('/*', cors({
  origin: '*', // Permite solicitudes desde cualquier origen
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.route('/stock', stockRouter);
app.route('/formulas', formulasRouter);

export default app;
