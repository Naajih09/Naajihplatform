import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Briefcase, MessageSquare, User, Settings, LogOut, Menu, X, Bell, Landmark } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get User info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Opportunities', path: '/dashboard/opportunities', icon: Briefcase },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
    
  ];

  return (
    // 1. GLOBAL DARK BACKGROUND
    <div className="flex h-screen bg-background-dark font-sans text-lunar-white overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR (Dark Slate) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-deep-slate border-r border-white/5 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* LOGO AREA */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <Landmark size={20} strokeWidth={3} />
            </div>
            <div className="text-xl font-extrabold tracking-tighter uppercase text-white">Naajih<span className="text-primary">Biz</span></div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400"><X size={24}/></button>
        </div>

        {/* USER CARD */}
        <div className="px-4 py-2">
          <div className="p-4 bg-white/5 rounded-xl mb-6 border border-white/5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current Role</p>
            <p className="font-bold text-primary mt-1">{user.role || 'Guest'}</p>
          </div>
        </div>
        
        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === item.path 
                ? 'bg-primary text-background-dark font-bold shadow-[0_0_15px_rgba(170,255,0,0.3)]' // Active: Neon Glow
                : 'text-gray-400 hover:bg-white/5 hover:text-white' // Inactive: Dark Hover
              }`}
            >
              <item.icon size={20} className={location.pathname === item.path ? "text-background-dark" : "group-hover:text-primary transition-colors"} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="p-4 border-t border-white/5">
           <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
             <Settings size={20} /> Settings
           </Link>
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg mt-1 transition-colors">
             <LogOut size={20} /> Log Out
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-deep-slate/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 md:px-8 shrink-0">
          <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24}/></button>
          
          <h2 className="text-lg font-bold text-white hidden md:block">Dashboard</h2>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            </button>
            <div className="w-9 h-9 bg-white/10 rounded-full text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
              {user.firstName?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;