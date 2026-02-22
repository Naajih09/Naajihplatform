import React, { useEffect, useState } from 'react';
import { AlertOctagon, Loader2 } from 'lucide-react';

const PitchesList = () => {
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPitches = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/pitches');
      const data = await res.json();
      setPitches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this pitch from the platform?")) return;
    try {
      // NOTE: We need to pass a token or disable Auth Guard for admin to do this easily.
      // For now, assuming you have a token or we temporarily allow it.
      await fetch(`http://localhost:3000/api/pitches/${id}`, { 
          method: 'DELETE',
          // In a real app, Admin needs a special token.
          // For MVP local, we might need to bypass guard or use your user token.
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` } 
      });
      alert("Pitch removed.");
      fetchPitches();
    } catch (err) {
      alert("Failed to delete. (Check Auth)");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-black tracking-tight text-white">Pitch Moderation</h1>

      {loading ? <div className="text-center py-20 text-white"><Loader2 className="animate-spin inline"/> Loading Pitches...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {pitches.map((pitch) => (
             <div key={pitch.id} className="bg-[#1d1d20] border border-white/5 p-6 rounded-xl relative group hover:border-red-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">{pitch.title}</h3>
                        <p className="text-gray-400 text-sm">{pitch.category}</p>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">₦{parseInt(pitch.fundingAsk).toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pitch.tagline}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-6">
                    <span>By: {pitch.user?.email}</span>
                </div>
                
                <button onClick={() => handleDelete(pitch.id)} className="w-full py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                    <AlertOctagon size={16} /> REMOVE PITCH
                </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default PitchesList;