import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle'; // Ensure this path points to where you saved ThemeToggle.tsx

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        
        {/* --- LOGO --- */}
        <div className="flex items-center gap-2 cursor-pointer z-50">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
            <Landmark size={20} strokeWidth={3} />
          </div>
          <h2 className="text-xl font-extrabold tracking-tighter uppercase text-slate-900 dark:text-white">
            Naajih<span className="text-primary">Biz</span>
          </h2>
        </div>
        
        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {['How it Works', 'Benefits', 'Trust'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </nav>

        {/* --- DESKTOP ACTIONS --- */}
        <div className="hidden md:flex items-center gap-4">
          {/* Toggle Button */}
          <ThemeToggle />
          
          <Link to="/login" className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors text-slate-900 dark:text-white">
            Log In
          </Link>
          <Link to="/signup" className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-extrabold hover:brightness-110 transition-all shadow-lg shadow-primary/10">
            Get Started
          </Link>
        </div>

        {/* --- MOBILE ACTIONS (Hamburger + Toggle) --- */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <ThemeToggle />
          <button 
            onClick={toggleMenu} 
            className="text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-40 flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-top duration-300">
          {['How it Works', 'Benefits', 'Trust'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-slate-900 dark:text-white hover:text-primary"
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-4 mt-8 w-full px-10">
            <Link to="/login" className="w-full text-center py-4 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold">
              Log In
            </Link>
            <Link to="/signup" className="w-full text-center py-4 bg-primary text-background-dark rounded-xl font-extrabold">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;