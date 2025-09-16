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
import { ThemeToggle } from '@/components/theme/unified-theme-components';
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
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-8 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <span className="ml-3 text-xl font-bold text-foreground">
              Tourist Safety
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-3">
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
                    "w-full flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg mr-4 transition-colors",
                    isActive ? "bg-primary-foreground/20" : "bg-muted/50 group-hover:bg-muted"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className={cn(
                      "text-xs mt-1",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-6 border-t border-border bg-gradient-to-r from-muted/30 to-muted/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-primary/20 rounded-xl">
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {(user as any).name || user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.role.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200 font-medium"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top header */}
        <div className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between h-20 px-6 sm:px-8 lg:px-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-foreground">
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl">
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
