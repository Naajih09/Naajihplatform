import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, TrendingUp, DollarSign, Clock, 
  ChevronDown, Verified, Plus, X, UserPlus, CheckCircle 
} from 'lucide-react';
import Button from '../../components/Button';

const Opportunities = () => {
  const [pitches, setPitches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/pitches');
      const data = await res.json();
      setPitches(data);
    } catch (error) {
      console.error("Failed to load pitches", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (pitch: any) => {
    if (pitch.userId === user.id) {
        alert("You cannot connect with your own pitch!");
        return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: pitch.userId 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send request");

      setSentRequests((prev) => ({ ...prev, [pitch.id]: true }));
      alert(`Connection request sent to ${pitch.user?.entrepreneurProfile?.firstName || 'Entrepreneur'}!`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Ethical Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">Discover and fund Shariah-compliant businesses.</p>
        </div>
        <div className="w-full md:w-96 flex gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              className="w-full bg-slate-200 dark:bg-[#1d1f23] border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500 text-slate-900 dark:text-white" 
              placeholder="Search..." 
              aria-label="Search opportunities"
            />
          </div>
          {user.role === 'ENTREPRENEUR' && (
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-neutral-dark px-4 font-bold">
              <Plus size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* FEED */}
      {loading ? (
         <div className="text-center py-20 text-slate-500 animate-pulse">Loading opportunities...</div>
      ) : pitches.length === 0 ? (
        <div className="text-center p-10 bg-slate-100 dark:bg-[#1d1f23] rounded-xl border border-dashed border-slate-300 dark:border-white/10">
          <p className="text-slate-500">No opportunities posted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pitches.map((pitch) => (
            <div key={pitch.id} className="group bg-slate-100 dark:bg-[#1d1f23] border border-slate-200 dark:border-white/5 rounded-xl p-5 flex flex-col hover:shadow-lg transition-all duration-300">
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-lg bg-white dark:bg-[#2d2f34] flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                  {pitch.title.charAt(0)}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <Verified size={14} className="text-primary fill-current" />
                    <span className="text-[10px] font-bold text-primary uppercase">Verified</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{pitch.category}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pitch.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">{pitch.tagline}</p>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-200/50 dark:bg-black/20 rounded-xl">
                <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Ask</p>
                    <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold">
                        <DollarSign size={14} className="text-primary"/> ₦{parseInt(pitch.fundingAsk).toLocaleString()}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Equity</p>
                    <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold">
                        <TrendingUp size={14} className="text-primary"/> {pitch.equityOffer}%
                    </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-slate-200 dark:border-white/5">
                <button className="flex-1 py-2.5 rounded-lg border border-primary/40 text-primary text-xs font-bold hover:bg-primary/5 transition-colors">
                    View Details
                </button>
                {user.role === 'INVESTOR' && (
                    <button 
                        onClick={() => handleConnect(pitch)}
                        disabled={sentRequests[pitch.id]}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            sentRequests[pitch.id] 
                            ? 'bg-green-500/20 text-green-500 cursor-default' 
                            : 'bg-primary text-neutral-dark hover:opacity-90'
                        }`}
                    >
                        {sentRequests[pitch.id] ? <CheckCircle size={16} /> : <UserPlus size={16} />}
                        {sentRequests[pitch.id] ? 'Sent' : 'Connect'}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <CreatePitchModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchPitches(); }}
          userId={user.id}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: CREATE PITCH FORM ---
const CreatePitchModal = ({ onClose, onSuccess, userId }: any) => {
  const [formData, setFormData] = useState({
    title: '', tagline: '', problemStatement: '', solution: '', 
    traction: '', marketSize: '', fundingAsk: '', equityOffer: '', category: 'FinTech'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:3000/api/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });
      if (!res.ok) throw new Error("Failed to post");
      alert("Pitch Posted Successfully!");
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = "w-full p-3 bg-slate-100 dark:bg-[#151518] border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-white focus:border-primary focus:outline-none transition-colors";
  const labelStyle = "block text-sm font-bold text-slate-500 dark:text-gray-400 mb-1";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1d1d20] z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Pitch</h2>
          
          {/* FIX 1: ADD ARIA-LABEL TO CLOSE BUTTON */}
          <button onClick={onClose} className="text-slate-500 hover:text-red-500" aria-label="Close modal">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Business Name</label>
                <input required placeholder="e.g. SolarMax" className={inputStyle} onChange={e => setFormData({...formData, title: e.target.value})} aria-label="Business Name" />
            </div>
            <div>
                <label className={labelStyle}>Industry</label>
                {/* FIX 2: ADD ARIA-LABEL TO SELECT */}
                <select className={inputStyle} onChange={e => setFormData({...formData, category: e.target.value})} aria-label="Select Industry">
                    <option>FinTech</option><option>AgriTech</option><option>HealthTech</option><option>Retail</option>
                </select>
            </div>
          </div>

          <div>
            <label className={labelStyle}>Tagline</label>
            <input required placeholder="Short description..." className={inputStyle} onChange={e => setFormData({...formData, tagline: e.target.value})} aria-label="Tagline" />
          </div>
          
          <div>
            <label className={labelStyle}>Problem Statement</label>
            {/* FIX 3: ADD ARIA-LABEL TO TEXTAREA */}
            <textarea required className={`${inputStyle} h-24`} onChange={e => setFormData({...formData, problemStatement: e.target.value})} aria-label="Problem Statement"></textarea>
          </div>

          <div>
            <label className={labelStyle}>Solution</label>
            {/* FIX 4: ADD ARIA-LABEL TO TEXTAREA */}
            <textarea required className={`${inputStyle} h-24`} onChange={e => setFormData({...formData, solution: e.target.value})} aria-label="Solution"></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Traction</label>
                <input required placeholder="e.g. 100 users" className={inputStyle} onChange={e => setFormData({...formData, traction: e.target.value})} aria-label="Traction" />
            </div>
            <div>
                <label className={labelStyle}>Market Size</label>
                <input required placeholder="e.g. 50M TAM" className={inputStyle} onChange={e => setFormData({...formData, marketSize: e.target.value})} aria-label="Market Size" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Funding Ask (₦)</label>
                <input required type="number" className={inputStyle} onChange={e => setFormData({...formData, fundingAsk: e.target.value})} aria-label="Funding Ask" />
            </div>
            <div>
                <label className={labelStyle}>Equity Offer (%)</label>
                <input required type="text" className={inputStyle} onChange={e => setFormData({...formData, equityOffer: e.target.value})} aria-label="Equity Offer" />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-primary text-neutral-dark font-bold hover:brightness-110" isLoading={submitting}>Submit Pitch</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Opportunities;