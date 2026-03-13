import { useState, useEffect, useCallback } from 'react';
import { UserRole } from '../types/enums';

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = useCallback((token: string, role: UserRole) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole') as UserRole | null;

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    userRole,
    isLoading,
    login,
    logout,
  };
};