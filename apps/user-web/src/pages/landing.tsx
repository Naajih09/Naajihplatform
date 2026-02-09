import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; 

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="font-sans text-slate-900 dark:text-lunar-white bg-background-light dark:bg-background-dark overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer z-50">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined font-bold">account_balance</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tighter text-slate-900 dark:text-white uppercase">
              Naajih<span className="text-primary">Biz</span>
            </h2>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {['How it Works', 'Benefits', 'Halal & Trust', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-semibold hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors">Log In</Link>
            <Link to="/signup" className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-extrabold hover:brightness-110 transition-all shadow-lg shadow-primary/10">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-900 dark:text-white z-50" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background-dark z-40 flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-top duration-300">
            {['How it Works', 'Benefits', 'Halal & Trust', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold text-white hover:text-primary"
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-4 mt-8 w-full px-10">
              <Link to="/login" className="w-full text-center py-4 border border-white/10 rounded-xl text-white font-bold">Log In</Link>
              <Link to="/signup" className="w-full text-center py-4 bg-primary text-background-dark rounded-xl font-extrabold">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="relative z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live in Nigeria
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 dark:text-white mb-6 tracking-tight">
              Enabling <span className="text-primary">Halal</span> Business Growth
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
              Connecting ethical entrepreneurs with Sharia-compliant investors for interest-free, sustainable growth based on Islamic finance principles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="bg-primary text-background-dark px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                Get Funding <span className="material-symbols-outlined">trending_up</span>
              </Link>
              <Link to="/signup" className="bg-slate-200 dark:bg-deep-slate text-slate-900 dark:text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors border border-white/5">
                Invest Now <span className="material-symbols-outlined">payments</span>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-background-dark bg-slate-400 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo39MjpkJdxNo6j6o5--P7OuXK8OWwKkCCtrdrYdN16lNxrDe0l8FUcmMmk5Npg9BU3slxJJo4-mZAqbHATcRuo798GsqZRLf35bc1lNL8eKyeazW4dSfg2REwLd4ttqbUbDW9tJFEPJqgWkMLQsmRY5SQROJ2wCr8311tQAAX1b_rccUoYcB-3azSwzc1KVjlaD-uxYyGMTk9tVSwX9h-z6fpJbilGt9O0nDUQzKia3lMzmCRztmp-Tb1ij4pUKd-Mtzw7zcDBBE" alt="User 1" />
                <img className="w-10 h-10 rounded-full border-2 border-background-dark bg-slate-400 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLkv2zgCDXCyihKS9T9Xsn2NG8WGyjTemw3fdpeEM63kyKYjf47Su8vCUpC1-QHWu_IuR3sl27Wqr5Ef-lBiu-nwMGZ_TahNvnYluxaL-kDOZNAvsqMA6jWe2yuqkMbMdUQs9InZ2ByQ9twW0o_u1FNV8YuhrmgL77HbGXLngUoJTrzTWA_yFvWFtwgU5ZgMEYbLrMiJvV-QYwTAV54BnaR-Oanp2IJNyZpyyiW4Z-s6ASMJYs23H0WdR-SUHXtQJsNp5eXyfgLyE" alt="User 2" />
                <img className="w-10 h-10 rounded-full border-2 border-background-dark bg-slate-400 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa8O7bOonCeUG1L-dSFRHkRSk8I8jCxFi5gtniKdLSKyc1m4jv_0lM9MN0kp-MCl1jDOTaoYNGglLbft7_zYTcuR17jZGk_ZCP18WGUhrBYvqe2YOqwicDRR90rDr2pMlPg9L9ZNo-wK0m4y_QclgoazqHCIrQwLhzle6o7VzSOY2k1gnjWihQ8nD3Jr3eLW46tIuA5uWLW6KdT_Wz2g82wQmkPyjQK6XHjgK6DuwrL1ZbuEjH_0pmg3wn_XbMzTGrkr0m2BZDo4w" alt="User 3" />
              </div>
              <p className="text-sm font-medium text-slate-500">Trusted by <span className="text-slate-900 dark:text-white font-bold">500+</span> entrepreneurs</p>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute -top-20 -right-20 w-60 h-60 md:w-80 md:h-80 bg-primary/10 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="aspect-[4/5] bg-deep-slate relative">
                <img className="w-full h-full object-cover mix-blend-overlay opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBdA5l6-AH1R-DaUoRDA7j4pwbXhDcuxsiJIask00-XdOfIX3lcSZssKeLt65qr8ltxCvBKfE55aKD3lrqSVRrR76vb_7qj1MHOkMNuhCwAvjw7x6TCHgZbKmDGiHjsFiqQtxbMHHFsNQ5S4VSttalsvH0uWPKLQE49rg5v392VhQeF7_7rbUo-hInecgM4MDPASFXIHcJo_iST1w3Mi5KHvn6soBxct1QJwQCN2woTMnQMa4fGKk9vx7gOGCYRGEUgkYJLdvVg7g" alt="Team" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-background-dark/80 backdrop-blur-xl border border-white/10 rounded-xl">
                  <p className="text-primary font-bold mb-1 text-xs md:text-sm">Impact Story</p>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">"NaajihBiz helped us scale our Agri-tech startup..."</h3>
                  <p className="text-slate-400 text-xs md:text-sm">— Musa J., Founder of GreenLagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ROLES SECTION --- */}
      <section className="py-16 md:py-20 bg-background-light dark:bg-[#0a0a0c]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Entrepreneur Card */}
            <div className="group p-6 md:p-8 rounded-2xl bg-white dark:bg-deep-slate border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Entrepreneurs</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Access capital through Mudabah (Profit-Sharing) or Murabaha (Trade Financing) agreements.
              </p>
              <ul className="space-y-4 mb-8">
                {['100% Interest-Free (Riba-Free)', 'Mentorship from Industry Leaders', 'Fast-Track Ethical Vetting'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary">check_circle</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline">
                Apply for Funding <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Investor Card */}
            <div className="group p-6 md:p-8 rounded-2xl bg-white dark:bg-deep-slate border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Investors</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Invest in verified Nigerian SMEs and startups. Earn ethical returns through transparent partnership models.
              </p>
              <ul className="space-y-4 mb-8">
                {['Sharia-Compliant Return Models', 'Real-time Performance Tracking', 'Social Impact Reporting'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary">check_circle</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline">
                Start Investing <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-16 md:py-24" id="how-it-works">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">The Naajih Path</h2>
            <p className="text-slate-500 max-w-lg mx-auto">From application to impact — a transparent journey designed for ethical success.</p>
          </div>
          <div className="relative space-y-12">
            {[
              { num: 1, title: 'Apply & Ethical Vetting', text: 'Submit your business case. Our team reviews not just the financials, but the ethical impact.', icon: 'shield_person', tag: 'Vetted by Sharia Board' },
              { num: 2, title: 'Marketplace Matching', text: 'Once approved, your venture is listed on our secure platform where ethical investors browse.', tags: ['TECH', 'AGRI', 'RETAIL'] },
              { num: 3, title: 'Growth & Profit Sharing', text: 'Receive funds and mentorship. As your business grows, profits are shared according to the pre-agreed contract.' }
            ].map((step, idx) => (
              <div key={step.num} className="flex flex-col md:flex-row gap-4 md:gap-16 items-start">
                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background-dark font-black text-xl z-10">{step.num}</div>
                  {/* Vertical line only visible on Desktop */}
                  {idx !== 2 && <div className="hidden md:block w-0.5 bg-slate-300 dark:bg-slate-800 h-full mt-4 min-h-[100px]"></div>}
                </div>
                <div className="pb-8 md:pb-12">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">{step.text}</p>
                  {step.icon && (
                    <div className="mt-6 p-4 bg-slate-100 dark:bg-deep-slate/50 rounded-lg border border-slate-200 dark:border-white/5 flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary">{step.icon}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">{step.tag}</span>
                    </div>
                  )}
                  {step.tags && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {step.tags.map(t => (
                        <div key={t} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded">{t}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST SECTION --- */}
      <section className="py-16 md:py-24 bg-deep-slate relative overflow-hidden" id="trust">
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
              <img className="rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNyhFRT-NvKu_cs3m4ZHZWmV14QSXf7kMs5BmT4hSVZCvnNu57Zg4BAO5P21IpnkAQf0iqGqc-YkBHQYCXH7FFoyjey2gnl1-V0805kkpnGveF4dDGgdqOV3qpPAohi_sIqk4xln-1nGITKewba__xC6depBmTOJcSRNvFD6GSTkMU0kLjMHxuOnmpam_3zOUP3CPLSfu2u2El0fFdecNkDSNIlq6h7qbS-q9JpLPzy7etnDj8VH2WezZZnjDIGIysCBvFUcq-QK4" alt="Trust" />
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-primary p-6 md:p-8 rounded-2xl text-background-dark max-w-[240px] md:max-w-[280px]">
                <span className="material-symbols-outlined text-4xl mb-4">verified_user</span>
                <h4 className="text-xl font-900 mb-2">Certified Compliance</h4>
                <p className="text-sm font-bold opacity-80">Our Sharia Supervisory Board audits every transaction model monthly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-background-dark border-t border-white/5 py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-xs font-bold">account_balance</span>
              </div>
              <h2 className="text-lg font-extrabold tracking-tighter text-white uppercase">Naajih<span className="text-primary">Biz</span></h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Nigeria's premier Islamic investment platform.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500"><li>Browse Projects</li><li>How it Works</li></ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500"><li>Sharia Certification</li><li>Privacy Policy</li></ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Location</h4>
            <p className="text-slate-500 text-sm mb-4">12th Floor, Heritage Tower, Lagos, Nigeria</p>
            <p className="text-primary text-sm font-bold">contact@naajihbiz.com</p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
          © 2026 NaajihBiz Investment Platform. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Landing;