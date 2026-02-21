import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TrustSection = () => {
  return (
    <section className="py-16 md:py-24 bg-deep-slate relative overflow-hidden" id="trust">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,#aaff00_0%,transparent_50%)]"></div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-white">Financial Ethics, <span className="text-primary">Redefined.</span></h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              We operate strictly under the principles of Islamic Finance. No usury (Riba), no uncertainty (Gharar), only real growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { t: 'Musharakah', d: 'Joint venture partnership.' },
                { t: 'Mudarabah', d: 'Capital meets expertise.' },
                { t: 'Murabaha', d: 'Asset-backed trade financing.' },
                { t: 'Waqf Impact', d: 'Sustainable endowment projects.' }
              ].map(item => (
                <div key={item.t} className="p-6 rounded-xl bg-background-dark/50 border border-white/5">
                  <h4 className="text-primary font-bold mb-2">{item.t}</h4>
                  <p className="text-xs text-slate-500">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-2xl shadow-2xl bg-gray-800 w-full aspect-video flex items-center justify-center text-gray-500">
               <span className="text-xs">Trust Visual</span>
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-primary p-6 md:p-8 rounded-2xl text-background-dark max-w-[240px] md:max-w-[280px]">
              <span className="material-symbols-outlined text-4xl mb-4 block">verified_user</span>
              <h4 className="text-xl font-900 mb-2">Certified Compliance</h4>
              <p className="text-sm font-bold opacity-80">Our Sharia Supervisory Board audits every transaction model monthly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;