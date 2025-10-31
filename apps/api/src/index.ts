import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';

// Plugins
import prismaPlugin from './plugins/prisma';
import jwtPlugin from './plugins/jwt';

// Middlewares
import { errorHandler } from './middlewares/error';

// Routes
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import cartRoutes from './routes/carts';
import ordersRoutes from './routes/orders';
import reviewsRoutes from './routes/reviews';
import wishlistsRoutes from './routes/wishlists';
import adminRoutes from './routes/admin';

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register helmet for security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Register cookie support
  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'cookie-secret',
  });

  // Register rate limiting
  await fastify.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_TIMEWINDOW || '1 minute',
  });

  // Register custom plugins
  await fastify.register(prismaPlugin);
  await fastify.register(jwtPlugin);

  // Register error handler
  fastify.setErrorHandler(errorHandler);

  // Register routes
  await fastify.register(healthRoutes, { prefix: '/api/health' });
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(productsRoutes, { prefix: '/api/products' });
  await fastify.register(cartRoutes, { prefix: '/api/carts' });
  await fastify.register(ordersRoutes, { prefix: '/api/orders' });
  await fastify.register(reviewsRoutes, { prefix: '/api/reviews' });
  await fastify.register(wishlistsRoutes, { prefix: '/api/wishlists' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });

  return fastify;
}

async function start() {
  try {
    const fastify = await buildServer();
    
    await fastify.listen({
      port: PORT,
      host: HOST,
    });

    console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { buildServer };
