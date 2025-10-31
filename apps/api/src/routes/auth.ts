import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import { RegisterSchema, LoginSchema } from '@shoe-paradise/shared';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post('/register', async (request, reply) => {
    const body = RegisterSchema.parse(request.body);

    // Check if user exists
    const existingUser = await fastify.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return reply.status(400).send({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await fastify.prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Generate access token
    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.send({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const body = LoginSchema.parse(request.body);

    // Find user
    const user = await fastify.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      return reply.status(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate access token
    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    });
  });

  // Get current user
  fastify.get(
    '/me',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const user = await fastify.prisma.user.findUnique({
        where: { id: request.user!.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return reply.send({
        success: true,
        data: user,
      });
    }
  );
};

export default authRoutes;
