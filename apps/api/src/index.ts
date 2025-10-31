import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';

const fastify = Fastify({
  logger: true,
});

// Parse CORS allowlist from environment variable
const corsAllowlist = process.env.CORS_ALLOWLIST?.split(',').map(origin => origin.trim()) || [
  'http://localhost:3000',
];

// Function to check if origin matches wildcard pattern
function matchesWildcard(origin: string, pattern: string): boolean {
  if (pattern === origin) return true;
  
  // Convert wildcard pattern to regex
  // e.g., https://*.vercel.app -> https://.*\.vercel\.app
  const regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
    .replace(/\*/g, '.*'); // Replace * with .*
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(origin);
}

// Register CORS with wildcard support
fastify.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if origin matches any pattern in allowlist
    const allowed = corsAllowlist.some(pattern => matchesWildcard(origin, pattern));
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
});

// Register Helmet for security headers with CSP
fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});

// Register cookie support
fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET || 'change-this-in-production',
});

// Register rate limiting
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return { 
    message: 'ShoeStore API',
    version: '1.0.0',
    health: '/health',
  };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4000', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`Server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
