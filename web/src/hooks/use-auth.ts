/**
 * Smart Tourist Safety System - Authentication Hook
 * Main authentication hook for user state management
 */

'use client';

import React, { useContext, createContext, useEffect, useState, ReactNode } from 'react';
import type { User, Permission, UserRole } from '@/types/auth';
import { usePermissions } from './use-permissions';

// ============================================================================
// SIMPLIFIED AUTH STATE
// ============================================================================

interface SimpleAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  
  // Permissions (delegated to usePermissions)
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canAccessRoute: (route: string) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// AUTH PROVIDER COMPONENT
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<SimpleAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  
  // Get permissions hook
  const permissions = usePermissions({
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading
  });
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Validate token and get user data
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setAuthState({
              user: userData.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            // Token invalid, clear it
            localStorage.removeItem('auth-token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication'
        });
      }
    };
    
    initializeAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('auth-token', data.access_token);
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Login failed'
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error occurred'
      }));
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  };
  
  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return false;
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth-token', data.access_token);
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          isAuthenticated: true
        }));
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };
  
  // Clear error function
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };
  
  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    
    // Actions
    login,
    logout,
    refreshToken,
    clearError,
    
    // Permissions (delegated)
    hasRole: permissions.hasRole,
    hasPermission: permissions.hasPermission,
    hasAnyPermission: permissions.hasAnyPermission,
    canAccessRoute: permissions.canAccessRoute,
    isAdmin: permissions.isAdmin,
    isStaff: permissions.isStaff
  };
  
  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};

// ============================================================================
// USE AUTH HOOK
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================================================
// MOCK DATA FOR DEVELOPMENT
// ============================================================================

export const mockUsers: Record<string, User> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'System Administrator',
    role: 'super_admin',
    avatar: '/avatars/admin.jpg',
    permissions: [
      'view_dashboard', 'manage_dashboard', 'view_analytics', 'export_data',
      'view_tourists', 'create_tourist', 'update_tourist', 'delete_tourist',
      'view_alerts', 'create_alert', 'update_alert', 'delete_alert',
      'view_zones', 'create_zone', 'update_zone', 'delete_zone',
      'manage_users', 'manage_settings', 'system_admin'
    ],
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  'operator@example.com': {
    id: '2',
    email: 'operator@example.com',
    name: 'Security Operator',
    role: 'operator',
    avatar: '/avatars/operator.jpg',
    permissions: [
      'view_dashboard', 'view_analytics',
      'view_tourists', 'create_tourist', 'update_tourist',
      'view_alerts', 'create_alert', 'update_alert',
      'view_zones', 'create_zone', 'update_zone'
    ],
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  'viewer@example.com': {
    id: '3',
    email: 'viewer@example.com',
    name: 'Dashboard Viewer',
    role: 'viewer',
    avatar: '/avatars/viewer.jpg',
    permissions: [
      'view_dashboard',
      'view_tourists',
      'view_alerts',
      'view_zones'
    ],
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAuth;
