import axios from 'axios';
import { getAuthToken } from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://mindnest-team-async.onrender.com'}/api/v1/ideas`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ideaService = {
  // Create a new idea
  createIdea: async (ideaData) => {
    const response = await apiClient.post('/', ideaData);
    return response.data;
  },

  // Get user's ideas
  getUserIdeas: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  // Get all ideas (admin)
  getAllIdeas: async () => {
    const response = await apiClient.get('/');
    return response.data;
  },

  // Get idea by ID
  getIdeaById: async (id) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Update idea status
  updateIdeaStatus: async (id, status) => {
    const response = await apiClient.patch(`/${id}/status`, { status });
    return response.data;
  },

  // Update idea score
  updateIdeaScore: async (id, score) => {
    const response = await apiClient.patch(`/${id}/score`, { score });
    return response.data;
  },

  // Update idea funding
  updateIdeaFunding: async (id, fundingAmount) => {
    const response = await apiClient.patch(`/${id}/fundingAmount`, { fundingAmount });
    return response.data;
  },

  // Update idea note
  updateIdeaNote: async (id, note) => {
    const response = await apiClient.patch(`/${id}/note`, { note });
    return response.data;
  },

  // Update idea tags
  updateIdeaTags: async (id, tags) => {
    const response = await apiClient.patch(`/${id}/tags`, { tags });
    return response.data;
  },
};