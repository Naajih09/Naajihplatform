import BlankLayout from '@/layouts/blank-layout';
import DashboardLayout from '@/layouts/dashboard-layout';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundaryFallback } from '../../../../packages/ui/src';
import { routes } from './routes';

const finalRoutes = routes?.map((route) => {
  return {
    ...route,
    element:
      route?.layout === 'blank' ? (
        <BlankLayout>{route?.element}</BlankLayout>
      ) : route?.layout === 'dashboard' ? (
        <DashboardLayout>{route?.element}</DashboardLayout>
      ) : null,

    errorElement: <ErrorBoundaryFallback />,
  };
});

const router = createBrowserRouter(finalRoutes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
