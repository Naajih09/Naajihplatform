import React, { useEffect, useState } from 'react';
import { Rocket, Network, ShieldCheck, History, UserSearch, Mail, CheckCircle, TrendingUp, ChevronRight, Calendar } from 'lucide-react';

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [stats, setStats] = useState({
    activePitches: 0,
    pendingConnections: 0,
    isVerified: false,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  // 2. FETCH REAL DATA ON LOAD
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/stats/${user.id}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) fetchStats();
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight dark:text-white">Welcome back, {user.firstName}</h2>
          <p className="text-neutral-muted font-medium mt-1">Here is what is happening with your business today.</p>
        </div>
        <div className="text-neutral-muted text-sm font-medium flex items-center gap-1">
          <Calendar size={16} /> {new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Active Pitches  */}
        <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <Rocket className="text-primary" size={32} />
          </div>
          <div>
            <p className="text-neutral-muted text-xs font-bold uppercase tracking-wider">Active Pitches</p>
            <h3 className="text-4xl font-black mt-1 dark:text-white">
              {loading ? '...' : stats.activePitches}
            </h3>
          </div>
        </div>

        {/* Pending Connections  */}
        <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <Network className="text-primary" size={32} />
          </div>
          <div>
            <p className="text-neutral-muted text-xs font-bold uppercase tracking-wider">Pending Connections</p>
            <h3 className="text-4xl font-black mt-1 dark:text-white">
              {loading ? '...' : stats.pendingConnections}
            </h3>
          </div>
        </div>

        {/* Verification Card  */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-neutral-dark dark:bg-black p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              <h4 className="text-white font-bold text-sm tracking-wide uppercase">Verification Status</h4>
            </div>
            {/* DYNAMIC BADGE */}
            <span className={`px-3 py-1 text-neutral-dark text-[10px] font-black rounded-full uppercase ${stats.isVerified ? 'bg-primary' : 'bg-yellow-500'}`}>
              {stats.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <p className="text-white text-2xl font-black">{stats.isVerified ? '100%' : '20%'}</p>
              <p className="text-neutral-muted text-xs">{stats.isVerified ? 'Fully Verified' : 'Upload Documents to verify'}</p>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: stats.isVerified ? '100%' : '20%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ... (Keeping the Chart and Activity Feed as placeholders for now) ... */}
      
    </div>
  );
};

export default DashboardHome;