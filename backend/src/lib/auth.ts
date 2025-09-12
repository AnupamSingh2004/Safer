/**
 * Smart Tourist Safety System - Authentication Library (Backend)
 * JWT token generation, validation, middleware, and security utilities
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { Request, Response, NextFunction } from 'express';
import type {
  User,
  UserRole,
  Permission,
  TokenPayload,
  RefreshTokenPayload,
  AuthMiddlewareOptions,
  AuthContext,
  SecuritySettings,
  AuthErrorCode,
  AuthAuditLog,
  AuthAction,
  TwoFactorSetup,
  ValidationResult,
  ValidationError,
} from '../types/auth';
import { DEFAULT_ROLE_PERMISSIONS } from '../types/auth';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_ISSUER = process.env.JWT_ISSUER || 'smart-tourist-safety';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'sts-web-app';

// Default security settings
const SECURITY_CONFIG: SecuritySettings = {
  jwt: {
    secret: JWT_SECRET,
    access_token_expiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refresh_token_expiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: 'HS256',
  },
  password: {
    min_length: 8,
    max_length: 128,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: true,
    prevent_reuse_count: 5,
    max_age_days: 90,
    bcrypt_rounds: 12,
  },
  session: {
    max_duration_hours: 8,
    inactivity_timeout_minutes: 30,
    max_concurrent_sessions: 3,
    require_reauth_for_sensitive: true,
    extend_on_activity: true,
  },
  lockout: {
    max_failed_attempts: 5,
    lockout_duration_minutes: 15,
    reset_on_success: true,
    progressive_delays: true,
  },
  two_factor: {
    enabled: true,
    required_for_roles: ['super_admin', 'tourism_admin', 'police_admin'],
    backup_codes_count: 10,
    validity_period_minutes: 5,
    issuer_name: 'Smart Tourist Safety',
  },
  rate_limiting: {
    login_attempts: {
      max_attempts: 10,
      window_minutes: 15,
    },
    api_requests: {
      max_requests: 1000,
      window_minutes: 15,
    },
  },
};

// ============================================================================
// PASSWORD UTILITIES
// ============================================================================

class PasswordManager {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SECURITY_CONFIG.password.bcrypt_rounds);
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): ValidationResult {
    const errors: ValidationError[] = [];
    const config = SECURITY_CONFIG.password;

    if (password.length < config.min_length) {
      errors.push({
        field: 'password',
        message: `Password must be at least ${config.min_length} characters long`,
        code: 'PASSWORD_TOO_SHORT',
      });
    }

    if (password.length > config.max_length) {
      errors.push({
        field: 'password',
        message: `Password must not exceed ${config.max_length} characters`,
        code: 'PASSWORD_TOO_LONG',
      });
    }

    if (config.require_uppercase && !/[A-Z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
        code: 'PASSWORD_MISSING_UPPERCASE',
      });
    }

    if (config.require_lowercase && !/[a-z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
        code: 'PASSWORD_MISSING_LOWERCASE',
      });
    }

    if (config.require_numbers && !/\d/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one number',
        code: 'PASSWORD_MISSING_NUMBER',
      });
    }

    if (config.require_special_chars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one special character',
        code: 'PASSWORD_MISSING_SPECIAL',
      });
    }

    return {
      is_valid: errors.length === 0,
      errors,
    };
  }
}

// ============================================================================
// JWT TOKEN UTILITIES
// ============================================================================

class TokenManager {
  /**
   * Generate an access token
   */
  static generateAccessToken(user: User, sessionId: string): string {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      session_id: sessionId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseTimeToSeconds(SECURITY_CONFIG.jwt.access_token_expiry),
      iss: SECURITY_CONFIG.jwt.issuer,
      aud: SECURITY_CONFIG.jwt.audience,
      jti: crypto.randomUUID(),
      department: user.department,
      location: user.location,
    };

    return jwt.sign(payload, SECURITY_CONFIG.jwt.secret, {
      algorithm: SECURITY_CONFIG.jwt.algorithm,
    });
  }

  /**
   * Generate a refresh token
   */
  static generateRefreshToken(userId: string, sessionId: string): string {
    const payload: RefreshTokenPayload = {
      sub: userId,
      session_id: sessionId,
      token_type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseTimeToSeconds(SECURITY_CONFIG.jwt.refresh_token_expiry),
      iss: SECURITY_CONFIG.jwt.issuer,
      aud: SECURITY_CONFIG.jwt.audience,
      jti: crypto.randomUUID(),
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      algorithm: SECURITY_CONFIG.jwt.algorithm,
    });
  }

  /**
   * Verify and decode an access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, SECURITY_CONFIG.jwt.secret, {
        issuer: SECURITY_CONFIG.jwt.issuer,
        audience: SECURITY_CONFIG.jwt.audience,
      }) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('TOKEN_EXPIRED', 'Access token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('INVALID_TOKEN', 'Invalid access token');
      }
      throw new AuthError('TOKEN_VERIFICATION_FAILED', 'Token verification failed');
    }
  }

  /**
   * Verify and decode a refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: SECURITY_CONFIG.jwt.issuer,
        audience: SECURITY_CONFIG.jwt.audience,
      }) as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('REFRESH_TOKEN_EXPIRED', 'Refresh token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('INVALID_REFRESH_TOKEN', 'Invalid refresh token');
      }
      throw new AuthError('REFRESH_TOKEN_VERIFICATION_FAILED', 'Refresh token verification failed');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Parse time string to seconds (e.g., '15m' -> 900)
   */
  private static parseTimeToSeconds(timeString: string): number {
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: throw new Error(`Unknown time unit: ${unit}`);
    }
  }
}

// ============================================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================================

class TwoFactorAuth {
  /**
   * Generate 2FA secret and QR code
   */
  static async generateTwoFactorSetup(user: User): Promise<TwoFactorSetup> {
    const secret = speakeasy.generateSecret({
      name: `${SECURITY_CONFIG.two_factor.issuer_name} (${user.email})`,
      issuer: SECURITY_CONFIG.two_factor.issuer_name,
    });

    const qr_code = await QRCode.toDataURL(secret.otpauth_url!);
    
    const backup_codes = Array.from({ length: SECURITY_CONFIG.two_factor.backup_codes_count }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    return {
      secret: secret.base32,
      qr_code,
      backup_codes,
      manual_entry_key: secret.base32,
    };
  }

  /**
   * Verify 2FA token
   */
  static verifyTwoFactorToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps (60 seconds) of variance
    });
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    return Array.from({ length: count }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
  }

  /**
   * Verify backup code
   */
  static verifyBackupCode(backupCodes: string[], providedCode: string): boolean {
    const upperCode = providedCode.toUpperCase();
    return backupCodes.includes(upperCode);
  }
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

class PermissionManager {
  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: User, permission: Permission): boolean {
    return user.is_active && user.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return user.is_active && permissions.some(p => user.permissions.includes(p));
  }

  /**
   * Check if user has all specified permissions
   */
  static hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return user.is_active && permissions.every(p => user.permissions.includes(p));
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(user: User, role: UserRole): boolean {
    return user.is_active && user.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: User, roles: UserRole[]): boolean {
    return user.is_active && roles.includes(user.role);
  }

  /**
   * Get permissions for a role
   */
  static getPermissionsForRole(role: UserRole): Permission[] {
    return DEFAULT_ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Check if user can access a resource with specific action
   */
  static canAccess(user: User, resource: string, action: string): boolean {
    if (!user.is_active) return false;
    
    // Super admin can access everything
    if (user.role === 'super_admin') return true;

    // Check specific permission
    const permissionKey = `${action}_${resource}` as Permission;
    return user.permissions.includes(permissionKey);
  }
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

interface AuthenticatedRequest extends Request {
  user: User;
  auth: AuthContext;
}

class AuthMiddleware {
  /**
   * Require authentication middleware
   */
  static requireAuth(options: AuthMiddlewareOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = TokenManager.extractTokenFromHeader(req.headers.authorization);
        
        if (!token) {
          if (options.allow_anonymous) {
            return next();
          }
          return res.status(401).json({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Access token required',
              timestamp: new Date(),
            },
          });
        }

        // Verify token
        const payload = TokenManager.verifyAccessToken(token);
        
        // TODO: Get user from database using payload.sub
        // For now, we'll create a mock user object
        const user: User = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          permissions: payload.permissions,
          is_active: true,
          is_verified: true,
          // ... other user properties would be loaded from database
        } as User;

        // Check if user is active
        if (!user.is_active) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'USER_DISABLED',
              message: 'User account is disabled',
              timestamp: new Date(),
            },
          });
        }

        // Check role requirements
        if (options.required_roles && !PermissionManager.hasAnyRole(user, options.required_roles)) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'INSUFFICIENT_ROLE',
              message: 'Insufficient role privileges',
              timestamp: new Date(),
            },
          });
        }

        // Check permission requirements
        if (options.required_permissions && !PermissionManager.hasAllPermissions(user, options.required_permissions)) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'INSUFFICIENT_PERMISSIONS',
              message: 'Insufficient permissions',
              timestamp: new Date(),
            },
          });
        }

        // Create auth context
        const authContext: AuthContext = {
          user,
          session: {
            id: payload.session_id,
            user_id: user.id,
            // ... other session properties would be loaded from database
          } as any,
          permissions: user.permissions,
          ip_address: req.ip || '',
          user_agent: req.headers['user-agent'] || '',
          timestamp: new Date(),
        };

        // Attach to request
        (req as AuthenticatedRequest).user = user;
        (req as AuthenticatedRequest).auth = authContext;

        next();
      } catch (error) {
        if (error instanceof AuthError) {
          return res.status(401).json({
            success: false,
            error: {
              code: error.code,
              message: error.message,
              timestamp: new Date(),
            },
          });
        }

        console.error('Authentication middleware error:', error);
        return res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Authentication failed',
            timestamp: new Date(),
          },
        });
      }
    };
  }

  /**
   * Require specific permission middleware
   */
  static requirePermission(permission: Permission) {
    return this.requireAuth({ required_permissions: [permission] });
  }

  /**
   * Require specific role middleware
   */
  static requireRole(role: UserRole) {
    return this.requireAuth({ required_roles: [role] });
  }

  /**
   * Require any of the specified permissions
   */
  static requireAnyPermission(permissions: Permission[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authMiddleware = this.requireAuth();
      await authMiddleware(req, res, () => {
        const user = (req as AuthenticatedRequest).user;
        
        if (!PermissionManager.hasAnyPermission(user, permissions)) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'INSUFFICIENT_PERMISSIONS',
              message: 'Insufficient permissions',
              timestamp: new Date(),
            },
          });
        }
        
        next();
      });
    };
  }
}

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

class SecurityUtils {
  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash data using SHA-256
   */
  static hashSHA256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create HMAC signature
   */
  static createHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  static verifyHMAC(data: string, secret: string, signature: string): boolean {
    const expectedSignature = this.createHMAC(data, secret);
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    
    // Use crypto.timingSafeEqual with proper type conversion
    return crypto.timingSafeEqual(
      new Uint8Array(signatureBuffer),
      new Uint8Array(expectedBuffer)
    );
  }

  /**
   * Rate limiting check
   */
  static isRateLimited(identifier: string, maxAttempts: number, windowMs: number): boolean {
    // This would typically be implemented with Redis or in-memory store
    // For now, return false (not rate limited)
    return false;
  }

  /**
   * Sanitize user data for public consumption
   */
  static sanitizeUser(user: User): Omit<User, 'password_hash' | 'security'> {
    const { password_hash, security, ...sanitized } = user;
    return sanitized;
  }
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

class AuditLogger {
  /**
   * Log authentication event
   */
  static async logAuthEvent(
    action: AuthAction,
    userId: string | undefined,
    ipAddress: string,
    userAgent: string,
    outcome: 'success' | 'failure' | 'warning',
    details: Record<string, any> = {}
  ): Promise<void> {
    const logEntry: AuthAuditLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      outcome,
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date(),
      details,
      risk_score: this.calculateRiskScore(action, outcome, details),
    };

    // TODO: Store in database
    console.log('Auth Event:', logEntry);
  }

  /**
   * Calculate risk score for the event
   */
  private static calculateRiskScore(
    action: AuthAction,
    outcome: 'success' | 'failure' | 'warning',
    details: Record<string, any>
  ): number {
    let score = 0;

    // Base score by action
    const actionScores: Record<AuthAction, number> = {
      login_attempt: 1,
      login_success: 0,
      login_failure: 3,
      logout: 0,
      token_refresh: 0,
      password_change: 2,
      password_reset_request: 2,
      password_reset_success: 3,
      two_factor_enable: 1,
      two_factor_disable: 4,
      two_factor_verify: 1,
      account_locked: 5,
      account_unlocked: 3,
      permission_denied: 4,
      session_expired: 1,
      session_terminated: 2,
      profile_update: 1,
      email_verification: 1,
      phone_verification: 1,
      suspicious_activity: 8,
      security_violation: 10,
    };

    score += actionScores[action] || 0;

    // Outcome modifier
    if (outcome === 'failure') score += 2;
    if (outcome === 'warning') score += 1;

    // Additional factors
    if (details.failed_attempts > 3) score += 2;
    if (details.new_location) score += 1;
    if (details.new_device) score += 1;

    return Math.min(score, 10); // Cap at 10
  }
}

// ============================================================================
// CUSTOM ERROR CLASS
// ============================================================================

export class AuthError extends Error {
  public code: AuthErrorCode;
  public details?: Record<string, any>;
  public timestamp: Date;

  constructor(code: AuthErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Create authentication response
 */
export function createAuthResponse(success: boolean, data?: any, error?: AuthError) {
  return {
    success,
    data,
    error: error ? {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
    } : undefined,
    metadata: {
      timestamp: new Date().toISOString(),
      request_id: crypto.randomUUID(),
      version: '1.0.0',
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  SECURITY_CONFIG,
  PasswordManager,
  TokenManager,
  TwoFactorAuth,
  PermissionManager,
  AuthMiddleware,
  SecurityUtils,
  AuditLogger,
};

export default {
  PasswordManager,
  TokenManager,
  TwoFactorAuth,
  PermissionManager,
  AuthMiddleware,
  SecurityUtils,
  AuditLogger,
  AuthError,
  generateSessionId,
  createAuthResponse,
};
