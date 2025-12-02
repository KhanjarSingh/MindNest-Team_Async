import axios from 'axios';
import { getAuthToken } from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://mindnest-team-async.onrender.com'}/api/v1/chat`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatService = {
  sendMessage: async (receiverId, content) => {
    const response = await apiClient.post('/send', { receiverId, content });
    return response.data;
  },

  getChatHistory: async (receiverId) => {
    const response = await apiClient.get(`/history/${receiverId}`);
    return response.data;
  },

  getConversations: async () => {
    const response = await apiClient.get('/conversations');
    return response.data;
  }
};