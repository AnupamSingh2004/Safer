/**
 * Smart Tourist Safety System - Tourists Page
 * Complete tourist management dashboard page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Download, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  MapPin,
  Phone,
  RefreshCw
} from 'lucide-react';
import TouristTable from '@/components/dashboard/tourists/tourist-table';
import TouristFilters from '@/components/dashboard/tourists/tourist-filters';
import TouristDetails from '@/components/dashboard/tourists/tourist-details';
import { useTouristStore } from '@/stores/tourist-store';
import type { Tourist, TouristSearchFilters } from '@/types/tourist';

// ============================================================================
// INTERFACES
// ============================================================================

interface TouristsPageState {
  selectedTourist: Tourist | null;
  showDetails: boolean;
  showFilters: boolean;
  searchQuery: string;
  selectedIds: string[];
  isLoading: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TouristsPage() {
  const [state, setState] = useState<TouristsPageState>({
    selectedTourist: null,
    showDetails: false,
    showFilters: false,
    searchQuery: '',
    selectedIds: [],
    isLoading: false
  });

  const {
    tourists,
    totalTourists,
    activeTourists,
    verifiedTourists,
    fetchTourists,
    searchTourists,
    clearSearchResults,
    isLoading: storeLoading,
    error
  } = useTouristStore();

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    fetchTourists();
  }, [fetchTourists]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, isLoading: true }));
    
    if (query.trim()) {
      const filters: TouristSearchFilters = {
        search: query,
        limit: 50
      };
      await searchTourists(filters);
    } else {
      clearSearchResults();
      await fetchTourists();
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const handleFilterChange = async (filters: TouristSearchFilters) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await searchTourists(filters);
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const handleTouristSelect = (tourist: Tourist) => {
    setState(prev => ({
      ...prev,
      selectedTourist: tourist,
      showDetails: true
    }));
  };

  const handleBulkSelect = (ids: string[]) => {
    setState(prev => ({ ...prev, selectedIds: ids }));
  };

  const handleRefresh = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await fetchTourists();
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const handleExport = () => {
    // Simulate export functionality
    const exportData = tourists.map(tourist => ({
      name: tourist.fullName,
      nationality: tourist.nationality,
      status: tourist.status,
      safetyScore: tourist.safetyStatus?.currentRiskScore || 0,
      location: tourist.currentLocation?.address || 'Unknown',
      lastActivity: tourist.lastUpdateDate
    }));

    const csv = [
      ['Name', 'Nationality', 'Status', 'Safety Score', 'Location', 'Last Activity'],
      ...exportData.map(row => [
        row.name,
        row.nationality,
        row.status,
        row.safetyScore?.toString() || '0',
        row.location,
        row.lastActivity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tourists-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateTourist = () => {
    // Navigate to create tourist form
    // Create new tourist functionality
  };

  // ========================================================================
  // CALCULATED VALUES
  // ========================================================================

  const statsCards = [
    {
      title: 'Total Tourists',
      value: totalTourists.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'Active Tourists',
      value: activeTourists.toLocaleString(),
      icon: <Shield className="w-5 h-5" />,
      color: 'green'
    },
    {
      title: 'Verified IDs',
      value: verifiedTourists.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: 'purple'
    },
    {
      title: 'Selected',
      value: state.selectedIds.length.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'orange'
    }
  ];

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tourist Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage tourist registrations, track locations, and monitor safety status
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={state.isLoading || storeLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${(state.isLoading || storeLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={handleCreateTourist}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Add Tourist
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`p-2 rounded-full bg-${card.color}-50 dark:bg-${card.color}-900/20`}>
                <div className={`text-${card.color}-600 dark:text-${card.color}-400`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tourists by name, ID, nationality..."
                value={state.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                state.showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Bulk Actions */}
            {state.selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {state.selectedIds.length} selected
                </span>
                <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MoreVertical className="w-3 h-3" />
                  Actions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {state.showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <TouristFilters
              onFilterChange={handleFilterChange}
              onClear={() => {
                clearSearchResults();
                fetchTourists();
              }}
            />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading tourists:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tourist Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <TouristTable
          tourists={tourists}
          onTouristSelect={handleTouristSelect}
          onBulkSelect={handleBulkSelect}
          selectedIds={state.selectedIds}
          isLoading={state.isLoading || storeLoading}
        />
      </div>

      {/* Tourist Details Modal */}
      {state.showDetails && state.selectedTourist && (
        <TouristDetails
          tourist={state.selectedTourist}
          isOpen={state.showDetails}
          onClose={() => setState(prev => ({ ...prev, showDetails: false, selectedTourist: null }))}
        />
      )}
    </div>
  );
}
