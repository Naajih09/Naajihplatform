import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/enums';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/users/login', { email, password });
      const { access_token: accessToken, user } = response.data || {};

      if (!accessToken) {
        throw new Error('Login failed. Missing access token.');
      }

      if (user?.role !== UserRole.ADMIN) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setErrorMessage('You do not have admin access.');
        return;
      }

      login(accessToken, user.role);
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 dark:bg-[#111113] dark:text-white">
      <div className="hidden lg:flex w-1/2 border-r border-slate-200 p-12 flex-col justify-between relative overflow-hidden dark:border-white/10">
        <div className="z-10 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black font-extrabold shadow-lg shadow-primary/30">
            N
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              NaajihBiz <span className="text-primary">Admin</span>
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold dark:text-gray-500">
              CEO Mode
            </p>
          </div>
        </div>
        <div className="z-10 relative">
          <h2 className="text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
            Welcome back.
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-lg">
            Manage the platform with secure admin access.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
          <p className="text-slate-500 dark:text-gray-400 mb-8">
            Enter your credentials to access the admin dashboard.
          </p>

          {errorMessage ? (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500 dark:text-gray-500" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input w-full pl-10 pr-4 py-3 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500 dark:text-gray-500" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input w-full pl-10 pr-4 py-3 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
