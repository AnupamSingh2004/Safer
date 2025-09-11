/**
 * Smart Tourist Safety System - Theme Provider
 * Next.js theme provider with dark mode support
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="smart-tourist-safety-theme"
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
