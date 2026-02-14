import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Verification from '../pages/Verification';
import { ErrorBoundaryFallback } from '../../../../packages/ui/src';

export const routes = [
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <ErrorBoundaryFallback />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: (
          <div className="p-10">
            User Management (Coming Soon)
          </div>
        ),
      },
      {
        path: 'pitches',
        element: (
          <div className="p-10">
            Pitch Moderation (Coming Soon)
          </div>
        ),
      },
      {
        path: 'verification',
        element: (
          <div className="p-10">
            element: <Verification />
          </div>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
