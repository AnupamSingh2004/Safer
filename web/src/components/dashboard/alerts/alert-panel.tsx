/**
 * Smart Tourist Safety System - Alert Panel Component
 * Priority-based alert display with sorting and status management
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SwipeableCard } from '@/components/animations/gesture-components';
import { StaggerContainer } from '@/components/animations/advanced-animations';
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Bell,
  XCircle,
  Grid,
  List,
  X,
  Check,
  Archive
} from 'lucide-react';

import type { Alert, AlertType, AlertSeverity, AlertStatus } from '@/types/alert';

// ============================================================================
// INTERFACES
// ============================================================================

interface AlertPanelProps {
  alerts: Alert[];
  filters: {
    types: AlertType[];
    severities: AlertSeverity[];
    statuses: AlertStatus[];
    search: string;
    dateRange: {
      start: string;
      end: string;
    } | null;
  };
  isLoading: boolean;
  onAlertSelect: (alertId: string) => void;
  onQuickAction: (action: string, alertId: string) => void;
  onFiltersChange: (filters: any) => void;
}

interface SortConfig {
  key: 'createdAt' | 'severity' | 'status' | 'type' | 'title';
  direction: 'asc' | 'desc';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  info: 'bg-gray-100 text-gray-800 border-gray-200'
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  acknowledged: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-gray-100 text-gray-800 border-gray-200',
  expired: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const TYPE_ICONS = {
  emergency: AlertTriangle,
  safety: AlertTriangle,
  health: Users,
  weather: RefreshCw,
  traffic: MapPin,
  security: Eye,
  location: MapPin,
  system: Zap,
  maintenance: MoreHorizontal,
  information: Bell
};

const SEVERITY_ORDER = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

const getAlertIcon = (type: AlertType) => {
  return TYPE_ICONS[type] || Bell;
};

const getSeverityPriority = (severity: AlertSeverity) => {
  return SEVERITY_ORDER[severity] || 0;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  filters,
  isLoading,
  onAlertSelect,
  onQuickAction,
  onFiltersChange
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  // ========================================================================
  // MOBILE RESPONSIVENESS
  // ========================================================================

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Auto switch to card view on mobile
  React.useEffect(() => {
    if (isMobile) {
      setViewMode('cards');
    } else {
      setViewMode('list');
    }
  }, [isMobile]);

  // ========================================================================
  // FILTERING & SORTING
  // ========================================================================

  const filteredAndSortedAlerts = useMemo(() => {
    let result = [...alerts];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(alert => 
        alert.title.toLowerCase().includes(searchLower) ||
        alert.message.toLowerCase().includes(searchLower) ||
        alert.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        alert.type.toLowerCase().includes(searchLower)
      );
    }

    if (filters.types.length > 0) {
      result = result.filter(alert => filters.types.includes(alert.type));
    }

    if (filters.severities.length > 0) {
      result = result.filter(alert => filters.severities.includes(alert.severity));
    }

    if (filters.statuses.length > 0) {
      result = result.filter(alert => filters.statuses.includes(alert.status));
    }

    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      result = result.filter(alert => {
        const alertDate = new Date(alert.createdAt);
        return alertDate >= start && alertDate <= end;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.key) {
        case 'severity':
          comparison = getSeverityPriority(b.severity) - getSeverityPriority(a.severity);
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [alerts, filters, sortConfig]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedAlerts.size === filteredAndSortedAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAndSortedAlerts.map(a => a.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    selectedAlerts.forEach(alertId => {
      onQuickAction(action, alertId);
    });
    setSelectedAlerts(new Set());
  };

  const handleExpandToggle = (alertId: string) => {
    setExpandedAlert(prev => prev === alertId ? null : alertId);
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  const AlertCard: React.FC<{ alert: Alert; index: number }> = ({ alert, index }) => {
    const IconComponent = getAlertIcon(alert.type);
    const isExpanded = expandedAlert === alert.id;
    const isSelected = selectedAlerts.has(alert.id);

    return (
      <SwipeableCard
        key={alert.id}
        onSwipeLeft={() => onQuickAction('dismiss', alert.id)}
        onSwipeRight={() => onQuickAction('acknowledge', alert.id)}
        className="mb-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Card Header */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectAlert(alert.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                
                <div className={`p-2 rounded-lg ${SEVERITY_COLORS[alert.severity]} border`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {alert.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[alert.status]} border`}>
                      {alert.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} • {formatRelativeTime(alert.createdAt)}
                  </p>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {alert.message}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleExpandToggle(alert.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Alert Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {alert.location?.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-24">{alert.location.address}</span>
                </div>
              )}
              
              {alert.target.estimatedReach && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{alert.target.estimatedReach} affected</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(alert.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 space-y-3">
                  {/* Full Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {alert.message}
                    </p>
                  </div>

                  {/* Actions */}
                  {alert.actions && alert.actions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recommended Actions
                      </h4>
                      <div className="space-y-1">
                        {alert.actions.map((action, actionIndex) => (
                          <p key={actionIndex} className="text-sm text-gray-600 dark:text-gray-400">
                            • {action.label}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {alert.affectedZones && alert.affectedZones.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Affected Zones
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedZones.map((zone, zoneIndex) => (
                          <span 
                            key={zoneIndex}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Actions */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              {alert.status === 'active' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onQuickAction('acknowledge', alert.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Acknowledge
                </motion.button>
              )}
              
              {alert.status !== 'resolved' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onQuickAction('resolve', alert.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md transition-colors"
                >
                  <CheckCircle className="w-3 h-3" />
                  Resolve
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAlertSelect(alert.id)}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onQuickAction('dismiss', alert.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </SwipeableCard>
    );
  };

  const renderTableHeader = () => (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="w-12 px-6 py-3">
          <input
            type="checkbox"
            checked={selectedAlerts.size === filteredAndSortedAlerts.length && filteredAndSortedAlerts.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={() => handleSort('severity')}
        >
          <div className="flex items-center gap-1">
            Priority
            {sortConfig.key === 'severity' && (
              sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={() => handleSort('type')}
        >
          <div className="flex items-center gap-1">
            Type
            {sortConfig.key === 'type' && (
              sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={() => handleSort('title')}
        >
          <div className="flex items-center gap-1">
            Alert
            {sortConfig.key === 'title' && (
              sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={() => handleSort('status')}
        >
          <div className="flex items-center gap-1">
            Status
            {sortConfig.key === 'status' && (
              sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={() => handleSort('createdAt')}
        >
          <div className="flex items-center gap-1">
            Created
            {sortConfig.key === 'createdAt' && (
              sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );

  const renderAlertRow = (alert: Alert) => {
    const AlertIcon = getAlertIcon(alert.type);
    const isSelected = selectedAlerts.has(alert.id);
    const isExpanded = expandedAlert === alert.id;

    return (
      <React.Fragment key={alert.id}>
        <tr 
          className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
            isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectAlert(alert.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[alert.severity]}`}>
              {alert.severity.toUpperCase()}
            </span>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <AlertIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                {alert.type.replace('_', ' ')}
              </span>
            </div>
          </td>
          
          <td className="px-6 py-4">
            <div className="max-w-xs">
              <button
                onClick={() => onAlertSelect(alert.id)}
                className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-left"
              >
                {alert.title}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {alert.shortMessage || alert.message}
              </p>
              {alert.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {alert.location.landmark || alert.location.address}
                  </span>
                </div>
              )}
            </div>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[alert.status]}`}>
              {alert.status.replace('_', ' ').toUpperCase()}
            </span>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatRelativeTime(alert.createdAt)}
            </div>
            {alert.acknowledgedBy && (
              <div className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                <span className="text-xs">Ack by {alert.acknowledgedBy}</span>
              </div>
            )}
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleExpandToggle(alert.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Toggle details"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => onAlertSelect(alert.id)}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              {alert.status === 'active' && (
                <button
                  onClick={() => onQuickAction('acknowledge', alert.id)}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  title="Acknowledge"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              
              {alert.status === 'acknowledged' && (
                <button
                  onClick={() => onQuickAction('resolve', alert.id)}
                  className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                  title="Resolve"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => onQuickAction('escalate', alert.id)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Escalate"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        
        {/* Expanded Details Row */}
        {isExpanded && (
          <tr className="bg-gray-50 dark:bg-gray-800">
            <td colSpan={7} className="px-6 py-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Full Message
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {alert.message}
                  </p>
                </div>
                
                {alert.deliveryStats && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Delivery Statistics
                    </h4>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{alert.deliveryStats.sent}</div>
                        <div className="text-xs text-gray-500">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{alert.deliveryStats.delivered}</div>
                        <div className="text-xs text-gray-500">Delivered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{alert.deliveryStats.read}</div>
                        <div className="text-xs text-gray-500">Read</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{alert.deliveryStats.acknowledged}</div>
                        <div className="text-xs text-gray-500">Acknowledged</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{alert.deliveryStats.failed}</div>
                        <div className="text-xs text-gray-500">Failed</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {alert.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {alert.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const renderBulkActions = () => (
    selectedAlerts.size > 0 && (
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {selectedAlerts.size} alert{selectedAlerts.size !== 1 ? 's' : ''} selected
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBulkAction('acknowledge')}
            className="px-3 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200"
          >
            Acknowledge All
          </button>
          
          <button
            onClick={() => handleBulkAction('resolve')}
            className="px-3 py-1 text-xs text-purple-700 bg-purple-100 rounded hover:bg-purple-200"
          >
            Resolve All
          </button>
          
          <button
            onClick={() => handleBulkAction('escalate')}
            className="px-3 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200"
          >
            Escalate All
          </button>
          
          <button
            onClick={() => setSelectedAlerts(new Set())}
            className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Clear Selection
          </button>
        </div>
      </div>
    )
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No alerts found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filters.search || filters.types.length > 0 || filters.severities.length > 0 || filters.statuses.length > 0
          ? 'Try adjusting your filters to see more alerts.'
          : 'All clear! No active alerts at this time.'}
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center py-12">
      <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Loading alerts...
      </p>
    </div>
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  if (isLoading && filteredAndSortedAlerts.length === 0) {
    return renderLoadingState();
  }

  if (filteredAndSortedAlerts.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="w-full space-y-4">
      {/* Mobile-Responsive Header & Controls */}
      <div className="space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.statuses[0] || 'all'}
                onChange={(e) => {
                  const status = e.target.value;
                  onFiltersChange({
                    ...filters,
                    statuses: status === 'all' ? [] : [status as AlertStatus]
                  });
                }}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
                <option value="expired">Expired</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* View Toggle (Desktop only) */}
            {!isMobile && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Card View"
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: 180 }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedAlerts.length} of {alerts.length} alerts
            {selectedAlerts.size > 0 && (
              <span className="ml-2">• {selectedAlerts.size} selected</span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {alerts.filter(a => a.severity === 'critical').length} Critical
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {alerts.filter(a => a.severity === 'high').length} High
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {alerts.filter(a => a.status === 'active').length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Bulk Actions for Mobile */}
        {selectedAlerts.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-sm text-blue-800 dark:text-blue-400 font-medium">
              {selectedAlerts.size} alert{selectedAlerts.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('acknowledge')}
                className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Acknowledge
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('resolve')}
                className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Resolve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAlerts(new Set())}
                className="px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Clear
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Conditional Rendering: Cards vs Table */}
      {viewMode === 'cards' || isMobile ? (
        // Mobile Card View
        <StaggerContainer className="space-y-4">
          {filteredAndSortedAlerts.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))}
        </StaggerContainer>
      ) : (
        // Desktop Table View
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <div className="overflow-x-auto">
            {renderBulkActions()}
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {renderTableHeader()}
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedAlerts.map(renderAlertRow)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
