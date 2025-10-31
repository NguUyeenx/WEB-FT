import { FastifyRequest, FastifyReply } from 'fastify';

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
    const user = request.user as any;
    
    if (!user || user.role !== 'ADMIN') {
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
