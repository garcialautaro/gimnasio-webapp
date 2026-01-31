import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_RESERVAS_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const companies = {
  getBySlug: (slug: string) => api.get(`/companies/slug/${slug}`),
};

export const events = {
  getByCompany: (companyId: string) => api.get(`/events/company/${companyId}`),
  getOne: (id: string) => api.get(`/events/${id}`),
};

export const dayTimes = {
  getAvailable: (eventId: string, startDate: string, endDate: string) =>
    api.get(`/day-times/available`, {
      params: { eventId, startDate, endDate },
    }),
};

export const bookings = {
  create: (data: any) => api.post('/bookings', data),
};

export default api;
