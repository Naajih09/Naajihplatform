import { useEffect, useState } from 'react'; 
import { Users, Rocket, Wallet, CheckCircle, Clock, FileText, Activity, ExternalLink, Loader2 } from 'lucide-react';
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
  });
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [investmentBreakdown, setInvestmentBreakdown] = useState<
    { label: string; value: number }[]
  >([]);
  const [fundingTotal, setFundingTotal] = useState(0);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
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

        const [resUserStats, resStats, resVerifications, resAudit] = await Promise.all([
          api.get('/users/admin/stats'),
          api.get('/pitches/admin/stats'),
          api.get('/verification/admin/pending?page=1&pageSize=5'),
          api.get('/audit/recent?limit=5'),
        ]);
        
        const usersResponse = resUserStats.data;
        const statsResponse = resStats.data;
        const verificationsResponse = resVerifications.data;
        const auditResponse = resAudit.data;

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
        });
        setPendingVerifications(verifications);
        setPendingTotal(verificationsTotal);

        setInvestmentBreakdown(statsResponse?.investmentBreakdown || []);
        setFundingTotal(statsResponse?.fundingTotal || 0);
        setAuditLogs(audits);
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
        <h2 className="text-3xl font-bold tracking-tight text-white">Platform Command Center</h2>
        <p className="text-gray-500 mt-1 italic">Real-time management of Sharia-compliant investment flows.</p>
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
        
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#262626] to-[#1a1a1a] border border-primary/30 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Total Funding Volume</span>
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

      {/* Table Section */}
      <div className="bg-[#1d1d20] rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Pending Verification Requests</h3>
            <p className="text-sm text-gray-500">Entrepreneurs awaiting Sharia-compliance approval</p>
          </div>
          <button 
            onClick={() => navigate('/admin/verification')} 
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
          >
             View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <Loader2 className="animate-spin inline mr-2" /> Loading pending requests...
                  </td>
                </tr>
              ) : pendingVerifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No pending verifications.
                  </td>
                </tr>
              ) : (
                pendingVerifications.slice(0, 5).map((req) => {
                  const profile = req.user?.entrepreneurProfile || req.user?.investorProfile || {};
                  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || req.user?.email;
                  
                  return (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                          <div className="size-9 rounded bg-white/5 flex items-center justify-center text-lg font-bold text-white uppercase">
                            {fullName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{fullName}</span>
                            <span className="text-xs text-gray-500">{req.user?.email}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase">{req.user?.role}</span>
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
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Activity className="text-primary" size={20} /> Recent Audit Log
            </h3>
            <div className="space-y-4">
                {loading ? (
                  <div className="text-xs text-gray-500">Loading audit activity...</div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-xs text-gray-500">No recent activity yet.</div>
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
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Investment Types</h3>
            <div className="space-y-4">
                {loading ? (
                  <div className="text-xs text-gray-500">Loading categories...</div>
                ) : investmentBreakdown.length === 0 ? (
                  <div className="text-xs text-gray-500">No pitch categories yet.</div>
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
            <div className={`h-full ${color} progress-bar-width-${value}`}></div>
        </div>
    </div>
);

export default Dashboard;
