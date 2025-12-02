import axios from 'axios';
import { getAuthToken } from './authService';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`;

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