/**
 * Smart Tourist Safety System - Stats Cards Component
 * Animated statistics cards for the dashboard overview
 */

'use client';

import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

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
// STAT CARD COMPONENT
// ============================================================================

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  delay = 0 
}) => {
  const colors = getColorClasses(color);

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        p-6 rounded-lg shadow-sm 
        border border-gray-200 dark:border-gray-700
        hover:shadow-md hover:scale-105 transition-all duration-200
      `}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {change && (
            <div className="flex items-center mt-2">
              {change.type === 'increase' ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                vs last period
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colors.bg}`}>
          <div className={colors.icon}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
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

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatCard
            key={`${card.title}-${index}`}
            title={card.title}
            value={card.value}
            change={card.change}
            icon={card.icon}
            color={card.color}
            delay={card.delay}
          />
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Critical Alerts
              </p>
              <p className="text-xl font-bold text-red-600">
                {stats.criticalAlerts}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Risk Zones
              </p>
              <p className="text-xl font-bold text-orange-600">
                {stats.riskZones}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Emergency Incidents
              </p>
              <p className="text-xl font-bold text-purple-600">
                {stats.emergencyIncidents}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
