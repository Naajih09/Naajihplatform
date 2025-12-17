import React, { useState, useEffect } from 'react';
import { Plus, MapPin, DollarSign, Briefcase } from 'lucide-react';
import Button from '../../components/Button';

const Opportunities = () => {
  const [pitches, setPitches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 1. FETCH PITCHES ON LOAD
  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const res = await fetch('http://localhost:3000/pitches');
      const data = await res.json();
      setPitches(data);
    } catch (error) {
      console.error("Failed to load pitches", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Opportunities</h1>
          <p className="text-gray-500">Discover and invest in high-growth halal businesses.</p>
        </div>
        
        {/* Only Entrepreneurs can post */}
        {user.role === 'ENTREPRENEUR' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Post Pitch
          </Button>
        )}
      </div>

      {/* FEED GRID */}
      {loading ? (
        <p>Loading opportunities...</p>
      ) : pitches.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No opportunities posted yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pitches.map((pitch) => (
            <div key={pitch.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-50 text-brand-blue text-xs px-2 py-1 rounded font-bold uppercase">{pitch.category || 'General'}</span>
                <span className="text-gray-400 text-xs">{new Date(pitch.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-lg text-brand-dark mb-1">{pitch.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pitch.tagline}</p>
              
              {/* Key Stats */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2"><DollarSign size={16} className="text-brand-gold"/> Ask: ₦{pitch.fundingAsk}</div>
                <div className="flex items-center gap-2"><Briefcase size={16} className="text-brand-blue"/> Equity: {pitch.equityOffer}%</div>
              </div>

              <Button variant="outline" className="w-full h-10 text-sm">View Details</Button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FOR POSTING */}
      {isModalOpen && (
        <CreatePitchModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPitches(); 
          }}
          userId={user.id}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: CREATE PITCH FORM ---
const CreatePitchModal = ({ onClose, onSuccess, userId }) => {
  const [formData, setFormData] = useState({
    title: '', tagline: '', problemStatement: '', solution: '', 
    traction: '', marketSize: '', fundingAsk: '', equityOffer: '', category: 'FinTech'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: userId // Link pitch to the logged-in user
        }),
      });

      if (!res.ok) throw new Error("Failed to post");
      
      alert("Pitch Posted Successfully!");
      onSuccess();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Create New Pitch</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">Close</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Business Name / Title" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, title: e.target.value})} />
            <select className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>FinTech</option><option>AgriTech</option><option>HealthTech</option><option>Retail</option>
            </select>
          </div>
          <input required placeholder="Tagline (Short description)" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, tagline: e.target.value})} />
          
          <textarea required placeholder="Problem Statement" className="p-3 border rounded-lg w-full h-24" onChange={e => setFormData({...formData, problemStatement: e.target.value})}></textarea>
          <textarea required placeholder="Solution" className="p-3 border rounded-lg w-full h-24" onChange={e => setFormData({...formData, solution: e.target.value})}></textarea>
          
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Traction (e.g. 100 users)" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, traction: e.target.value})} />
            <input required placeholder="Market Size" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, marketSize: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Funding Ask (₦)" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, fundingAsk: e.target.value})} />
            <input required type="text" placeholder="Equity Offer (%)" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, equityOffer: e.target.value})} />
          </div>

          <Button type="submit" className="w-full" isLoading={submitting}>Submit Pitch</Button>
        </form>
      </div>
    </div>
  );
};

export default Opportunities;