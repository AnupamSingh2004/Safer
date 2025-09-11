import crypto from 'crypto';

/**
 * Smart Tourist Safety System - Core Utility Functions (Backend)
 * Essential utilities for data formatting, coordinate calculations, encryption, and common helpers
 */

// ============================================================================
// GEOLOCATION & COORDINATE UTILITIES
// ============================================================================

/**
 * Calculates distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Checks if a point is within a circular geofence
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  pointLat: number,
  pointLng: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
  return distance <= radiusKm;
}

/**
 * Checks if a point is within a polygon geofence
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

/**
 * Calculates bearing between two coordinates
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = toRadians(lng2 - lng1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
           Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  const bearingRad = Math.atan2(y, x);
  return (bearingRad * 180 / Math.PI + 360) % 360;
}

/**
 * Gets the bounds of a set of coordinates
 */
export function getCoordinateBounds(coordinates: [number, number][]): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (coordinates.length === 0) {
    throw new Error('Coordinates array cannot be empty');
  }
  
  let north = coordinates[0][0];
  let south = coordinates[0][0];
  let east = coordinates[0][1];
  let west = coordinates[0][1];
  
  coordinates.forEach(([lat, lng]) => {
    north = Math.max(north, lat);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    west = Math.min(west, lng);
  });
  
  return { north, south, east, west };
}

/**
 * Formats coordinates to DMS (Degrees, Minutes, Seconds)
 */
export function formatCoordinatesDMS(lat: number, lng: number): string {
  function toDMS(coord: number, isLatitude: boolean): string {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60 * 100) / 100;
    
    const direction = isLatitude 
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  }
  
  return `${toDMS(lat, true)}, ${toDMS(lng, false)}`;
}

// ============================================================================
// ENCRYPTION & SECURITY UTILITIES (Node.js Crypto)
// ============================================================================

/**
 * Generates a secure random string using Node.js crypto
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Creates a hash from a string using SHA-256
 */
export function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Creates an HMAC signature
 */
export function createHMAC(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Encrypts data using simple AES-256 (for demo purposes)
 */
export function encryptData(text: string, password: string): {
  encrypted: string;
  salt: string;
  iv: string;
  tag: string;
} {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  
  // Use simpler encryption for compatibility
  const cipher = crypto.createCipher('aes256', password + salt.toString('hex'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: crypto.randomBytes(16).toString('hex'), // Placeholder
  };
}

/**
 * Decrypts data using simple AES-256
 */
export function decryptData(
  encryptedData: string,
  password: string,
  salt: string,
  iv: string,
  tag: string
): string {
  try {
    const decipher = crypto.createDecipher('aes256', password + salt);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
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
 * Formats a number as currency (default: INR)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
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
// INDIAN-SPECIFIC VALIDATIONS
// ============================================================================

/**
 * Validates Indian Aadhar number
 */
export function isValidAadhar(aadhar: string): boolean {
  // Remove spaces and check if it's 12 digits
  const cleanAadhar = aadhar.replace(/\s/g, '');
  if (!/^\d{12}$/.test(cleanAadhar)) return false;
  
  // Aadhar uses Verhoeff checksum algorithm
  const digits = cleanAadhar.split('').map(Number);
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ];
  
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ];
  
  let c = 0;
  let len = digits.length;
  
  for (let i = 0; i < len; i++) {
    c = d[c][p[((len - i) % 8)][digits[i]]];
  }
  
  return c === 0;
}

/**
 * Validates Indian passport number
 */
export function isValidIndianPassport(passport: string): boolean {
  const passportRegex = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/;
  return passportRegex.test(passport.replace(/\s/g, ''));
}

/**
 * Validates Indian mobile number
 */
export function isValidIndianMobile(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\-\(\)+]/g, '');
  const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  return indianMobileRegex.test(cleanPhone);
}

/**
 * Validates Indian PIN code
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Formats Indian mobile number
 */
export function formatIndianMobile(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)+]/g, '');
  
  // Remove country code if present
  let number = cleanPhone;
  if (number.startsWith('+91')) number = number.slice(3);
  else if (number.startsWith('91')) number = number.slice(2);
  else if (number.startsWith('0')) number = number.slice(1);
  
  // Format as +91 XXXXX XXXXX
  if (number.length === 10) {
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  }
  
  return phone; // Return original if format is invalid
}

/**
 * Formats Aadhar number with spaces
 */
export function formatAadhar(aadhar: string): string {
  const cleanAadhar = aadhar.replace(/\s/g, '');
  if (cleanAadhar.length === 12) {
    return `${cleanAadhar.slice(0, 4)} ${cleanAadhar.slice(4, 8)} ${cleanAadhar.slice(8)}`;
  }
  return aadhar;
}

// ============================================================================
// SAFETY SCORE & RISK ASSESSMENT UTILITIES
// ============================================================================

/**
 * Calculates comprehensive safety score based on multiple factors
 */
export function calculateSafetyScore(factors: {
  locationRisk: number;      // 0-100 (100 = safest)
  timeOfDay: number;         // 0-23 hours
  weatherConditions: number; // 0-100 (100 = best weather)
  recentIncidents: number;   // Number of incidents in last 30 days
  groupSize: number;         // Number of people in group
  communicationStatus: boolean; // Has active communication
  healthStatus: number;      // 0-100 (100 = perfect health)
  emergencyContactsAvailable: boolean;
}): number {
  let score = 100;
  
  // Location risk factor (40% weight)
  score -= (100 - factors.locationRisk) * 0.4;
  
  // Time of day factor (15% weight)
  const timeRisk = getTimeRisk(factors.timeOfDay);
  score -= timeRisk * 0.15;
  
  // Weather conditions (10% weight)
  score -= (100 - factors.weatherConditions) * 0.1;
  
  // Recent incidents (15% weight)
  const incidentRisk = Math.min(factors.recentIncidents * 10, 100);
  score -= incidentRisk * 0.15;
  
  // Group size factor (5% weight)
  const groupRisk = getGroupSizeRisk(factors.groupSize);
  score -= groupRisk * 0.05;
  
  // Communication status (5% weight)
  if (!factors.communicationStatus) score -= 20;
  
  // Health status (5% weight)
  score -= (100 - factors.healthStatus) * 0.05;
  
  // Emergency contacts (5% weight)
  if (!factors.emergencyContactsAvailable) score -= 15;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Gets time-based risk score
 */
function getTimeRisk(hour: number): number {
  // Higher risk during late night/early morning hours
  if (hour >= 22 || hour <= 5) return 40;  // High risk
  if (hour >= 18 || hour <= 7) return 20;  // Medium risk
  return 5; // Low risk during day hours
}

/**
 * Gets group size risk score
 */
function getGroupSizeRisk(groupSize: number): number {
  if (groupSize === 1) return 30;      // Solo travel is riskier
  if (groupSize <= 3) return 10;       // Small group
  if (groupSize <= 6) return 5;        // Optimal group size
  return 15; // Large groups can be harder to manage
}

/**
 * Determines zone risk level based on various factors
 */
export function calculateZoneRisk(zoneData: {
  crimeRate: number;        // Crimes per 1000 people per year
  infrastructureQuality: number; // 0-100 scale
  emergencyResponse: number;     // Response time in minutes
  touristDensity: number;       // Tourists per sq km
  naturalDisasterRisk: number;  // 0-100 scale
  medicalFacilities: number;    // Number of hospitals/clinics nearby
}): {
  riskLevel: number;
  factors: Record<string, number>;
  recommendations: string[];
} {
  let riskScore = 0;
  const factors: Record<string, number> = {};
  const recommendations: string[] = [];
  
  // Crime rate factor
  const crimeRisk = Math.min(zoneData.crimeRate / 10, 100);
  factors.crime = crimeRisk;
  riskScore += crimeRisk * 0.3;
  
  // Infrastructure quality
  const infraRisk = 100 - zoneData.infrastructureQuality;
  factors.infrastructure = infraRisk;
  riskScore += infraRisk * 0.2;
  
  // Emergency response time
  const responseRisk = Math.min(zoneData.emergencyResponse / 2, 100);
  factors.emergencyResponse = responseRisk;
  riskScore += responseRisk * 0.2;
  
  // Natural disaster risk
  factors.naturalDisaster = zoneData.naturalDisasterRisk;
  riskScore += zoneData.naturalDisasterRisk * 0.15;
  
  // Medical facilities (inverse - more facilities = less risk)
  const medicalRisk = Math.max(0, 100 - zoneData.medicalFacilities * 10);
  factors.medical = medicalRisk;
  riskScore += medicalRisk * 0.15;
  
  // Generate recommendations based on risk factors
  if (crimeRisk > 50) recommendations.push('Avoid displaying valuable items');
  if (responseRisk > 60) recommendations.push('Travel with emergency beacon');
  if (infraRisk > 70) recommendations.push('Carry backup communication device');
  if (zoneData.naturalDisasterRisk > 40) recommendations.push('Check weather alerts regularly');
  if (medicalRisk > 60) recommendations.push('Carry first aid kit and emergency medications');
  
  return {
    riskLevel: Math.min(100, Math.round(riskScore)),
    factors,
    recommendations,
  };
}

// ============================================================================
// EMERGENCY RESPONSE UTILITIES
// ============================================================================

/**
 * Determines emergency response priority based on alert type and context
 */
export function getEmergencyPriority(
  alertType: string,
  safetyScore: number,
  responseTime: number,
  location: { lat: number; lng: number }
): {
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedResponseTime: number;
  requiredResources: string[];
} {
  let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
  let estimatedResponseTime = responseTime;
  const requiredResources: string[] = [];
  
  // Determine priority based on alert type
  const criticalAlerts = ['critical_emergency', 'medical_emergency', 'security_threat', 'natural_disaster'];
  const highAlerts = ['missing_person', 'panic_button', 'accident', 'violence'];
  const mediumAlerts = ['geofence_violation', 'anomaly_detected', 'suspicious_activity'];
  
  if (criticalAlerts.includes(alertType)) {
    priority = 'critical';
    estimatedResponseTime = Math.min(responseTime, 5);
    requiredResources.push('emergency_services', 'medical_team', 'police');
  } else if (highAlerts.includes(alertType)) {
    priority = 'high';
    estimatedResponseTime = Math.min(responseTime, 15);
    requiredResources.push('emergency_services', 'field_agent');
  } else if (mediumAlerts.includes(alertType)) {
    priority = 'medium';
    estimatedResponseTime = Math.min(responseTime, 30);
    requiredResources.push('field_agent');
  }
  
  // Adjust priority based on safety score
  if (safetyScore < 30 && priority !== 'critical') {
    priority = priority === 'low' ? 'medium' : 'high';
    estimatedResponseTime = Math.round(estimatedResponseTime * 0.7);
  }
  
  return {
    priority,
    estimatedResponseTime,
    requiredResources,
  };
}

/**
 * Formats emergency contact number for calling
 */
export function formatEmergencyNumber(service: string, location?: string): string {
  const emergencyNumbers: Record<string, string> = {
    general: '112',
    police: '100',
    fire: '101',
    medical: '108',
    tourist_helpline: '1363',
    disaster: '1078',
    railway: '1512',
    highway: '1033',
  };
  
  return emergencyNumbers[service] || '112';
}

// ============================================================================
// BLOCKCHAIN TRANSACTION UTILITIES
// ============================================================================

/**
 * Generates deterministic transaction ID for blockchain operations
 */
export function generateTransactionId(
  operation: string,
  touristId: string,
  timestamp?: number
): string {
  const ts = timestamp || Date.now();
  const data = `${operation}-${touristId}-${ts}`;
  return createHash(data).slice(0, 16);
}

/**
 * Formats blockchain transaction hash for display
 */
export function formatTransactionHash(hash: string): string {
  if (!hash) return 'N/A';
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}

/**
 * Validates blockchain transaction data integrity
 */
export function validateTransactionIntegrity(
  data: any,
  signature: string,
  publicKey: string
): boolean {
  try {
    const dataHash = createHash(JSON.stringify(data));
    const expectedSignature = createHMAC(dataHash, publicKey);
    return signature === expectedSignature;
  } catch {
    return false;
  }
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
// DATA FORMATTING UTILITIES
// ============================================================================

/**
 * Formats alert severity for display
 */
export function formatAlertSeverity(severity: string): {
  label: string;
  color: string;
  icon: string;
} {
  const severityMap: Record<string, { label: string; color: string; icon: string }> = {
    critical: { label: 'Critical', color: '#dc2626', icon: '🚨' },
    high: { label: 'High', color: '#ea580c', icon: '⚠️' },
    medium: { label: 'Medium', color: '#ca8a04', icon: '⚡' },
    low: { label: 'Low', color: '#16a34a', icon: 'ℹ️' },
  };
  
  return severityMap[severity] || severityMap.low;
}

/**
 * Formats tourist status for display
 */
export function formatTouristStatus(status: string): {
  label: string;
  color: string;
  description: string;
} {
  const statusMap: Record<string, { label: string; color: string; description: string }> = {
    safe: { label: 'Safe', color: '#16a34a', description: 'Tourist is in a safe location' },
    at_risk: { label: 'At Risk', color: '#ea580c', description: 'Tourist may be in potential danger' },
    emergency: { label: 'Emergency', color: '#dc2626', description: 'Tourist requires immediate assistance' },
    offline: { label: 'Offline', color: '#6b7280', description: 'No recent communication from tourist' },
    unknown: { label: 'Unknown', color: '#6b7280', description: 'Status cannot be determined' },
  };
  
  return statusMap[status] || statusMap.unknown;
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  calculateDistance,
  isWithinRadius,
  isPointInPolygon,
  calculateBearing,
  getCoordinateBounds,
  formatCoordinatesDMS,
  generateSecureToken,
  createHash,
  createHMAC,
  encryptData,
  decryptData,
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
  isValidAadhar,
  isValidIndianPassport,
  isValidIndianMobile,
  isValidPincode,
  formatIndianMobile,
  formatAadhar,
  calculateSafetyScore,
  calculateZoneRisk,
  getEmergencyPriority,
  formatEmergencyNumber,
  generateTransactionId,
  formatTransactionHash,
  validateTransactionIntegrity,
  removeDuplicates,
  groupBy,
  shuffleArray,
  deepClone,
  omit,
  pick,
  getColorFromString,
  hexToRgb,
  isLightColor,
  getSafetyScoreColor,
  getSafetyScoreLabel,
  debounce,
  throttle,
  isValidEthereumAddress,
  shortenAddress,
  formatAlertSeverity,
  formatTouristStatus,
};
