/**
 * Smart Tourist Safety System - Recent Activity Component
 * Shows latest system activities and updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Activity,
  Clock,
  Eye,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ActivityItem {
  id: string;
  type: 'tourist_entry' | 'alert_created' | 'zone_breach' | 'emergency_response' | 'incident_resolved' | 'verification_completed';
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockActivities: ActivityItem[] = [
  {
    id: 'activity-001',
    type: 'emergency_response',
    title: 'Emergency Response Activated',
    description: 'Tourist emergency alert triggered in Forest Trail Zone - Response team dispatched',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    severity: 'critical',
    location: 'Forest Trail Zone',
    userId: 'tourist-042',
    userName: 'Sarah Chen',
    metadata: { responseTeam: 'Alpha-7', estimatedArrival: '8 minutes' }
  },
  {
    id: 'activity-002',
    type: 'alert_created',
    title: 'High-Risk Zone Alert',
    description: 'Tourist entered restricted mountain trail without proper safety equipment',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    severity: 'high',
    location: 'Mountain Trail Zone',
    userId: 'tourist-038',
    userName: 'David Kumar',
    metadata: { riskLevel: 'high', equipment: 'missing' }
  },
  {
    id: 'activity-003',
    type: 'tourist_entry',
    title: 'Tourist Group Registration',
    description: 'Large tour group of 25 members successfully registered at City Center',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    severity: 'low',
    location: 'City Center',
    metadata: { groupSize: 25, tourOperator: 'Adventure Tours Ltd' }
  },
  {
    id: 'activity-004',
    type: 'verification_completed',
    title: 'Digital ID Verification',
    description: 'Tourist identity successfully verified using blockchain verification',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    severity: 'low',
    userId: 'tourist-039',
    userName: 'Maria Rodriguez',
    metadata: { verificationMethod: 'blockchain', transactionHash: '0x1a2b3c...' }
  },
  {
    id: 'activity-005',
    type: 'zone_breach',
    title: 'Zone Boundary Violation',
    description: 'Tourist exceeded allowed time limit in restricted archaeological site',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    severity: 'medium',
    location: 'Archaeological Zone',
    userId: 'tourist-041',
    userName: 'James Wilson',
    metadata: { timeExceeded: '45 minutes', maxAllowed: '2 hours' }
  },
  {
    id: 'activity-006',
    type: 'incident_resolved',
    title: 'Medical Incident Resolved',
    description: 'Tourist medical emergency successfully handled - Patient stable and transported',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'medium',
    location: 'Beach Resort Area',
    userId: 'tourist-037',
    userName: 'Emily Thompson',
    metadata: { incidentType: 'medical', outcome: 'resolved', hospitalTransport: true }
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'tourist_entry':
      return <Users className="w-4 h-4" />;
    case 'alert_created':
      return <AlertTriangle className="w-4 h-4" />;
    case 'zone_breach':
      return <MapPin className="w-4 h-4" />;
    case 'emergency_response':
      return <Shield className="w-4 h-4" />;
    case 'incident_resolved':
      return <CheckCircle className="w-4 h-4" />;
    case 'verification_completed':
      return <Bell className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: ActivityItem['severity']) => {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200';
    case 'critical':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200';
  }
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = mockActivities,
  maxItems = 6,
  showFilters = true,
  autoRefresh = true,
  refreshInterval = 30000,
  className = ''
}) => {
  const [displayedActivities, setDisplayedActivities] = useState<ActivityItem[]>(activities.slice(0, maxItems));
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate new activity by rotating existing ones
        const newActivity: ActivityItem = {
          ...mockActivities[Math.floor(Math.random() * mockActivities.length)],
          id: `activity-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        setDisplayedActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
        setLastUpdated(new Date());
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, maxItems]);

  useEffect(() => {
    let filtered = activities;

    // Filter by severity
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(activity => activity.severity === selectedSeverity);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedType);
    }

    setDisplayedActivities(filtered.slice(0, maxItems));
  }, [activities, selectedSeverity, selectedType, maxItems]);

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest system events and tourist activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Updated {formatTimeAgo(lastUpdated.toISOString())}
          </div>
          <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="tourist_entry">Tourist Entry</option>
            <option value="alert_created">Alerts</option>
            <option value="zone_breach">Zone Breaches</option>
            <option value="emergency_response">Emergency</option>
            <option value="incident_resolved">Incidents</option>
            <option value="verification_completed">Verification</option>
          </select>
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-3">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.4s ease-out forwards'
              }}
            >
              {/* Icon */}
              <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                      
                      {activity.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </div>
                      )}
                      
                      {activity.userName && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.userName}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}>
                      {activity.severity.toUpperCase()}
                    </div>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent activities found
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {displayedActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Showing {displayedActivities.length} of {activities.length} activities
            </span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Load More
            </button>
          </div>
        </div>
      )}

      {/* Inline styles for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RecentActivity;
