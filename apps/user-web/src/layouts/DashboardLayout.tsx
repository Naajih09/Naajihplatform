import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Compass, MessageSquare, Link as LinkIcon, User, 
  PlusCircle, Bell, Settings, Menu, X, Landmark, 
  CheckCircle, Loader2, Zap
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

// ... (inside component)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};

  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. GET USER & EXTRACT NAME SAFELY
  const profile = user.entrepreneurProfile || user.investorProfile || {};
  const firstName = profile.firstName || user.firstName || 'User';
  const lastName = profile.lastName || user.lastName || '';
  const role = user.role || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
// ... (later in the JSX)
          <div className="flex items-center gap-4">
            
            <ThemeToggle />
            
            <NotificationBell />

            <Link to="/dashboard/settings">
              <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white bg-slate-100 dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-lg transition-colors" aria-label="Settings">
                <Settings size={20} />
              </button>
            </Link>

            <div className="h-8 w-px bg-slate-200 dark:bg-gray-800 mx-2"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">{firstName} {lastName}</p>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium uppercase">{role}</p>
              </div>
              <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold text-black border-2 border-white dark:border-gray-700">
                {firstName?.[0] || 'U'}
              </div>
            </div>
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