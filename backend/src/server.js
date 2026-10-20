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

// Allow empty body with application/json without throwing FST_ERR_CTP_EMPTY_JSON_BODY
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = body && body.trim() ? JSON.parse(body) : {};
    done(null, json);
  } catch (err) {
    err.statusCode = 400;
    done(err, undefined);
  }
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
    const port = parseInt(process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '9000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`\n🚀 CampusHub Fastify Server is running at http://${host}:${port}`);
    console.log(`📡 Health Check: http://${host}:${port}/api/health\n`);

    // Connect to database in the background without blocking the container listen port
    initDatabase().catch(err => {
      console.error('[Database Init Error]', err);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
