/**
 * Smart Tourist Safety System - User Role Management API Routes
 * Express.js routes for user management, role assignment, and permission handling
 */

import express from 'express';
import { z } from 'zod';

// Import services (note: these will need to be properly connected to database)
import {
  UserManagementService,
  SessionManagementService,
  PermissionManagementService,
  AuthenticationService,
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema
} from '../services/user-management';

const router = express.Router();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Basic authentication middleware (simplified)
const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const user = await AuthenticationService.verifyToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const requireRole = (roles: string[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const hasRole = await PermissionManagementService.hasRole(user.id, roles[0]); // Simplified
      if (!hasRole && !roles.includes('any')) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
};

// Permission-based authorization middleware
const requirePermission = (resource: string, action: string) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const hasPermission = await PermissionManagementService.hasPermission(user.id, resource, action);
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

// Validation middleware
const validateRequest = (schema: z.ZodSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
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
      next(error);
    }
  };
};

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

/**
 * POST /api/auth/login
 * User login
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const sessionData = {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      deviceType: req.get('X-Device-Type') || 'web',
      platform: req.get('X-Platform') || 'web',
      browser: req.get('X-Browser') || 'unknown'
    };
    
    const result = await AuthenticationService.login(email, password, sessionData);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
        sessionId: result.session.id
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed'
    });
  }
});

/**
 * POST /api/auth/logout
 * User logout
 */
router.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.body.sessionId || req.headers['x-session-id'];
    
    if (sessionId) {
      await AuthenticationService.logout(sessionId as string);
    }
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const profile = await UserManagementService.getUserProfile(user.id);
    const permissions = await PermissionManagementService.getUserPermissions(user.id);
    
    res.json({
      success: true,
      data: {
        user,
        profile,
        permissions: permissions.map(p => ({ resource: p.resource, action: p.action, name: p.name }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
});

// ============================================================================
// USER MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/users', 
  authenticateToken, 
  requirePermission('users', 'view'),
  async (req, res) => {
    try {
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
        search: req.query.search as string,
        roleId: req.query.roleId as string,
        departmentId: req.query.departmentId as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: req.query.sortBy as string || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
      };
      
      const result = await UserManagementService.getUsers(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users'
      });
    }
  }
);

/**
 * GET /api/users/:userId
 * Get user by ID
 */
router.get('/users/:userId', 
  authenticateToken, 
  requirePermission('users', 'view'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserManagementService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const profile = await UserManagementService.getUserProfile(userId);
      
      res.json({
        success: true,
        data: {
          user,
          profile
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user'
      });
    }
  }
);

/**
 * POST /api/users
 * Create new user (admin only)
 */
router.post('/users', 
  authenticateToken, 
  requirePermission('users', 'create'),
  validateRequest(createUserSchema),
  async (req, res) => {
    try {
      const currentUser = (req as any).user;
      const user = await UserManagementService.createUser(req.body, currentUser.id);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  }
);

/**
 * PUT /api/users/:userId
 * Update user (admin only)
 */
router.put('/users/:userId', 
  authenticateToken, 
  requirePermission('users', 'update'),
  validateRequest(updateUserSchema),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      const user = await UserManagementService.updateUser(userId, req.body, currentUser.id);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }
);

/**
 * DELETE /api/users/:userId
 * Delete user (admin only)
 */
router.delete('/users/:userId', 
  authenticateToken, 
  requirePermission('users', 'delete'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      // Prevent self-deletion
      if (userId === currentUser.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }
      
      await UserManagementService.deleteUser(userId, currentUser.id);
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user'
      });
    }
  }
);

/**
 * POST /api/users/:userId/toggle-status
 * Toggle user active status
 */
router.post('/users/:userId/toggle-status', 
  authenticateToken, 
  requirePermission('users', 'update'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      const currentUser = (req as any).user;
      
      // Prevent self-deactivation
      if (userId === currentUser.id && !isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account'
        });
      }
      
      const user = await UserManagementService.toggleUserStatus(userId, isActive, currentUser.id);
      
      res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user status'
      });
    }
  }
);

// ============================================================================
// USER PROFILE ROUTES
// ============================================================================

/**
 * GET /api/users/:userId/profile
 * Get user profile
 */
router.get('/users/:userId/profile', 
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      // Users can only view their own profile or admins can view any
      const canView = userId === currentUser.id || 
                     await PermissionManagementService.hasPermission(currentUser.id, 'users', 'view');
      
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Cannot view this profile'
        });
      }
      
      const profile = await UserManagementService.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
      
      res.json({
        success: true,
        data: { profile }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      });
    }
  }
);

/**
 * PUT /api/users/:userId/profile
 * Update user profile
 */
router.put('/users/:userId/profile', 
  authenticateToken,
  validateRequest(updateProfileSchema),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      // Users can only update their own profile or admins can update any
      const canUpdate = userId === currentUser.id || 
                       await PermissionManagementService.hasPermission(currentUser.id, 'users', 'update');
      
      if (!canUpdate) {
        return res.status(403).json({
          success: false,
          message: 'Cannot update this profile'
        });
      }
      
      const profile = await UserManagementService.updateUserProfile(userId, req.body);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile'
      });
    }
  }
);

/**
 * POST /api/users/:userId/change-password
 * Change user password
 */
router.post('/users/:userId/change-password', 
  authenticateToken,
  validateRequest(changePasswordSchema),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      // Users can only change their own password
      if (userId !== currentUser.id) {
        return res.status(403).json({
          success: false,
          message: 'Cannot change password for another user'
        });
      }
      
      await UserManagementService.changePassword(userId, req.body);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to change password'
      });
    }
  }
);

// ============================================================================
// SESSION MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/users/:userId/sessions
 * Get user sessions
 */
router.get('/users/:userId/sessions', 
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      // Users can only view their own sessions
      if (userId !== currentUser.id) {
        return res.status(403).json({
          success: false,
          message: 'Cannot view sessions for another user'
        });
      }
      
      const sessions = await SessionManagementService.getUserSessions(userId, true);
      
      res.json({
        success: true,
        data: { sessions }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve sessions'
      });
    }
  }
);

/**
 * DELETE /api/sessions/:sessionId
 * End specific session
 */
router.delete('/sessions/:sessionId', 
  authenticateToken,
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      await SessionManagementService.endSession(sessionId);
      
      res.json({
        success: true,
        message: 'Session ended successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to end session'
      });
    }
  }
);

// ============================================================================
// PERMISSION ROUTES
// ============================================================================

/**
 * GET /api/users/:userId/permissions
 * Get user permissions
 */
router.get('/users/:userId/permissions', 
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = (req as any).user;
      
      // Users can view their own permissions or admins can view any
      const canView = userId === currentUser.id || 
                     await PermissionManagementService.hasPermission(currentUser.id, 'users', 'view');
      
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Cannot view permissions for this user'
        });
      }
      
      const permissions = await PermissionManagementService.getUserPermissions(userId);
      
      res.json({
        success: true,
        data: { 
          permissions: permissions.map(p => ({
            id: p.id,
            name: p.name,
            resource: p.resource,
            action: p.action,
            description: p.description
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve permissions'
      });
    }
  }
);

// ============================================================================
// HEALTH CHECK ROUTES
// ============================================================================

/**
 * GET /api/health
 * API health check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
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
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default router;