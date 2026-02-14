import React, { useEffect, useState } from 'react';
import { Users, Rocket, Wallet, CheckCircle, Clock, FileText, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, pitches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resUsers = await fetch('http://localhost:3000/api/users');
        const resPitches = await fetch('http://localhost:3000/api/pitches');
        
        const users = await resUsers.json();
        const pitches = await resPitches.json();

        setStats({
            users: Array.isArray(users) ? users.length : 0,
            pitches: Array.isArray(pitches) ? pitches.length : 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Platform Command Center</h2>
        <p className="text-gray-500 mt-1 italic">Real-time management of Sharia-compliant investment flows.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Total Active Users" 
          value={loading ? '...' : stats.users} 
          trend="+12.4%" 
          icon={Users} 
        />
        <MetricCard 
          label="Active Halal Pitches" 
          value={loading ? '...' : stats.pitches} 
          trend="+5.2%" 
          icon={Rocket} 
        />
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#262626] to-[#1a1a1a] border border-primary/30 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Total Funding Volume</span>
            <Wallet className="text-primary" size={24} />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-primary">₦450.2M</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">Mudarabah Basis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#1d1d20] rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Pending Verification Requests</h3>
            <p className="text-sm text-gray-500">Entrepreneurs awaiting Sharia-compliance approval</p>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">
             View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Entrepreneur</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {/* Fake Data for MVP Display */}
              <TableRow name="Ahmad Ibrahim" sector="AgroTech" date="Oct 12" />
              <TableRow name="Fatima Zahra" sector="Retail" date="Oct 14" />
              <TableRow name="Zainab Bello" sector="Fashion" date="Oct 15" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Activity className="text-primary" size={20} /> Recent Audit Log
            </h3>
            <div className="space-y-4">
                <AuditItem title='Pitch Approved: "SolarKits Nigeria"' meta="Approved by Yusuf • 2h ago" icon={CheckCircle} />
                <AuditItem title='New Investor Verified: Dr. Kareem O.' meta="KYC validated • 5h ago" icon={Users} />
            </div>
        </div>

        {/* Investment Distribution */}
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Investment Types</h3>
            <div className="space-y-4">
                <ProgressBar label="Mudarabah" value={65} color="bg-primary" />
                <ProgressBar label="Musharakah" value={25} color="bg-primary/60" />
                <ProgressBar label="Murabahah" value={10} color="bg-primary/30" />
            </div>
            <div className="mt-6 pt-6 border-t border-primary/10">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                    Live pool allocations under Sharia Supervisory Board guidelines.
                </p>
            </div>
        </div>
      </div>

    </div>
  );
};

// --- HELPER COMPONENTS ---

const MetricCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="p-6 rounded-xl border border-white/5 bg-gradient-to-br from-[#262626] to-[#1a1a1a] flex flex-col justify-between min-h-[140px]">
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      <Icon className="text-primary/50" size={24} />
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-primary text-xs font-bold">{trend}</span>
        <span className="text-gray-500 text-[10px] uppercase">Vs last month</span>
      </div>
    </div>
  </div>
);

const TableRow = ({ name, sector, date }: any) => (
  <tr className="hover:bg-white/[0.02] transition-colors">
    <td className="px-6 py-4 flex items-center gap-3">
        <div className="size-9 rounded bg-white/5 flex items-center justify-center text-lg font-bold text-white">{name[0]}</div>
        <span className="font-bold">{name}</span>
    </td>
    <td className="px-6 py-4"><span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase">{sector}</span></td>
    <td className="px-6 py-4 text-gray-500">{date}</td>
    <td className="px-6 py-4 text-primary hover:underline cursor-pointer flex items-center gap-1"><FileText size={14}/> Review</td>
    <td className="px-6 py-4"><span className="text-amber-500 flex items-center gap-1 text-xs font-bold uppercase"><Clock size={12} /> Pending</span></td>
    <td className="px-6 py-4 text-right flex justify-end gap-2">
        <button className="px-3 py-1 bg-primary text-black rounded font-bold text-xs hover:opacity-90">Approve</button>
        <button className="px-3 py-1 border border-white/10 text-gray-400 rounded font-bold text-xs hover:text-red-500">Reject</button>
    </td>
  </tr>
);

const AuditItem = ({ title, meta, icon: Icon }: any) => (
    <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-transparent hover:border-primary/20 transition-all">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon size={20} /></div>
        <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{meta}</p>
        </div>
    </div>
);

const ProgressBar = ({ label, value, color }: any) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{label}</span>
            <span className="text-primary font-bold">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export default Dashboard;