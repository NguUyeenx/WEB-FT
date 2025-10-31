import { FastifyPluginAsync } from 'fastify';
import { requireAdmin } from '../middlewares/auth';
import { CreateProductSchema, UpdateProductSchema } from '@shoe-paradise/shared';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all orders (admin)
  fastify.get(
    '/orders',
    {
      preHandler: [requireAdmin],
    },
    async () => {
      const orders = await fastify.prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          shippingAddress: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: orders,
      };
    }
  );

  // Update order status
  fastify.patch(
    '/orders/:id/status',
    {
      preHandler: [requireAdmin],
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      const order = await fastify.prisma.order.update({
        where: { id },
        data: { status: status as any },
      });

      return {
        success: true,
        data: order,
      };
    }
  );

  // Create product
  fastify.post(
    '/products',
    {
      preHandler: [requireAdmin],
    },
    async (request) => {
      const body = CreateProductSchema.parse(request.body);

      const product = await fastify.prisma.product.create({
        data: body as any,
      });

      return {
        success: true,
        data: product,
      };
    }
  );

  // Update product
  fastify.patch(
    '/products/:id',
    {
      preHandler: [requireAdmin],
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const body = UpdateProductSchema.parse(request.body);

      const product = await fastify.prisma.product.update({
        where: { id },
        data: body as any,
      });

      return {
        success: true,
        data: product,
      };
    }
  );

  // Delete product
  fastify.delete(
    '/products/:id',
    {
      preHandler: [requireAdmin],
    },
    async (request) => {
      const { id } = request.params as { id: string };

      await fastify.prisma.product.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Product deleted',
      };
    }
  );

  // Get categories
  fastify.get('/categories', async () => {
    const categories = await fastify.prisma.category.findMany();
    return { success: true, data: categories };
  });

  // Create category
  fastify.post(
    '/categories',
    {
      preHandler: [requireAdmin],
    },
    async (request) => {
      const body = request.body as any;
      const category = await fastify.prisma.category.create({ data: body });
      return { success: true, data: category };
    }
  );

  // Get brands
  fastify.get('/brands', async () => {
    const brands = await fastify.prisma.brand.findMany();
    return { success: true, data: brands };
  });

  // Create brand
  fastify.post(
    '/brands',
    {
      preHandler: [requireAdmin],
    },
    async (request) => {
      const body = request.body as any;
      const brand = await fastify.prisma.brand.create({ data: body });
      return { success: true, data: brand };
    }
  );
};

export default adminRoutes;
