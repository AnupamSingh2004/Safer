/**
 * Smart Tourist Safety System - Mobile Layout Component
 * Touch-friendly mobile navigation and responsive layout system
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Shield, 
  MapPin, 
  Bell, 
  User, 
  Menu, 
  X, 
  Home,
  Phone,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { useUnifiedTheme } from '@/lib/theme/unified-theme-provider';
import { DrawerTransition } from '@/components/animations/page-transition';

// ============================================================================
// MOBILE NAVIGATION TYPES
// ============================================================================

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  emergency?: boolean;
  disabled?: boolean;
}

interface MobileLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showStatusBar?: boolean;
  showHeader?: boolean;
  emergencyMode?: boolean;
  className?: string;
}

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/',
  },
  {
    id: 'safety',
    label: 'Safety',
    icon: Shield,
    href: '/safety',
    emergency: true,
  },
  {
    id: 'map',
    label: 'Map',
    icon: MapPin,
    href: '/map',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: Bell,
    href: '/alerts',
    badge: 3,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
];

const emergencyActions = [
  {
    id: 'emergency-call',
    label: 'Emergency Call',
    icon: Phone,
    action: 'call',
    color: 'bg-emergency-500',
  },
  {
    id: 'quick-sos',
    label: 'Quick SOS',
    icon: MessageCircle,
    action: 'sos',
    color: 'bg-warning-500',
  },
  {
    id: 'location-share',
    label: 'Share Location',
    icon: MapPin,
    action: 'location',
    color: 'bg-info-500',
  },
];

// ============================================================================
// MOBILE STATUS BAR
// ============================================================================

  function MobileStatusBar() {
    const [time, setTime] = useState(new Date());
    const { theme } = useUnifiedTheme();  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex justify-between items-center px-4 py-2 text-sm font-medium
        ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
        border-b border-gray-200/10
      `}
    >
      <div className="flex items-center space-x-1">
        <span>{time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Signal size={16} className="text-success-500" />
        <Wifi size={16} className="text-success-500" />
        <div className="flex items-center space-x-1">
          <Battery size={16} className="text-success-500" />
          <span className="text-xs">87%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MOBILE HEADER
// ============================================================================

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  actions?: React.ReactNode;
  emergencyMode?: boolean;
}

function MobileHeader({
  title,
  showBack = false,
  showMenu = true,
  onMenuToggle,
  actions,
  emergencyMode = false,
  }: MobileHeaderProps) {
    const router = useRouter();
    const { theme } = useUnifiedTheme();  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center justify-between px-4 py-3
        ${emergencyMode 
          ? 'bg-emergency-500 text-white' 
          : theme === 'dark' 
            ? 'bg-gray-900 text-white border-b border-gray-800' 
            : 'bg-white text-gray-900 border-b border-gray-200'
        }
        relative z-10
      `}
    >
      <div className="flex items-center space-x-3">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-black/10 touch-manipulation"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}
        
        {showMenu && !showBack && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-black/10 touch-manipulation"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </motion.button>
        )}
        
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>
      
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </motion.header>
  );
}

// ============================================================================
// BOTTOM NAVIGATION
// ============================================================================

interface BottomNavigationProps {
  items?: NavigationItem[];
  activeItem?: string;
  onItemSelect?: (item: NavigationItem) => void;
  emergencyMode?: boolean;
}

function BottomNavigation({
  items = navigationItems,
  activeItem,
  onItemSelect,
  emergencyMode = false,
}: BottomNavigationProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme } = useUnifiedTheme();  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;
    
    onItemSelect?.(item);
    router.push(item.href);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        ${theme === 'dark' 
          ? 'bg-gray-900 border-t border-gray-800' 
          : 'bg-white border-t border-gray-200'
        }
        safe-area-inset-bottom
      `}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem ? activeItem === item.id : pathname === item.href;
          const isEmergency = item.emergency && emergencyMode;
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                relative flex flex-col items-center justify-center
                p-2 rounded-lg min-w-[60px] touch-manipulation
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${isActive 
                  ? isEmergency
                    ? 'text-emergency-500'
                    : 'text-primary-500'
                  : theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-600 hover:text-gray-900'
                }
                transition-colors duration-200
              `}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  className={`
                    ${isEmergency ? 'stroke-2' : ''}
                    ${isActive ? 'stroke-2' : 'stroke-1.5'}
                  `}
                />
                
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-emergency-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </div>
              
              <span className="text-xs mt-1 font-medium">
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`
                    absolute -top-1 left-1/2 transform -translate-x-1/2
                    w-1 h-1 rounded-full
                    ${isEmergency ? 'bg-emergency-500' : 'bg-primary-500'}
                  `}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

// ============================================================================
// SIDE DRAWER MENU
// ============================================================================

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyMode?: boolean;
}

  function SideDrawer({ isOpen, onClose, emergencyMode = false }: SideDrawerProps) {
    const { theme, toggleEmergencyMode } = useUnifiedTheme();
    const router = useRouter();  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Safety Center', href: '/safety', icon: Shield },
    { label: 'Emergency Contacts', href: '/contacts', icon: Phone },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleItemClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <DrawerTransition
      isOpen={isOpen}
      onClose={onClose}
      direction="left"
      className={`
        fixed left-0 top-0 bottom-0 w-80 max-w-[85vw]
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
        shadow-xl z-modal
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 touch-manipulation"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Emergency Actions */}
        {emergencyMode && (
          <div className="p-4 border-b border-emergency-200/20 bg-emergency-50/10">
            <h3 className="text-sm font-medium text-emergency-600 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {emergencyActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg
                      ${action.color} text-white touch-manipulation
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.href}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item.href)}
                  className={`
                    flex items-center space-x-3 w-full p-3 rounded-lg
                    text-left touch-manipulation
                    ${theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className={`
          p-4 border-t
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={toggleEmergencyMode}
            className={`
              w-full p-3 rounded-lg font-medium touch-manipulation
              ${emergencyMode 
                ? 'bg-emergency-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {emergencyMode ? 'Exit Emergency Mode' : 'Emergency Mode'}
          </motion.button>
        </div>
      </div>
    </DrawerTransition>
  );
}

// ============================================================================
// MAIN MOBILE LAYOUT
// ============================================================================

export function MobileLayout({
  children,
  showNavigation = true,
  showStatusBar = true,
  showHeader = true,
  emergencyMode = false,
  className = '',
}: MobileLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, emergencyMode: globalEmergencyMode, toggleEmergencyMode } = useUnifiedTheme();  const isEmergencyActive = emergencyMode || globalEmergencyMode;

  // Get page title from pathname
  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/': 'Tourist Safety',
      '/safety': 'Safety Center',
      '/map': 'Safety Map',
      '/alerts': 'Alerts',
      '/profile': 'Profile',
      '/dashboard': 'Dashboard',
      '/settings': 'Settings',
      '/contacts': 'Emergency Contacts',
    };
    return titles[path] || 'Tourist Safety';
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className={`
      min-h-screen flex flex-col relative
      ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}
      ${className}
    `}>
      {/* Status Bar */}
      {showStatusBar && <MobileStatusBar />}
      
      {/* Header */}
      {showHeader && (
        <MobileHeader
          title={getPageTitle(pathname)}
          showMenu={true}
          onMenuToggle={() => setIsMenuOpen(true)}
          emergencyMode={isEmergencyActive}
          actions={
            isEmergencyActive && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-emergency-500 rounded-full"
              />
            )
          }
        />
      )}

      {/* Main Content */}
      <main className={`
        flex-1 relative
        ${showNavigation ? 'pb-20' : ''}
        ${showHeader ? '' : 'pt-0'}
      `}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && (
        <BottomNavigation emergencyMode={isEmergencyActive} />
      )}

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        emergencyMode={isEmergencyActive}
      />
    </div>
  );
}

// ============================================================================
// MOBILE CONTAINER
// ============================================================================

interface MobileContainerProps {
  children: React.ReactNode;
  padding?: boolean;
  maxWidth?: boolean;
  className?: string;
}

export function MobileContainer({
  children,
  padding = true,
  maxWidth = true,
  className = '',
}: MobileContainerProps) {
  return (
    <div className={`
      ${maxWidth ? 'max-w-md mx-auto' : ''}
      ${padding ? 'px-4 py-6' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// ============================================================================
// SWIPE GESTURE HOOK
// ============================================================================

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: SwipeHandlers) {
  const handlePanEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = 500;

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
      if (info.offset.x > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    if (Math.abs(info.offset.y) > threshold || Math.abs(info.velocity.y) > velocity) {
      if (info.offset.y > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
  };

  return { onPanEnd: handlePanEnd };
}

export default MobileLayout;