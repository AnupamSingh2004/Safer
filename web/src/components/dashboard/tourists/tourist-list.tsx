/**
 * Smart Tourist Safety System - Tourist List Component
 * Displays a comprehensive list of tourists with filtering and management options
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, usePermissions } from '@/hooks/use-auth';

// ============================================================================
// TYPES
// ============================================================================

interface Tourist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  visitorType: 'domestic' | 'international';
  checkInDate: string;
  checkOutDate: string;
  status: 'active' | 'checked_out' | 'emergency' | 'missing';
  currentLocation?: {
    zone: string;
    coordinates: [number, number];
    lastUpdated: string;
  };
  digitalId?: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
}

interface TouristFilters {
  search: string;
  status: string;
  visitorType: string;
  riskLevel: string;
  dateRange: {
    start: string;
    end: string;
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTourists: Tourist[] = [
  {
    id: 'TST001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    nationality: 'USA',
    visitorType: 'international',
    checkInDate: '2025-09-01',
    checkOutDate: '2025-09-15',
    status: 'active',
    currentLocation: {
      zone: 'India Gate',
      coordinates: [28.6129, 77.2295],
      lastUpdated: '2025-09-08T10:30:00Z',
    },
    digitalId: 'DID_001',
    emergencyContacts: [
      { name: 'Jane Smith', phone: '+1-555-0124', relationship: 'Spouse' },
    ],
    riskLevel: 'low',
    lastActivity: '2025-09-08T10:30:00Z',
  },
  {
    id: 'TST002',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543210',
    nationality: 'India',
    visitorType: 'domestic',
    checkInDate: '2025-09-05',
    checkOutDate: '2025-09-10',
    status: 'active',
    currentLocation: {
      zone: 'Red Fort',
      coordinates: [28.6562, 77.2410],
      lastUpdated: '2025-09-08T09:15:00Z',
    },
    digitalId: 'DID_002',
    emergencyContacts: [
      { name: 'Raj Sharma', phone: '+91-9876543211', relationship: 'Father' },
    ],
    riskLevel: 'low',
    lastActivity: '2025-09-08T09:15:00Z',
  },
  {
    id: 'TST003',
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@email.com',
    phone: '+44-7700-900123',
    nationality: 'UK',
    visitorType: 'international',
    checkInDate: '2025-09-03',
    checkOutDate: '2025-09-12',
    status: 'emergency',
    currentLocation: {
      zone: 'Connaught Place',
      coordinates: [28.6315, 77.2167],
      lastUpdated: '2025-09-08T08:45:00Z',
    },
    digitalId: 'DID_003',
    emergencyContacts: [
      { name: 'Sarah Johnson', phone: '+44-7700-900124', relationship: 'Wife' },
    ],
    riskLevel: 'high',
    lastActivity: '2025-09-08T08:45:00Z',
  },
];

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface TouristListProps {
  onTouristSelect?: (tourist: Tourist) => void;
  showActions?: boolean;
  maxHeight?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TouristList({
  onTouristSelect,
  showActions = true,
  maxHeight = '600px',
}: TouristListProps) {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  // State
  const [tourists, setTourists] = useState<Tourist[]>(mockTourists);
  const [loading, setLoading] = useState(false);
  const [selectedTourists, setSelectedTourists] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TouristFilters>({
    search: '',
    status: '',
    visitorType: '',
    riskLevel: '',
    dateRange: { start: '', end: '' },
  });

  // Filter tourists based on current filters
  const filteredTourists = tourists.filter((tourist) => {
    const searchMatch =
      !filters.search ||
      tourist.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      tourist.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      tourist.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      tourist.id.toLowerCase().includes(filters.search.toLowerCase());

    const statusMatch = !filters.status || tourist.status === filters.status;
    const visitorTypeMatch = !filters.visitorType || tourist.visitorType === filters.visitorType;
    const riskLevelMatch = !filters.riskLevel || tourist.riskLevel === filters.riskLevel;

    return searchMatch && statusMatch && visitorTypeMatch && riskLevelMatch;
  });

  // Get status color and icon
  const getStatusDisplay = (status: Tourist['status']) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
          icon: CheckCircle,
          label: 'Active',
        };
      case 'checked_out':
        return {
          color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20',
          icon: Clock,
          label: 'Checked Out',
        };
      case 'emergency':
        return {
          color: 'text-red-600 bg-red-100 dark:bg-red-900/20',
          icon: AlertTriangle,
          label: 'Emergency',
        };
      case 'missing':
        return {
          color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
          icon: AlertTriangle,
          label: 'Missing',
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20',
          icon: Clock,
          label: status,
        };
    }
  };

  // Get risk level color
  const getRiskLevelColor = (level: Tourist['riskLevel']) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time since last activity
  const formatLastActivity = (dateString: string) => {
    const now = new Date();
    const lastActivity = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on tourists:`, selectedTourists);
    // TODO: Implement bulk actions
  };

  // Handle individual tourist actions
  const handleTouristAction = (touristId: string, action: string) => {
    console.log(`Performing ${action} on tourist:`, touristId);
    // TODO: Implement individual actions
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tourist Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredTourists.length} tourists found
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Export button */}
          {hasPermission('tourists.export' as any) && (
            <button
              onClick={() => handleBulkAction('export')}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          )}

          {/* Import button */}
          {hasPermission('tourists.import' as any) && (
            <button
              onClick={() => handleBulkAction('import')}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
          )}

          {/* Add tourist button */}
          {hasPermission('tourists.create' as any) && (
            <Link
              href="/dashboard/tourists/register"
              className="flex items-center px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tourist
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tourists by name, email, or ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center px-4 py-2 text-sm border rounded-md transition-colors',
              showFilters
                ? 'text-primary border-primary bg-primary/10'
                : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="checked_out">Checked Out</option>
              <option value="emergency">Emergency</option>
              <option value="missing">Missing</option>
            </select>

            <select
              value={filters.visitorType}
              onChange={(e) => setFilters({ ...filters, visitorType: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Visitor Types</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>

            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <button
              onClick={() =>
                setFilters({
                  search: '',
                  status: '',
                  visitorType: '',
                  riskLevel: '',
                  dateRange: { start: '', end: '' },
                })
              }
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedTourists.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedTourists.length} tourist(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
              >
                Export
              </button>
              <button
                onClick={() => handleBulkAction('notify')}
                className="px-3 py-1 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tourist list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight }}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedTourists(
                        e.target.checked ? filteredTourists.map((t) => t.id) : []
                      )
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tourist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Visit Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Activity
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTourists.map((tourist) => {
                const statusDisplay = getStatusDisplay(tourist.status);
                const StatusIcon = statusDisplay.icon;

                return (
                  <tr
                    key={tourist.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onTouristSelect?.(tourist)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTourists.includes(tourist.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedTourists(
                            e.target.checked
                              ? [...selectedTourists, tourist.id]
                              : selectedTourists.filter((id) => id !== tourist.id)
                          );
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {tourist.firstName.charAt(0)}
                              {tourist.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tourist.firstName} {tourist.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {tourist.id} • {tourist.nationality}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Mail className="h-3 w-3 mr-1" />
                            {tourist.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          statusDisplay.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusDisplay.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tourist.currentLocation ? (
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900 dark:text-white">
                            <MapPin className="h-3 w-3 mr-1" />
                            {tourist.currentLocation.zone}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {formatLastActivity(tourist.currentLocation.lastUpdated)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(tourist.checkInDate)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          to {formatDate(tourist.checkOutDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'text-sm font-medium capitalize',
                          getRiskLevelColor(tourist.riskLevel)
                        )}
                      >
                        {tourist.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatLastActivity(tourist.lastActivity)}
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dashboard/tourists/${tourist.id}`}
                            className="text-primary hover:text-primary/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {hasPermission('tourists.edit' as any) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTouristAction(tourist.id, 'edit');
                              }}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {hasPermission('tourists.delete' as any) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTouristAction(tourist.id, 'delete');
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTourists.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No tourists found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {tourists.length === 0
                  ? 'No tourists have been registered yet.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TouristList;
