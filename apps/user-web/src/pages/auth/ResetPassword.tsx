import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/Button';
import { getApiBaseUrl } from '@/lib/api-base';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE = getApiBaseUrl();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Reset token is missing. Please request a new reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to reset password.');
      }

      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-6 text-slate-900 dark:text-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Reset password</h1>
        <p className="text-slate-500 mb-8">Create a new password for your account.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            label="New Password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((current) => !current)}
          />
          <Button type="submit" className="w-full bg-primary text-background-dark font-bold hover:brightness-110" isLoading={loading}>
            Reset password
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-500 mb-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
      <input
        type={show ? 'text' : 'password'}
        required
        minLength={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full pl-10 pr-12 py-3 bg-transparent border border-slate-300 dark:border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
        placeholder="********"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
);

export default ResetPassword;
