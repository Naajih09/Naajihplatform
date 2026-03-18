import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center px-6 dark:bg-[#111113] dark:text-white">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm dark:bg-[#1d1d20] dark:border-white/10">
        <div className="mx-auto size-14 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400">
          <ShieldAlert size={28} />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
          Your account does not have permission to access this area.
        </p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          <ArrowLeft size={16} />
          Back to login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
