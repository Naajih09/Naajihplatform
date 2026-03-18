import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-slate-200 bg-white p-2 text-orange-500 shadow-sm transition-colors hover:bg-slate-50 dark:border-gray-700 dark:bg-[#1d1d20] dark:text-yellow-400 dark:hover:bg-[#26262b]"
      aria-label="Toggle theme"
      type="button"
    >
      <Sun className="block dark:hidden" size={18} />
      <Moon className="hidden dark:block" size={18} />
    </button>
  );
};

export default ThemeToggle;
