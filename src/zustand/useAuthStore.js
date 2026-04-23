import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: (userData) => {
        set({ loading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ user: userData, isAuthenticated: true, loading: false });
        } catch (err) {
          set({ error: 'Login failed', loading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (status) => set({ loading: status }),
      setError: (message) => set({ error: message }),
    }),
    {
      name: 'auth-storage', // name of the item in storage (must be unique)
    }
  )
);
