import app from '../../dist/index.js';

export default async (request, context) => {
  // Pasar la solicitud a la aplicación Hono
  return await app.fetch(request);
};
