import { useEffect, useState } from 'react';
import { Users, FileText, CheckCircle, LogOut, LayoutDashboard, Menu, X, Activity, Settings, BookOpen, ClipboardCheck, UserCheck, MessageSquareWarning } from 'lucide-react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import api from '../utils/api';
import { AdminPermission, hasAdminPermission, storeAdminPermissions } from '../utils/admin-access';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useTheme();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const payload = parseJwt(token || '');
    if (!payload?.email) return;

    api
      .get(`/users/${payload.email}`)
      .then((response) => {
        storeAdminPermissions(response.data?.adminPermissions);
      })
      .catch(() => null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminPermissions');
    navigate('/login');
  };

  const navItems: Array<{
    label: string;
    path: string;
    icon: typeof LayoutDashboard;
    permission: AdminPermission;
  }> = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
    { label: 'User Management', path: '/admin/users', icon: Users, permission: 'users' },
    { label: 'Pitch Moderation', path: '/admin/pitches', icon: FileText, permission: 'pitches' },
    { label: 'KYC Verification', path: '/admin/verification', icon: CheckCircle, permission: 'verification' },
    { label: 'Academy Programs', path: '/admin/academy', icon: BookOpen, permission: 'academy' },
    { label: 'Enrollments', path: '/admin/academy/enrollments', icon: UserCheck, permission: 'academy' },
    { label: 'Assignments', path: '/admin/academy/submissions', icon: ClipboardCheck, permission: 'academy' },
    { label: 'Message Reports', path: '/admin/messages/reports', icon: MessageSquareWarning, permission: 'messages' },
    { label: 'Audit Log', path: '/admin/audit', icon: Activity, permission: 'audit' },
    { label: 'Settings', path: '/admin/settings', icon: Settings, permission: 'settings' },
  ];
  const visibleNavItems = navItems.filter((item) => hasAdminPermission(item.permission));

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden dark:bg-[#111113] dark:text-white">
      
      {/* SIDEBAR */}
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 dark:bg-[#1d1d20] dark:border-gray-800 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black font-extrabold shadow-lg shadow-primary/30">
              N
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">NaajihBiz <span className="text-primary">Admin</span></h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold dark:text-gray-500">Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:space-y-2">
          {visibleNavItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path || location.pathname.startsWith(item.path)
                ? 'bg-primary text-black font-bold shadow-md'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-gray-800">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors dark:text-gray-300"
            onClick={handleLogout}
          >
             <LogOut size={20} /> Exit Admin
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:border-white/20"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
            Menu
          </button>
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

const parseJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

export default AdminLayout;
