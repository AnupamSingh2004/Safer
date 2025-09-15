/**
 * Smart Tourist Safety System - User Management Component
 * Comprehensive user CRUD operations and management interface
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX, 
  Shield,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
  Building,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User as UserIcon
} from 'lucide-react';
import type { User, UserRole } from '@/types/auth';

// ============================================================================
// INTERFACES
// ============================================================================

interface UserManagementProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  onUserUpdate: () => void;
  onStatsUpdate: () => void;
  viewMode: 'table' | 'cards';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface DeleteConfirmModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  selectedUsers,
  onSelectionChange,
  onUserUpdate,
  onStatsUpdate,
  viewMode,
  sortBy,
  sortOrder,
  onSortChange
}) => {
  // State management
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ============================================================================
  // USER ACTIONS
  // ============================================================================

  const handleUserAction = async (userId: string, action: string) => {
    setActionLoading(`${action}-${userId}`);

    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });

      if (response.ok) {
        onUserUpdate();
        onStatsUpdate();
      } else {
        const error = await response.json();
        alert(`Failed to ${action} user: ${error.message}`);
      }
    } catch (err) {
      alert(`Error performing action: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });

      if (response.ok) {
        onUserUpdate();
        onStatsUpdate();
        setDeletingUser(null);
      } else {
        const error = await response.json();
        alert(`Failed to delete user: ${error.message}`);
      }
    } catch (err) {
      alert(`Error deleting user: ${err}`);
    }
  };

  // ============================================================================
  // SELECTION HANDLERS
  // ============================================================================

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map(user => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUsers, userId]);
    } else {
      onSelectionChange(selectedUsers.filter(id => id !== userId));
    }
  };

  // ============================================================================
  // SORTING
  // ============================================================================

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newOrder);
  };

  const SortButton: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      {children}
      {sortBy === field && (
        sortOrder === 'asc' ? 
          <ChevronUp className="h-4 w-4" /> : 
          <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  // ============================================================================
  // RENDER METHODS
  // ============================================================================

  const renderTableView = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="name">User</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="role">Role</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="lastLogin">Last Login</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.department || 'Not assigned'}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge isActive={user.isActive} isVerified={user.isVerified} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.lastLogin ? (
                    <div>
                      <div>{new Date(user.lastLogin).toLocaleDateString()}</div>
                      <div className="text-xs">{new Date(user.lastLogin).toLocaleTimeString()}</div>
                    </div>
                  ) : (
                    'Never'
                  )}
                </td>
                <td className="px-6 py-4">
                  <UserActionMenu 
                    user={user} 
                    onView={() => setViewingUser(user)}
                    onEdit={() => setEditingUser(user)}
                    onDelete={() => setDeletingUser(user)}
                    onToggleStatus={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                    actionLoading={actionLoading}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
        </div>
      )}
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard 
          key={user.id}
          user={user}
          isSelected={selectedUsers.includes(user.id)}
          onSelect={(checked) => handleSelectUser(user.id, checked)}
          onView={() => setViewingUser(user)}
          onEdit={() => setEditingUser(user)}
          onDelete={() => setDeletingUser(user)}
          onToggleStatus={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
          actionLoading={actionLoading}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Main Content */}
      {viewMode === 'table' ? renderTableView() : renderCardView()}

      {/* Modals */}
      <AnimatePresence>
        {editingUser && (
          <EditUserModal
            user={editingUser}
            isOpen={!!editingUser}
            onClose={() => setEditingUser(null)}
            onUpdate={() => {
              onUserUpdate();
              onStatsUpdate();
              setEditingUser(null);
            }}
          />
        )}

        {deletingUser && (
          <DeleteConfirmModal
            user={deletingUser}
            isOpen={!!deletingUser}
            onClose={() => setDeletingUser(null)}
            onConfirm={() => handleDeleteUser(deletingUser.id)}
          />
        )}

        {viewingUser && (
          <UserDetailModal
            user={viewingUser}
            isOpen={!!viewingUser}
            onClose={() => setViewingUser(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const roleConfig = {
    super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
    operator: { label: 'Operator', color: 'bg-blue-100 text-blue-800' },
    viewer: { label: 'Viewer', color: 'bg-green-100 text-green-800' }
  };

  const config = roleConfig[role];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const StatusBadge: React.FC<{ isActive: boolean; isVerified: boolean }> = ({ isActive, isVerified }) => {
  if (!isActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  }

  if (!isVerified) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <CheckCircle className="w-3 h-3 mr-1" />
      Active
    </span>
  );
};

const UserActionMenu: React.FC<{
  user: User;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  actionLoading: string | null;
}> = ({ user, onView, onEdit, onDelete, onToggleStatus, actionLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => { onView(); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button
              onClick={() => { onEdit(); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </button>
            <button
              onClick={() => { onToggleStatus(); setIsOpen(false); }}
              disabled={actionLoading === `${user.isActive ? 'deactivate' : 'activate'}-${user.id}`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50"
            >
              {user.isActive ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </button>
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserCard: React.FC<{
  user: User;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  actionLoading: string | null;
}> = ({ user, isSelected, onSelect, onView, onEdit, onDelete, onToggleStatus, actionLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        {user.avatar ? (
          <img className="h-12 w-12 rounded-full" src={user.avatar} alt="" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-gray-600" />
          </div>
        )}
      </div>
      <UserActionMenu 
        user={user}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        actionLoading={actionLoading}
      />
    </div>

    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-gray-400" />
        <RoleBadge role={user.role} />
      </div>
      <div className="flex items-center gap-2">
        <Building className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">{user.department || 'Not assigned'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never logged in'}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <StatusBadge isActive={user.isActive} isVerified={user.isVerified} />
      <button
        onClick={onView}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Details
      </button>
    </div>
  </motion.div>
);

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    department: user.department || '',
    isActive: user.isActive
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onUpdate();
      } else {
        const error = await response.json();
        alert(`Failed to update user: ${error.message}`);
      }
    } catch (err) {
      alert(`Error updating user: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="viewer">Viewer</option>
              <option value="operator">Operator</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active User
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ user, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const UserDetailModal: React.FC<{ user: User; isOpen: boolean; onClose: () => void }> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img className="h-16 w-16 rounded-full" src={user.avatar} alt="" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
                <StatusBadge isActive={user.isActive} isVerified={user.isVerified} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Work Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{user.department || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Activity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Login:</span>
                <span className="ml-2">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          {user.permissions && user.permissions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};