import { lazy } from 'react';

// --- Public Pages ---
const HomePage = lazy(() => import('../pages/landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));

// --- Dashboard Pages ---
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const Opportunities = lazy(() => import('../pages/dashboard/Opportunities'));
const PitchDetails = lazy(() => import('../pages/dashboard/PitchDetails')); // <--- IMPORT THIS
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const CreatePitch = lazy(() => import('../pages/dashboard/CreatePitch'));
const Connections = lazy(() => import('../pages/dashboard/Connections'));
const Messages = lazy(() => import('../pages/dashboard/Messages').then(module => ({ default: module.default })));
const Settings = lazy(() => import('../pages/dashboard/Settings'));

const routes = [
  // --- Public Routes ---
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
    path: 'signup',
    element: <Signup />,
    layout: 'blank',
  },

  // --- Authenticated Dashboard Routes ---
  {
    path: 'dashboard',
    element: <DashboardHome />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/opportunities',
    element: <Opportunities />,
    layout: 'dashboard',
  },
  // --- NEW: DYNAMIC PITCH DETAILS ROUTE ---
  {
    path: 'dashboard/opportunities/:id', 
    element: <PitchDetails />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/profile',
    element: <Profile />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/create-pitch',
    element: <CreatePitch />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/connections',
    element: <Connections />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/messages',
    element: <Messages />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/settings',
    element: <Settings />,
    layout: 'dashboard',
  },
];

export { routes };