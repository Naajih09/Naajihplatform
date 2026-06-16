import { Link } from 'react-router-dom';
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
      <footer className="border-t border-slate-200 bg-white py-12 transition-colors duration-300 dark:border-white/5 dark:bg-background-dark md:py-16" id="about">
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
              Nigeria's premier Islamic investment platform connecting ethical capital with sustainable enterprise.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#how-it-works" className="hover:text-primary">How it Works</a></li>
                <li><a href="#benefits" className="hover:text-primary">Benefits</a></li>
                <li><Link to="/signup" className="hover:text-primary">Browse Opportunities</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
                <li className="text-slate-500">Sharia Certification</li>
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
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Location</h4>
            <p className="text-slate-500 text-sm mb-4">
                12th Floor, Heritage Tower,<br/> Victoria Island, Lagos
            </p>
            <p className="text-primary text-sm font-bold">contact@naajihbiz.com</p>
          </div>

        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-white/5 text-center text-slate-500 text-xs">
          (c) 2026 NaajihBiz Investment Platform. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Landing;
