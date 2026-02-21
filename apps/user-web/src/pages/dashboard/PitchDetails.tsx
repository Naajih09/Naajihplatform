import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, MapPin, Calendar, CheckCircle, UserPlus, Loader2, Edit3, Trash2, Save, X } from 'lucide-react';
import Button from '../../components/Button';

const PitchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPitch();
  }, [id]);

  const fetchPitch = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/pitches/${id}`);
      const data = await res.json();
      setPitch(data);
      setEditForm(data); // Pre-fill edit form
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (pitch.userId === user.id) return;
    try {
      const res = await fetch('http://localhost:3000/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user.id, receiverId: pitch.userId })
      });
      if (res.ok) {
        setRequestSent(true);
        alert(`Connection request sent!`);
      }
    } catch (error) { alert("Failed to connect"); }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await fetch(`http://localhost:3000/api/pitches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      alert("Pitch deleted.");
      navigate('/dashboard/opportunities');
    } catch (err) { alert("Delete failed"); }
  };

  // --- UPDATE LOGIC ---
  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:3000/api/pitches/${id}`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(editForm)
      });
      setPitch(editForm);
      setIsEditing(false);
      alert("Pitch updated!");
    } catch (err) { alert("Update failed"); }
  };

  if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" /></div>;
  if (!pitch) return <div className="text-center py-20 text-slate-500">Pitch not found</div>;

  const isOwner = user.id === pitch.userId;
  const inputStyle = "w-full p-2 bg-black/20 border border-gray-700 rounded text-slate-900 dark:text-white mb-2 focus:outline-none focus:border-primary";

  return (
    <div className="max-w-4xl mx-auto pb-20 font-sans text-slate-900 dark:text-white">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/dashboard/opportunities')} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold">
            <ArrowLeft size={18} /> Back to Feed
        </button>
        
        {/* OWNER ACTIONS */}
        {isOwner && (
            <div className="flex gap-2">
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-gray-400"><X size={18}/> Cancel</Button>
                        <Button onClick={handleUpdate} className="bg-green-600 text-white"><Save size={18}/> Save</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="border-gray-600"><Edit3 size={18}/> Edit</Button>
                        <Button onClick={handleDelete} variant="outline" className="border-red-900 text-red-500 hover:bg-red-900/20"><Trash2 size={18}/></Button>
                    </>
                )}
            </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">{pitch.category}</span>
              <span className="text-slate-500 dark:text-gray-400 text-xs flex items-center gap-1"><Calendar size={12}/> {new Date(pitch.createdAt).toLocaleDateString()}</span>
            </div>
            
            {isEditing ? (
                // FIX 1: Added aria-label
                <input aria-label="Edit Title" className={`text-3xl font-black ${inputStyle}`} value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
            ) : (
                <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">{pitch.title}</h1>
            )}

            {isEditing ? (
                // FIX 2: Added aria-label
                <input aria-label="Edit Tagline" className={inputStyle} value={editForm.tagline} onChange={e => setEditForm({...editForm, tagline: e.target.value})} />
            ) : (
                <p className="text-lg text-slate-600 dark:text-gray-400">{pitch.tagline}</p>
            )}
          </div>
          
          {pitch.pitchDeckUrl && (
            <a href={pitch.pitchDeckUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto">
              <Button variant="outline" className="border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:border-primary hover:text-primary w-full md:w-auto">
                <Download size={18} className="mr-2" /> View Pitch Deck
              </Button>
            </a>
          )}
        </div>

        {/* Founder Info */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-gray-800">
           <div className="size-10 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-gray-600">
             {pitch.user?.entrepreneurProfile?.firstName?.[0] || 'U'}
           </div>
           <div>
             <p className="text-sm font-bold">{pitch.user?.entrepreneurProfile?.firstName} {pitch.user?.entrepreneurProfile?.lastName}</p>
             <p className="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1"><MapPin size={10}/> Nigeria</p>
           </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-3 text-primary">The Problem</h3>
            {isEditing ? (
                // FIX 3: Added aria-label
                <textarea aria-label="Edit Problem" rows={5} className={inputStyle} value={editForm.problemStatement} onChange={e => setEditForm({...editForm, problemStatement: e.target.value})} />
            ) : (
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#151518] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                {pitch.problemStatement}
                </p>
            )}
          </section>
          
          <section>
            <h3 className="text-xl font-bold mb-3 text-primary">The Solution</h3>
            {isEditing ? (
                // FIX 4: Added aria-label
                <textarea aria-label="Edit Solution" rows={5} className={inputStyle} value={editForm.solution} onChange={e => setEditForm({...editForm, solution: e.target.value})} />
            ) : (
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#151518] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                {pitch.solution}
                </p>
            )}
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <p className="text-xs text-slate-500 dark:text-gray-500 uppercase font-bold mb-1">Funding Ask</p>
              {isEditing ? (
                  // FIX 5: Added aria-label
                  <input aria-label="Edit Funding Ask" type="number" className={inputStyle} value={editForm.fundingAsk} onChange={e => setEditForm({...editForm, fundingAsk: e.target.value})} />
              ) : (
                  <p className="text-3xl font-black text-slate-900 dark:text-white">₦{parseInt(pitch.fundingAsk).toLocaleString()}</p>
              )}
           </div>

           <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <p className="text-xs text-slate-500 dark:text-gray-500 uppercase font-bold mb-1">Equity Offered (%)</p>
              {isEditing ? (
                  // FIX 6: Added aria-label
                  <input aria-label="Edit Equity" className={inputStyle} value={editForm.equityOffer} onChange={e => setEditForm({...editForm, equityOffer: e.target.value})} />
              ) : (
                  <p className="text-3xl font-black text-primary">{pitch.equityOffer}%</p>
              )}
           </div>

           <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-500 uppercase font-bold mb-1">Traction</p>
                <p className="font-medium text-slate-900 dark:text-white">{pitch.traction}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
                <p className="text-xs text-slate-500 dark:text-gray-500 uppercase font-bold mb-1">Market Size</p>
                <p className="font-medium text-slate-900 dark:text-white">{pitch.marketSize}</p>
              </div>
           </div>

           {/* CONNECT BUTTON (Only for Investors) */}
           {!isOwner && user.role === 'INVESTOR' && (
             <Button 
               className={`w-full font-bold shadow-lg ${requestSent ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary text-black hover:brightness-110'}`}
               onClick={handleConnect}
               disabled={requestSent}
             >
               {requestSent ? <><CheckCircle size={18} className="mr-2" /> Request Sent</> : <><UserPlus size={18} className="mr-2" /> Connect with Founder</>}
             </Button>
           )}
        </div>
      </div>
    </div>
  );
};

export default PitchDetails;