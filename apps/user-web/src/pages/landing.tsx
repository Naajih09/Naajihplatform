import { Link } from "react-router-dom";
import React from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import RoleSelection from "../components/landing/RoleSelection";
import HowItWorks from "../components/landing/HowItWorks";
import TrustSection from "../components/landing/TrustSection";
import { getPublicEntryPath } from "../lib/public-entry";

const Landing = () => {
  const entryPath = getPublicEntryPath();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-lunar-white">
      <Navbar />
      <HeroSection />
      <RoleSelection />
      <HowItWorks />
      <TrustSection />
      <section className="bg-slate-100 py-14 dark:bg-[#0a0a0c] md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-deep-slate sm:p-8 md:p-12">
            <div className="mb-10 text-center md:mb-12">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                Why founders choose us
              </p>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Ready to grow responsibly?
              </h3>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "1.2k+", label: "Founders onboarded" },
                { value: "92%", label: "Verified match rate" },
                { value: "24-48h", label: "Review turnaround" },
                { value: "100%", label: "Values-aligned screening" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-background-dark/80"
                >
                  <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
              <Link
                to={entryPath}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-background-dark transition-transform hover:scale-[1.02]"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:text-white"
              >
                Explore Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer
        className="border-t border-slate-200 bg-white py-12 transition-colors duration-300 dark:border-white/5 dark:bg-background-dark md:py-16"
        id="about"
      >
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 text-center sm:px-6 md:grid-cols-4 md:gap-12 md:text-left">
          <div className="col-span-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background-dark font-bold">
                N
              </div>
              <h2 className="text-lg font-extrabold tracking-tighter uppercase text-slate-900 dark:text-white">
                Naajih<span className="text-primary">Biz</span>
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Nigeria's values-led investment platform connecting ethical
              capital with sustainable enterprise.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#how-it-works" className="hover:text-primary">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-primary">
                  Benefits
                </a>
              </li>
              <li>
                <Link to={entryPath} className="hover:text-primary">
                  Browse Opportunities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">
              Legal
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="text-slate-500">Ethical Standards</li>
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">
              Location
            </h4>
            <p className="text-slate-500 text-sm mb-4">
              12th Floor, Heritage Tower,
              <br /> Victoria Island, Lagos
            </p>
            <p className="text-primary text-sm font-bold">
              contact@naajihbiz.com
            </p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-white/5 text-center text-slate-500 text-xs">
          (c) 2026 NaajihBiz. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
