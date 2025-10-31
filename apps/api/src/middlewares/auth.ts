import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      success: false,
      message: 'Authentication required',
    });
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    
    if (!request.user || request.user.role !== 'ADMIN') {
      reply.status(403).send({
        success: false,
        message: 'Admin access required',
      });
    }
  } catch (err) {
    reply.status(401).send({
      success: false,
      message: 'Authentication required',
    });
  }
}
