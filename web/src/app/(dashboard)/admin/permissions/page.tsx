'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield,
  Users,
  Settings,
  Eye,
  Edit,
  Plus,
  Search,
  Key,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Info,
  Crown,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'operator' | 'tourist' | 'emergency' | 'analytics' | 'administration';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  lastModified: string;
}

interface UserPermission {
  userId: string;
  userName: string;
  userType: 'admin' | 'operator' | 'tourist' | 'viewer';
  roleId: string;
  roleName: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  specialPermissions: string[];
}

export default function PermissionsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [permissions] = useState<Permission[]>([
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Access to main dashboard', category: 'system', risk_level: 'low' },
    { id: 'manage_operators', name: 'Manage Operators', description: 'Create, edit, delete operators', category: 'operator', risk_level: 'high' },
    { id: 'assign_tourists', name: 'Assign Tourists', description: 'Assign tourists to operators', category: 'operator', risk_level: 'medium' },
    { id: 'view_tourists', name: 'View Tourists', description: 'View tourist information', category: 'tourist', risk_level: 'low' },
    { id: 'edit_tourists', name: 'Edit Tourists', description: 'Modify tourist information', category: 'tourist', risk_level: 'medium' },
    { id: 'delete_tourists', name: 'Delete Tourists', description: 'Remove tourist records', category: 'tourist', risk_level: 'high' },
    { id: 'emergency_response', name: 'Emergency Response', description: 'Handle emergency situations', category: 'emergency', risk_level: 'critical' },
    { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics and reports', category: 'analytics', risk_level: 'low' },
    { id: 'export_data', name: 'Export Data', description: 'Export system data', category: 'analytics', risk_level: 'medium' },
    { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration', category: 'administration', risk_level: 'critical' },
    { id: 'user_management', name: 'User Management', description: 'Manage user accounts', category: 'administration', risk_level: 'high' },
    { id: 'view_logs', name: 'View Logs', description: 'Access system logs', category: 'administration', risk_level: 'medium' }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      permissions: permissions.map(p => p.id),
      userCount: 2,
      isSystem: true,
      createdAt: '2023-01-01T00:00:00Z',
      lastModified: '2023-01-01T00:00:00Z'
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Administrative access with most permissions',
      permissions: ['view_dashboard', 'manage_operators', 'assign_tourists', 'view_tourists', 'edit_tourists', 'view_analytics', 'export_data', 'view_logs'],
      userCount: 5,
      isSystem: true,
      createdAt: '2023-01-01T00:00:00Z',
      lastModified: '2024-01-10T14:30:00Z'
    },
    {
      id: 'operator_senior',
      name: 'Senior Operator',
      description: 'Senior operator with emergency response capabilities',
      permissions: ['view_dashboard', 'assign_tourists', 'view_tourists', 'edit_tourists', 'emergency_response', 'view_analytics'],
      userCount: 8,
      isSystem: false,
      createdAt: '2023-02-15T10:00:00Z',
      lastModified: '2024-01-05T09:15:00Z'
    },
    {
      id: 'operator',
      name: 'Operator',
      description: 'Standard operator permissions',
      permissions: ['view_dashboard', 'view_tourists', 'edit_tourists'],
      userCount: 25,
      isSystem: false,
      createdAt: '2023-02-15T10:00:00Z',
      lastModified: '2023-12-20T16:45:00Z'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to system',
      permissions: ['view_dashboard', 'view_tourists', 'view_analytics'],
      userCount: 12,
      isSystem: false,
      createdAt: '2023-03-01T12:00:00Z',
      lastModified: '2023-11-15T11:20:00Z'
    }
  ]);

  const [userPermissions] = useState<UserPermission[]>([
    {
      userId: 'ADM001',
      userName: 'System Administrator',
      userType: 'admin',
      roleId: 'super_admin',
      roleName: 'Super Administrator',
      status: 'active',
      lastLogin: '2024-01-15T14:30:00Z',
      specialPermissions: []
    },
    {
      userId: 'ADM002',
      userName: 'Sarah Johnson',
      userType: 'admin',
      roleId: 'admin',
      roleName: 'Administrator',
      status: 'active',
      lastLogin: '2024-01-15T13:45:00Z',
      specialPermissions: ['emergency_response']
    },
    {
      userId: 'OP001',
      userName: 'Rajesh Kumar',
      userType: 'operator',
      roleId: 'operator_senior',
      roleName: 'Senior Operator',
      status: 'active',
      lastLogin: '2024-01-15T14:25:00Z',
      specialPermissions: []
    },
    {
      userId: 'OP002',
      userName: 'Priya Sharma',
      userType: 'operator',
      roleId: 'operator',
      roleName: 'Operator',
      status: 'active',
      lastLogin: '2024-01-15T14:20:00Z',
      specialPermissions: ['emergency_response']
    },
    {
      userId: 'OP004',
      userName: 'Anita Patel',
      userType: 'operator',
      roleId: 'operator',
      roleName: 'Operator',
      status: 'suspended',
      lastLogin: '2024-01-14T18:00:00Z',
      specialPermissions: []
    },
    {
      userId: 'VW001',
      userName: 'Tourist Department Inspector',
      userType: 'viewer',
      roleId: 'viewer',
      roleName: 'Viewer',
      status: 'active',
      lastLogin: '2024-01-15T12:00:00Z',
      specialPermissions: []
    }
  ]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'text-blue-600 bg-blue-50';
      case 'operator': return 'text-green-600 bg-green-50';
      case 'tourist': return 'text-purple-600 bg-purple-50';
      case 'emergency': return 'text-red-600 bg-red-50';
      case 'analytics': return 'text-indigo-600 bg-indigo-50';
      case 'administration': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'suspended': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'operator': return <UserCheck className="h-4 w-4" />;
      case 'viewer': return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const handleCreateRole = () => {
    router.push('/admin/permissions/roles/create');
  };

  const handleEditRole = (roleId: string) => {
    router.push(`/admin/permissions/roles/${roleId}/edit`);
  };

  const handleEditUserPermissions = (userId: string) => {
    router.push(`/admin/permissions/users/${userId}/edit`);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = userPermissions.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions Management</h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and access control
          </p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-1 mb-4">
            <Button
              variant={activeTab === 'roles' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('roles')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Roles
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === 'permissions' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('permissions')}
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Permissions
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle>Roles ({filteredRoles.length})</CardTitle>
            <CardDescription>
              Manage user roles and their associated permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRoles.map((role) => (
                <div key={role.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{role.name}</h3>
                          {role.isSystem && (
                            <Badge className="text-purple-600 bg-purple-50">
                              System Role
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {role.userCount} users
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {formatTimestamp(role.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Modified: {formatTimestamp(role.lastModified)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Permissions ({role.permissions.length}):
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permissionId) => {
                        const permission = permissions.find(p => p.id === permissionId);
                        if (!permission) return null;
                        
                        return (
                          <Badge 
                            key={permissionId} 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(permission.category)}`}
                          >
                            {permission.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Permissions ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Manage individual user permissions and role assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.userId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getUserTypeIcon(user.userType)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.userName}</h3>
                          <Badge variant={getStatusVariant(user.status)}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(user.status)}`} />
                            {user.status}
                          </Badge>
                          <Badge className={getCategoryColor('system')}>
                            {user.userType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          User ID: {user.userId} | Role: {user.roleName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last login: {formatTimestamp(user.lastLogin)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditUserPermissions(user.userId)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {user.specialPermissions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Special Permissions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.specialPermissions.map((permissionId) => {
                          const permission = permissions.find(p => p.id === permissionId);
                          if (!permission) return null;
                          
                          return (
                            <Badge 
                              key={permissionId} 
                              className="text-xs text-orange-600 bg-orange-50"
                            >
                              {permission.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Available Permissions ({filteredPermissions.length})</CardTitle>
            <CardDescription>
              System permissions that can be assigned to roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPermissions.map((permission) => (
                <div key={permission.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Key className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{permission.name}</h3>
                          <Badge className={getCategoryColor(permission.category)}>
                            {permission.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${getRiskLevelColor(permission.risk_level)} border`}
                          >
                            {permission.risk_level} risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Permission ID: {permission.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/dashboard')}>
              Back to Admin Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/operators')}
            >
              Manage Operators
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/logs')}
            >
              View System Logs
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/analytics')}
            >
              System Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}