/**
 * Smart Tourist Safety System - Enhanced Theme Hook
 * Extended theme hook with emergency mode and additional features
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTheme as useBaseTheme } from '@/lib/theme/theme-provider';
import { triggerEmergencyMode } from '@/lib/theme/theme-provider';

// ============================================================================
// TYPES
// ============================================================================

interface EmergencyModeState {
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message?: string;
}

interface EnhancedThemeState {
  theme: string;
  resolvedTheme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  systemTheme: string;
  isTransitioning: boolean;
  emergencyMode: boolean;
  emergencyState: EmergencyModeState;
  toggleEmergencyMode: () => void;
  setEmergencyMode: (enabled: boolean, severity?: EmergencyModeState['severity']) => void;
}

// ============================================================================
// ENHANCED THEME HOOK
// ============================================================================

export function useEnhancedTheme(): EnhancedThemeState {
  const baseTheme = useBaseTheme();
  const [emergencyState, setEmergencyState] = useState<EmergencyModeState>({
    enabled: false,
    severity: 'medium',
  });

  // Toggle emergency mode
  const toggleEmergencyMode = useCallback(() => {
    const newEnabled = !emergencyState.enabled;
    setEmergencyState(prev => ({
      ...prev,
      enabled: newEnabled,
    }));
    
    // Trigger the global emergency mode
    triggerEmergencyMode(newEnabled);
    
    // If enabling emergency mode, switch to light theme for better visibility
    if (newEnabled) {
      baseTheme.setTheme('light');
    }
  }, [emergencyState.enabled, baseTheme]);

  // Set emergency mode with severity
  const setEmergencyMode = useCallback((enabled: boolean, severity: EmergencyModeState['severity'] = 'medium') => {
    setEmergencyState({
      enabled,
      severity,
      message: enabled ? `Emergency alert - ${severity} level` : undefined,
    });
    
    triggerEmergencyMode(enabled);
    
    if (enabled) {
      baseTheme.setTheme('light');
    }
  }, [baseTheme]);

  // Listen for emergency mode events
  useEffect(() => {
    const handleEmergencyEvent = (event: CustomEvent) => {
      setEmergencyState(prev => ({
        ...prev,
        enabled: event.detail.enabled,
      }));
    };

    window.addEventListener('emergency-mode-toggle', handleEmergencyEvent as EventListener);
    
    return () => {
      window.removeEventListener('emergency-mode-toggle', handleEmergencyEvent as EventListener);
    };
  }, []);

  return {
    ...baseTheme,
    emergencyMode: emergencyState.enabled,
    emergencyState,
    toggleEmergencyMode,
    setEmergencyMode,
  };
}

export default useEnhancedTheme;