import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject auth token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Fetch all stations with latest report & computed status */
export const fetchStations = () => api.get('/stations').then((r) => r.data.data);

/** Fetch a single station with full report history */
export const fetchStationById = (id) => api.get(`/stations/${id}`).then((r) => r.data.data);

/** Add a new station (admin only) */
export const addStation = (data) => api.post('/stations', data).then((r) => r.data.data);

/** Assign a manager to a station (admin only) */
export const assignManager = (stationId, manager_email) =>
  api.patch(`/stations/${stationId}/assign-manager`, { manager_email }).then((r) => r.data);

/** Submit a crowdsourced price/availability report */
export const submitReport = (data) => api.post('/reports', data).then((r) => r.data.data);

/** Upvote a report */
export const upvoteReport = (id) => api.patch(`/reports/${id}/upvote`).then((r) => r.data.data);

/** Downvote / flag a report as inaccurate */
export const downvoteReport = (id) => api.patch(`/reports/${id}/downvote`).then((r) => r.data.data);

/** Create a station manager account (admin only) */
export const createManager = (data) => api.post('/auth/create-manager', data).then((r) => r.data.data);

/** Fetch all station managers (admin only) */
export const fetchManagers = () => api.get('/auth/managers').then((r) => r.data.data);

/** Fetch stations assigned to the current manager */
export const fetchMyStations = () => api.get('/auth/my-stations').then((r) => r.data.data);

/** Fetch manager details including assigned stations (admin only) */
export const fetchManagerDetails = (id) => api.get(`/auth/managers/${id}`).then((r) => r.data.data);

/** Update manager profile info (admin only) */
export const updateManagerDetails = (id, data) => api.put(`/auth/managers/${id}`, data).then((r) => r.data.data);

/** Unassign a station from a manager (admin only) */
export const unassignStationFromManager = (id, stationId) => api.delete(`/auth/managers/${id}/stations/${stationId}`).then((r) => r.data);

/** Update a station's details (admin only) */
export const updateStationDetails = (id, data) => api.put(`/stations/${id}`, data).then((r) => r.data.data);

/** Delete a station (admin only) */
export const deleteStation = (id) => api.delete(`/stations/${id}`).then((r) => r.data);



