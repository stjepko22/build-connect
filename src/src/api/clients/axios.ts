import axios from 'axios';
import { authTokenStorageKey, authUnauthorizedEventName, authUserStorageKey } from '@/modules/authentication/constants/authStorage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:56602/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Language': 'hr',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(authTokenStorageKey);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const hasStoredToken = !!localStorage.getItem(authTokenStorageKey);
    const shouldHandleUnauthorized =
      error.response?.status === 401 &&
      hasStoredToken &&
      !requestUrl.includes('/auth/login');

    if (shouldHandleUnauthorized) {
      localStorage.removeItem(authUserStorageKey);
      localStorage.removeItem(authTokenStorageKey);
      window.dispatchEvent(new CustomEvent(authUnauthorizedEventName));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
