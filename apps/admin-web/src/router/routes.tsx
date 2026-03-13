// apps/admin-web/src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Verification from '../pages/Verification';
import { ErrorBoundaryFallback } from '../../../../packages/ui/src';
import PitchesList from '../pages/PitchesLists';
import UsersList from '../pages/UsersLists';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../types/enums'; 

export const routes = [
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <ErrorBoundaryFallback />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
        children: [
          {
            path: 'admin/dashboard',
            element: <Dashboard />,
          },
          {
            path: 'admin/users',
            element: <UsersList />,
          },
          {
            path: 'admin/pitches',
            element: <PitchesList />,
          },
          {
            path: 'admin/verification',
            element: (
              <div className="p-10">
                <Verification />
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <div>Login Page (to be implemented)</div>,
  },
  {
    path: '/unauthorized',
    element: <div>Unauthorized Access</div>,
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;