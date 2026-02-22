import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg border transition-all duration-300
        bg-white text-orange-500 border-gray-200 shadow-sm
        hover:bg-gray-50
        dark:bg-slate-800 dark:text-yellow-400 dark:border-slate-700
        dark:hover:bg-slate-700
      "
      aria-label="Toggle Theme"
    >
      <Sun className="block dark:hidden" size={20} />
      <Moon className="hidden dark:block" size={20} />
    </button>
  );
};

export default ThemeToggle;
