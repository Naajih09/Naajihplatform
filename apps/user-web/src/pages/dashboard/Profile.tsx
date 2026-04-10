import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added navigation
import { Briefcase, Globe, Loader2, MapPin, UploadCloud, Verified, ShieldCheck, Edit3, X, Sparkles, Layers3, BadgeCheck } from 'lucide-react';
import Button from '../../components/Button';
import { useAppDispatch } from '../../store/store';
import { setUser as setAuthUser } from '../../store/slices/auth-slice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // 1. Get User Safely
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [user, setUser] = useState<any>(localUser);
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [stats, setStats] = useState({
    activePitches: 0,
    pendingConnections: 0,
    isVerified: false,
    totalViews: 0,
  });
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  // 2. CHECK IF LOGGED IN
  useEffect(() => {
    if (!localUser.id || !localUser.email) {
      setToast({ show: true, message: 'Session expired. Please log in again.', type: 'error' });
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${localUser.email}`, {
          headers: authHeaders,
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          // Sync formData with fetched data
          const profileData = data.role === 'ENTREPRENEUR' ? data.entrepreneurProfile : data.investorProfile;
          setFormData(profileData || {});
        }
      } catch (err) {
        setToast({ show: true, message: 'Failed to load profile.', type: 'error' });
      }
    };
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/stats/${localUser.id}`, {
          headers: authHeaders,
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchProfile();
    fetchStats();
  }, []);

  // SAVE DATA
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety Check
    if (!user.id) {
        setToast({ show: true, message: 'User ID missing. Please re-login.', type: 'error' });
        return;
    }

    setLoading(true);
    const payload: any = {};
    if (user.role === 'ENTREPRENEUR') payload.entrepreneurProfile = formData;
    else payload.investorProfile = formData;

    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setToast({ show: true, message: 'Profile updated.', type: 'success' });
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Update failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getProfile = () => user.entrepreneurProfile || user.investorProfile || {};
  const profile = getProfile();
  const profileAvatar = formData.avatarUrl || profile.avatarUrl || user.avatarUrl || '';
  const roleLabel =
    user.role === 'ENTREPRENEUR'
      ? 'Founder Portfolio'
      : user.role === 'INVESTOR'
        ? 'Investor Portfolio'
        : 'Profile Portfolio';
  const profileSummary =
    user.role === 'ENTREPRENEUR'
      ? 'Showcase your venture, traction, stage, and market focus in a format investors can scan fast.'
      : user.role === 'INVESTOR'
        ? 'Showcase your investment focus, ticket size, and mandate in a format founders can understand quickly.'
        : 'Present your public identity, focus, and platform activity in a polished portfolio-style layout.';
  const portfolioHighlights = user.role === 'ENTREPRENEUR'
    ? [
        { label: 'Business', value: profile.businessName || 'Not set' },
        { label: 'Stage', value: profile.stage || 'Not set' },
        { label: 'Industry', value: profile.industry || 'Not set' },
        { label: 'Location', value: profile.location || 'Nigeria' },
      ]
    : [
        { label: 'Organization', value: profile.organization || 'Not set' },
        { label: 'Ticket Size', value: profile.maxTicketSize ? `NGN ${Number(profile.maxTicketSize).toLocaleString()}` : 'Not set' },
        { label: 'Location', value: profile.location || 'Nigeria' },
        { label: 'Focus', value: profile.focusIndustries?.length ? profile.focusIndustries.join(', ') : 'General' },
      ];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch(`${API_BASE}/upload?folder=avatars`, {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to upload profile picture.');
      }

      if (data?.secure_url || data?.url) {
        const avatarUrl = data.secure_url || data.url;
        setFormData((prev: any) => ({ ...prev, avatarUrl }));
        setUser((prev: any) => ({
          ...prev,
          entrepreneurProfile:
            prev.role === 'ENTREPRENEUR'
              ? { ...prev.entrepreneurProfile, avatarUrl }
              : prev.entrepreneurProfile,
          investorProfile:
            prev.role === 'INVESTOR'
              ? { ...prev.investorProfile, avatarUrl }
              : prev.investorProfile,
        }));

        if (user?.id) {
          const payload =
            user.role === 'ENTREPRENEUR'
              ? { entrepreneurProfile: { ...formData, avatarUrl } }
              : { investorProfile: { ...formData, avatarUrl } };

          const saveRes = await fetch(`${API_BASE}/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders,
            },
            body: JSON.stringify(payload),
          });

          if (saveRes.ok) {
            const updatedUser = await saveRes.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            dispatch(setAuthUser(updatedUser));
            setUser(updatedUser);
          }
        }
      } else {
        throw new Error('Upload completed but no image URL was returned.');
      }
    } catch (err: any) {
      setToast({ show: true, message: err?.message || 'Failed to upload profile picture.', type: 'error' });
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  // Styles
  const inputStyle = "w-full p-3 bg-slate-50 dark:bg-[#151518] border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-400";
  const labelStyle = "block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-[1200px] mx-auto pb-20 font-sans text-slate-900 dark:text-white">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
           <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your public identity and business details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT SIDEBAR (Portfolio) --- */}
        <aside className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-white dark:bg-[#1d1f23]/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" />
              <h3 className="text-primary text-sm font-bold uppercase tracking-widest">Portfolio Snapshot</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {portfolioHighlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/40 font-bold">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1d1f23]/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={16} className="text-primary" />
              <h3 className="text-primary text-sm font-bold uppercase tracking-widest">Focus Areas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(user.role === 'ENTREPRENEUR'
                ? ['#HalalTech', '#AgriBusiness', '#SaaS', '#IslamicFinance']
                : ['#DealFlow', '#ImpactInvesting', '#GrowthCapital', '#ShariaCompliance']
              ).map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-slate-600 dark:text-white/80">{tag}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* --- MAIN PROFILE --- */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
          
          {/* Header Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#111216] to-[#131315] border border-white/10 rounded-xl p-8 shadow-lg relative text-white overflow-hidden">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,193,7,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,193,7,0.08),transparent_25%)]" />
            <button 
              type="button"
              onClick={() => setIsEditing(!isEditing)} 
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white"
              aria-label="Edit Profile"
            >
              {isEditing ? <X size={20} /> : <Edit3 size={20} />}
            </button>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className="relative">
                <div className="w-28 h-28 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl font-bold border-2 border-primary text-white">
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt={`${getProfile().firstName || 'User'} profile`}
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    (getProfile().firstName || 'U')[0]
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1 rounded-lg">
                  <Verified size={16} />
                </div>
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-[0.28em] text-primary mb-4">
                  <Layers3 size={14} />
                  {roleLabel}
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                  {getProfile().firstName || 'Update'} {getProfile().lastName || 'Name'}
                </h1>
                <p className="max-w-2xl text-sm text-white/70 mb-4">
                  {profileSummary}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><MapPin size={16}/> {getProfile().location || 'Nigeria'}</span>
                  <span className="flex items-center gap-1 text-primary"><ShieldCheck size={16}/> Sharia Compliant</span>
                  {getProfile().website && (
                    <span className="flex items-center gap-1">
                      <Globe size={16} /> {getProfile().website}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- EDIT MODE FORM --- */}
          {isEditing ? (
            <div className="bg-white dark:bg-[#1d1f23] border border-slate-200 dark:border-white/10 rounded-xl p-8 animate-in fade-in slide-in-from-top-4 shadow-sm">
               <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Edit Profile</h3>
               <form onSubmit={handleUpdate} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyle}>First Name</label>
                        <input aria-label="First Name" className={inputStyle} value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div>
                        <label className={labelStyle}>Last Name</label>
                        <input aria-label="Last Name" className={inputStyle} value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                 </div>

                 <div>
                    <label className={labelStyle}>Profile Picture</label>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 rounded-xl border border-dashed border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#151518] p-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                        {profileAvatar ? (
                          <img
                            src={profileAvatar}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-black text-slate-500 dark:text-white/40">
                            {(formData.firstName || getProfile().firstName || 'U')[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-slate-600 dark:text-white/70">
                          Add a clear profile picture so your portfolio feels more personal and trusted.
                        </p>
                        <label className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black cursor-pointer hover:brightness-110">
                          {avatarUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                          {avatarUploading ? 'Uploading...' : 'Upload picture'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </label>
                      </div>
                    </div>
                 </div>

                 {user.role === 'ENTREPRENEUR' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyle}>Business Name</label>
                                <input aria-label="Business Name" className={inputStyle} value={formData.businessName || ''} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                            </div>
                            <div>
                                <label className={labelStyle}>Industry</label>
                                <select aria-label="Industry" className={inputStyle} value={formData.industry || ''} onChange={e => setFormData({...formData, industry: e.target.value})}>
                                    <option value="">Select...</option><option>FinTech</option><option>AgriTech</option><option>HealthTech</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className={labelStyle}>Location</label>
                              <input aria-label="Location" className={inputStyle} value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                          </div>
                          <div>
                              <label className={labelStyle}>Stage</label>
                              <select aria-label="Stage" className={inputStyle} value={formData.stage || ''} onChange={e => setFormData({...formData, stage: e.target.value})}>
                                    <option value="">Select Stage</option>
                                    <option>Idea Phase</option><option>MVP / Prototype</option><option>Generating Revenue</option><option>Scaling</option>
                              </select>
                          </div>
                        </div>
                    </>
                 )}

                 {user.role === 'INVESTOR' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Organization</label>
                            <input aria-label="Organization Name" className={inputStyle} value={formData.organization || ''} onChange={e => setFormData({...formData, organization: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelStyle}>Max Ticket Size</label>
                            <input aria-label="Ticket Size" type="number" className={inputStyle} value={formData.maxTicketSize || ''} onChange={e => setFormData({...formData, maxTicketSize: e.target.value})} />
                        </div>
                    </div>
                 )}

                 <div className="flex justify-end pt-4">
                    <Button type="submit" isLoading={loading} className="bg-primary text-black font-bold">Save Changes</Button>
                 </div>
               </form>
            </div>
          ) : (
            // --- VIEW MODE STATS ---
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { l: 'Active Pitches', v: String(stats.activePitches), sub: 'Total' },
                    { l: 'Pending', v: String(stats.pendingConnections), sub: 'Connections' },
                    { l: 'Verified', v: stats.isVerified ? 'Yes' : 'No', sub: 'Account' },
                    { l: 'Total Views', v: String(stats.totalViews || 0), sub: 'Profile' }
                ].map(stat => (
                    <div key={stat.l} className="bg-white dark:bg-[#1d1f23]/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-center shadow-sm">
                        <span className="text-slate-500 dark:text-[#abb89d] text-[10px] font-bold uppercase">{stat.l}</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white my-1">{stat.v}</p>
                        <span className="text-[10px] text-slate-400 dark:text-white/40">{stat.sub}</span>
                    </div>
                ))}
            </div>
          )}

          {!isEditing && (
            <div className="bg-white dark:bg-[#1d1f23] border border-slate-200 dark:border-white/10 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio Overview</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    A quick read of your public-facing business profile.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  <BadgeCheck size={14} />
                  Portfolio
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioHighlights.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-white/40 font-bold">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
