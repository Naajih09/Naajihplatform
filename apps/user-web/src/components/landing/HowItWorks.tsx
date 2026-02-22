import React from 'react';
import { ShieldCheck, Users, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { num: 1, title: 'Apply & Ethical Vetting', text: 'Submit your business case. Our team reviews not just the financials, but the ethical impact.', icon: ShieldCheck, tag: 'Vetted by Sharia Board' },
    { num: 2, title: 'Marketplace Matching', text: 'Once approved, your venture is listed on our secure platform where ethical investors browse.', icon: Users, tags: ['TECH', 'AGRI', 'RETAIL'] },
    { num: 3, title: 'Growth & Profit Sharing', text: 'Receive funds and mentorship. As your business grows, profits are shared according to the contract.', icon: TrendingUp }
  ];

  return (
    <section className="py-24 bg-background-light dark:bg-background-dark" id="how-it-works">
      <div className="max-w-[960px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">The Naajih Path</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">From application to impact — a transparent journey designed for ethical success.</p>
        </div>
        
        <div className="relative space-y-12">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex flex-col md:flex-row gap-4 md:gap-16 items-start">
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background-dark font-black text-xl z-10 shrink-0">
                  {step.num}
                </div>
                {idx !== 2 && <div className="hidden md:block w-0.5 bg-slate-300 dark:bg-slate-800 h-full mt-4 min-h-[100px]"></div>}
              </div>
              
              <div className="pb-8 md:pb-12 flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;