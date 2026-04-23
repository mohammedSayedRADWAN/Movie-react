import React, { createContext, useContext } from 'react';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const favorites = useFavoritesStore();

  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </AuthContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
