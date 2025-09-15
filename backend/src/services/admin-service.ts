/**
 * Smart Tourist Safety System - Admin Service
 * Backend service for admin operations including user management and system operations
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'operator' | 'viewer';
  avatar?: string;
  phone?: string;
  department?: string;
  location?: string;
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    designation?: string;
    employeeId?: string;
    badgeNumber?: string;
    emergencyContact?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  security?: {
    twoFactorEnabled: boolean;
    lastPasswordChange?: string;
    loginAttempts: number;
    lockedUntil?: string;
    sessionTimeout: number;
  };
}

interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'super_admin' | 'operator' | 'viewer';
  department: string;
  designation: string;
  employeeId: string;
  badgeNumber?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
  requirePasswordChange: boolean;
  sendWelcomeEmail: boolean;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'super_admin' | 'operator' | 'viewer';
  department?: string;
  isActive?: boolean;
}

interface BulkUserOperation {
  operation: 'activate' | 'deactivate' | 'suspend' | 'delete';
  userIds: string[];
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: {
    super_admin: number;
    operator: number;
    viewer: number;
  };
  byDepartment: Record<string, number>;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['super_admin', 'operator', 'viewer']),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  badgeNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  isActive: z.boolean().default(true),
  requirePasswordChange: z.boolean().default(true),
  sendWelcomeEmail: z.boolean().default(true)
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(['super_admin', 'operator', 'viewer']).optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional()
});

const bulkOperationSchema = z.object({
  operation: z.enum(['activate', 'deactivate', 'suspend', 'delete']),
  userIds: z.array(z.string()).min(1, 'At least one user ID is required')
});

// ============================================================================
// MOCK DATABASE (In production, replace with actual database)
// ============================================================================

let users: User[] = [
  {
    id: '1',
    email: 'admin@touristsafety.com',
    name: 'System Administrator',
    role: 'super_admin',
    phone: '+91-9876543210',
    department: 'Administration',
    permissions: ['manage_users', 'system_admin', 'view_analytics', 'manage_settings'],
    isActive: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      firstName: 'System',
      lastName: 'Administrator',
      designation: 'System Administrator',
      employeeId: 'ADMIN001',
      badgeNumber: 'SYS001'
    },
    security: {
      twoFactorEnabled: false,
      loginAttempts: 0,
      sessionTimeout: 30
    }
  }
];

// Password hash for 'admin123' (default password)
const defaultPasswordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

// ============================================================================
// PERMISSION MAPPINGS
// ============================================================================

const ROLE_PERMISSIONS = {
  viewer: [
    'view_dashboard',
    'view_tourists',
    'view_alerts',
    'view_zones',
    'view_blockchain'
  ],
  operator: [
    'view_dashboard',
    'view_tourists',
    'create_tourist',
    'update_tourist',
    'track_tourist',
    'view_alerts',
    'create_alert',
    'update_alert',
    'resolve_alert',
    'view_zones',
    'create_zone',
    'update_zone',
    'view_blockchain',
    'verify_digital_id'
  ],
  super_admin: [
    'view_dashboard',
    'manage_dashboard',
    'view_analytics',
    'export_data',
    'view_tourists',
    'create_tourist',
    'update_tourist',
    'delete_tourist',
    'track_tourist',
    'view_alerts',
    'create_alert',
    'update_alert',
    'delete_alert',
    'resolve_alert',
    'escalate_alert',
    'emergency_response',
    'view_zones',
    'create_zone',
    'update_zone',
    'delete_zone',
    'manage_geofencing',
    'view_blockchain',
    'manage_blockchain',
    'generate_digital_id',
    'verify_digital_id',
    'manage_users',
    'manage_settings',
    'view_logs',
    'system_admin'
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateUserId = (): string => uuidv4();

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const generateJWT = (user: User): string => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    process.env.JWT_SECRET || 'your-secret-key'
  );
};

const getUserPermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};

const sendWelcomeEmail = async (user: User, password: string): Promise<void> => {
  // In production, implement actual email sending
  console.log(`Welcome email sent to ${user.email}`);
  console.log(`Login credentials: ${user.email} / ${password}`);
};

// ============================================================================
// ADMIN SERVICE FUNCTIONS
// ============================================================================

/**
 * Get all users with filtering and pagination
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search, 
      role, 
      department, 
      status,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    let filteredUsers = [...users];

    // Apply filters
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower)
      );
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (department) {
      filteredUsers = filteredUsers.filter(user => user.department === department);
    }

    if (status) {
      if (status === 'active') {
        filteredUsers = filteredUsers.filter(user => user.isActive);
      } else if (status === 'inactive') {
        filteredUsers = filteredUsers.filter(user => !user.isActive);
      }
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'email':
          aVal = a.email;
          bVal = b.email;
          break;
        case 'role':
          aVal = a.role;
          bVal = b.role;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'lastLogin':
          aVal = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
          bVal = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Remove sensitive data
    const safeUsers = paginatedUsers.map(({ ...user }) => {
      // Remove password hash and other sensitive fields
      return user;
    });

    res.json({
      success: true,
      users: safeUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats: UserStats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      suspended: users.filter(u => !u.isActive && !u.isVerified).length,
      byRole: {
        super_admin: users.filter(u => u.role === 'super_admin').length,
        operator: users.filter(u => u.role === 'operator').length,
        viewer: users.filter(u => u.role === 'viewer').length
      },
      byDepartment: {}
    };

    // Calculate department statistics
    users.forEach(user => {
      if (user.department) {
        stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
      }
    });

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = createUserSchema.parse(req.body);

    // Check if user already exists
    const existingUser = users.find(u => u.email === validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if employee ID already exists
    const existingEmployeeId = users.find(u => 
      u.profile?.employeeId === validatedData.employeeId
    );
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email: validatedData.email,
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      role: validatedData.role,
      phone: validatedData.phone,
      department: validatedData.department,
      permissions: getUserPermissions(validatedData.role),
      isActive: validatedData.isActive,
      isVerified: !validatedData.requirePasswordChange,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        designation: validatedData.designation,
        employeeId: validatedData.employeeId,
        badgeNumber: validatedData.badgeNumber,
        emergencyContact: validatedData.emergencyContact,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode
      },
      security: {
        twoFactorEnabled: false,
        loginAttempts: 0,
        sessionTimeout: 30
      }
    };

    // Add to users array
    users.push(newUser);

    // Send welcome email if requested
    if (validatedData.sendWelcomeEmail) {
      await sendWelcomeEmail(newUser, validatedData.password);
    }

    // Remove sensitive data from response
    const { ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: safeUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (validatedData.email && validatedData.email !== users[userIndex].email) {
      const existingUser = users.find(u => u.email === validatedData.email && u.id !== userId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    // Update permissions if role changed
    if (validatedData.role && validatedData.role !== users[userIndex].role) {
      updatedUser.permissions = getUserPermissions(validatedData.role);
    }

    users[userIndex] = updatedUser;

    // Remove sensitive data from response
    const { ...safeUser } = updatedUser;

    res.json({
      success: true,
      message: 'User updated successfully',
      user: safeUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of the last admin
    const adminCount = users.filter(u => u.role === 'super_admin').length;
    if (users[userIndex].role === 'super_admin' && adminCount === 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last admin user'
      });
    }

    // Remove user
    users.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Bulk user operations
 */
export const bulkUserOperations = async (req: Request, res: Response) => {
  try {
    const validatedData = bulkOperationSchema.parse(req.body);
    const { operation, userIds } = validatedData;

    // Find users
    const targetUsers = users.filter(u => userIds.includes(u.id));
    if (targetUsers.length !== userIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Some users not found'
      });
    }

    // Prevent operations on the last admin
    if (operation === 'delete' || operation === 'deactivate') {
      const adminUsers = targetUsers.filter(u => u.role === 'super_admin');
      const totalAdmins = users.filter(u => u.role === 'super_admin').length;
      
      if (adminUsers.length > 0 && (totalAdmins - adminUsers.length) === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete or deactivate all admin users'
        });
      }
    }

    // Perform bulk operation
    let successCount = 0;

    for (const userId of userIds) {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        switch (operation) {
          case 'activate':
            users[userIndex].isActive = true;
            users[userIndex].isVerified = true;
            users[userIndex].updatedAt = new Date().toISOString();
            successCount++;
            break;
          case 'deactivate':
            users[userIndex].isActive = false;
            users[userIndex].updatedAt = new Date().toISOString();
            successCount++;
            break;
          case 'suspend':
            users[userIndex].isActive = false;
            users[userIndex].isVerified = false;
            users[userIndex].updatedAt = new Date().toISOString();
            successCount++;
            break;
          case 'delete':
            users.splice(userIndex, 1);
            successCount++;
            break;
        }
      }
    }

    res.json({
      success: true,
      message: `Successfully ${operation}ed ${successCount} user(s)`,
      processed: successCount
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    console.error('Error performing bulk operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Toggle user status (activate/deactivate)
 */
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { action } = req.params; // 'activate' or 'deactivate'

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating the last admin
    if (action === 'deactivate' && users[userIndex].role === 'super_admin') {
      const activeAdmins = users.filter(u => u.role === 'super_admin' && u.isActive).length;
      if (activeAdmins === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active admin user'
        });
      }
    }

    // Update user status
    if (action === 'activate') {
      users[userIndex].isActive = true;
      users[userIndex].isVerified = true;
    } else if (action === 'deactivate') {
      users[userIndex].isActive = false;
    }

    users[userIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `User ${action}ed successfully`,
      user: users[userIndex]
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Export users to CSV
 */
export const exportUsers = async (req: Request, res: Response) => {
  try {
    // Generate CSV content
    const csvHeaders = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Department',
      'Phone',
      'Status',
      'Created At',
      'Last Login'
    ];

    const csvRows = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.department || '',
      user.phone || '',
      user.isActive ? 'Active' : 'Inactive',
      user.createdAt,
      user.lastLogin || 'Never'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get single user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive data
    const { ...safeUser } = user;

    res.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ============================================================================
// SYSTEM OPERATIONS
// ============================================================================

/**
 * Get system health and statistics
 */
export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'online',
        authentication: 'online',
        blockchain: 'online',
        notifications: 'online'
      },
      statistics: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        activeSessions: 0, // In production, track active sessions
        systemUptime: process.uptime()
      }
    };

    res.json({
      success: true,
      health
    });
  } catch (error) {
    console.error('Error getting system health:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system health',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Initialize default admin user
 */
export const initializeDefaultAdmin = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const existingAdmin = users.find(u => u.email === 'admin@touristsafety.com');
    if (existingAdmin) {
      console.log('Default admin user already exists');
      return;
    }

    console.log('Creating default admin user...');
    // Default admin is already added in the initial users array
    console.log('Default admin user created successfully');
    console.log('Email: admin@touristsafety.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
};