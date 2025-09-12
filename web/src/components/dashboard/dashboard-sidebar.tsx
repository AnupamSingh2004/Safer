/**
 * Smart Tourist Safety System - Dashboard Sidebar
 * Navigation sidebar with role-based menu items
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  AlertTriangle,
  MapPin,
  Shield,
  BarChart3,
  Settings,
  FileText,
  Smartphone,
  Bell,
  Database,
  UserPlus,
  Calendar,
  Globe,
  Search,
  X,
  MessageSquare,
  Radio,
  Navigation,
  Grid3X3,
  Table,
  Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, usePermissions } from '@/hooks/use-auth';
import { APP_CONFIG } from '@/lib/constants';

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  requiredRole?: string[];
  requiredPermission?: string[];
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Tourist Management',
    href: '/dashboard/tourists',
    icon: Users,
    requiredPermission: ['tourists.view'],
    children: [
      {
        name: 'All Tourists',
        href: '/dashboard/tourists',
        icon: Users,
        requiredPermission: ['tourists.view'],
      },
      {
        name: 'Registration',
        href: '/dashboard/tourists/register',
        icon: UserPlus,
        requiredPermission: ['tourists.create'],
      },
      {
        name: 'Check-ins',
        href: '/dashboard/tourists/checkins',
        icon: Calendar,
        requiredPermission: ['tourists.view'],
      },
    ],
  },
  {
    name: 'Safety Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
    requiredPermission: ['alerts.view'],
    children: [
      {
        name: 'Active Alerts',
        href: '/dashboard/alerts',
        icon: AlertTriangle,
        requiredPermission: ['alerts.view'],
      },
      {
        name: 'Emergency Response',
        href: '/dashboard/alerts/emergency',
        icon: Bell,
        requiredPermission: ['emergency.respond'],
      },
      {
        name: 'Alert History',
        href: '/dashboard/alerts/history',
        icon: FileText,
        requiredPermission: ['alerts.view'],
      },
    ],
  },
  {
    name: 'Zone Management',
    href: '/dashboard/zones',
    icon: MapPin,
    requiredPermission: ['zones.view'],
    children: [
      {
        name: 'Safety Zones',
        href: '/dashboard/zones',
        icon: MapPin,
        requiredPermission: ['zones.view'],
      },
      {
        name: 'Risk Assessment',
        href: '/dashboard/zones/risk',
        icon: BarChart3,
        requiredPermission: ['zones.view'],
      },
    ],
  },
  {
    name: 'Digital Identity',
    href: '/dashboard/blockchain',
    icon: Shield,
    requiredPermission: ['blockchain.view'],
    children: [
      {
        name: 'Identity Records',
        href: '/dashboard/blockchain/identities',
        icon: Database,
        requiredPermission: ['blockchain.view'],
      },
      {
        name: 'Generate ID',
        href: '/dashboard/blockchain/generate',
        icon: UserPlus,
        requiredPermission: ['blockchain.generate_identity'],
      },
      {
        name: 'Verify Identity',
        href: '/dashboard/blockchain/verify',
        icon: Search,
        requiredPermission: ['blockchain.verify_identity'],
      },
    ],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    requiredPermission: ['analytics.view'],
    children: [
      {
        name: 'Safety Reports',
        href: '/dashboard/analytics/safety',
        icon: BarChart3,
        requiredPermission: ['analytics.view'],
      },
      {
        name: 'Tourist Insights',
        href: '/dashboard/analytics/tourists',
        icon: Users,
        requiredPermission: ['analytics.view'],
      },
      {
        name: 'Zone Analytics',
        href: '/dashboard/analytics/zones',
        icon: MapPin,
        requiredPermission: ['analytics.view'],
      },
    ],
  },
  {
    name: 'Communication',
    href: '/dashboard/communication',
    icon: MessageSquare,
    requiredPermission: ['communication.view'],
    children: [
      {
        name: 'Real-time Messaging',
        href: '/dashboard/communication/messaging',
        icon: MessageSquare,
        requiredPermission: ['communication.message'],
      },
      {
        name: 'Notifications',
        href: '/dashboard/communication/notifications',
        icon: Bell,
        requiredPermission: ['communication.notify'],
      },
      {
        name: 'Broadcast System',
        href: '/dashboard/communication/broadcast',
        icon: Radio,
        requiredPermission: ['communication.broadcast'],
      },
    ],
  },
  {
    name: 'Location Services',
    href: '/dashboard/location',
    icon: Navigation,
    requiredPermission: ['location.view'],
    children: [
      {
        name: 'Live Tracking',
        href: '/dashboard/location/tracking',
        icon: Navigation,
        requiredPermission: ['location.track'],
      },
      {
        name: 'Geofence Management',
        href: '/dashboard/location/geofences',
        icon: MapPin,
        requiredPermission: ['location.manage_geofences'],
      },
      {
        name: 'Nearby Services',
        href: '/dashboard/location/services',
        icon: Map,
        requiredPermission: ['location.view'],
      },
    ],
  },
  {
    name: 'Advanced UI',
    href: '/dashboard/advanced-ui',
    icon: Grid3X3,
    requiredPermission: ['system.view_ui'],
    children: [
      {
        name: 'Advanced Search',
        href: '/dashboard/advanced-ui#search',
        icon: Search,
        requiredPermission: ['system.view_ui'],
      },
      {
        name: 'Data Grid',
        href: '/dashboard/advanced-ui#grid',
        icon: Table,
        requiredPermission: ['system.view_ui'],
      },
      {
        name: 'Interactive Dashboard',
        href: '/dashboard/advanced-ui#dashboard',
        icon: BarChart3,
        requiredPermission: ['system.view_ui'],
      },
    ],
  },
  {
    name: 'Mobile App',
    href: '/dashboard/mobile',
    icon: Smartphone,
    requiredPermission: ['system.view_logs'],
    children: [
      {
        name: 'App Analytics',
        href: '/dashboard/mobile/analytics',
        icon: BarChart3,
        requiredPermission: ['analytics.view'],
      },
      {
        name: 'Push Notifications',
        href: '/dashboard/mobile/notifications',
        icon: Bell,
        requiredPermission: ['system.configure'],
      },
    ],
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    requiredPermission: ['reports.generate'],
  },
  {
    name: 'System Admin',
    href: '/dashboard/admin',
    icon: Settings,
    requiredRole: ['super_admin', 'tourism_admin', 'police_admin'],
    children: [
      {
        name: 'User Management',
        href: '/dashboard/admin/users',
        icon: Users,
        requiredPermission: ['system.manage_users'],
      },
      {
        name: 'System Settings',
        href: '/dashboard/admin/settings',
        icon: Settings,
        requiredPermission: ['system.configure'],
      },
      {
        name: 'Audit Logs',
        href: '/dashboard/admin/logs',
        icon: FileText,
        requiredPermission: ['system.view_logs'],
      },
    ],
  },
];

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { hasPermission, hasAnyRole } = usePermissions();

  // Filter navigation items based on permissions
  const filteredNavItems = navigationItems.filter(item => {
    // Check role requirements
    if (item.requiredRole && !hasAnyRole(item.requiredRole as any)) {
      return false;
    }
    
    // Check permission requirements
    if (item.requiredPermission && !item.requiredPermission.some(perm => hasPermission(perm as any))) {
      return false;
    }
    
    return true;
  });

  // Check if path is active
  const isActivePath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Render navigation item
  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = isActivePath(item.href);
    const hasChildren = item.children && item.children.length > 0;
    
    // Filter children based on permissions
    const filteredChildren = item.children?.filter(child => {
      if (child.requiredRole && !hasAnyRole(child.requiredRole as any)) {
        return false;
      }
      if (child.requiredPermission && !child.requiredPermission.some(perm => hasPermission(perm as any))) {
        return false;
      }
      return true;
    });

    return (
      <div key={item.href}>
        <Link
          href={item.href}
          onClick={() => {
            if (window.innerWidth < 1024) {
              onClose();
            }
          }}
          className={cn(
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
            level === 0 ? 'mx-2' : 'mx-4',
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <item.icon
            className={cn(
              'mr-3 flex-shrink-0 h-5 w-5',
              isActive
                ? 'text-white'
                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
            )}
          />
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-800">
              {item.badge}
            </span>
          )}
        </Link>
        
        {/* Render children */}
        {hasChildren && filteredChildren && filteredChildren.length > 0 && (
          <div className="mt-1 space-y-1">
            {filteredChildren.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {APP_CONFIG.name}
                </h1>
              </div>
            </div>

            {/* User info */}
            {user && (
              <div className="mt-6 px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.displayName || `${user.firstName} ${user.lastName}`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {filteredNavItems.map(item => renderNavItem(item))}
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Version {APP_CONFIG.version}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
          {/* Mobile header */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                {APP_CONFIG.name}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile user info */}
          {user && (
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.displayName || `${user.firstName} ${user.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.department}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map(item => renderNavItem(item))}
          </nav>

          {/* Mobile footer */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Version {APP_CONFIG.version}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
