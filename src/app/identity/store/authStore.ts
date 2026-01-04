import { create } from 'zustand';
import { User } from '../types/identity';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  init: () => void;
}

/**
 * Auth store for identity module
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-user', JSON.stringify(user));
      localStorage.setItem('auth-token', token);
    }
    set({ user, token, isAuthenticated: true });
  },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-user');
          localStorage.removeItem('auth-token');
          localStorage.removeItem('refresh-token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      }
      set({ user: updatedUser });
    }
  },
  init: () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth-user');
      const storedToken = localStorage.getItem('auth-token');
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          set({ user, token: storedToken, isAuthenticated: true });
        } catch (e) {
          localStorage.removeItem('auth-user');
          localStorage.removeItem('auth-token');
        }
      }
    }
  },
}));
