// backend/src/lib/validations.ts

import { z } from 'zod';

/**
 * Smart Tourist Safety System - Backend Validation Schemas
 * Comprehensive Zod schemas for API request/response validation
 */

// ==================== CONSTANTS & TYPES ====================

// User Roles
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TOURISM_ADMIN: 'tourism_admin',
  POLICE_ADMIN: 'police_admin',
  MEDICAL_ADMIN: 'medical_admin',
  OPERATOR: 'operator',
  FIELD_AGENT: 'field_agent',
  VIEWER: 'viewer',
  TOURIST: 'tourist',
} as const;

// Alert Types
const ALERT_TYPES = {
  CRITICAL_EMERGENCY: 'critical_emergency',
  MEDICAL_EMERGENCY: 'medical_emergency',
  SECURITY_THREAT: 'security_threat',
  NATURAL_DISASTER: 'natural_disaster',
  MISSING_PERSON: 'missing_person',
  PANIC_BUTTON: 'panic_button',
  ACCIDENT: 'accident',
  VIOLENCE: 'violence',
  GEOFENCE_VIOLATION: 'geofence_violation',
  ANOMALY_DETECTED: 'anomaly_detected',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  WEATHER_WARNING: 'weather_warning',
  SYSTEM_ALERT: 'system_alert',
  MAINTENANCE: 'maintenance',
  INFORMATION: 'information',
  ROUTINE_CHECK: 'routine_check',
} as const;

// Alert Priorities
const ALERT_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Alert Status
const ALERT_STATUS = {
  ACTIVE: 'active',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  FALSE_ALARM: 'false_alarm',
  ESCALATED: 'escalated',
} as const;

// Validation Rules
const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
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

export const coordinateSchema = z.number();

export const latitudeSchema = coordinateSchema
  .refine((val) => val >= -90 && val <= 90, 'Latitude must be between -90 and 90');

export const longitudeSchema = coordinateSchema
  .refine((val) => val >= -180 && val <= 180, 'Longitude must be between -180 and 180');

export const blockchainAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid blockchain address format');

export const pincodeSchema = z
  .string()
  .regex(VALIDATION_RULES.pincode.pattern, VALIDATION_RULES.pincode.message);

export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format');

export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId format');

// ==================== AUTHENTICATION SCHEMAS ====================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['super_admin', 'tourism_admin', 'police_admin', 'operator', 'viewer']).default('operator'),
  rememberMe: z.boolean().optional().default(false),
  captcha: z.string().optional(),
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

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// ==================== USER MANAGEMENT SCHEMAS ====================

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
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }).optional(),
  emergencyContacts: z.array(z.object({
    name: nameSchema,
    relationship: z.string().min(1, 'Relationship is required'),
    phone: phoneSchema,
    email: emailSchema.optional(),
  })).optional(),
});

export const userCreateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum([
    USER_ROLES.TOURISM_ADMIN,
    USER_ROLES.POLICE_ADMIN,
    USER_ROLES.MEDICAL_ADMIN,
    USER_ROLES.OPERATOR,
    USER_ROLES.FIELD_AGENT,
    USER_ROLES.VIEWER
  ]),
  department: z.string().min(1, 'Department is required'),
  badge: z.string().optional(),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).optional(),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ email: true });

export const userSearchSchema = z.object({
  query: z.string().optional(),
  role: z.enum(Object.values(USER_ROLES) as [string, ...string[]]).optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ==================== TOURIST SCHEMAS ====================

const baseTouristSchema = z.object({
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
  identityDocument: z.string().optional(), // File URL or base64
  secondaryDocument: z.string().optional(), // Additional verification document
  
  // Travel Information
  visitorType: z.enum(['domestic', 'international']),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  accommodation: z.object({
    name: z.string().min(1, 'Accommodation name is required'),
    address: z.string().min(1, 'Accommodation address is required'),
    phone: phoneSchema.optional(),
    coordinates: z.object({
      latitude: latitudeSchema,
      longitude: longitudeSchema,
    }).optional(),
  }),
  purposeOfVisit: z.enum(['tourism', 'business', 'education', 'medical', 'pilgrimage', 'sports', 'other']),
  itinerary: z.array(z.object({
    location: z.string().min(1, 'Location is required'),
    date: z.string().min(1, 'Date is required'),
    activities: z.array(z.string()),
    coordinates: z.object({
      latitude: latitudeSchema,
      longitude: longitudeSchema,
    }).optional(),
  })).optional(),
  
  // Emergency Contacts
  emergencyContacts: z.array(z.object({
    name: nameSchema,
    relationship: z.string().min(1, 'Relationship is required'),
    phone: phoneSchema,
    email: emailSchema.optional(),
    address: z.string().optional(),
  })).min(1, 'At least one emergency contact is required'),
  
  // Medical Information
  medicalInfo: z.object({
    conditions: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    medicalCertificate: z.string().optional(), // File URL for medical clearance
    insuranceDetails: z.object({
      provider: z.string().optional(),
      policyNumber: z.string().optional(),
      coverage: z.string().optional(),
    }).optional(),
  }).optional(),
  
  // Transportation
  transportInfo: z.object({
    mode: z.enum(['flight', 'train', 'bus', 'car', 'other']).optional(),
    details: z.string().optional(),
    arrivalInfo: z.object({
      datetime: z.string().optional(),
      location: z.string().optional(),
    }).optional(),
    departureInfo: z.object({
      datetime: z.string().optional(),
      location: z.string().optional(),
    }).optional(),
  }).optional(),
  
  // Preferences & Special Requirements
  preferences: z.object({
    language: z.string().default('en'),
    dietaryRestrictions: z.array(z.string()).optional(),
    accessibility: z.array(z.string()).optional(),
    specialRequirements: z.string().optional(),
    culturalSensitivities: z.array(z.string()).optional(),
  }).optional(),
  
  // Digital Identity & Blockchain
  digitalIdentity: z.object({
    walletAddress: blockchainAddressSchema.optional(),
    digitalIdHash: z.string().optional(),
    verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
    biometricHash: z.string().optional(),
  }).optional(),
  
  // Consent & Privacy
  consent: z.object({
    dataProcessing: z.boolean(),
    locationTracking: z.boolean(),
    emergencySharing: z.boolean(),
    medicalDataSharing: z.boolean().default(false),
    marketingCommunications: z.boolean().default(false),
  }),
});

export const touristRegistrationSchema = baseTouristSchema.refine(
  (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  }
);

export const touristUpdateSchema = baseTouristSchema.partial().omit({
  identityType: true,
  identityNumber: true,
});

export const touristSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['active', 'inactive', 'expired', 'suspended']).optional(),
  visitorType: z.enum(['domestic', 'international']).optional(),
  nationality: z.string().optional(),
  checkInDateFrom: z.string().optional(),
  checkInDateTo: z.string().optional(),
  safetyScoreMin: z.number().min(0).max(100).optional(),
  safetyScoreMax: z.number().min(0).max(100).optional(),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    radius: z.number().min(0).max(100).optional(), // km
  }).optional(),
  department: z.string().optional(),
  assignedOfficer: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'firstName', 'checkInDate', 'safetyScore', 'lastSeen']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const touristStatusUpdateSchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  status: z.enum(['active', 'inactive', 'expired', 'suspended']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// ==================== BLOCKCHAIN & DIGITAL IDENTITY SCHEMAS ====================

export const digitalIdentitySchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  identityHash: z.string().min(1, 'Identity hash is required'),
  biometricHash: z.string().optional(),
  documentHashes: z.array(z.string()).optional(),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  issuerAddress: blockchainAddressSchema,
  metadata: z.object({
    fullName: z.string(),
    nationality: z.string(),
    documentType: z.string(),
    documentNumber: z.string(),
    emergencyContact: z.string(),
    medicalInfo: z.string().optional(),
  }),
});

export const blockchainVerificationSchema = z.object({
  digitalId: z.string().min(1, 'Digital ID is required'),
  signature: z.string().min(1, 'Signature is required'),
  timestamp: z.number().min(1, 'Timestamp is required'),
  verifierAddress: blockchainAddressSchema,
});

export const smartContractDeploySchema = z.object({
  contractType: z.enum(['identity', 'verification', 'emergency', 'logging']),
  network: z.enum(['mainnet', 'polygon', 'testnet']),
  gasLimit: z.number().min(100000).max(1000000).default(500000),
  parameters: z.record(z.any()).optional(),
});

// ==================== ALERT & INCIDENT SCHEMAS ====================

export const alertCreateSchema = z.object({
  type: z.enum(Object.values(ALERT_TYPES) as [string, ...string[]]),
  priority: z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]]),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  touristId: z.string().min(1, 'Tourist ID is required'),
  reportedBy: z.string().optional(), // User ID who reported
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    address: z.string().optional(),
    accuracy: z.number().optional(),
    source: z.enum(['gps', 'manual', 'network', 'witness']).default('manual'),
  }).optional(),
  metadata: z.record(z.any()).optional(),
  attachments: z.array(z.object({
    type: z.enum(['image', 'video', 'audio', 'document']),
    url: z.string().url(),
    filename: z.string(),
    size: z.number(),
    mimeType: z.string(),
    description: z.string().optional(),
  })).optional(),
  witnesses: z.array(z.object({
    name: z.string().optional(),
    phone: phoneSchema.optional(),
    statement: z.string().optional(),
  })).optional(),
  severity: z.enum(['minor', 'moderate', 'major', 'critical']).default('moderate'),
  source: z.enum(['tourist_app', 'admin_panel', 'field_agent', 'system', 'third_party']).default('admin_panel'),
});

export const alertUpdateSchema = z.object({
  status: z.enum(Object.values(ALERT_STATUS) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]]).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  assignedTo: z.string().optional(),
  assignedTeam: z.array(z.string()).optional(),
  resolution: z.string().max(2000, 'Resolution must be less than 2000 characters').optional(),
  resolutionTime: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  escalationLevel: z.number().min(0).max(5).optional(),
  notes: z.array(z.object({
    content: z.string().min(1, 'Note content is required'),
    author: z.string().min(1, 'Author is required'),
    timestamp: z.string().min(1, 'Timestamp is required'),
    type: z.enum(['update', 'escalation', 'resolution', 'follow_up']).default('update'),
  })).optional(),
  responseActions: z.array(z.object({
    action: z.string().min(1, 'Action is required'),
    assignedTo: z.string().optional(),
    deadline: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  })).optional(),
});

export const alertSearchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(Object.values(ALERT_TYPES) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]]).optional(),
  status: z.enum(Object.values(ALERT_STATUS) as [string, ...string[]]).optional(),
  severity: z.enum(['minor', 'moderate', 'major', 'critical']).optional(),
  touristId: z.string().optional(),
  assignedTo: z.string().optional(),
  reportedBy: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    radius: z.number().min(0).max(50).optional(), // km
  }).optional(),
  department: z.string().optional(),
  escalationLevel: z.number().min(0).max(5).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'priority', 'status', 'type', 'severity']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const emergencyAlertSchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  location: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    accuracy: z.number().optional(),
    timestamp: z.string().optional(),
    source: z.enum(['gps', 'network', 'manual']).default('gps'),
  }),
  type: z.enum(['panic_button', 'medical_emergency', 'security_threat', 'natural_disaster', 'accident']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('high'),
  description: z.string().max(1000).optional(),
  audioRecording: z.string().optional(), // Base64 or URL
  photos: z.array(z.string()).optional(), // URLs or Base64
  vitals: z.object({
    heartRate: z.number().optional(),
    bloodPressure: z.string().optional(),
    bodyTemperature: z.number().optional(),
  }).optional(),
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string().optional(),
    notified: z.boolean().default(false),
    notificationTime: z.string().optional(),
  })).optional(),
  automaticTrigger: z.object({
    trigger: z.enum(['fall_detection', 'no_movement', 'geofence_violation', 'manual']),
    confidence: z.number().min(0).max(1).optional(),
  }).optional(),
});

// ==================== ZONE & GEOFENCING SCHEMAS ====================

export const zoneCreateSchema = z.object({
  name: z.string().min(1, 'Zone name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  type: z.enum(['geofence', 'poi', 'restricted', 'safe', 'tourist_spot', 'emergency', 'medical', 'police', 'transport']),
  category: z.string().optional(),
  riskLevel: z.number().min(1).max(5),
  geometry: z.object({
    type: z.enum(['Point', 'Polygon', 'Circle']),
    coordinates: z.array(z.array(z.number())).min(1, 'Coordinates are required'),
    radius: z.number().optional(), // For circles in meters
  }),
  properties: z.object({
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
    fillColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid fill color format').optional(),
    strokeWidth: z.number().min(1).max(10).optional(),
    opacity: z.number().min(0).max(1).optional(),
    icon: z.string().optional(),
  }).optional(),
  metadata: z.object({
    category: z.string().optional(),
    subcategory: z.string().optional(),
    openingHours: z.string().optional(),
    contact: z.string().optional(),
    website: z.string().url().optional(),
    capacity: z.number().optional(),
    facilities: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    accessibility: z.array(z.string()).optional(),
    ratings: z.object({
      safety: z.number().min(0).max(5).optional(),
      cleanliness: z.number().min(0).max(5).optional(),
      accessibility: z.number().min(0).max(5).optional(),
    }).optional(),
  }).optional(),
  rules: z.array(z.object({
    type: z.enum(['entry_alert', 'exit_alert', 'time_limit', 'group_size_limit', 'activity_restriction']),
    condition: z.string(),
    action: z.string(),
    severity: z.enum(['info', 'warning', 'alert', 'emergency']),
    message: z.string().optional(),
    autoTrigger: z.boolean().default(true),
  })).optional(),
  schedule: z.object({
    timezone: z.string().optional(),
    operatingHours: z.array(z.object({
      day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().default(false),
    })).optional(),
    seasonalVariations: z.array(z.object({
      startDate: z.string(),
      endDate: z.string(),
      changes: z.record(z.any()),
    })).optional(),
  }).optional(),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  assignedOfficers: z.array(z.string()).optional(),
});

export const zoneUpdateSchema = zoneCreateSchema.partial();

export const zoneSearchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(['geofence', 'poi', 'restricted', 'safe', 'tourist_spot', 'emergency', 'medical', 'police', 'transport']).optional(),
  category: z.string().optional(),
  riskLevel: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
  bounds: z.object({
    north: latitudeSchema,
    south: latitudeSchema,
    east: longitudeSchema,
    west: longitudeSchema,
  }).optional(),
  createdBy: z.string().optional(),
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
  source: z.enum(['gps', 'network', 'manual', 'iot_device', 'bluetooth', 'wifi']).default('gps'),
  deviceInfo: z.object({
    deviceId: z.string().optional(),
    batteryLevel: z.number().min(0).max(100).optional(),
    signalStrength: z.number().optional(),
    connectionType: z.string().optional(),
  }).optional(),
  context: z.object({
    activity: z.enum(['stationary', 'walking', 'running', 'driving', 'cycling', 'unknown']).optional(),
    confidence: z.number().min(0).max(1).optional(),
    indoors: z.boolean().optional(),
  }).optional(),
  isEmergency: z.boolean().default(false),
  verified: z.boolean().default(false),
});

export const trackingPreferencesSchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  enabled: z.boolean().default(true),
  frequency: z.enum(['real_time', 'high', 'medium', 'low', 'minimal']).default('medium'),
  precision: z.enum(['exact', 'approximate', 'general']).default('approximate'),
  shareWithFamily: z.boolean().default(false),
  shareWithAuthorities: z.boolean().default(true),
  shareWithTourGuides: z.boolean().default(false),
  geofenceAlerts: z.boolean().default(true),
  offlineMode: z.boolean().default(false),
  privacyMode: z.boolean().default(false),
  autoEmergency: z.object({
    enabled: z.boolean().default(true),
    inactivityThreshold: z.number().min(5).max(1440).default(60), // minutes
    noMovementThreshold: z.number().min(5).max(1440).default(30), // minutes
    outsideSafeZoneThreshold: z.number().min(5).max(1440).default(15), // minutes
    lowBatteryThreshold: z.number().min(5).max(50).default(15), // percentage
  }).optional(),
  notifications: z.object({
    zoneEntry: z.boolean().default(true),
    zoneExit: z.boolean().default(true),
    safetyConcerns: z.boolean().default(true),
    emergencyAlerts: z.boolean().default(true),
    weatherWarnings: z.boolean().default(true),
  }).optional(),
});

export const locationHistorySchema = z.object({
  touristId: z.string().min(1, 'Tourist ID is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  granularity: z.enum(['minute', 'hour', 'day']).default('hour'),
  includeStops: z.boolean().default(true),
  includeRoutes: z.boolean().default(true),
  format: z.enum(['json', 'geojson', 'csv']).default('json'),
});

// ==================== ANALYTICS & REPORTING SCHEMAS ====================

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
    'zone_popularity',
    'incident_frequency',
    'officer_workload',
  ])).optional(),
  dimensions: z.array(z.enum([
    'tourist_type',
    'nationality',
    'age_group',
    'zone',
    'alert_type',
    'priority',
    'department',
    'time_of_day',
    'day_of_week',
  ])).optional(),
  filters: z.object({
    touristTypes: z.array(z.enum(['domestic', 'international'])).optional(),
    nationalities: z.array(z.string()).optional(),
    alertTypes: z.array(z.enum(Object.values(ALERT_TYPES) as [string, ...string[]])).optional(),
    priorities: z.array(z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]])).optional(),
    zones: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    ageGroups: z.array(z.string()).optional(),
  }).optional(),
  compareWithPrevious: z.boolean().default(false),
  includeTrends: z.boolean().default(true),
});

export const reportGenerationSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom', 'incident', 'tourist_summary', 'zone_analysis']),
  format: z.enum(['pdf', 'excel', 'csv', 'json']).default('pdf'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  sections: z.array(z.enum([
    'executive_summary',
    'tourist_statistics',
    'alert_summary',
    'zone_analysis',
    'response_metrics',
    'safety_trends',
    'recommendations',
    'incident_analysis',
    'resource_utilization',
    'comparative_analysis',
  ])).optional(),
  filters: z.object({
    departments: z.array(z.string()).optional(),
    zones: z.array(z.string()).optional(),
    alertTypes: z.array(z.enum(Object.values(ALERT_TYPES) as [string, ...string[]])).optional(),
    priorities: z.array(z.enum(Object.values(ALERT_PRIORITY) as [string, ...string[]])).optional(),
    touristTypes: z.array(z.enum(['domestic', 'international'])).optional(),
    officers: z.array(z.string()).optional(),
  }).optional(),
  recipients: z.array(z.object({
    email: emailSchema,
    name: z.string().min(1, 'Name is required'),
    role: z.string().optional(),
    department: z.string().optional(),
  })).optional(),
  schedule: z.object({
    frequency: z.enum(['once', 'daily', 'weekly', 'monthly']).default('once'),
    time: z.string().optional(),
    dayOfWeek: z.number().min(0).max(6).optional(),
    dayOfMonth: z.number().min(1).max(31).optional(),
  }).optional(),
});

// ==================== NOTIFICATION SCHEMAS ====================

export const notificationSchema = z.object({
  type: z.enum(['alert', 'system', 'reminder', 'update', 'emergency', 'weather', 'zone', 'tourist']),
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(1000),
  recipients: z.array(z.object({
    userId: z.string().min(1, 'User ID is required'),
    channels: z.array(z.enum(['push', 'email', 'sms', 'in_app', 'voice'])),
    customization: z.object({
      language: z.string().optional(),
      urgency: z.enum(['low', 'normal', 'high', 'critical']).optional(),
    }).optional(),
  })).min(1, 'At least one recipient is required'),
  data: z.record(z.any()).optional(),
  attachments: z.array(z.object({
    type: z.enum(['image', 'document', 'audio']),
    url: z.string().url(),
    name: z.string(),
  })).optional(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  scheduleAt: z.string().optional(),
  expiresAt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const notificationPreferencesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  channels: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    inApp: z.boolean().default(true),
    voice: z.boolean().default(false),
  }),
  categories: z.object({
    emergency: z.boolean().default(true),
    alerts: z.boolean().default(true),
    updates: z.boolean().default(true),
    reminders: z.boolean().default(true),
    system: z.boolean().default(false),
    weather: z.boolean().default(true),
    zone: z.boolean().default(true),
    tourist: z.boolean().default(true),
  }),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    timezone: z.string().optional(),
  }).optional(),
  language: z.string().default('en'),
  frequency: z.object({
    digest: z.enum(['never', 'daily', 'weekly']).default('daily'),
    realTime: z.boolean().default(true),
  }).optional(),
});

// ==================== SYSTEM SETTINGS SCHEMAS ====================

export const systemSettingsSchema = z.object({
  general: z.object({
    siteName: z.string().min(1, 'Site name is required'),
    siteDescription: z.string().optional(),
    contactEmail: emailSchema,
    supportPhone: phoneSchema,
    timezone: z.string().min(1, 'Timezone is required'),
    defaultLanguage: z.string().default('en'),
    supportedLanguages: z.array(z.string()).default(['en']),
    maintenance: z.boolean().default(false),
    maintenanceMessage: z.string().optional(),
  }),
  security: z.object({
    sessionTimeout: z.number().min(15).max(1440).default(60), // minutes
    maxLoginAttempts: z.number().min(3).max(10).default(5),
    passwordExpiry: z.number().min(30).max(365).default(90), // days
    twoFactorRequired: z.boolean().default(false),
    ipWhitelist: z.array(z.string()).optional(),
    allowedDomains: z.array(z.string()).optional(),
    encryptionKey: z.string().optional(),
  }),
  tracking: z.object({
    defaultUpdateInterval: z.number().min(30).max(3600).default(300), // seconds
    maxHistoryDays: z.number().min(30).max(365).default(90),
    enableRealTimeTracking: z.boolean().default(true),
    enableGeofencing: z.boolean().default(true),
    locationAccuracy: z.enum(['low', 'medium', 'high']).default('medium'),
    dataRetentionDays: z.number().min(90).max(2555).default(365), // days
  }),
  alerts: z.object({
    autoEscalationEnabled: z.boolean().default(true),
    escalationThreshold: z.number().min(5).max(60).default(15), // minutes
    maxResponseTime: z.number().min(10).max(120).default(30), // minutes
    enableSmsAlerts: z.boolean().default(true),
    enableEmailAlerts: z.boolean().default(true),
    enablePushNotifications: z.boolean().default(true),
    criticalAlertChannels: z.array(z.enum(['sms', 'email', 'push', 'voice'])).default(['sms', 'push']),
  }),
  blockchain: z.object({
    enabled: z.boolean().default(false),
    network: z.enum(['mainnet', 'testnet', 'polygon']).default('testnet'),
    autoVerification: z.boolean().default(true),
    gasLimit: z.number().min(100000).max(1000000).default(500000),
    walletAddress: blockchainAddressSchema.optional(),
    privateKey: z.string().optional(),
  }),
  integration: z.object({
    weatherApi: z.object({
      enabled: z.boolean().default(true),
      provider: z.string().optional(),
      apiKey: z.string().optional(),
    }).optional(),
    mapsApi: z.object({
      provider: z.enum(['google', 'mapbox', 'openstreetmap']).default('openstreetmap'),
      apiKey: z.string().optional(),
    }).optional(),
    emergencyServices: z.object({
      enabled: z.boolean().default(true),
      endpoints: z.array(z.object({
        service: z.string(),
        url: z.string().url(),
        apiKey: z.string().optional(),
      })).optional(),
    }).optional(),
  }),
});

// ==================== FILE UPLOAD SCHEMAS ====================

export const fileUploadSchema = z.object({
  files: z.array(z.object({
    name: z.string().min(1, 'Filename is required'),
    type: z.string().min(1, 'File type is required'),
    size: z.number().min(1, 'File size is required').max(10 * 1024 * 1024, 'File size must be less than 10MB'),
    content: z.string().optional(), // Base64 content
  })).min(1, 'At least one file is required').max(20, 'Maximum 20 files allowed'),
  category: z.enum(['identity', 'medical', 'travel', 'emergency', 'evidence', 'report', 'profile']),
  description: z.string().max(500).optional(),
  touristId: z.string().optional(),
  alertId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const bulkUploadSchema = z.object({
  type: z.enum(['tourists', 'zones', 'users']),
  format: z.enum(['csv', 'excel', 'json']),
  file: z.object({
    name: z.string(),
    content: z.string(), // Base64
    size: z.number().max(50 * 1024 * 1024), // 50MB limit
  }),
  options: z.object({
    skipErrors: z.boolean().default(false),
    validateOnly: z.boolean().default(false),
    updateExisting: z.boolean().default(false),
  }).optional(),
});

// ==================== SEARCH & FILTER SCHEMAS ====================

export const globalSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['all', 'tourists', 'alerts', 'zones', 'users']).default('all'),
  filters: z.object({
    dateRange: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional(),
    location: z.object({
      latitude: latitudeSchema,
      longitude: longitudeSchema,
      radius: z.number().min(0).max(100).optional(),
    }).optional(),
    categories: z.array(z.string()).optional(),
  }).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
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
  officers: z.array(z.string()).optional(),
  refresh: z.boolean().default(false),
});

// ==================== EXPORT SCHEMAS ====================

export const exportSchema = z.object({
  type: z.enum(['tourists', 'alerts', 'zones', 'analytics', 'reports']),
  format: z.enum(['csv', 'excel', 'json', 'pdf']).default('csv'),
  filters: z.record(z.any()).optional(),
  columns: z.array(z.string()).optional(),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
  includeArchived: z.boolean().default(false),
  maxRecords: z.number().min(1).max(10000).default(1000),
});

// ==================== API RESPONSE SCHEMAS ====================

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  errors: z.array(z.object({
    field: z.string().optional(),
    message: z.string(),
    code: z.string().optional(),
  })).optional(),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    }).optional(),
    requestId: z.string().optional(),
    timestamp: z.string().optional(),
  }).optional(),
});

// ==================== TYPE EXPORTS ====================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TouristRegistrationData = z.infer<typeof touristRegistrationSchema>;
export type AlertCreateData = z.infer<typeof alertCreateSchema>;
export type ZoneCreateData = z.infer<typeof zoneCreateSchema>;
export type LocationUpdateData = z.infer<typeof locationUpdateSchema>;
export type AnalyticsQueryData = z.infer<typeof analyticsQuerySchema>;
export type NotificationData = z.infer<typeof notificationSchema>;
export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;
export type ApiResponseData = z.infer<typeof apiResponseSchema>;

// ==================== VALIDATION HELPER FUNCTIONS ====================

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

export function validateAadhar(aadhar: string): boolean {
  return aadharSchema.safeParse(aadhar).success;
}

export function validatePincode(pincode: string): boolean {
  return pincodeSchema.safeParse(pincode).success;
}

// ==================== REQUEST VALIDATION MIDDLEWARE HELPERS ====================

export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      }
      req.validatedData = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        errors: [{ message: 'Internal validation error' }],
      });
    }
  };
}

export function createQueryValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      }
      req.validatedQuery = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Query validation error',
        errors: [{ message: 'Internal validation error' }],
      });
    }
  };
}

// ==================== EXPORTS ====================

export default {
  // Authentication
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  verifyTokenSchema,
  
  // User Management
  userProfileSchema,
  userCreateSchema,
  userUpdateSchema,
  userSearchSchema,
  
  // Tourist Management
  touristRegistrationSchema,
  touristUpdateSchema,
  touristSearchSchema,
  touristStatusUpdateSchema,
  
  // Blockchain & Identity
  digitalIdentitySchema,
  blockchainVerificationSchema,
  smartContractDeploySchema,
  
  // Alerts & Incidents
  alertCreateSchema,
  alertUpdateSchema,
  alertSearchSchema,
  emergencyAlertSchema,
  
  // Zones & Geofencing
  zoneCreateSchema,
  zoneUpdateSchema,
  zoneSearchSchema,
  
  // Location & Tracking
  locationUpdateSchema,
  trackingPreferencesSchema,
  locationHistorySchema,
  
  // Analytics & Reporting
  analyticsQuerySchema,
  reportGenerationSchema,
  
  // Notifications
  notificationSchema,
  notificationPreferencesSchema,
  
  // System Settings
  systemSettingsSchema,
  
  // File Uploads
  fileUploadSchema,
  bulkUploadSchema,
  
  // Search & Filters
  globalSearchSchema,
  dashboardFiltersSchema,
  
  // Export
  exportSchema,
  
  // API Responses
  paginationSchema,
  apiResponseSchema,
  
  // Validation Helpers
  validateEmail,
  validatePhone,
  validatePassword,
  validateCoordinates,
  validateBlockchainAddress,
  validateAadhar,
  validatePincode,
  
  // Middleware Helpers
  createValidationMiddleware,
  createQueryValidationMiddleware,
};
