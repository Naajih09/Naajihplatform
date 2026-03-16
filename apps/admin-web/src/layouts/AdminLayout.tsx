import { useState } from 'react';
import { ShieldCheck, Users, FileText, CheckCircle, LogOut, LayoutDashboard, Menu, X, Activity, Settings } from 'lucide-react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Pitch Moderation', path: '/admin/pitches', icon: FileText },
    { label: 'KYC Verification', path: '/admin/verification', icon: CheckCircle },
    { label: 'Audit Log', path: '/admin/audit', icon: Activity },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen bg-[#111113] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1d1d20] border-r border-gray-800 flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-900/20">
              <ShieldCheck className="font-bold" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Naajih<span className="text-blue-500">Admin</span></h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">CEO Mode</p>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path || location.pathname.startsWith(item.path)
                ? 'bg-blue-600 text-white font-bold shadow-md' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:text-white hover:border-white/20"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
