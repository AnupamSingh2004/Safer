/**
 * Smart Tourist Safety System - Sidebar Component
 * Navigation sidebar with role-based menu visibility and active state indicators
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  MapPin,
  BarChart3,
  Shield,
  Settings,
  FileText,
  Radio,
  Map,
  UserCheck,
  Clock,
  ChevronDown,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

// ============================================================================
// SIDEBAR INTERFACES
// ============================================================================

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: string[];
  roles?: string[];
  badge?: string | number;
  children?: MenuItem[];
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

// ============================================================================
// MENU CONFIGURATION
// ============================================================================

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['analytics.view'],
  },
  {
    id: 'tourists',
    label: 'Tourists',
    href: '/dashboard/tourists',
    icon: Users,
    permissions: ['tourists.view'],
    children: [
      {
        id: 'tourists-active',
        label: 'Active Tourists',
        href: '/dashboard/tourists/active',
        icon: UserCheck,
        permissions: ['tourists.view'],
      },
      {
        id: 'tourists-history',
        label: 'Visit History',
        href: '/dashboard/tourists/history',
        icon: Clock,
        permissions: ['tourists.view'],
      },
      {
        id: 'tourists-reports',
        label: 'Reports',
        href: '/dashboard/tourists/reports',
        icon: FileText,
        permissions: ['tourists.view', 'reports.generate'],
      },
    ],
  },
  {
    id: 'alerts',
    label: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
    permissions: ['alerts.view'],
    badge: 12, // Dynamic badge for active alerts
    children: [
      {
        id: 'alerts-active',
        label: 'Active Alerts',
        href: '/dashboard/alerts/active',
        icon: Radio,
        permissions: ['alerts.view'],
        badge: 5,
      },
      {
        id: 'alerts-emergency',
        label: 'Emergency',
        href: '/dashboard/alerts/emergency',
        icon: AlertTriangle,
        permissions: ['emergency.respond'],
        badge: 2,
      },
      {
        id: 'alerts-resolved',
        label: 'Resolved',
        href: '/dashboard/alerts/resolved',
        icon: UserCheck,
        permissions: ['alerts.view'],
      },
    ],
  },
  {
    id: 'zones',
    label: 'Safety Zones',
    href: '/dashboard/zones',
    icon: MapPin,
    permissions: ['zones.view'],
    children: [
      {
        id: 'zones-geofences',
        label: 'Geofences',
        href: '/dashboard/zones/geofences',
        icon: Map,
        permissions: ['zones.view'],
      },
      {
        id: 'zones-hotspots',
        label: 'Risk Hotspots',
        href: '/dashboard/zones/hotspots',
        icon: AlertTriangle,
        permissions: ['zones.view'],
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    permissions: ['analytics.view'],
    children: [
      {
        id: 'analytics-overview',
        label: 'Overview',
        href: '/dashboard/analytics/overview',
        icon: Activity,
        permissions: ['analytics.view'],
      },
      {
        id: 'analytics-reports',
        label: 'Reports',
        href: '/dashboard/analytics/reports',
        icon: FileText,
        permissions: ['reports.generate'],
      },
    ],
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    href: '/dashboard/blockchain',
    icon: Shield,
    permissions: ['blockchain.view'],
    children: [
      {
        id: 'blockchain-identities',
        label: 'Digital IDs',
        href: '/dashboard/blockchain/identities',
        icon: UserCheck,
        permissions: ['blockchain.view'],
      },
      {
        id: 'blockchain-verification',
        label: 'Verification',
        href: '/dashboard/blockchain/verification',
        icon: Shield,
        permissions: ['blockchain.verify_identity'],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    permissions: ['system.configure'],
    children: [
      {
        id: 'settings-users',
        label: 'User Management',
        href: '/dashboard/settings/users',
        icon: Users,
        permissions: ['system.manage_users'],
      },
      {
        id: 'settings-system',
        label: 'System Config',
        href: '/dashboard/settings/system',
        icon: Settings,
        permissions: ['system.configure'],
      },
    ],
  },
];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  // Auto-expand current section
  React.useEffect(() => {
    const currentSection = menuItems.find(item => 
      pathname.startsWith(item.href) || 
      item.children?.some(child => pathname.startsWith(child.href))
    );
    
    if (currentSection) {
      setExpandedItems(prev => new Set([...prev, currentSection.id]));
    }
  }, [pathname]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isItemVisible = (item: MenuItem) => {
    // Check permissions
    if (item.permissions && item.permissions.length > 0) {
      if (!user?.permissions || !item.permissions.some(p => user.permissions?.includes(p as any))) {
        return false;
      }
    }

    // Check roles
    if (item.roles && item.roles.length > 0) {
      if (!user || !item.roles.includes(user.role)) {
        return false;
      }
    }

    return true;
  };

  const isItemActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  const isChildActive = (item: MenuItem) => {
    return pathname === item.href;
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    if (!isItemVisible(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = isChild ? isChildActive(item) : isItemActive(item);

    const itemContent = (
      <div
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
          isChild ? 'pl-8' : 'px-3',
          isActive
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          'group'
        )}
      >
        <div className="flex items-center space-x-3">
          <item.icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-gray-500')} />
          <span>{item.label}</span>
          {item.badge && (
            <span className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-full',
              isActive 
                ? 'bg-blue-200 text-blue-800' 
                : 'bg-gray-200 text-gray-700'
            )}>
              {item.badge}
            </span>
          )}
        </div>
        
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleExpanded(item.id);
            }}
            className="p-1 rounded hover:bg-gray-200"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );

    return (
      <li key={item.id}>
        {hasChildren ? (
          <>
            <div className="cursor-pointer" onClick={() => toggleExpanded(item.id)}>
              {itemContent}
            </div>
            {isExpanded && (
              <ul className="mt-1 space-y-1">
                {item.children?.map(child => renderMenuItem(child, true))}
              </ul>
            )}
          </>
        ) : (
          <Link href={item.href} onClick={onClose}>
            {itemContent}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Safety Hub</h2>
              <p className="text-xs text-gray-500">Emergency Response</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {(user.displayName || 'User').split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-400">{user.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(item => renderMenuItem(item))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>v2.1.0</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}