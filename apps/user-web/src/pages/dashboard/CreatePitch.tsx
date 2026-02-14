import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, FileText, Lightbulb, PieChart, Target, UploadCloud, CheckCircle, Loader2, Save, X } from 'lucide-react';
import Button from '../../components/Button';

const CreatePitch = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', tagline: '', problemStatement: '', solution: '', 
    traction: '', marketSize: '', fundingAsk: '', equityOffer: '', category: 'FinTech', pitchDeckUrl: '', 
  });

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
      } else throw new Error("No URL returned");
    } catch (err) { alert("Failed to upload file."); } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });
      if (!res.ok) throw new Error('Failed to post pitch');
      alert('Pitch Posted Successfully!');
      navigate('/dashboard/opportunities');
    } catch (err: any) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };

  const inputStyles = "w-full p-3 bg-slate-50 dark:bg-[#151518] border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400";
  const labelStyles = "block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2";

  return (
    <div className='max-w-3xl mx-auto pb-20 font-sans'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create New Pitch</h1>
        <Button variant="ghost" onClick={() => navigate('/dashboard/opportunities')}>Cancel</Button>
      </div>

      <div className='bg-white dark:bg-[#1d1d20] rounded-2xl border border-slate-200 dark:border-gray-800 p-8 shadow-xl'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <label className={labelStyles}>Business Title</label>
                <div className="relative">
                    <Lightbulb className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input name="title" required onChange={handleChange} className={`${inputStyles} pl-10`} placeholder="e.g. SolarMax" aria-label="Business Title" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Industry</label>
                <select name="category" className={inputStyles} onChange={handleChange} aria-label="Select Industry">
                    <option value="FinTech">FinTech</option><option value="AgriTech">AgriTech</option><option value="HealthTech">HealthTech</option><option value="Retail">Retail</option>
                </select>
            </div>
          </div>
          <div><label className={labelStyles}>Tagline</label><input name="tagline" required onChange={handleChange} className={inputStyles} placeholder="Short description..." aria-label="Tagline" /></div>
          <div><label className={labelStyles}>Problem</label><textarea name="problemStatement" rows={4} onChange={handleChange} className={inputStyles} placeholder="Problem..." required aria-label="Problem Statement" /></div>
          <div><label className={labelStyles}>Solution</label><textarea name="solution" rows={4} onChange={handleChange} className={inputStyles} placeholder="Solution..." required aria-label="Solution" /></div>
          <div>
            <label className={labelStyles}>Pitch Deck</label>
            <div className={`border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer ${formData.pitchDeckUrl ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                {uploading ? <div className="flex justify-center gap-2 text-primary"><Loader2 className="animate-spin" /> Uploading...</div> : formData.pitchDeckUrl ? <div className="flex justify-center gap-2 text-primary font-bold"><CheckCircle /> Uploaded</div> : <><input type="file" className="hidden" id="file" onChange={handleFileUpload} accept=".pdf,image/*" /><label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2 w-full"><UploadCloud className="text-slate-400" size={32} /><span className="text-sm text-slate-500">Click to upload</span></label></>}
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div><label className={labelStyles}>Traction</label><input name="traction" onChange={handleChange} className={inputStyles} placeholder="e.g. 1M rev" required aria-label="Traction" /></div>
            <div><label className={labelStyles}>Market Size</label><input name="marketSize" onChange={handleChange} className={inputStyles} placeholder="e.g. 50M users" required aria-label="Market Size" /></div>
          </div>
          <div className='p-6 bg-slate-100 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div><label className={labelStyles}>Ask (₦)</label><input name="fundingAsk" type="number" required onChange={handleChange} className={inputStyles} aria-label="Funding Ask" /></div>
            <div><label className={labelStyles}>Equity (%)</label><input name="equityOffer" type="text" required onChange={handleChange} className={inputStyles} aria-label="Equity Offer" /></div>
          </div>
          <Button type='submit' className='w-full bg-primary text-neutral-dark font-bold hover:brightness-110' isLoading={loading}>Post Pitch</Button>
        </form>
      </div>
    </div>
  );
};
export default CreatePitch;