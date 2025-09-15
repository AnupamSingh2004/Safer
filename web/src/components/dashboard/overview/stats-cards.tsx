/**
 * Smart Tourist Safety System - Stats Cards Component
 * Enhanced animated statistics cards with smooth hover effects and micro-interactions
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Settings
} from 'lucide-react';
import { MotionBox, StaggerContainer } from '@/components/animations/advanced-animations';
import { AnimatedProgress, ScrollReveal } from '@/components/animations/micro-interactions';
import { useAuthStore } from '@/stores/auth-store';

// ============================================================================
// INTERFACES
// ============================================================================

interface DashboardStats {
  totalTourists: number;
  activeTourists: number;
  totalAlerts: number;
  activeAlerts: number;
  criticalAlerts: number;
  safetyScoreAverage: number;
  riskZones: number;
  emergencyIncidents: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  delay?: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getColorClasses = (color: StatCardProps['color']) => {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-600 dark:text-blue-400'
      };
    case 'green':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-600 dark:text-green-400'
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        icon: 'text-yellow-600 dark:text-yellow-400',
        text: 'text-yellow-600 dark:text-yellow-400'
      };
    case 'red':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-600 dark:text-red-400'
      };
    case 'purple':
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        text: 'text-purple-600 dark:text-purple-400'
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        icon: 'text-gray-600 dark:text-gray-400',
        text: 'text-gray-600 dark:text-gray-400'
      };
  }
};

// ============================================================================
// ENHANCED STAT CARD COMPONENT WITH ANIMATIONS
// ============================================================================

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  delay = 0 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const colors = getColorClasses(color);
  const [isHovered, setIsHovered] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;

  // Animated counter effect
  React.useEffect(() => {
    if (shouldReduceMotion) {
      setCount(numericValue);
      return;
    }

    const timer = setTimeout(() => {
      const increment = numericValue / 50;
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= numericValue) {
            clearInterval(interval);
            return numericValue;
          }
          return Math.min(prev + increment, numericValue);
        });
      }, 20);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [numericValue, delay, shouldReduceMotion]);

  return (
    <motion.div
      className={`
        bg-white dark:bg-gray-800 
        p-6 rounded-xl shadow-sm 
        border border-gray-200 dark:border-gray-700
        cursor-pointer relative overflow-hidden
        group
      `}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: delay / 1000 }
      }}
      whileHover={shouldReduceMotion ? {} : {
        scale: 1.03,
        y: -4,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex items-center justify-between relative">
        <div className="flex-1">
          <motion.p 
            className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (delay / 1000) + 0.1 }}
          >
            {title}
          </motion.p>
          
          <motion.p 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (delay / 1000) + 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          >
            {typeof value === 'number' 
              ? Math.round(count).toLocaleString() 
              : value.toString().includes('%') 
                ? `${Math.round(count)}%` 
                : value
            }
          </motion.p>
          
          {change && (
            <motion.div 
              className="flex items-center mt-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (delay / 1000) + 0.3 }}
            >
              <motion.div
                animate={{ rotate: isHovered ? 10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {change.type === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                )}
              </motion.div>
              <span className={`text-sm font-semibold ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                vs last period
              </span>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className={`p-4 rounded-2xl ${colors.bg} relative`}
          whileHover={shouldReduceMotion ? {} : { 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div 
            className={colors.icon}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 10 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          
          {/* Pulse effect for high priority items */}
          {color === 'red' && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-red-500/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Progress bar for visual feedback */}
      {typeof value === 'number' && value > 0 && (
        <motion.div
          className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: (delay / 1000) + 0.4, duration: 0.5 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${colors.text.includes('blue') ? 'from-blue-500 to-blue-600' :
              colors.text.includes('green') ? 'from-green-500 to-green-600' :
              colors.text.includes('red') ? 'from-red-500 to-red-600' :
              colors.text.includes('yellow') ? 'from-yellow-500 to-yellow-600' :
              'from-purple-500 to-purple-600'
            } rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((count / (numericValue || 1)) * 100, 100)}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// ============================================================================
// ENHANCED MAIN COMPONENT WITH STAGGER ANIMATIONS
// ============================================================================

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuthStore();
  const isAdmin = user && ['admin', 'super_admin'].includes(user.role);
  
  // Calculate dynamic colors
  const alertColor: 'red' | 'yellow' = stats.activeAlerts > 10 ? 'red' : 'yellow';
  const safetyColor: 'green' | 'yellow' | 'red' = stats.safetyScoreAverage >= 80 ? 'green' : stats.safetyScoreAverage >= 60 ? 'yellow' : 'red';

  const statsCards = [
    {
      title: 'Total Tourists',
      value: stats.totalTourists,
      change: { value: 12.5, type: 'increase' as const },
      icon: <Users className="w-6 h-6" />,
      color: 'blue' as const,
      delay: 0
    },
    {
      title: 'Active Tourists',
      value: stats.activeTourists,
      change: { value: 5.2, type: 'increase' as const },
      icon: <Activity className="w-6 h-6" />,
      color: 'green' as const,
      delay: 100
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts,
      change: { value: 2.1, type: 'decrease' as const },
      icon: <AlertTriangle className="w-6 h-6" />,
      color: alertColor,
      delay: 200
    },
    {
      title: 'Safety Score',
      value: `${stats.safetyScoreAverage.toFixed(1)}%`,
      change: { value: 3.7, type: 'increase' as const },
      icon: <Shield className="w-6 h-6" />,
      color: safetyColor,
      delay: 300
    }
  ];

  const additionalStats = [
    {
      title: 'Critical Alerts',
      value: stats.criticalAlerts,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      title: 'Risk Zones',
      value: stats.riskZones,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'Emergency Incidents',
      value: stats.emergencyIncidents,
      icon: <Shield className="w-5 h-5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  return (
    <ScrollReveal className="space-y-8">
      {/* Main Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <MotionBox
            key={`${card.title}-${index}`}
            variant="fadeInUp"
            delay={index * 0.1}
          >
            <StatCard
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              color={card.color}
              delay={card.delay}
            />
          </MotionBox>
        ))}
      </StaggerContainer>

      {/* Admin Quick Actions - Only visible to admins */}
      {isAdmin && (
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Administration
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick access to admin functions
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              Admin Only
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Create New User Button */}
            <Link href="/dashboard/administration/users/create">
              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer group transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                    <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Create User
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add new system user
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* User Management Button */}
            <Link href="/dashboard/administration/users">
              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer group transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Manage Users
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      View and edit users
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* System Settings Button */}
            <Link href="/dashboard/administration/system">
              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer group transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-colors">
                    <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      System Config
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure system
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Additional Stats Row */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {additionalStats.map((stat, index) => (
          <MotionBox
            key={stat.title}
            variant="scaleIn"
            delay={0.5 + (index * 0.1)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              whileHover={shouldReduceMotion ? {} : {
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <motion.p 
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                  >
                    {stat.title}
                  </motion.p>
                  <motion.p 
                    className={`text-2xl font-bold ${stat.color}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + (index * 0.1), type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                
                <motion.div 
                  className={`p-3 rounded-2xl ${stat.bg}`}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                  whileHover={shouldReduceMotion ? {} : { 
                    scale: 1.1, 
                    rotate: 10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </motion.div>
              </div>

              {/* Progress indicator for critical items */}
              {stat.title === 'Critical Alerts' && stat.value > 0 && (
                <motion.div
                  className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1 + (index * 0.1), duration: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stat.value / 20) * 100, 100)}%` }}
                    transition={{ delay: 1.2 + (index * 0.1), duration: 1, ease: 'easeOut' }}
                  />
                </motion.div>
              )}
            </motion.div>
          </MotionBox>
        ))}
      </StaggerContainer>

      {/* Real-time status indicator */}
      <motion.div
        className="flex items-center justify-center space-x-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Real-time data • Last updated: {new Date().toLocaleTimeString()}
        </span>
      </motion.div>
    </ScrollReveal>
  );
};

export default StatsCards;
