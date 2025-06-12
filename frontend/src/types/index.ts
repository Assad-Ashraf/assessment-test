export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    username: string;
    role: string;
    expiresAt: string;
  }
  
  export interface ApiError {
    message: string;
    details?: string;
    errors?: Record<string, string[]>;
  }
  
  export interface DashboardData {
    message: string;
    username: string;
    role: string;
    timestamp: string;
  }

  export interface PagedResult<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  
  export interface PaginationParams {
    page: number;
    pageSize: number;
  }


  export interface UserSearchRequest {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }
  
  export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
  }