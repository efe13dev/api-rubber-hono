import { Hono } from 'hono';
import { stockRouter } from './routes/stock.routes';
import { formulasRouter } from './routes/formulas.routes';

const app = new Hono();

app.route('/stock', stockRouter);
app.route('/formulas', formulasRouter);

export default app;
