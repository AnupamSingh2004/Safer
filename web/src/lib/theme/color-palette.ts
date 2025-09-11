// web/src/lib/theme/color-palette.ts

// Export the main color palette with safety-focused blue-green theme
export const safetyColors = {
  primary: {
    light: '#0891b2',    // Cyan-600 (Professional blue)
    main: '#0e7490',     // Cyan-700 (Main brand)
    dark: '#155e75',     // Cyan-800 (Dark accent)
  },
  secondary: {
    light: '#4ade80',    // Green-400 (Safety indicator)
    main: '#22c55e',     // Green-500 (Success/Safe)
    dark: '#16a34a',     // Green-600 (Confirmed safe)
  },
  danger: {
    light: '#f87171',    // Red-400 (Alert light)
    main: '#ef4444',     // Red-500 (Alert/Emergency)
    dark: '#dc2626',     // Red-600 (Critical)
  },
  warning: {
    light: '#fbbf24',    // Yellow-400 (Caution light)
    main: '#f59e0b',     // Yellow-500 (Warning)
    dark: '#d97706',     // Yellow-600 (Important warning)
  },
  neutral: {
    light: '#f1f5f9',    // Slate-100 (Background light)
    main: '#64748b',     // Slate-500 (Text secondary)
    dark: '#334155',     // Slate-700 (Text primary)
  }
} as const;

// Status colors for different alert types
export const alertColors = {
  emergency: '#dc2626',      // Red-600
  missing: '#f59e0b',        // Yellow-500
  medical: '#ef4444',        // Red-500
  security: '#f97316',       // Orange-500
  geofence: '#8b5cf6',       // Violet-500
  anomaly: '#06b6d4',        // Cyan-500
  panic: '#dc2626',          // Red-600
  system: '#64748b',         // Slate-500
} as const;

// Zone risk level colors
export const zoneColors = {
  safe: '#22c55e',           // Green-500
  lowRisk: '#0891b2',        // Cyan-600
  moderateRisk: '#f59e0b',   // Yellow-500
  highRisk: '#ef4444',       // Red-500
  restricted: '#7c2d12',     // Red-900
} as const;

// Function to get color by theme mode
export const getStatusColor = (status: string, mode: 'light' | 'dark' = 'light') => {
  const colorMap: Record<string, { light: string; dark: string }> = {
    success: { light: '#22c55e', dark: '#4ade80' },
    warning: { light: '#f59e0b', dark: '#fbbf24' },
    danger: { light: '#ef4444', dark: '#f87171' },
    info: { light: '#0891b2', dark: '#22d3ee' },
    neutral: { light: '#64748b', dark: '#94a3b8' },
  };
  
  return colorMap[status]?.[mode] || colorMap.neutral[mode];
};