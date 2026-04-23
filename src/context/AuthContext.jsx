import React, { createContext, useContext } from 'react';
import { useAuthStore } from '@/zustand/useAuthStore';

// This context acts as a wrapper around our Zustand store 
// to follow the requested architecture while keeping Zustand's performance.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthStore();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
