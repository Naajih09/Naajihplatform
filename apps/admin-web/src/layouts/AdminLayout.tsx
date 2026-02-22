import { ShieldCheck, Users, FileText, CheckCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'User Management', path: '/users', icon: Users },
    { label: 'Pitch Moderation', path: '/pitches', icon: FileText },
    { label: 'KYC Verification', path: '/verification', icon: CheckCircle },
  ];

  return (
    <div className="flex h-screen bg-[#111113] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1d1d20] border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-900/20">
            <ShieldCheck className="font-bold" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Naajih<span className="text-blue-500">Admin</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">CEO Mode</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white font-bold shadow-md' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-400 hover:bg-red-500/10 rounded-lg transition-colors">
             <LogOut size={20} /> Exit Admin
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;