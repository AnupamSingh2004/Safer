/**
 * Smart Tourist Safety System - Tourist Table Component
 * Sortable table for displaying tourist data with bulk operations
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Shield, 
  MapPin, 
  Phone, 
  Eye,
  Edit,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import type { Tourist } from '@/types/tourist';

// ============================================================================
// INTERFACES
// ============================================================================

interface TouristTableProps {
  tourists: Tourist[];
  onTouristSelect: (tourist: Tourist) => void;
  onBulkSelect: (ids: string[]) => void;
  selectedIds: string[];
  isLoading?: boolean;
}

interface SortConfig {
  key: keyof Tourist | 'safetyScore' | 'lastActivity';
  direction: 'asc' | 'desc';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'inactive':
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    case 'emergency':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    case 'checked_out':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
  }
};

const getVerificationStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-600" />;
  }
};

const formatLocation = (tourist: Tourist): string => {
  if (tourist.currentLocation?.address) {
    return tourist.currentLocation.address.length > 30 
      ? `${tourist.currentLocation.address.substring(0, 30)}...`
      : tourist.currentLocation.address;
  }
  return 'Unknown';
};

const formatLastActivity = (tourist: Tourist): string => {
  // Mock last activity since it's not in the type
  const activities = ['2 hours ago', '5 minutes ago', '1 day ago', '30 minutes ago', 'Just now'];
  return activities[Math.floor(Math.random() * activities.length)];
};

const getSafetyScore = (tourist: Tourist): number => {
  // Mock safety score since it's not in the type
  return Math.floor(Math.random() * 40) + 60; // 60-100 range
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TouristTable: React.FC<TouristTableProps> = ({
  tourists,
  onTouristSelect,
  onBulkSelect,
  selectedIds,
  isLoading = false
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'fullName',
    direction: 'asc'
  });

  // ========================================================================
  // SORTING LOGIC
  // ========================================================================

  const sortedTourists = useMemo(() => {
    const sorted = [...tourists].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'safetyScore':
          aValue = getSafetyScore(a);
          bValue = getSafetyScore(b);
          break;
        case 'lastActivity':
          aValue = formatLastActivity(a);
          bValue = formatLastActivity(b);
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [tourists, sortConfig]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onBulkSelect(tourists.map(t => t.id));
    } else {
      onBulkSelect([]);
    }
  };

  const handleSelectTourist = (id: string, checked: boolean) => {
    if (checked) {
      onBulkSelect([...selectedIds, id]);
    } else {
      onBulkSelect(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const getSortIcon = (key: SortConfig['key']) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  // ========================================================================
  // CALCULATED VALUES
  // ========================================================================

  const allSelected = tourists.length > 0 && selectedIds.length === tourists.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < tourists.length;

  // ========================================================================
  // RENDER
  // ========================================================================

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading tourists...</p>
      </div>
    );
  }

  if (tourists.length === 0) {
    return (
      <div className="p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No tourists found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Table Header */}
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort('fullName')}
            >
              <div className="flex items-center gap-1">
                Tourist Name
                {getSortIcon('fullName')}
              </div>
            </th>
            
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort('nationality')}
            >
              <div className="flex items-center gap-1">
                Nationality
                {getSortIcon('nationality')}
              </div>
            </th>
            
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                {getSortIcon('status')}
              </div>
            </th>
            
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort('safetyScore')}
            >
              <div className="flex items-center gap-1">
                Safety Score
                {getSortIcon('safetyScore')}
              </div>
            </th>
            
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </th>
            
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort('lastActivity')}
            >
              <div className="flex items-center gap-1">
                Last Activity
                {getSortIcon('lastActivity')}
              </div>
            </th>
            
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Verification
            </th>
            
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTourists.map((tourist) => (
            <tr 
              key={tourist.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {/* Checkbox */}
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(tourist.id)}
                  onChange={(e) => handleSelectTourist(tourist.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>

              {/* Tourist Name */}
              <td className="px-6 py-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onTouristSelect(tourist)}
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {tourist.firstName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {tourist.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {tourist.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </td>

              {/* Nationality */}
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900 dark:text-white">
                  {tourist.nationality}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tourist.status)}`}>
                  {tourist.status.charAt(0).toUpperCase() + tourist.status.slice(1)}
                </span>
              </td>

              {/* Safety Score */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getSafetyScore(tourist) >= 80 ? 'bg-green-500' :
                        getSafetyScore(tourist) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${getSafetyScore(tourist)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getSafetyScore(tourist)}
                  </span>
                </div>
              </td>

              {/* Location */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatLocation(tourist)}
                  </span>
                </div>
              </td>

              {/* Last Activity */}
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatLastActivity(tourist)}
                </span>
              </td>

              {/* Verification */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  {getVerificationStatusIcon(tourist.verificationStatus)}
                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                    {tourist.verificationStatus}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onTouristSelect(tourist)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Edit Tourist"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="More Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Footer */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {sortedTourists.length} of {tourists.length} tourists
          </span>
          {selectedIds.length > 0 && (
            <span>
              {selectedIds.length} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TouristTable;
