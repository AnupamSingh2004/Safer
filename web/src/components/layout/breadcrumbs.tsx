"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, Shield, AlertTriangle, MapPin, BarChart3, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// BREADCRUMB INTERFACES
// ============================================================================

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
  customItems?: BreadcrumbItem[];
  showHome?: boolean;
  maxItems?: number;
}

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

const routeMap: Record<string, { label: string; icon?: React.ComponentType<{ className?: string }> }> = {
  '': { label: 'Home', icon: Home },
  'dashboard': { label: 'Dashboard', icon: Shield },
  'tourists': { label: 'Tourists', icon: Users },
  'active': { label: 'Active Tourists' },
  'history': { label: 'Visit History' },
  'reports': { label: 'Reports' },
  'alerts': { label: 'Alerts', icon: AlertTriangle },
  'emergency': { label: 'Emergency' },
  'resolved': { label: 'Resolved' },
  'zones': { label: 'Safety Zones', icon: MapPin },
  'geofences': { label: 'Geofences' },
  'hotspots': { label: 'Risk Hotspots' },
  'analytics': { label: 'Analytics', icon: BarChart3 },
  'overview': { label: 'Overview' },
  'blockchain': { label: 'Blockchain', icon: Shield },
  'identities': { label: 'Digital IDs' },
  'verification': { label: 'Verification' },
  'settings': { label: 'Settings', icon: Settings },
  'users': { label: 'User Management' },
  'system': { label: 'System Config' },
  'profile': { label: 'Profile' },
  'notifications': { label: 'Notifications' },
  'security': { label: 'Security' },
  'preferences': { label: 'Preferences' },
  'audit': { label: 'Audit Log' },
  'backup': { label: 'Backup & Recovery' },
  'monitoring': { label: 'System Monitoring' },
  'performance': { label: 'Performance' },
  'logs': { label: 'System Logs' },
};

// Emergency context detection for special styling
const emergencyPaths = [
  '/dashboard/alerts/emergency',
  '/dashboard/alerts/active',
  '/dashboard/alerts/panic',
];

// ============================================================================
// BREADCRUMBS COMPONENT
// ============================================================================

export function Breadcrumbs({ 
  className, 
  customItems, 
  showHome = true, 
  maxItems = 5 
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  const generateBreadcrumbs = React.useMemo(() => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: Home,
      });
    }

    // Build breadcrumb trail
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap[segment] || { label: segment.charAt(0).toUpperCase() + segment.slice(1) };
      
      breadcrumbs.push({
        label: routeInfo.label,
        href: currentPath,
        icon: routeInfo.icon,
        isActive: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  }, [pathname, customItems, showHome]);

  // Truncate breadcrumbs if too many
  const displayBreadcrumbs = React.useMemo(() => {
    if (generateBreadcrumbs.length <= maxItems) {
      return generateBreadcrumbs;
    }

    const truncated = [...generateBreadcrumbs];
    const itemsToRemove = truncated.length - maxItems;
    
    // Keep first, last, and remove middle items
    if (itemsToRemove > 0) {
      truncated.splice(1, itemsToRemove, {
        label: '...',
        href: '#',
        isActive: false,
      });
    }

    return truncated;
  }, [generateBreadcrumbs, maxItems]);

  // Check if current path is emergency-related
  const isEmergencyContext = emergencyPaths.some(path => pathname.startsWith(path));

  if (displayBreadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs for root or single-level pages
  }

  return (
    <nav 
      className={cn(
        'flex items-center space-x-1 text-sm text-gray-600 py-2 px-4 bg-gray-50 border-b border-gray-200',
        isEmergencyContext && 'bg-red-50 border-red-200',
        className
      )}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-1">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={`${item.href}-${index}`} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className={cn(
                    'h-4 w-4 mx-1 text-gray-400',
                    isEmergencyContext && 'text-red-400'
                  )} 
                />
              )}
              
              {isEllipsis ? (
                <span className="px-2 py-1 text-gray-500">...</span>
              ) : isLast ? (
                // Active/current page - not clickable
                <span 
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 font-medium text-gray-900 bg-white rounded border',
                    isEmergencyContext && 'text-red-900 bg-red-100 border-red-300',
                    item.isActive && 'ring-2 ring-blue-500 ring-opacity-20'
                  )}
                  aria-current="page"
                >
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        'h-4 w-4',
                        isEmergencyContext ? 'text-red-600' : 'text-gray-600'
                      )} 
                    />
                  )}
                  <span>{item.label}</span>
                </span>
              ) : (
                // Clickable breadcrumb links
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors',
                    isEmergencyContext && 'text-red-600 hover:text-red-900 hover:bg-red-100'
                  )}
                >
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        'h-4 w-4',
                        isEmergencyContext ? 'text-red-500' : 'text-gray-500'
                      )} 
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Emergency indicator */}
      {isEmergencyContext && (
        <div className="ml-auto flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded-full text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            <span>EMERGENCY MODE</span>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// SPECIALIZED BREADCRUMB COMPONENTS
// ============================================================================

interface EmergencyBreadcrumbsProps {
  alertId?: string;
  alertType?: string;
  className?: string;
}

export function EmergencyBreadcrumbs({ 
  alertId, 
  alertType, 
  className 
}: EmergencyBreadcrumbsProps) {
  const customItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: Shield },
    { label: 'Emergency Alerts', href: '/dashboard/alerts/emergency', icon: AlertTriangle },
  ];

  if (alertId) {
    customItems.push({
      label: `Alert #${alertId}${alertType ? ` (${alertType})` : ''}`,
      href: `/dashboard/alerts/emergency/${alertId}`,
      isActive: true,
    });
  }

  return (
    <Breadcrumbs 
      customItems={customItems}
      className={cn('bg-red-50 border-red-200', className)}
    />
  );
}

interface TouristBreadcrumbsProps {
  touristId?: string;
  touristName?: string;
  section?: string;
  className?: string;
}

export function TouristBreadcrumbs({ 
  touristId, 
  touristName, 
  section,
  className 
}: TouristBreadcrumbsProps) {
  const customItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: Shield },
    { label: 'Tourists', href: '/dashboard/tourists', icon: Users },
  ];

  if (touristId) {
    customItems.push({
      label: touristName || `Tourist #${touristId}`,
      href: `/dashboard/tourists/${touristId}`,
      isActive: !section,
    });

    if (section) {
      customItems.push({
        label: section.charAt(0).toUpperCase() + section.slice(1),
        href: `/dashboard/tourists/${touristId}/${section}`,
        isActive: true,
      });
    }
  }

  return <Breadcrumbs customItems={customItems} className={className} />;
}

interface AnalyticsBreadcrumbsProps {
  reportType?: string;
  reportId?: string;
  className?: string;
}

export function AnalyticsBreadcrumbs({ 
  reportType, 
  reportId, 
  className 
}: AnalyticsBreadcrumbsProps) {
  const customItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: Shield },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ];

  if (reportType) {
    customItems.push({
      label: reportType.charAt(0).toUpperCase() + reportType.slice(1),
      href: `/dashboard/analytics/${reportType}`,
      isActive: !reportId,
    });

    if (reportId) {
      customItems.push({
        label: `Report #${reportId}`,
        href: `/dashboard/analytics/${reportType}/${reportId}`,
        isActive: true,
      });
    }
  }

  return <Breadcrumbs customItems={customItems} className={className} />;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type BreadcrumbItem,
  type BreadcrumbsProps,
  type EmergencyBreadcrumbsProps,
  type TouristBreadcrumbsProps,
  type AnalyticsBreadcrumbsProps,
};