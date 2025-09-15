/**
 * Smart Tourist Safety System - User Management Table
 * Comprehensive table component for displaying and managing users
 */

"use client";

import * as React from "react";
import { 
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'police_admin' | 'tourism_admin' | 'operator' | 'emergency_responder' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
  location?: string;
  permissions?: string[];
}

interface UserManagementTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onStatusChange?: (userId: string, status: User['status']) => void;
  onRoleChange?: (userId: string, role: User['role']) => void;
}

// ============================================================================
// ROLE & STATUS CONFIGURATIONS
// ============================================================================

const roleConfig = {
  super_admin: { 
    label: 'Super Admin', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Shield 
  },
  police_admin: { 
    label: 'Police Admin', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Shield 
  },
  tourism_admin: { 
    label: 'Tourism Admin', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Shield 
  },
  operator: { 
    label: 'Operator', 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: UserCheck 
  },
  emergency_responder: { 
    label: 'Emergency Responder', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: UserCheck 
  },
  viewer: { 
    label: 'Viewer', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Eye 
  }
};

const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: UserCheck 
  },
  inactive: { 
    label: 'Inactive', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: UserX 
  },
  suspended: { 
    label: 'Suspended', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: UserX 
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// ============================================================================
// USER AVATAR COMPONENT
// ============================================================================

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
      {getInitials(user.name)}
    </div>
  );
};

// ============================================================================
// USER MANAGEMENT TABLE COMPONENT
// ============================================================================

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  selectedUsers,
  onSelectionChange,
  onEdit,
  onDelete,
  onStatusChange,
  onRoleChange
}) => {
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

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isPartiallySelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isPartiallySelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all users"
              />
            </TableHead>
            <TableHead className="min-w-[200px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const roleInfo = roleConfig[user.role];
            const statusInfo = statusConfig[user.status];
            const RoleIcon = roleInfo.icon;
            const StatusIcon = statusInfo.icon;
            const isSelected = selectedUsers.includes(user.id);

            return (
              <TableRow 
                key={user.id}
                className={cn(
                  "hover:bg-gray-50 transition-colors",
                  isSelected && "bg-blue-50"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", roleInfo.color)}
                  >
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {roleInfo.label}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", statusInfo.color)}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    {user.department && (
                      <>
                        <MapPin className="h-3 w-3" />
                        {user.department}
                      </>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {formatDateTime(user.lastLogin)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </span>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(user.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      
                      {onStatusChange && (
                        <>
                          <DropdownMenuSeparator />
                          {user.status !== 'active' && (
                            <DropdownMenuItem 
                              onClick={() => onStatusChange(user.id, 'active')}
                            >
                              <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {user.status !== 'inactive' && (
                            <DropdownMenuItem 
                              onClick={() => onStatusChange(user.id, 'inactive')}
                            >
                              <UserX className="h-4 w-4 mr-2 text-gray-600" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          {user.status !== 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => onStatusChange(user.id, 'suspended')}
                            >
                              <UserX className="h-4 w-4 mr-2 text-red-600" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(user.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            No users match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};