import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import sensible from '@fastify/sensible';
import dotenv from 'dotenv';
import { initDatabase } from './db/connection.js';

import authRoutes from './routes/authRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const fastify = Fastify({
  logger: true
});

// Plugins
await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'campushub_secret_key_default_2026'
});

await fastify.register(sensible);

// Health check
fastify.get('/api/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CampusHub Backend API'
  };
});

// Modular Routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(noticeRoutes, { prefix: '/api/notices' });
await fastify.register(eventRoutes, { prefix: '/api/events' });
await fastify.register(marketplaceRoutes, { prefix: '/api/marketplace' });
await fastify.register(statsRoutes, { prefix: '/api/stats' });

const start = async () => {
  try {
    await initDatabase();
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`\n🚀 CampusHub Fastify Server is running at http://localhost:${port}`);
    console.log(`📡 Health Check: http://localhost:${port}/api/health\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
