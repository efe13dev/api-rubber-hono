import app from "./index";

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
console.log(`Servidor iniciado en el puerto ${port}`);

export default {
  port,
  fetch: app.fetch,
};
