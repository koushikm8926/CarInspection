import { create } from 'zustand';
import { secureStorage } from '../services/secureStore';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user, token) => {
    set({ user, token, isAuthenticated: !!token });
  },

  logout: async () => {
    await secureStorage.clearAll();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const token = await secureStorage.getToken();
      const user = await secureStorage.getUser();
      if (token && user) {
        set({ user, token, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to initialize auth store', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
