import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg border transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-[#1d1d20] border-gray-700 text-yellow-400 hover:bg-gray-800' 
          : 'bg-white border-gray-200 text-orange-500 hover:bg-gray-50 shadow-sm'
        }
      `}
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