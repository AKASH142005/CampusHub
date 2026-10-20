import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }

});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campushub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and has expired token, clear
      if (localStorage.getItem('campushub_token')) {
        localStorage.removeItem('campushub_token');
        localStorage.removeItem('campushub_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const noticesAPI = {
  getAll: async (category = null) => {
    const params = category && category !== 'ALL' ? { category } : {};
    const res = await api.get('/notices', { params });
    return res.data.notices;
  },
  create: async (noticeData) => {
    const res = await api.post('/notices', noticeData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/notices/${id}`);
    return res.data;
  }
};

export const eventsAPI = {
  getAll: async () => {
    const res = await api.get('/events');
    return res.data.events;
  },
  getMyRSVPs: async () => {
    const res = await api.get('/events/my-rsvps');
    return res.data.rsvps;
  },
  create: async (eventData) => {
    const res = await api.post('/events', eventData);
    return res.data;
  },
  toggleRSVP: async (eventId) => {
    const res = await api.post(`/events/${eventId}/rsvp`, {});
    return res.data;
  }
};

export const marketplaceAPI = {
  getAll: async (category = null, type = null) => {
    const params = {};
    if (category && category !== 'ALL') params.category = category;
    if (type && type !== 'ALL') params.type = type;
    const res = await api.get('/marketplace', { params });
    return res.data.items;
  },
  create: async (itemData) => {
    const res = await api.post('/marketplace', itemData);
    return res.data;
  }
};

export const statsAPI = {
  getOverview: async () => {
    const res = await api.get('/stats/overview');
    return res.data.stats;
  }
};

export default api;
