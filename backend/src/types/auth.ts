/**
 * Smart Tourist Safety System - Authentication Types (Backend)
 * Comprehensive type definitions for backend authentication, JWT, and security
 */

// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = 
  | 'super_admin'
  | 'tourism_admin' 
  | 'police_admin'
  | 'medical_admin'
  | 'operator'
  | 'field_agent'
  | 'viewer'
  | 'tourist';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  location?: string;
  permissions: Permission[];
  is_active: boolean;
  is_verified: boolean;
  email_verified_at?: Date;
  phone_verified_at?: Date;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
  
  // Profile information
  profile?: {
    first_name: string;
    last_name: string;
    designation?: string;
    employee_id?: string;
    badge_number?: string;
    emergency_contact?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  
  // Security settings
  security: {
    two_factor_enabled: boolean;
    two_factor_secret?: string;
    backup_codes?: string[];
    last_password_change?: Date;
    password_reset_token?: string;
    password_reset_expires?: Date;
    login_attempts: number;
    locked_until?: Date;
    session_timeout: number;
  };
  
  // Preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      alert_types: string[];
    };
    dashboard: {
      layout: string;
      widgets: string[];
      auto_refresh: boolean;
      refresh_interval: number;
    };
  };
}

// ============================================================================
// PERMISSION TYPES
// ============================================================================

export type Permission = 
  // Dashboard permissions
  | 'view_dashboard'
  | 'manage_dashboard'
  | 'view_analytics'
  | 'export_data'
  
  // Tourist permissions
  | 'view_tourists'
  | 'create_tourist'
  | 'update_tourist'
  | 'delete_tourist'
  | 'view_tourist_details'
  | 'track_tourist'
  
  // Alert permissions
  | 'view_alerts'
  | 'create_alert'
  | 'update_alert'
  | 'delete_alert'
  | 'resolve_alert'
  | 'escalate_alert'
  | 'emergency_response'
  
  // Zone permissions
  | 'view_zones'
  | 'create_zone'
  | 'update_zone'
  | 'delete_zone'
  | 'manage_geofencing'
  
  // Blockchain permissions
  | 'view_blockchain'
  | 'manage_blockchain'
  | 'generate_digital_id'
  | 'verify_digital_id'
  
  // System permissions
  | 'manage_users'
  | 'manage_settings'
  | 'view_logs'
  | 'system_admin';

export interface RoleConfig {
  name: string;
  description: string;
  permissions: Permission[];
  hierarchy: number;
  color: string;
  icon: string;
  department?: string;
  restrictions?: string[];
}

// ============================================================================
// JWT TOKEN TYPES
// ============================================================================

export interface TokenPayload {
  sub: string; // User ID
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  session_id: string;
  iat: number; // Issued at
  exp: number; // Expires at
  iss: string; // Issuer
  aud: string; // Audience
  jti?: string; // JWT ID
  
  // Security context
  ip_address?: string;
  user_agent?: string;
  login_method?: 'password' | 'google' | 'microsoft' | 'sso';
  
  // Additional claims
  department?: string;
  location?: string;
  clearance_level?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  session_id: string;
  token_type: 'refresh';
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  jti: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
  two_factor_code?: string;
  device_info?: {
    type: string;
    os: string;
    browser: string;
    user_agent: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password_hash' | 'security'>;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  requires_two_factor?: boolean;
  session_id?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone?: string;
  role: UserRole;
  department?: string;
  employee_id?: string;
  badge_number?: string;
  accept_terms: boolean;
  
  // Profile data
  profile?: {
    first_name: string;
    last_name: string;
    designation?: string;
    location?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    is_verified: boolean;
  };
  verification_required?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  profile?: Partial<User['profile']>;
  preferences?: Partial<User['preferences']>;
}

// ============================================================================
// SESSION TYPES
// ============================================================================

export interface Session {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  device_info: {
    type: 'web' | 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    version: string;
    user_agent: string;
    is_trusted: boolean;
  };
  location_info: {
    ip_address: string;
    country?: string;
    city?: string;
    timezone?: string;
  };
  created_at: Date;
  last_activity: Date;
  expires_at: Date;
  is_active: boolean;
  revoked_at?: Date;
  revoked_by?: string;
  revoked_reason?: string;
}

// ============================================================================
// AUTHENTICATION CONTEXT
// ============================================================================

export interface AuthContext {
  user: User;
  session: Session;
  permissions: Permission[];
  ip_address: string;
  user_agent: string;
  timestamp: Date;
  device_info?: {
    type: string;
    os: string;
    browser: string;
  };
}

// ============================================================================
// MIDDLEWARE TYPES
// ============================================================================

export interface AuthMiddlewareOptions {
  required_permissions?: Permission[];
  required_roles?: UserRole[];
  allow_anonymous?: boolean;
  session_required?: boolean;
  two_factor_required?: boolean;
  ip_whitelist?: string[];
  rate_limit?: {
    max_requests: number;
    window_ms: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user: User;
  session: Session;
  auth: AuthContext;
}

// ============================================================================
// SECURITY TYPES
// ============================================================================

export interface SecuritySettings {
  jwt: {
    secret: string;
    access_token_expiry: string; // e.g., '15m'
    refresh_token_expiry: string; // e.g., '7d'
    issuer: string;
    audience: string;
    algorithm: 'HS256' | 'RS256';
  };
  
  password: {
    min_length: number;
    max_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special_chars: boolean;
    prevent_reuse_count: number;
    max_age_days: number;
    bcrypt_rounds: number;
  };
  
  session: {
    max_duration_hours: number;
    inactivity_timeout_minutes: number;
    max_concurrent_sessions: number;
    require_reauth_for_sensitive: boolean;
    extend_on_activity: boolean;
  };
  
  lockout: {
    max_failed_attempts: number;
    lockout_duration_minutes: number;
    reset_on_success: boolean;
    progressive_delays: boolean;
  };
  
  two_factor: {
    enabled: boolean;
    required_for_roles: UserRole[];
    backup_codes_count: number;
    validity_period_minutes: number;
    issuer_name: string;
  };
  
  rate_limiting: {
    login_attempts: {
      max_attempts: number;
      window_minutes: number;
    };
    api_requests: {
      max_requests: number;
      window_minutes: number;
    };
  };
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuthAuditLog {
  id: string;
  user_id?: string;
  session_id?: string;
  action: AuthAction;
  resource?: string;
  outcome: 'success' | 'failure' | 'warning';
  ip_address: string;
  user_agent: string;
  timestamp: Date;
  details: Record<string, any>;
  risk_score?: number;
  geolocation?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}

export type AuthAction = 
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'token_refresh'
  | 'password_change'
  | 'password_reset_request'
  | 'password_reset_success'
  | 'two_factor_enable'
  | 'two_factor_disable'
  | 'two_factor_verify'
  | 'account_locked'
  | 'account_unlocked'
  | 'permission_denied'
  | 'session_expired'
  | 'session_terminated'
  | 'profile_update'
  | 'email_verification'
  | 'phone_verification'
  | 'suspicious_activity'
  | 'security_violation';

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp: Date;
  request_id?: string;
}

export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'USER_DISABLED'
  | 'USER_NOT_VERIFIED'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_INVALID'
  | 'REFRESH_TOKEN_EXPIRED'
  | 'INVALID_REFRESH_TOKEN'
  | 'TOKEN_VERIFICATION_FAILED'
  | 'REFRESH_TOKEN_VERIFICATION_FAILED'
  | 'TWO_FACTOR_REQUIRED'
  | 'TWO_FACTOR_INVALID'
  | 'PASSWORD_TOO_WEAK'
  | 'PASSWORD_RECENTLY_USED'
  | 'ACCOUNT_LOCKED'
  | 'TOO_MANY_ATTEMPTS'
  | 'INVALID_EMAIL'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PERMISSION_DENIED'
  | 'ROLE_NOT_AUTHORIZED'
  | 'SESSION_EXPIRED'
  | 'CONCURRENT_LOGIN_DETECTED'
  | 'IP_ADDRESS_BLOCKED'
  | 'DEVICE_NOT_TRUSTED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// GOOGLE/OAUTH TYPES
// ============================================================================

export interface GoogleAuthConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
}

export interface GoogleTokenInfo {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// ============================================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================================

export interface TwoFactorSetup {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  manual_entry_key: string;
}

export interface TwoFactorVerification {
  code: string;
  backup_code?: boolean;
}

// ============================================================================
// DEVICE MANAGEMENT
// ============================================================================

export interface DeviceInfo {
  id: string;
  user_id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'web';
  os: string;
  os_version: string;
  browser?: string;
  browser_version?: string;
  app_version?: string;
  fingerprint: string;
  is_trusted: boolean;
  is_active: boolean;
  last_seen: Date;
  created_at: Date;
  push_token?: string;
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

export interface AccessRule {
  resource: string;
  actions: {
    [action: string]: {
      roles: UserRole[];
      permissions: Permission[];
      conditions?: AccessCondition[];
    };
  };
}

export interface AccessCondition {
  type: 'time' | 'location' | 'ip' | 'device' | 'custom';
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'between' | 'custom';
  value: any;
  custom_fn?: string; // Function name for custom validation
}

export interface AccessContext {
  user: User;
  resource: string;
  action: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
  ip_address?: string;
  user_agent?: string;
  additional_data?: Record<string, any>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AuthError;
  metadata?: {
    timestamp: string;
    request_id: string;
    version: string;
    rate_limit?: {
      remaining: number;
      reset_at: string;
    };
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// ============================================================================
// UTILITY FUNCTIONS & TYPE GUARDS
// ============================================================================

export function isValidRole(role: string): role is UserRole {
  const validRoles: UserRole[] = [
    'super_admin', 'tourism_admin', 'police_admin', 'medical_admin',
    'operator', 'field_agent', 'viewer', 'tourist'
  ];
  return validRoles.includes(role as UserRole);
}

export function isValidPermission(permission: string): permission is Permission {
  const validPermissions: Permission[] = [
    'view_dashboard', 'manage_dashboard', 'view_analytics', 'export_data',
    'view_tourists', 'create_tourist', 'update_tourist', 'delete_tourist',
    'view_tourist_details', 'track_tourist', 'view_alerts', 'create_alert',
    'update_alert', 'delete_alert', 'resolve_alert', 'escalate_alert',
    'emergency_response', 'view_zones', 'create_zone', 'update_zone',
    'delete_zone', 'manage_geofencing', 'view_blockchain', 'manage_blockchain',
    'generate_digital_id', 'verify_digital_id', 'manage_users', 'manage_settings',
    'view_logs', 'system_admin'
  ];
  return validPermissions.includes(permission as Permission);
}

export function hasPermission(user: User, permission: Permission): boolean {
  return user.is_active && user.permissions.includes(permission);
}

export function hasRole(user: User, role: UserRole): boolean {
  return user.is_active && user.role === role;
}

export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return user.is_active && roles.includes(user.role);
}

export function sanitizeUser(user: User): Omit<User, 'password_hash' | 'security'> {
  const { password_hash, security, ...sanitized } = user;
  return sanitized;
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_dashboard', 'manage_dashboard', 'view_analytics', 'export_data',
    'view_tourists', 'create_tourist', 'update_tourist', 'delete_tourist',
    'view_tourist_details', 'track_tourist', 'view_alerts', 'create_alert',
    'update_alert', 'delete_alert', 'resolve_alert', 'escalate_alert',
    'emergency_response', 'view_zones', 'create_zone', 'update_zone',
    'delete_zone', 'manage_geofencing', 'view_blockchain', 'manage_blockchain',
    'generate_digital_id', 'verify_digital_id', 'manage_users', 'manage_settings',
    'view_logs', 'system_admin'
  ],
  tourism_admin: [
    'view_dashboard', 'manage_dashboard', 'view_analytics', 'export_data',
    'view_tourists', 'create_tourist', 'update_tourist', 'delete_tourist',
    'view_tourist_details', 'track_tourist', 'view_alerts', 'create_alert',
    'update_alert', 'resolve_alert', 'view_zones', 'create_zone',
    'update_zone', 'view_blockchain', 'generate_digital_id', 'verify_digital_id'
  ],
  police_admin: [
    'view_dashboard', 'view_analytics', 'view_tourists', 'view_tourist_details',
    'track_tourist', 'view_alerts', 'create_alert', 'update_alert',
    'resolve_alert', 'escalate_alert', 'emergency_response', 'view_zones',
    'view_blockchain', 'verify_digital_id'
  ],
  medical_admin: [
    'view_dashboard', 'view_analytics', 'view_tourists', 'view_tourist_details',
    'view_alerts', 'create_alert', 'update_alert', 'resolve_alert',
    'emergency_response', 'view_zones', 'view_blockchain'
  ],
  operator: [
    'view_dashboard', 'view_tourists', 'view_tourist_details', 'track_tourist',
    'view_alerts', 'create_alert', 'update_alert', 'resolve_alert',
    'view_zones', 'view_blockchain'
  ],
  field_agent: [
    'view_dashboard', 'view_tourists', 'view_tourist_details', 'view_alerts',
    'create_alert', 'update_alert', 'view_zones'
  ],
  viewer: [
    'view_dashboard', 'view_tourists', 'view_alerts', 'view_zones'
  ],
  tourist: []
};

// ============================================================================
// EXPORTS
// ============================================================================

// All types are exported inline above
