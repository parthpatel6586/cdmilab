import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://cdmi2-3.onrender.com',
});

// Attach JWT token from localStorage automatically
api.interceptors.request.use((config) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (adminInfo) {
    const { token } = JSON.parse(adminInfo);
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
