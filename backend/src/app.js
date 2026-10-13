import fs from 'node:fs';
import path from 'node:path';
import Fastify from 'fastify';
import secureSession from '@fastify/secure-session';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';

import authRoutes from './routes/auth.js';
import catalogRoutes from './routes/catalog.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin/index.js';

/**
 * Builds the Fastify app. Kept separate from server.js so tests can call
 * app.inject() without opening a port.
 */
export async function buildApp({ db, config, logger = false }) {
  const app = Fastify({ logger, ajv: { customOptions: { coerceTypes: 'array', removeAdditional: true } } });

  app.decorate('db', db);
  app.decorate('config', config);

  await app.register(secureSession, {
    secret: config.sessionSecret,
    salt: config.sessionSalt,
    cookieName: 'excalibur_session',
    cookie: { path: '/', httpOnly: true, sameSite: 'lax', secure: config.cookieSecure },
  });
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

  app.setErrorHandler((err, request, reply) => {
    if (err.validation) {
      return reply.code(400).send({ error: 'Bad Request', message: err.message });
    }
    const status = err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
    if (status === 500) request.log.error(err);
    return reply.code(status).send({
      error: status === 500 ? 'Internal Server Error' : err.name,
      message: status === 500 ? 'Something went wrong. Please try again.' : err.message,
    });
  });

  app.get('/api/health', async () => ({ ok: true }));
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(catalogRoutes, { prefix: '/api' });
  await app.register(reviewRoutes, { prefix: '/api' });
  await app.register(cartRoutes, { prefix: '/api/cart' });
  await app.register(checkoutRoutes, { prefix: '/api/checkout' });
  await app.register(orderRoutes, { prefix: '/api/orders' });
  await app.register(profileRoutes, { prefix: '/api/profile' });
  await app.register(adminRoutes, { prefix: '/api/admin' });

  // Product images uploaded by admins (and the seed images copied from SE262's /uploads folder).
  fs.mkdirSync(config.uploadDir, { recursive: true });
  await app.register(fastifyStatic, { root: config.uploadDir, prefix: '/uploads/', decorateReply: false });

  // In production the built React app is served by the same server.
  const hasFrontend = fs.existsSync(path.join(config.frontendDist, 'index.html'));
  if (hasFrontend) {
    await app.register(fastifyStatic, { root: config.frontendDist, prefix: '/', wildcard: false });
  }
  app.setNotFoundHandler((request, reply) => {
    if (hasFrontend && request.method === 'GET' && !request.url.startsWith('/api')) {
      return reply.sendFile('index.html');
    }
    return reply.code(404).send({ error: 'Not Found', message: 'Not found.' });
  });

  return app;
}
