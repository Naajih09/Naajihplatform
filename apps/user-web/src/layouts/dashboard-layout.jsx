import {
  Bell,
  Briefcase,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { pathname } = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // SAFETY FIX: Close menu automatically if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    {
      label: 'Opportunities',
      path: '/dashboard/opportunities',
      icon: Briefcase,
    },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
  ];

  if (!isAuth) {
    return <Navigate to={`/login?returnUrl=${pathname}`} />;
  }

  return (
    <div className='flex h-screen bg-brand-bg font-sans overflow-hidden relative'>
      {/* 1. MOBILE OVERLAY (The Dark Blur) */}
      {/* Added 'md:hidden' here to force it to disappear on Desktop */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. SIDEBAR */}
      {/* Changed z-index to 50 to ensure it sits ON TOP of the overlay */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <div className='p-6 flex justify-between items-center'>
          <div className='text-2xl font-bold text-brand-blue'>
            Naajih<span className='text-brand-gold'>Biz</span>.
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className='md:hidden text-gray-500 hover:text-red-500 p-1'
          >
            <X size={28} />
          </button>
        </div>

        <div className='px-4 py-2'>
          <div className='p-4 bg-blue-50 rounded-xl mb-6'>
            <p className='text-xs text-gray-500 uppercase font-bold'>
              Current Role
            </p>
            <p className='font-bold text-brand-blue text-sm'>
              {user.role || 'Guest'}
            </p>
          </div>
        </div>

        <nav className='flex-1 px-4 space-y-1 overflow-y-auto'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-brand-blue text-white font-semibold shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className='p-4 border-t border-gray-100'>
          <Link
            to='/dashboard/settings'
            className='flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg'
          >
            <Settings size={20} /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg mt-1'
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className='flex-1 flex flex-col h-full overflow-hidden w-full relative z-0'>
        <header className='h-16 bg-white border-b border-gray-200 flex justify-between items-center px-4 md:px-8 shrink-0'>
          {/* Hamburger Trigger */}
          <button
            className='md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <h2 className='text-lg font-bold text-brand-dark hidden md:block'>
            Dashboard
          </h2>
          <div className='flex items-center gap-4 ml-auto'>
            <Bell className='text-gray-400' size={20} />
            <div className='w-8 h-8 bg-brand-blue rounded-full text-white flex items-center justify-center font-bold text-xs'>
              {user.firstName?.[0] || 'U'}
            </div>
          </div>
        </header>

        <div className='flex-1 overflow-y-auto p-4 md:p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
