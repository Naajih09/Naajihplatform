import { Check, Info, Shield, Wallet, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'paystack' | 'opay'>('paystack');
  const [searchParams] = useSearchParams();
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });
  const [subscription, setSubscription] = useState<any>(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const subscriptionAmount = Number(import.meta.env.VITE_SUBSCRIPTION_AMOUNT_NGN || 5000);
  const trialDays = Number(import.meta.env.VITE_TRIAL_DAYS || 14);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAspirant = user?.role === 'ASPIRING_BUSINESS_OWNER';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('orderNo');
    const provider = (searchParams.get('provider') as 'paystack' | 'opay') || 'paystack';
    if (reference) {
      verifyPayment(provider, reference);
    }
  }, [searchParams]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.email || !authToken) return;
    fetch(`${API_BASE}/users/${user.email}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSubscription(data.subscription || null);
          localStorage.setItem('user', JSON.stringify(data));
        }
      })
      .catch(() => null);
  }, [authToken]);

  const refreshSubscription = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.email || !authToken) return;
    const refreshed = await fetch(`${API_BASE}/users/${user.email}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await refreshed.json();
    setSubscription(data.subscription || null);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const verifyPayment = async (provider: 'paystack' | 'opay', reference: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payments/verify?provider=${provider}&reference=${reference}`);
      const data = await res.json();
      if (data.status === 'success') {
        setToast({ show: true, message: 'Subscription successful! You are now a Premium member.', type: 'success' });
        await refreshSubscription();
      } else {
        setToast({ show: true, message: 'Payment verification failed.', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Verification error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.email) {
        setToast({ show: true, message: 'Please log in to upgrade your plan.', type: 'error' });
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          provider: selectedProvider,
          amount: subscriptionAmount,
        }),
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setToast({ show: true, message: 'Failed to initialize payment.', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Payment error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/subscription/trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Trial start failed.');
      }
      setToast({ show: true, message: `Trial started. You have ${trialDays} days of Premium.`, type: 'success' });
      await refreshSubscription();
    } catch (error: any) {
      setToast({ show: true, message: error?.message || 'Unable to start trial.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
  const hasPremium =
    subscription?.plan === 'PREMIUM' &&
    (!activeUntil || new Date(activeUntil) > new Date());
  const trialActive =
    subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-background-dark dark:text-white px-6 md:px-10 py-8 pb-24">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-black mb-4">
            {isAspirant ? 'Unlock Premium Learning' : 'Elevate Your Networking'}
          </h1>
          <p className="text-slate-500 dark:text-white/60">
            {isAspirant
              ? 'Premium is for advanced courses, mentor sessions, and completion certificates.'
              : 'Choose the tier that matches your ambition. All plans comply with Sharia business principles.'}
          </p>
        </div>

        {/* Current Plan Alert */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Your Current Plan: <span className="text-primary tracking-widest uppercase">{hasPremium ? 'Premium' : 'Free Tier'}</span></h4>
                    <p className="text-xs text-slate-500 dark:text-white/60">
                      {trialActive
                        ? `Trial active until ${new Date(subscription.trialEndsAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}`
                        : hasPremium
                        ? isAspirant
                          ? 'Full access to premium learning and mentor sessions.'
                          : 'Full access to premium networking features.'
                        : isAspirant
                        ? 'Access free intro courses. Premium unlocks advanced learning.'
                        : 'Limited access to deals and messages.'}
                    </p>
                </div>
            </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Free Tier */}
            <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Basic Access</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black">NGN 0</span>
                    <span className="text-slate-400 dark:text-white/50">/ forever</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-white/70 mb-8 flex-grow">
                    {isAspirant
                      ? 'Perfect for learners getting started with business fundamentals.'
                      : 'Perfect for new founders making their first connections.'}
                </p>
                
                <ul className="space-y-4 mb-8">
                    {(isAspirant
                      ? ['Free intro courses', 'Basic community access', 'Learning dashboard', 'Progress tracking']
                      : ['Create 1 active pitch', 'Browse public pitch feed', 'Send 5 connection requests/mo', 'Basic profile visibility']
                    ).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-white/80">
                            <Check size={18} className="text-slate-400 dark:text-gray-500" /> {feature}
                        </li>
                    ))}
                </ul>
                
                <button disabled className="w-full py-3 rounded-lg bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/50 font-bold border border-slate-200 dark:border-white/5 cursor-not-allowed">
                    {hasPremium ? 'Downgrade' : 'Current Plan'}
                </button>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-b from-white to-slate-100 dark:from-[#262626] dark:to-[#1a1a1a] border-2 border-primary rounded-2xl p-8 relative flex flex-col shadow-2xl shadow-primary/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1">
                    <Zap size={14} /> Recommended
                </div>

                <h3 className="text-2xl font-bold text-primary mb-2">
                  {isAspirant ? 'Premium Learning' : 'Premium Network'}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-black">NGN {subscriptionAmount.toLocaleString()}</span>
                    <span className="text-slate-400 dark:text-white/50">/ month</span>
                </div>
                {isAspirant && (
                  <p className="text-xs text-primary mb-4 font-bold uppercase tracking-widest">
                    {trialDays}-day free trial
                  </p>
                )}
                
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-widest">Select Payment Method</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedProvider('paystack')}
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${selectedProvider === 'paystack' ? 'bg-primary text-black border-primary' : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-white/5 dark:text-white/60 dark:border-white/10 dark:hover:border-white/20'}`}
                    >
                      Paystack
                    </button>
                    <button 
                      onClick={() => setSelectedProvider('opay')}
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${selectedProvider === 'opay' ? 'bg-primary text-black border-primary' : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-white/5 dark:text-white/60 dark:border-white/10 dark:hover:border-white/20'}`}
                    >
                      OPay
                    </button>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                    {(isAspirant
                      ? ['Advanced courses in Academy', 'Mentor booking & office hours', 'Certificates of completion', 'Priority learning support']
                      : ['Unlimited pitch creations', 'Advanced filtering & deal discovery', 'Unlimited messaging & connections', 'Priority placement in feeds', 'Export network data']
                    ).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-white/90">
                            <Check size={18} className="text-primary" /> {feature}
                        </li>
                    ))}
                </ul>

                <div className="space-y-3">
                  {isAspirant && !subscription?.trialUsed && !hasPremium && (
                    <button
                      onClick={handleStartTrial}
                      disabled={loading}
                      className="w-full py-3 rounded-lg bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex justify-center items-center gap-2"
                    >
                        {loading ? "Processing..." : `Start ${trialDays}-Day Free Trial`}
                    </button>
                  )}
                  {hasPremium ? (
                    <button disabled className="w-full py-3 rounded-lg bg-primary/50 text-black font-bold cursor-not-allowed flex justify-center items-center gap-2">
                      <Zap size={18}/> Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={handleUpgrade}
                      disabled={loading}
                      className="w-full py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                    >
                        {loading ? "Processing..." : <><Wallet size={18}/> Upgrade to Premium</>}
                    </button>
                  )}
                </div>
            </div>

        </div>

        {/* Trust Footer */}
        <div className="mt-16 text-center text-slate-400 dark:text-white/40 text-xs flex items-center justify-center gap-2">
            <Shield size={14} /> Payments are processed securely. Cancel anytime.
        </div>

      </div>
    </div>
  );
}
