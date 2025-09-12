/**
 * Smart Tourist Safety System - Tourist Filters Component
 * Advanced filtering component for tourist search and management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Filter,
  X,
  Calendar,
  MapPin,
  Users,
  Shield,
  Search,
  RotateCcw
} from 'lucide-react';
import { 
  TouristSearchFilters, 
  TouristStatus, 
  VerificationStatus, 
  AlertLevel 
} from '@/types/tourist';

// ============================================================================
// INTERFACES
// ============================================================================

interface TouristFiltersProps {
  onFilterChange: (filters: TouristSearchFilters) => void;
  onClear: () => void;
  initialFilters?: Partial<TouristSearchFilters>;
}

interface FilterState extends TouristSearchFilters {
  // Additional UI state
  dateRangeType: 'all' | 'today' | 'week' | 'month' | 'custom';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const NATIONALITY_OPTIONS = [
  'All Nationalities',
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'India',
  'China',
  'Brazil',
  'Other'
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: TouristStatus.ACTIVE, label: 'Active' },
  { value: TouristStatus.INACTIVE, label: 'Inactive' },
  { value: TouristStatus.EMERGENCY, label: 'Emergency' },
  { value: TouristStatus.CHECKED_OUT, label: 'Checked Out' },
  { value: TouristStatus.MISSING, label: 'Missing' },
  { value: TouristStatus.SAFE, label: 'Safe' }
];

const VERIFICATION_STATUS_OPTIONS = [
  { value: '', label: 'All Verification Status' },
  { value: VerificationStatus.VERIFIED, label: 'Verified' },
  { value: VerificationStatus.PENDING, label: 'Pending' },
  { value: VerificationStatus.REJECTED, label: 'Rejected' },
  { value: VerificationStatus.EXPIRED, label: 'Expired' },
  { value: VerificationStatus.SUSPENDED, label: 'Suspended' }
];

const ALERT_LEVEL_OPTIONS = [
  { value: '', label: 'All Alert Levels' },
  { value: AlertLevel.LOW, label: 'Low' },
  { value: AlertLevel.MEDIUM, label: 'Medium' },
  { value: AlertLevel.HIGH, label: 'High' },
  { value: AlertLevel.CRITICAL, label: 'Critical' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getDateRange = (type: FilterState['dateRangeType']) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (type) {
    case 'today':
      return {
        start: today.toISOString(),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };
    case 'week':
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start: weekStart.toISOString(),
        end: now.toISOString()
      };
    case 'month':
      const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return {
        start: monthStart.toISOString(),
        end: now.toISOString()
      };
    default:
      return {};
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TouristFilters: React.FC<TouristFiltersProps> = ({
  onFilterChange,
  onClear,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'registrationDate',
    sortOrder: 'desc',
    limit: 50,
    offset: 0,
    dateRangeType: 'all',
    ...initialFilters
  });

  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    // Check if any filters are active
    const activeFilters = Object.entries(filters).some(([key, value]) => {
      if (['limit', 'offset', 'sortBy', 'sortOrder', 'dateRangeType'].includes(key)) {
        return false;
      }
      return value !== undefined && value !== '' && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    });
    
    setHasActiveFilters(activeFilters);
  }, [filters]);

  useEffect(() => {
    // Apply date range when type changes
    if (filters.dateRangeType !== 'custom' && filters.dateRangeType !== 'all') {
      const dateRange = getDateRange(filters.dateRangeType);
      setFilters(prev => ({
        ...prev,
        arrivalDateRange: dateRange.start && dateRange.end ? dateRange : undefined
      }));
    } else if (filters.dateRangeType === 'all') {
      setFilters(prev => ({
        ...prev,
        arrivalDateRange: undefined
      }));
    }
  }, [filters.dateRangeType]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert to TouristSearchFilters by removing UI-specific fields
    const { dateRangeType, ...searchFilters } = newFilters;
    onFilterChange(searchFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      sortBy: 'registrationDate',
      sortOrder: 'desc',
      limit: 50,
      offset: 0,
      dateRangeType: 'all'
    };
    
    setFilters(clearedFilters);
    onClear();
  };

  const handleStatusToggle = (status: TouristStatus) => {
    const currentStatuses = filters.status || [];
    const isSelected = currentStatuses.includes(status);
    
    if (isSelected) {
      const newStatuses = currentStatuses.filter(s => s !== status);
      handleFilterChange('status', newStatuses.length > 0 ? newStatuses : undefined);
    } else {
      handleFilterChange('status', [...currentStatuses, status]);
    }
  };

  const handleVerificationStatusToggle = (verificationStatus: VerificationStatus) => {
    const currentStatuses = filters.verificationStatus || [];
    const isSelected = currentStatuses.includes(verificationStatus);
    
    if (isSelected) {
      const newStatuses = currentStatuses.filter(s => s !== verificationStatus);
      handleFilterChange('verificationStatus', newStatuses.length > 0 ? newStatuses : undefined);
    } else {
      handleFilterChange('verificationStatus', [...currentStatuses, verificationStatus]);
    }
  };

  const handleAlertLevelToggle = (alertLevel: AlertLevel) => {
    const currentLevels = filters.alertLevel || [];
    const isSelected = currentLevels.includes(alertLevel);
    
    if (isSelected) {
      const newLevels = currentLevels.filter(l => l !== alertLevel);
      handleFilterChange('alertLevel', newLevels.length > 0 ? newLevels : undefined);
    } else {
      handleFilterChange('alertLevel', [...currentLevels, alertLevel]);
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="space-y-6">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Filters:
          </span>
        </div>
        
        <button
          onClick={() => handleStatusToggle(TouristStatus.ACTIVE)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            filters.status?.includes(TouristStatus.ACTIVE)
              ? 'bg-green-100 border-green-300 text-green-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          Active Tourists
        </button>
        
        <button
          onClick={() => handleVerificationStatusToggle(VerificationStatus.PENDING)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            filters.verificationStatus?.includes(VerificationStatus.PENDING)
              ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          Pending Verification
        </button>
        
        <button
          onClick={() => handleFilterChange('hasActiveAlerts', true)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            filters.hasActiveAlerts === true
              ? 'bg-red-100 border-red-300 text-red-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          Has Active Alerts
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Name, phone, email..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <div className="space-y-1">
            {STATUS_OPTIONS.slice(1).map(option => (
              <label key={option.value} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(option.value as TouristStatus) || false}
                  onChange={() => handleStatusToggle(option.value as TouristStatus)}
                  className="mr-2 rounded"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Verification
          </label>
          <div className="space-y-1">
            {VERIFICATION_STATUS_OPTIONS.slice(1).map(option => (
              <label key={option.value} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.verificationStatus?.includes(option.value as VerificationStatus) || false}
                  onChange={() => handleVerificationStatusToggle(option.value as VerificationStatus)}
                  className="mr-2 rounded"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Alert Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alert Level
          </label>
          <div className="space-y-1">
            {ALERT_LEVEL_OPTIONS.slice(1).map(option => (
              <label key={option.value} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.alertLevel?.includes(option.value as AlertLevel) || false}
                  onChange={() => handleAlertLevelToggle(option.value as AlertLevel)}
                  className="mr-2 rounded"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Date Range Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Arrival Date Range
          </label>
          <select
            value={filters.dateRangeType}
            onChange={(e) => handleFilterChange('dateRangeType', e.target.value as FilterState['dateRangeType'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Device Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Device Status
          </label>
          <div className="space-y-1">
            {['online', 'offline', 'poor_connection'].map(status => (
              <label key={status} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.deviceStatus?.includes(status as any) || false}
                  onChange={(e) => {
                    const currentStatuses = filters.deviceStatus || [];
                    if (e.target.checked) {
                      handleFilterChange('deviceStatus', [...currentStatuses, status as any]);
                    } else {
                      const newStatuses = currentStatuses.filter(s => s !== status);
                      handleFilterChange('deviceStatus', newStatuses.length > 0 ? newStatuses : undefined);
                    }
                  }}
                  className="mr-2 rounded"
                />
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {filters.dateRangeType === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.arrivalDateRange?.start ? filters.arrivalDateRange.start.split('T')[0] : ''}
              onChange={(e) => {
                const start = e.target.value ? new Date(e.target.value).toISOString() : '';
                handleFilterChange('arrivalDateRange', start ? {
                  start,
                  end: filters.arrivalDateRange?.end || start
                } : undefined);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.arrivalDateRange?.end ? filters.arrivalDateRange.end.split('T')[0] : ''}
              onChange={(e) => {
                const end = e.target.value ? new Date(e.target.value).toISOString() : '';
                handleFilterChange('arrivalDateRange', end ? {
                  start: filters.arrivalDateRange?.start || end,
                  end
                } : undefined);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'registrationDate'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="registrationDate">Registration Date</option>
            <option value="name">Name</option>
            <option value="lastSeen">Last Seen</option>
            <option value="alertLevel">Alert Level</option>
            <option value="verificationStatus">Verification Status</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort Order
          </label>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Results Per Page
          </label>
          <select
            value={filters.limit || 50}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {hasActiveFilters && (
            <span>Active filters applied</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
          
          <button
            onClick={() => {
              const { dateRangeType, ...searchFilters } = filters;
              onFilterChange(searchFilters);
            }}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristFilters;
