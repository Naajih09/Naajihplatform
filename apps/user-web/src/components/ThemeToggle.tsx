import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg border transition-all duration-300 
      ${theme === 'dark' 
        ? 'bg-white/10 border-white/10 text-primary hover:bg-white/20' 
        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
      } ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="animate-in spin-in-90 duration-300" />
      ) : (
        <Moon size={20} className="animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;