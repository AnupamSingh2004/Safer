/**
 * Smart Tourist Safety System - Dashboard Header
 * Top navigation header with search, notifications, and user menu
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Globe,
  Moon,
  Sun,
  Monitor,
  User,
  Settings,
  LogOut,
  Menu,
  AlertTriangle,
  MapPin,
  Users,
  Shield,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { formatRelativeTime } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface SearchResult {
  id: string;
  type: 'tourist' | 'alert' | 'zone' | 'user';
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface Notification {
  id: string;
  type: 'emergency' | 'alert' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  href?: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DashboardHeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  hasUnreadNotifications?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DashboardHeader({
  onMenuClick,
  onNotificationClick,
  hasUnreadNotifications = false,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);

  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Mock data for search results
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'tourist',
      title: 'John Smith',
      subtitle: 'Tourist ID: TST001 • Currently in Zone A',
      href: '/dashboard/tourists/TST001',
      icon: Users,
    },
    {
      id: '2',
      type: 'alert',
      title: 'Emergency Alert',
      subtitle: 'Active alert in Red Fort area',
      href: '/dashboard/alerts/ALT001',
      icon: AlertTriangle,
    },
    {
      id: '3',
      type: 'zone',
      title: 'India Gate Zone',
      subtitle: 'Safety zone with 45 active tourists',
      href: '/dashboard/zones/IGZ001',
      icon: MapPin,
    },
  ];

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'emergency',
      title: 'Emergency Alert',
      message: 'Tourist reported missing in Connaught Place',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      href: '/dashboard/alerts/emergency',
    },
    {
      id: '2',
      type: 'alert',
      title: 'Safety Warning',
      message: 'Heavy traffic reported in CP area',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false,
      href: '/dashboard/alerts',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      message: 'New features available in mobile app',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
    },
  ];

  // Effects
  useEffect(() => {
    setRecentNotifications(mockNotifications);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      // Filter mock results based on query
      const filtered = mockSearchResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'emergency':
        return AlertTriangle;
      case 'alert':
        return Bell;
      case 'system':
        return Settings;
      default:
        return Bell;
    }
  };

  // Get notification color
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'emergency':
        return 'text-red-500';
      case 'alert':
        return 'text-orange-500';
      case 'system':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search */}
            <div className="relative ml-4 w-96 max-w-xs sm:max-w-none" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tourists, alerts, zones..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              {/* Search results dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {searchResults.map((result) => {
                    const Icon = result.icon;
                    return (
                      <a
                        key={result.id}
                        href={result.href}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Quick stats */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>247 Active</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>3 Alerts</span>
              </div>
            </div>

            {/* Theme selector */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setTheme('light');
                        setShowThemeMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Sun className="h-4 w-4 mr-3" />
                      Light
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setShowThemeMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Moon className="h-4 w-4 mr-3" />
                      Dark
                    </button>
                    <button
                      onClick={() => {
                        setTheme('system');
                        setShowThemeMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Monitor className="h-4 w-4 mr-3" />
                      System
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Bell className="h-6 w-6" />
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800" />
              )}
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {user ? (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                    </span>
                  ) : (
                    <User className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    {user && (
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName || `${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    )}
                    <a
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </a>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
