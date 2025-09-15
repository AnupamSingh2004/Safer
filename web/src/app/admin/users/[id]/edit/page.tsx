/**
 * Smart Tourist Safety System - Edit User Page
 * Form for editing existing system users with role management
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft,
  UserEdit,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useAdminService, type User } from "@/services/admin-service";
import { cn } from "@/lib/utils";

// ============================================================================
// FORM SCHEMA & VALIDATION
// ============================================================================

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum([
    'super_admin',
    'police_admin', 
    'tourism_admin',
    'operator',
    'emergency_responder',
    'viewer'
  ]),
  department: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  permissions: z.array(z.string()).optional(),
  resetPassword: z.boolean().default(false),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional()
}).refine((data) => {
  if (data.resetPassword) {
    return data.newPassword && data.newPassword.length >= 8 && data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Password is required and must match confirmation when resetting",
  path: ["confirmPassword"],
});

type EditUserFormData = z.infer<typeof editUserSchema>;

// ============================================================================
// ROLE & STATUS CONFIGURATIONS
// ============================================================================

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access and administration',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    permissions: ['all']
  },
  police_admin: {
    label: 'Police Admin',
    description: 'Police operations and emergency response',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: ['police_operations', 'emergency_response', 'incident_management']
  },
  tourism_admin: {
    label: 'Tourism Admin',
    description: 'Tourism management and location tracking',
    color: 'bg-green-100 text-green-800 border-green-200',
    permissions: ['tourism_management', 'location_tracking', 'visitor_management']
  },
  operator: {
    label: 'Operator',
    description: 'Data entry and operational tasks',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    permissions: ['data_entry', 'report_generation', 'basic_operations']
  },
  emergency_responder: {
    label: 'Emergency Responder',
    description: 'Emergency response and incident handling',
    color: 'bg-red-100 text-red-800 border-red-200',
    permissions: ['emergency_response', 'incident_management', 'field_operations']
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access to system data',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    permissions: ['view_only']
  }
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-800' }
};

// ============================================================================
// EDIT USER PAGE COMPONENT
// ============================================================================

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { updateUser, deleteUser, getUserById, loading } = useAdminService();
  const [user, setUser] = React.useState<User | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loadingUser, setLoadingUser] = React.useState(true);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'viewer',
      department: '',
      status: 'active',
      permissions: [],
      resetPassword: false,
      newPassword: '',
      confirmPassword: ''
    }
  });

  const selectedRole = form.watch('role');
  const resetPassword = form.watch('resetPassword');
  const selectedRoleConfig = roleConfig[selectedRole];

  // Load user data
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getUserById(params.id);
        if (result.success && result.data) {
          const userData = result.data;
          setUser(userData);
          form.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            role: userData.role,
            department: userData.department || '',
            status: userData.status,
            permissions: userData.permissions || [],
            resetPassword: false,
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          router.push('/admin/users?error=user-not-found');
        }
      } catch (error) {
        router.push('/admin/users?error=load-failed');
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [params.id, getUserById, form, router]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        status: data.status,
        permissions: data.permissions || selectedRoleConfig.permissions
      };

      if (data.resetPassword && data.newPassword) {
        updateData.password = data.newPassword;
      }

      const result = await updateUser(params.id, updateData);

      if (result.success) {
        router.push('/admin/users?updated=true');
      } else {
        form.setError('root', { message: result.message || 'Failed to update user' });
      }
    } catch (error) {
      form.setError('root', { message: 'An unexpected error occurred' });
    }
  };

  const handleDeleteUser = async () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const result = await deleteUser(params.id);
        if (result.success) {
          router.push('/admin/users?deleted=true');
        } else {
          form.setError('root', { message: result.message || 'Failed to delete user' });
        }
      } catch (error) {
        form.setError('root', { message: 'Failed to delete user' });
      }
    }
  };

  if (loadingUser) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Loading user...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
        <p className="text-gray-600 mb-4">The requested user could not be found.</p>
        <Button onClick={() => router.push('/admin/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserEdit className="h-7 w-7 text-purple-600" />
              Edit User
            </h1>
            <p className="text-gray-600 mt-1">
              Modify user information and permissions
            </p>
          </div>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={handleDeleteUser}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="user@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91-9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Role & Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Role & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Role *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(roleConfig).map(([value, config]) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    {config.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([value, config]) => (
                                <SelectItem key={value} value={value}>
                                  {config.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedRoleConfig && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={selectedRoleConfig.color}>
                          {selectedRoleConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedRoleConfig.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Password Reset */}
              <Card>
                <CardHeader>
                  <CardTitle>Password Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="resetPassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Reset Password</FormLabel>
                          <FormDescription>
                            Enable this to set a new password for the user
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {resetPassword && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">User ID</Label>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Created</Label>
                    <p className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Last Updated</Label>
                    <p className="text-sm">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {user.lastLogin && (
                    <div>
                      <Label className="text-sm text-gray-600">Last Login</Label>
                      <p className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update User
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>

              {/* Error Display */}
              {form.formState.errors.root && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}