'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import { User, UserAddress } from '@/types';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: UserAddress;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; address?: UserAddress }) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = useCallback((tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadInitialUser = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data?.data;
        if (isMounted) {
          setUser(userData && userData._id ? userData : null);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadInitialUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/login', { identifier, password });
      const userData = res.data.data || res.data;
      if (userData.token) {
        localStorage.setItem('bb_token', userData.token);
      }
      setUser(userData);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: errObj.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/register', data);
      const userData = res.data.data || res.data;
      if (userData.token) {
        localStorage.setItem('bb_token', userData.token);
      }
      setUser(userData);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: errObj.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('bb_token');
      localStorage.removeItem('bb_admin_token');
      setUser(null);
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string; address?: UserAddress }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.put('/auth/profile', data);
      const updated = res.data.data || res.data;
      setUser((prev) => (prev ? { ...prev, ...updated } : updated));
      return { success: true };
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: errObj.response?.data?.message || 'Failed to update profile.',
      };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      const userData = res.data?.data;
      setUser(userData && userData._id ? userData : null);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
