import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  Lightbulb, 
  PieChart, 
  Target, 
  UploadCloud, 
  CheckCircle,
  Loader2,
  Save,
  X
} from 'lucide-react';
import Button from '../../components/Button';

const CreatePitch = () => {
  const navigate = useNavigate();
  // Get User ID safely
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    problemStatement: '',
    solution: '',
    traction: '',
    marketSize: '',
    fundingAsk: '',
    equityOffer: '',
    category: 'FinTech',
    pitchDeckUrl: '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FILE UPLOAD HANDLER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      
      const data = await res.json();
      
      if (data.url) {
        setFormData((prev) => ({ ...prev, pitchDeckUrl: data.url }));
        alert("File Uploaded Successfully!");
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // --- FORM SUBMISSION HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });

      if (!res.ok) throw new Error('Failed to post pitch');

      alert('Pitch Posted Successfully!');
      navigate('/dashboard/opportunities');
    } catch (err: any) {
      alert('Error posting pitch: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Design Styles
  const inputStyles = "w-full p-3 bg-[#151518] border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors placeholder:text-gray-600";
  const labelStyles = "block text-sm font-bold text-gray-400 mb-2";

  return (
    <div className='max-w-3xl mx-auto pb-20 font-sans'>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white">Create New Pitch</h1>
        <Button variant="ghost" onClick={() => navigate('/dashboard/opportunities')}>Cancel</Button>
      </div>

      <div className='bg-[#1d1d20] rounded-2xl border border-gray-800 p-8 shadow-xl'>
        <p className='text-gray-500 mb-8 border-b border-gray-800 pb-4'>
          Structure your idea clearly to attract serious investors.
        </p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <label className={labelStyles}>Business Title</label>
                <div className="relative">
                    <Lightbulb className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input name="title" required onChange={handleChange} className={`${inputStyles} pl-10`} placeholder="e.g. SolarMax" aria-label="Business Title" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Industry</label>
                <select name="category" className={inputStyles} onChange={handleChange} aria-label="Select Industry">
                    <option value="FinTech">FinTech</option>
                    <option value="AgriTech">AgriTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="Retail">Retail</option>
                    <option value="Logistics">Logistics</option>
                </select>
            </div>
          </div>

          <div>
              <label className={labelStyles}>Tagline (Short)</label>
              <div className="relative">
                  <Target className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input name="tagline" required onChange={handleChange} className={`${inputStyles} pl-10`} placeholder="Affordable solar for everyone..." aria-label="Tagline" />
              </div>
          </div>

          <div>
             <label className={labelStyles}>The Problem</label>
             <textarea name="problemStatement" rows={4} onChange={handleChange} className={inputStyles} placeholder="What pain point are you solving?" required aria-label="Problem Statement" />
          </div>
          
          <div>
             <label className={labelStyles}>The Solution</label>
             <textarea name="solution" rows={4} onChange={handleChange} className={inputStyles} placeholder="How does your product solve it?" required aria-label="Solution" />
          </div>

          {/* --- FILE UPLOAD SECTION --- */}
          <div>
            <label className={labelStyles}>Pitch Deck (PDF or Image)</label>
            <div className={`border-2 border-dashed border-gray-700 rounded-xl p-6 text-center transition-colors cursor-pointer ${formData.pitchDeckUrl ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Loader2 className="animate-spin" /> Uploading to Cloud...
                    </div>
                ) : formData.pitchDeckUrl ? (
                    <div className="flex items-center justify-center gap-2 text-primary font-bold">
                        <CheckCircle /> Deck Uploaded Successfully
                    </div>
                ) : (
                    <>
                        <input type="file" id="file" className="hidden" onChange={handleFileUpload} accept="application/pdf,image/*" aria-label="Upload File" />
                        <label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                            <UploadCloud className="text-gray-400" size={32} />
                            <span className="text-sm text-gray-400">Click here to upload your Pitch Deck</span>
                        </label>
                    </>
                )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <label className={labelStyles}>Traction</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input name="traction" onChange={handleChange} className={`${inputStyles} pl-10`} placeholder="e.g. ₦1M revenue" aria-label="Traction" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Market Size</label>
                <div className="relative">
                    <Target className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input name="marketSize" onChange={handleChange} className={`${inputStyles} pl-10`} placeholder="e.g. 50M users" aria-label="Market Size" />
                </div>
            </div>
          </div>

          <div className='p-6 bg-black/30 rounded-xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <label className={labelStyles}>Funding Ask (₦)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 text-primary" size={18} />
                    <input name="fundingAsk" type="number" required onChange={handleChange} className={`${inputStyles} pl-10 border-primary/30`} aria-label="Funding Ask Amount" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Equity Offer (%)</label>
                <div className="relative">
                    <PieChart className="absolute left-3 top-3.5 text-primary" size={18} />
                    <input name="equityOffer" type="text" required onChange={handleChange} className={`${inputStyles} pl-10 border-primary/30`} aria-label="Equity Offer Percentage" />
                </div>
            </div>
          </div>

          <Button type='submit' className='w-full bg-primary text-neutral-dark font-bold hover:brightness-110' isLoading={loading}>
            <Save size={18} className="mr-2"/> Publish Pitch
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePitch;