import { useEffect, useState } from 'react';
import { CheckCircle, Eye, EyeOff, Loader2, Save, ShieldCheck, UserPlus, XCircle } from 'lucide-react';
import api from '../utils/api';
import { ADMIN_PERMISSIONS, AdminPermission, storeAdminPermissions } from '../utils/admin-access';

interface AdminUser {
  id: string;
  email: string;
  adminPermissions?: AdminPermission[];
  isActive?: boolean;
  createdAt?: string;
  entrepreneurProfile?: {
    firstName?: string;
    lastName?: string;
  };
}

const Settings = () => {
  const token = localStorage.getItem('accessToken') || '';
  const payload = parseJwt(token);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminTeam, setAdminTeam] = useState<AdminUser[]>([]);
  const [permissionDrafts, setPermissionDrafts] = useState<Record<string, AdminPermission[]>>({});
  const [teamLoading, setTeamLoading] = useState(true);
  const [savingAdminId, setSavingAdminId] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adminPermissions: ['dashboard', 'settings'] as AdminPermission[],
  });
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const loadAdminTeam = async () => {
    setTeamLoading(true);
    try {
      const response = await api.get('/users/admin/team');
      const team = Array.isArray(response.data) ? response.data : [];
      setAdminTeam(team);
      setPermissionDrafts(
        team.reduce((drafts: Record<string, AdminPermission[]>, admin: AdminUser) => {
          drafts[admin.id] = Array.isArray(admin.adminPermissions)
            ? admin.adminPermissions
            : [];
          return drafts;
        }, {}),
      );
    } catch {
      showToast('Unable to load admin team.', 'error');
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTeam();
  }, []);

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
      await api.patch(`/users/password/${payload.sub}`, { password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully.', 'success');
    } catch (err) {
      showToast('Network error occurred.', 'error');
    }
  };

  const togglePermission = (adminId: string, permission: AdminPermission) => {
    setPermissionDrafts((current) => {
      const existing = current[adminId] || [];
      return {
        ...current,
        [adminId]: existing.includes(permission)
          ? existing.filter((item) => item !== permission)
          : [...existing, permission],
      };
    });
  };

  const toggleNewAdminPermission = (permission: AdminPermission) => {
    setNewAdmin((current) => ({
      ...current,
      adminPermissions: current.adminPermissions.includes(permission)
        ? current.adminPermissions.filter((item) => item !== permission)
        : [...current.adminPermissions, permission],
    }));
  };

  const savePermissions = async (admin: AdminUser) => {
    const adminPermissions = permissionDrafts[admin.id] || [];
    if (adminPermissions.length === 0) {
      showToast('Select at least one permission for this admin.', 'error');
      return;
    }

    setSavingAdminId(admin.id);
    try {
      const response = await api.patch(`/users/admin/team/${admin.id}/permissions`, {
        adminPermissions,
      });
      setAdminTeam((current) =>
        current.map((item) => (item.id === admin.id ? response.data : item)),
      );
      if (admin.id === payload?.sub) {
        storeAdminPermissions(response.data?.adminPermissions);
      }
      showToast('Admin permissions updated.', 'success');
    } catch {
      showToast('Unable to update permissions.', 'error');
    } finally {
      setSavingAdminId('');
    }
  };

  const createAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newAdmin.adminPermissions.length === 0) {
      showToast('Select at least one permission for this admin.', 'error');
      return;
    }
    if (newAdmin.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setCreatingAdmin(true);
    try {
      await api.post('/users/admin/team', newAdmin);
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        adminPermissions: ['dashboard', 'settings'],
      });
      showToast('Admin team member created.', 'success');
      await loadAdminTeam();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to create admin team member.';
      showToast(Array.isArray(message) ? message[0] : message, 'error');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
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
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input w-full px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((current) => !current)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-800 dark:text-gray-500 dark:hover:text-white"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-input w-full px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-800 dark:text-gray-500 dark:hover:text-white"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded hover:bg-primary hover:text-black"
          >
            Update Password
          </button>
        </form>
      </div>

      <div className="admin-surface p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Team Management</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Give trusted staff access to only the admin sections they need.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Section Access
          </span>
        </div>

        <form onSubmit={createAdmin} className="rounded-2xl border border-slate-200 p-4 dark:border-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-primary" />
            <h3 className="font-bold text-slate-900 dark:text-white">Add Admin Staff</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              value={newAdmin.firstName}
              onChange={(event) => setNewAdmin((current) => ({ ...current, firstName: event.target.value }))}
              className="admin-input px-3 py-2"
              placeholder="First name"
              required
            />
            <input
              value={newAdmin.lastName}
              onChange={(event) => setNewAdmin((current) => ({ ...current, lastName: event.target.value }))}
              className="admin-input px-3 py-2"
              placeholder="Last name"
              required
            />
            <input
              type="email"
              value={newAdmin.email}
              onChange={(event) => setNewAdmin((current) => ({ ...current, email: event.target.value }))}
              className="admin-input px-3 py-2"
              placeholder="Email address"
              required
            />
            <input
              type="password"
              value={newAdmin.password}
              onChange={(event) => setNewAdmin((current) => ({ ...current, password: event.target.value }))}
              className="admin-input px-3 py-2"
              placeholder="Temporary password"
              required
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {ADMIN_PERMISSIONS.map((permission) => (
              <label
                key={permission.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm dark:border-gray-800"
              >
                <input
                  type="checkbox"
                  checked={newAdmin.adminPermissions.includes(permission.id)}
                  onChange={() => toggleNewAdminPermission(permission.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-bold text-slate-900 dark:text-white">{permission.label}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-500">{permission.description}</span>
                </span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={creatingAdmin}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
          >
            {creatingAdmin ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Create Admin
          </button>
        </form>

        {teamLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            Loading admin team...
          </div>
        ) : (
          <div className="space-y-4">
            {adminTeam.map((admin) => {
              const permissions = permissionDrafts[admin.id] || [];
              const isCurrentAdmin = admin.id === payload?.sub;
              const name = [
                admin.entrepreneurProfile?.firstName,
                admin.entrepreneurProfile?.lastName,
              ]
                .filter(Boolean)
                .join(' ') || 'Admin';

              return (
                <div key={admin.id} className="rounded-2xl border border-slate-200 p-4 dark:border-gray-800">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                        {isCurrentAdmin ? (
                          <span className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                            You
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{admin.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => savePermissions(admin)}
                      disabled={savingAdminId === admin.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-black disabled:opacity-60"
                    >
                      {savingAdminId === admin.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Access
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {ADMIN_PERMISSIONS.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={permissions.includes(permission.id)}
                          onChange={() => togglePermission(admin.id, permission.id)}
                          className="mt-1"
                        />
                        <span>
                          <span className="block font-bold text-slate-900 dark:text-white">{permission.label}</span>
                          <span className="text-xs text-slate-500 dark:text-gray-500">{permission.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
