import { FastifyPluginAsync } from 'fastify';
import { CreateReviewSchema, sanitizeInput } from '@shoe-paradise/shared';

const reviewsRoutes: FastifyPluginAsync = async (fastify) => {
  // Create review
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const body = CreateReviewSchema.parse(request.body);

      // Sanitize user input
      const sanitizedTitle = sanitizeInput(body.title);
      const sanitizedComment = sanitizeInput(body.comment);

      const review = await fastify.prisma.review.create({
        data: {
          productId: body.productId,
          userId: request.user!.id,
          rating: body.rating,
          title: sanitizedTitle,
          comment: sanitizedComment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        data: review,
      };
    }
  );

  // Get reviews for a product
  fastify.get('/product/:productId', async (request) => {
    const { productId } = request.params as { productId: string };

    const reviews = await fastify.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: reviews,
    };
  });
};

export default reviewsRoutes;
