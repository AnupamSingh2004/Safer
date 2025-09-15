/**
 * Smart Tourist Safety System - Enhanced Theme Switcher Component
 * Advanced theme toggle with smooth animations and accessibility compliance
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Shield, 
  Eye, 
  Settings,
  Check,
  ChevronDown
} from 'lucide-react';
import { useEnhancedTheme } from '@/components/providers/enhanced-theme-provider';
import { useMediaQuery } from '@/hooks/use-media-query';

// ============================================================================
// THEME OPTIONS CONFIGURATION
// ============================================================================

interface ThemeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  value: 'light' | 'dark' | 'system' | 'high-contrast';
  shortcut?: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    label: 'Light',
    description: 'Clean and bright interface',
    icon: Sun,
    value: 'light',
    shortcut: '⌘1',
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Easy on the eyes in low light',
    icon: Moon,
    value: 'dark',
    shortcut: '⌘2',
  },
  {
    id: 'system',
    label: 'System',
    description: 'Follows your device settings',
    icon: Monitor,
    value: 'system',
    shortcut: '⌘3',
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    description: 'Enhanced accessibility mode',
    icon: Eye,
    value: 'high-contrast',
    shortcut: '⌘4',
  },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.6, 1],
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const iconRotationVariants: Variants = {
  light: { rotate: 0, scale: 1 },
  dark: { rotate: 180, scale: 1 },
  system: { rotate: 90, scale: 1 },
  'high-contrast': { rotate: 0, scale: 1.1 },
};

// ============================================================================
// THEME SWITCHER BUTTON
// ============================================================================

interface ThemeSwitcherButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating';
  showLabel?: boolean;
  className?: string;
}

export function ThemeSwitcherButton({
  size = 'md',
  variant = 'default',
  showLabel = false,
  className = '',
}: ThemeSwitcherButtonProps) {
  const { theme, setTheme, emergencyMode, animationsEnabled } = useEnhancedTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(theme);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;

  // Get current theme option
  const currentOption = themeOptions.find(option => option.value === theme) || themeOptions[0];
  const CurrentIcon = currentOption.icon;

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeOption['value']) => {
    setSelectedTheme(newTheme);
    
    // Only pass valid ThemeMode values to setTheme
    if (newTheme !== 'system') {
      setTheme(newTheme as 'light' | 'dark' | 'high-contrast');
    }
    
    setIsOpen(false);
    
    // Announce theme change for screen readers
    const announcement = `Theme changed to ${newTheme}`;
    const announceElement = document.getElementById('announcements');
    if (announceElement) {
      announceElement.textContent = announcement;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            handleThemeChange('light');
            break;
          case '2':
            event.preventDefault();
            handleThemeChange('dark');
            break;
          case '3':
            event.preventDefault();
            handleThemeChange('system');
            break;
          case '4':
            event.preventDefault();
            handleThemeChange('high-contrast');
            break;
        }
      }
      
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Size classes
  const getSizeClasses = () => {
    const sizes = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
    };
    return sizes[size];
  };

  // Variant classes
  const getVariantClasses = () => {
    const variants = {
      default: `
        bg-background border border-border hover:bg-accent
        shadow-sm hover:shadow-md transition-all duration-200
      `,
      minimal: `
        bg-transparent hover:bg-accent/50 border-0
        transition-colors duration-200
      `,
      floating: `
        bg-background/80 backdrop-blur-md border border-border/50
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:bg-background/90
      `,
    };
    return variants[variant];
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Toggle Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${emergencyMode ? 'ring-2 ring-emergency-500/50' : ''}
          ${showLabel ? 'px-4 w-auto' : ''}
          rounded-lg flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-primary-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          relative overflow-hidden
        `}
        whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.1 }}
        aria-label={`Current theme: ${currentOption.label}. Click to change theme.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Background glow effect for emergency mode */}
        {emergencyMode && (
          <motion.div
            className="absolute inset-0 bg-emergency-500/10 rounded-lg"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Theme Icon */}
        <motion.div
          variants={shouldAnimate ? iconRotationVariants : undefined}
          animate={theme}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10"
        >
          <CurrentIcon
            size={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
            className={`
              ${emergencyMode ? 'text-emergency-600' : 'text-foreground'}
              drop-shadow-sm
            `}
          />
        </motion.div>

        {/* Label */}
        {showLabel && (
          <span className="text-sm font-medium text-foreground">
            {currentOption.label}
          </span>
        )}

        {/* Dropdown Arrow */}
        {variant !== 'minimal' && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-1"
          >
            <ChevronDown size={14} className="text-muted-foreground" />
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            variants={shouldAnimate ? dropdownVariants : undefined}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`
              absolute top-full mt-2 right-0 z-50
              min-w-[280px] p-2 rounded-xl
              bg-background/95 backdrop-blur-md
              border border-border shadow-lg
              focus:outline-none
            `}
            role="listbox"
            aria-label="Theme options"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-border mb-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings size={16} />
                Theme Settings
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose your preferred appearance
              </p>
            </div>

            {/* Theme Options */}
            <div className="space-y-1" role="group" aria-label="Theme options">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedTheme === option.value;
                const isCurrent = theme === option.value;

                return (
                  <motion.button
                    key={option.id}
                    variants={shouldAnimate ? itemVariants : undefined}
                    onClick={() => handleThemeChange(option.value)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-left transition-colors duration-150
                      ${isSelected || isCurrent 
                        ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                        : 'hover:bg-accent text-foreground'
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50
                    `}
                    role="option"
                    aria-selected={isCurrent}
                    tabIndex={0}
                  >
                    {/* Icon */}
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${isSelected || isCurrent 
                        ? 'bg-primary-100 text-primary-600' 
                        : 'bg-accent text-muted-foreground'
                      }
                    `}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        {isCurrent && (
                          <Check size={14} className="text-primary-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>

                    {/* Keyboard Shortcut */}
                    {option.shortcut && (
                      <span className="text-xs text-muted-foreground font-mono bg-accent px-1.5 py-0.5 rounded">
                        {option.shortcut}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Emergency Mode Toggle */}
            {emergencyMode && (
              <>
                <div className="border-t border-border my-2" />
                <div className="px-3 py-2 bg-emergency-50/50 rounded-lg border border-emergency-200/50">
                  <div className="flex items-center gap-2 text-emergency-700">
                    <Shield size={14} />
                    <span className="text-xs font-medium">Emergency Mode Active</span>
                  </div>
                  <p className="text-xs text-emergency-600 mt-1">
                    Enhanced visibility and accessibility features enabled
                  </p>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="border-t border-border mt-2 pt-2">
              <p className="text-xs text-muted-foreground text-center">
                Use ⌘1-4 for quick theme switching
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPACT THEME SWITCHER
// ============================================================================

interface CompactThemeSwitcherProps {
  className?: string;
}

export function CompactThemeSwitcher({ className = '' }: CompactThemeSwitcherProps) {
  const { theme, setTheme } = useEnhancedTheme();
  
  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'high-contrast'> = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme as any);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const currentOption = themeOptions.find(option => option.value === theme) || themeOptions[0];
  const CurrentIcon = currentOption.icon;

  return (
    <motion.button
      onClick={cycleTheme}
      className={`
        h-9 w-9 rounded-lg flex items-center justify-center
        bg-background border border-border
        hover:bg-accent transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500/50
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      aria-label={`Current theme: ${currentOption.label}. Click to cycle themes.`}
    >
      <CurrentIcon size={16} className="text-foreground" />
    </motion.button>
  );
}

// ============================================================================
// FLOATING THEME SWITCHER
// ============================================================================

interface FloatingThemeSwitcherProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function FloatingThemeSwitcher({
  position = 'bottom-right',
  className = '',
}: FloatingThemeSwitcherProps) {
  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };
    return positions[position];
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-40 ${className}`}>
      <ThemeSwitcherButton
        size="lg"
        variant="floating"
        aria-label="Theme switcher"
      />
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { themeOptions };
export default ThemeSwitcherButton;