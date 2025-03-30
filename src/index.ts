import { Hono } from 'hono';
import { stockRouter } from './routes/stock.routes';

const app = new Hono();

app.route('/stock', stockRouter);

export default app;
