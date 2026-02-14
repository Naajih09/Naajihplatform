import React, { useState, useEffect } from 'react';
import { User, Save, Briefcase, Building, MapPin, Loader2, Verified, ShieldCheck, Edit3, X } from 'lucide-react';
import Button from '../../components/Button';

const Profile = () => {
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [user, setUser] = useState<any>(localUser);
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchProfile = async () => {
      if (!localUser.email) return;
      try {
        const res = await fetch(`http://localhost:3000/api/users/${localUser.email}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          const profileData = data.role === 'ENTREPRENEUR' ? data.entrepreneurProfile : data.investorProfile;
          setFormData(profileData || {});
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // SAVE DATA
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: any = {};
    if (user.role === 'ENTREPRENEUR') payload.entrepreneurProfile = formData;
    else payload.investorProfile = formData;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = () => user.entrepreneurProfile || user.investorProfile || {};

  const inputStyle = "w-full p-3 bg-slate-50 dark:bg-[#151518] border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-400";
  const labelStyle = "block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-[1200px] mx-auto pb-20 font-sans text-slate-900 dark:text-white">
      
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
           <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your public identity and business details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT SIDEBAR (Stats) --- */}
        <aside className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-white dark:bg-[#1d1f23]/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {['#HalalTech', '#AgriBusiness', '#SaaS', '#IslamicFinance'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-slate-600 dark:text-white/80">{tag}</span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1d1f23]/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
             <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Activity</h3>
             <div className="text-sm text-slate-500 dark:text-gray-400">No recent activity</div>
          </div>
        </aside>

        {/* --- MAIN PROFILE --- */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
          
          <div className="bg-gradient-to-br from-slate-900 to-[#131315] border-l-4 border-l-primary rounded-xl p-8 shadow-lg relative text-white">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white"
              aria-label="Edit Profile"
            >
              {isEditing ? <X size={20} /> : <Edit3 size={20} />}
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className="relative">
                <div className="w-28 h-28 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl font-bold border-2 border-primary text-white">
                   {getProfile().firstName?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1 rounded-lg">
                  <Verified size={16} />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                  {getProfile().firstName || 'Update'} {getProfile().lastName || 'Name'}
                </h1>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase tracking-tighter mb-4">
                  {user.role}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><MapPin size={16}/> {getProfile().location || 'Nigeria'}</span>
                  <span className="flex items-center gap-1 text-primary"><ShieldCheck size={16}/> Sharia Compliant</span>
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
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-gray-400">You are not authorized to view this page.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;