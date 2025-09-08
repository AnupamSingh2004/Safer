/**
 * Smart Tourist Safety System - Alert Management List
 * Comprehensive alert management interface with filtering, sorting, and actions
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  Bell,
  Shield,
  Heart,
  Cloud,
  Car,
  MoreHorizontal,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES
// ============================================================================

interface AlertData {
  id: string;
  type: 'emergency' | 'safety' | 'weather' | 'security' | 'medical' | 'transport' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'active' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  touristId?: string;
  touristName?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  resolvedAt?: string;
  resolvedBy?: string;
  metadata?: Record<string, any>;
}

interface AlertFilters {
  search: string;
  type: string;
  priority: string;
  status: string;
  dateRange: string;
  createdBy: string;
}

type SortKey = 'createdAt' | 'updatedAt' | 'priority' | 'type' | 'status' | 'title';
type SortOrder = 'asc' | 'desc';

interface AlertListProps {
  alerts?: AlertData[];
  onCreateAlert?: () => void;
  onViewAlert?: (alertId: string) => void;
  onEditAlert?: (alertId: string) => void;
  onDeleteAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
  onDismissAlert?: (alertId: string) => void;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const ALERT_TYPES = [
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'safety', label: 'Safety Warning', icon: Shield, color: 'text-yellow-600' },
  { value: 'weather', label: 'Weather Alert', icon: Cloud, color: 'text-blue-600' },
  { value: 'security', label: 'Security Alert', icon: Shield, color: 'text-orange-600' },
  { value: 'medical', label: 'Medical Emergency', icon: Heart, color: 'text-red-600' },
  { value: 'transport', label: 'Transport Disruption', icon: Car, color: 'text-gray-600' },
  { value: 'general', label: 'General Alert', icon: Bell, color: 'text-blue-600' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
  { value: 'active', label: 'Active', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'dismissed', label: 'Dismissed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
];

const MOCK_ALERTS: AlertData[] = [
  {
    id: 'A001',
    type: 'medical',
    priority: 'critical',
    status: 'active',
    title: 'Medical Emergency - Tourist Collapse',
    description: 'Tourist collapsed at India Gate. Emergency services notified.',
    touristId: 'T001',
    touristName: 'Raj Kumar',
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'India Gate, New Delhi',
    },
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    createdBy: 'officer001',
  },
  {
    id: 'A002',
    type: 'weather',
    priority: 'high',
    status: 'active',
    title: 'Severe Weather Warning',
    description: 'Heavy rainfall and thunderstorm expected in the area.',
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Delhi NCR Region',
    },
    createdAt: '2024-01-16T12:00:00Z',
    updatedAt: '2024-01-16T12:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'A003',
    type: 'security',
    priority: 'medium',
    status: 'resolved',
    title: 'Suspicious Activity Report',
    description: 'Suspicious activity reported near tourist area. Investigated and resolved.',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Connaught Place, New Delhi',
    },
    createdAt: '2024-01-16T10:15:00Z',
    updatedAt: '2024-01-16T13:45:00Z',
    createdBy: 'officer002',
    resolvedAt: '2024-01-16T13:45:00Z',
    resolvedBy: 'officer002',
  },
  {
    id: 'A004',
    type: 'transport',
    priority: 'low',
    status: 'pending',
    title: 'Metro Service Disruption',
    description: 'Minor delays on Blue Line metro service.',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Central Delhi',
    },
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    createdBy: 'system',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AlertList({
  alerts = MOCK_ALERTS,
  onCreateAlert,
  onViewAlert,
  onEditAlert,
  onDeleteAlert,
  onResolveAlert,
  onDismissAlert,
}: AlertListProps) {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  
  const [filters, setFilters] = useState<AlertFilters>({
    search: '',
    type: '',
    priority: '',
    status: '',
    dateRange: '',
    createdBy: '',
  });
  
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort alerts
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts.filter((alert) => {
      const matchesSearch = !filters.search || 
        alert.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        alert.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        alert.touristName?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = !filters.type || alert.type === filters.type;
      const matchesPriority = !filters.priority || alert.priority === filters.priority;
      const matchesStatus = !filters.status || alert.status === filters.status;
      const matchesCreatedBy = !filters.createdBy || alert.createdBy === filters.createdBy;

      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesCreatedBy;
    });

    // Sort alerts
    filtered.sort((a, b) => {
      let aValue: any = a[sortKey];
      let bValue: any = b[sortKey];

      if (sortKey === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [alerts, filters, sortKey, sortOrder]);

  // Handle sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for alerts:`, selectedAlerts);
    setSelectedAlerts([]);
  };

  // Handle alert actions
  const handleCreateAlert = () => {
    if (onCreateAlert) {
      onCreateAlert();
    } else {
      router.push('/dashboard/alerts/create');
    }
  };

  const handleViewAlert = (alertId: string) => {
    if (onViewAlert) {
      onViewAlert(alertId);
    } else {
      router.push(`/dashboard/alerts/${alertId}`);
    }
  };

  // Get type icon and color
  const getTypeInfo = (type: string) => {
    const typeInfo = ALERT_TYPES.find(t => t.value === type);
    return typeInfo || ALERT_TYPES[0];
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const priorityInfo = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityInfo?.color || PRIORITY_LEVELS[0].color;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusInfo = STATUS_OPTIONS.find(s => s.value === status);
    return statusInfo?.color || STATUS_OPTIONS[0].color;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Emergency Alerts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor emergency alerts ({filteredAndSortedAlerts.length} alerts)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
              showFilters
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {hasPermission('create_alert') && (
            <button
              onClick={handleCreateAlert}
              className="flex items-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search alerts..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Types</option>
                {ALERT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Priorities</option>
                {PRIORITY_LEVELS.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={() => setFilters({
                  search: '',
                  type: '',
                  priority: '',
                  status: '',
                  dateRange: '',
                  createdBy: '',
                })}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-300">
              {selectedAlerts.length} alert(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('resolve')}
                className="px-3 py-1 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-md"
              >
                Resolve
              </button>
              <button
                onClick={() => handleBulkAction('dismiss')}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm text-red-700 bg-red-100 hover:bg-red-200 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.length === filteredAndSortedAlerts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlerts(filteredAndSortedAlerts.map(alert => alert.id));
                      } else {
                        setSelectedAlerts([]);
                      }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    {sortKey === 'type' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center">
                    Priority
                    {sortKey === 'priority' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Alert Details
                    {sortKey === 'title' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tourist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortKey === 'status' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    {sortKey === 'createdAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedAlerts.map((alert) => {
                const typeInfo = getTypeInfo(alert.type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <tr 
                    key={alert.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleViewAlert(alert.id)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAlerts([...selectedAlerts, alert.id]);
                          } else {
                            setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TypeIcon className={cn('h-5 w-5 mr-2', typeInfo.color)} />
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {alert.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(alert.priority))}>
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {alert.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {alert.touristId ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-1" />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {alert.touristName || alert.touristId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {alert.touristId}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {alert.location ? (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(alert.status))}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(alert.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewAlert(alert.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View Alert"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {hasPermission('edit_alert') && (
                          <button
                            onClick={() => onEditAlert?.(alert.id)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Edit Alert"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        
                        {alert.status === 'active' && hasPermission('resolve_alert') && (
                          <button
                            onClick={() => onResolveAlert?.(alert.id)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Resolve Alert"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {hasPermission('delete_alert') && (
                          <button
                            onClick={() => onDeleteAlert?.(alert.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete Alert"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No alerts found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filters.search || filters.type || filters.priority || filters.status 
                ? 'Try adjusting your filters to see more results.'
                : 'No emergency alerts have been created yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertList;
