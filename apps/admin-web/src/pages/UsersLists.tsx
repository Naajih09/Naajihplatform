import React, { useEffect, useState } from 'react';
import { Trash2, User, Mail, Shield, ShieldAlert, Loader2 } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH ALL USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. DELETE USER (The Ban Hammer)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to BAN and DELETE this user? This cannot be undone.")) return;

    try {
      await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      alert("User has been banned and removed.");
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-black tracking-tight text-white">User Management</h1>

      {loading ? (
        <div className="text-center py-20 text-white"><Loader2 className="animate-spin inline"/> Loading Database...</div>
      ) : (
        <div className="bg-[#1d1d20] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
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
              {users.map((user) => {
                const profile = user.entrepreneurProfile || user.investorProfile || {};
                return (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                            {(profile.firstName || user.email)[0]}
                        </div>
                        <div>
                            <p className="font-bold text-white">{profile.firstName} {profile.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.role === 'INVESTOR' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
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
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(user.id)} className="px-3 py-1.5 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg font-bold text-xs hover:bg-red-900/40 flex items-center gap-2 ml-auto">
                        <Trash2 size={14}/> BAN USER
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

export default UsersList;