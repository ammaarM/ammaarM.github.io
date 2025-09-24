import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Accent = 'blue' | 'emerald' | 'purple';

interface ThemeContextValue {
  theme: ThemeMode;
  accent: Accent;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'portfolio-theme-mode';
const ACCENT_STORAGE_KEY = 'portfolio-accent';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const mode = theme === 'system' ? getSystemTheme() : theme;
  root.setAttribute('data-theme', mode);
}

function applyAccent(accent: Accent) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-accent', accent);
}

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system';
  });
  const [accent, setAccentState] = useState<Accent>(() => {
    if (typeof window === 'undefined') return 'blue';
    return (localStorage.getItem(ACCENT_STORAGE_KEY) as Accent) || 'blue';
  });

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    applyAccent(accent);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    }
  }, [accent]);

  useEffect(() => {
    if (theme !== 'system') return;
    if (typeof window === 'undefined') return;

    const listener = (event: MediaQueryListEvent) => {
      applyTheme(event.matches ? 'dark' : 'light');
    };

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      accent,
      setTheme: setThemeState,
      setAccent: setAccentState
    }),
    [theme, accent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
