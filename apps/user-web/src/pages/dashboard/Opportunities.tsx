import {
    CheckCircle,
    DollarSign,
    Loader2,
    Plus,
    Search,
    TrendingUp,
    UploadCloud,
    UserPlus,
    Verified,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const Opportunities = () => {
  const [pitches, setPitches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  
  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // --- 1. FETCH PITCHES (With Search & Filter) ---
  const [filters, setFilters] = useState({
    stage: 'All',
    minTicket: '',
    maxTicket: ''
  });

  const fetchPitches = async () => {
    setLoading(true);
    try {
      // Build Query Parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (activeCategory && activeCategory !== 'All') params.append('category', activeCategory);
      if (filters.stage !== 'All') params.append('stage', filters.stage);
      if (filters.minTicket) params.append('minTicket', filters.minTicket);
      if (filters.maxTicket) params.append('maxTicket', filters.maxTicket);

      const res = await fetch(`http://localhost:3000/api/pitches?${params.toString()}`);
      const data = await res.json();
      
      // Safety check to ensure array
      setPitches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load pitches", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search (Wait 500ms after typing before fetching)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPitches();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, activeCategory, filters]);

  // --- 2. HANDLE CONNECT ---
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
    <div className="max-w-[1440px] mx-auto space-y-8 pb-20 text-slate-900 dark:text-white font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Ethical Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">Discover and fund Shariah-compliant businesses.</p>
        </div>
        <div className="w-full md:w-96 flex gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              className="w-full bg-slate-200 dark:bg-[#1d1f23] border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500 text-slate-900 dark:text-white transition-colors outline-none" 
              placeholder="Search..." 
              aria-label="Search opportunities"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user.role === 'ENTREPRENEUR' && (
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-neutral-dark px-4 font-bold">
              <Plus size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex flex-col gap-6 mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-3">
            {['All', 'FinTech', 'AgriTech', 'HealthTech', 'Retail'].map((cat) => (
            <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                activeCategory === cat 
                ? 'bg-primary text-neutral-dark font-bold border-primary' 
                : 'bg-slate-200 dark:bg-[#1d1f23] text-slate-700 dark:text-slate-300 border-transparent hover:border-primary/50'
                }`}
            >
                {cat}
            </button>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Stage:</span>
                <select 
                    value={filters.stage} 
                    onChange={(e) => setFilters({...filters, stage: e.target.value})}
                    className="bg-slate-200 dark:bg-[#1d1f23] border-none rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                    <option value="All">All Stages</option>
                    <option value="Idea">Idea</option>
                    <option value="Seed">Seed</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Ticket (₦):</span>
                <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-24 bg-slate-200 dark:bg-[#1d1f23] border-none rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                    value={filters.minTicket}
                    onChange={(e) => setFilters({...filters, minTicket: e.target.value})}
                />
                <span className="text-slate-400">-</span>
                <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-24 bg-slate-200 dark:bg-[#1d1f23] border-none rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                    value={filters.maxTicket}
                    onChange={(e) => setFilters({...filters, maxTicket: e.target.value})}
                />
            </div>

            <div className="flex-grow"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
            Showing {pitches.length} Pitch Decks
            </span>
        </div>
      </div>

      {/* FEED */}
      {loading ? (
         <div className="text-center py-20 text-slate-500 animate-pulse">Loading opportunities...</div>
      ) : pitches.length === 0 ? (
        <div className="text-center p-10 bg-slate-100 dark:bg-[#1d1f23] rounded-xl border border-dashed border-slate-300 dark:border-white/10">
          <p className="text-slate-500">No opportunities found matching your criteria.</p>
          <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="text-primary text-sm font-bold mt-2 hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pitches.map((pitch) => (
            <div key={pitch.id} className="group bg-white dark:bg-[#1d1f23] border border-slate-200 dark:border-white/5 rounded-xl p-5 flex flex-col hover:shadow-lg transition-all duration-300">
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-[#2d2f34] flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
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

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-transparent">
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
                <Link to={`/dashboard/opportunities/${pitch.id}`} className="flex-1">
                  <button className="w-full py-2.5 rounded-lg border border-primary/40 text-primary text-xs font-bold hover:bg-primary/5 transition-colors">
                      View Details
                  </button>
                </Link>
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

// --- SUB-COMPONENT: CREATE PITCH FORM (Included here for simplicity) ---
const CreatePitchModal = ({ onClose, onSuccess, userId }: any) => {
  const [formData, setFormData] = useState({
    title: '', tagline: '', problemStatement: '', solution: '', 
    traction: '', marketSize: '', fundingAsk: '', equityOffer: '', category: 'FinTech',
    pitchDeckUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: uploadData });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, pitchDeckUrl: data.url }));
        alert("File Uploaded Successfully!");
      }
    } catch (err) { alert("Failed to upload file."); } finally { setUploading(false); }
  };

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
          <button onClick={onClose} className="text-slate-500 hover:text-red-500" aria-label="Close modal"><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Business Name</label>
                <input name="title" required className={inputStyle} onChange={handleChange} aria-label="Business Name" />
            </div>
            <div>
                <label className={labelStyle}>Industry</label>
                <select name="category" className={inputStyle} onChange={handleChange} aria-label="Select Industry">
                    <option value="FinTech">FinTech</option><option value="AgriTech">AgriTech</option><option value="HealthTech">HealthTech</option><option value="Retail">Retail</option>
                </select>
            </div>
          </div>
          <div><label className={labelStyle}>Tagline</label><input name="tagline" required className={inputStyle} onChange={handleChange} aria-label="Tagline" /></div>
          <div><label className={labelStyle}>Problem Statement</label><textarea name="problemStatement" required className={`${inputStyle} h-24`} onChange={handleChange} aria-label="Problem Statement"></textarea></div>
          <div><label className={labelStyle}>Solution</label><textarea name="solution" required className={`${inputStyle} h-24`} onChange={handleChange} aria-label="Solution"></textarea></div>
          
          <div>
            <label className={labelStyle}>Pitch Deck</label>
            <div className={`border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer ${formData.pitchDeckUrl ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                {uploading ? <div className="flex justify-center gap-2 text-primary"><Loader2 className="animate-spin" /> Uploading...</div> : formData.pitchDeckUrl ? <div className="flex justify-center gap-2 text-primary font-bold"><CheckCircle /> Uploaded</div> : <><input type="file" className="hidden" id="file" onChange={handleFileUpload} accept=".pdf,image/*" /><label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2 w-full"><UploadCloud className="text-slate-400" size={32} /><span className="text-sm text-slate-500">Click to upload</span></label></>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelStyle}>Traction</label><input name="traction" required className={inputStyle} onChange={handleChange} aria-label="Traction" /></div>
            <div><label className={labelStyle}>Market Size</label><input name="marketSize" required className={inputStyle} onChange={handleChange} aria-label="Market Size" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelStyle}>Funding Ask (₦)</label><input name="fundingAsk" type="number" required className={inputStyle} onChange={handleChange} aria-label="Funding Ask" /></div>
            <div><label className={labelStyle}>Equity Offer (%)</label><input name="equityOffer" type="text" required className={inputStyle} onChange={handleChange} aria-label="Equity Offer" /></div>
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