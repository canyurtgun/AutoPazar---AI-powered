import { create } from 'zustand';
import { User } from '../types';
import { authAPI } from '../services/endpoints';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('autopazar_user') || 'null'),
  token: localStorage.getItem('autopazar_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('autopazar_token'),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('autopazar_token', data.token);
      localStorage.setItem('autopazar_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.error || 'Giriş başarısız');
    }
  },

  register: async (email, password, fullName, phone?) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.register({ email, password, fullName, phone });
      localStorage.setItem('autopazar_token', data.token);
      localStorage.setItem('autopazar_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.error || 'Kayıt başarısız');
    }
  },

  logout: () => {
    localStorage.removeItem('autopazar_token');
    localStorage.removeItem('autopazar_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('autopazar_token');
    if (!token) return;

    try {
      const { data } = await authAPI.getProfile();
      localStorage.setItem('autopazar_user', JSON.stringify(data));
      set({ user: data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('autopazar_token');
      localStorage.removeItem('autopazar_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  setUser: (user) => {
    localStorage.setItem('autopazar_user', JSON.stringify(user));
    set({ user });
  },
}));
