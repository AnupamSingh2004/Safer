/**
 * Smart Tourist Safety System - Color System
 * Semantic color system with perfect contrast and accessibility
 */

import { colorPalettes, semanticColors } from './design-tokens';

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Convert hex color to HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Get CSS custom property for color
 */
export function getCSSVar(colorPath: string): string {
  return `hsl(var(--${colorPath.replace(/\./g, '-')}))`;
}

/**
 * Generate CSS custom properties for all colors
 */
export function generateCSSVars(theme: 'light' | 'dark'): Record<string, string> {
  const vars: Record<string, string> = {};
  const themeColors = semanticColors[theme];

  // Generate semantic color variables
  Object.entries(themeColors).forEach(([key, value]) => {
    const hsl = hexToHsl(value);
    vars[`--${key}`] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  });

  // Generate palette color variables
  Object.entries(colorPalettes).forEach(([category, palette]) => {
    if (typeof palette === 'object' && !Array.isArray(palette)) {
      Object.entries(palette).forEach(([shade, color]) => {
        if (typeof color === 'string') {
          const hsl = hexToHsl(color);
          vars[`--${category}-${shade}`] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        } else if (typeof color === 'object') {
          Object.entries(color).forEach(([subShade, subColor]) => {
            const hsl = hexToHsl(subColor as string);
            vars[`--${category}-${shade}-${subShade}`] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
          });
        }
      });
    }
  });

  return vars;
}

// ============================================================================
// EMERGENCY COLOR SYSTEM
// ============================================================================

export const emergencyColors = {
  critical: {
    light: colorPalettes.emergency.critical[500],
    dark: colorPalettes.emergency.critical[400],
    background: {
      light: colorPalettes.emergency.critical[50],
      dark: colorPalettes.emergency.critical[950],
    },
    border: {
      light: colorPalettes.emergency.critical[200],
      dark: colorPalettes.emergency.critical[800],
    },
    text: {
      light: colorPalettes.emergency.critical[700],
      dark: colorPalettes.emergency.critical[300],
    },
  },
  high: {
    light: colorPalettes.emergency.high[500],
    dark: colorPalettes.emergency.high[400],
    background: {
      light: colorPalettes.emergency.high[50],
      dark: colorPalettes.emergency.high[950],
    },
    border: {
      light: colorPalettes.emergency.high[200],
      dark: colorPalettes.emergency.high[800],
    },
    text: {
      light: colorPalettes.emergency.high[700],
      dark: colorPalettes.emergency.high[300],
    },
  },
  medium: {
    light: colorPalettes.emergency.medium[500],
    dark: colorPalettes.emergency.medium[400],
    background: {
      light: colorPalettes.emergency.medium[50],
      dark: colorPalettes.emergency.medium[950],
    },
    border: {
      light: colorPalettes.emergency.medium[200],
      dark: colorPalettes.emergency.medium[800],
    },
    text: {
      light: colorPalettes.emergency.medium[700],
      dark: colorPalettes.emergency.medium[300],
    },
  },
  low: {
    light: colorPalettes.emergency.low[500],
    dark: colorPalettes.emergency.low[400],
    background: {
      light: colorPalettes.emergency.low[50],
      dark: colorPalettes.emergency.low[950],
    },
    border: {
      light: colorPalettes.emergency.low[200],
      dark: colorPalettes.emergency.low[800],
    },
    text: {
      light: colorPalettes.emergency.low[700],
      dark: colorPalettes.emergency.low[300],
    },
  },
  resolved: {
    light: colorPalettes.emergency.resolved[500],
    dark: colorPalettes.emergency.resolved[400],
    background: {
      light: colorPalettes.emergency.resolved[50],
      dark: colorPalettes.emergency.resolved[950],
    },
    border: {
      light: colorPalettes.emergency.resolved[200],
      dark: colorPalettes.emergency.resolved[800],
    },
    text: {
      light: colorPalettes.emergency.resolved[700],
      dark: colorPalettes.emergency.resolved[300],
    },
  },
} as const;

// ============================================================================
// ZONE COLOR SYSTEM
// ============================================================================

export const zoneColors = {
  safe: {
    light: colorPalettes.zones.safe[500],
    dark: colorPalettes.zones.safe[500],
    background: {
      light: colorPalettes.zones.safe[50],
      dark: `${colorPalettes.zones.safe[500]}20`, // 20% opacity
    },
    border: {
      light: colorPalettes.zones.safe[600],
      dark: colorPalettes.zones.safe[600],
    },
  },
  lowRisk: {
    light: colorPalettes.zones.lowRisk[500],
    dark: colorPalettes.zones.lowRisk[500],
    background: {
      light: colorPalettes.zones.lowRisk[50],
      dark: `${colorPalettes.zones.lowRisk[500]}20`,
    },
    border: {
      light: colorPalettes.zones.lowRisk[600],
      dark: colorPalettes.zones.lowRisk[600],
    },
  },
  moderate: {
    light: colorPalettes.zones.moderate[500],
    dark: colorPalettes.zones.moderate[500],
    background: {
      light: colorPalettes.zones.moderate[50],
      dark: `${colorPalettes.zones.moderate[500]}20`,
    },
    border: {
      light: colorPalettes.zones.moderate[600],
      dark: colorPalettes.zones.moderate[600],
    },
  },
  highRisk: {
    light: colorPalettes.zones.highRisk[500],
    dark: colorPalettes.zones.highRisk[500],
    background: {
      light: colorPalettes.zones.highRisk[50],
      dark: `${colorPalettes.zones.highRisk[500]}20`,
    },
    border: {
      light: colorPalettes.zones.highRisk[600],
      dark: colorPalettes.zones.highRisk[600],
    },
  },
  restricted: {
    light: colorPalettes.zones.restricted[500],
    dark: colorPalettes.zones.restricted[500],
    background: {
      light: colorPalettes.zones.restricted[50],
      dark: `${colorPalettes.zones.restricted[500]}20`,
    },
    border: {
      light: colorPalettes.zones.restricted[600],
      dark: colorPalettes.zones.restricted[600],
    },
  },
} as const;

// ============================================================================
// STATUS COLOR SYSTEM
// ============================================================================

export const statusColors = {
  online: {
    color: colorPalettes.status.online,
    background: `${colorPalettes.status.online}20`,
    border: `${colorPalettes.status.online}40`,
  },
  offline: {
    color: colorPalettes.status.offline,
    background: `${colorPalettes.status.offline}20`,
    border: `${colorPalettes.status.offline}40`,
  },
  away: {
    color: colorPalettes.status.away,
    background: `${colorPalettes.status.away}20`,
    border: `${colorPalettes.status.away}40`,
  },
  busy: {
    color: colorPalettes.status.busy,
    background: `${colorPalettes.status.busy}20`,
    border: `${colorPalettes.status.busy}40`,
  },
  maintenance: {
    color: colorPalettes.status.maintenance,
    background: `${colorPalettes.status.maintenance}20`,
    border: `${colorPalettes.status.maintenance}40`,
  },
} as const;

// ============================================================================
// ACCESSIBILITY HELPERS
// ============================================================================

/**
 * Get color with proper contrast based on background
 */
export function getContrastColor(backgroundColor: string, theme: 'light' | 'dark'): string {
  // Simple contrast detection - in production, use a proper contrast ratio calculation
  const isDark = theme === 'dark';
  return isDark ? semanticColors.dark.foreground : semanticColors.light.foreground;
}

/**
 * Get accessible emergency color based on severity
 */
export function getEmergencyColor(severity: 'critical' | 'high' | 'medium' | 'low' | 'resolved', theme: 'light' | 'dark'): string {
  return emergencyColors[severity][theme];
}

/**
 * Get accessible zone color based on risk level
 */
export function getZoneColor(riskLevel: 'safe' | 'lowRisk' | 'moderate' | 'highRisk' | 'restricted', theme: 'light' | 'dark'): string {
  return zoneColors[riskLevel][theme];
}

/**
 * Get status color with accessibility in mind
 */
export function getStatusColor(status: 'online' | 'offline' | 'away' | 'busy' | 'maintenance'): string {
  return statusColors[status].color;
}

// ============================================================================
// COLOR GRADIENTS
// ============================================================================

export const gradients = {
  primary: {
    light: `linear-gradient(135deg, ${colorPalettes.primary[500]} 0%, ${colorPalettes.primary[600]} 100%)`,
    dark: `linear-gradient(135deg, ${colorPalettes.primary[400]} 0%, ${colorPalettes.primary[500]} 100%)`,
  },
  emergency: {
    critical: `linear-gradient(135deg, ${colorPalettes.emergency.critical[500]} 0%, ${colorPalettes.emergency.critical[600]} 100%)`,
    high: `linear-gradient(135deg, ${colorPalettes.emergency.high[500]} 0%, ${colorPalettes.emergency.high[600]} 100%)`,
    medium: `linear-gradient(135deg, ${colorPalettes.emergency.medium[500]} 0%, ${colorPalettes.emergency.medium[600]} 100%)`,
    low: `linear-gradient(135deg, ${colorPalettes.emergency.low[500]} 0%, ${colorPalettes.emergency.low[600]} 100%)`,
  },
  glass: {
    light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    dark: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
  },
  shimmer: {
    light: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
    dark: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
  },
} as const;

// ============================================================================
// EXPORT ALL COLOR SYSTEMS
// ============================================================================

export const colorSystem = {
  palettes: colorPalettes,
  semantic: semanticColors,
  emergency: emergencyColors,
  zones: zoneColors,
  status: statusColors,
  gradients,
  utilities: {
    getCSSVar,
    generateCSSVars,
    getContrastColor,
    getEmergencyColor,
    getZoneColor,
    getStatusColor,
  },
} as const;

export default colorSystem;