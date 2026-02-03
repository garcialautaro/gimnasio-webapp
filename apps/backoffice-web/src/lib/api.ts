import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKOFFICE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/auth/register', data),
  me: () =>
    api.get('/users/me'),
};

// Companies
export const companies = {
  getAll: () => api.get('/companies'),
  getOne: (id: string) => api.get(`/companies/${id}`),
  getBySlug: (slug: string) => api.get(`/companies/slug/${slug}`),
  create: (data: any) => api.post('/companies', data),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  delete: (id: string) => api.delete(`/companies/${id}`),
};

// Events
export const events = {
  getAll: (companyId?: string) =>
    api.get('/events', { params: { companyId } }),
  getOne: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// DayTimes
export const dayTimes = {
  getAll: (eventId?: string) =>
    api.get('/day-times', { params: { eventId } }),
  getOne: (id: string) => api.get(`/day-times/${id}`),
  getAvailable: (params: { eventId: string; startDate: string; endDate: string }) =>
    api.get('/day-times/available', { params }),
  create: (data: any) => api.post('/day-times', data),
  update: (id: string, data: any) => api.put(`/day-times/${id}`, data),
  delete: (id: string) => api.delete(`/day-times/${id}`),
};

// Bookings
export const bookings = {
  getAll: (params?: any) =>
    api.get('/bookings', { params }),
  getOne: (id: string) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};

export default api;
