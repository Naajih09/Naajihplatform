import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connect to NestJS API
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');

    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Branding Side */}
      <div className="hidden lg:flex w-1/2 bg-brand-blue p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10 font-bold text-2xl">NaajihBiz<span className="text-brand-gold">.</span></div>
        <div className="z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome Back.</h1>
          <p className="text-blue-100">Login to access your dashboard and connections.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-brand-dark mb-8">Log In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-brand-dark">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-brand-gray" size={20} />
                <input required type="email" placeholder="name@example.com"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-brand-dark">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-brand-gray" size={20} />
                <input required type="password" placeholder="••••••••"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Log In <ArrowRight size={20} />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-brand-gray">
             Don't have an account? <Link to="/signup" className="text-brand-blue font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;