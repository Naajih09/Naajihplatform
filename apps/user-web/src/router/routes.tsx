import { lazy } from 'react';

// --- Public Pages ---
const HomePage = lazy(() => import('../pages/landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup')); // <--- Added

// --- Dashboard Pages ---
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome')); // <--- Added
const Opportunities = lazy(() => import('../pages/dashboard/Opportunities')); // <--- Added
const Profile = lazy(() => import('../pages/dashboard/Profile')); // <--- Added
const CreatePitch = lazy(() => import('../pages/dashboard/CreatePitch'));

const routes = [
  // --- Public Routes (No Sidebar) ---
  {
    path: '/',
    element: <HomePage />,
    layout: 'blank',
  },
  {
    path: 'login',
    element: <Login />,
    layout: 'blank',
  },
  {
    path: 'signup', // <--- This links the "Get Started" button
    element: <Signup />,
    layout: 'blank',
  },

  // --- Authenticated Routes (With Sidebar) ---
  {
    path: 'dashboard',
    element: <DashboardHome />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/opportunities', // <--- The Feed
    element: <Opportunities />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/profile', // <--- Edit Profile
    element: <Profile />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/create-pitch',
    element: <CreatePitch />,
    layout: 'dashboard',
  },
];

export { routes };