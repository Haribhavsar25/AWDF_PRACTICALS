/**
 * Centralized API Service with JWT Token Injection & 401 Expiry Interception
 * ITUE301 Practical 7: Authentication & Middleware Pipeline
 */

const BASE_URL = 'http://localhost:5000';

export const getToken = () => localStorage.getItem('jwt_token');
export const setToken = (token) => localStorage.setItem('jwt_token', token);
export const clearToken = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
};

const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  // Handle Token Expiry / 401 Unauthorized globally (Supplementary Problem 2)
  if (response.status === 401) {
    clearToken();
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login?expired=true';
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.validationErrors
      ? data.validationErrors.join(', ')
      : data.error || `HTTP Error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

// 1. Auth Calls
export const registerUser = (email, password) => {
  return authFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const loginUser = (email, password) => {
  return authFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

// 2. /me Endpoint (Supplementary Problem 1)
export const getMe = () => {
  return authFetch('/me');
};

// 3. Protected Task Operations
export const getTasks = () => {
  return authFetch('/tasks');
};

export const createTask = (taskData) => {
  return authFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
};

export const updateTask = (id, taskData) => {
  return authFetch(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
};

export const deleteTask = (id) => {
  return authFetch(`/tasks/${id}`, {
    method: 'DELETE'
  });
};
