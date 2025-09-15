/**
 * Smart Tourist Safety System - Enhanced Theme Provider
 * Advanced theme management with smooth transitions and FOIT prevention
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedThemeConfig, getThemeColors, getThemeShadows, type ThemeMode } from '@/lib/theme/enhanced-theme-config';
import { fadeVariants, pageVariants } from '@/lib/theme/enhanced-animations';
import { getThemeScript } from '@/hooks/use-theme';

// ============================================================================
// THEME CONTEXT & PROVIDER
// ============================================================================

interface EnhancedThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: ReturnType<typeof getThemeColors>;
  shadows: ReturnType<typeof getThemeShadows>;
  emergencyMode: boolean;
  setEmergencyMode: (emergency: boolean) => void;
  toggleEmergencyMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  isLoading: boolean;
  prefersReducedMotion: boolean;
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined);

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};

// ============================================================================
// ENHANCED THEME PROVIDER COMPONENT
// ============================================================================

interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  enableSystem?: boolean;
}

export function EnhancedThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'emergency-theme',
  enableSystem = true,
  ...props
}: EnhancedThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Get current theme colors and shadows
  const colors = getThemeColors(theme);
  const shadows = getThemeShadows(theme);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Load saved preferences
    const savedTheme = localStorage.getItem(storageKey) as ThemeMode;
    const savedEmergencyMode = localStorage.getItem(`${storageKey}-emergency`) === 'true';
    const savedHighContrast = localStorage.getItem(`${storageKey}-contrast`) === 'true';
    const savedAnimations = localStorage.getItem(`${storageKey}-animations`) !== 'false';
    
    if (savedTheme) setTheme(savedTheme);
    if (savedEmergencyMode) setEmergencyMode(savedEmergencyMode);
    if (savedHighContrast) setIsHighContrast(savedHighContrast);
    setAnimationsEnabled(savedAnimations);

    // Check for system preferences
    if (enableSystem && !savedTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimationsEnabled(false);
    }

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    if (prefersHighContrast) {
      setIsHighContrast(true);
    }
  }, [storageKey, enableSystem]);

  // Handle theme changes
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
    
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    if (newTheme === 'high-contrast' || isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.add(newTheme);
    }
  };

  // Handle emergency mode
  const handleEmergencyMode = (emergency: boolean) => {
    setEmergencyMode(emergency);
    localStorage.setItem(`${storageKey}-emergency`, emergency.toString());
    
    // Apply emergency styles
    if (emergency) {
      document.body.classList.add('emergency-mode');
      // Force high contrast for emergency
      setIsHighContrast(true);
    } else {
      document.body.classList.remove('emergency-mode');
    }
  };

  // Handle high contrast toggle
  const toggleHighContrast = () => {
    const newHighContrast = !isHighContrast;
    setIsHighContrast(newHighContrast);
    localStorage.setItem(`${storageKey}-contrast`, newHighContrast.toString());
    
    // Apply or remove high contrast class
    if (newHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
      // Reapply current theme
      handleThemeChange(theme);
    }
  };

  // Handle animations toggle
  const toggleAnimations = () => {
    const newAnimationsEnabled = !animationsEnabled;
    setAnimationsEnabled(newAnimationsEnabled);
    localStorage.setItem(`${storageKey}-animations`, newAnimationsEnabled.toString());
    
    // Apply or remove reduced motion
    if (!newAnimationsEnabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  // Context value
  const contextValue: EnhancedThemeContextType = {
    theme: isHighContrast ? 'high-contrast' : theme,
    setTheme: handleThemeChange,
    colors,
    shadows,
    emergencyMode,
    setEmergencyMode: handleEmergencyMode,
    toggleEmergencyMode: () => setEmergencyMode(!emergencyMode),
    isHighContrast,
    toggleHighContrast,
    animationsEnabled,
    toggleAnimations,
    isLoading: !mounted,
    prefersReducedMotion: false, // Will be properly detected in child components
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      {...props}
    >
      <EnhancedThemeContext.Provider value={contextValue}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${theme}-${emergencyMode}-${isHighContrast}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationsEnabled ? pageVariants : undefined}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </EnhancedThemeContext.Provider>
    </NextThemesProvider>
  );
}

// ============================================================================
// THEME CONTROL COMPONENTS
// ============================================================================

/**
 * Emergency Mode Toggle Button
 */
export function EmergencyModeToggle() {
  const { emergencyMode, setEmergencyMode, animationsEnabled } = useEnhancedTheme();

  return (
    <motion.button
      onClick={() => setEmergencyMode(!emergencyMode)}
      className={`
        relative px-4 py-2 rounded-lg font-semibold transition-all duration-300
        ${emergencyMode 
          ? 'bg-red-500 text-white shadow-emergency' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
        focus:outline-none focus:ring-4 focus:ring-red-500/50
      `}
      whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
      whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
      animate={emergencyMode && animationsEnabled ? {
        boxShadow: [
          '0 0 0 0 rgba(239, 68, 68, 0.7)',
          '0 0 0 10px rgba(239, 68, 68, 0)',
          '0 0 0 0 rgba(239, 68, 68, 0)'
        ]
      } : undefined}
      transition={{
        duration: 1.5,
        repeat: emergencyMode ? Infinity : 0,
        ease: 'easeInOut'
      }}
    >
      {emergencyMode ? '🚨 EMERGENCY MODE' : 'Normal Mode'}
    </motion.button>
  );
}

/**
 * Theme Selector Component
 */
export function ThemeSelector() {
  const { theme, setTheme, animationsEnabled } = useEnhancedTheme();

  const themes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'high-contrast', label: 'High Contrast', icon: '⚫' },
  ];

  return (
    <div className="flex gap-2">
      {themes.map((themeOption) => (
        <motion.button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${theme === themeOption.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }
            focus:outline-none focus:ring-2 focus:ring-primary/50
          `}
          whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
        >
          <span className="mr-1">{themeOption.icon}</span>
          {themeOption.label}
        </motion.button>
      ))}
    </div>
  );
}

/**
 * Accessibility Controls Component
 */
export function AccessibilityControls() {
  const { isHighContrast, toggleHighContrast, animationsEnabled, toggleAnimations } = useEnhancedTheme();

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold text-foreground">Accessibility</h3>
      
      <div className="flex items-center justify-between">
        <label htmlFor="high-contrast" className="text-sm font-medium text-foreground">
          High Contrast Mode
        </label>
        <motion.button
          id="high-contrast"
          onClick={toggleHighContrast}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${isHighContrast ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}
            focus:outline-none focus:ring-2 focus:ring-primary/50
          `}
          whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
        >
          <motion.div
            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
            animate={{ x: isHighContrast ? 24 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          />
        </motion.button>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="animations" className="text-sm font-medium text-foreground">
          Enable Animations
        </label>
        <motion.button
          id="animations"
          onClick={toggleAnimations}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${animationsEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}
            focus:outline-none focus:ring-2 focus:ring-primary/50
          `}
          whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
        >
          <motion.div
            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
            animate={{ x: animationsEnabled ? 24 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          />
        </motion.button>
      </div>
    </div>
  );
}

// ============================================================================
// ENHANCED ANIMATION WRAPPER
// ============================================================================

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'emergency';
  delay?: number;
}

export function AnimatedWrapper({ 
  children, 
  className = '', 
  variant = 'fade', 
  delay = 0 
}: AnimatedWrapperProps) {
  const { animationsEnabled } = useEnhancedTheme();

  const variants = {
    fade: fadeVariants,
    slide: {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    },
    emergency: {
      hidden: { scale: 0.5, opacity: 0, y: -50 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', bounce: 0.4 }
      },
      exit: { scale: 0.5, opacity: 0, y: -50 }
    }
  };

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants[variant]}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export default EnhancedThemeProvider;