/**
 * Smart Tourist Safety System - Admin Routes
 * Express.js routes for admin user management operations
 */

import express from 'express';
import {
  getAllUsers,
  getUserStats,
  createUser,
  updateUser,
  deleteUser,
  bulkUserOperations,
  toggleUserStatus,
  exportUsers,
  getUserById,
  getSystemHealth
} from '../services/admin-service';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = express.Router();

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
// MIDDLEWARE
// ============================================================================

// All admin routes require authentication and super_admin role
router.use(authenticateToken);
router.use(requireRole(['super_admin']));

// ============================================================================
// USER MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/admin/users
 * Get all users with filtering and pagination
 */
router.get('/users', getAllUsers);

/**
 * GET /api/admin/users/stats
 * Get user statistics
 */
router.get('/users/stats', getUserStats);

/**
 * GET /api/admin/users/:userId
 * Get single user by ID
 */
router.get('/users/:userId', getUserById);

/**
 * POST /api/admin/users
 * Create a new user
 */
router.post('/users', validateRequest(createUserSchema), createUser);

/**
 * PUT /api/admin/users/:userId
 * Update an existing user
 */
router.put('/users/:userId', validateRequest(updateUserSchema), updateUser);

/**
 * DELETE /api/admin/users/:userId
 * Delete a user
 */
router.delete('/users/:userId', deleteUser);

/**
 * POST /api/admin/users/bulk
 * Perform bulk operations on users
 */
router.post('/users/bulk', validateRequest(bulkOperationSchema), bulkUserOperations);

/**
 * POST /api/admin/users/:userId/:action
 * Toggle user status (activate/deactivate)
 * :action can be 'activate' or 'deactivate'
 */
router.post('/users/:userId/:action', (req, res, next) => {
  const { action } = req.params;
  if (!['activate', 'deactivate'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be "activate" or "deactivate"'
    });
  }
  next();
}, toggleUserStatus);

/**
 * GET /api/admin/users/export/csv
 * Export users to CSV
 */
router.get('/users/export/csv', exportUsers);

// ============================================================================
// SYSTEM MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/admin/system/health
 * Get system health and statistics
 */
router.get('/system/health', getSystemHealth);

/**
 * GET /api/admin/system/logs
 * Get system logs (placeholder for future implementation)
 */
router.get('/system/logs', async (req, res) => {
  try {
    // Placeholder implementation
    const logs = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'User login successful',
        userId: 'admin-001',
        ip: '192.168.1.1'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'warning',
        message: 'Failed login attempt',
        userId: null,
        ip: '192.168.1.100'
      }
    ];

    res.json({
      success: true,
      logs,
      pagination: {
        page: 1,
        limit: 50,
        total: logs.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Error getting system logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/admin/system/settings
 * Get system settings (placeholder for future implementation)
 */
router.get('/system/settings', async (req, res) => {
  try {
    // Placeholder implementation
    const settings = {
      security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        requireTwoFactor: false,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true
        }
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        webhookEnabled: false
      },
      system: {
        timezone: 'Asia/Kolkata',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      }
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error getting system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/admin/system/settings
 * Update system settings (placeholder for future implementation)
 */
router.put('/system/settings', async (req, res) => {
  try {
    // Placeholder implementation
    const { settings } = req.body;

    // In production, validate and save settings to database
    console.log('Updating system settings:', settings);

    res.json({
      success: true,
      message: 'System settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// ANALYTICS AND REPORTING ROUTES
// ============================================================================

/**
 * GET /api/admin/analytics/dashboard
 * Get dashboard analytics data
 */
router.get('/analytics/dashboard', async (req, res) => {
  try {
    // Placeholder implementation for dashboard analytics
    const analytics = {
      userMetrics: {
        totalUsers: 150,
        activeUsers: 142,
        newUsersThisMonth: 12,
        userGrowthRate: 8.5
      },
      systemMetrics: {
        totalTourists: 2450,
        activeTourists: 1890,
        alertsToday: 5,
        resolvedAlerts: 23
      },
      performanceMetrics: {
        systemUptime: 99.8,
        responseTime: 250,
        apiCalls: 15420,
        errorRate: 0.2
      },
      trends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        userRegistrations: [45, 52, 48, 61, 55, 67],
        alertResolutions: [23, 28, 31, 27, 35, 42],
        systemLoad: [65, 72, 68, 75, 71, 78]
      }
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/admin/analytics/users
 * Get user analytics data
 */
router.get('/analytics/users', async (req, res) => {
  try {
    // Placeholder implementation for user analytics
    const userAnalytics = {
      roleDistribution: {
        super_admin: 5,
        operator: 45,
        viewer: 100
      },
      departmentDistribution: {
        'Administration': 8,
        'Operations': 67,
        'Monitoring': 75
      },
      activityMetrics: {
        dailyActiveUsers: 89,
        weeklyActiveUsers: 126,
        monthlyActiveUsers: 145
      },
      loginStats: {
        successfulLogins: 234,
        failedLogins: 12,
        uniqueLogins: 89
      }
    };

    res.json({
      success: true,
      analytics: userAnalytics
    });
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

// Handle validation errors
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors
    });
  }
  next(error);
});

// Handle general errors
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Admin routes error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default router;