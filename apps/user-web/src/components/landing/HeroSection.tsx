import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  HandCoins,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background-dark px-0 pb-16 pt-20 text-white sm:pt-28 md:pb-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Live in Nigeria
          </div>
          <h1 className="mb-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
            Enabling <span className="text-primary">Halal</span> <br /> Business
            Growth
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg md:mb-10">
            Connecting ethical entrepreneurs with Sharia-compliant investors for
            interest-free, sustainable growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-background-dark transition-transform hover:scale-[1.02] sm:px-8 sm:py-4 sm:text-lg"
            >
              Get Funding <TrendingUp size={20} />
            </Link>
            <Link
              to="/signup"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/5 bg-deep-slate px-6 py-3 text-base font-bold text-white transition-colors hover:bg-slate-800 sm:px-8 sm:py-4 sm:text-lg"
            >
              Invest Now <Wallet size={20} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="relative flex min-h-[560px] items-end overflow-hidden rounded-2xl border border-white/10 bg-deep-slate p-4 shadow-2xl sm:aspect-[4/5] sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-deep-slate/60 to-transparent"></div>
            <div className="pointer-events-none absolute inset-x-4 top-4 h-[44%] overflow-hidden rounded-xl border border-white/5 bg-[#111315] sm:inset-x-6 sm:top-8 sm:h-[48%]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(170,255,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(170,255,0,0.06)_1px,transparent_1px)] bg-[size:42px_42px]"></div>
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"></div>
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"></div>
              <div className="hero-flow hero-flow-one"></div>
              <div className="hero-flow hero-flow-two"></div>
              <div className="hero-flow hero-flow-three"></div>
              <div className="absolute left-[12%] top-[42%] flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_30px_rgba(170,255,0,0.12)] hero-float">
                <Building2 size={24} />
              </div>
              <div className="absolute left-1/2 top-[18%] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur hero-pulse">
                <ShieldCheck size={28} />
              </div>
              <div className="absolute right-[12%] top-[44%] flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_30px_rgba(170,255,0,0.12)] hero-float hero-float-delay">
                <HandCoins size={24} />
              </div>
              <div className="absolute bottom-5 left-1/2 h-2 w-28 -translate-x-1/2 rounded-full bg-primary/30 blur-sm hero-scan"></div>
            </div>
            <div className="relative z-10 w-full space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                What you get
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Trusted profiles",
                    text: "People can review verified business details before they connect.",
                  },
                  {
                    icon: Users,
                    title: "One place to manage",
                    text: "Founders, investors, and learners use the same account space.",
                  },
                  {
                    icon: Rocket,
                    title: "Ready to start",
                    text: "Pitch, connect, verify, and upgrade from one simple flow.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon size={18} className="text-primary" />
                      <h3 className="text-sm font-bold text-white">
                        {item.title}
                      </h3>
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
