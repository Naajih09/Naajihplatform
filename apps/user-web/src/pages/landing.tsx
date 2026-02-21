import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import RoleSelection from '../components/landing/RoleSelection';
import HowItWorks from '../components/landing/HowItWorks';
import TrustSection from '../components/landing/TrustSection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-lunar-white">
            <Navbar />
            <HeroSection />
            <RoleSelection />
            <HowItWorks />
            <TrustSection />
      <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 py-12 md:py-16 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          
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
              Nigeria's premier Islamic investment platform connecting ethical capital with sustainable enterprise.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
                <li className="hover:text-primary cursor-pointer">Browse Projects</li>
                <li className="hover:text-primary cursor-pointer">How it Works</li>
                <li className="hover:text-primary cursor-pointer">Success Stories</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
                <li className="hover:text-primary cursor-pointer">Sharia Certification</li>
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer">Terms of Service</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Location</h4>
            <p className="text-slate-500 text-sm mb-4">
                12th Floor, Heritage Tower,<br/> Victoria Island, Lagos
            </p>
            <p className="text-primary text-sm font-bold">contact@naajihbiz.com</p>
          </div>

        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-white/5 text-center text-slate-500 text-xs">
          © 2026 NaajihBiz Investment Platform. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Landing;