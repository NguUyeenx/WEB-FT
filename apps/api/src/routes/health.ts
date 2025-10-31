import { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };
  });

  fastify.get('/db', async () => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      return {
        success: true,
        data: {
          status: 'ok',
          database: 'connected',
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Database connection failed',
      };
    }
  });
};

export default healthRoutes;
