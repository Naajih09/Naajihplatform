import React, { useEffect, useState } from 'react';
import { UserCheck, UserPlus, X, ShieldCheck, Loader2 } from 'lucide-react';
import Button from '../../components/Button';

const Connections = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 1. FETCH DATA ON LOAD
  useEffect(() => {
    if (user.id) {
      fetchData();
    }
  }, [user.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Pending Requests (Incoming)
      const resPending = await fetch(`http://localhost:3000/api/connections/pending/${user.id}`);
      const dataPending = await resPending.json();
      
      // Fetch Accepted Connections (My Network)
      const resFriends = await fetch(`http://localhost:3000/api/connections/user/${user.id}`);
      const dataFriends = await resFriends.json();

      setPending(Array.isArray(dataPending) ? dataPending : []);
      setFriends(Array.isArray(dataFriends) ? dataFriends : []);
    } catch (error) {
      console.error("Failed to load connections", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. HANDLE ACCEPT / REJECT
  const handleResponse = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await fetch(`http://localhost:3000/api/connections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      // Refresh list
      fetchData();
      alert(status === 'ACCEPTED' ? "Connection Accepted!" : "Request Rejected");
    } catch (error) {
      alert("Action failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans text-white pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Network</h1>
          <p className="text-gray-400 mt-1">Manage your professional relationships.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" /></div>
      ) : (
        <>
          {/* PENDING REQUESTS SECTION */}
          {pending.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pending Requests ({pending.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pending.map((req) => (
                  <div key={req.id} className="bg-[#151518] border border-gray-800 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="size-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-lg text-gray-400 border border-gray-700">
                      {req.sender?.entrepreneurProfile?.firstName?.[0] || req.sender?.investorProfile?.firstName?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">
                        {req.sender?.entrepreneurProfile?.firstName} {req.sender?.entrepreneurProfile?.lastName}
                        {req.sender?.investorProfile?.firstName} {req.sender?.investorProfile?.lastName}
                      </h4>
                      <p className="text-xs text-primary font-bold uppercase">{req.sender.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleResponse(req.id, 'ACCEPTED')} 
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-all"
                        aria-label="Accept Connection"
                      >
                        <UserCheck size={18} />
                      </button>
                      <button 
                        onClick={() => handleResponse(req.id, 'REJECTED')} 
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        aria-label="Reject Connection"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY CONNECTIONS SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">My Connections ({friends.length})</h3>
            
            {friends.length === 0 ? (
              <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-8 text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-gray-800 rounded-full mb-4">
                      <UserPlus size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Grow your Network</h3>
                  <p className="text-gray-400 max-w-sm mx-auto mb-6">You haven't connected with anyone yet. Browse opportunities to find partners.</p>
                  <Button className="bg-primary text-black font-bold">Browse Opportunities</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {friends.map((conn) => {
                  // Determine who is the "Other Person" (Sender or Receiver)
                  const other = conn.senderId === user.id ? conn.receiver : conn.sender;
                  const profile = other.entrepreneurProfile || other.investorProfile || {};
                  
                  return (
                    <div key={conn.id} className="bg-[#151518] border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                       <div className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                          {profile.firstName?.[0] || 'U'}
                       </div>
                       <div>
                          <h4 className="font-bold text-white text-sm">{profile.firstName} {profile.lastName}</h4>
                          <p className="text-[10px] text-gray-500 uppercase">{other.role}</p>
                       </div>
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