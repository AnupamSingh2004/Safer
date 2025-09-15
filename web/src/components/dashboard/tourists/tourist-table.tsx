/**
 * Smart Tourist Safety System - Tourist Table Component
 * Mobile-first responsive table with card view for smaller screens
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Search,
  Filter,
  Menu,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SwipeableCard, MotionBox, StaggerContainer } from '@/components/animations';
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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Auto switch to card view on mobile
  React.useEffect(() => {
    if (isMobile) {
      setViewMode('cards');
    } else {
      setViewMode('table');
    }
  }, [isMobile]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'fullName',
    direction: 'asc'
  });

  // ========================================================================
  // FILTERING LOGIC
  // ========================================================================

  const filteredTourists = useMemo(() => {
    return tourists.filter(tourist => {
      const matchesSearch = tourist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tourist.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tourist.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || tourist.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [tourists, searchTerm, filterStatus]);

  // ========================================================================
  // SORTING LOGIC
  // ========================================================================

  const sortedTourists = useMemo(() => {
    const sorted = [...filteredTourists].sort((a, b) => {
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
  }, [filteredTourists, sortConfig]);

  // ========================================================================
  // MOBILE CARD VIEW COMPONENT
  // ========================================================================

  const TouristCard: React.FC<{ tourist: Tourist; index: number }> = ({ tourist, index }) => (
    <SwipeableCard
      key={tourist.id}
      onSwipeLeft={() => console.log('Swipe left:', tourist.id)}
      onSwipeRight={() => console.log('Swipe right:', tourist.id)}
      className="mb-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.includes(tourist.id)}
              onChange={(e) => handleSelectTourist(tourist.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
            />
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">
                {tourist.firstName?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {tourist.fullName}
              </h3>
              <p className="text-sm text-gray-500">
                {tourist.nationality}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tourist.status)}`}>
            {tourist.status.charAt(0).toUpperCase() + tourist.status.slice(1)}
          </span>
        </div>

        {/* Card Content */}
        <div className="space-y-3">
          {/* Safety Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Safety Score</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getSafetyScore(tourist) >= 80 ? 'bg-green-500' :
                    getSafetyScore(tourist) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${getSafetyScore(tourist)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getSafetyScore(tourist)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 dark:text-white truncate">
              {formatLocation(tourist)}
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 dark:text-white">
              {tourist.contactInfo?.phone || 'No contact'}
            </span>
          </div>

          {/* Last Activity */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 dark:text-white">
              {formatLastActivity(tourist)}
            </span>
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getVerificationStatusIcon(tourist.verificationStatus)}
              <span className="text-sm text-gray-900 dark:text-white capitalize">
                {tourist.verificationStatus}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ID: {tourist.id.substring(0, 8)}...
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTouristSelect(tourist)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 rounded-md transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </motion.button>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              title="Edit Tourist"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </SwipeableCard>
  );

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
      onBulkSelect(sortedTourists.map(t => t.id));
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

  const allSelected = sortedTourists.length > 0 && selectedIds.length === sortedTourists.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < sortedTourists.length;

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
    <div className="w-full">
      {/* Header & Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tourists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="emergency">Emergency</option>
                <option value="checked_out">Checked Out</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* View Toggle (Desktop only) */}
            {!isMobile && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Table View"
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

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {sortedTourists.length} of {tourists.length} tourists
            </span>
          </div>
          
          {selectedIds.length > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>{selectedIds.length} selected</span>
              </div>
            </>
          )}

          {searchTerm && (
            <>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Filtered by "{searchTerm}"</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conditional Rendering: Cards vs Table */}
      {viewMode === 'cards' || isMobile ? (
        // Mobile Card View
        <StaggerContainer className="space-y-4">
          {sortedTourists.map((tourist, index) => (
            <TouristCard key={tourist.id} tourist={tourist} index={index} />
          ))}
        </StaggerContainer>
      ) : (
        // Desktop Table View
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
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
      )}
    </div>
  );
};

export default TouristTable;
