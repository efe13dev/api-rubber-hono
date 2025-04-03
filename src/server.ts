import app from './index';

const port = process.env.PORT || 3000;

console.log(`Servidor iniciado en el puerto ${port}`);

export default {
  port,
  fetch: app.fetch,
};
