import React, { useEffect, useState } from 'react';
import { UserCheck, UserPlus, X, Loader2 } from 'lucide-react';
import Button from '../../components/Button';

const Connections = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { if (user.id) fetchData(); }, [user.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resPending = await fetch(`http://localhost:3000/api/connections/pending/${user.id}`).then(r => r.json());
      const resFriends = await fetch(`http://localhost:3000/api/connections/user/${user.id}`).then(r => r.json());
      setPending(Array.isArray(resPending) ? resPending : []);
      setFriends(Array.isArray(resFriends) ? resFriends : []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleResponse = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await fetch(`http://localhost:3000/api/connections/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      fetchData();
      alert(status === 'ACCEPTED' ? "Connection Accepted!" : "Request Rejected");
    } catch (error) { alert("Action failed"); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Network</h1>
      
      {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" /></div> : (
        <>
          {pending.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Pending Requests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pending.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="size-12 bg-slate-200 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-lg text-slate-600 dark:text-gray-400">
                      {(req.sender?.entrepreneurProfile?.firstName || 'U')[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{req.sender?.entrepreneurProfile?.firstName || 'User'}</h4>
                      <p className="text-xs text-primary font-bold uppercase">{req.sender.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleResponse(req.id, 'ACCEPTED')} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-all" aria-label="Accept"><UserCheck size={18} /></button>
                      <button onClick={() => handleResponse(req.id, 'REJECTED')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" aria-label="Reject"><X size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">My Connections ({friends.length})</h3>
            {friends.length === 0 ? (
              <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-2xl p-8 text-center">
                  <UserPlus size={32} className="text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Grow your Network</h3>
                  <Button className="bg-primary text-black font-bold">Browse Opportunities</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {friends.map((conn) => {
                  const other = conn.senderId === user.id ? conn.receiver : conn.sender;
                  const profile = other.entrepreneurProfile || other.investorProfile || {};
                  return (
                    <div key={conn.id} className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex items-center gap-3">
                       <div className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">{(profile.firstName || 'U')[0]}</div>
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