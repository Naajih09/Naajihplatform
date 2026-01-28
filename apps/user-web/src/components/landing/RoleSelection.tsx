import React from 'react';
import { Rocket, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleSelection = () => {
  return (
    <section className="py-20 bg-[#0a0a0c] text-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group p-8 rounded-2xl bg-deep-slate border border-white/5 hover:border-primary/50 transition-all duration-300">
          <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
            <Rocket size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-4">For Entrepreneurs</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Access capital through Mudabah (Profit-Sharing) agreements. Grow your business without compromising your values.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline">
            Apply for Funding <ArrowRight size={16} />
          </Link>
        </div>
        <div className="group p-8 rounded-2xl bg-deep-slate border border-white/5 hover:border-primary/50 transition-all duration-300">
          <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
            <Wallet size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-4">For Investors</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Invest in verified Nigerian SMEs. Earn ethical returns through transparent partnership models.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline">
            Start Investing <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;