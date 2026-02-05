import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Compass, MessageSquare, Link as LinkIcon, User, 
  PlusCircle, Search, Bell, Settings, Menu, X, Landmark 
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Opportunities from '@/pages/dashboard/Opportunities';

// 1. DEFINE THE TYPES (The Fix)
interface DashboardLayoutProps {
  children?: React.ReactNode; // This tells TS: "I can accept content inside me"
}

// 2. USE THE PROPS
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Opportunities', path: '/dashboard/opportunities', icon: Compass },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare, badge: 3 },
    { label: 'Connections', path: '/dashboard/connections', icon: LinkIcon },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-neutral-dark">
            <Landmark className="font-bold" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">NaajihBiz</h1>
            <p className="text-xs text-neutral-muted uppercase tracking-widest font-bold">Halal Growth</p>
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
                ? 'bg-primary text-neutral-dark font-bold shadow-md' 
                : 'text-neutral-muted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-neutral-dark dark:hover:text-white'
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

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <Link to="/dashboard/create-pitch" className="w-full flex items-center justify-center gap-2 bg-primary py-3 px-4 rounded-xl text-neutral-dark font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <PlusCircle size={18} />
            <span>Create a New Pitch</span>
          </Link>
          <button onClick={handleLogout} className="w-full text-xs font-bold text-red-400 py-2 hover:bg-red-500/10 rounded-lg">Log Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 md:hidden">
             <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"><Menu size={24} className="text-gray-500"/></button>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" size={18} />
              <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all" placeholder="Search investors, pitches..." type="text"/>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-neutral-muted hover:text-neutral-dark dark:hover:text-white relative bg-white dark:bg-[#151518] border border-gray-200 dark:border-gray-800 rounded-lg" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            <button className="p-2 text-neutral-muted hover:text-neutral-dark dark:hover:text-white bg-white dark:bg-[#151518] border border-gray-200 dark:border-gray-800 rounded-lg" aria-label="Settings">
              <Settings size={20} />
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{user.firstName || 'User'} {user.lastName || ''}</p>
                <p className="text-[10px] text-neutral-muted font-medium uppercase">{user.role || 'Guest'}</p>
              </div>
              <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold text-neutral-dark border-2 border-white dark:border-gray-700">
                {user.firstName?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* 3. SUPPORT BOTH OUTLET AND CHILDREN */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children ? children : <Outlet />} 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;