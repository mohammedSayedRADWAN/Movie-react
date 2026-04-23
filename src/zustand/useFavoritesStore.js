import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (movie) => {
        const { favorites } = get();
        if (!favorites.find((m) => m.id === movie.id)) {
          set({ favorites: [...favorites, movie] });
        }
      },

      removeFromFavorites: (movieId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((m) => m.id !== movieId) });
      },

      isFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.some((m) => m.id === movieId);
      },
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);
