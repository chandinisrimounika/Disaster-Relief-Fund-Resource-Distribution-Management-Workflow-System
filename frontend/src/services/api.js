import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const UserAPI = {
  getAll: (role) => api.get('/users', { params: { role } }),
  create: (data) => api.post('/users', data),
  getById: (id) => api.get(`/users/${id}`),
};

export const EventAPI = {
  getAll: (activeOnly) => api.get('/events', { params: { activeOnly } }),
  create: (data) => api.post('/events', data),
  updateStatus: (id, status) => api.put(`/events/${id}/status`, null, { params: { status } }),
  getById: (id) => api.get(`/events/${id}`),
};

export const DonationAPI = {
  process: (data) => api.post('/donations', data),
  getAll: () => api.get('/donations'),
  getByDonor: (donorId) => api.get(`/donations/donor/${donorId}`),
  getTotalForEvent: (eventId) => api.get(`/donations/event/${eventId}/total`),
};

export const AllocationAPI = {
  allocate: (data) => api.post('/allocations', data),
  getAll: () => api.get('/allocations'),
  getByEvent: (eventId) => api.get(`/allocations/event/${eventId}`),
  getRemaining: (eventId) => api.get(`/allocations/event/${eventId}/remaining`),
};

export const ResourceAPI = {
  add: (data) => api.post('/resources', data),
  getAllItems: () => api.get('/resources'),
  getInventory: () => api.get('/inventory'),
  updateInventory: (itemId, quantity, coordinatorId) => 
    api.put(`/inventory/${itemId}`, null, { params: { quantity, coordinatorId } }),
};

export const DistributionAPI = {
  distribute: (data) => api.post('/distributions', data),
  getAll: () => api.get('/distributions'),
  getByEvent: (eventId) => api.get(`/distributions/event/${eventId}`),
};

export default api;
