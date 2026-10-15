import { db } from '../db/connection.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function noticeRoutes(fastify, options) {
  // Get all notices
  fastify.get('/', async (request, reply) => {
    const { category } = request.query;
    const notices = await db.getNotices(category);
    return { notices };
  });

  // Create notice (Faculty and Admin only)
  fastify.post('/', { preHandler: [authenticate, requireRole('FACULTY', 'ADMIN')] }, async (request, reply) => {
    const { title, content, category = 'GENERAL', priority = 'MEDIUM', is_pinned = false } = request.body || {};

    if (!title || !content) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Title and content are required.'
      });
    }

    const newNotice = await db.createNotice({
      title,
      content,
      category,
      priority,
      author_id: request.user.id,
      author_name: request.user.name,
      is_pinned
    });

    return reply.status(201).send({
      message: 'Notice posted successfully',
      notice: newNotice
    });
  });

  // Delete notice (Admin or Author)
  fastify.delete('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const notices = await db.getNotices();
    const notice = notices.find(n => n.id === Number(id));

    if (!notice) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Notice not found.'
      });
    }

    if (request.user.role !== 'ADMIN' && notice.author_id !== request.user.id) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'You are not authorized to delete this announcement.'
      });
    }

    await db.deleteNotice(id);
    return { message: 'Notice deleted successfully' };
  });
}
