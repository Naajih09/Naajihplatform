import React, { useState, useEffect } from 'react';
import { ShieldCheck, UploadCloud, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { getApiBaseUrl } from '../../lib/api-base';

const Verification = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE = getApiBaseUrl();
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const [status, setStatus] = useState<any>(null);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });
  const role = user.role || 'USER';
  const isEntrepreneur = role === 'ENTREPRENEUR';
  const statusLabel = status?.status || 'NOT_SUBMITTED';
  const isApproved = statusLabel === 'APPROVED';
  const isPending = statusLabel === 'PENDING';
  const isRejected = statusLabel === 'REJECTED';
  const documentExamples = isEntrepreneur
    ? 'CAC certificate, government ID, or business registration document'
    : 'government ID, passport, or investment organization document';
  const statusCopy =
    isApproved
      ? {
          title: 'Verified',
          body: 'Your account has passed review. You can now use verified-only platform features.',
        }
      : isPending
      ? {
          title: 'Review in progress',
          body: 'Your document is with the NaajihBiz team. Reviews usually take 24-48 hours.',
        }
      : isRejected
      ? {
          title: 'Resubmission needed',
          body: 'Your last document could not be approved. Review the note below and upload a clearer replacement.',
        }
      : {
          title: 'Not submitted',
          body: 'Submit one clear document so the team can confirm your identity and account role.',
        };

  // 1. CHECK STATUS ON LOAD
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const profileRes = await fetch(`${API_BASE}/users/${user.email}`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setEmailVerified(Boolean(profile?.emailVerified));
          localStorage.setItem('user', JSON.stringify(profile));
        } else {
          setEmailVerified(Boolean(user.emailVerified));
        }
        const res = await fetch(`${API_BASE}/verification/${user.id}`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });
        
        const text = await res.text();
        if (text) {
            const data = JSON.parse(text);
            setStatus(data);
        } else {
            setStatus(null); 
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    fetchStatus();
  }, [user.id]);

  const requestEmailVerification = async () => {
    if (!authToken) {
      setToast({ show: true, message: 'Please log in again.', type: 'error' });
      return;
    }
    setEmailSending(true);
    try {
      const res = await fetch(`${API_BASE}/users/verify-email/request`, {
        method: 'POST',
        headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data?.emailed) {
          setToast({ show: true, message: 'Verification email sent.', type: 'success' });
        } else if (data?.verifyUrl) {
          setToast({ show: true, message: 'Email is not configured here, so the verification link is opening in a new tab.', type: 'success' });
          window.open(data.verifyUrl, '_blank', 'noopener,noreferrer');
        } else {
          setToast({ show: true, message: data?.message || 'Verification email requested.', type: 'success' });
        }
      } else {
        setToast({ show: true, message: data?.message || 'Failed to send email.', type: 'error' });
      }
    } catch (err) {
      setToast({ show: true, message: 'Failed to send email.', type: 'error' });
    } finally {
      setEmailSending(false);
    }
  };

  // 2. HANDLE FILE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToast({ show: true, message: 'Please upload a file under 5MB.', type: 'error' });
      e.target.value = '';
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const data = await res.json();

      const uploadUrl = data.secure_url || data.url;
      if (uploadUrl) {
        const submitRes = await fetch(`${API_BASE}/verification/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({ documentUrl: uploadUrl })
        });
        const submitData = await submitRes.json().catch(() => null);
        if (!submitRes.ok) {
          throw new Error(submitData?.message || 'Verification submission failed.');
        }
        setStatus({ status: 'PENDING', documentUrl: uploadUrl });
        setToast({ show: true, message: 'Documents submitted successfully. Pending review.', type: 'success' });
      }
    } catch (err: any) {
      setToast({ show: true, message: err?.message || 'Upload failed.', type: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Verification Center</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">
          Confirm your email and submit one clear document so trusted users can pitch, connect, and message safely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: MAIN FLOW --- */}
        <div className="lg:col-span-2 space-y-6">

          {/* Email Verification */}
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">1</div>
              <h3 className="font-bold text-slate-900 dark:text-white">Confirm your email</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
              {emailVerified
                ? 'Your email is confirmed. We can contact you about verification decisions and platform updates.'
                : 'Use the verification link sent to your inbox so account notices and review updates reach the right person.'}
            </p>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded text-xs font-bold ${emailVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                {emailVerified ? 'Verified' : 'Not Verified'}
              </div>
              {!emailVerified && (
                <button
                  onClick={requestEmailVerification}
                  disabled={emailSending}
                  className="px-4 py-2 rounded-lg bg-primary text-neutral-dark text-xs font-bold disabled:opacity-60"
                >
                  {emailSending ? 'Sending...' : 'Send Verification Email'}
                </button>
              )}
            </div>
          </div>
          
          {/* Status Card */}
          <div className={`p-6 rounded-xl border-l-4 flex items-start gap-4 ${
            isApproved ? 'bg-green-100 dark:bg-green-900/20 border-green-500' :
            isPending ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500' :
            isRejected ? 'bg-red-100 dark:bg-red-900/20 border-red-500' :
            'bg-slate-100 dark:bg-white/5 border-slate-400'
          }`}>
             <div className="p-2 bg-white/50 dark:bg-white/5 rounded-full">
                {isApproved ? <CheckCircle className="text-green-600 dark:text-green-500"/> :
                 isPending ? <Clock className="text-yellow-600 dark:text-yellow-500"/> :
                 <AlertTriangle className="text-red-600 dark:text-red-500"/>}
             </div>
             <div>
               <h3 className={`font-bold text-lg ${
                   isApproved ? 'text-green-700 dark:text-green-400' :
                   isPending ? 'text-yellow-700 dark:text-yellow-400' :
                   isRejected ? 'text-red-700 dark:text-red-400' :
                   'text-slate-700 dark:text-slate-300'
               }`}>
                 Current Status: {statusCopy.title}
               </h3>
               <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                 {statusCopy.body}
               </p>
               {isRejected && status?.rejectionReason && (
                 <div className="mt-4 rounded-lg border border-red-200 bg-white/70 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-black/20 dark:text-red-300">
                   <span className="font-bold">Admin note:</span> {status.rejectionReason}
                 </div>
               )}
             </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
               <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Submit your document</h4>
                 <p className="text-sm text-slate-500 dark:text-gray-500">
                   Upload a clear {documentExamples}. Your name should be readable.
                 </p>
               </div>
             </div>

             {isPending || isApproved ? (
               <div className="p-6 bg-slate-100 dark:bg-[#151518] rounded-xl border border-slate-200 dark:border-gray-700 text-center">
                 {isApproved ? (
                   <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                 ) : (
                   <Clock className="mx-auto text-yellow-500 mb-2" size={32} />
                 )}
                 <p className="font-bold text-slate-900 dark:text-white">
                   {isApproved ? 'Verification Approved' : 'Document Submitted'}
                 </p>
                 <p className="text-xs text-slate-500 dark:text-gray-500">
                   {isApproved ? 'No further action is required.' : 'We will notify you when the review is complete.'}
                 </p>
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
                        <p className="font-bold text-slate-900 dark:text-white">
                          {isRejected ? 'Upload Replacement Document' : 'Click to Upload Document'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">PDF, JPG, or PNG (Max 5MB)</p>
                    </>
                  )}
               </div>
             )}
          </div>

          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-8 opacity-50">
             <div className="flex items-center gap-4">
               <div className="size-10 rounded-full bg-slate-200 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-400 font-bold">3</div>
               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Admin review</h4>
                 <p className="text-sm text-slate-500 dark:text-gray-500">
                   Our team checks the document, role, and profile details before unlocking verified-only actions.
                 </p>
               </div>
             </div>
          </div>

        </div>

        {/* --- RIGHT: BENEFITS --- */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
             <ShieldCheck className="absolute top-4 right-4 text-primary/10" size={100} />
              <h3 className="font-bold text-lg mb-4 relative z-10 text-slate-900 dark:text-white">What Verification Unlocks</h3>
             <ul className="space-y-4 relative z-10">
               {[
                 { title: 'Pitch, connect, and message', desc: 'Verified users can use the core actions that protect the marketplace.' },
                 { title: 'Trust & credibility', desc: 'Other users can see that your account has passed identity review.' },
                 { title: 'Cleaner admin review', desc: 'A clear document helps the team approve you faster or give useful feedback.' }
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
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Before You Upload</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-gray-400">
              <li>Use one document that clearly shows your name.</li>
              <li>Make sure the image is not blurry or cropped.</li>
              <li>Accepted formats: PDF, JPG, or PNG under 5MB.</li>
              <li>If rejected, upload a corrected document from this same page.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Verification;
