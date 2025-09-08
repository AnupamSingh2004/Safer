// web/src/lib/validations.ts

import { z } from 'zod';
import {
  ALERT_TYPES,
  ALERT_PRIORITY,
  ALERT_STATUS,
  USER_ROLES,
  ZONE_RISK_LEVELS,
  VALIDATION_RULES,
} from './constants';

// ==================== BASE VALIDATIONS ====================

// Common field validations
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(VALIDATION_RULES.phone.pattern, VALIDATION_RULES.phone.message);

export const passwordSchema = z
  .string()
  .min(VALIDATION_RULES.password.minLength, `Password must be at least ${VALIDATION_RULES.password.minLength} characters`)
  .max(VALIDATION_RULES.password.maxLength, `Password must be less than ${VALIDATION_RULES.password.maxLength} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(VALIDATION_RULES.name.minLength, `Name must be at least ${VALIDATION_RULES.name.minLength} characters`)
  .max(VALIDATION_RULES.name.maxLength, `Name must be less than ${VALIDATION_RULES.name.maxLength} characters`)
  .regex(VALIDATION_RULES.name.pattern, VALIDATION_RULES.name.message);

export const aadharSchema = z
  .string()
  .min(1, 'Aadhar number is required')
  .regex(VALIDATION_RULES.aadhar.pattern, VALIDATION_RULES.aadhar.message);

export const passportSchema = z
  .string()
  .min(1, 'Passport number is required')
  .regex(VALIDATION_RULES.passport.pattern, VALIDATION_RULES.passport.message);

export const coordinateSchema = z
  .number()
  .or(z.string().transform(Number))
  .refine((val) => !isNaN(val), 'Must be a valid number');

export const latitudeSchema = coordinateSchema
  .refine((val) => val >= -90 && val <= 90, 'Latitude must be between -90 and 90');

export const longitudeSchema = coordinateSchema
  .refine((val) => val >= -180 && val <= 180, 'Longitude must be between -180 and 180');

export const blockchainAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid blockchain address format');

// ==================== AUTHENTICATION SCHEMAS ====================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  role: z.enum([USER_ROLES.TOURISM_ADMIN, USER_ROLES.POLICE_ADMIN, USER_ROLES.OPERATOR, USER_ROLES.VIEWER]),
  department: z.string().min(1, 'Department is required'),
  badge: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val, 'You must accept the terms and conditions'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

// ==================== USER SCHEMAS ====================

export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  department: z.string().min(1, 'Department is required'),
  badge: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }).optional(),
});

export const userCreateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum([USER_ROLES.TOURISM_ADMIN, USER_ROLES.POLICE_ADMIN, USER_ROLES.OPERATOR, USER_ROLES.VIEWER]),
  department: z.string().min(1, 'Department is required'),
  badge: z.string().optional(),
  isActive: z.boolean().default(true),
});

// ==================== TOURIST SCHEMAS ====================

export const touristRegistrationSchema = z.object({
  // Personal Information
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  nationality: z.string().min(1, 'Nationality is required'),
  
  // Identity Documents
  identityType: z.enum(['aadhar', 'passport', 'voter_id', 'driving_license']),
  identityNumber: z.string().min(1, 'Identity number is required'),
  identityDocument: z.string().optional(), // File URL
  
  // Travel Information
  visitorType: z.enum(['domestic', 'international']),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  accommodation: z.string().min(1, 'Accommodation details required'),
  purposeOfVisit: z.enum(['tourism', 'business', 'education', 'medical', 'other']),
  itinerary: z.array(z.object({
    location: z.string(),
    date: z.string(),
    activities: z.array(z.string()),
  })).optional(),
  
  // Emergency Contacts
  emergencyContacts: z.array(z.object({
    name: nameSchema,
    relationship: z.string().min(1, 'Relationship is required'),
    phone: phoneSchema,
    email: emailSchema.optional(),
  })).min(1, 'At least one emergency contact is required'),
  
  // Medical Information
  medicalConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  
  // Preferences
  preferredLanguage: z.string().default('en'),
  specialRequirements: z.string().optional(),
  
  // Consent
  consentTracking: z.boolean(),
  consentDataSharing: z.boolean(),
  consentEmergency: z.boolean(),
}).refine(
  (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  }
);

export const touristUpdateSchema = touristRegistrationSchema.partial().omit({
  identityType: true,
  identityNumber: true,
});

export const touristSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['active', 'inactive', 'expired']).optional(),
  visitorType: z.enum(['domestic', 'international']).optional(),
  nationality: z.string().optional(),
  checkInDateFrom: z.string().optional(),
  checkInDateTo: z.string().optional(),
  safetyScoreMin: z.number().min(0).max(100).optional(),
  safetyScoreMax: z.number().min(0).max(100).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'firstName', 'checkInDate', 'safetyScore']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ==================== BLOCKCHAIN SCHEMAS ====================

export const digitalIdentitySchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  identityHash: z.string().min(1, 'Identity hash is required'),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  issuerAddress: blockchainAddressSchema,
  metadata: z.object({
    fullName: z.string(),
    nationality: z.string(),
    documentType: z.string(),
    documentNumber: z.string(),
    emergencyContact: z.string(),
  }),
});

export const blockchainVerificationSchema = z.object({
  digitalId: z.string().min(1, 'Digital ID is required'),
  signature: z.string().min(1, 'Signature is required'),
  timestamp: z.number().min(1, 'Timestamp is required'),
});

// ==================== ALERT SCHEMAS ====================

export const alertCreateSchema = z.object({
  type: z.enum(Object.values(ALERT_TYPES) as [string, ...string[]]),
  priority: z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]]),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  touristId: z.string().min(1, 'Tourist ID is required'),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    address: z.string().optional(),
  }).optional(),
  metadata: z.record(z.any()).optional(),
  attachments: z.array(z.object({
    type: z.enum(['image', 'video', 'audio', 'document']),
    url: z.string().url(),
    filename: z.string(),
    size: z.number(),
  })).optional(),
});

export const alertUpdateSchema = z.object({
  status: z.enum(Object.values(ALERT_STATUS) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]]).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  assignedTo: z.string().optional(),
  resolution: z.string().max(1000, 'Resolution must be less than 1000 characters').optional(),
  resolutionTime: z.string().optional(),
  notes: z.array(z.object({
    content: z.string().min(1, 'Note content is required'),
    author: z.string().min(1, 'Author is required'),
    timestamp: z.string().min(1, 'Timestamp is required'),
  })).optional(),
});

export const alertSearchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(Object.values(ALERT_TYPES) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]]).optional(),
  status: z.enum(Object.values(ALERT_STATUS) as [string, ...string[]]).optional(),
  touristId: z.string().optional(),
  assignedTo: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    radius: z.number().min(0).max(50).optional(), // km
  }).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'priority', 'status', 'type']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const emergencyAlertSchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    accuracy: z.number().optional(),
    timestamp: z.string().optional(),
  }),
  type: z.enum(['panic_button', 'medical_emergency', 'security_threat', 'natural_disaster']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('high'),
  description: z.string().max(500).optional(),
  audioRecording: z.string().optional(), // Base64 or URL
  photos: z.array(z.string()).optional(), // URLs or Base64
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
    notified: z.boolean().default(false),
  })).optional(),
});

// ==================== ZONE SCHEMAS ====================

export const zoneCreateSchema = z.object({
  name: z.string().min(1, 'Zone name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  type: z.enum(['geofence', 'poi', 'restricted', 'safe', 'tourist_spot', 'emergency']),
  riskLevel: z.number().min(1).max(5),
  geometry: z.object({
    type: z.enum(['Point', 'Polygon', 'Circle']),
    coordinates: z.array(z.array(z.number())).min(1, 'Coordinates are required'),
    radius: z.number().optional(), // For circles
  }),
  properties: z.object({
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
    fillColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid fill color format').optional(),
    strokeWidth: z.number().min(1).max(10).optional(),
    opacity: z.number().min(0).max(1).optional(),
  }).optional(),
  metadata: z.object({
    category: z.string().optional(),
    subcategory: z.string().optional(),
    openingHours: z.string().optional(),
    contact: z.string().optional(),
    website: z.string().url().optional(),
    capacity: z.number().optional(),
    facilities: z.array(z.string()).optional(),
  }).optional(),
  rules: z.array(z.object({
    type: z.enum(['entry_alert', 'exit_alert', 'time_limit', 'group_size_limit']),
    condition: z.string(),
    action: z.string(),
    severity: z.enum(['info', 'warning', 'alert', 'emergency']),
  })).optional(),
  isActive: z.boolean().default(true),
});

export const zoneUpdateSchema = zoneCreateSchema.partial();

export const zoneSearchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(['geofence', 'poi', 'restricted', 'safe', 'tourist_spot', 'emergency']).optional(),
  riskLevel: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
  bounds: z.object({
    north: latitudeSchema,
    south: latitudeSchema,
    east: longitudeSchema,
    west: longitudeSchema,
  }).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'createdAt', 'riskLevel', 'type']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// ==================== LOCATION & TRACKING SCHEMAS ====================

export const locationUpdateSchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    altitude: z.number().optional(),
    accuracy: z.number().min(0).optional(),
    heading: z.number().min(0).max(360).optional(),
    speed: z.number().min(0).optional(),
  }),
  timestamp: z.string().min(1, 'Timestamp is required'),
  source: z.enum(['gps', 'network', 'manual', 'iot_device']).default('gps'),
  batteryLevel: z.number().min(0).max(100).optional(),
  isEmergency: z.boolean().default(false),
});

export const trackingPreferencesSchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  enabled: z.boolean().default(true),
  frequency: z.enum(['real_time', 'high', 'medium', 'low']).default('medium'),
  shareWithFamily: z.boolean().default(false),
  shareWithAuthorities: z.boolean().default(true),
  geofenceAlerts: z.boolean().default(true),
  offlineMode: z.boolean().default(false),
  privacyMode: z.boolean().default(false),
  autoEmergency: z.object({
    enabled: z.boolean().default(true),
    inactivityThreshold: z.number().min(5).max(1440).default(60), // minutes
    noMovementThreshold: z.number().min(5).max(1440).default(30), // minutes
    outsideSafeZoneThreshold: z.number().min(5).max(1440).default(15), // minutes
  }).optional(),
});

// ==================== ANALYTICS SCHEMAS ====================

export const analyticsQuerySchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  metrics: z.array(z.enum([
    'tourist_count',
    'alert_count',
    'safety_score_avg',
    'response_time_avg',
    'resolution_rate',
    'zone_violations',
    'emergency_alerts',
  ])).optional(),
  filters: z.object({
    touristType: z.enum(['domestic', 'international']).optional(),
    alertType: z.enum(Object.values(ALERT_TYPES) as [string, ...string[]]).optional(),
    zone: z.string().optional(),
    department: z.string().optional(),
  }).optional(),
  groupBy: z.array(z.enum([
    'tourist_type',
    'nationality',
    'age_group',
    'zone',
    'alert_type',
    'priority',
  ])).optional(),
});

export const reportGenerationSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'custom', 'incident', 'tourist_summary']),
  format: z.enum(['pdf', 'excel', 'csv']).default('pdf'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  sections: z.array(z.enum([
    'overview',
    'tourist_statistics',
    'alert_summary',
    'zone_analysis',
    'response_metrics',
    'recommendations',
  ])).optional(),
  filters: z.object({
    departments: z.array(z.string()).optional(),
    zones: z.array(z.string()).optional(),
    alertTypes: z.array(z.enum(Object.values(ALERT_TYPES) as [string, ...string[]])).optional(),
    priorities: z.array(z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]])).optional(),
  }).optional(),
  recipients: z.array(z.object({
    email: emailSchema,
    name: z.string().min(1, 'Name is required'),
    role: z.string().optional(),
  })).optional(),
});

// ==================== NOTIFICATION SCHEMAS ====================

export const notificationSchema = z.object({
  type: z.enum(['alert', 'system', 'reminder', 'update', 'emergency']),
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  recipients: z.array(z.object({
    userId: z.string().min(1, 'User ID is required'),
    channels: z.array(z.enum(['push', 'email', 'sms', 'in_app'])),
  })).min(1, 'At least one recipient is required'),
  data: z.record(z.any()).optional(),
  scheduleAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const notificationPreferencesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  channels: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    inApp: z.boolean().default(true),
  }),
  categories: z.object({
    emergency: z.boolean().default(true),
    alerts: z.boolean().default(true),
    updates: z.boolean().default(true),
    reminders: z.boolean().default(true),
    system: z.boolean().default(false),
  }),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  }).optional(),
});

// ==================== SETTINGS SCHEMAS ====================

export const systemSettingsSchema = z.object({
  general: z.object({
    siteName: z.string().min(1, 'Site name is required'),
    siteDescription: z.string().optional(),
    contactEmail: emailSchema,
    supportPhone: phoneSchema,
    timezone: z.string().min(1, 'Timezone is required'),
    defaultLanguage: z.string().default('en'),
    maintenance: z.boolean().default(false),
  }),
  security: z.object({
    sessionTimeout: z.number().min(15).max(1440).default(60), // minutes
    maxLoginAttempts: z.number().min(3).max(10).default(5),
    passwordExpiry: z.number().min(30).max(365).default(90), // days
    twoFactorRequired: z.boolean().default(false),
  }),
  tracking: z.object({
    defaultUpdateInterval: z.number().min(30).max(3600).default(300), // seconds
    maxHistoryDays: z.number().min(30).max(365).default(90),
    enableRealTimeTracking: z.boolean().default(true),
    enableGeofencing: z.boolean().default(true),
  }),
  alerts: z.object({
    autoEscalationEnabled: z.boolean().default(true),
    escalationThreshold: z.number().min(5).max(60).default(15), // minutes
    maxResponseTime: z.number().min(10).max(120).default(30), // minutes
    enableSmsAlerts: z.boolean().default(true),
    enableEmailAlerts: z.boolean().default(true),
  }),
  blockchain: z.object({
    enabled: z.boolean().default(false),
    network: z.enum(['mainnet', 'testnet', 'polygon']).default('testnet'),
    autoVerification: z.boolean().default(true),
    gasLimit: z.number().min(100000).max(1000000).default(500000),
  }),
});

// ==================== FILE UPLOAD SCHEMAS ====================

export const fileUploadSchema = z.object({
  files: z.array(z.object({
    name: z.string().min(1, 'Filename is required'),
    type: z.string().min(1, 'File type is required'),
    size: z.number().min(1, 'File size is required').max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  })).min(1, 'At least one file is required').max(10, 'Maximum 10 files allowed'),
  category: z.enum(['identity', 'medical', 'travel', 'emergency', 'evidence']),
  description: z.string().max(200).optional(),
});

// ==================== SEARCH & FILTER SCHEMAS ====================

export const globalSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['all', 'tourists', 'alerts', 'zones', 'users']).default('all'),
  limit: z.number().min(1).max(50).default(10),
});

export const dashboardFiltersSchema = z.object({
  dateRange: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    preset: z.enum(['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'last_month', 'custom']).optional(),
  }),
  departments: z.array(z.string()).optional(),
  zones: z.array(z.string()).optional(),
  alertTypes: z.array(z.enum(Object.values(ALERT_TYPES) as [string, ...string[]])).optional(),
  priorities: z.array(z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]])).optional(),
  touristTypes: z.array(z.enum(['domestic', 'international'])).optional(),
  safetyScoreRange: z.object({
    min: z.number().min(0).max(100).optional(),
    max: z.number().min(0).max(100).optional(),
  }).optional(),
});

// ==================== EXPORT SCHEMAS ====================

export const exportSchema = z.object({
  type: z.enum(['tourists', 'alerts', 'zones', 'analytics']),
  format: z.enum(['csv', 'excel', 'json']).default('csv'),
  filters: z.record(z.any()).optional(),
  columns: z.array(z.string()).optional(),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

// ==================== TYPE EXPORTS ====================

// Export types for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TouristRegistrationData = z.infer<typeof touristRegistrationSchema>;
export type AlertCreateData = z.infer<typeof alertCreateSchema>;
export type ZoneCreateData = z.infer<typeof zoneCreateSchema>;
export type LocationUpdateData = z.infer<typeof locationUpdateSchema>;
export type AnalyticsQueryData = z.infer<typeof analyticsQuerySchema>;
export type NotificationData = z.infer<typeof notificationSchema>;
export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;

// Common validation functions
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validatePhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

export function validateCoordinates(lat: number, lon: number): boolean {
  return latitudeSchema.safeParse(lat).success && longitudeSchema.safeParse(lon).success;
}

export function validateBlockchainAddress(address: string): boolean {
  return blockchainAddressSchema.safeParse(address).success;
}