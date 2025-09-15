/**
 * Smart Tourist Safety System - Unified Theme System Exports
 * Central export point for all theme-related functionality
 */

// Core theme system
export * from './unified-theme-system';
export * from './unified-theme-provider';

// Theme components
export * from '../../components/theme/unified-theme-components';

// Re-export commonly used items with simpler names
export {
  UnifiedThemeProvider as ThemeProvider,
  useUnifiedTheme as useTheme,
  useThemeToggle,
  useEmergencyMode,
  useAccessibility,
  useThemeValue,
  useThemeClasses,
} from './unified-theme-provider';

export {
  UnifiedThemeToggle as ThemeToggle,
  UnifiedThemeSelector as ThemeSelector, 
  UnifiedEmergencyToggle as EmergencyToggle,
  UnifiedAccessibilityControls as AccessibilityControls,
  UnifiedThemePanel as ThemePanel,
} from '../../components/theme/unified-theme-components';

// Theme utilities
export {
  themeConfig,
  colorTokens,
  getSystemTheme,
  resolveTheme,
  getCSSVariables,
  applyThemeToDOM,
  applyEmergencyMode,
  getThemeScript,
  type ThemeMode,
  type ResolvedTheme,
  type EmergencySeverity,
} from './unified-theme-system';

// Legacy exports for backward compatibility (DEPRECATED - will be removed)
// Note: Some legacy files have been removed and consolidated into unified-theme-system
