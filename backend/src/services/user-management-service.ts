/**
 * Smart Tourist Safety System - User Management Service
 * Complete CRUD operations for user management with role-based permissions
 */

import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { encryptSensitiveData, decryptSensitiveData } from '@/lib/encryption';
import { validateUserInput, UserCreateSchema } from '@/utils/validators';
import { DatabaseError, ValidationError, AuthorizationError } from '@/utils/error-handler';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'operator' | 'analyst' | 'field_agent';
  department: string;
  phoneNumber?: string;
  emergencyContact?: string;
  badgeNumber?: string;
  locationAccess?: string[];
  permissions?: string[];
  isActive?: boolean;
}

export interface UpdateUserRequest {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'operator' | 'analyst' | 'field_agent';
  department?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  badgeNumber?: string;
  locationAccess?: string[];
  permissions?: string[];
  isActive?: boolean;
}

export interface UserWithProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  phoneNumber?: string;
  emergencyContact?: string;
  badgeNumber?: string;
  locationAccess?: string[];
  permissions?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  avatar?: string;
}

export interface UserListFilters {
  role?: string;
  department?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  byDepartment: Record<string, number>;
  recentLogins: number;
}

// ============================================================================
// DEFAULT PERMISSIONS BY ROLE
// ============================================================================

const DEFAULT_PERMISSIONS = {
  admin: [
    'system.manage_users',
    'system.configure',
    'system.backup',
    'analytics.view',
    'analytics.export',
    'tourists.view',
    'tourists.create',
    'tourists.edit',
    'tourists.delete',
    'alerts.view',
    'alerts.create',
    'alerts.edit',
    'alerts.resolve',
    'emergency.respond',
    'zones.view',
    'zones.create',
    'zones.edit',
    'zones.delete',
    'blockchain.view',
    'blockchain.generate_identity',
    'blockchain.verify_identity',
    'reports.generate',
    'reports.export'
  ],
  operator: [
    'analytics.view',
    'tourists.view',
    'tourists.create',
    'tourists.edit',
    'alerts.view',
    'alerts.create',
    'alerts.edit',
    'alerts.resolve',
    'emergency.respond',
    'zones.view',
    'blockchain.view',
    'blockchain.verify_identity',
    'reports.generate'
  ],
  analyst: [
    'analytics.view',
    'analytics.export',
    'tourists.view',
    'alerts.view',
    'zones.view',
    'blockchain.view',
    'reports.generate',
    'reports.export'
  ],
  field_agent: [
    'tourists.view',
    'alerts.view',
    'alerts.create',
    'emergency.respond',
    'zones.view',
    'blockchain.verify_identity'
  ]
};

// ============================================================================
// USER MANAGEMENT SERVICE CLASS
// ============================================================================

export class UserManagementService {
  
  /**
   * Create a new user account
   */
  static async createUser(userData: CreateUserRequest, createdById: string): Promise<UserWithProfile> {
    try {
      // Validate input data
      const validationResult = validateUserInput(userData, UserCreateSchema);
      if (!validationResult.success) {
        throw new ValidationError(`Invalid user data: ${validationResult.errors?.map(e => e.message).join(', ')}`);
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          display_name: userData.displayName,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          department: userData.department
        }
      });

      if (authError || !authUser.user) {
        logger.error('Failed to create user in auth system:', authError);
        throw new DatabaseError('Failed to create user account');
      }

      // Assign default permissions based on role
      const permissions = userData.permissions || DEFAULT_PERMISSIONS[userData.role] || [];

      // Encrypt sensitive data
      const encryptedData = {
        phoneNumber: userData.phoneNumber ? encryptSensitiveData(userData.phoneNumber) : null,
        emergencyContact: userData.emergencyContact ? encryptSensitiveData(userData.emergencyContact) : null,
        badgeNumber: userData.badgeNumber ? encryptSensitiveData(userData.badgeNumber) : null
      };

      // Create user profile in database
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authUser.user.id,
          email: userData.email,
          display_name: userData.displayName,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          department: userData.department,
          phone_number: encryptedData.phoneNumber,
          emergency_contact: encryptedData.emergencyContact,
          badge_number: encryptedData.badgeNumber,
          location_access: userData.locationAccess || [],
          permissions,
          is_active: userData.isActive !== false,
          created_by: createdById,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        // Cleanup: Delete auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authUser.user.id);
        logger.error('Failed to create user profile:', profileError);
        throw new DatabaseError('Failed to create user profile');
      }

      logger.info(`User created successfully: ${userData.email} by ${createdById}`);

      return this.formatUserProfile(userProfile);

    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID with full profile
   */
  static async getUserById(userId: string): Promise<UserWithProfile | null> {
    try {
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !userProfile) {
        return null;
      }

      return this.formatUserProfile(userProfile);

    } catch (error) {
      logger.error(`Error fetching user ${userId}:`, error);
      throw new DatabaseError('Failed to fetch user');
    }
  }

  /**
   * Get paginated list of users with filters
   */
  static async getUsers(filters: UserListFilters = {}): Promise<{
    users: UserWithProfile[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        role,
        department,
        isActive,
        search,
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = filters;

      let query = supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (role) {
        query = query.eq('role', role);
      }

      if (department) {
        query = query.eq('department', department);
      }

      if (typeof isActive === 'boolean') {
        query = query.eq('is_active', isActive);
      }

      if (search) {
        query = query.or(
          `display_name.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
        );
      }

      // Apply sorting and pagination
      const offset = (page - 1) * limit;
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      const { data: users, error, count } = await query;

      if (error) {
        logger.error('Error fetching users:', error);
        throw new DatabaseError('Failed to fetch users');
      }

      const formattedUsers = users?.map((user: any) => this.formatUserProfile(user)) || [];

      return {
        users: formattedUsers,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };

    } catch (error) {
      logger.error('Error fetching users list:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(userId: string, updates: UpdateUserRequest, updatedById: string): Promise<UserWithProfile> {
    try {
      // Validate input data
      if (Object.keys(updates).length === 0) {
        throw new ValidationError('No update data provided');
      }

      // Check if user exists
      const existingUser = await this.getUserById(userId);
      if (!existingUser) {
        throw new ValidationError('User not found');
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map fields to database columns
      if (updates.displayName) updateData.display_name = updates.displayName;
      if (updates.firstName) updateData.first_name = updates.firstName;
      if (updates.lastName) updateData.last_name = updates.lastName;
      if (updates.role) {
        updateData.role = updates.role;
        // Update permissions when role changes
        updateData.permissions = updates.permissions || DEFAULT_PERMISSIONS[updates.role] || [];
      }
      if (updates.department) updateData.department = updates.department;
      if (updates.locationAccess) updateData.location_access = updates.locationAccess;
      if (updates.permissions) updateData.permissions = updates.permissions;
      if (typeof updates.isActive === 'boolean') updateData.is_active = updates.isActive;

      // Encrypt sensitive data if provided
      if (updates.phoneNumber) {
        updateData.phone_number = encryptSensitiveData(updates.phoneNumber);
      }
      if (updates.emergencyContact) {
        updateData.emergency_contact = encryptSensitiveData(updates.emergencyContact);
      }
      if (updates.badgeNumber) {
        updateData.badge_number = encryptSensitiveData(updates.badgeNumber);
      }

      // Update user profile
      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user profile:', error);
        throw new DatabaseError('Failed to update user profile');
      }

      // Update auth user metadata if role or display name changed
      if (updates.role || updates.displayName) {
        const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...existingUser,
            display_name: updates.displayName || existingUser.displayName,
            role: updates.role || existingUser.role
          }
        });

        if (authError) {
          logger.warn('Failed to update auth user metadata:', authError);
        }
      }

      logger.info(`User updated successfully: ${userId} by ${updatedById}`);

      return this.formatUserProfile(updatedProfile);

    } catch (error) {
      logger.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Deactivate user (soft delete)
   */
  static async deactivateUser(userId: string, deactivatedById: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        logger.error('Error deactivating user:', error);
        throw new DatabaseError('Failed to deactivate user');
      }

      logger.info(`User deactivated: ${userId} by ${deactivatedById}`);

    } catch (error) {
      logger.error(`Error deactivating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Permanently delete user
   */
  static async deleteUser(userId: string, deletedById: string): Promise<void> {
    try {
      // Delete from auth system
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) {
        logger.error('Error deleting user from auth:', authError);
        throw new DatabaseError('Failed to delete user from authentication system');
      }

      // Delete profile will cascade due to foreign key
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        logger.error('Error deleting user profile:', profileError);
        throw new DatabaseError('Failed to delete user profile');
      }

      logger.info(`User permanently deleted: ${userId} by ${deletedById}`);

    } catch (error) {
      logger.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<UserStats> {
    try {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('role, department, is_active, last_login');

      if (error) {
        logger.error('Error fetching user stats:', error);
        throw new DatabaseError('Failed to fetch user statistics');
      }

      const stats: UserStats = {
        total: users?.length || 0,
        active: 0,
        inactive: 0,
        byRole: {},
        byDepartment: {},
        recentLogins: 0
      };

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      users?.forEach((user: any) => {
        // Count active/inactive
        if (user.is_active) {
          stats.active++;
        } else {
          stats.inactive++;
        }

        // Count by role
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;

        // Count by department
        stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;

        // Count recent logins
        if (user.last_login && new Date(user.last_login) > thirtyDaysAgo) {
          stats.recentLogins++;
        }
      });

      return stats;

    } catch (error) {
      logger.error('Error calculating user stats:', error);
      throw error;
    }
  }

  /**
   * Reset user password
   */
  static async resetUserPassword(userId: string, newPassword: string, resetById: string): Promise<void> {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) {
        logger.error('Error resetting user password:', error);
        throw new DatabaseError('Failed to reset user password');
      }

      logger.info(`Password reset for user: ${userId} by ${resetById}`);

    } catch (error) {
      logger.error(`Error resetting password for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Format user profile for API response
   */
  private static formatUserProfile(profile: any): UserWithProfile {
    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      department: profile.department,
      phoneNumber: profile.phone_number ? decryptSensitiveData(profile.phone_number) : undefined,
      emergencyContact: profile.emergency_contact ? decryptSensitiveData(profile.emergency_contact) : undefined,
      badgeNumber: profile.badge_number ? decryptSensitiveData(profile.badge_number) : undefined,
      locationAccess: profile.location_access || [],
      permissions: profile.permissions || [],
      isActive: profile.is_active,
      lastLogin: profile.last_login,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      createdBy: profile.created_by,
      avatar: profile.avatar
    };
  }
}

export default UserManagementService;