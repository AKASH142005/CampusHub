import bcrypt from 'bcryptjs';
import { db } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';

export default async function authRoutes(fastify, options) {
  // Register new user
  fastify.post('/register', async (request, reply) => {
    const { name, email, password, role = 'STUDENT', department, student_id } = request.body || {};

    if (!name || !email || !password) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Name, email, and password are required.'
      });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const user = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      department: department || 'General',
      student_id: student_id || null,
      avatar_url: defaultAvatar
    });

    const token = fastify.jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return reply.status(201).send({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        student_id: user.student_id,
        avatar_url: user.avatar_url
      }
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Email and password are required.'
      });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return {
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        student_id: user.student_id,
        avatar_url: user.avatar_url
      }
    };
  });

  // Current authenticated user profile
  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const user = await db.findUserById(request.user.id);
    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'User profile not found.'
      });
    }
    return { user };
  });
}
