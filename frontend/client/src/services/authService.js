/**
 * Authentication Service
 * Handles all auth-related API calls
 */

const API_BASE_URL = '/api/v1/auth';

/**
 * Sign up a new user
 * @param {Object} data - { username, email, password, role, adminSecret }
 * @returns {Promise<Object>} Response from backend
 */
export const signupUser = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Sign up failed');
    }

    const result = await response.json();

    // Store JWT token and role in localStorage
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    if (result.user && result.user.role) {
      localStorage.setItem('userRole', result.user.role);
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'An error occurred during sign up');
  }
};

/**
 * Sign in a user
 * @param {Object} data - { email, password }
 * @returns {Promise<Object>} Response from backend with JWT token and user data
 */
export const loginUser = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const result = await response.json();

    // Store JWT token and role in localStorage
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    if (result.user && result.user.role) {
      localStorage.setItem('userRole', result.user.role);
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'An error occurred during login');
  }
};

/**
 * Log out user (clear token and role)
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get stored user role
 * @returns {string|null} User role (PARTICIPANT or ADMIN) or null
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Check if user is admin
 * @returns {boolean} True if user role is ADMIN
 */
export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};
