// apps/admin-web/src/router/index.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { ErrorBoundaryFallback } from '../../../../packages/ui/src';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../types/enums'; 
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Verification = lazy(() => import('../pages/Verification'));
const PitchesList = lazy(() => import('../pages/PitchesLists'));
const UsersList = lazy(() => import('../pages/UsersLists'));
const AuditLogs = lazy(() => import('../pages/AuditLogs'));
const Settings = lazy(() => import('../pages/Settings'));
const AcademyPrograms = lazy(() => import('../pages/AcademyPrograms'));
const AcademyProgramDetail = lazy(() => import('../pages/AcademyProgramDetail'));
const AcademySubmissions = lazy(() => import('../pages/AcademySubmissions'));
const AcademyEnrollments = lazy(() => import('../pages/AcademyEnrollments'));
const Login = lazy(() => import('../pages/Login'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
    Loading...
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

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
            element: withSuspense(<Dashboard />),
          },
          {
            path: 'admin/users',
            element: withSuspense(<UsersList />),
          },
          {
            path: 'admin/pitches',
            element: withSuspense(<PitchesList />),
          },
          {
            path: 'admin/audit',
            element: withSuspense(<AuditLogs />),
          },
          {
            path: 'admin/settings',
            element: withSuspense(<Settings />),
          },
          {
            path: 'admin/academy',
            element: withSuspense(<AcademyPrograms />),
          },
          {
            path: 'admin/academy/submissions',
            element: withSuspense(<AcademySubmissions />),
          },
          {
            path: 'admin/academy/enrollments',
            element: withSuspense(<AcademyEnrollments />),
          },
          {
            path: 'admin/academy/:id',
            element: withSuspense(<AcademyProgramDetail />),
          },
          {
            path: 'admin/verification',
            element: withSuspense(
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
    element: withSuspense(<Login />),
  },
  {
    path: '/unauthorized',
    element: withSuspense(<Unauthorized />),
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
