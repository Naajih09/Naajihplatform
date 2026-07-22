import { useState, useCallback } from "react";
import { UserRole } from "../types/enums";

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

const decodeJwtPayload = (token: string) => {
  const base64Url = token.split(".")[1] || "";
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return JSON.parse(atob(padded));
};

const isExpiredToken = (token: string) => {
  try {
    const payload = decodeJwtPayload(token);
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
};

export const useAuth = (): AuthState => {
  const readStoredAuth = () => {
    if (typeof window === "undefined") {
      return { isAuthenticated: false, userRole: null as UserRole | null };
    }

    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole") as UserRole | null;

    if (token && role) {
      if (isExpiredToken(token)) {
        clearStoredAuth();
        return { isAuthenticated: false, userRole: null as UserRole | null };
      }

      return { isAuthenticated: true, userRole: role };
    }

    return { isAuthenticated: false, userRole: null as UserRole | null };
  };

  const [{ isAuthenticated, userRole }, setAuth] = useState(readStoredAuth);
  const isLoading = false;

  const login = useCallback((token: string, role: UserRole) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", role);
    setAuth({ isAuthenticated: true, userRole: role });
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
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
