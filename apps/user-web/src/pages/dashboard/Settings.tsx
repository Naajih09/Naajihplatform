import React, { useState } from 'react';
import { User, Bell, Lock, LogOut, Trash2, Save, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [activeTab, setActiveTab] = useState('security');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/users/password/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) throw new Error("Failed to update password");
      alert("Password updated successfully!");
      setPassword('');
    } catch (err) {
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await fetch(`http://localhost:3000/api/users/${user.id}`, { method: 'DELETE' });
      alert("Account deleted.");
      handleLogout();
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-20">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
            {['Security', 'Notifications'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                      activeTab === tab.toLowerCase() 
                      ? 'bg-primary text-black' 
                      : 'hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400'
                    }`}
                >
                    {tab}
                </button>
            ))}
            <div className="pt-8">
                <button onClick={handleDeleteAccount} className="w-full text-left px-4 py-3 rounded-xl font-bold text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                    <Trash2 size={16} /> Delete Account
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            
            {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800">
                        <Lock className="text-primary" size={24} />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security & Password</h3>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                        <input 
                            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-slate-100 dark:bg-[#151518] border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:border-primary focus:outline-none"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading} className="bg-slate-900 text-white dark:bg-white dark:text-black font-bold">Update Password</Button>
                    </div>
                </form>
            )}

            {activeTab === 'notifications' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800">
                        <Bell className="text-primary" size={24} />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Preferences</h3>
                    </div>
                    <p className="text-slate-500 dark:text-gray-500 text-sm">Email notifications are enabled by default.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;