import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111113] text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-[#1d1d20] border border-white/10 rounded-2xl p-8 text-center">
        <div className="mx-auto size-14 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400">
          <ShieldAlert size={28} />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-sm text-gray-400">
          Your account does not have permission to access this area.
        </p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <ArrowLeft size={16} />
          Back to login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
