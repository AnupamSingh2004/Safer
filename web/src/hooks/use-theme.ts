// web/src/hooks/use-theme.ts
'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { getThemeColors, createCSSVariables, type ThemeMode } from '@/lib/theme/theme-config';

export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure we only access theme after component mounts (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the actual theme (resolve 'system' to actual theme)
  const resolvedTheme = (theme === 'system' ? systemTheme : theme) as ThemeMode;
  
  // Get theme colors for current theme
  const colors = mounted ? getThemeColors(resolvedTheme || 'light') : getThemeColors('light');

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    
    const cssVars = createCSSVariables(resolvedTheme);
    const root = document.documentElement;
    
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [resolvedTheme, mounted]);

  return {
    theme: mounted ? resolvedTheme : 'light',
    setTheme,
    colors,
    isDark: mounted ? resolvedTheme === 'dark' : false,
    isLight: mounted ? resolvedTheme === 'light' : true,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    mounted,
  };
};