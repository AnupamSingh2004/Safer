/**
 * Smart Tourist Safety System - Admin Service
 * Service layer for admin user management operations
 */

import { useState, useCallback } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'police_admin' | 'tourism_admin' | 'operator' | 'emergency_responder' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  location?: string;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  role: User['role'];
  department?: string;
  password: string;
  permissions?: string[];
}

export interface UpdateUserData extends Partial<CreateUserData> {
  status?: User['status'];
}

export interface UserFilters {
  search?: string;
  role?: User['role'];
  status?: User['status'];
  department?: string;
  page?: number;
  limit?: number;
}

export interface AdminServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@admin.gov.in',
    phone: '+91-9876543210',
    role: 'super_admin',
    status: 'active',
    department: 'Administration',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Sarah Police',
    email: 'sarah.police@police.gov.in',
    phone: '+91-9876543211',
    role: 'police_admin',
    status: 'active',
    department: 'Police Department',
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    permissions: ['police_operations', 'emergency_response']
  },
  {
    id: '3',
    name: 'Mike Tourism',
    email: 'mike.tourism@tourism.gov.in',
    phone: '+91-9876543212',
    role: 'tourism_admin',
    status: 'active',
    department: 'Tourism Department',
    lastLogin: '2024-01-15T08:45:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    permissions: ['tourism_management', 'location_tracking']
  },
  {
    id: '4',
    name: 'Alice Operator',
    email: 'alice.operator@system.gov.in',
    phone: '+91-9876543213',
    role: 'operator',
    status: 'active',
    department: 'Operations',
    lastLogin: '2024-01-15T11:00:00Z',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    permissions: ['data_entry', 'report_generation']
  },
  {
    id: '5',
    name: 'Bob Emergency',
    email: 'bob.emergency@emergency.gov.in',
    phone: '+91-9876543214',
    role: 'emergency_responder',
    status: 'active',
    department: 'Emergency Services',
    lastLogin: '2024-01-15T07:30:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T07:30:00Z',
    permissions: ['emergency_response', 'incident_management']
  },
  {
    id: '6',
    name: 'Carol Viewer',
    email: 'carol.viewer@system.gov.in',
    role: 'viewer',
    status: 'inactive',
    department: 'Public Relations',
    lastLogin: '2024-01-10T16:20:00Z',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    permissions: ['view_only']
  }
];

// ============================================================================
// ADMIN SERVICE HOOK
// ============================================================================

export const useAdminService = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate API delay
  const simulateDelay = (ms: number = 1000) => 
    new Promise(resolve => setTimeout(resolve, ms));

  // Fetch all users
  const fetchUsers = useCallback(async (filters?: UserFilters): Promise<AdminServiceResponse<PaginatedResponse<User>>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(800);

      let filteredUsers = [...mockUsers];

      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      }

      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }

      if (filters?.department) {
        filteredUsers = filteredUsers.filter(user => user.department === filters.department);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      const response: AdminServiceResponse<PaginatedResponse<User>> = {
        data: {
          items: paginatedUsers,
          total: filteredUsers.length,
          page,
          limit,
          totalPages: Math.ceil(filteredUsers.length / limit)
        },
        success: true,
        message: 'Users fetched successfully'
      };

      setUsers(paginatedUsers);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to fetch users';
      setError(errorMessage);
      return {
        data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new user
  const createUser = useCallback(async (userData: CreateUserData): Promise<AdminServiceResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(1200);

      // Validate email uniqueness
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: userData.permissions || []
      };

      mockUsers.push(newUser);
      setUsers(prev => [...prev, newUser]);

      return {
        data: newUser,
        success: true,
        message: 'User created successfully'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      return {
        data: {} as User,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (userId: string, userData: UpdateUserData): Promise<AdminServiceResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(1000);

      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser: User = {
        ...mockUsers[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };

      mockUsers[userIndex] = updatedUser;
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));

      return {
        data: updatedUser,
        success: true,
        message: 'User updated successfully'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      return {
        data: {} as User,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (userId: string): Promise<AdminServiceResponse<void>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(800);

      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      mockUsers.splice(userIndex, 1);
      setUsers(prev => prev.filter(user => user.id !== userId));

      return {
        data: undefined,
        success: true,
        message: 'User deleted successfully'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return {
        data: undefined,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user by ID
  const getUserById = useCallback(async (userId: string): Promise<AdminServiceResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(500);

      const user = mockUsers.find(user => user.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        data: user,
        success: true,
        message: 'User fetched successfully'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      return {
        data: {} as User,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk operations
  const bulkUpdateStatus = useCallback(async (userIds: string[], status: User['status']): Promise<AdminServiceResponse<User[]>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(1500);

      const updatedUsers: User[] = [];
      
      userIds.forEach(userId => {
        const userIndex = mockUsers.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            status,
            updatedAt: new Date().toISOString()
          };
          updatedUsers.push(mockUsers[userIndex]);
        }
      });

      setUsers(prev => prev.map(user => {
        const updatedUser = updatedUsers.find(u => u.id === user.id);
        return updatedUser || user;
      }));

      return {
        data: updatedUsers,
        success: true,
        message: `${updatedUsers.length} users updated successfully`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update users';
      setError(errorMessage);
      return {
        data: [],
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (userIds: string[]): Promise<AdminServiceResponse<void>> => {
    setLoading(true);
    setError(null);

    try {
      await simulateDelay(1200);

      userIds.forEach(userId => {
        const userIndex = mockUsers.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          mockUsers.splice(userIndex, 1);
        }
      });

      setUsers(prev => prev.filter(user => !userIds.includes(user.id)));

      return {
        data: undefined,
        success: true,
        message: `${userIds.length} users deleted successfully`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete users';
      setError(errorMessage);
      return {
        data: undefined,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    bulkUpdateStatus,
    bulkDelete
  };
};