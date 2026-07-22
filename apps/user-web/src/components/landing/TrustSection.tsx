import React from "react";

const TrustSection = () => {
  return (
    <section
      className="relative overflow-hidden bg-deep-slate py-14 md:py-24"
      id="trust"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,#aaff00_0%,transparent_50%)]"></div>
      </div>
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-white md:mb-8 md:text-4xl">
              Financial Ethics, <span className="text-primary">Redefined.</span>
            </h2>
            <p className="mb-8 text-base leading-relaxed text-slate-400 sm:text-lg md:mb-10">
              We operate strictly under the principles of Islamic Finance. No
              usury (Riba), no uncertainty (Gharar), only real growth.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {[
                { t: "Musharakah", d: "Joint venture partnership." },
                { t: "Mudarabah", d: "Capital meets expertise." },
                { t: "Murabaha", d: "Asset-backed trade financing." },
                { t: "Waqf Impact", d: "Sustainable endowment projects." },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-white/5 bg-background-dark/50 p-5 sm:p-6"
                >
                  <h4 className="text-primary font-bold mb-2">{item.t}</h4>
                  <p className="text-xs text-slate-500">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-2xl border border-white/5 bg-[#121214] p-4 shadow-2xl sm:p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    title: "Verified profiles",
                    value:
                      "Founders and investors can show the essentials clearly.",
                  },
                  {
                    title: "Active opportunities",
                    value: "Open pitches are easy to browse and review.",
                  },
                  {
                    title: "Simple onboarding",
                    value:
                      "Profile, verification, and subscription live in one flow.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <h4 className="text-sm font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 bg-primary p-6 md:p-8 rounded-2xl text-background-dark max-w-none sm:max-w-[320px] lg:ml-auto">
              <span className="material-symbols-outlined text-4xl mb-4 block">
                verified_user
              </span>
              <h4 className="text-xl font-900 mb-2">Built for trust</h4>
              <p className="text-sm font-bold opacity-80">
                Every profile, pitch, and payment step is designed to feel clear
                and dependable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
