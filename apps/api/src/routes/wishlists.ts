import { FastifyPluginAsync } from 'fastify';

const wishlistsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get user wishlist
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const wishlists = await fastify.prisma.wishlist.findMany({
        where: { userId: request.user!.id },
        include: {
          product: {
            include: {
              images: { take: 1 },
              brand: true,
              category: true,
            },
          },
        },
      });

      return {
        success: true,
        data: wishlists,
      };
    }
  );

  // Add to wishlist
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const { productId } = request.body as { productId: string };

      const existing = await fastify.prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: request.user!.id,
            productId,
          },
        },
      });

      if (existing) {
        return reply.status(400).send({
          success: false,
          message: 'Product already in wishlist',
        });
      }

      const wishlist = await fastify.prisma.wishlist.create({
        data: {
          userId: request.user!.id,
          productId,
        },
      });

      return {
        success: true,
        data: wishlist,
      };
    }
  );

  // Remove from wishlist
  fastify.delete(
    '/:productId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const { productId } = request.params as { productId: string };

      await fastify.prisma.wishlist.deleteMany({
        where: {
          userId: request.user!.id,
          productId,
        },
      });

      return {
        success: true,
        message: 'Removed from wishlist',
      };
    }
  );
};

export default wishlistsRoutes;
