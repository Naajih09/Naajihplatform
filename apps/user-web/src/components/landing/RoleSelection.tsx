import React from 'react';
import { Rocket, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleSelection = () => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-[#0a0a0c]" id="benefits">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Entrepreneur */}
        <div className="group p-8 rounded-2xl bg-white dark:bg-deep-slate border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 shadow-sm">
          <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
            <Rocket size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Entrepreneurs</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Access capital through Mudabah (Profit-Sharing). Grow without compromising values.
          </p>
          <ul className="space-y-4 mb-8">
            {['100% Interest-Free (Riba-Free)', 'Mentorship from Leaders', 'Fast-Track Vetting'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-white">
                <CheckCircle className="text-primary" size={18} /> {item}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline">
            Apply for Funding <ArrowRight size={16} />
          </Link>
        </div>

        {/* Investor */}
        <div className="group p-8 rounded-2xl bg-white dark:bg-deep-slate border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 shadow-sm">
          <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
            <Wallet size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Investors</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Invest in verified Nigerian SMEs. Earn ethical returns through transparent partnership models.
          </p>
          <ul className="space-y-4 mb-8">
            {['Sharia-Compliant Returns', 'Real-time Performance Tracking', 'Social Impact Reporting'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-white">
                <CheckCircle className="text-primary" size={18} /> {item}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline">
            Start Investing <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default RoleSelection;