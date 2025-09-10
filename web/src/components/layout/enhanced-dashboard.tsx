/**
 * Smart Tourist Safety System - Enhanced Dashboard Layout
 * Layout component with advanced UI features integration
 */

'use client';

import { useState, ReactNode } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  MapPin,
  Shield,
  Wallet,
  HelpCircle
} from 'lucide-react';
import RealTimeNotifications, { ToastNotifications } from '@/components/realtime/notifications';
import { ToastProvider } from '@/components/ui/advanced';

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false
  },
  {
    name: 'Tourists',
    href: '/dashboard/tourists',
    icon: Users,
    current: false
  },
  {
    name: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
    current: false
  },
  {
    name: 'Incidents',
    href: '/dashboard/incidents',
    icon: Shield,
    current: false
  },
  {
    name: 'Locations',
    href: '/dashboard/locations',
    icon: MapPin,
    current: false
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    current: false
  },
  {
    name: 'Blockchain',
    href: '/dashboard/blockchain',
    icon: Wallet,
    current: false
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    current: false
  }
];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TouristSafe</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      mr-3 h-5 w-5 transition-colors
                      ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `} 
                  />
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@touristsafe.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title */}
          {title && (
            <h1 className="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
              {title}
            </h1>
          )}
        </div>

        {/* Header actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Help */}
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Real-time notifications */}
          <RealTimeNotifications />
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

interface EnhancedDashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function EnhancedDashboardLayout({ children, title }: EnhancedDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            title={title}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>

        {/* Toast notifications */}
        <ToastNotifications />
      </div>
    </ToastProvider>
  );
}

// ============================================================================
// DASHBOARD CARD COMPONENT
// ============================================================================

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  loading?: boolean;
}

export function DashboardCard({ 
  title, 
  subtitle, 
  children, 
  actions, 
  className = '',
  loading = false 
}: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Card header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STATUS INDICATOR COMPONENT
// ============================================================================

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StatusIndicator({ 
  status, 
  label, 
  size = 'md', 
  showLabel = true 
}: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2';
      case 'md':
        return 'h-3 w-3';
      case 'lg':
        return 'h-4 w-4';
    }
  };

  const getStatusText = () => {
    if (label) return label;
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`rounded-full ${getSizeClass()} ${getStatusColor()}`}></div>
      {showLabel && (
        <span className="text-sm text-gray-600">{getStatusText()}</span>
      )}
    </div>
  );
}

// ============================================================================
// METRIC DISPLAY COMPONENT
// ============================================================================

interface MetricDisplayProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function MetricDisplay({ 
  label, 
  value, 
  change, 
  icon, 
  color = 'blue' 
}: MetricDisplayProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              <span className={`text-sm ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs {change.period}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// QUICK ACTIONS COMPONENT
// ============================================================================

interface QuickAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const getButtonColor = (color: string = 'blue') => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`
            p-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${getButtonColor(action.color)}
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
