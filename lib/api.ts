import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

let accessTokenStore: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessTokenStore = token;
}

export function getAccessToken(): string | null {
  return accessTokenStore;
}

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessTokenStore) {
    config.headers.Authorization = `Bearer ${accessTokenStore}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const token = response.data?.data?.accessToken;
    if (token) {
      setAccessToken(token);
      return token;
    }
    return null;
  } catch {
    setAccessToken(null);
    return null;
  }
}

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

export const panelApi = {
  getAll: () => api.get('/panels'),
  create: (data: object) => api.post('/panels', data),
  getById: (id: string) => api.get(`/panels/${id}`),
  update: (id: string, data: object) => api.put(`/panels/${id}`, data),
  delete: (id: string) => api.delete(`/panels/${id}`),
  getReadings: (id: string, params?: object) => api.get(`/panels/${id}/readings`, { params }),
  getAlerts: (id: string, params?: object) => api.get(`/panels/${id}/alerts`, { params }),
  getSummary: (id: string) => api.get(`/panels/${id}/summary`),
  getAnalysis: (id: string) => api.get(`/panels/${id}/analysis`),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getAlerts: (params?: object) => api.get('/dashboard/alerts', { params }),
  getEnergy: (params?: object) => api.get('/dashboard/energy', { params }),
};

export const alertApi = {
  getAll: (params?: object) => api.get('/alerts', { params }),
  resolve: (id: string) => api.patch(`/alerts/${id}/resolve`),
  unresolve: (id: string) => api.patch(`/alerts/${id}/unresolve`),
};

export const systemApi = {
  getConfig: () => api.get('/system/config'),
  updateConfig: (data: object) => api.put('/system/config', data),
  getHealth: () => api.get('/system/health'),
};

export interface PaymentVerifyData {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const paymentApi = {
  createOrder: (plan: string) => api.post('/payments/create-order', { plan }),
  verifyPayment: (data: PaymentVerifyData) => api.post('/payments/verify', data),
  getHistory: () => api.get('/payments/history'),
  getSubscription: () => api.get('/payments/subscription'),
};

export default api;
