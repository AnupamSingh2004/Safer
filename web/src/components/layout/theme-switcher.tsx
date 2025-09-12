"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Palette, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

interface ThemeOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Default light theme for daytime use',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Dark theme for low-light environments',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Adapts to your system preference',
  },
];

// ============================================================================
// THEME SWITCHER INTERFACES
// ============================================================================

interface ThemeSwitcherProps {
  variant?: 'default' | 'icon' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
  emergencyMode?: boolean;
}

// ============================================================================
// THEME SWITCHER COMPONENT
// ============================================================================

export function ThemeSwitcher({
  variant = 'default',
  size = 'default',
  showLabel = true,
  className,
  emergencyMode = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={cn('animate-pulse', className)}
        disabled
      >
        <div className="h-4 w-4 bg-gray-300 rounded" />
      </Button>
    );
  }

  const currentTheme = theme || 'system';
  const currentOption = themeOptions.find(
    option => option.value === currentTheme
  ) || themeOptions[0];

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size={size}
        className={cn(
          'relative',
          emergencyMode && 'border-red-500 bg-red-50 hover:bg-red-100',
          className
        )}
        onClick={() => {
          // Cycle through themes
          const currentIndex = themeOptions.findIndex(option => option.value === currentTheme);
          const nextIndex = (currentIndex + 1) % themeOptions.length;
          setTheme(themeOptions[nextIndex].value);
        }}
        title={`Current theme: ${currentOption.label}`}
      >
        <currentOption.icon className="h-4 w-4" />
        {emergencyMode && (
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>
    );
  }

  // Compact toggle variant
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'relative',
            emergencyMode && 'border-red-500 bg-red-50 hover:bg-red-100'
          )}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {showLabel && (
            <span className="ml-2 text-sm">
              {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
            </span>
          )}
        </Button>
        {emergencyMode && (
          <div className="flex items-center text-xs text-red-600 font-medium">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-1" />
            Emergency
          </div>
        )}
      </div>
    );
  }

  // Default variant with dropdown
  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size={size}
        className={cn(
          'relative',
          emergencyMode && 'border-red-500 bg-red-50 hover:bg-red-100'
        )}
        onClick={() => setShowMenu(!showMenu)}
      >
        <currentOption.icon className="h-4 w-4" />
        {showLabel && (
          <span className="ml-2">{currentOption.label}</span>
        )}
        {emergencyMode && (
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Custom Dropdown Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Theme Preferences</h3>
            </div>
            
            {/* Standard Themes */}
            <div className="py-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setShowMenu(false);
                  }}
                  className={cn(
                    'flex items-center space-x-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100',
                    currentTheme === option.value && 'bg-blue-50 text-blue-900'
                  )}
                >
                  <option.icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500">{option.description}</div>
                    )}
                  </div>
                  {currentTheme === option.value && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {emergencyMode && (
              <>
                <div className="border-t border-gray-200" />
                <div className="p-3">
                  <div className="flex items-center space-x-2 text-red-600">
                    <Palette className="h-4 w-4" />
                    <span className="text-sm font-medium">Emergency Mode Active</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED THEME SWITCHER
// ============================================================================

interface AdvancedThemeSwitcherProps {
  showPreview?: boolean;
  showScheduler?: boolean;
  allowCustomColors?: boolean;
  className?: string;
}

function AdvancedThemeSwitcher({
  showPreview = false,
  showScheduler = false,
  allowCustomColors = false,
  className,
}: AdvancedThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [autoMode, setAutoMode] = React.useState(false);
  const [customColor, setCustomColor] = React.useState('#3b82f6');

  return (
    <div className={cn('space-y-4 p-4 border rounded-lg', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Theme Settings</h3>
        <ThemeSwitcher variant="icon" />
      </div>

      {/* Theme Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Theme Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'flex flex-col items-center space-y-2 p-3 border rounded-lg transition-all',
                theme === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <option.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Auto Mode Toggle */}
      {showScheduler && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto Theme Switching</label>
            <button
              onClick={() => setAutoMode(!autoMode)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoMode ? 'bg-blue-600' : 'bg-gray-200'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  autoMode ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
          {autoMode && (
            <p className="text-xs text-gray-500">
              Automatically switches between light and dark themes based on time of day
            </p>
          )}
        </div>
      )}

      {/* Custom Colors */}
      {allowCustomColors && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Accent Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">{customColor}</span>
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Preview</label>
          <div className="p-4 border rounded-lg bg-background">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Sample Dashboard</h4>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 bg-blue-100 rounded"></div>
              <div className="h-12 bg-gray-100 rounded"></div>
              <div className="h-12 bg-green-100 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EMERGENCY THEME CONTROLLER
// ============================================================================

interface EmergencyThemeControllerProps {
  isEmergency?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  onEmergencyModeChange?: (enabled: boolean) => void;
  className?: string;
}

function EmergencyThemeController({
  isEmergency = false,
  severity = 'medium',
  onEmergencyModeChange,
  className,
}: EmergencyThemeControllerProps) {
  const { setTheme } = useTheme();
  const [emergencyActive, setEmergencyActive] = React.useState(isEmergency);

  const handleEmergencyToggle = React.useCallback(() => {
    const newState = !emergencyActive;
    setEmergencyActive(newState);
    
    if (newState) {
      // Switch to high contrast for emergency situations
      setTheme('light'); // Use light theme for better visibility in emergencies
    } else {
      // Return to system theme
      setTheme('system');
    }

    onEmergencyModeChange?.(newState);
  }, [emergencyActive, setTheme, onEmergencyModeChange]);

  React.useEffect(() => {
    setEmergencyActive(isEmergency);
  }, [isEmergency]);

  const severityColors = {
    low: 'bg-yellow-500',
    medium: 'bg-orange-500',
    high: 'bg-red-500',
    critical: 'bg-red-600',
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <button
        onClick={handleEmergencyToggle}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all',
          emergencyActive
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        )}
      >
        <div className={cn(
          'h-2 w-2 rounded-full',
          emergencyActive ? 'bg-white animate-pulse' : severityColors[severity]
        )} />
        <span className="text-sm">
          {emergencyActive ? 'Emergency Mode' : 'Normal Mode'}
        </span>
      </button>

      {emergencyActive && (
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <Settings className="h-4 w-4" />
          <span className="font-medium capitalize">{severity} Alert</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type ThemeSwitcherProps,
  type AdvancedThemeSwitcherProps,
  type EmergencyThemeControllerProps,
  AdvancedThemeSwitcher,
  EmergencyThemeController,
};