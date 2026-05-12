import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { getApiBaseUrl } from '@/lib/api-base';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const API_BASE = getApiBaseUrl();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send reset link.');
      }

      setMessage(data.message || 'If the email exists, a reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-6 text-slate-900 dark:text-white">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <h1 className="text-3xl font-bold mb-2">Forgot password</h1>
        <p className="text-slate-500 mb-8">Enter your email and we will send a secure reset link.</p>

        {message && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-300 dark:border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-background-dark font-bold hover:brightness-110" isLoading={loading}>
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
