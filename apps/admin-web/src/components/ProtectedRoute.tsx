import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/enums";
import { AdminPermission, hasAdminPermission } from "../utils/admin-access";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  permission?: AdminPermission;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  permission,
}) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permission && !hasAdminPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
