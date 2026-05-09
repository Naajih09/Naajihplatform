import { lazy } from 'react';
import type { ComponentType } from 'react';

const chunkReloadKey = 'naajihbiz:chunk-reload-attempted';

const isChunkLoadError = (error: unknown) => {
  if (!(error instanceof Error)) return false;

  return (
    error.name === 'ChunkLoadError' ||
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed') ||
    error.message.includes('Expected a JavaScript-or-Wasm module script') ||
    error.message.includes('Loading chunk')
  );
};

const lazyWithReload = <T extends { default: ComponentType<any> }>(
  loader: () => Promise<T>,
) =>
  lazy(() =>
    loader()
      .then((module) => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(chunkReloadKey);
        }
        return module;
      })
      .catch((error) => {
        if (
          typeof window !== 'undefined' &&
          typeof sessionStorage !== 'undefined' &&
          isChunkLoadError(error) &&
          sessionStorage.getItem(chunkReloadKey) !== 'true'
        ) {
          sessionStorage.setItem(chunkReloadKey, 'true');
          window.location.reload();
          return new Promise<T>(() => {});
        }

        throw error;
      }),
  );

// --- Public Pages ---
const HomePage = lazyWithReload(() => import('../pages/landing'));
const Login = lazyWithReload(() => import('../pages/auth/Login'));
const Signup = lazyWithReload(() => import('../pages/auth/Signup'));
const CertificateVerify = lazyWithReload(() => import('../pages/certificate/CertificateVerify'));
const Terms = lazyWithReload(() => import('../pages/legal/Terms'));
const Privacy = lazyWithReload(() => import('../pages/legal/Privacy'));

// --- Dashboard Pages ---
const DashboardHome = lazyWithReload(() => import('../pages/dashboard/DashboardHome'));
const Opportunities = lazyWithReload(() => import('../pages/dashboard/Opportunities'));
const PitchDetails = lazyWithReload(() => import('../pages/dashboard/PitchDetails'));
const Profile = lazyWithReload(() => import('../pages/dashboard/Profile'));
const InvestorDashboard = lazyWithReload(() => import('../pages/dashboard/InvestorDashboard'));
const Subscription = lazyWithReload(() => import('../pages/dashboard/Subscription'));
const CreatePitch = lazyWithReload(() => import('../pages/dashboard/CreatePitch'));
const Connections = lazyWithReload(() => import('../pages/dashboard/Connections'));
const Messages = lazyWithReload(() => import('../pages/dashboard/Messages').then(module => ({ default: module.default })));
const Settings = lazyWithReload(() => import('../pages/dashboard/Settings'));
const Verification = lazyWithReload(() => import('../pages/dashboard/Verification'));
const LearningCenter = lazyWithReload(() => import('../pages/dashboard/LearningCenter'));
const CourseViewer = lazyWithReload(() => import('../pages/dashboard/CourseViewer'));
const AcademyDashboard = lazyWithReload(() => import('../pages/dashboard/AcademyDashboard'));
const Certificate = lazyWithReload(() => import('../pages/dashboard/Certificate'));
const Community = lazyWithReload(() => import('../pages/dashboard/Community'));
const MentorBooking = lazyWithReload(() => import('../pages/dashboard/MentorBooking'));

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
  {
    path: 'certificate/verify/:token',
    element: <CertificateVerify />,
    layout: 'blank',
  },
  {
    path: 'certificate/verify/:programId/:userId',
    element: <CertificateVerify />,
    layout: 'blank',
  },
  {
    path: 'terms',
    element: <Terms />,
    layout: 'blank',
  },
  {
    path: 'privacy',
    element: <Privacy />,
    layout: 'blank',
  },

  // --- Authenticated Dashboard Routes ---
  {
    path: 'dashboard',
    element: <DashboardHome />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/learning-center',
    element: <LearningCenter />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/community',
    element: <Community />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/mentors',
    element: <MentorBooking />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/learning-center/:id',
    element: <CourseViewer />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/academy/:id',
    element: <AcademyDashboard />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/academy/course/:lessonId',
    element: <CourseViewer />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/academy/certificate/:programId',
    element: <Certificate />,
    layout: 'dashboard',
  },
  {
  path: 'dashboard/verification',
  element: <Verification />,
  layout: 'dashboard',
},
  {
    path: 'dashboard/opportunities',
    element: <Opportunities />,
    layout: 'dashboard',
  },
  {
    path: 'dashboard/investor',
    element: <InvestorDashboard />,
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
    path: 'dashboard/subscription',
    element: <Subscription />,
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
