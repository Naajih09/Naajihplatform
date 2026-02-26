import { Check, Info, Shield, Wallet, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Subscription() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    // Mocking an API call for payment checkout session
    setTimeout(() => {
      alert("Redirecting to Paystack/Stripe checkout...");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white px-6 md:px-10 py-8 pb-24">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-black mb-4">Elevate Your Networking</h1>
          <p className="text-white/60">
            Choose the tier that matches your ambition. All plans comply with Sharia business principles.
          </p>
        </div>

        {/* Current Plan Alert */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Your Current Plan: <span className="text-primary tracking-widest uppercase">Free Tier</span></h4>
                    <p className="text-xs text-white/60">Limited access to deals and messages.</p>
                </div>
            </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Free Tier */}
            <div className="bg-[#1d1d20] border border-white/10 rounded-2xl p-8 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Basic Access</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black">₦0</span>
                    <span className="text-white/50">/ forever</span>
                </div>
                <p className="text-sm text-white/70 mb-8 flex-grow">
                    Perfect for new founders making their first connections.
                </p>
                
                <ul className="space-y-4 mb-8">
                    {['Create 1 active pitch', 'Browse public pitch feed', 'Send 5 connection requests/mo', 'Basic profile visibility'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                            <Check size={18} className="text-gray-500" /> {feature}
                        </li>
                    ))}
                </ul>
                
                <button disabled className="w-full py-3 rounded-lg bg-white/5 text-white/50 font-bold border border-white/5 cursor-not-allowed">
                    Current Plan
                </button>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-b from-[#262626] to-[#1a1a1a] border-2 border-primary rounded-2xl p-8 relative flex flex-col shadow-2xl shadow-primary/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1">
                    <Zap size={14} /> Recommended
                </div>

                <h3 className="text-2xl font-bold text-primary mb-2">Premium Network</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black">₦15,000</span>
                    <span className="text-white/50">/ month</span>
                </div>
                <p className="text-sm text-white/70 mb-8 flex-grow">
                    For serious founders and investors ready to close deals.
                </p>

                <ul className="space-y-4 mb-8">
                    {['Unlimited pitch creations', 'Advanced filtering & deal discovery', 'Unlimited messaging & connections', 'Priority placement in feeds', 'Export network data'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                            <Check size={18} className="text-primary" /> {feature}
                        </li>
                    ))}
                </ul>

                <button 
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                >
                    {loading ? "Processing..." : <><Wallet size={18}/> Upgrade to Premium</>}
                </button>
            </div>

        </div>

        {/* Trust Footer */}
        <div className="mt-16 text-center text-white/40 text-xs flex items-center justify-center gap-2">
            <Shield size={14} /> Payments are processed securely. Cancel anytime.
        </div>

      </div>
    </div>
  );
}
