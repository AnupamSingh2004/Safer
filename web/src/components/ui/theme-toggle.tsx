// web/src/components/ui/theme-toggle.tsx
'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ 
  variant = 'button', 
  size = 'md', 
  showLabel = false,
  className = '' 
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <Button variant="ghost" size={size === 'sm' ? 'sm' : 'default'} className={className}>
        <Sun className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block text-left ${className}`}>
t        <Button
          variant="ghost"
          size={size === 'sm' ? 'sm' : 'default'}
          onClick={toggleTheme}
          className="transition-colors duration-200"
        >
          {theme === 'dark' ? (
            <Sun className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
          ) : theme === 'light' ? (
            <Moon className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
          ) : (
            <Monitor className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
          )}
          {showLabel && (
            <span className="ml-2 capitalize">
              {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}
            </span>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${className}`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
        ) : (
          <Moon className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'sm' : 'default'}
      onClick={toggleTheme}
      className={`transition-colors duration-200 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
      ) : (
        <Moon className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'}`} />
      )}
      {showLabel && (
        <span className="ml-2">
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </span>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
