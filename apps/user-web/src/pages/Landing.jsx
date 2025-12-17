import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="font-sans text-brand-dark bg-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-20 py-5 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="text-2xl font-bold text-brand-blue">NaajihBiz<span className="text-brand-gold">.</span></div>
        <div className="flex gap-4">
          <Link to="/login"><Button variant="ghost">Log In</Button></Link>
          <Link to="/signup"><Button variant="primary">Get Started</Button></Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-20 pb-32 px-6 md:px-20 bg-brand-blue overflow-hidden text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block px-4 py-1 bg-blue-800 rounded-full text-blue-200 text-xs font-bold mb-6 border border-blue-700 uppercase tracking-wider">
              🚀 The #1 Platform for Halal Business Growth
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Connect. Invest. <br/><span className="text-brand-gold">Succeed.</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
              We bridge the gap between ambitious entrepreneurs and visionary investors in Nigeria. Secure capital, find mentorship, and grow ethically.
            </p>
            <div className="flex gap-4">
              <Link to="/signup"><Button variant="secondary" className="px-8">Join the Network</Button></Link>
              <Link to="/login"><Button variant="outline" className="px-8 text-white border-white hover:bg-white/10 hover:text-white">Log In</Button></Link>
            </div>
          </div>
          {/* Abstract Visual */}
          <div className="hidden md:block relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold opacity-20 rounded-full blur-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
               <div className="flex items-center gap-4 mb-6">
                 <div className="bg-green-100 p-3 rounded-full text-green-600"><TrendingUp size={24}/></div>
                 <div>
                   <p className="text-gray-300 text-sm">Total Investment</p>
                   <p className="text-white font-bold text-2xl">₦ 125M+</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24}/></div>
                 <div>
                   <p className="text-gray-300 text-sm">Active Members</p>
                   <p className="text-white font-bold text-2xl">5,000+</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="py-24 px-6 md:px-20 bg-brand-bg">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">Why Choose NaajihBiz?</h2>
          <p className="text-brand-gray">Built for the Nigerian market with strict verification and halal principles.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={ShieldCheck} 
            title="Verified Trust" 
            desc="Every investor and entrepreneur undergoes KYC verification to ensure safety." 
          />
          <FeatureCard 
            icon={TrendingUp} 
            title="Smart Matching" 
            desc="Our engine connects you with deals that match your specific industry and ticket size." 
          />
          <FeatureCard 
            icon={Users} 
            title="Community First" 
            desc="Access mentorship and networking events designed for business growth." 
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-brand-dark">{title}</h3>
    <p className="text-brand-gray leading-relaxed">{desc}</p>
  </div>
);

export default Landing;