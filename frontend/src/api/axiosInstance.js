import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aquaquest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      if (localStorage.getItem('aquaquest_token')) {
        localStorage.removeItem('aquaquest_token');
        localStorage.removeItem('aquaquest_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
