/**
 * Smart Tourist Safety System - Modern Navigation Bar
 * Responsive navbar with authentication integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, 
  X, 
  Shield, 
  MapPin, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  LogOut, 
  User, 
  Bell,
  Search,
  ChevronDown,
  Home,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/auth-store';

// Navigation items for different user types
const navigationItems = {
  public: [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Globe },
    { name: 'Contact', href: '/contact', icon: Phone },
  ],
  authenticated: [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Tourists', href: '/tourists', icon: Users },
    { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
    { name: 'Zones', href: '/zones', icon: MapPin },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ],
  admin: [
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { user, isAuthenticated } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Get current user info
  const currentUser = session?.user || user;
  const isLoggedIn = status === 'authenticated' || isAuthenticated;
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'tourism_admin' || currentUser?.role === 'police_admin';

  // Helper functions for user data
  const getUserName = () => {
    if (session?.user?.name) return session.user.name;
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    if (user?.displayName) return user.displayName;
    return 'User';
  };

  const getUserEmail = () => {
    return session?.user?.email || user?.email || '';
  };

  const getUserImage = () => {
    return session?.user?.image || user?.avatar || null;
  };

  // Get navigation items based on user status
  const getNavItems = () => {
    if (!isLoggedIn) return navigationItems.public;
    
    let items = [...navigationItems.authenticated];
    if (isAdmin) {
      items = [...items, ...navigationItems.admin];
    }
    return items;
  };

  const handleSignOut = async () => {
    try {
      if (session) {
        await signOut({ callbackUrl: '/' });
      } else {
        router.push('/auth/logout');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/');
    }
  };

  const navItems = getNavItems();

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700' 
        : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                Smart Tourist Safety
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Government of India
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search (if authenticated) */}
            {isLoggedIn && (
              <button className="hidden lg:flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Search className="w-4 h-4 mr-2" />
                Search...
              </button>
            )}

            {/* Notifications (if authenticated) */}
            {isLoggedIn && (
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User Menu or Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {getUserImage() ? (
                    <img
                      src={getUserImage()!}
                      alt={getUserName()}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {currentUser?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getUserName()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getUserEmail()}
                      </p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile User Menu */}
            {isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-4 py-3 mb-2">
                  {getUserImage() ? (
                    <img
                      src={getUserImage()!}
                      alt={getUserName()}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {currentUser?.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
}
