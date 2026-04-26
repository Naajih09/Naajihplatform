import React, { useEffect, useState } from 'react';
import { UserCheck, X, Loader2 } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

const Connections = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => { if (user.id) fetchData(); }, [user.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resPending = await fetch(`${API_BASE}/connections/pending/${user.id}`, {
        headers: authHeaders,
      }).then(r => r.json());
      const resFriends = await fetch(`${API_BASE}/connections/user/${user.id}`, {
        headers: authHeaders,
      }).then(r => r.json());
      setPending(Array.isArray(resPending) ? resPending : []);
      setFriends(Array.isArray(resFriends) ? resFriends : []);
    } catch (error) {
      setToast({ show: true, message: 'Failed to load connections.', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleResponse = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API_BASE}/connections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`Failed to update connection (${res.status})`);
      fetchData();
      setToast({ show: true, message: status === 'ACCEPTED' ? 'Connection accepted.' : 'Request rejected.', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: 'Action failed.', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Network</h1>
      
      {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" /></div> : (
        <>
          {pending.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Pending Requests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pending.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="size-12 bg-slate-200 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-lg text-slate-600 dark:text-gray-400 overflow-hidden">
                      {req.sender?.entrepreneurProfile?.avatarUrl || req.sender?.investorProfile?.avatarUrl ? (
                        <img
                          src={req.sender?.entrepreneurProfile?.avatarUrl || req.sender?.investorProfile?.avatarUrl}
                          alt={req.sender?.entrepreneurProfile?.firstName || req.sender?.investorProfile?.firstName || 'User'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (req.sender?.entrepreneurProfile?.firstName || req.sender?.investorProfile?.firstName || 'U')[0]
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{req.sender?.entrepreneurProfile?.firstName || 'User'}</h4>
                      <p className="text-xs text-primary font-bold uppercase">{req.sender.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleResponse(req.id, 'ACCEPTED')} disabled={actionLoadingId === req.id} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-all disabled:opacity-50" aria-label="Accept">
                        {actionLoadingId === req.id ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                      </button>
                      <button onClick={() => handleResponse(req.id, 'REJECTED')} disabled={actionLoadingId === req.id} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50" aria-label="Reject">
                        {actionLoadingId === req.id ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">My Connections ({friends.length})</h3>
            {friends.length === 0 ? (
              <EmptyState
                title="No connections yet"
                description="You haven't connected with anyone yet. Browse opportunities to find partners and start building your network."
                actionLabel="Browse opportunities"
                actionTo="/dashboard/opportunities"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {friends.map((conn) => {
                  const other = conn.senderId === user.id ? conn.receiver : conn.sender;
                  const profile = other.entrepreneurProfile || other.investorProfile || {};
                  return (
                    <div key={conn.id} className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex items-center gap-3">
                       <div className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold overflow-hidden">
                         {profile.avatarUrl ? (
                           <img
                             src={profile.avatarUrl}
                             alt={profile.firstName || 'User'}
                             className="h-full w-full object-cover"
                           />
                         ) : (
                           (profile.firstName || 'U')[0]
                         )}
                       </div>
                       <div><h4 className="font-bold text-slate-900 dark:text-white text-sm">{profile.firstName}</h4><p className="text-[10px] text-slate-500 uppercase">{other.role}</p></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Connections;
