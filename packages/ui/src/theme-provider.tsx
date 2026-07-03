'use client';

import type { RestaurantTheme } from '@flames/theme';
import { createThemeCssVars } from '@flames/theme';
import { useEffect } from 'react';

interface ThemeProviderProps {
  theme: RestaurantTheme;
  children: React.ReactNode;
}

/** Syncs theme CSS variables to `:root` so body, portals, and SSR stay consistent. */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    const vars = createThemeCssVars(theme);
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    root.dataset.theme = theme.id;
    return () => {
      Object.keys(vars).forEach((key) => root.style.removeProperty(key));
      delete root.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="min-h-screen font-body antialiased" data-theme={theme.id}>
      {children}
    </div>
  );
}
