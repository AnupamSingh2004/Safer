/**
 * Simple Theme Switcher Component
 * Basic theme switching functionality using next-themes
 */

'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// ============================================================================
// SIMPLE THEME SWITCHER
// ============================================================================

interface SimpleThemeSwitcherProps {
  variant?: 'default' | 'icon' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function SimpleThemeSwitcher({ 
  variant = 'default', 
  size = 'default',
  className 
}: SimpleThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn(
        "h-9 w-9 rounded-lg bg-gray-200 animate-pulse",
        className
      )} />
    );
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme || 'system');
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-sm';
      case 'lg':
        return 'h-10 w-10 text-lg';
      default:
        return 'h-9 w-9 text-base';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-lg",
        "border border-input bg-background",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        getSizeClasses(),
        className
      )}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
    </button>
  );
}

// ============================================================================
// THEME SWITCHER WITH DROPDOWN
// ============================================================================

export function ThemeSwitcherDropdown({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn(
        "h-9 w-9 rounded-lg bg-gray-200 animate-pulse",
        className
      )} />
    );
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-center rounded-lg",
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "h-9 w-9",
          className
        )}
        aria-label={`Current theme: ${currentTheme.label}. Click to change theme.`}
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[150px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground",
                    theme === themeOption.value && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {themeOption.label}
                  {theme === themeOption.value && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Default export
export default SimpleThemeSwitcher;