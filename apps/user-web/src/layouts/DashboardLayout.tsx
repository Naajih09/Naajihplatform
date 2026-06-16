import {
    CheckCircle,
    Compass,
    BookOpen,
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
import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/store';
import { logout, setAuth, setToken, setUser } from '@/store/slices/auth-slice';
import { getApiBaseUrl } from '@/lib/api-base';
import { useSocket } from '@/hooks/useSocket';

interface DashboardLayoutProps {
  children?: React.ReactNode; 
}

const decodeJwtPayload = (token: string) => {
  const base64Url = token.split('.')[1] || '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return JSON.parse(atob(padded));
};

const isExpiredToken = (token: string) => {
  try {
    const payload = decodeJwtPayload(token);
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

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
  const hasValidAuthToken = Boolean(authToken && !isExpiredToken(authToken));

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    dispatch(setToken(null));
    dispatch(setAuth(false));
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);
  
  // 1. GET USER & EXTRACT NAME SAFELY
  const profile = user.entrepreneurProfile || user.investorProfile || {};
  const firstName = profile.firstName || user.firstName || 'User';
  const lastName = profile.lastName || user.lastName || '';
  const role = user.role || 'Guest';
  const profileAvatar = profile.avatarUrl || user.avatarUrl || '';
  const socket = useSocket(user.id || '');
  const welcomeKey = user.id || user.email ? `naajihbiz:welcome-seen:${user.id || user.email}` : '';
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (!welcomeKey) return false;
    const seen = localStorage.getItem(welcomeKey);
    if (seen) return false;
    localStorage.setItem(welcomeKey, 'true');
    return true;
  });
  const [unreadMessages, setUnreadMessages] = useState(0);

  const fetchUnreadMessages = useCallback(async () => {
    if (!hasValidAuthToken) return;

    try {
      const res = await fetch(`${getApiBaseUrl()}/messages/unread-count`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadMessages(Number(data?.count) || 0);
    } catch {
      // Keep the existing badge value if this optional count fails.
    }
  }, [authToken, hasValidAuthToken]);

  useEffect(() => {
    if (authToken && !hasValidAuthToken) {
      handleLogout();
      return;
    }

    const currentUser = authUser || (userString ? JSON.parse(userString) : null);
    const email = currentUser?.email;
    if (!hasValidAuthToken || !email) return;

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
  }, [authUser, userString, authToken, hasValidAuthToken, dispatch, handleLogout]);

  useEffect(() => {
    if (!hasValidAuthToken) return;

    fetchUnreadMessages();
    const interval = window.setInterval(fetchUnreadMessages, 30000);
    window.addEventListener('messages:read', fetchUnreadMessages);
    window.addEventListener('messages:sent', fetchUnreadMessages);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('messages:read', fetchUnreadMessages);
      window.removeEventListener('messages:sent', fetchUnreadMessages);
    };
  }, [fetchUnreadMessages, hasValidAuthToken, location.pathname]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = () => {
      fetchUnreadMessages();
    };

    socket.on('receive_message', handleIncomingMessage);

    return () => {
      socket.off('receive_message', handleIncomingMessage);
    };
  }, [fetchUnreadMessages, socket]);

  const isAspirant = user.role === 'ASPIRING_BUSINESS_OWNER';
  const isInvestor = user.role === 'INVESTOR';
  const isEntrepreneur = user.role === 'ENTREPRENEUR';

  const navItems = isAspirant
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
        { label: 'Knowledge', path: '/dashboard/knowledge', icon: BookOpen },
        { label: 'Learning Center', path: '/dashboard/learning-center', icon: Compass },
        { label: 'Community', path: '/dashboard/community', icon: Users },
        { label: 'Mentor Booking', path: '/dashboard/mentors', icon: Video },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
        { label: 'Upgrade Plan', path: '/dashboard/subscription', icon: Zap, badge: 'PRO' },
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
        { label: 'Knowledge', path: '/dashboard/knowledge', icon: BookOpen },
        { label: 'Opportunities', path: '/dashboard/opportunities', icon: Compass },
        { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare, count: unreadMessages },
        { label: 'Connections', path: '/dashboard/connections', icon: LinkIcon },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
        { label: 'Verification', path: '/dashboard/verification', icon: CheckCircle },
        ...(isInvestor
          ? []
          : [{ label: 'Upgrade Plan', path: '/dashboard/subscription', icon: Zap, badge: 'PRO' }]),
      ];

  if (!isAuth || !hasValidAuthToken) {
    const returnUrl = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  return (
    <div className="flex h-[100dvh] bg-[#f8fafc] dark:bg-[#111113] text-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-[#151518] sm:rounded-3xl sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Welcome
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome to NaajihBiz
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-gray-400">
              {isInvestor
                ? 'Start by exploring approved opportunities and building your deal flow.'
                : 'Start by creating or exploring opportunities'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {isEntrepreneur && (
                <Link
                  to="/dashboard/create-pitch"
                  onClick={() => setShowWelcomeModal(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-black transition hover:brightness-110"
                >
                  Create Opportunity
                </Link>
              )}
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
      <aside className={`fixed md:static inset-y-0 left-0 z-30 flex w-[min(86vw,18rem)] flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-[#1d1d20] md:w-64 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 sm:p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black font-extrabold">
            N
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">NaajihBiz</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">Halal Growth</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-gray-400" aria-label="Close menu"><X size={24}/></button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 sm:px-4 ${
                location.pathname === item.path 
                ? 'bg-primary text-black font-bold shadow-md' 
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.count > 0 && (
                <span className="ml-auto min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-black leading-none text-white">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
              {item.badge && (
                <span className="ml-auto bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-200 p-3 dark:border-gray-800 sm:p-4">
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
        <header className="sticky top-0 z-10 flex min-w-0 items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-3 py-3 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-[#111113]/90 sm:px-5 md:px-6 md:py-4">
          <div className="flex min-w-0 items-center gap-2 md:hidden">
             <button onClick={() => setIsMobileMenuOpen(true)} className="rounded-lg border border-slate-200 bg-slate-100 p-2 dark:border-gray-800 dark:bg-[#1d1d20]" aria-label="Open menu"><Menu size={20} className="text-gray-500"/></button>
             <div className="min-w-0">
               <p className="truncate text-xs font-bold leading-none text-slate-900 dark:text-white">Hi, {firstName}</p>
               <p className="mt-0.5 truncate text-[10px] font-medium uppercase text-slate-500 dark:text-gray-400">{role}</p>
             </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
            </div>
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-3 md:gap-4">
            
            <ThemeToggle />

            {!isAspirant && (
              <Link
                to="/dashboard/messages"
                className="relative rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-500 transition-colors hover:text-black dark:border-gray-800 dark:bg-[#1d1d20] dark:text-gray-400 dark:hover:text-white"
                aria-label={unreadMessages > 0 ? `${unreadMessages} unread messages` : 'Messages'}
                title={unreadMessages > 0 ? `${unreadMessages} unread messages` : 'Messages'}
              >
                <MessageSquare size={20} />
                {unreadMessages > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-black leading-none text-white ring-2 ring-white dark:ring-[#111113]">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </span>
                )}
              </Link>
            )}
            
            <NotificationBell />

            <Link to="/dashboard/settings" className="hidden sm:block">
              <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white bg-slate-100 dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-lg transition-colors" aria-label="Settings">
                <Settings size={20} />
              </button>
            </Link>

            <div className="mx-1 hidden h-8 w-px bg-slate-200 dark:bg-gray-800 sm:block md:mx-2"></div>
            
            <Link
              to="/dashboard/profile"
              className="flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/5 sm:gap-3 sm:px-2"
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

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pb-24 sm:p-4 md:p-8 md:pb-8">
          {children ? children : <Outlet />} 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
