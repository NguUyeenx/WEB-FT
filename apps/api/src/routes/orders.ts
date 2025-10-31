import { FastifyPluginAsync } from 'fastify';
import { CreateOrderSchema, generateOrderNumber, calculateTax, calculateShipping } from '@shoe-paradise/shared';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const ordersRoutes: FastifyPluginAsync = async (fastify) => {
  // Get user orders
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const orders = await fastify.prisma.order.findMany({
        where: { userId: (request.user as any).id },
        include: {
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

  // Get single order
  fastify.get(
    '/:id',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const order = await fastify.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
      });

      if (!order || order.userId !== ((request.user as any)).id) {
        return reply.status(404).send({
          success: false,
          message: 'Order not found',
        });
      }

      return {
        success: true,
        data: order,
      };
    }
  );

  // Create order and payment intent
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const body = CreateOrderSchema.parse(request.body);

      // Fetch variants with inventory
      const variants = await fastify.prisma.variant.findMany({
        where: {
          id: {
            in: body.items.map((item) => item.variantId),
          },
        },
        include: {
          product: true,
          inventory: true,
        },
      });

      if (variants.length !== body.items.length) {
        return reply.status(400).send({
          success: false,
          message: 'Some products not found',
        });
      }

      // Check stock availability
      for (const item of body.items) {
        const variant = variants.find((v: any) => v.id === item.variantId);
        if (!variant) continue;

        const availableStock = (variant.inventory?.quantity || 0) - (variant.inventory?.reserved || 0);
        if (availableStock < item.quantity) {
          return reply.status(400).send({
            success: false,
            message: `Insufficient stock for ${variant.product.name}`,
          });
        }
      }

      // Calculate totals
      const subtotal = body.items.reduce((sum: number, item: any) => {
        const variant = variants.find((v: any) => v.id === item.variantId)!;
        return sum + (variant.product.basePrice + variant.priceAdjustment) * item.quantity;
      }, 0);

      const tax = calculateTax(subtotal);
      const shipping = calculateShipping(subtotal);
      const total = subtotal + tax + shipping;

      // Create order
      const order = await fastify.prisma.order.create({
        data: {
          userId: ((request.user as any)).id,
          orderNumber: generateOrderNumber(),
          subtotal,
          tax,
          shipping,
          total,
          shippingAddressId: body.shippingAddressId,
          items: {
            create: body.items.map((item: any) => {
              const variant = variants.find((v: any) => v.id === item.variantId)!;
              return {
                variantId: item.variantId,
                quantity: item.quantity,
                price: variant.product.basePrice + variant.priceAdjustment,
                productName: variant.product.name,
                variantColor: variant.color,
                variantSize: variant.size,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      // Update order with payment intent ID
      await fastify.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentIntentId: paymentIntent.id,
        },
      });

      return {
        success: true,
        data: {
          order,
          clientSecret: paymentIntent.client_secret,
        },
      };
    }
  );

  // Stripe webhook
  fastify.post('/webhook', async (request, reply) => {
    const sig = request.headers['stripe-signature'] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        request.body as any,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        // Update order and decrement inventory in transaction
        await fastify.prisma.$transaction(async (tx: any) => {
          const order = await tx.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
            },
            include: {
              items: true,
            },
          });

          // Decrement inventory
          for (const item of order.items) {
            await tx.inventory.update({
              where: { variantId: item.variantId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            });
          }
        });
      }

      return { received: true };
    } catch (err: any) {
      return reply.status(400).send({
        success: false,
        message: err.message,
      });
    }
  });
};

export default ordersRoutes;
