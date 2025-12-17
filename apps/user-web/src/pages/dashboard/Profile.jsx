import React, { useState, useEffect } from 'react';
import { User, Save, Briefcase, Building } from 'lucide-react';
import Button from '../../components/Button';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form based on Role
  useEffect(() => {
    if (user.role === 'ENTREPRENEUR') {
      setFormData(user.entrepreneurProfile || {});
    } else {
      setFormData(user.investorProfile || {});
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data structure for backend
    const payload = {};
    if (user.role === 'ENTREPRENEUR') {
      payload.entrepreneurProfile = formData;
    } else {
      payload.investorProfile = formData;
    }

    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const updatedUser = await res.json();
      
      if (!res.ok) throw new Error("Update failed");

      // Update Local Storage & UI
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile Updated Successfully!");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">My Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        
        {/* Header Info */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 bg-brand-blue rounded-full text-white flex items-center justify-center text-2xl font-bold">
            {user.entrepreneurProfile?.firstName?.[0] || user.investorProfile?.firstName?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-dark">
                {user.entrepreneurProfile?.firstName} {user.entrepreneurProfile?.lastName}
                {user.investorProfile?.firstName} {user.investorProfile?.lastName}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-brand-blue text-xs font-bold rounded uppercase">
                {user.role}
            </span>
          </div>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {user.role === 'ENTREPRENEUR' && (
            <>
              <h3 className="font-bold text-gray-700 flex items-center gap-2"><Briefcase size={18}/> Business Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                    <input className="w-full p-2 border rounded" value={formData.businessName || ''} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Industry</label>
                    <select className="w-full p-2 border rounded" value={formData.industry || ''} onChange={e => setFormData({...formData, industry: e.target.value})}>
                        <option value="">Select Industry</option>
                        <option>FinTech</option><option>AgriTech</option><option>HealthTech</option><option>Retail</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Stage</label>
                    <select className="w-full p-2 border rounded" value={formData.stage || ''} onChange={e => setFormData({...formData, stage: e.target.value})}>
                        <option value="">Select Stage</option>
                        <option>Idea Phase</option><option>MVP / Prototype</option><option>Generating Revenue</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input className="w-full p-2 border rounded" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {user.role === 'INVESTOR' && (
            <>
              <h3 className="font-bold text-gray-700 flex items-center gap-2"><Building size={18}/> Investment Criteria</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Organization / Firm</label>
                    <input className="w-full p-2 border rounded" value={formData.organization || ''} onChange={e => setFormData({...formData, organization: e.target.value})} />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Min Ticket Size (₦)</label>
                    <input type="number" className="w-full p-2 border rounded" value={formData.minTicketSize || ''} onChange={e => setFormData({...formData, minTicketSize: e.target.value})} />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" isLoading={loading} className="px-8">
                <Save size={18} /> Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;