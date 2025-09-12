/**
 * Smart Tourist Safety System - UI Components Index
 * Centralized exports for all UI components with comprehensive TypeScript support
 */

// ============================================================================
// CORE UI COMPONENTS
// ============================================================================

// Button Components
export {
  Button,
  ButtonGroup,
  EmergencyButton,
  ActionButton,
  IconButton,
} from './button';

export type {
  ButtonProps,
  ButtonGroupProps,
  EmergencyButtonProps,
  ActionButtonProps,
  IconButtonProps,
} from './button';

// Card Components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  TouristCard,
  AlertCard,
  StatsCard,
} from './card';

export type {
  TouristCardProps,
  AlertCardProps,
  StatsCardProps,
} from './card';

// Input Components
export {
  Input,
  SearchInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
} from './input';

export type {
  InputProps,
  SearchInputProps,
  EmailInputProps,
  PasswordInputProps,
  PhoneInputProps,
} from './input';

// Label Components
export {
  Label,
  FieldLabel,
  EmergencyLabel,
  SectionLabel,
  StatusLabel,
  BadgeLabel,
  FormGroupLabel,
  labelVariants,
  useLabelAccessibility,
} from './label';

export type {
  LabelProps,
  FieldLabelProps,
  EmergencyLabelProps,
  SectionLabelProps,
  StatusLabelProps,
  BadgeLabelProps,
  FormGroupLabelProps,
} from './label';

// ============================================================================
// UI COMPONENT COLLECTIONS
// ============================================================================

import {
  Input,
  SearchInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
} from './input';

import {
  Label,
  FieldLabel,
  FormGroupLabel,
} from './label';

import {
  Button,
  EmergencyButton,
  ActionButton,
} from './button';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  TouristCard,
  AlertCard,
  StatsCard,
} from './card';

import {
  StatusLabel,
  BadgeLabel,
  EmergencyLabel,
} from './label';

import { ButtonGroup } from './button';
import { SectionLabel } from './label';

// Form Controls Collection
export const FormControls = {
  Input,
  SearchInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
  Label,
  FieldLabel,
  FormGroupLabel,
  Button,
  EmergencyButton,
};

// Data Display Collection
export const DataDisplay = {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  TouristCard,
  AlertCard,
  StatsCard,
  StatusLabel,
  BadgeLabel,
};

// Emergency Components Collection
export const EmergencyComponents = {
  EmergencyButton,
  EmergencyLabel,
  AlertCard,
};

// Layout Components Collection (when available)
export const LayoutComponents = {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  ButtonGroup,
  SectionLabel,
};

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

// Re-export commonly used utilities
export { cn } from '@/lib/utils';

// Component variant helpers
export const ComponentVariants = {
  button: {
    primary: 'default',
    secondary: 'outline',
    success: 'success',
    warning: 'warning',
    danger: 'destructive',
    emergency: 'emergency',
    ghost: 'ghost',
    link: 'link',
  },
  input: {
    default: 'default',
    outline: 'outline',
    filled: 'filled',
  },
  label: {
    default: 'default',
    required: 'required',
    optional: 'optional',
    error: 'error',
    success: 'success',
    warning: 'warning',
    emergency: 'emergency',
  },
  card: {
    default: '',
    elevated: 'shadow-lg',
    outlined: 'border-2',
    filled: 'bg-gray-50',
  },
};

// Component size helpers
export const ComponentSizes = {
  button: {
    small: 'sm',
    medium: 'default',
    large: 'lg',
    extraLarge: 'xl',
    icon: 'icon',
  },
  input: {
    small: 'sm',
    medium: 'default',
    large: 'lg',
  },
  label: {
    small: 'sm',
    medium: 'default',
    large: 'lg',
  },
};

// ============================================================================
// EMERGENCY FOCUSED PRESETS
// ============================================================================

// Emergency Alert Presets
export const EmergencyPresets = {
  criticalAlert: {
    button: { variant: 'emergency', size: 'lg' },
    label: { variant: 'emergency', weight: 'bold' },
    card: { className: 'border-red-500 bg-red-50' },
  },
  warningAlert: {
    button: { variant: 'warning', size: 'default' },
    label: { variant: 'warning', weight: 'semibold' },
    card: { className: 'border-orange-500 bg-orange-50' },
  },
  successStatus: {
    button: { variant: 'success', size: 'default' },
    label: { variant: 'success', weight: 'medium' },
    card: { className: 'border-green-500 bg-green-50' },
  },
  infoStatus: {
    button: { variant: 'outline', size: 'default' },
    label: { variant: 'default', weight: 'medium' },
    card: { className: 'border-blue-500 bg-blue-50' },
  },
};

// Tourist Safety Status Presets
export const SafetyStatusPresets = {
  safe: {
    color: '#22c55e',
    variant: 'success',
    icon: '✅',
    label: 'Safe',
  },
  atRisk: {
    color: '#f59e0b',
    variant: 'warning',
    icon: '⚠️',
    label: 'At Risk',
  },
  emergency: {
    color: '#ef4444',
    variant: 'emergency',
    icon: '🚨',
    label: 'Emergency',
  },
  offline: {
    color: '#6b7280',
    variant: 'default',
    icon: '📱',
    label: 'Offline',
  },
  unknown: {
    color: '#9ca3af',
    variant: 'default',
    icon: '❓',
    label: 'Unknown',
  },
};

// Zone Risk Level Presets
export const ZoneRiskPresets = {
  safe: {
    color: '#22c55e',
    bgColor: '#dcfce7',
    borderColor: '#bbf7d0',
    label: 'Safe Zone',
    description: 'Low risk area suitable for tourism',
  },
  lowRisk: {
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    label: 'Low Risk',
    description: 'Generally safe with basic precautions needed',
  },
  moderateRisk: {
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    label: 'Moderate Risk',
    description: 'Extra caution required, avoid night travel',
  },
  highRisk: {
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    label: 'High Risk',
    description: 'High risk area, travel with guide/group only',
  },
  restricted: {
    color: '#7c2d12',
    bgColor: '#fef2f2',
    borderColor: '#fee2e2',
    label: 'Restricted',
    description: 'Access restricted or forbidden',
  },
};

// ============================================================================
// ACCESSIBILITY HELPERS
// ============================================================================

// ARIA label helpers for emergency contexts
export const AccessibilityHelpers = {
  emergencyButton: (type: string) => ({
    'aria-label': `Emergency ${type} button`,
    'aria-describedby': `${type}-emergency-description`,
    role: 'button',
  }),
  
  alertCard: (severity: string, type: string) => ({
    'aria-label': `${severity} severity ${type} alert`,
    role: 'alert',
    'aria-live': severity === 'critical' ? 'assertive' : 'polite',
  }),
  
  touristCard: (name: string, status: string) => ({
    'aria-label': `Tourist ${name} with status ${status}`,
    role: 'article',
  }),
  
  statusIndicator: (status: string) => ({
    'aria-label': `Status: ${status}`,
    role: 'status',
  }),
};

// ============================================================================
// THEME INTEGRATION
// ============================================================================

// Component theme integration
export const ThemeIntegration = {
  getEmergencyColor: (type: 'critical' | 'warning' | 'info' | 'success') => {
    const colors = {
      critical: '#ef4444',
      warning: '#f59e0b', 
      info: '#3b82f6',
      success: '#22c55e',
    };
    return colors[type];
  },
  
  getSafetyScoreColor: (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  },
  
  getZoneRiskColor: (riskLevel: keyof typeof ZoneRiskPresets) => {
    return ZoneRiskPresets[riskLevel]?.color || '#6b7280';
  },
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

// Form validation helpers
export const ValidationHelpers = {
  required: (value: any) => !!value || 'This field is required',
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  },
  phone: (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) || 'Please enter a valid phone number';
  },
  minLength: (min: number) => (value: string) => {
    return value.length >= min || `Minimum ${min} characters required`;
  },
  coordinates: (lat: number, lng: number) => {
    return (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) || 'Invalid coordinates';
  },
};

// ============================================================================
// COMPONENT COMPOSITION HELPERS
// ============================================================================

// Commonly used component combinations
export const ComponentCombinations = {
  // Form field with label and input
  FormField: {
    components: [FieldLabel, Input],
    example: 'FieldLabel + Input for complete form field',
  },
  
  // Emergency alert with button
  EmergencyAlert: {
    components: [AlertCard, EmergencyButton],
    example: 'AlertCard + EmergencyButton for emergency response',
  },
  
  // Tourist info display
  TouristInfo: {
    components: [TouristCard, StatusLabel, ActionButton],
    example: 'TouristCard + StatusLabel + ActionButton for tourist management',
  },
  
  // Statistics dashboard
  StatsDashboard: {
    components: [StatsCard, Card, Button],
    example: 'StatsCard + Card + Button for analytics display',
  },
};

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * Smart Tourist Safety UI Components Summary:
 * 
 * Core Components:
 * - Button: 5 variants (Button, EmergencyButton, ActionButton, IconButton, ButtonGroup)
 * - Card: 6 variants (Card, TouristCard, AlertCard, StatsCard + base components)
 * - Input: 5 variants (Input, SearchInput, EmailInput, PasswordInput, PhoneInput)
 * - Label: 6 variants (Label, FieldLabel, EmergencyLabel, SectionLabel, StatusLabel, BadgeLabel)
 * 
 * Specialized Features:
 * - Emergency-focused styling and variants
 * - Tourist safety status indicators
 * - Zone risk level components
 * - Accessibility helpers and ARIA support
 * - Form validation helpers
 * - Theme integration utilities
 * 
 * Usage:
 * Import individual components or use collections for specific use cases.
 * All components support emergency styling and are mobile-responsive.
 */

export default {
  FormControls,
  DataDisplay,
  EmergencyComponents,
  LayoutComponents,
  ComponentVariants,
  ComponentSizes,
  EmergencyPresets,
  SafetyStatusPresets,
  ZoneRiskPresets,
  AccessibilityHelpers,
  ThemeIntegration,
  ValidationHelpers,
  ComponentCombinations,
};