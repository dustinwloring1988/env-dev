import axios from 'axios';
import type {
  AuthResponse,
  AppsResponse,
  AppResponse,
  SecretsResponse,
  SecretResponse,
  User,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),
  me: () => api.get<{ user: User }>('/auth/me'),
};

export const appApi = {
  getApps: () => api.get<AppsResponse>('/apps'),
  getApp: (id: string) => api.get<AppResponse>(`/apps/${id}`),
  createApp: (name: string, description?: string) =>
    api.post<AppResponse>('/apps', { name, description }),
  updateApp: (id: string, name?: string, description?: string | null) =>
    api.put<AppResponse>(`/apps/${id}`, { name, description }),
  deleteApp: (id: string) => api.delete(`/apps/${id}`),
  regenerateKey: (id: string) =>
    api.post<AppResponse>(`/apps/${id}/regenerate-key`),
};

export const secretApi = {
  getSecrets: (appId: string) =>
    api.get<SecretsResponse>(`/apps/${appId}/secrets`),
  getSecret: (appId: string, key: string) =>
    api.get<SecretResponse>(`/apps/${appId}/secrets/${key}`),
  createSecret: (appId: string, key: string, value: string) =>
    api.post<SecretResponse>(`/apps/${appId}/secrets`, { key, value }),
  updateSecret: (appId: string, key: string, data: { key?: string; value?: string }) =>
    api.put<SecretResponse>(`/apps/${appId}/secrets/${key}`, data),
  deleteSecret: (appId: string, key: string) =>
    api.delete(`/apps/${appId}/secrets/${key}`),
};

export default api;
