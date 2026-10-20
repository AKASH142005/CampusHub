import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {
  initialUsers,
  initialNotices,
  initialEvents,
  initialRSVPs,
  initialMarketplaceItems
} from './seedData.js';

dotenv.config();

let pool = null;
let isUsingMySQL = false;

// In-memory fallback stores
const memoryStore = {
  users: [...initialUsers],
  notices: [...initialNotices],
  events: [...initialEvents],
  event_rsvps: [...initialRSVPs],
  marketplace_items: [...initialMarketplaceItems]
};

let nextIds = {
  users: 10,
  notices: 10,
  events: 10,
  event_rsvps: 10,
  marketplace_items: 10
};

export async function initDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    connectTimeout: 3000
  };

  try {
    // Attempt initial connection to MySQL server
    const tempConnection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME;

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await tempConnection.end();

    // Connect to specific database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('STUDENT', 'FACULTY', 'ADMIN') DEFAULT 'STUDENT',
        department VARCHAR(100) DEFAULT 'Computer Science',
        student_id VARCHAR(50),
        avatar_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        category ENUM('ACADEMIC', 'EXAM', 'EVENT', 'GENERAL', 'URGENT') DEFAULT 'GENERAL',
        priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
        author_id INT NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        is_pinned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category ENUM('WORKSHOP', 'HACKATHON', 'SEMINAR', 'CULTURAL', 'SPORTS') DEFAULT 'WORKSHOP',
        venue VARCHAR(150) NOT NULL,
        event_date DATETIME NOT NULL,
        organizer_id INT NOT NULL,
        organizer_name VARCHAR(100) NOT NULL,
        max_capacity INT DEFAULT 100,
        banner_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS event_rsvps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('CONFIRMED', 'WAITLISTED', 'CANCELLED') DEFAULT 'CONFIRMED',
        rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_rsvp (event_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS marketplace_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category ENUM('TEXTBOOKS', 'ELECTRONICS', 'HOSTEL_GEAR', 'LOST_AND_FOUND', 'OTHER') DEFAULT 'OTHER',
        type ENUM('SELL', 'BUY', 'LOST', 'FOUND') DEFAULT 'SELL',
        price DECIMAL(10, 2) DEFAULT 0.00,
        location VARCHAR(150),
        seller_id INT NOT NULL,
        seller_name VARCHAR(100) NOT NULL,
        seller_contact VARCHAR(100) NOT NULL,
        status ENUM('AVAILABLE', 'SOLD', 'RESOLVED') DEFAULT 'AVAILABLE',
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Check if initial users exist, seed if empty
    const [existingUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      for (const u of initialUsers) {
        await pool.query(
          'INSERT INTO users (name, email, password, role, department, student_id, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [u.name, u.email, u.password, u.role, u.department, u.student_id, u.avatar_url]
        );
      }
      for (const n of initialNotices) {
        await pool.query(
          'INSERT INTO notices (title, content, category, priority, author_id, author_name, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [n.title, n.content, n.category, n.priority, n.author_id, n.author_name, n.is_pinned]
        );
      }
      for (const e of initialEvents) {
        await pool.query(
          'INSERT INTO events (title, description, category, venue, event_date, organizer_id, organizer_name, max_capacity, banner_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [e.title, e.description, e.category, e.venue, new Date(e.event_date), e.organizer_id, e.organizer_name, e.max_capacity, e.banner_url]
        );
      }
      for (const r of initialRSVPs) {
        await pool.query(
          'INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, ?)',
          [r.event_id, r.user_id, r.status]
        );
      }
      for (const m of initialMarketplaceItems) {
        await pool.query(
          'INSERT INTO marketplace_items (title, description, category, type, price, location, seller_id, seller_name, seller_contact, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [m.title, m.description, m.category, m.type, m.price, m.location, m.seller_id, m.seller_name, m.seller_contact, m.status, m.image_url]
        );
      }
    }

    isUsingMySQL = true;
    console.log(`[Database] Successfully connected to MySQL database: ${dbName}`);
  } catch (error) {
    isUsingMySQL = false;
    console.warn(`[Database Warning] MySQL connection failed (${error.message}).`);
    console.warn('[Database Fallback] CampusHub is running in high-performance memory mock mode with seeded data.');
    console.warn('[Database Notice] Configure DB_USER & DB_PASSWORD in backend/.env to connect to your live MySQL instance.');
  }
}

export const db = {
  isMySQL: () => isUsingMySQL,

  // USERS
  async findUserByEmail(email) {
    if (isUsingMySQL) {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    }
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isUsingMySQL) {
      const [rows] = await pool.query('SELECT id, name, email, role, department, student_id, avatar_url, created_at FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    }
    const u = memoryStore.users.find(u => u.id === Number(id));
    if (!u) return null;
    const { password, ...safeUser } = u;
    return safeUser;
  },

  async createUser(userData) {
    if (isUsingMySQL) {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, department, student_id, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.role || 'STUDENT', userData.department || 'General', userData.student_id || null, userData.avatar_url || '']
      );
      return { id: result.insertId, ...userData };
    }
    const newUser = {
      id: nextIds.users++,
      ...userData,
      role: userData.role || 'STUDENT',
      created_at: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  // NOTICES
  async getNotices(filterCategory = null) {
    if (isUsingMySQL) {
      let query = 'SELECT * FROM notices';
      const params = [];
      if (filterCategory && filterCategory !== 'ALL') {
        query += ' WHERE category = ?';
        params.push(filterCategory);
      }
      query += ' ORDER BY is_pinned DESC, created_at DESC';
      const [rows] = await pool.query(query, params);
      return rows;
    }
    let list = [...memoryStore.notices];
    if (filterCategory && filterCategory !== 'ALL') {
      list = list.filter(n => n.category === filterCategory);
    }
    return list.sort((a, b) => (b.is_pinned - a.is_pinned) || (new Date(b.created_at) - new Date(a.created_at)));
  },

  async createNotice(noticeData) {
    if (isUsingMySQL) {
      const [result] = await pool.query(
        'INSERT INTO notices (title, content, category, priority, author_id, author_name, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [noticeData.title, noticeData.content, noticeData.category, noticeData.priority, noticeData.author_id, noticeData.author_name, noticeData.is_pinned ? 1 : 0]
      );
      return { id: result.insertId, ...noticeData, created_at: new Date() };
    }
    const newNotice = {
      id: nextIds.notices++,
      ...noticeData,
      is_pinned: noticeData.is_pinned ? 1 : 0,
      created_at: new Date().toISOString()
    };
    memoryStore.notices.unshift(newNotice);
    return newNotice;
  },

  async deleteNotice(id) {
    if (isUsingMySQL) {
      await pool.query('DELETE FROM notices WHERE id = ?', [id]);
      return true;
    }
    const idx = memoryStore.notices.findIndex(n => n.id === Number(id));
    if (idx !== -1) {
      memoryStore.notices.splice(idx, 1);
      return true;
    }
    return false;
  },

  // EVENTS
  async getEvents() {
    if (isUsingMySQL) {
      const [rows] = await pool.query(`
        SELECT e.*, COUNT(r.id) as rsvp_count 
        FROM events e 
        LEFT JOIN event_rsvps r ON e.id = r.event_id AND r.status = 'CONFIRMED'
        GROUP BY e.id
        ORDER BY e.event_date ASC
      `);
      return rows;
    }
    return memoryStore.events.map(ev => {
      const rsvpCount = memoryStore.event_rsvps.filter(r => r.event_id === ev.id && r.status === 'CONFIRMED').length;
      return { ...ev, rsvp_count: rsvpCount };
    }).sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  },

  async createEvent(eventData) {
    if (isUsingMySQL) {
      const [result] = await pool.query(
        'INSERT INTO events (title, description, category, venue, event_date, organizer_id, organizer_name, max_capacity, banner_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [eventData.title, eventData.description, eventData.category, eventData.venue, new Date(eventData.event_date), eventData.organizer_id, eventData.organizer_name, eventData.max_capacity || 100, eventData.banner_url || '']
      );
      return { id: result.insertId, ...eventData, rsvp_count: 0, created_at: new Date() };
    }
    const newEvent = {
      id: nextIds.events++,
      ...eventData,
      rsvp_count: 0,
      created_at: new Date().toISOString()
    };
    memoryStore.events.push(newEvent);
    return newEvent;
  },

  async toggleRSVP(eventId, userId) {
    eventId = Number(eventId);
    userId = Number(userId);

    if (isUsingMySQL) {
      const [existing] = await pool.query('SELECT * FROM event_rsvps WHERE event_id = ? AND user_id = ?', [eventId, userId]);
      if (existing.length > 0) {
        await pool.query('DELETE FROM event_rsvps WHERE event_id = ? AND user_id = ?', [eventId, userId]);
        return { isRSVPed: false };
      } else {
        await pool.query("INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, 'CONFIRMED')", [eventId, userId]);
        return { isRSVPed: true };
      }
    }

    const idx = memoryStore.event_rsvps.findIndex(r => r.event_id === eventId && r.user_id === userId);
    if (idx !== -1) {
      memoryStore.event_rsvps.splice(idx, 1);
      return { isRSVPed: false };
    } else {
      memoryStore.event_rsvps.push({
        id: nextIds.event_rsvps++,
        event_id: eventId,
        user_id: userId,
        status: 'CONFIRMED',
        rsvp_date: new Date().toISOString()
      });
      return { isRSVPed: true };
    }
  },

  async getUserRSVPs(userId) {
    userId = Number(userId);
    if (isUsingMySQL) {
      const [rows] = await pool.query("SELECT event_id FROM event_rsvps WHERE user_id = ? AND status = 'CONFIRMED'", [userId]);
      return rows.map(r => r.event_id);
    }
    return memoryStore.event_rsvps.filter(r => r.user_id === userId && r.status === 'CONFIRMED').map(r => r.event_id);
  },

  // MARKETPLACE
  async getMarketplaceItems(category = null, type = null) {
    if (isUsingMySQL) {
      let query = 'SELECT * FROM marketplace_items WHERE 1=1';
      const params = [];
      if (category && category !== 'ALL') {
        query += ' AND category = ?';
        params.push(category);
      }
      if (type && type !== 'ALL') {
        query += ' AND type = ?';
        params.push(type);
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(query, params);
      return rows;
    }
    let list = [...memoryStore.marketplace_items];
    if (category && category !== 'ALL') {
      list = list.filter(i => i.category === category);
    }
    if (type && type !== 'ALL') {
      list = list.filter(i => i.type === type);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createMarketplaceItem(itemData) {
    if (isUsingMySQL) {
      const [result] = await pool.query(
        'INSERT INTO marketplace_items (title, description, category, type, price, location, seller_id, seller_name, seller_contact, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [itemData.title, itemData.description, itemData.category, itemData.type, itemData.price || 0, itemData.location, itemData.seller_id, itemData.seller_name, itemData.seller_contact, 'AVAILABLE', itemData.image_url || '']
      );
      return { id: result.insertId, ...itemData, status: 'AVAILABLE', created_at: new Date() };
    }
    const newItem = {
      id: nextIds.marketplace_items++,
      ...itemData,
      status: 'AVAILABLE',
      created_at: new Date().toISOString()
    };
    memoryStore.marketplace_items.unshift(newItem);
    return newItem;
  },

  // STATS
  async getDashboardStats() {
    if (isUsingMySQL) {
      const [[users]] = await pool.query('SELECT COUNT(*) as total_users FROM users');
      const [[events]] = await pool.query('SELECT COUNT(*) as total_events FROM events');
      const [[notices]] = await pool.query('SELECT COUNT(*) as total_notices FROM notices');
      const [[items]] = await pool.query("SELECT COUNT(*) as total_items FROM marketplace_items WHERE status = 'AVAILABLE'");
      return {
        totalUsers: users.total_users,
        totalEvents: events.total_events,
        totalNotices: notices.total_notices,
        activeListings: items.total_items,
        dbEngine: 'MySQL Server'
      };
    }
    return {
      totalUsers: memoryStore.users.length,
      totalEvents: memoryStore.events.length,
      totalNotices: memoryStore.notices.length,
      activeListings: memoryStore.marketplace_items.filter(i => i.status === 'AVAILABLE').length,
      dbEngine: 'In-Memory (MySQL Fallback Mode)'
    };
  }
};
