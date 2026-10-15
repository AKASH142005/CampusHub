import { db } from '../db/connection.js';

export default async function statsRoutes(fastify, options) {
  fastify.get('/overview', async (request, reply) => {
    const stats = await db.getDashboardStats();
    return { stats };
  });
}
