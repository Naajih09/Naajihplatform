import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, FileText, ExternalLink, Loader2 } from 'lucide-react';

const Verification = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH PENDING REQUESTS
  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/verification/admin/pending');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. HANDLE APPROVE / REJECT
  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to ${status} this user?`)) return;

    try {
      await fetch(`http://localhost:3000/api/verification/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      alert(`User ${status}!`);
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-white">KYC Verification Queue</h1>

      {loading ? (
        <div className="text-white text-center py-20"><Loader2 className="animate-spin inline"/> Loading...</div>
      ) : requests.length === 0 ? (
        <div className="p-10 bg-[#1d1d20] rounded-xl border border-white/5 text-center text-gray-500">
           No pending verifications. Good job!
        </div>
      ) : (
        <div className="bg-[#1d1d20] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
              {requests.map((req) => {
                const profile = req.user.entrepreneurProfile || req.user.investorProfile || {};
                return (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {profile.firstName} {profile.lastName}
                      <div className="text-xs text-gray-500 font-normal">{req.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded font-bold">{req.user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={req.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <FileText size={16} /> View Document <ExternalLink size={12}/>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleAction(req.id, 'APPROVED')} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1">
                        <CheckCircle size={14}/> Approve
                      </button>
                      <button onClick={() => handleAction(req.id, 'REJECTED')} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1">
                        <XCircle size={14}/> Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Verification;