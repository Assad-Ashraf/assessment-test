import axios, { AxiosError } from 'axios';
import { LoginCredentials, LoginResponse, DashboardData, ApiError } from '../types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5283/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('token');
      Cookies.remove('username');
      Cookies.remove('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/auth/dashboard');
    return response.data;
  },
};

export const userApi = {
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  searchUsers: async (searchRequest: UserSearchRequest) => {
    const response = await apiClient.post('/users/search', searchRequest);
    return response.data;
  },
  
  getUserById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  getPagedUsers: async (page: number = 1, pageSize: number = 10) => {
    const response = await apiClient.get(`/users/paged?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
};

export default apiClient;