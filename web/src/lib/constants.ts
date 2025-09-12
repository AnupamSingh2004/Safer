/**
 * Smart Tourist Safety System - Application Constants
 * Comprehensive constants for emergency services, API endpoints, and system configuration
 */

// Application Configuration
export const APP_CONFIG = {
  name: 'Smart Tourist Safety',
  version: '1.0.0',
  description: 'AI-powered tourist safety monitoring and incident response system',
  tagline: 'Ensuring Safe Journeys with Smart Technology',
  author: 'Tourism Department, Government of India',
  supportEmail: 'support@smarttouristsafety.gov.in',
  emergencyNumber: '112',
  touristHelpline: '1363',
  policeEmergency: '100',
  medicalEmergency: '108',
  fireEmergency: '101',
} as const;

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  backendURL: process.env.BACKEND_API_URL || 'http://localhost:3001',
  version: 'v1',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  rateLimit: {
    maxRequests: 100,
    windowMs: 900000, // 15 minutes
  },
} as const;

// API Endpoints - Comprehensive endpoint mapping
export const API_ENDPOINTS = {
  // Authentication & User Management
  auth: {
    base: '/auth',
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
    resetPassword: '/auth/reset-password',
    forgotPassword: '/auth/forgot-password',
    googleSignin: '/auth/google-signin',
  },
  
  // Tourist Management & Profiles
  tourists: {
    base: '/tourists',
    list: '/tourists',
    create: '/tourists',
    update: (id: string) => `/tourists/${id}`,
    delete: (id: string) => `/tourists/${id}`,
    get: (id: string) => `/tourists/${id}`,
    profile: '/tourists/profile',
    search: '/tourists/search',
    statistics: '/tourists/statistics',
    safetyScore: (id: string) => `/tourists/${id}/safety-score`,
    location: (id: string) => `/tourists/${id}/location`,
    alerts: (id: string) => `/tourists/${id}/alerts`,
    digitalId: (id: string) => `/tourists/${id}/digital-id`,
  },

  // Digital Identity & Blockchain Integration
  blockchain: {
    base: '/blockchain',
    generateId: '/blockchain/generate-identity',
    generateIdentity: '/blockchain/generate-identity',
    verifyId: '/blockchain/verify-identity',
    verifyIdentity: '/blockchain/verify-identity',
    identityRecords: '/blockchain/identity-records',
    transactions: '/blockchain/transactions',
    transactionStatus: '/blockchain/transaction-status',
    contractDeploy: '/blockchain/contract-deploy',
    contractStatus: '/blockchain/contract-status',
    emergencyAccess: '/blockchain/emergency-access',
  },

  // Alert Management & Emergency Response
  alerts: {
    base: '/alerts',
    list: '/alerts',
    active: '/alerts/active',
    create: '/alerts',
    update: (id: string) => `/alerts/${id}`,
    delete: (id: string) => `/alerts/${id}`,
    get: (id: string) => `/alerts/${id}`,
    resolve: (id: string) => `/alerts/${id}/resolve`,
    acknowledge: (id: string) => `/alerts/${id}/acknowledge`,
    escalate: (id: string) => `/alerts/${id}/escalate`,
    statistics: '/alerts/statistics',
    emergency: '/alerts/emergency',
    panic: '/alerts/panic',
    bulkUpdate: '/alerts/bulk-update',
    history: '/alerts/history',
  },

  // Safety Zones & Geofencing
  zones: {
    base: '/zones',
    list: '/zones',
    create: '/zones',
    update: (id: string) => `/zones/${id}`,
    delete: (id: string) => `/zones/${id}`,
    get: (id: string) => `/zones/${id}`,
    riskAssessment: '/zones/risk-assessment',
    nearby: '/zones/nearby',
    violations: '/zones/violations',
  },

  // Dashboard Analytics & Reporting
  analytics: {
    base: '/analytics',
    overview: '/analytics/overview',
    dashboard: '/analytics/dashboard',
    tourists: '/analytics/tourists',
    alerts: '/analytics/alerts',
    zones: '/analytics/zones',
    reports: '/analytics/reports',
    heatmap: '/analytics/heatmap',
    trends: '/analytics/trends',
  },

  // Mobile App Integration
  mobile: {
    base: '/mobile',
    profile: '/mobile/profile',
    tracking: '/mobile/tracking',
    panic: '/mobile/panic',
    kycUpload: '/mobile/kyc-upload',
    safetyScore: '/mobile/safety-score',
    notifications: '/mobile/notifications',
  },

  // Shared Services
  shared: {
    alerts: '/shared/alerts',
    tourists: '/shared/tourists',
    zones: '/shared/zones',
    notifications: '/shared/notifications',
  },

  // WebSocket & Real-time
  websocket: '/websocket',
  
  // Webhooks
  webhooks: {
    blockchain: '/webhooks/blockchain',
    payment: '/webhooks/payment',
  },
} as const;

// User Roles & Permissions - Aligned with backend
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  OPERATOR: 'operator', 
  VIEWER: 'viewer',
} as const;

export const ROLE_HIERARCHY = {
  [USER_ROLES.SUPER_ADMIN]: 3,
  [USER_ROLES.OPERATOR]: 2,
  [USER_ROLES.VIEWER]: 1,
} as const;

export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_DASHBOARD: 'manage_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  
  // Tourist permissions
  VIEW_TOURISTS: 'view_tourists',
  CREATE_TOURIST: 'create_tourist',
  UPDATE_TOURIST: 'update_tourist',
  DELETE_TOURIST: 'delete_tourist',
  VIEW_TOURIST_DETAILS: 'view_tourist_details',
  TRACK_TOURIST: 'track_tourist',
  
  // Alert permissions
  VIEW_ALERTS: 'view_alerts',
  CREATE_ALERT: 'create_alert',
  UPDATE_ALERT: 'update_alert',
  DELETE_ALERT: 'delete_alert',
  RESOLVE_ALERT: 'resolve_alert',
  ESCALATE_ALERT: 'escalate_alert',
  EMERGENCY_RESPONSE: 'emergency_response',
  
  // Zone permissions
  VIEW_ZONES: 'view_zones',
  CREATE_ZONE: 'create_zone',
  UPDATE_ZONE: 'update_zone',
  DELETE_ZONE: 'delete_zone',
  MANAGE_GEOFENCING: 'manage_geofencing',
  
  // Blockchain permissions
  VIEW_BLOCKCHAIN: 'view_blockchain',
  MANAGE_BLOCKCHAIN: 'manage_blockchain',
  GENERATE_DIGITAL_ID: 'generate_digital_id',
  VERIFY_DIGITAL_ID: 'verify_digital_id',
  
  // System permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_LOGS: 'view_logs',
  SYSTEM_ADMIN: 'system_admin',
} as const;

// Alert Types & Classifications - Enhanced for comprehensive emergency response
export const ALERT_TYPES = {
  // Critical Emergencies
  CRITICAL_EMERGENCY: 'critical_emergency',
  MEDICAL_EMERGENCY: 'medical_emergency',
  SECURITY_THREAT: 'security_threat',
  NATURAL_DISASTER: 'natural_disaster',
  
  // High Priority
  MISSING_PERSON: 'missing_person',
  PANIC_BUTTON: 'panic_button',
  ACCIDENT: 'accident',
  VIOLENCE: 'violence',
  
  // Medium Priority
  GEOFENCE_VIOLATION: 'geofence_violation',
  ANOMALY_DETECTED: 'anomaly_detected',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  WEATHER_WARNING: 'weather_warning',
  
  // Low Priority
  SYSTEM_ALERT: 'system_alert',
  MAINTENANCE: 'maintenance',
  INFORMATION: 'information',
  ROUTINE_CHECK: 'routine_check',
} as const;

export const ALERT_PRIORITY = {
  CRITICAL: 'critical',    // Life-threatening, immediate response
  HIGH: 'high',           // Urgent, response within 5 minutes
  MEDIUM: 'medium',       // Important, response within 30 minutes
  LOW: 'low',            // Non-urgent, response within 2 hours
} as const;

export const ALERT_STATUS = {
  ACTIVE: 'active',           // Alert is active and needs attention
  ACKNOWLEDGED: 'acknowledged', // Alert has been seen by operator
  IN_PROGRESS: 'in_progress',  // Response is in progress
  RESOLVED: 'resolved',        // Issue has been resolved
  CLOSED: 'closed',           // Alert is closed and archived
  FALSE_ALARM: 'false_alarm',  // Alert was determined to be false
  ESCALATED: 'escalated',     // Alert has been escalated
} as const;

// Tourist Safety Assessment - Enhanced scoring system
export const SAFETY_SCORE = {
  EXCELLENT: { min: 90, max: 100, color: 'success', label: 'Excellent', description: 'Very safe, no concerns' },
  GOOD: { min: 70, max: 89, color: 'primary', label: 'Good', description: 'Safe with minor precautions' },
  FAIR: { min: 50, max: 69, color: 'warning', label: 'Fair', description: 'Moderate caution advised' },
  POOR: { min: 30, max: 49, color: 'danger', label: 'Poor', description: 'High caution required' },
  CRITICAL: { min: 0, max: 29, color: 'danger', label: 'Critical', description: 'Immediate intervention needed' },
} as const;

export const SAFETY_FACTORS = {
  LOCATION_RISK: 'location_risk',
  TIME_OF_DAY: 'time_of_day',
  WEATHER_CONDITIONS: 'weather_conditions',
  RECENT_INCIDENTS: 'recent_incidents',
  GROUP_SIZE: 'group_size',
  COMMUNICATION_STATUS: 'communication_status',
  HEALTH_STATUS: 'health_status',
  EMERGENCY_CONTACTS: 'emergency_contacts',
} as const;

// Zone Risk Assessment - Comprehensive risk categorization
export const ZONE_RISK_LEVELS = {
  SAFE: { 
    level: 1, 
    color: 'success', 
    label: 'Safe Zone', 
    description: 'Low crime, good infrastructure, regular patrol',
    restrictions: []
  },
  LOW_RISK: { 
    level: 2, 
    color: 'primary', 
    label: 'Low Risk', 
    description: 'Generally safe with basic precautions',
    restrictions: ['avoid_night_travel']
  },
  MODERATE_RISK: { 
    level: 3, 
    color: 'warning', 
    label: 'Moderate Risk', 
    description: 'Exercise caution, travel in groups',
    restrictions: ['group_travel_advised', 'daylight_only']
  },
  HIGH_RISK: { 
    level: 4, 
    color: 'danger', 
    label: 'High Risk', 
    description: 'Significant safety concerns, local guide required',
    restrictions: ['local_guide_required', 'daylight_only', 'emergency_contacts']
  },
  RESTRICTED: { 
    level: 5, 
    color: 'danger', 
    label: 'Restricted Zone', 
    description: 'Access prohibited or requires special permission',
    restrictions: ['special_permission', 'security_escort', 'emergency_protocol']
  },
} as const;

// Blockchain & Smart Contract Configuration
export const BLOCKCHAIN_CONFIG = {
  networks: {
    mainnet: {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpc: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
      currency: 'ETH',
      explorer: 'https://etherscan.io',
    },
    polygon: {
      name: 'Polygon',
      chainId: 137,
      rpc: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
      currency: 'MATIC',
      explorer: 'https://polygonscan.com',
    },
    testnet: {
      name: 'Sepolia Testnet',
      chainId: 11155111,
      rpc: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
      currency: 'ETH',
      explorer: 'https://sepolia.etherscan.io',
    },
  },
  contracts: {
    touristIdentity: process.env.NEXT_PUBLIC_TOURIST_IDENTITY_CONTRACT,
    identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT,
    emergencyLogging: process.env.NEXT_PUBLIC_EMERGENCY_LOGGING_CONTRACT,
    identityVerification: process.env.NEXT_PUBLIC_IDENTITY_VERIFICATION_CONTRACT,
  },
  gasLimits: {
    generateIdentity: 500000,
    verifyIdentity: 100000,
    updateIdentity: 200000,
    emergencyAccess: 150000,
    logIncident: 80000,
  },
  transactionTypes: {
    IDENTITY_CREATION: 'identity_creation',
    IDENTITY_VERIFICATION: 'identity_verification',
    IDENTITY_UPDATE: 'identity_update',
    EMERGENCY_ACCESS: 'emergency_access',
    INCIDENT_LOG: 'incident_log',
  },
} as const;

// Geolocation & Mapping Configuration
export const MAP_CONFIG = {
  defaultCenter: [20.5937, 78.9629], // India center coordinates
  defaultZoom: 5,
  maxZoom: 18,
  minZoom: 3,
  clusters: {
    enabled: true,
    maxZoom: 15,
    radius: 40,
  },
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  emergencyServices: {
    police: { icon: '🚔', color: '#2563eb' },
    medical: { icon: '🚑', color: '#dc2626' },
    fire: { icon: '🚒', color: '#f59e0b' },
    tourist: { icon: '👤', color: '#0891b2' },
  },
  zoneColors: {
    safe: '#22c55e',
    lowRisk: '#0891b2',
    moderateRisk: '#f59e0b',
    highRisk: '#ef4444',
    restricted: '#7c2d12',
  },
  alertRadius: {
    critical: 5000,    // 5km
    high: 3000,        // 3km
    medium: 2000,      // 2km
    low: 1000,         // 1km
  },
} as const;

// Time & Date Formats - Comprehensive formatting options
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  displayLong: 'MMMM dd, yyyy',
  displayShort: 'MM/dd/yy',
  api: 'yyyy-MM-dd',
  apiWithTime: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  time: 'HH:mm',
  time12: 'h:mm a',
  timeWithSeconds: 'HH:mm:ss',
  relative: 'relative', // for relative time formatting
} as const;

// Validation Rules - Enhanced validation for Indian context
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  phone: {
    pattern: /^(\+91|91)?[6-9]\d{9}$/,
    message: 'Please enter a valid Indian mobile number',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s.]+$/,
    message: 'Name must contain only letters, spaces, and dots',
  },
  aadhar: {
    pattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
    message: 'Please enter a valid 12-digit Aadhar number',
  },
  passport: {
    pattern: /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/,
    message: 'Please enter a valid Indian passport number',
  },
  pincode: {
    pattern: /^[1-9][0-9]{5}$/,
    message: 'Please enter a valid 6-digit PIN code',
  },
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxTotalSize: 50 * 1024 * 1024, // 50MB total
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  allowedVideoTypes: ['video/mp4', 'video/webm'],
  maxFiles: 10,
  compressionQuality: 0.8,
  thumbnailSize: { width: 200, height: 200 },
} as const;

// WebSocket Events - Real-time communication
export const WEBSOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  
  // Alert events
  NEW_ALERT: 'new_alert',
  ALERT_UPDATE: 'alert_update',
  ALERT_RESOLVED: 'alert_resolved',
  EMERGENCY_ALERT: 'emergency_alert',
  
  // Tourist events
  TOURIST_UPDATE: 'tourist_update',
  TOURIST_LOCATION: 'tourist_location',
  TOURIST_CHECKIN: 'tourist_checkin',
  TOURIST_OFFLINE: 'tourist_offline',
  
  // System events
  SYSTEM_NOTIFICATION: 'system_notification',
  ZONE_VIOLATION: 'zone_violation',
  WEATHER_ALERT: 'weather_alert',
  
  // Real-time updates
  LOCATION_UPDATE: 'location_update',
  STATUS_CHANGE: 'status_change',
  HEARTBEAT: 'heartbeat',
} as const;

// Emergency Response Configuration
export const EMERGENCY_CONFIG = {
  responseTimeTargets: {
    critical: 5 * 60 * 1000,      // 5 minutes
    high: 15 * 60 * 1000,         // 15 minutes
    medium: 30 * 60 * 1000,       // 30 minutes
    low: 120 * 60 * 1000,         // 2 hours
  },
  escalationTimes: {
    firstEscalation: 10 * 60 * 1000,  // 10 minutes
    secondEscalation: 30 * 60 * 1000, // 30 minutes
    finalEscalation: 60 * 60 * 1000,  // 1 hour
  },
  contactSequence: [
    'primary_responder',
    'backup_responder',
    'area_supervisor',
    'district_coordinator',
    'state_emergency',
  ],
  autoResolution: {
    enabled: false, // Never auto-resolve emergencies
    timeout: Infinity,
  },
} as const;

// Pagination & Data Management
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
  showSizeChanger: true,
  showQuickJumper: true,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000,      // 5 minutes
  cacheTime: 10 * 60 * 1000,     // 10 minutes
  refetchInterval: 30 * 1000,     // 30 seconds for critical data
  backgroundRefetch: true,
  retryOnMount: true,
  refetchOnWindowFocus: true,
} as const;

// Feature Flags - Environment-based feature control
export const FEATURES = {
  BLOCKCHAIN_ENABLED: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN === 'true',
  REAL_TIME_TRACKING: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_TRACKING === 'true',
  AI_ANOMALY_DETECTION: process.env.NEXT_PUBLIC_ENABLE_AI_ANOMALY_DETECTION === 'true',
  GEOFENCING: process.env.NEXT_PUBLIC_ENABLE_GEOFENCING === 'true',
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  MULTILINGUAL_SUPPORT: process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL === 'true',
  IOT_INTEGRATION: process.env.NEXT_PUBLIC_ENABLE_IOT === 'true',
  DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false',
  WEATHER_INTEGRATION: process.env.NEXT_PUBLIC_ENABLE_WEATHER_INTEGRATION === 'true',
  EMERGENCY_ALERTS: process.env.NEXT_PUBLIC_ENABLE_EMERGENCY_ALERTS !== 'false',
  BETA_FEATURES: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true',
} as const;

// System Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  EMERGENCY_FAILED: 'Emergency alert failed to send. Please contact emergency services directly.',
  BLOCKCHAIN_ERROR: 'Blockchain transaction failed. Please try again.',
  LOCATION_ERROR: 'Unable to access location. Please enable location services.',
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  SENT: 'Sent successfully',
  LOGGED_IN: 'Welcome back! Logged in successfully',
  LOGGED_OUT: 'Logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  ALERT_CREATED: 'Alert created and responders notified',
  ALERT_RESOLVED: 'Alert marked as resolved',
  EMERGENCY_SENT: 'Emergency alert sent to all responders',
  LOCATION_UPDATED: 'Location updated successfully',
} as const;

// Environment Helper
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
} as const;

// Indian States and Tourist Destinations
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const;

export const POPULAR_DESTINATIONS = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan',
  'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
  'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
] as const;

export default {
  APP_CONFIG,
  API_CONFIG,
  API_ENDPOINTS,
  USER_ROLES,
  PERMISSIONS,
  ALERT_TYPES,
  ALERT_PRIORITY,
  ALERT_STATUS,
  SAFETY_SCORE,
  ZONE_RISK_LEVELS,
  BLOCKCHAIN_CONFIG,
  MAP_CONFIG,
  DATE_FORMATS,
  VALIDATION_RULES,
  UPLOAD_CONFIG,
  WEBSOCKET_EVENTS,
  EMERGENCY_CONFIG,
  PAGINATION,
  CACHE_CONFIG,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ENV,
} as const;