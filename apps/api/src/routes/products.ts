import { FastifyPluginAsync } from 'fastify';
import { ProductFilterSchema } from '@shoe-paradise/shared';

const productsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all products with filters
  fastify.get('/', async (request) => {
    const query = ProductFilterSchema.parse(request.query);

    const where: any = {
      isActive: true,
    };

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.brandId) where.brandId = query.brandId;
    if (query.gender) where.gender = query.gender;
    if (query.material) where.material = { contains: query.material, mode: 'insensitive' };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.minPrice || query.maxPrice) {
      where.basePrice = {};
      if (query.minPrice) where.basePrice.gte = query.minPrice;
      if (query.maxPrice) where.basePrice.lte = query.maxPrice;
    }

    // Count total
    const total = await fastify.prisma.product.count({ where });

    // Build orderBy
    let orderBy: any = {};
    if (query.sort === 'price-asc') orderBy = { basePrice: 'asc' };
    else if (query.sort === 'price-desc') orderBy = { basePrice: 'desc' };
    else if (query.sort === 'name-asc') orderBy = { name: 'asc' };
    else if (query.sort === 'name-desc') orderBy = { name: 'desc' };
    else if (query.sort === 'newest') orderBy = { createdAt: 'desc' };
    else orderBy = { featured: 'desc' };

    // Fetch products
    const products = await fastify.prisma.product.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    });

    return {
      success: true,
      data: products,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  });

  // Get single product
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const product = await fastify.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: 'asc' },
        },
        variants: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            inventory: true,
          },
        },
        reviews: {
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
          take: 10,
        },
      },
    });

    if (!product) {
      return reply.status(404).send({
        success: false,
        message: 'Product not found',
      });
    }

    return {
      success: true,
      data: product,
    };
  });

  // Get featured products
  fastify.get('/featured/list', async () => {
    const products = await fastify.prisma.product.findMany({
      where: {
        featured: true,
        isActive: true,
      },
      take: 8,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });

    return {
      success: true,
      data: products,
    };
  });
};

export default productsRoutes;
