/**
 * Smart Tourist Safety System - Dashboard Layout
 * Shared layout for all dashboard pages with navigation and theme toggle
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Activity,
  MapPin,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  UserCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Activity,
    description: 'Main dashboard overview',
    roles: ['super_admin', 'operator', 'viewer'], // All roles can see overview
    permissions: []
  },
  {
    name: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
    description: 'Safety alerts and incidents',
    roles: ['super_admin', 'operator'], // Only admin and operator can manage alerts
    permissions: ['read', 'write']
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Tourist statistics and trends',
    roles: ['super_admin', 'operator', 'viewer'], // All roles can view analytics
    permissions: ['read']
  },
  {
    name: 'Location',
    href: '/dashboard/location',
    icon: MapPin,
    description: 'Real-time location tracking',
    roles: ['super_admin', 'operator'], // Only admin and operator can track locations
    permissions: ['read', 'write']
  },
  {
    name: 'Communication',
    href: '/dashboard/communication',
    icon: MessageSquare,
    description: 'Send alerts and notifications',
    roles: ['super_admin', 'operator'], // Only admin and operator can send communications
    permissions: ['write']
  },
  {
    name: 'Advanced UI',
    href: '/dashboard/advanced-ui',
    icon: Settings,
    description: 'Advanced dashboard features',
    roles: ['super_admin'], // Only admin can access advanced features
    permissions: ['system_config']
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black opacity-25"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Shield className="w-8 h-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Tourist Safety
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems
              .filter(item => {
                // Filter navigation items based on user role
                if (!user?.role) return false;
                return item.roles.includes(user.role);
              })
              .map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>{item.name}</div>
                    <div className={cn(
                      "text-xs opacity-75",
                      isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <UserCheck className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {(user as any).name || user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleString()}
              </div>
              <ThemeToggle variant="icon" size="sm" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
