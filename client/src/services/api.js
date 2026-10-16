import axios from 'axios';

// Dynamically determine the backend API base URL
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  // Default to the deployed Render backend in production fallback or localhost in dev
  return import.meta.env.PROD
    ? 'https://alumni-mentor-connect-backend.onrender.com/api'
    : 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to requests safely
API.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('alumni_portal_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (err) {
      console.warn('Error reading token from localStorage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;

