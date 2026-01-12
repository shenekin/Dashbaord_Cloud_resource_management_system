import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from '@/types';

/**
 * HTTP client for API requests
 */
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        // Use auth-token from localStorage (same as authApi)
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('refresh-token');
            localStorage.removeItem('auth-user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T> | T>(url, { params });
    // Handle both wrapped (ApiResponse) and direct response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }
    // If response is direct (not wrapped), return it directly
    return response.data as T;
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T> | T>(url, data);
    // Handle both wrapped (ApiResponse) and direct response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }
    return response.data as T;
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T> | T>(url, data);
    // Handle both wrapped (ApiResponse) and direct response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }
    return response.data as T;
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T> | T>(url);
    // Handle both wrapped (ApiResponse) and direct response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }
    return response.data as T;
  }
}

export const apiClient = new ApiClient();

// Dashboard API endpoints have been removed
// Only user and role management APIs are available via authApi service
