import {
    CheckCircle,
    Compass,
    LayoutGrid,
    Link as LinkIcon,
    Menu,
    MessageSquare,
    PlusCircle, Settings,
    User,
    X,
    Users,
    Video,
    Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/store';
import { logout, setAuth, setToken, setUser } from '@/store/slices/auth-slice';
import { getApiBaseUrl } from '@/lib/api-base';

interface DashboardLayoutProps {
  children?: React.ReactNode; 
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuth, user: authUser } = useAuth();
  const dispatch = useAppDispatch();
  const userString = localStorage.getItem('user');
  const user = authUser || (userString ? JSON.parse(userString) : {});
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';

  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. GET USER & EXTRACT NAME SAFELY
  const profile = user.entrepreneurProfile || user.investorProfile || {};
  const firstName = profile.firstName || user.firstName || 'User';
  const lastName = profile.lastName || user.lastName || '';
  const role = user.role || 'Guest';
  const profileAvatar = profile.avatarUrl || user.avatarUrl || '';
  const welcomeKey = user.id || user.email ? `naajihbiz:welcome-seen:${user.id || user.email}` : '';
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (!welcomeKey) return false;
    const seen = localStorage.getItem(welcomeKey);
    if (seen) return false;
    localStorage.setItem(welcomeKey, 'true');
    return true;
  });

  useEffect(() => {
    const currentUser = authUser || (userString ? JSON.parse(userString) : null);
    const email = currentUser?.email;
    if (!authToken || !email) return;

    let cancelled = false;

    const refreshUser = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/users/${email}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data) return;
        localStorage.setItem('user', JSON.stringify(data));
        dispatch(setUser(data));
      } catch {
        // Ignore refresh failures and keep the current session state.
      }
    };

    refreshUser();

    return () => {
      cancelled = true;
    };
  }, [authUser?.email, authToken, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    dispatch(setToken(null));
    dispatch(setAuth(false));
    dispatch(logout());
    navigate('/login');
  };

  const isAspirant = user.role === 'ASPIRING_BUSINESS_OWNER';

  const navItems = isAspirant
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
        { label: 'Learning Center', path: '/dashboard/learning-center', icon: Compass },
        { label: 'Community', path: '/dashboard/community', icon: Users },
        { label: 'Mentor Booking', path: '/dashboard/mentors', icon: Video },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
        { label: 'Upgrade Plan', path: '/dashboard/subscription', icon: Zap, badge: 'PRO' },
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
        { label: 'Opportunities', path: '/dashboard/opportunities', icon: Compass },
        { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
        { label: 'Connections', path: '/dashboard/connections', icon: LinkIcon },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
        { label: 'Verification', path: '/dashboard/verification', icon: CheckCircle },
        { label: 'Upgrade Plan', path: '/dashboard/subscription', icon: Zap, badge: 'PRO' },
      ];

  if (!isAuth) {
    const returnUrl = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#111113] text-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#151518]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Welcome
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome to NaajihBiz
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-gray-400">
              Start by creating or exploring opportunities
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard/create-pitch"
                onClick={() => setShowWelcomeModal(false)}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-black transition hover:brightness-110"
              >
                Create Opportunity
              </Link>
              <Link
                to="/dashboard/opportunities"
                onClick={() => setShowWelcomeModal(false)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-[#1d1d20] dark:text-white dark:hover:bg-white/5"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#1d1d20] border-r border-slate-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black font-extrabold">
            N
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">NaajihBiz</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">Halal Growth</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-gray-400" aria-label="Close menu"><X size={24}/></button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-primary text-black font-bold shadow-md' 
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-gray-800 space-y-2">
          {user.role === 'ENTREPRENEUR' && (
            <Link to="/dashboard/create-pitch" className="w-full flex items-center justify-center gap-2 bg-primary py-3 px-4 rounded-xl text-black font-bold text-sm shadow-lg hover:brightness-110 transition-shadow">
              <PlusCircle size={18} />
              <span>Create a New Pitch</span>
            </Link>
          )}
          <button onClick={handleLogout} className="w-full text-xs font-bold text-red-500 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg">Log Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
          <div className="flex items-center gap-4 md:hidden">
             <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"><Menu size={24} className="text-gray-500"/></button>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <ThemeToggle />
            
            <NotificationBell />

            <Link to="/dashboard/settings">
              <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white bg-slate-100 dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-lg transition-colors" aria-label="Settings">
                <Settings size={20} />
              </button>
            </Link>

            <div className="h-8 w-px bg-slate-200 dark:bg-gray-800 mx-2"></div>
            
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Open profile"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">{firstName} {lastName}</p>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium uppercase">{role}</p>
              </div>
              <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold text-black border-2 border-white dark:border-gray-700 overflow-hidden">
                {profileAvatar ? (
                  <img
                    src={profileAvatar}
                    alt={`${firstName} ${lastName}`.trim() || 'Profile'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  firstName?.[0] || 'U'
                )}
              </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children ? children : <Outlet />} 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
