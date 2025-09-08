/**
 * Smart Tourist Safety System - Authentication Types
 * Type definitions for authentication, user management, and JWT handling
 */

// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = 'super_admin' | 'tourism_admin' | 'police_admin' | 'operator' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  phone: string;
  permissions: string[];
  preferences: UserPreferences;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    alertTypes: string[];
  };
  dashboard: {
    layout: 'compact' | 'comfortable' | 'spacious';
    defaultView: 'overview' | 'tourists' | 'alerts' | 'zones';
    refreshInterval: number;
  };
}

// ============================================================================
// AUTHENTICATION STATE TYPES
// ============================================================================

export interface AuthState {
  // Authentication status
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // User data
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  
  // Session data
  sessionId: string | null;
  lastActivity: string | null;
  expiresAt: string | null;
  
  // Error handling
  error: string | null;
  loginAttempts: number;
  isLocked: boolean;
  lockoutUntil: string | null;
}

// ============================================================================
// AUTHENTICATION ACTIONS
// ============================================================================

export interface AuthActions {
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  refreshToken: () => Promise<void>;
  
  // Session management
  initializeAuth: () => Promise<void>;
  clearAuth: () => void;
  extendSession: () => void;
  
  // User management
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  
  // Password reset
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (resetData: ResetPasswordData) => Promise<void>;
  
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: UserRole;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: UserRole;
  department: string;
  badge?: string;
  acceptTerms: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

// ============================================================================
// JWT TOKEN TYPES
// ============================================================================

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  permissions: string[];
  sessionId: string;
  iat: number; // issued at
  exp: number; // expires at
  iss: string; // issuer
  aud: string; // audience
}

export interface RefreshTokenPayload {
  sub: string; // user ID
  sessionId: string;
  type: 'refresh';
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// ============================================================================
// PERMISSION TYPES
// ============================================================================

export type Permission = 
  // Tourist management
  | 'tourists.view'
  | 'tourists.create'
  | 'tourists.edit'
  | 'tourists.delete'
  | 'tourists.export'
  
  // Alert management
  | 'alerts.view'
  | 'alerts.create'
  | 'alerts.edit'
  | 'alerts.resolve'
  | 'alerts.delete'
  | 'alerts.assign'
  
  // Zone management
  | 'zones.view'
  | 'zones.create'
  | 'zones.edit'
  | 'zones.delete'
  | 'zones.configure'
  
  // Blockchain operations
  | 'blockchain.view'
  | 'blockchain.generate_identity'
  | 'blockchain.verify_identity'
  | 'blockchain.manage_contracts'
  
  // Analytics & Reports
  | 'analytics.view'
  | 'analytics.export'
  | 'reports.generate'
  | 'reports.schedule'
  
  // System administration
  | 'system.manage_users'
  | 'system.manage_roles'
  | 'system.view_logs'
  | 'system.configure'
  | 'system.backup'
  
  // Emergency response
  | 'emergency.respond'
  | 'emergency.escalate'
  | 'emergency.coordinate';

export interface RolePermissions {
  admin: Permission[];
  operator: Permission[];
  viewer: Permission[];
}

// ============================================================================
// SESSION TYPES
// ============================================================================

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
}

export interface DeviceInfo {
  type: 'web' | 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  version: string;
  isTrusted: boolean;
}

// ============================================================================
// ACTIVITY TYPES
// ============================================================================

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

export type ActivityAction = 
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'password_change'
  | 'view_tourist'
  | 'create_tourist'
  | 'update_tourist'
  | 'delete_tourist'
  | 'view_alert'
  | 'create_alert'
  | 'resolve_alert'
  | 'view_zone'
  | 'create_zone'
  | 'update_zone'
  | 'delete_zone'
  | 'generate_identity'
  | 'verify_identity'
  | 'export_data'
  | 'system_config';

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormValidationState {
  isValid: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

// ============================================================================
// SECURITY TYPES
// ============================================================================

export interface SecuritySettings {
  mfa: {
    enabled: boolean;
    method: 'sms' | 'email' | 'authenticator';
    backupCodes: string[];
  };
  sessions: {
    maxActiveSessions: number;
    sessionTimeout: number; // minutes
    extendOnActivity: boolean;
  };
  passwords: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    preventReuse: number;
    expiryDays: number;
  };
  access: {
    ipWhitelist: string[];
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
    requireDeviceVerification: boolean;
  };
}

// ============================================================================
// OAUTH TYPES (for potential Google/social login)
// ============================================================================

export interface OAuthProvider {
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  enabled: boolean;
}

export interface OAuthCredentials {
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  profile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    verified: boolean;
  };
}

// ============================================================================
// AUDIT TYPES
// ============================================================================

export interface AuditLog {
  id: string;
  userId: string;
  sessionId: string;
  action: ActivityAction;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isValidRole = (role: string): role is UserRole => {
  return ['admin', 'operator', 'viewer'].includes(role);
};

export const isValidStatus = (status: string): status is UserStatus => {
  return ['active', 'inactive', 'suspended', 'pending_verification'].includes(status);
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user || user.status !== 'active') return false;
  return user.permissions.includes(permission);
};

export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user || user.status !== 'active') return false;
  return permissions.some(permission => user.permissions.includes(permission));
};

export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user || user.status !== 'active') return false;
  return user.role === role;
};

export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user || user.status !== 'active') return false;
  return roles.includes(user.role);
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const defaultUserPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  notifications: {
    email: true,
    sms: true,
    push: true,
    alertTypes: ['emergency', 'critical'],
  },
  dashboard: {
    layout: 'comfortable',
    defaultView: 'overview',
    refreshInterval: 30,
  },
};

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  user: null,
  token: null,
  refreshToken: null,
  sessionId: null,
  lastActivity: null,
  expiresAt: null,
  error: null,
  loginAttempts: 0,
  isLocked: false,
  lockoutUntil: null,
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AuthStore = AuthState & AuthActions;

export type UserWithoutSensitiveData = Omit<User, 'permissions'>;

export type PublicUser = Pick<User, 'id' | 'displayName' | 'avatar' | 'role' | 'department'>;

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================
// All types are already exported inline above
