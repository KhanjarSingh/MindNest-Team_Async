import { API_CONFIG } from '../config/api';

const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`


export const signupUser = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    let result = {};

    try {
      result = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('Failed to parse response:', text);
      throw new Error('Server returned invalid response. Please check if the backend is running.');
    }

    if (!response.ok) {
      throw new Error(result.message || `Sign up failed with status ${response.status}`);
    }


    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    if (result.user && result.user.role) {
      localStorage.setItem('userRole', result.user.role);
    }

    return result;
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw new Error(error.message || 'An error occurred during sign up');
  }
};


export const loginUser = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    let result = {};

    try {
      result = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('Failed to parse response:', text);
      throw new Error('Server returned invalid response. Please check if the backend is running.');
    }

    if (!response.ok) {
      throw new Error(result.message || `Login failed with status ${response.status}`);
    }

    // Store JWT token and role in localStorage
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    if (result.user && result.user.role) {
      localStorage.setItem('userRole', result.user.role);
    }

    return result;
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw new Error(error.message || 'An error occurred during login');
  }
};


export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};


export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};


export const getUserRole = () => {
  return localStorage.getItem('userRole');
};


export const isAuthenticated = () => {
  return !!getAuthToken();
};


export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};
