
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark theme

  useEffect(() => {
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem('booie-theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      
      // Apply gradient variables for dark theme
      root.style.setProperty('--gradient-start', '270deg, rgba(139, 92, 246, 0.5)');
      root.style.setProperty('--gradient-mid', '266deg, rgba(124, 58, 237, 0.5)');
      root.style.setProperty('--gradient-end', '260deg, rgba(109, 40, 217, 0.5)');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      
      // Apply gradient variables for light theme
      root.style.setProperty('--gradient-start', '270deg, rgba(168, 85, 247, 0.2)');
      root.style.setProperty('--gradient-mid', '266deg, rgba(147, 51, 234, 0.2)');
      root.style.setProperty('--gradient-end', '260deg, rgba(126, 34, 206, 0.2)');
    }
    
    // Save to localStorage
    localStorage.setItem('booie-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeProvider;
