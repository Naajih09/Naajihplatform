import { useState } from 'react';
import { CheckCircle, ShieldCheck, XCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Settings = () => {
  const token = localStorage.getItem('accessToken') || '';
  const payload = parseJwt(token);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!payload?.sub) {
      showToast('Unable to read admin profile from token.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/password/${payload.sub}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password updated successfully.', 'success');
      } else {
        showToast('Failed to update password.', 'error');
      }
    } catch (err) {
      showToast('Network error occurred.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 relative">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Admin Settings</h1>
        <p className="text-slate-500 mt-1 dark:text-gray-500">Manage your admin profile and security.</p>
      </div>

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="admin-surface p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Signed in as</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{payload?.email || 'Admin'}</p>
            <p className="text-xs text-slate-500 uppercase dark:text-gray-500">{payload?.role || 'ADMIN'}</p>
          </div>
        </div>
      </div>

      <div className="admin-surface p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="admin-input w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="admin-input w-full px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded hover:bg-primary hover:text-black"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

const parseJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

export default Settings;
