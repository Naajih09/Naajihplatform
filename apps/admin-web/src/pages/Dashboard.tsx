import { useEffect, useState } from 'react'; 
import { Users, Rocket, Wallet, CheckCircle, Clock, FileText, Activity, ExternalLink, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, pitches: 0 });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    roles: {} as Record<string, number>,
    newUsersLast7Days: 0,
    newConnectionsLast7Days: 0,
  });
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [investmentBreakdown, setInvestmentBreakdown] = useState<
    { label: string; value: number }[]
  >([]);
  const [fundingTotal, setFundingTotal] = useState(0);
  const [newPitchesLast7Days, setNewPitchesLast7Days] = useState(0);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [insights, setInsights] = useState<
    { date: string; newUsers: number; newPitches: number; newConnections: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const [resUserStats, resStats, resVerifications, resAudit, resInsights] = await Promise.all([
          api.get('/users/admin/stats'),
          api.get('/pitches/admin/stats'),
          api.get('/verification/admin/pending?page=1&pageSize=5'),
          api.get('/audit/recent?limit=5'),
          api.get('/users/admin/insights'),
        ]);
        
        const usersResponse = resUserStats.data;
        const statsResponse = resStats.data;
        const verificationsResponse = resVerifications.data;
        const auditResponse = resAudit.data;
        const insightsResponse = resInsights.data;

        const verifications = verificationsResponse.data || verificationsResponse || [];
        const verificationsTotal = verificationsResponse.meta?.total ?? verifications.length;
        const audits = auditResponse.data || auditResponse || [];

        const totalUsers = usersResponse?.totalUsers ?? 0;
        const totalPitches = statsResponse?.totalPitches ?? 0;

        setStats({
            users: totalUsers,
            pitches: totalPitches
        });
        setUserStats({
          totalUsers: usersResponse?.totalUsers ?? 0,
          activeUsers: usersResponse?.activeUsers ?? 0,
          verifiedUsers: usersResponse?.verifiedUsers ?? 0,
          roles: usersResponse?.roles ?? {},
          newUsersLast7Days: usersResponse?.newUsersLast7Days ?? 0,
          newConnectionsLast7Days: usersResponse?.newConnectionsLast7Days ?? 0,
        });
        setPendingVerifications(verifications);
        setPendingTotal(verificationsTotal);

        setInvestmentBreakdown(statsResponse?.investmentBreakdown || []);
        setFundingTotal(statsResponse?.fundingTotal || 0);
        setNewPitchesLast7Days(statsResponse?.newPitchesLast7Days ?? 0);
        setAuditLogs(audits);
        setInsights(Array.isArray(insightsResponse) ? insightsResponse : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        showToast('Failed to load dashboard data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  },[]);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!window.confirm(`Are you sure you want to ${status} this verification?`)) return;
    setActionLoading(id);
    try {
      const res = await api.patch(`/verification/admin/${id}`, { status }); 
      
      if (res.status === 200 || res.status === 204) { 
        setPendingVerifications(prev => prev.filter(req => req.id !== id));
      } else {
        showToast("Failed to update status", "error");
      }
    } catch (error) {
      showToast("Error processing request", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <Clock size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Command Center</h2>
        <p className="text-slate-500 mt-1 italic dark:text-gray-500">Real-time management of Sharia-compliant investment flows.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MetricCard and other components remain */}
        <MetricCard 
          label="Total Active Users" 
          value={loading ? '...' : stats.users} 
          trend="Live" 
          icon={Users} 
        />
        <MetricCard 
          label="Active Halal Pitches" 
          value={loading ? '...' : stats.pitches} 
          trend="Live" 
          icon={Rocket} 
        />
        
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-white border border-primary/30 flex flex-col justify-between min-h-[140px] dark:from-[#262626] dark:to-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Total Funding Volume</span>
            <Wallet className="text-primary" size={24} />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-primary">
              {loading ? '...' : `NGN ${fundingTotal.toLocaleString()}`}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">Based on pitch funding ask</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Active Users"
          value={loading ? '...' : userStats.activeUsers}
          trend="Live"
          icon={Users}
        />
        <MetricCard
          label="Verified Users"
          value={loading ? '...' : userStats.verifiedUsers}
          trend="Live"
          icon={CheckCircle}
        />
        <MetricCard
          label="Pending Verifications"
          value={loading ? '...' : pendingTotal}
          trend="Live"
          icon={Clock}
        />
      </div>

      {/* Growth (Last 7 Days) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="New Users"
          value={loading ? '...' : userStats.newUsersLast7Days}
          trend="Last 7 days"
          subLabel="New signups"
          icon={Users}
        />
        <MetricCard
          label="New Pitches"
          value={loading ? '...' : newPitchesLast7Days}
          trend="Last 7 days"
          subLabel="New submissions"
          icon={Rocket}
        />
        <MetricCard
          label="New Connections"
          value={loading ? '...' : userStats.newConnectionsLast7Days}
          trend="Last 7 days"
          subLabel="New requests"
          icon={Activity}
        />
      </div>

      {/* Table Section */}
      <div className="admin-surface overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Verification Requests</h3>
            <p className="text-sm text-slate-500 dark:text-gray-500">Entrepreneurs awaiting Sharia-compliance approval</p>
          </div>
          <button 
            onClick={() => navigate('/admin/verification')} 
            className="px-4 py-2 admin-button-secondary rounded-lg text-sm font-medium transition-colors"
          >
             View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm text-slate-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <Loader2 className="animate-spin inline mr-2" /> Loading pending requests...
                  </td>
                </tr>
              ) : pendingVerifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <span className="inline-block rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
                      No pending verifications. New KYC requests will appear here.
                    </span>
                  </td>
                </tr>
              ) : (
                pendingVerifications.slice(0, 5).map((req) => {
                  const profile = req.user?.entrepreneurProfile || req.user?.investorProfile || {};
                  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || req.user?.email;
                  
                  return (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                          <div className="size-9 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white uppercase">
                            {fullName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{fullName}</span>
                            <span className="text-xs text-slate-500 dark:text-gray-500">{req.user?.email}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase">{req.user?.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={req.documentUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          <FileText size={14}/> View <ExternalLink size={10}/>
                        </a>
                      </td>
                      <td className="px-6 py-4"><span className="text-amber-500 flex items-center gap-1 text-xs font-bold uppercase"><Clock size={12} /> Pending</span></td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button 
                            disabled={actionLoading === req.id}
                            onClick={() => handleAction(req.id, 'APPROVED')} 
                            className="px-3 py-1 bg-primary text-black rounded font-bold text-xs hover:opacity-90 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button 
                            disabled={actionLoading === req.id}
                            onClick={() => handleAction(req.id, 'REJECTED')} 
                            className="px-3 py-1 border border-white/10 text-gray-400 rounded font-bold text-xs hover:text-red-500 disabled:opacity-50"
                          >
                            Reject
                          </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Activity className="text-primary" size={20} /> Recent Audit Log
            </h3>
            <div className="space-y-4">
                {loading ? (
                  <div className="text-xs text-gray-500">Loading audit activity...</div>
                ) : auditLogs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
                    No recent activity yet. Admin actions and system events will appear here.
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <AuditItem
                      key={log.id}
                      title={formatAuditTitle(log)}
                      meta={formatAuditMeta(log)}
                      icon={
                        log.action === 'PITCH_STATUS_UPDATED'
                          ? CheckCircle
                          : log.action === 'VERIFICATION_STATUS_UPDATED'
                          ? CheckCircle
                          : Users
                      }
                    />
                  ))
                )}
            </div>
        </div>

        {/* Investment Distribution */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Investment Types</h3>
            <div className="space-y-4">
                {loading ? (
                  <div className="text-xs text-gray-500">Loading categories...</div>
                ) : investmentBreakdown.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
                    No pitch categories yet. Category distribution will appear after founders publish pitches.
                  </div>
                ) : (
                  investmentBreakdown.map((item, index) => (
                    <ProgressBar
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      color={index === 0 ? 'bg-primary' : index === 1 ? 'bg-primary/60' : 'bg-primary/30'}
                    />
                  ))
                )}
            </div>
        </div>
      </div>

      {/* Insights */}
      <div className="admin-surface overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Last 7 Days Activity</h3>
          <p className="text-sm text-slate-500 dark:text-gray-500">Daily new users, pitches, and connections</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center text-gray-500">
              <Loader2 className="animate-spin inline mr-2" /> Loading insights...
            </div>
          ) : insights.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <span className="inline-block rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
                No activity data yet. This chart will populate as platform usage increases.
              </span>
            </div>
          ) : (
            <div className="h-72">
              <div className="flex flex-wrap gap-4 mb-4 text-xs">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="inline-block size-2 rounded-full bg-[#fbbf24]"></span>
                  New Users
                </span>
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="inline-block size-2 rounded-full bg-[#60a5fa]"></span>
                  New Pitches
                </span>
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="inline-block size-2 rounded-full bg-[#34d399]"></span>
                  New Connections
                </span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      color: '#e5e7eb',
                    }}
                  />
                  <Line type="monotone" dataKey="newUsers" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="newPitches" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="newConnections" stroke="#34d399" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatAuditTitle = (log: any) => {
  if (log.action === 'VERIFICATION_STATUS_UPDATED') {
    const status = log.metadata?.status || 'UPDATED';
    const target = log.metadata?.targetUserEmail || log.metadata?.targetUserId || 'user';
    return `Verification ${String(status).toLowerCase()} for ${target}`;
  }

  if (log.action === 'PITCH_STATUS_UPDATED') {
    const status = log.metadata?.status || 'UPDATED';
    const title = log.metadata?.pitchTitle || 'pitch';
    return `Pitch ${String(status).toLowerCase()}: ${title}`;
  }

  return log.action || 'Activity';
};

const formatAuditMeta = (log: any) => {
  const actor = log.actor?.email || 'System';
  const time = log.createdAt ? new Date(log.createdAt).toLocaleString() : '';
  return `${actor} - ${time}`;
};

// --- HELPER COMPONENTS ---
const MetricCard = ({ label, value, trend, subLabel = 'Vs last month', icon: Icon }: any) => (
  <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between min-h-[140px] shadow-sm dark:border-white/5 dark:bg-gradient-to-br dark:from-[#262626] dark:to-[#1a1a1a]">
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">{label}</span>
      <Icon className="text-primary/50" size={24} />
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-primary text-xs font-bold">{trend}</span>
        <span className="text-slate-500 dark:text-gray-500 text-[10px] uppercase">{subLabel}</span>
      </div>
    </div>
  </div>
);

const AuditItem = ({ title, meta, icon: Icon }: any) => (
    <div className="flex gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-primary/20 transition-all dark:bg-white/5 dark:border-transparent">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon size={20} /></div>
        <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">{meta}</p>
        </div>
    </div>
);

const ProgressBar = ({ label, value, color }: any) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-gray-400">{label}</span>
            <span className="text-primary font-bold">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${color} progress-bar-width-${value}`}></div>
        </div>
    </div>
);

export default Dashboard;
