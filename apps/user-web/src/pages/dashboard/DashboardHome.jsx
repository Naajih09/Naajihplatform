import React, { useEffect, useState } from 'react';
import { Rocket, Network, ShieldCheck, History, UserSearch, Mail, CheckCircle, TrendingUp, ChevronRight, Calendar } from 'lucide-react';
import Button from '../../components/Button';

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [stats, setStats] = useState({
    activePitches: 0,
    pendingConnections: 0,
    isVerified: false,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

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
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome back, {user.firstName}</h2>
          <p className="text-slate-500 dark:text-neutral-muted font-medium mt-1">Here is what is happening with your business today.</p>
        </div>
        <div className="text-slate-500 dark:text-neutral-muted text-sm font-medium flex items-center gap-1">
          <Calendar size={16} /> {new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Active Pitches (FIXED COLORS) */}
        <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <Rocket className="text-primary" size={32} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-neutral-muted text-xs font-bold uppercase tracking-wider">Active Pitches</p>
            <h3 className="text-4xl font-black mt-1 text-slate-900 dark:text-white">
              {loading ? '...' : stats.activePitches}
            </h3>
          </div>
        </div>

        {/* Pending Connections */}
        <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <Network className="text-primary" size={32} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-neutral-muted text-xs font-bold uppercase tracking-wider">Pending Connections</p>
            <h3 className="text-4xl font-black mt-1 text-slate-900 dark:text-white">
              {loading ? '...' : stats.pendingConnections}
            </h3>
          </div>
        </div>

        {/* Verification Card */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-slate-900 dark:bg-black p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              <h4 className="text-white font-bold text-sm tracking-wide uppercase">Verification Status</h4>
            </div>
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

      {/* CTA Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-neutral-dark mb-2">Ready to expand?</h3>
            <p className="text-neutral-dark/70 font-medium mb-6 max-w-sm">Connect with over 500+ certified halal investors.</p>
            {/* This button works now via Link */}
            <a href="/dashboard/create-pitch" className="inline-block">
               <button className="bg-neutral-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-neutral-dark/90 transition-all flex items-center gap-2">
                 Launch New Pitch <ChevronRight size={16} />
               </button>
            </a>
          </div>
          <TrendingUp className="absolute -bottom-8 -right-8 text-black/5 group-hover:rotate-12 transition-transform duration-500" size={160} />
        </div>

        <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 p-8 rounded-3xl flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white">Need Guidance?</h3>
              <p className="text-slate-500 dark:text-neutral-muted text-sm mb-4">Book a session with our Islamic Finance consultants.</p>
              {/* FIX: Mailto Link */}
              <a href="mailto:support@naajihbiz.com?subject=Consultation%20Request" className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Schedule a Call <ChevronRight size={14} />
              </a>
           </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;