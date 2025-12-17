import { lazy } from 'react';

const Login = lazy(() => import('../pages/auth/Login'));
const HomePage = lazy(() => import('../pages/landing'));

const CreatePitch = lazy(() => import('../pages/dashboard/CreatePitch'));

const routes = [
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

  //authenticated routes

  {
    path: 'create-pitch',
    element: <CreatePitch />,
    layout: 'dashboard',
  },
];

export { routes };
