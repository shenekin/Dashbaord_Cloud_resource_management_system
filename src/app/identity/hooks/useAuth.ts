import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest } from '../types/identity';
import { authApi } from '@/services/authApi';

/**
 * Auth hook for identity module
 */
export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth, updateUser, init } = useAuthStore();

  // Initialize auth state from localStorage
  useEffect(() => {
    init();
  }, [init]);

  // Refresh user info from API
  const refreshUserInfo = async () => {
    try {
      const verifyData = await authApi.verifyToken();
      try {
        const userInfo = await authApi.getUserById(verifyData.user_id);
        const user = {
          id: String(userInfo.user_id || ''),
          username: userInfo.username || '',
          email: userInfo.email || userInfo.phone || '',
          createdAt: userInfo.created_at || new Date().toISOString(),
          updatedAt: userInfo.updated_at || new Date().toISOString(),
        };
        
        // Update auth store with fresh user data
        if (token) {
          setAuth(user, token);
        }
        
        return user;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to verify token:', error);
      throw error;
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      // Call auth API to login
      const tokenData = await authApi.login({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // Save token immediately so subsequent API calls can use it
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', tokenData.access_token);
        localStorage.setItem('refresh-token', tokenData.refresh_token);
      }

      // Fetch user info using verify token endpoint
      let userInfo;
      try {
        const verifyData = await authApi.verifyToken();
        // Verify endpoint returns user_id and username
        // Try to get full user details by user_id
        try {
          userInfo = await authApi.getUserById(verifyData.user_id);
        } catch (error) {
          // If getUserById fails, use data from verify
          userInfo = {
            user_id: verifyData.user_id,
            username: verifyData.username,
            email: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
      } catch (error) {
        // If verify fails, create minimal user object
        userInfo = {
          user_id: 0,
          username: data.username || data.email?.split('@')[0] || '',
          email: data.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const user = {
        id: String(userInfo.user_id || ''),
        username: userInfo.username || data.username || data.email?.split('@')[0] || '',
        email: userInfo.email || data.email || '',
        createdAt: userInfo.created_at || new Date().toISOString(),
        updatedAt: userInfo.updated_at || new Date().toISOString(),
      };

      // Store user in auth store
      setAuth(user, tokenData.access_token);

      router.push('/');
    } catch (error: any) {
      // Handle API errors
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.detail 
        || error.message 
        || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      // Call create user API
      const userData = await authApi.createUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // After registration, automatically log in
      await login({ username: data.username, password: data.password });
    } catch (error: any) {
      // Handle API errors
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.detail 
        || error.message 
        || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh-token');
    }
    router.push('/login');
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refresh-token') 
        : null;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const tokenData = await authApi.refreshToken(refreshToken);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', tokenData.access_token);
        localStorage.setItem('refresh-token', tokenData.refresh_token);
      }

      // Update auth store with new token
      if (user) {
        setAuth(user, tokenData.access_token);
      }

      return tokenData.access_token;
    } catch (error: any) {
      // Refresh failed, clear auth
      clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh-token');
      }
      throw error;
    }
  };

  const verifyToken = async () => {
    try {
      return await authApi.verifyToken();
    } catch (error: any) {
      // Token invalid, try to refresh
      try {
        await refreshAccessToken();
        return await authApi.verifyToken();
      } catch (refreshError) {
        // Refresh also failed, clear auth
        clearAuth();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refresh-token');
        }
        throw refreshError;
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshAccessToken,
    verifyToken,
    refreshUserInfo,
  };
}
