import React, { useState, useEffect } from 'react';
import { ShieldCheck, UploadCloud, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';

const Verification = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [status, setStatus] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // 1. CHECK STATUS ON LOAD
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/verification/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
  }, [user.id]);

  // 2. HANDLE FILE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.url) {
        await fetch('http://localhost:3000/api/verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, documentUrl: data.url })
        });
        setStatus({ status: 'PENDING', documentUrl: data.url });
        alert("Documents submitted successfully! Pending review.");
      }
    } catch (err) { alert("Upload failed."); } finally { setUploading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Verification Center</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">Submit your KYC documents to unlock full platform access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: MAIN FLOW --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Card */}
          <div className={`p-6 rounded-xl border-l-4 flex items-start gap-4 ${
            status?.status === 'APPROVED' ? 'bg-green-100 dark:bg-green-900/20 border-green-500' :
            status?.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500' :
            'bg-red-100 dark:bg-red-900/20 border-red-500'
          }`}>
             <div className="p-2 bg-white/50 dark:bg-white/5 rounded-full">
                {status?.status === 'APPROVED' ? <CheckCircle className="text-green-600 dark:text-green-500"/> :
                 status?.status === 'PENDING' ? <Clock className="text-yellow-600 dark:text-yellow-500"/> :
                 <AlertTriangle className="text-red-600 dark:text-red-500"/>}
             </div>
             <div>
               <h3 className={`font-bold text-lg ${
                   status?.status === 'APPROVED' ? 'text-green-700 dark:text-green-400' :
                   status?.status === 'PENDING' ? 'text-yellow-700 dark:text-yellow-400' : 'text-red-700 dark:text-red-400'
               }`}>
                 Current Status: {status?.status || 'Not Verified'}
               </h3>
               <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                 {status?.status === 'APPROVED' ? 'You have full access to all features.' :
                  status?.status === 'PENDING' ? 'Our team is reviewing your documents (24-48 hours).' :
                  'Upload your Government ID or CAC Certificate to verify your identity.'}
               </p>
             </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
               <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Identity Verification</h4>
                 <p className="text-sm text-slate-500 dark:text-gray-500">Upload NIN, International Passport, or CAC Certificate.</p>
               </div>
             </div>

             {status?.status === 'PENDING' || status?.status === 'APPROVED' ? (
               <div className="p-6 bg-slate-100 dark:bg-[#151518] rounded-xl border border-slate-200 dark:border-gray-700 text-center">
                 <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                 <p className="font-bold text-slate-900 dark:text-white">Documents Submitted</p>
                 <p className="text-xs text-slate-500 dark:text-gray-500">We are processing your request.</p>
               </div>
             ) : (
               <div className="border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*,application/pdf" aria-label="Upload document" />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <p className="text-slate-600 dark:text-white">Uploading Securely...</p>
                    </div>
                  ) : (
                    <>
                        <UploadCloud className="mx-auto text-slate-400 mb-4" size={48} />
                        <p className="font-bold text-slate-900 dark:text-white">Click to Upload Document</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">PDF, JPG, or PNG (Max 5MB)</p>
                    </>
                  )}
               </div>
             )}
          </div>

          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-8 opacity-50">
             <div className="flex items-center gap-4">
               <div className="size-10 rounded-full bg-slate-200 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-400 font-bold">2</div>
               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Halal Compliance Review</h4>
                 <p className="text-sm text-slate-500 dark:text-gray-500">Internal review by Sharia Board (Automatic after ID check).</p>
               </div>
             </div>
          </div>

        </div>

        {/* --- RIGHT: BENEFITS --- */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
             <ShieldCheck className="absolute top-4 right-4 text-primary/10" size={100} />
             <h3 className="font-bold text-lg mb-4 relative z-10 text-slate-900 dark:text-white">Why Verify?</h3>
             <ul className="space-y-4 relative z-10">
               {[
                 { title: 'Trust & Credibility', desc: 'Get the Blue Badge.' },
                 { title: 'Higher Visibility', desc: 'Appear 3x more in search.' },
                 { title: 'Unlimited Funding', desc: 'Remove transaction limits.' }
               ].map(item => (
                 <li key={item.title} className="flex gap-3">
                   <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0"><CheckCircle size={16}/></div>
                   <div>
                     <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                     <p className="text-xs text-slate-500 dark:text-gray-500">{item.desc}</p>
                   </div>
                 </li>
               ))}
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Verification;