import React, { useEffect, useState } from 'react';
import { Trash2, Shield, ShieldAlert, Loader2, Search, Filter, Eye, CheckCircle, XCircle, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const[loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const[sortBy, setSortBy] = useState<'date' | 'name'>('date');

  // Modals & Toasts
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.data || data ||[]);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  },[]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to BAN and DELETE this user? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        showToast("User has been banned and removed.", "success");
        setUsers(users.filter(u => u.id !== id));
      } else {
        showToast("Failed to delete user", "error");
      }
    } catch (err) {
      showToast("Network error occurred", "error");
    }
  };

  // Processing Data (Search, Filter, Sort)
  let processedUsers = [...users];

  if (roleFilter !== 'ALL') {
    processedUsers = processedUsers.filter(u => u.role === roleFilter);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    processedUsers = processedUsers.filter(u => {
      const profile = u.entrepreneurProfile || u.investorProfile || {};
      const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.toLowerCase();
      return fullName.includes(query) || u.email.toLowerCase().includes(query);
    });
  }

  processedUsers.sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    
    const nameA = (a.entrepreneurProfile?.firstName || a.email).toLowerCase();
    const nameB = (b.entrepreneurProfile?.firstName || b.email).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">User Management</h1>
          <p className="text-gray-500 mt-1">Manage, verify, and monitor platform accounts.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#1d1d20] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#1d1d20] border border-white/10 rounded-lg px-3 py-2">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
              title="Filter by user role"
              aria-label="Filter by user role"
            >
              <option value="ALL">All Roles</option>
              <option value="ENTREPRENEUR">Entrepreneurs</option>
              <option value="INVESTOR">Investors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1d1d20] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            title="Sort users"
            aria-label="Sort users"
          >
            <option value="date">Sort: Newest</option>
            <option value="name">Sort: A-Z</option>
          </select>
        </div>
      </div>

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-white"><Loader2 className="animate-spin inline mr-2"/> Loading Database...</div>
      ) : (
        <div className="bg-[#1d1d20] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {processedUsers.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-500">No users found matching your criteria.</td></tr>
                ) : (
                  processedUsers.map((user) => {
                    const profile = user.entrepreneurProfile || user.investorProfile || {};
                    const isInvestor = user.role === 'INVESTOR';
                    return (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-9 rounded-full flex items-center justify-center font-bold text-white ${isInvestor ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                {(profile.firstName || user.email)[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-white">{profile.firstName} {profile.lastName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isInvestor ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {user.isVerified ? 
                            <span className="text-green-500 flex items-center gap-1 text-xs font-bold"><Shield size={12}/> Verified</span> : 
                            <span className="text-gray-600 flex items-center gap-1 text-xs"><ShieldAlert size={12}/> Unverified</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button onClick={() => setViewUser(user)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors" title="View Profile">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors" title="Ban User">
                            <Trash2 size={16}/>
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
      )}

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1d1d20] border border-white/10 rounded-xl w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setViewUser(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
              title="Close Profile Modal"
              type="button"
              aria-label="Close Profile Modal"
            >
              <X size={20} />
              <span className="sr-only">Close Profile Modal</span>
            </button>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               User Profile Details {viewUser.isVerified && <Shield className="text-green-500" size={18} />}
            </h3>
            
            <div className="space-y-4 text-sm text-gray-300">
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Email</p>
                  <p className="font-medium text-white">{viewUser.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Role</p>
                  <p className="font-medium text-white">{viewUser.role}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Joined On</p>
                  <p className="font-medium text-white">{new Date(viewUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">ID</p>
                  <p className="font-mono text-xs text-gray-400 truncate" title={viewUser.id}>{viewUser.id.substring(0, 12)}...</p>
                </div>
              </div>

              {/* Profile Details (Entrepreneur or Investor) */}
              {(viewUser.entrepreneurProfile || viewUser.investorProfile) && (
                <div className="bg-white/5 p-4 rounded-lg space-y-3">
                  <h4 className="text-white font-bold mb-2">Extended Profile</h4>
                  {Object.entries(viewUser.entrepreneurProfile || viewUser.investorProfile).map(([key, value]) => {
                    if (['id', 'userId', 'createdAt', 'updatedAt'].includes(key) || !value) return null;
                    return (
                      <div key={key} className="flex flex-col border-b border-white/5 pb-2">
                        <span className="text-gray-500 text-xs uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-white font-medium">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button onClick={() => setViewUser(null)} className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;