/**
 * Smart Tourist Safety System - Admin Layout
 * Layout component for admin-only pages with enhanced security and navigation
 */

"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { 
  Shield, 
  Users, 
  Settings, 
  Database,
  Activity,
  AlertTriangle,
  FileText,
  Lock,
  Crown,
  Eye,
  UserCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PermissionGuard } from "@/components/layout/permission-renderer";
import { PageLoading } from "@/components/common/loading";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  requiredPermissions: string[];
  isNew?: boolean;
  badgeText?: string;
  badgeVariant?: 'destructive' | 'warning' | 'success' | 'secondary';
}

// ============================================================================
// ADMIN NAVIGATION CONFIGURATION
// ============================================================================

const adminNavigation: AdminNavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Activity,
    description: 'Admin dashboard overview',
    requiredPermissions: ['read']
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage system users and roles',
    requiredPermissions: ['user_management'],
    badgeText: 'NEW',
    badgeVariant: 'success'
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure system parameters',
    requiredPermissions: ['system_config']
  },
  {
    name: 'Database Management',
    href: '/admin/database',
    icon: Database,
    description: 'Database administration',
    requiredPermissions: ['system_config']
  },
  {
    name: 'Audit Logs',
    href: '/admin/audit',
    icon: FileText,
    description: 'View system audit trails',
    requiredPermissions: ['audit_logs']
  },
  {
    name: 'Security Center',
    href: '/admin/security',
    icon: Lock,
    description: 'Security monitoring and alerts',
    requiredPermissions: ['system_config'],
    badgeText: 'SECURE',
    badgeVariant: 'secondary'
  },
  {
    name: 'System Health',
    href: '/admin/health',
    icon: BarChart3,
    description: 'Monitor system performance',
    requiredPermissions: ['read']
  }
];

// ============================================================================
// ADMIN LAYOUT COMPONENT
// ============================================================================

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return <PageLoading message="Loading admin panel..." />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Check if user has admin access
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <div className="rounded-full bg-red-100 p-4 mx-auto w-16 h-16 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Access Required</h2>
            <p className="text-gray-600 mt-2">You need super admin privileges to access this area.</p>
          </div>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">System Administration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">System Online</span>
            </div>

            {/* Current Time */}
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleTimeString()}
            </div>

            {/* Admin Badge */}
            <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )} style={{ top: '4rem' }}>
          <div className="h-full flex flex-col">
            {/* Admin Info */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name || 'Admin User'}</p>
                  <p className="text-xs text-purple-600">System Administrator</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency Override
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Administration
              </h3>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const IconComponent = item.icon;
                
                return (
                  <TooltipProvider key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => router.push(item.href)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                            "hover:bg-gray-100 hover:text-gray-900",
                            isActive && "bg-purple-50 text-purple-700 border border-purple-200"
                          )}
                        >
                          <IconComponent className={cn(
                            "h-4 w-4",
                            isActive && "text-purple-600"
                          )} />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badgeText && (
                            <Badge 
                              variant={item.badgeVariant || 'secondary'} 
                              className="text-xs px-1.5 py-0"
                            >
                              {item.badgeText}
                            </Badge>
                          )}
                          {item.isNew && (
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Admin Panel v2.0</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "lg:ml-64"
        )}>
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <button 
                      onClick={() => router.push('/admin')}
                      className="hover:text-gray-700"
                    >
                      Admin
                    </button>
                  </li>
                  {pathname !== '/admin' && (
                    <>
                      <span>/</span>
                      <li className="text-gray-900 font-medium">
                        {getPageTitle(pathname)}
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            </div>

            {/* Page Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getPageTitle(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  const titleMap: Record<string, string> = {
    'users': 'User Management',
    'settings': 'System Settings',
    'database': 'Database Management',
    'audit': 'Audit Logs',
    'security': 'Security Center',
    'health': 'System Health',
    'create': 'Create User',
    'edit': 'Edit User'
  };
  
  return titleMap[lastSegment] || 'Dashboard';
}