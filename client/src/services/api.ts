import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autopazar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 durumunda logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('autopazar_token');
      localStorage.removeItem('autopazar_user');
      if (window.location.pathname !== '/giris') {
        window.location.href = '/giris';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
