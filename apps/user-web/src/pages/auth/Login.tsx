import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import { useAppDispatch } from '@/store/store';
import { setAuth, setToken, setUser } from '@/store/slices/auth-slice';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed. Check your email/password.');

      // Success! Save user info
      localStorage.setItem('accessToken', data.access_token);
      localStorage.removeItem('access_token');

      const userToSave = data.user ? data.user : data;
      localStorage.setItem('user', JSON.stringify(userToSave));

      dispatch(setToken({ accessToken: data.access_token }));
      dispatch(setUser(userToSave));
      dispatch(setAuth(true));

      
      // Redirect to Dashboard
      const returnUrl = searchParams.get('returnUrl');
      navigate(returnUrl || '/dashboard', { replace: true });

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white">
      {/* BRANDING SIDE */}
      <div className="hidden lg:flex w-1/2 bg-background-dark border-r border-white/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10 flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-black font-extrabold">
             N
          </div>
          <h2 className="text-2xl font-bold text-white">Naajih<span className="text-primary">Biz</span>.</h2>
        </div>
        <div className="z-10 relative">
          <h2 className="text-5xl font-bold mb-6 leading-tight text-white">Welcome back.</h2>
          <p className="text-slate-400 text-lg">Continue connecting with trusted investors.</p>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">Log In</h2>
          <p className="text-slate-500 mb-8">Enter your credentials to access your dashboard.</p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-300 dark:border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-500">Password</label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-300 dark:border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="********"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary text-background-dark font-bold hover:brightness-110" isLoading={loading}>
              Log In <ArrowRight size={20} />
            </Button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-500">
             Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
