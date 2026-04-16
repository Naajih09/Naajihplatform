import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, ShieldCheck, Users, Rocket } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 bg-background-dark text-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Live in Nigeria
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Enabling <span className="text-primary">Halal</span> <br/> Business Growth
          </h1>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
            Connecting ethical entrepreneurs with Sharia-compliant investors for interest-free, sustainable growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="bg-primary text-background-dark px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
              Get Funding <TrendingUp size={20} />
            </Link>
            <Link to="/signup" className="bg-deep-slate text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors border border-white/5">
              Invest Now <Wallet size={20} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-deep-slate aspect-[4/5] flex items-end p-8">
             <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-deep-slate/60 to-transparent"></div>
             <div className="relative z-10 w-full space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  What you get
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { icon: ShieldCheck, title: 'Trusted profiles', text: 'People can review verified business details before they connect.' },
                    { icon: Users, title: 'One place to manage', text: 'Founders, investors, and learners use the same account space.' },
                    { icon: Rocket, title: 'Ready to start', text: 'Pitch, connect, verify, and upgrade from one simple flow.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon size={18} className="text-primary" />
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{item.text}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
