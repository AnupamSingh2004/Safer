/**
 * Smart Tourist Safety System - Admin User Management Page
 * Main interface for admin user management operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Eye
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { useAuth } from '@/hooks/use-auth';
import { UserManagement } from '@/components/admin/user-management';
import type { User, UserRole, UserStatus } from '@/types/auth';

// ============================================================================
// INTERFACES
// ============================================================================

interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  department: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: Record<UserRole, number>;
  byDepartment: Record<string, number>;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    department: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  // ============================================================================
  // FILTERING AND SORTING
  // ============================================================================

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.isActive === (filters.status === 'active'));
    }

    // Department filter
    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return userDate >= startDate && userDate <= endDate;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'email':
          aVal = a.email || '';
          bVal = b.email || '';
          break;
        case 'role':
          aVal = a.role || '';
          bVal = b.role || '';
          break;
        case 'created':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'lastLogin':
          aVal = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
          bVal = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
          break;
        default:
          aVal = a.name || '';
          bVal = b.name || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  const handleBulkOperation = async (operation: string) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${operation} ${selectedUsers.length} user(s)?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          operation,
          userIds: selectedUsers
        })
      });

      if (response.ok) {
        await fetchUsers();
        await fetchStats();
        setSelectedUsers([]);
        alert(`Successfully ${operation}ed users`);
      } else {
        const error = await response.json();
        alert(`Failed to ${operation} users: ${error.message}`);
      }
    } catch (err) {
      alert(`Error performing bulk operation: ${err}`);
    }
  };

  // ============================================================================
  // EXPORT/IMPORT
  // ============================================================================

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/users/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      alert('Failed to export users');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard requiredRoles={['super_admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600">Manage system users, roles, and permissions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                
                <button
                  onClick={() => window.location.href = '/admin/users/create'}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatsCard
                title="Total Users"
                value={stats.total}
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="Active Users"
                value={stats.active}
                icon={UserCheck}
                color="green"
              />
              <StatsCard
                title="Inactive Users"
                value={stats.inactive}
                icon={UserX}
                color="gray"
              />
              <StatsCard
                title="Super Admins"
                value={stats.byRole.super_admin || 0}
                icon={Shield}
                color="red"
              />
              <StatsCard
                title="Operators"
                value={stats.byRole.operator || 0}
                icon={Users}
                color="purple"
              />
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Filters */}
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={filters.department}
                      onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Filter by department"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedUsers.length} user(s) selected
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkOperation('activate')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkOperation('deactivate')}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkOperation('suspend')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Component */}
        <div className="px-6 pb-6">
          <UserManagement
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
            onUserUpdate={fetchUsers}
            onStatsUpdate={fetchStats}
            viewMode={viewMode}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-900 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    gray: 'bg-gray-50 border-gray-200 text-gray-600'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
        <Icon className="h-8 w-8" />
      </div>
    </div>
  );
};