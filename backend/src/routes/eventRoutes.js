import { db } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

export default async function eventRoutes(fastify, options) {
  // Get all events
  fastify.get('/', async (request, reply) => {
    const events = await db.getEvents();
    return { events };
  });

  // Get user's RSVPs
  fastify.get('/my-rsvps', { preHandler: [authenticate] }, async (request, reply) => {
    const rsvpEventIds = await db.getUserRSVPs(request.user.id);
    return { rsvps: rsvpEventIds };
  });

  // Create event
  fastify.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const { title, description, category = 'WORKSHOP', venue, event_date, max_capacity = 100, banner_url } = request.body || {};

    if (!title || !description || !venue || !event_date) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Title, description, venue, and date are required.'
      });
    }

    const defaultBanner = banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

    const newEvent = await db.createEvent({
      title,
      description,
      category,
      venue,
      event_date,
      organizer_id: request.user.id,
      organizer_name: request.user.name,
      max_capacity: Number(max_capacity) || 100,
      banner_url: defaultBanner
    });

    return reply.status(201).send({
      message: 'Event published successfully',
      event: newEvent
    });
  });

  // Toggle RSVP
  fastify.post('/:id/rsvp', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const result = await db.toggleRSVP(id, request.user.id);
    return {
      message: result.isRSVPed ? 'RSVP confirmed' : 'RSVP cancelled',
      isRSVPed: result.isRSVPed
    };
  });
}
