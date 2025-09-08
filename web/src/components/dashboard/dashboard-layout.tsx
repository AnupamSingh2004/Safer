/**
 * Smart Tourist Safety System - Dashboard Layout
 * Main layout component for the dashboard with sidebar and header
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Settings, 
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { NotificationPanel } from './notification-panel';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={cn('h-screen flex bg-gray-50 dark:bg-gray-900', className)}>
      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setNotificationPanelOpen(true)}
          hasUnreadNotifications={true}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        open={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </div>
  );
}

// ============================================================================
// PAGE WRAPPER COMPONENT
// ============================================================================

interface DashboardPageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

export function DashboardPage({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}: DashboardPageProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page header */}
      {(title || subtitle || actions || breadcrumbs) && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="inline-flex items-center">
                      {index > 0 && (
                        <ChevronDown className="w-4 h-4 text-gray-400 mx-2 rotate-[-90deg]" />
                      )}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Title and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <div>{children}</div>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

export function DashboardLayoutSkeleton() {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="ml-3 w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center px-2 py-2 text-sm">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="ml-3 w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header skeleton */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="lg:hidden w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="hidden sm:block ml-4 w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
