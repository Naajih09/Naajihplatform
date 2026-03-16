import { useState, useCallback } from 'react';
import { UserRole } from '../types/enums';

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuth = (): AuthState => {
  const readStoredAuth = () => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, userRole: null as UserRole | null };
    }

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole') as UserRole | null;

    if (token && role) {
      return { isAuthenticated: true, userRole: role };
    }

    return { isAuthenticated: false, userRole: null as UserRole | null };
  };

  const [{ isAuthenticated, userRole }, setAuth] = useState(readStoredAuth);
  const isLoading = false;

  const login = useCallback((token: string, role: UserRole) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role);
    setAuth({ isAuthenticated: true, userRole: role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setAuth({ isAuthenticated: false, userRole: null });
  }, []);

  return {
    isAuthenticated,
    userRole,
    isLoading,
    login,
    logout,
  };
};
