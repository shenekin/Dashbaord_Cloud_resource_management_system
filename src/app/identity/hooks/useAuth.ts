import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest, TokenResponse } from '../types/identity';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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

  const login = async (data: LoginRequest) => {
    try {
      // Prepare request body - support both username and email login
      const requestBody: any = {
        password: data.password,
      };

      if (data.username) {
        requestBody.username = data.username;
      } else if (data.email) {
        // For email login, use identifier format
        requestBody.login_type = 'email';
        requestBody.identifier = data.email;
      } else {
        throw new Error('Username or email is required');
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.detail || 'Login failed';
        throw new Error(errorMessage);
      }

      const tokenData: TokenResponse = await response.json();

      // Fetch user info using the access token
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        // If user info fetch fails, create a minimal user object
        const userData = {
          id: '',
          username: data.username || data.email?.split('@')[0] || '',
          email: data.email || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAuth(userData, tokenData.access_token);
        router.push('/identity/profile');
        return;
      }

      const userData = await userResponse.json();
      const user = {
        id: userData.user_id || userData.id || '',
        username: userData.username || '',
        email: userData.email || '',
        avatar: userData.avatar,
        createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString(),
      };

      setAuth(user, tokenData.access_token);
      
      // Store refresh token separately
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh-token', tokenData.refresh_token);
      }

      router.push('/identity/profile');
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      // Prepare request body
      const requestBody = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.detail || 'Registration failed';
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      const user = {
        id: userData.user_id || userData.id || '',
        username: userData.username || data.username,
        email: userData.email || data.email,
        avatar: userData.avatar,
        createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString(),
      };

      // After registration, automatically log in
      await login({ username: data.username, password: data.password });
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh-token');
    }
    router.push('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };
}
