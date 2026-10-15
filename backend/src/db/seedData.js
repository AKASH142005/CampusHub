import bcrypt from 'bcryptjs';

export const initialUsers = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    email: 'admin@campushub.edu',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'ADMIN',
    department: 'Administration',
    student_id: 'ADM-001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 2,
    name: 'Prof. Alan Vance',
    email: 'faculty@campushub.edu',
    password: bcrypt.hashSync('Faculty@123', 10),
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    student_id: 'FAC-104',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 3,
    name: 'Alex Rivera',
    email: 'student@campushub.edu',
    password: bcrypt.hashSync('Student@123', 10),
    role: 'STUDENT',
    department: 'Software Engineering',
    student_id: 'CS-2023-042',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  }
];

export const initialNotices = [
  {
    id: 1,
    title: 'Mid-Semester Examination Schedule Announced',
    content: 'The mid-semester timetable for all engineering and science departments has been released. Exams commence on November 3rd. Please check your department portal for hall tickets.',
    category: 'EXAM',
    priority: 'HIGH',
    author_id: 1,
    author_name: 'Dr. Sarah Mitchell',
    is_pinned: 1,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 2,
    title: 'Annual Campus Innovation Hackathon 2026 Registrations Open',
    content: 'Teams of 2-4 can register for the 36-hour hackathon hosted at the Main Tech Auditorium. Cash prizes worth $5,000 to be won. Mentorship from top tech companies.',
    category: 'EVENT',
    priority: 'MEDIUM',
    author_id: 2,
    author_name: 'Prof. Alan Vance',
    is_pinned: 1,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 3,
    title: 'Library Extended Hours During Finals Preparation',
    content: 'Starting next Monday, the Central Campus Library will remain open 24/7 with reserved quiet study zones, complimentary high-speed Wi-Fi, and coffee kiosks.',
    category: 'ACADEMIC',
    priority: 'MEDIUM',
    author_id: 1,
    author_name: 'Dr. Sarah Mitchell',
    is_pinned: 0,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 4,
    title: 'Urgent: Campus Server Maintenance Window Tonight',
    content: 'Campus intranet and local LMS access will undergo scheduled maintenance between 1:00 AM and 4:00 AM. Cloud services will remain operational.',
    category: 'URGENT',
    priority: 'CRITICAL',
    author_id: 1,
    author_name: 'Dr. Sarah Mitchell',
    is_pinned: 0,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString()
  }
];

export const initialEvents = [
  {
    id: 1,
    title: 'AI & Quantum Computing Summit 2026',
    description: 'A deep dive into cutting-edge machine learning models, autonomous agents, and the frontier of quantum algorithms with keynote guest speakers from industry.',
    category: 'SEMINAR',
    venue: 'Auditorium Hall A, Turing Block',
    event_date: new Date(Date.now() + 86400000 * 4).toISOString(),
    organizer_id: 2,
    organizer_name: 'Prof. Alan Vance',
    max_capacity: 250,
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Campus HackMatrix: 36-Hour Hackathon',
    description: 'Build web, mobile, and AI solutions addressing sustainability, education, and health. Hardware components and cloud credits will be provided.',
    category: 'HACKATHON',
    venue: 'Innovation Hub, 3rd Floor',
    event_date: new Date(Date.now() + 86400000 * 10).toISOString(),
    organizer_id: 2,
    organizer_name: 'Prof. Alan Vance',
    max_capacity: 120,
    banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Full-Stack Modern Web Engineering Workshop',
    description: 'Hands-on training session covering Fastify, React 19, state architecture, and micro-frontend design patterns. Bring your laptops!',
    category: 'WORKSHOP',
    venue: 'Computer Lab 4B',
    event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    organizer_id: 2,
    organizer_name: 'Prof. Alan Vance',
    max_capacity: 60,
    banner_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    created_at: new Date().toISOString()
  }
];

export const initialRSVPs = [
  { id: 1, event_id: 1, user_id: 3, status: 'CONFIRMED', rsvp_date: new Date().toISOString() },
  { id: 2, event_id: 2, user_id: 3, status: 'CONFIRMED', rsvp_date: new Date().toISOString() }
];

export const initialMarketplaceItems = [
  {
    id: 1,
    title: 'Calculus Early Transcendentals (8th Ed.) - Stewart',
    description: 'Hardcover in excellent condition with minimal highlighting. Essential for Calculus I & II courses.',
    category: 'TEXTBOOKS',
    type: 'SELL',
    price: 35.00,
    location: 'North Campus Dormitory B',
    seller_id: 3,
    seller_name: 'Alex Rivera',
    seller_contact: 'student@campushub.edu / +1-555-0192',
    status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 2,
    title: 'Texas Instruments TI-84 Plus CE Graphing Calculator',
    description: 'Color screen, rechargeable battery, cable included. Barely used during one semester of stats.',
    category: 'ELECTRONICS',
    type: 'SELL',
    price: 65.00,
    location: 'Science Library Courtyard',
    seller_id: 3,
    seller_name: 'Alex Rivera',
    seller_contact: 'student@campushub.edu / +1-555-0192',
    status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 3,
    title: 'Found: Hydro Flask Blue Water Bottle (Gym Area)',
    description: 'Found near the campus fitness center locker rooms on Tuesday evening. Has a sticker of a pine tree.',
    category: 'LOST_AND_FOUND',
    type: 'FOUND',
    price: 0.00,
    location: 'Campus Security Lost Desk / Student Union',
    seller_id: 3,
    seller_name: 'Alex Rivera',
    seller_contact: 'student@campushub.edu',
    status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];
