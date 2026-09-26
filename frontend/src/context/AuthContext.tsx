import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: number) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('stocksense_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('stocksense_token'));
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const authData: AuthResponse = response.data.data;
      setToken(authData.accessToken);
      setUser(authData.user);
      localStorage.setItem('stocksense_token', authData.accessToken);
      localStorage.setItem('stocksense_user', JSON.stringify(authData.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: number) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const authData: AuthResponse = response.data.data;
      setToken(authData.accessToken);
      setUser(authData.user);
      localStorage.setItem('stocksense_token', authData.accessToken);
      localStorage.setItem('stocksense_user', JSON.stringify(authData.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stocksense_token');
    localStorage.removeItem('stocksense_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
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
