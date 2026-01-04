import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Get API base URL with protocol support (http/https)
 */
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default
    const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http';
    const host = process.env.NEXT_PUBLIC_API_HOST || 'localhost';
    const port = process.env.NEXT_PUBLIC_API_PORT || '8000';
    return `${protocol}://${host}:${port}`;
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
}

/**
 * HTTP client for Auth API requests
 */
class AuthApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = getApiBaseUrl();
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth-token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshToken = typeof window !== 'undefined' 
            ? localStorage.getItem('refresh-token') 
            : null;
          
          if (refreshToken && error.config && !(error.config as any)._retry) {
            (error.config as any)._retry = true;
            try {
              const response = await this.client.post('/auth/refresh', {
                refresh_token: refreshToken,
              });
              const { access_token } = response.data;
              if (typeof window !== 'undefined') {
                localStorage.setItem('auth-token', access_token);
              }
              if (error.config.headers) {
                error.config.headers.Authorization = `Bearer ${access_token}`;
              }
              return this.client(error.config);
            } catch (refreshError) {
              // Refresh failed, clear auth and redirect to login
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-token');
                localStorage.removeItem('refresh-token');
                localStorage.removeItem('auth-user');
                window.location.href = '/login';
              }
            }
          } else {
            // No refresh token, redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-token');
              localStorage.removeItem('refresh-token');
              localStorage.removeItem('auth-user');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

const authApiClient = new AuthApiClient();

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * User login
   * POST /auth/login
   */
  login: async (credentials: { username?: string; email?: string; password: string }) => {
    const body: any = { password: credentials.password };
    if (credentials.username) {
      body.username = credentials.username;
    } else if (credentials.email) {
      body.login_type = 'email';
      body.identifier = credentials.email;
    }
    return authApiClient.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      refresh_expires_in: number;
    }>('/auth/login', body);
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken: async (refreshToken: string) => {
    return authApiClient.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      refresh_expires_in: number;
    }>('/auth/refresh', { refresh_token: refreshToken });
  },

  /**
   * Verify token validity
   * GET /auth/verify
   */
  verifyToken: async () => {
    return authApiClient.get<{
      user_id: number;
      username: string;
      roles: string[];
      permissions: string[];
      expires_at: string;
    }>('/auth/verify');
  },

  /**
   * Create user
   * POST /users
   */
  createUser: async (userData: {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    is_admin?: boolean;
  }) => {
    return authApiClient.post<{
      user_id: number;
      username: string;
      phone?: string;
      email?: string;
      status: string;
      is_admin: boolean;
      is_global_admin: boolean;
      created_at: string;
      updated_at: string;
      last_login_at: string | null;
    }>('/users', userData);
  },

  /**
   * Get user by ID
   * GET /users/{user_id}
   */
  getUserById: async (userId: number) => {
    return authApiClient.get<{
      user_id: number;
      username: string;
      phone?: string;
      email?: string;
      status: string;
      is_admin: boolean;
      is_global_admin: boolean;
      created_at: string;
      updated_at: string;
      last_login_at: string | null;
    }>(`/users/${userId}`);
  },

  /**
   * Get user list (paginated)
   * GET /users
   */
  getUsers: async (params?: {
    page?: number;
    page_size?: number;
    username?: string;
    status?: string;
  }) => {
    return authApiClient.get<{
      items: Array<{
        user_id: number;
        username: string;
        phone?: string;
        email?: string;
        status: string;
        is_admin: boolean;
        is_global_admin: boolean;
        created_at: string;
        updated_at: string;
        last_login_at: string | null;
      }>;
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>('/users', params);
  },

  /**
   * Update user
   * PUT /users/{user_id}
   */
  updateUser: async (userId: number, userData: {
    username?: string;
    email?: string;
    phone?: string;
    status?: string;
    is_admin?: boolean;
  }) => {
    return authApiClient.put<{
      user_id: number;
      username: string;
      phone?: string;
      email?: string;
      status: string;
      is_admin: boolean;
      is_global_admin: boolean;
      created_at: string;
      updated_at: string;
      last_login_at: string | null;
    }>(`/users/${userId}`, userData);
  },

  /**
   * Reset user password
   * POST /users/{user_id}/reset-password
   * Requires old_password and new_password for security
   */
  resetPassword: async (userId: number, oldPassword: string, newPassword: string) => {
    return authApiClient.post<{ message: string }>(`/users/${userId}/reset-password`, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  /**
   * Delete user (soft delete)
   * DELETE /users/{user_id}
   */
  deleteUser: async (userId: number) => {
    return authApiClient.delete<{ message: string }>(`/users/${userId}`);
  },

  /**
   * Create role
   * POST /roles
   */
  createRole: async (roleData: {
    role_name: string;
    role_code: string;
    description?: string;
    role_type?: string;
  }) => {
    return authApiClient.post<{
      role_id: number;
      role_name: string;
      role_code: string;
      description?: string;
      role_type: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>('/roles', roleData);
  },

  /**
   * Get role by ID
   * GET /roles/{role_id}
   */
  getRoleById: async (roleId: number) => {
    return authApiClient.get<{
      role_id: number;
      role_name: string;
      role_code: string;
      description?: string;
      role_type: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>(`/roles/${roleId}`);
  },

  /**
   * Get role list (paginated)
   * GET /roles
   */
  getRoles: async (params?: {
    page?: number;
    page_size?: number;
    role_type?: string;
    status?: string;
  }) => {
    return authApiClient.get<{
      items: Array<{
        role_id: number;
        role_name: string;
        role_code: string;
        description?: string;
        role_type: string;
        status: string;
        created_at: string;
        updated_at: string;
      }>;
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>('/roles', params);
  },

  /**
   * Update role
   * PUT /roles/{role_id}
   */
  updateRole: async (roleId: number, roleData: {
    role_name?: string;
    role_code?: string;
    description?: string;
    role_type?: string;
    status?: string;
  }) => {
    return authApiClient.put<{
      role_id: number;
      role_name: string;
      role_code: string;
      description?: string;
      role_type: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>(`/roles/${roleId}`, roleData);
  },

  /**
   * Assign role to user
   * POST /roles/assign
   */
  assignRole: async (userId: number, roleId: number) => {
    return authApiClient.post<{ message: string }>('/roles/assign', {
      user_id: userId,
      role_id: roleId,
    });
  },
};

