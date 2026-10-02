import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  availableThemes: { id: ThemeMode; name: string; primaryColor: string; accentColor: string; previewBadge: string }[];
}

const THEMES: { id: ThemeMode; name: string; primaryColor: string; accentColor: string; previewBadge: string }[] = [
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    primaryColor: '#f59e0b',
    accentColor: '#10b981',
    previewBadge: 'bg-amber-500 text-black',
  },
  {
    id: 'midnight-cyber',
    name: 'Midnight Cyber',
    primaryColor: '#06b6d4',
    accentColor: '#a855f7',
    previewBadge: 'bg-cyan-500 text-black',
  },
  {
    id: 'studio-dark',
    name: 'Studio Dark',
    primaryColor: '#f8fafc',
    accentColor: '#ef4444',
    previewBadge: 'bg-slate-200 text-black',
  },
  {
    id: 'electric-sunset',
    name: 'Electric Sunset',
    primaryColor: '#f43f5e',
    accentColor: '#fb923c',
    previewBadge: 'bg-rose-500 text-white',
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('bewithyugace_theme');
    return (saved as ThemeMode) || 'obsidian-gold';
  });

  useEffect(() => {
    localStorage.setItem('bewithyugace_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-obsidian-gold', 'theme-midnight-cyber', 'theme-studio-dark', 'theme-electric-sunset');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: THEMES }}>
      <div className={`theme-${theme} min-h-screen text-slate-100`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
