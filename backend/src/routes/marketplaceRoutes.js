import { db } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

export default async function marketplaceRoutes(fastify, options) {
  // Get all marketplace and lost & found items
  fastify.get('/', async (request, reply) => {
    const { category, type } = request.query;
    const items = await db.getMarketplaceItems(category, type);
    return { items };
  });

  // Create new listing
  fastify.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const {
      title,
      description,
      category = 'OTHER',
      type = 'SELL',
      price = 0,
      location = 'Main Campus',
      seller_contact,
      image_url
    } = request.body || {};

    if (!title || !description) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Title and description are required.'
      });
    }

    const defaultImages = {
      TEXTBOOKS: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      ELECTRONICS: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600',
      HOSTEL_GEAR: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      LOST_AND_FOUND: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
      OTHER: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600'
    };

    const newItem = await db.createMarketplaceItem({
      title,
      description,
      category,
      type,
      price: parseFloat(price) || 0,
      location,
      seller_id: request.user.id,
      seller_name: request.user.name,
      seller_contact: seller_contact || request.user.email,
      image_url: image_url || defaultImages[category] || defaultImages.OTHER
    });

    return reply.status(201).send({
      message: 'Item listed successfully',
      item: newItem
    });
  });
}
