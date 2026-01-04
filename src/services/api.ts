import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from '@/types';

/**
 * HTTP client for API requests
 */
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') {
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
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data;
  }
}

export const apiClient = new ApiClient();

/**
 * Dashboard API endpoints
 */
export const dashboardApi = {
  getSystemHealth: () => apiClient.get('/dashboard/system/health'),
  getActiveAlerts: () => apiClient.get('/dashboard/alerts/active'),
  getPendingApprovals: () => apiClient.get('/dashboard/approvals/pending'),
  getGatewayMetrics: (timeRange?: string) => apiClient.get('/dashboard/gateway/metrics', { timeRange }),
  getUserStats: () => apiClient.get('/dashboard/users/stats'),
  getECSStatus: () => apiClient.get('/dashboard/resources/ecs/status'),
  getProjectResourceUsage: () => apiClient.get('/dashboard/projects/usage'),
  getActiveAlarms: () => apiClient.get('/dashboard/alerts/list'),
  getAutomationTasks: () => apiClient.get('/dashboard/automation/tasks'),
  getCostOverview: () => apiClient.get('/dashboard/cost/overview'),
  getAuditLogs: (limit?: number) => apiClient.get('/dashboard/audit/logs', { limit }),
  getRecentNotifications: (limit?: number) => apiClient.get('/dashboard/notifications/recent', { limit }),
};

