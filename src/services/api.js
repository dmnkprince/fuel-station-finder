import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

/** Fetch all stations with latest report & computed status */
export const fetchStations = () => api.get('/stations').then((r) => r.data.data);

/** Fetch a single station with full report history */
export const fetchStationById = (id) => api.get(`/stations/${id}`).then((r) => r.data.data);

/** Add a new station */
export const addStation = (data) => api.post('/stations', data).then((r) => r.data.data);

/** Submit a crowdsourced price/availability report */
export const submitReport = (data) => api.post('/reports', data).then((r) => r.data.data);

/** Upvote a report */
export const upvoteReport = (id) => api.patch(`/reports/${id}/upvote`).then((r) => r.data.data);
