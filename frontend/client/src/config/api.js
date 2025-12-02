// API Configuration
const getApiUrl = () => {
  // Check if we're in development or production
  // const isDevelopment = import.meta.env.DEV;
  
    return import.meta.env.VITE_API_URL_PRODUCTION || 'https://mindnest-team-async.onrender.com';

};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    AUTH: '/api/v1/auth',
    IDEAS: '/api/v1/ideas',
    CHAT: '/api/v1/chat'
  }
};

export default API_CONFIG;