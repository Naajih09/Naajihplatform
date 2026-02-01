import { useEffect, useState } from 'react';

export function useTheme() {
  // 1. Initialize state from LocalStorage or System Preference
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      // Default to dark for Stitch design
      return 'dark';
    }
    return 'dark';
  });

  // 2. Apply the class to the <HTML> tag whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first to be safe
    root.classList.remove('light', 'dark');
    
    // Add the active class
    root.classList.add(theme);
    
    // Save to storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}