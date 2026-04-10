import { lazy } from 'react';

// --- Public Pages ---
const HomePage = lazy(() => import('../pages/landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const CertificateVerify = lazy(() => import('../pages/certificate/CertificateVerify'));
const Terms = lazy(() => import('../pages/legal/Terms'));
const Privacy = lazy(() => import('../pages/legal/Privacy'));

// --- Dashboard Pages ---
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const Opportunities = lazy(() => import('../pages/dashboard/Opportunities'));
const PitchDetails = lazy(() => import('../pages/dashboard/PitchDetails')); 
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const InvestorDashboard = lazy(() => import('../pages/dashboard/InvestorDashboard'));
const Subscription = lazy(() => import('../pages/dashboard/Subscription'));
const CreatePitch = lazy(() => import('../pages/dashboard/CreatePitch'));
const Connections = lazy(() => import('../pages/dashboard/Connections'));
const Messages = lazy(() => import('../pages/dashboard/Messages').then(module => ({ default: module.default })));
const Settings = lazy(() => import('../pages/dashboard/Settings'));
const Verification = lazy(() => import('../pages/dashboard/Verification'));
const LearningCenter = lazy(() => import('../pages/dashboard/LearningCenter'));
const CourseViewer = lazy(() => import('../pages/dashboard/CourseViewer'));
const AcademyDashboard = lazy(() => import('../pages/dashboard/AcademyDashboard'));
const Certificate = lazy(() => import('../pages/dashboard/Certificate'));
const Community = lazy(() => import('../pages/dashboard/Community'));
const MentorBooking = lazy(() => import('../pages/dashboard/MentorBooking'));

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
