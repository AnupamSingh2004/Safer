/**
 * Smart Tourist Safety System - Theme Store
 * Zustand store for managing theme state (light/dark mode)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            set({ resolvedTheme: systemTheme });
          } else {
            root.classList.add(theme);
            set({ resolvedTheme: theme });
          }
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          state.setTheme(state.theme);
        }
      },
    }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  const store = useTheme.getState();
  store.setTheme(store.theme);
}