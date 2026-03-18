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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals & Toasts
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  const [roleDraft, setRoleDraft] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (roleFilter !== 'ALL') params.set('role', roleFilter);
      params.set('sortBy', sortBy);
      params.set('page', String(currentPage));
      params.set('pageSize', String(pageSize));

      const res = await fetch(`${API_BASE}/api/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const list = data.data || data || [];
      setUsers(list);
      setTotalItems(data.meta?.total ?? list.length);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, sortBy, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, sortBy, pageSize]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to BAN and DELETE this user? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem('accessToken');
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

  const handleStatusToggle = async (user: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (res.ok) {
        showToast(`User ${user.isActive ? 'deactivated' : 'activated'} successfully.`, 'success');
        setUsers(users.map(u => u.id === user.id ? { ...u, isActive: !user.isActive } : u));
        if (viewUser?.id === user.id) {
          setViewUser({ ...viewUser, isActive: !viewUser.isActive });
        }
      } else {
        showToast('Failed to update user status', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    }
  };

  const handleRoleUpdate = async () => {
    if (!viewUser) return;
    if (!roleDraft || roleDraft === viewUser.role) {
      showToast('No role change selected', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/users/${viewUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: roleDraft }),
      });

      if (res.ok) {
        showToast('Role updated successfully.', 'success');
        setUsers(users.map(u => u.id === viewUser.id ? { ...u, role: roleDraft } : u));
        setViewUser({ ...viewUser, role: roleDraft });
      } else {
        showToast('Failed to update role', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    }
  };

  const handlePasswordReset = async () => {
    if (!viewUser) return;
    const newPassword = window.prompt('Enter a new password for this user');
    if (!newPassword) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/users/password/${viewUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        showToast('Password reset successfully.', 'success');
      } else {
        showToast('Failed to reset password', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    }
  };

  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 mt-1 dark:text-gray-500">Manage, verify, and monitor platform accounts.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input w-full md:w-64 pl-9 pr-4 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 admin-input px-3 py-2">
            <Filter size={16} className="text-slate-500 dark:text-gray-500" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
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
            className="admin-input px-3 py-2 text-sm"
            title="Sort users"
            aria-label="Sort users"
          >
            <option value="date">Sort: Newest</option>
            <option value="name">Sort: A-Z</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="admin-input px-3 py-2 text-sm"
            title="Items per page"
            aria-label="Items per page"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
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
        <div className="text-center py-20 text-slate-500 dark:text-gray-400"><Loader2 className="animate-spin inline mr-2"/> Loading Database...</div>
      ) : (
        <div className="admin-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm text-slate-700 dark:text-gray-300">
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-500 dark:text-gray-500">No users found matching your criteria.</td></tr>
                ) : (
                  users.map((user) => {
                    const profile = user.entrepreneurProfile || user.investorProfile || {};
                    const isInvestor = user.role === 'INVESTOR';
                    return (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-9 rounded-full flex items-center justify-center font-bold text-white ${isInvestor ? 'bg-secondary' : 'bg-primary text-black'}`}>
                                {(profile.firstName || user.email)[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{profile.firstName} {profile.lastName}</p>
                                <p className="text-xs text-slate-500 dark:text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isInvestor ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {user.isVerified ? 
                            <span className="text-green-500 flex items-center gap-1 text-xs font-bold"><Shield size={12}/> Verified</span> : 
                            <span className="text-slate-500 dark:text-gray-500 flex items-center gap-1 text-xs"><ShieldAlert size={12}/> Unverified</span>
                          }
                          {user.isActive === false && (
                            <span className="text-red-500 flex items-center gap-1 text-xs font-bold mt-1">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setViewUser(user); setRoleDraft(user.role); }}
                            className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white admin-button-secondary rounded transition-colors"
                            title="View Profile"
                          >
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors" title="Delete User">
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

      {!loading && totalItems > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-gray-400">
          <div>
            Showing {(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, totalItems)} of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded admin-button-secondary disabled:opacity-40"
              disabled={safePage === 1}
            >
              Prev
            </button>
            <span className="text-slate-500 dark:text-gray-500">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded admin-button-secondary disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 relative dark:bg-[#1d1d20] dark:border-white/10">
            <button 
              onClick={() => { setViewUser(null); setRoleDraft(''); }} 
              className="absolute top-4 right-4 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              title="Close Profile Modal"
              type="button"
              aria-label="Close Profile Modal"
            >
              <X size={20} />
              <span className="sr-only">Close Profile Modal</span>
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               User Profile Details {viewUser.isVerified && <Shield className="text-green-500" size={18} />}
            </h3>
            
            <div className="space-y-4 text-sm text-slate-700 dark:text-gray-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-lg">
                <div>
                  <p className="text-slate-500 dark:text-gray-500 text-xs uppercase mb-1">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white">{viewUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-gray-500 text-xs uppercase mb-1">Role</p>
                  <p className="font-medium text-slate-900 dark:text-white">{viewUser.role}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-gray-500 text-xs uppercase mb-1">Status</p>
                  <p className={`font-medium ${viewUser.isActive === false ? 'text-red-400' : 'text-green-400'}`}>
                    {viewUser.isActive === false ? 'Inactive' : 'Active'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-gray-500 text-xs uppercase mb-1">Joined On</p>
                  <p className="font-medium text-slate-900 dark:text-white">{new Date(viewUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-gray-500 text-xs uppercase mb-1">ID</p>
                  <p className="font-mono text-xs text-slate-400 dark:text-gray-400 truncate" title={viewUser.id}>{viewUser.id.substring(0, 12)}...</p>
                </div>
              </div>

              {/* Profile Details (Entrepreneur or Investor) */}
              {(viewUser.entrepreneurProfile || viewUser.investorProfile) && (
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg space-y-3">
                  <h4 className="text-slate-900 dark:text-white font-bold mb-2">Extended Profile</h4>
                  {Object.entries(viewUser.entrepreneurProfile || viewUser.investorProfile).map(([key, value]) => {
                    if (['id', 'userId', 'createdAt', 'updatedAt'].includes(key) || !value) return null;
                    return (
                      <div key={key} className="flex flex-col border-b border-slate-200 dark:border-white/5 pb-2">
                        <span className="text-slate-500 dark:text-gray-500 text-xs uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-slate-900 dark:text-white font-medium">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <label className="text-xs text-slate-500 dark:text-gray-500 uppercase font-bold">Update Role</label>
                <select
                  value={roleDraft || viewUser.role}
                  onChange={(e) => setRoleDraft(e.target.value)}
                  className="admin-input px-3 py-2 text-sm"
                >
                  <option value="ENTREPRENEUR">Entrepreneur</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="ASPIRING_BUSINESS_OWNER">Aspiring Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button
                  onClick={handleRoleUpdate}
                  className="px-4 py-2 admin-button-secondary rounded"
                >
                  Save Role
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePasswordReset}
                  className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded hover:bg-primary hover:text-black"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleStatusToggle(viewUser)}
                  className={`px-4 py-2 rounded ${viewUser.isActive === false ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-red-600/20 text-red-400 border border-red-600/30'}`}
                >
                  {viewUser.isActive === false ? 'Activate User' : 'Deactivate User'}
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button onClick={() => { setViewUser(null); setRoleDraft(''); }} className="px-4 py-2 admin-button-secondary rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
