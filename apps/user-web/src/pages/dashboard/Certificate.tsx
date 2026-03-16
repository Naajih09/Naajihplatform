import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ChevronLeft, Download } from 'lucide-react';

const Certificate = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!programId) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/academy/certificate/${programId}`, {
          headers: authHeaders,
        });
        const data = await res.json();
        setCertificate(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [programId]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading certificate...</div>;
  }

  if (!certificate) {
    return <div className="text-center py-20 text-red-500">Certificate not available.</div>;
  }

  const verificationUrl = `${window.location.origin}/certificate/verify/${certificate.program?.id}/${certificate.userId}`;

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
      >
        <ChevronLeft size={16} /> Back to Academy
      </button>

      <div className="bg-[#111113] border border-primary/30 rounded-3xl p-10 text-white shadow-2xl print:border-none print:shadow-none">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.4em] text-primary font-bold">
            NaajihBiz Academy
          </div>
          <CheckCircle size={20} className="text-primary" />
        </div>

        <div className="mt-10 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Certificate of Completion</p>
          <h1 className="text-3xl md:text-4xl font-black">{certificate.recipient}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            has successfully completed the program
          </p>
          <h2 className="text-2xl font-bold text-primary">{certificate.program?.title}</h2>
          <p className="text-xs text-gray-500">
            Awarded on{' '}
            {new Date(certificate.achievedAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}
          </p>
        </div>

        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
          <div>
            Cohort: {certificate.program?.cohort || 'N/A'}
          </div>
          <div>
            Certificate ID: {certificate.milestone?.id?.slice(0, 10)}
          </div>
          <div className="flex items-center gap-3">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}`}
              alt="Certificate verification QR"
              className="border border-primary/30 rounded-lg"
            />
            <div className="text-[10px]">
              Scan to verify
              <div className="text-gray-400 break-all max-w-[160px]">{verificationUrl}</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="w-full bg-primary text-neutral-dark font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <Download size={16} /> Download / Print
      </button>

      <button
        onClick={async () => {
          try {
            const res = await fetch(
              `${API_BASE}/academy/certificate/${programId}/pdf`,
              { headers: authHeaders },
            );
            if (!res.ok) return;
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'naajihbiz-certificate.pdf';
            link.click();
          } catch (err) {
            console.error(err);
          }
        }}
        className="w-full border border-primary/50 text-primary font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <Download size={16} /> Download Branded PDF
      </button>
    </div>
  );
};

export default Certificate;
