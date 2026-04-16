import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

const CertificateVerify = () => {
  const { token, programId, userId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchVerification = async () => {
      if (!token && (!programId || !userId)) return;
      setLoading(true);
      try {
        const query = token
          ? `token=${encodeURIComponent(token)}`
          : `programId=${encodeURIComponent(programId || '')}&userId=${encodeURIComponent(userId || '')}`;
        const res = await fetch(`${API_BASE}/academy/public/verify?${query}`);
        if (!res.ok) {
          throw new Error(`Verification failed (${res.status})`);
        }
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [API_BASE, token, programId, userId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Verifying certificate...</div>;
  }

  if (!data || !data.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-white p-6">
        <div className="bg-[#151518] border border-gray-800 rounded-2xl p-8 text-center space-y-3 max-w-md w-full">
          <XCircle size={32} className="text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">Certificate Not Valid</h1>
          <p className="text-sm text-gray-400">
            We could not verify this certificate. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-white p-6">
      <div className="bg-[#151518] border border-gray-800 rounded-2xl p-8 text-center space-y-4 max-w-lg w-full">
        <ShieldCheck size={32} className="text-primary mx-auto" />
        <h1 className="text-2xl font-black">Certificate Verified</h1>
        <p className="text-sm text-gray-400">
          This certificate is valid and issued by NaajihBiz Academy.
        </p>
        <div className="bg-black/30 border border-gray-800 rounded-xl p-4 space-y-1 text-left text-sm">
          <p className="text-white font-semibold">{data.recipient}</p>
          <p className="text-gray-400">{data.program?.title}</p>
          <p className="text-gray-500 text-xs">
            Awarded on{' '}
            {new Date(data.achievedAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}
          </p>
        </div>
        <CheckCircle size={20} className="text-green-400 mx-auto" />
      </div>
    </div>
  );
};

export default CertificateVerify;
