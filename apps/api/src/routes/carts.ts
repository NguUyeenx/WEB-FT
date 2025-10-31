import { FastifyPluginAsync } from 'fastify';
import { AddToCartSchema, UpdateCartItemSchema } from '@shoe-paradise/shared';

const cartRoutes: FastifyPluginAsync = async (fastify) => {
  // Get cart
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      let cart = await fastify.prisma.cart.findFirst({
        where: { userId: (request.user as any).id },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { take: 1 },
                    },
                  },
                  images: { take: 1 },
                  inventory: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await fastify.prisma.cart.create({
          data: {
            userId: (request.user as any).id,
          },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        images: { take: 1 },
                      },
                    },
                    images: { take: 1 },
                    inventory: true,
                  },
                },
              },
            },
          },
        });
      }

      return {
        success: true,
        data: cart,
      };
    }
  );

  // Add to cart
  fastify.post(
    '/items',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const body = AddToCartSchema.parse(request.body);

      // Get or create cart
      let cart = await fastify.prisma.cart.findFirst({
        where: { userId: (request.user as any).id },
      });

      if (!cart) {
        cart = await fastify.prisma.cart.create({
          data: {
            userId: (request.user as any).id,
          },
        });
      }

      // Check if variant exists and has stock
      const variant = await fastify.prisma.variant.findUnique({
        where: { id: body.variantId },
        include: {
          product: true,
          inventory: true,
        },
      });

      if (!variant) {
        return reply.status(404).send({
          success: false,
          message: 'Product variant not found',
        });
      }

      const availableStock = (variant.inventory?.quantity || 0) - (variant.inventory?.reserved || 0);
      if (availableStock < body.quantity) {
        return reply.status(400).send({
          success: false,
          message: 'Insufficient stock',
        });
      }

      // Check if item already in cart
      const existingItem = await fastify.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          variantId: body.variantId,
        },
      });

      if (existingItem) {
        // Update quantity
        await fastify.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + body.quantity,
          },
        });
      } else {
        // Add new item
        await fastify.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: body.variantId,
            quantity: body.quantity,
            price: variant.product.basePrice + variant.priceAdjustment,
          },
        });
      }

      return {
        success: true,
        message: 'Item added to cart',
      };
    }
  );

  // Update cart item
  fastify.patch(
    '/items/:itemId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const { itemId } = request.params as { itemId: string };
      const body = UpdateCartItemSchema.parse(request.body);

      const item = await fastify.prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
          variant: {
            include: {
              inventory: true,
            },
          },
        },
      });

      if (!item || item.cart.userId !== (request.user as any).id) {
        return reply.status(404).send({
          success: false,
          message: 'Cart item not found',
        });
      }

      if (body.quantity === 0) {
        await fastify.prisma.cartItem.delete({
          where: { id: itemId },
        });
        return {
          success: true,
          message: 'Item removed from cart',
        };
      }

      const availableStock = (item.variant.inventory?.quantity || 0) - (item.variant.inventory?.reserved || 0);
      if (availableStock < body.quantity) {
        return reply.status(400).send({
          success: false,
          message: 'Insufficient stock',
        });
      }

      await fastify.prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: body.quantity,
        },
      });

      return {
        success: true,
        message: 'Cart updated',
      };
    }
  );

  // Clear cart
  fastify.delete(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      await fastify.prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: (request.user as any).id,
          },
        },
      });

      return {
        success: true,
        message: 'Cart cleared',
      };
    }
  );
};

export default cartRoutes;
