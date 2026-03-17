import { Calendar, ExternalLink, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { showToast } from '../../lib/utils';

const MentorBooking = () => {
  const calendlyUrl =
    import.meta.env.VITE_CALENDLY_URL ||
    'https://calendly.com/naajihbiz/office-hours';
  const [subscription, setSubscription] = useState<any>(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.email || !authToken) return;
    fetch(`${API_BASE}/users/${user.email}`, { headers: authHeaders })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSubscription(data.subscription || null);
          localStorage.setItem('user', JSON.stringify(data));
        }
      })
      .catch(() => null);
  }, []);

  const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
  const hasPremium =
    subscription?.plan === 'PREMIUM' &&
    (!activeUntil || new Date(activeUntil) > new Date());

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
            <Video size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Mentor Booking</h1>
            <p className="text-slate-500 dark:text-neutral-muted text-sm">
              Book office hours with vetted mentors and Islamic finance experts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
          <p className="text-xs font-bold uppercase text-slate-500">Office Hours</p>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">Weekly Slots</h3>
          <p className="text-sm text-slate-500 mt-2">
            30-minute sessions focused on traction, validation, and go-to-market.
          </p>
        </div>
        <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
          <p className="text-xs font-bold uppercase text-slate-500">Expert Clinics</p>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">Shariah Review</h3>
          <p className="text-sm text-slate-500 mt-2">
            Get feedback on halal compliance and Islamic finance structures.
          </p>
        </div>
      </div>

      {hasPremium ? (
        <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-3xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 px-2 pb-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-primary" />
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Book a session</h2>
                <p className="text-xs text-slate-500">Choose a mentor time that works for you.</p>
              </div>
            </div>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-primary flex items-center gap-1"
            >
              Open in new tab <ExternalLink size={14} />
            </a>
          </div>
          <div className="w-full min-h-[640px]">
            <iframe
              src={calendlyUrl}
              title="Mentor Booking"
              className="w-full min-h-[640px] border-0 rounded-2xl"
              loading="lazy"
              allow="camera; microphone; fullscreen"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Mentor booking is Premium</h2>
          <p className="text-sm text-slate-500">
            Upgrade to Premium or start your free trial to access mentor sessions.
          </p>
          <Button
            onClick={() => {
              showToast('Premium access required.', 'error');
              navigate('/dashboard/subscription');
            }}
            className="bg-primary text-neutral-dark font-bold px-6 py-3 rounded-xl"
          >
            Upgrade to Premium
          </Button>
        </div>
      )}
    </div>
  );
};

export default MentorBooking;
