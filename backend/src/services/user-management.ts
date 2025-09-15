/**
 * Smart Tourist Safety System - User Management Service
 * Comprehensive user operations, role management, and session handling
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  departmentId?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  timezone: string;
  language: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  designation?: string;
  employeeId?: string;
  badgeNumber?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country: string;
  pincode?: string;
  alternateEmail?: string;
  workSchedule?: any;
  skills?: string[];
  certifications?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSecurity {
  id: string;
  userId: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  loginAttempts: number;
  lastFailedLogin?: Date;
  accountLockedUntil?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  phoneVerificationToken?: string;
  phoneVerificationExpires?: Date;
  lastPasswordChange: Date;
  passwordHistory?: string[];
  sessionTimeout: number;
  ipWhitelist?: string[];
  deviceFingerprints?: any[];
  securityQuestions?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  level: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  resource: string;
  action: string;
  conditions?: any;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceName?: string;
  deviceType?: string;
  platform?: string;
  browser?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  sessionData?: any;
  refreshToken?: string;
  accessTokenHash?: string;
  expiresAt: Date;
  lastActivity: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  sessionId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  status: 'success' | 'failure' | 'pending';
  errorMessage?: string;
  metadata?: any;
  createdAt: Date;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.string().min(1, 'Role is required'),
  departmentId: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().default('Asia/Kolkata'),
  language: z.string().default('en'),
  isActive: z.boolean().default(true),
  sendWelcomeEmail: z.boolean().default(true)
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  roleId: z.string().optional(),
  departmentId: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  isActive: z.boolean().optional()
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  designation: z.string().optional(),
  employeeId: z.string().optional(),
  badgeNumber: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  nationality: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  alternateEmail: z.string().email().optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// ============================================================================
// DATABASE CONNECTION (Mock - Replace with actual DB connection)
// ============================================================================

// Mock database arrays (replace with actual database queries)
let users: (User & { passwordHash: string })[] = [];
let userProfiles: UserProfile[] = [];
let userSecurity: UserSecurity[] = [];
let roles: Role[] = [];
let permissions: Permission[] = [];
let userSessions: UserSession[] = [];
let auditLogs: AuditLog[] = [];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const generateId = (): string => uuidv4();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateJWT = (payload: any, expiresIn: string = '24h'): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn });
};

export const verifyJWT = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
};

export const generateSessionId = (): string => {
  return uuidv4().replace(/-/g, '');
};

export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export const createAuditLog = async (logData: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> => {
  const auditLog: AuditLog = {
    id: generateId(),
    createdAt: new Date(),
    ...logData
  };
  
  auditLogs.push(auditLog);
  
  // In production, save to database
  console.log('Audit Log:', auditLog);
};

// ============================================================================
// USER MANAGEMENT OPERATIONS
// ============================================================================

export class UserManagementService {
  
  /**
   * Create a new user
   */
  static async createUser(userData: z.infer<typeof createUserSchema>, createdBy?: string): Promise<User> {
    // Validate input
    const validatedData = createUserSchema.parse(userData);
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === validatedData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const passwordHash = await hashPassword(validatedData.password);
    
    // Create user
    const user: User & { passwordHash: string } = {
      id: generateId(),
      email: validatedData.email,
      name: validatedData.name,
      roleId: validatedData.roleId,
      departmentId: validatedData.departmentId,
      phone: validatedData.phone,
      timezone: validatedData.timezone,
      language: validatedData.language,
      isActive: validatedData.isActive,
      isVerified: false,
      loginCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash
    };
    
    users.push(user);
    
    // Create user profile
    const profile: UserProfile = {
      id: generateId(),
      userId: user.id,
      country: 'India',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    userProfiles.push(profile);
    
    // Create user security
    const security: UserSecurity = {
      id: generateId(),
      userId: user.id,
      twoFactorEnabled: false,
      loginAttempts: 0,
      lastPasswordChange: new Date(),
      sessionTimeout: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    userSecurity.push(security);
    
    // Create audit log
    await createAuditLog({
      userId: createdBy,
      action: 'USER_CREATED',
      entityType: 'user',
      entityId: user.id,
      newValues: { email: user.email, name: user.name, role: user.roleId },
      status: 'success'
    });
    
    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }
  
  /**
   * Update user information
   */
  static async updateUser(userId: string, updateData: z.infer<typeof updateUserSchema>, updatedBy?: string): Promise<User> {
    const validatedData = updateUserSchema.parse(updateData);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const oldValues = { ...users[userIndex] };
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...validatedData,
      updatedAt: new Date()
    };
    
    // Create audit log
    await createAuditLog({
      userId: updatedBy,
      action: 'USER_UPDATED',
      entityType: 'user',
      entityId: userId,
      oldValues: { email: oldValues.email, name: oldValues.name, isActive: oldValues.isActive },
      newValues: validatedData,
      status: 'success'
    });
    
    const { passwordHash: _, ...userResponse } = users[userIndex];
    return userResponse;
  }
  
  /**
   * Delete user
   */
  static async deleteUser(userId: string, deletedBy?: string): Promise<void> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex];
    
    // Remove user and related data
    users.splice(userIndex, 1);
    userProfiles = userProfiles.filter(p => p.userId !== userId);
    userSecurity = userSecurity.filter(s => s.userId !== userId);
    userSessions = userSessions.filter(s => s.userId !== userId);
    
    // Create audit log
    await createAuditLog({
      userId: deletedBy,
      action: 'USER_DELETED',
      entityType: 'user',
      entityId: userId,
      oldValues: { email: user.email, name: user.name },
      status: 'success'
    });
  }
  
  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }
  
  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = users.find(u => u.email === email);
    if (!user) return null;
    
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }
  
  /**
   * Get all users with filters
   */
  static async getUsers(filters: {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: string;
    departmentId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    let filteredUsers = [...users];
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.roleId) {
      filteredUsers = filteredUsers.filter(user => user.roleId === filters.roleId);
    }
    
    if (filters.departmentId) {
      filteredUsers = filteredUsers.filter(user => user.departmentId === filters.departmentId);
    }
    
    if (filters.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredUsers.sort((a, b) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        
        if (filters.sortOrder === 'desc') {
          return aVal > bVal ? -1 : 1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Remove password hashes
    const userResponses = paginatedUsers.map(({ passwordHash: _, ...user }) => user);
    
    return {
      users: userResponses,
      total: filteredUsers.length,
      page,
      limit
    };
  }
  
  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, profileData: z.infer<typeof updateProfileSchema>): Promise<UserProfile> {
    const validatedData = updateProfileSchema.parse(profileData);
    
    const profileIndex = userProfiles.findIndex(p => p.userId === userId);
    if (profileIndex === -1) {
      throw new Error('User profile not found');
    }
    
    userProfiles[profileIndex] = {
      ...userProfiles[profileIndex],
      ...validatedData,
      updatedAt: new Date()
    };
    
    await createAuditLog({
      userId,
      action: 'PROFILE_UPDATED',
      entityType: 'user_profile',
      entityId: userId,
      newValues: validatedData,
      status: 'success'
    });
    
    return userProfiles[profileIndex];
  }
  
  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    return userProfiles.find(p => p.userId === userId) || null;
  }
  
  /**
   * Change user password
   */
  static async changePassword(userId: string, passwordData: z.infer<typeof changePasswordSchema>): Promise<void> {
    const validatedData = changePasswordSchema.parse(passwordData);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex];
    
    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(validatedData.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(validatedData.newPassword);
    
    // Update password
    users[userIndex].passwordHash = newPasswordHash;
    users[userIndex].updatedAt = new Date();
    
    // Update security record
    const securityIndex = userSecurity.findIndex(s => s.userId === userId);
    if (securityIndex !== -1) {
      userSecurity[securityIndex].lastPasswordChange = new Date();
      userSecurity[securityIndex].loginAttempts = 0; // Reset login attempts
      userSecurity[securityIndex].updatedAt = new Date();
    }
    
    await createAuditLog({
      userId,
      action: 'PASSWORD_CHANGED',
      entityType: 'user',
      entityId: userId,
      status: 'success'
    });
  }
  
  /**
   * Toggle user status
   */
  static async toggleUserStatus(userId: string, isActive: boolean, toggledBy?: string): Promise<User> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const oldStatus = users[userIndex].isActive;
    users[userIndex].isActive = isActive;
    users[userIndex].updatedAt = new Date();
    
    await createAuditLog({
      userId: toggledBy,
      action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'user',
      entityId: userId,
      oldValues: { isActive: oldStatus },
      newValues: { isActive },
      status: 'success'
    });
    
    const { passwordHash: _, ...userResponse } = users[userIndex];
    return userResponse;
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export class SessionManagementService {
  
  /**
   * Create user session
   */
  static async createSession(userId: string, sessionData: {
    deviceName?: string;
    deviceType?: string;
    platform?: string;
    browser?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  }): Promise<UserSession> {
    const session: UserSession = {
      id: generateSessionId(),
      userId,
      ...sessionData,
      sessionData: {},
      refreshToken: generateSecureToken(64),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      lastActivity: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    userSessions.push(session);
    
    await createAuditLog({
      userId,
      sessionId: session.id,
      action: 'SESSION_CREATED',
      entityType: 'session',
      entityId: session.id,
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      status: 'success'
    });
    
    return session;
  }
  
  /**
   * Update session activity
   */
  static async updateSessionActivity(sessionId: string): Promise<void> {
    const sessionIndex = userSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      userSessions[sessionIndex].lastActivity = new Date();
      userSessions[sessionIndex].updatedAt = new Date();
    }
  }
  
  /**
   * End session
   */
  static async endSession(sessionId: string): Promise<void> {
    const sessionIndex = userSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      const session = userSessions[sessionIndex];
      userSessions[sessionIndex].isActive = false;
      userSessions[sessionIndex].updatedAt = new Date();
      
      await createAuditLog({
        userId: session.userId,
        sessionId: session.id,
        action: 'SESSION_ENDED',
        entityType: 'session',
        entityId: session.id,
        status: 'success'
      });
    }
  }
  
  /**
   * Get user sessions
   */
  static async getUserSessions(userId: string, activeOnly: boolean = true): Promise<UserSession[]> {
    return userSessions.filter(s => 
      s.userId === userId && 
      (!activeOnly || s.isActive) &&
      s.expiresAt > new Date()
    );
  }
  
  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    const expiredSessions = userSessions.filter(s => s.expiresAt <= now || !s.isActive);
    
    for (const session of expiredSessions) {
      await createAuditLog({
        userId: session.userId,
        sessionId: session.id,
        action: 'SESSION_EXPIRED',
        entityType: 'session',
        entityId: session.id,
        status: 'success'
      });
    }
    
    userSessions = userSessions.filter(s => s.expiresAt > now && s.isActive);
  }
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

export class PermissionManagementService {
  
  /**
   * Get user permissions
   */
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    // Get role permissions (simplified - in production, join with database)
    const rolePermissions = permissions.filter(p => p.isActive);
    
    return rolePermissions;
  }
  
  /**
   * Check if user has permission
   */
  static async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    
    return userPermissions.some(p => 
      p.resource === resource && 
      p.action === action && 
      p.isActive
    );
  }
  
  /**
   * Check if user has role
   */
  static async hasRole(userId: string, roleName: string): Promise<boolean> {
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    
    const role = roles.find(r => r.id === user.roleId);
    return role?.name === roleName || false;
  }
}

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export class AuthenticationService {
  
  /**
   * Authenticate user login
   */
  static async login(email: string, password: string, sessionData: any = {}): Promise<{
    user: User;
    session: UserSession;
    token: string;
  }> {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }
    
    // Check password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment login attempts
      const securityIndex = userSecurity.findIndex(s => s.userId === user.id);
      if (securityIndex !== -1) {
        userSecurity[securityIndex].loginAttempts += 1;
        userSecurity[securityIndex].lastFailedLogin = new Date();
      }
      
      throw new Error('Invalid credentials');
    }
    
    // Reset login attempts on successful login
    const securityIndex = userSecurity.findIndex(s => s.userId === user.id);
    if (securityIndex !== -1) {
      userSecurity[securityIndex].loginAttempts = 0;
    }
    
    // Update login info
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].lastLoginAt = new Date();
    users[userIndex].lastLoginIp = sessionData.ipAddress;
    users[userIndex].loginCount += 1;
    
    // Create session
    const session = await SessionManagementService.createSession(user.id, sessionData);
    
    // Generate JWT token
    const token = generateJWT({
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      sessionId: session.id
    });
    
    await createAuditLog({
      userId: user.id,
      sessionId: session.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      status: 'success'
    });
    
    const { passwordHash: _, ...userResponse } = user;
    
    return {
      user: userResponse,
      session,
      token
    };
  }
  
  /**
   * Logout user
   */
  static async logout(sessionId: string): Promise<void> {
    await SessionManagementService.endSession(sessionId);
  }
  
  /**
   * Verify token and get user
   */
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = verifyJWT(token);
      return await UserManagementService.getUserById(decoded.sub);
    } catch (error) {
      return null;
    }
  }
}

export default {
  UserManagementService,
  SessionManagementService,
  PermissionManagementService,
  AuthenticationService
};