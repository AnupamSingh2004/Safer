// web/src/lib/constants.ts

// Application Configuration
export const APP_CONFIG = {
  name: 'Smart Tourist Safety',
  version: '1.0.0',
  description: 'AI-powered tourist safety monitoring and incident response system',
  tagline: 'Ensuring Safe Journeys with Smart Technology',
  author: 'Tourism Department',
  supportEmail: 'support@smarttouristsafety.gov.in',
  emergencyNumber: '112',
} as const;

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  version: 'v1',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
    changePassword: '/api/auth/change-password',
  },
  
  // Tourist Management
  tourists: {
    list: '/api/tourists',
    create: '/api/tourists',
    update: '/api/tourists',
    delete: '/api/tourists',
    profile: '/api/tourists/profile',
    search: '/api/tourists/search',
    statistics: '/api/tourists/statistics',
  },

  // Digital Identity & Blockchain
  blockchain: {
    generateId: '/api/blockchain/generate-identity',
    verifyId: '/api/blockchain/verify-identity',
    identityRecords: '/api/blockchain/identity-records',
    transactions: '/api/blockchain/transactions',
  },

  // Alerts & Incidents
  alerts: {
    list: '/api/alerts',
    create: '/api/alerts',
    update: '/api/alerts',
    delete: '/api/alerts',
    resolve: '/api/alerts/resolve',
    statistics: '/api/alerts/statistics',
    emergency: '/api/alerts/emergency',
  },

  // Safety Zones & Geofencing
  zones: {
    list: '/api/zones',
    create: '/api/zones',
    update: '/api/zones',
    delete: '/api/zones',
    risk: '/api/zones/risk-assessment',
  },

  // Dashboard Analytics
  analytics: {
    overview: '/api/analytics/overview',
    tourists: '/api/analytics/tourists',
    alerts: '/api/analytics/alerts',
    zones: '/api/analytics/zones',
    reports: '/api/analytics/reports',
  },

  // WebSocket
  websocket: '/api/websocket',
} as const;

// User Roles & Permissions
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TOURISM_ADMIN: 'tourism_admin',
  POLICE_ADMIN: 'police_admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const;

export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_DASHBOARD: 'manage_dashboard',
  
  // Tourist permissions
  VIEW_TOURISTS: 'view_tourists',
  CREATE_TOURIST: 'create_tourist',
  UPDATE_TOURIST: 'update_tourist',
  DELETE_TOURIST: 'delete_tourist',
  
  // Alert permissions
  VIEW_ALERTS: 'view_alerts',
  CREATE_ALERT: 'create_alert',
  UPDATE_ALERT: 'update_alert',
  DELETE_ALERT: 'delete_alert',
  RESOLVE_ALERT: 'resolve_alert',
  
  // Zone permissions
  VIEW_ZONES: 'view_zones',
  CREATE_ZONE: 'create_zone',
  UPDATE_ZONE: 'update_zone',
  DELETE_ZONE: 'delete_zone',
  
  // Blockchain permissions
  VIEW_BLOCKCHAIN: 'view_blockchain',
  MANAGE_BLOCKCHAIN: 'manage_blockchain',
  GENERATE_DIGITAL_ID: 'generate_digital_id',
  
  // System permissions
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
} as const;

// Alert Types & Priorities
export const ALERT_TYPES = {
  EMERGENCY: 'emergency',
  MISSING_PERSON: 'missing_person',
  MEDICAL: 'medical',
  SECURITY: 'security',
  GEOFENCE_VIOLATION: 'geofence_violation',
  ANOMALY_DETECTED: 'anomaly_detected',
  PANIC_BUTTON: 'panic_button',
  SYSTEM_ALERT: 'system_alert',
} as const;

export const ALERT_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const ALERT_STATUS = {
  ACTIVE: 'active',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  FALSE_ALARM: 'false_alarm',
} as const;

// Tourist Safety Scores
export const SAFETY_SCORE = {
  EXCELLENT: { min: 90, max: 100, color: 'success', label: 'Excellent' },
  GOOD: { min: 70, max: 89, color: 'primary', label: 'Good' },
  FAIR: { min: 50, max: 69, color: 'warning', label: 'Fair' },
  POOR: { min: 30, max: 49, color: 'danger', label: 'Poor' },
  CRITICAL: { min: 0, max: 29, color: 'danger', label: 'Critical' },
} as const;

// Zone Risk Levels
export const ZONE_RISK_LEVELS = {
  SAFE: { level: 1, color: 'success', label: 'Safe Zone' },
  LOW_RISK: { level: 2, color: 'primary', label: 'Low Risk' },
  MODERATE_RISK: { level: 3, color: 'warning', label: 'Moderate Risk' },
  HIGH_RISK: { level: 4, color: 'danger', label: 'High Risk' },
  RESTRICTED: { level: 5, color: 'danger', label: 'Restricted Zone' },
} as const;

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  networks: {
    mainnet: {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpc: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
    },
    polygon: {
      name: 'Polygon',
      chainId: 137,
      rpc: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
    },
    testnet: {
      name: 'Sepolia Testnet',
      chainId: 11155111,
      rpc: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    },
  },
  contracts: {
    touristIdentity: process.env.NEXT_PUBLIC_TOURIST_IDENTITY_CONTRACT,
    identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT,
  },
  gasLimits: {
    generateIdentity: 500000,
    verifyIdentity: 100000,
    updateIdentity: 200000,
  },
} as const;

// Geolocation & Mapping
export const MAP_CONFIG = {
  defaultCenter: [20.5937, 78.9629], // India center
  defaultZoom: 5,
  maxZoom: 18,
  minZoom: 3,
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  geofenceColors: {
    safe: '#22c55e',
    lowRisk: '#0891b2',
    moderateRisk: '#f59e0b',
    highRisk: '#ef4444',
    restricted: '#7c2d12',
  },
} as const;

// Time & Date Formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  api: 'yyyy-MM-dd',
  apiWithTime: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  time: 'HH:mm',
  timeWithSeconds: 'HH:mm:ss',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  phone: {
    pattern: /^[+]?[\d\s\-\(\)]{10,15}$/,
    message: 'Please enter a valid phone number',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must contain only letters and spaces',
  },
  aadhar: {
    pattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
    message: 'Please enter a valid Aadhar number',
  },
  passport: {
    pattern: /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/,
    message: 'Please enter a valid passport number',
  },
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  maxFiles: 10,
} as const;

// WebSocket Events
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_ALERT: 'new_alert',
  ALERT_UPDATE: 'alert_update',
  TOURIST_UPDATE: 'tourist_update',
  LOCATION_UPDATE: 'location_update',
  SYSTEM_NOTIFICATION: 'system_notification',
  EMERGENCY_ALERT: 'emergency_alert',
} as const;

// Pagination & Limits
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 30 * 1000, // 30 seconds for critical data
} as const;

// Feature Flags
export const FEATURES = {
  BLOCKCHAIN_ENABLED: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN === 'true',
  REAL_TIME_TRACKING: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_TRACKING === 'true',
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  MULTILINGUAL_SUPPORT: process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL === 'true',
  IOT_INTEGRATION: process.env.NEXT_PUBLIC_ENABLE_IOT === 'true',
  DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  SENT: 'Sent successfully',
  LOGGED_IN: 'Logged in successfully',
  LOGGED_OUT: 'Logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;

// Environment Variables Helper
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;