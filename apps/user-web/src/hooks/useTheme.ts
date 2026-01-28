import { useEffect, useState } from 'react';

export function useTheme() {
  // 1. Check Local Storage or System Preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return 'dark'; // Default to Dark mode for Stitch design
  });

  // 2. Apply the class to the HTML tag
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme || 'dark'); // Add the current theme class
    
    // Save preference
    localStorage.setItem('theme', theme || 'dark');
  }, [theme]);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}