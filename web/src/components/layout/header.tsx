/**
 * Smart Tourist Safety System - Header Component
 * Main header with navigation, user profile dropdown, notifications, and theme switcher
 */

'use client';

import * as React from 'react';
import { Bell, Menu, Search, Settings, User, LogOut, Shield, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { SimpleThemeSwitcher } from './simple-theme-switcher';

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface HeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications] = React.useState([
    {
      id: '1',
      type: 'emergency',
      title: 'Emergency Alert',
      message: 'Tourist John Doe reported missing in Old City area',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'security',
      title: 'Security Incident',
      message: 'Suspicious activity detected near Main Square',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      message: 'Blockchain verification system updated successfully',
      time: '1 hour ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return '🚨';
      case 'security':
        return '🛡️';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-16 items-center px-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo and Title */}
        <div className="flex items-center space-x-3 mr-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Tourist Safety</h1>
            <p className="text-xs text-gray-500">Emergency Response System</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tourists, alerts, locations..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Theme Toggle */}
          <SimpleThemeSwitcher variant="compact" size="sm" className="!p-2" />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">{unreadCount} unread</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer',
                        !notification.read && 'bg-blue-50'
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user ? getInitials(user.displayName || 'User') : 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role.replace('_', ' ') || 'Role'}
                </p>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-1">
                    {user?.role.replace('_', ' ')} • {user?.department}
                  </p>
                </div>
                <div className="py-2">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="py-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Click outside handlers */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}