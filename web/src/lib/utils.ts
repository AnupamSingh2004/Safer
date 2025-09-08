import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Smart Tourist Safety System - Core Utility Functions
 * Essential utilities for data formatting, text manipulation, and common helpers
 */

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Combines class names with Tailwind CSS merge functionality
 * Useful for conditional styling and component variants
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Formats a date string or Date object to a readable format
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

/**
 * Formats a date string or Date object to include time
 */
export function formatDateTime(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

/**
 * Returns a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count > 0) {
      const suffix = count === 1 ? '' : 's';
      const prefix = diffInSeconds < 0 ? 'in ' : '';
      const postfix = diffInSeconds >= 0 ? ' ago' : '';
      return `${prefix}${count} ${interval.label}${suffix}${postfix}`;
    }
  }
  
  return 'just now';
}

// ============================================================================
// TEXT UTILITIES
// ============================================================================

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts text to title case
 */
export function toTitleCase(text: string): string {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Generates initials from a name
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  return name
    .split(' ')
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Removes special characters and converts to slug format
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// NUMBER & CURRENCY UTILITIES
// ============================================================================

/**
 * Formats a number with commas as thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a number as currency (default: USD)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Converts bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is a valid phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if coordinates are valid latitude/longitude
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Generates a consistent color based on a string (useful for avatars)
 */
export function getColorFromString(str: string): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Determines if a color is light or dark (for text contrast)
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Removes duplicates from an array
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Groups array items by a specified key
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// ============================================================================
// SAFETY SCORE UTILITIES
// ============================================================================

/**
 * Calculates safety score color based on value
 */
export function getSafetyScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // Green - Safe
  if (score >= 60) return '#f59e0b'; // Yellow - Moderate
  if (score >= 40) return '#f97316'; // Orange - Caution
  return '#ef4444'; // Red - Danger
}

/**
 * Gets safety score label based on value
 */
export function getSafetyScoreLabel(score: number): string {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Caution';
  return 'High Risk';
}

// ============================================================================
// DEBOUNCE & THROTTLE UTILITIES
// ============================================================================

/**
 * Debounces a function to prevent excessive calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function to limit call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// BLOCKCHAIN UTILITIES
// ============================================================================

/**
 * Validates if a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shortens an Ethereum address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  cn,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  capitalize,
  toTitleCase,
  getInitials,
  slugify,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatBytes,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidCoordinates,
  getColorFromString,
  hexToRgb,
  isLightColor,
  removeDuplicates,
  groupBy,
  shuffleArray,
  deepClone,
  omit,
  pick,
  getSafetyScoreColor,
  getSafetyScoreLabel,
  debounce,
  throttle,
  isValidEthereumAddress,
  shortenAddress,
};
