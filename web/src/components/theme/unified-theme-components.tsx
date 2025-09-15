/**
 * Smart Tourist Safety System - Unified Theme Components
 * Complete set of theme toggle and control components
 */

'use client';

import React, { useState } from 'react';
import { Moon, Sun, Monitor, Palette, Settings2, Accessibility, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useUnifiedTheme, 
  useThemeToggle, 
  useEmergencyMode, 
  useAccessibility 
} from '@/lib/theme/unified-theme-provider';
import { 
  type ThemeMode,
  type EmergencySeverity 
} from '@/lib/theme/unified-theme-system';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// THEME TOGGLE BUTTON
// ============================================================================

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ 
  variant = 'icon', 
  size = 'md', 
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, toggleTheme, isLoaded } = useThemeToggle();
  const { animationsEnabled } = useUnifiedTheme();

  // Map our size prop to Button's size prop
  const buttonSize = size === 'md' ? 'default' : size;

  if (!isLoaded) {
    return (
      <Button variant="ghost" size={buttonSize} className={cn('animate-pulse', className)} disabled>
        <div className="h-4 w-4 bg-gray-300 rounded" />
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return Sun;
      case 'light':
        return Moon;
      case 'system':
        return Monitor;
      case 'high-contrast':
        return Accessibility;
      default:
        return Sun;
    }
  };

  const Icon = getIcon();
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  // Ensure proper icon colors for theme transitions
  const iconColorClass = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200';

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
          className
        )}
        whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
        title={`Switch theme (current: ${theme})`}
      >
        <Icon className={cn(sizeClasses[size], iconColorClass)} />
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={buttonSize}
        onClick={toggleTheme}
        className={cn('gap-2', className)}
      >
        <Icon className={cn(sizeClasses[size], iconColorClass)} />
        {showLabel && (
          <span className="capitalize">
            {theme === 'system' ? 'Auto' : theme}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={buttonSize}
      onClick={toggleTheme}
      className={cn('p-2', className)}
      title={`Switch theme (current: ${theme})`}
    >
      <Icon className={cn(sizeClasses[size], iconColorClass)} />
      {showLabel && (
        <span className="ml-2 capitalize">
          {theme === 'system' ? 'Auto' : theme}
        </span>
      )}
    </Button>
  );
}

// ============================================================================
// THEME SELECTOR DROPDOWN
// ============================================================================

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'grid' | 'list';
  showDescriptions?: boolean;
  className?: string;
}

export function ThemeSelector({ 
  variant = 'dropdown', 
  showDescriptions = true,
  className 
}: ThemeSelectorProps) {
  const { theme, setTheme, isLoaded } = useUnifiedTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Ensure proper icon colors for theme transitions
  const iconColorClass = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200';

  const themeOptions = [
    {
      value: 'light' as ThemeMode,
      label: 'Light',
      icon: Sun,
      description: 'Clean light theme for daytime use',
    },
    {
      value: 'dark' as ThemeMode,
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes for low-light environments',
    },
    {
      value: 'system' as ThemeMode,
      label: 'Auto',
      icon: Monitor,
      description: 'Adapts to your system preference',
    },
    {
      value: 'high-contrast' as ThemeMode,
      label: 'High Contrast',
      icon: Accessibility,
      description: 'Maximum contrast for better accessibility',
    },
  ];

  if (!isLoaded) {
    return <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />;
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.value;
          
          return (
            <motion.button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn('h-5 w-5', iconColorClass)} />
              <span className="text-sm font-medium">{option.label}</span>
              {showDescriptions && (
                <span className="text-xs text-gray-500 text-center">
                  {option.description}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-1', className)}>
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                isSelected
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Icon className={cn('h-4 w-4', iconColorClass)} />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                {showDescriptions && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
              {isSelected && (
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant
  const currentOption = themeOptions.find(opt => opt.value === theme) || themeOptions[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <CurrentIcon className={cn('h-4 w-4', iconColorClass)} />
        <span>{currentOption.label}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-medium">Theme Settings</h3>
              </div>
              <div className="p-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', iconColorClass)} />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {showDescriptions && (
                          <div className="text-sm text-gray-500">{option.description}</div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// EMERGENCY MODE TOGGLE
// ============================================================================

interface EmergencyToggleProps {
  variant?: 'button' | 'switch' | 'alert';
  showSeverity?: boolean;
  className?: string;
}

export function EmergencyToggle({ 
  variant = 'button', 
  showSeverity = true,
  className 
}: EmergencyToggleProps) {
  const { emergencyMode, emergencySeverity, setEmergencyMode, toggleEmergencyMode } = useEmergencyMode();
  const { animationsEnabled } = useUnifiedTheme();
  const [severityDropdownOpen, setSeverityDropdownOpen] = useState(false);
  
  // Ensure proper icon colors for theme transitions
  const iconColorClass = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200';

  const severityOptions: { value: EmergencySeverity; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-yellow-500' },
    { value: 'medium', label: 'Medium', color: 'bg-orange-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-600' },
  ];

  if (variant === 'switch') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={emergencyMode}
            onChange={toggleEmergencyMode}
            className="sr-only"
          />
          <div className={cn(
            'relative w-11 h-6 rounded-full transition-colors',
            emergencyMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
          )}>
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: emergencyMode ? 20 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <span className="text-sm font-medium">Emergency Mode</span>
        </label>
        {emergencyMode && showSeverity && (
          <div className="flex items-center gap-1">
            <div className={cn('h-2 w-2 rounded-full', severityOptions.find(s => s.value === emergencySeverity)?.color)} />
            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {emergencySeverity}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'alert') {
    return (
      <motion.div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-all',
          emergencyMode
            ? 'border-red-500 bg-red-50 dark:bg-red-950'
            : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900',
          className
        )}
        animate={emergencyMode && animationsEnabled ? {
          boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.4)',
            '0 0 0 8px rgba(239, 68, 68, 0)',
          ]
        } : undefined}
        transition={{
          duration: 2,
          repeat: emergencyMode ? Infinity : 0,
        }}
      >
        <AlertTriangle className={cn(
          'h-5 w-5',
          emergencyMode ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
        )} />
        <div className="flex-1">
          <div className="font-medium">
            {emergencyMode ? 'Emergency Mode Active' : 'Emergency Mode'}
          </div>
          {emergencyMode && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Alert level: <span className="capitalize font-medium">{emergencySeverity}</span>
            </div>
          )}
        </div>
        <Button
          variant={emergencyMode ? 'destructive' : 'outline'}
          size="sm"
          onClick={toggleEmergencyMode}
        >
          {emergencyMode ? 'Deactivate' : 'Activate'}
        </Button>
      </motion.div>
    );
  }

  // Button variant
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.button
        onClick={toggleEmergencyMode}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          emergencyMode
            ? 'bg-red-600 text-white shadow-lg'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
        )}
        whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
        animate={emergencyMode && animationsEnabled ? {
          boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.7)',
            '0 0 0 10px rgba(239, 68, 68, 0)',
          ]
        } : undefined}
        transition={{
          duration: 1.5,
          repeat: emergencyMode ? Infinity : 0,
        }}
      >
        <Zap className={cn('h-4 w-4', iconColorClass)} />
        <span>{emergencyMode ? 'Emergency Active' : 'Normal Mode'}</span>
      </motion.button>

      {showSeverity && (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSeverityDropdownOpen(!severityDropdownOpen)}
            className="gap-1"
          >
            <div className={cn(
              'h-2 w-2 rounded-full',
              severityOptions.find(s => s.value === emergencySeverity)?.color
            )} />
            <span className="capitalize">{emergencySeverity}</span>
          </Button>

          <AnimatePresence>
            {severityDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setSeverityDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
                >
                  <div className="p-2">
                    {severityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setEmergencyMode(emergencyMode, option.value);
                          setSeverityDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-2 p-2 rounded text-left hover:bg-gray-100 dark:hover:bg-gray-800',
                          emergencySeverity === option.value && 'bg-gray-100 dark:bg-gray-800'
                        )}
                      >
                        <div className={cn('h-2 w-2 rounded-full', option.color)} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ACCESSIBILITY CONTROLS
// ============================================================================

export function AccessibilityControls({ className }: { className?: string }) {
  const { 
    prefersReducedMotion,
    prefersHighContrast,
    highContrastMode,
    setHighContrastMode,
    animationsEnabled,
    setAnimationsEnabled,
  } = useAccessibility();
  
  // Ensure proper icon colors for theme transitions
  const iconColorClass = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200';

  return (
    <div className={cn('space-y-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg', className)}>
      <div className="flex items-center gap-2">
        <Accessibility className={cn('h-5 w-5', iconColorClass)} />
        <h3 className="font-medium">Accessibility</h3>
      </div>

      <div className="space-y-3">
        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">High Contrast Mode</label>
            <p className="text-xs text-gray-500">Enhanced contrast for better readability</p>
          </div>
          <button
            onClick={() => setHighContrastMode(!highContrastMode)}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors',
              highContrastMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            )}
          >
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: highContrastMode ? 20 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>

        {/* Animations Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Enable Animations</label>
            <p className="text-xs text-gray-500">
              {prefersReducedMotion ? 'System prefers reduced motion' : 'Smooth transitions and effects'}
            </p>
          </div>
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors',
              animationsEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            )}
          >
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: animationsEnabled ? 20 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>

        {/* System Preferences Info */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-medium mb-2">System Preferences</h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div>Reduced Motion: {prefersReducedMotion ? 'Enabled' : 'Disabled'}</div>
            <div>High Contrast: {prefersHighContrast ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLETE THEME PANEL
// ============================================================================

interface ThemePanelProps {
  showEmergencyMode?: boolean;
  showAccessibility?: boolean;
  className?: string;
}

export function ThemePanel({ 
  showEmergencyMode = true, 
  showAccessibility = true, 
  className 
}: ThemePanelProps) {
  // Ensure proper icon colors for theme transitions
  const iconColorClass = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200';
  
  return (
    <div className={cn('space-y-6 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg', className)}>
      <div className="flex items-center gap-2">
        <Palette className={cn('h-5 w-5', iconColorClass)} />
        <h2 className="text-lg font-semibold">Theme & Display</h2>
      </div>

      {/* Theme Selection */}
      <div>
        <h3 className="text-sm font-medium mb-3">Theme Mode</h3>
        <ThemeSelector variant="grid" />
      </div>

      {/* Emergency Mode */}
      {showEmergencyMode && (
        <div>
          <h3 className="text-sm font-medium mb-3">Emergency Mode</h3>
          <EmergencyToggle variant="alert" />
        </div>
      )}

      {/* Accessibility */}
      {showAccessibility && (
        <AccessibilityControls />
      )}
    </div>
  );
}

// Export all components
export {
  ThemeToggle as UnifiedThemeToggle,
  ThemeSelector as UnifiedThemeSelector,
  EmergencyToggle as UnifiedEmergencyToggle,
  AccessibilityControls as UnifiedAccessibilityControls,
  ThemePanel as UnifiedThemePanel,
};