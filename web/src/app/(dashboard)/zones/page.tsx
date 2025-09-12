/**
 * Zone Management Dashboard Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Shield,
  Download,
  Settings
} from 'lucide-react';
import { useZoneStore } from '@/stores/zone-store';
import ZoneList from '@/components/dashboard/zones/zone-list';
import ZoneEditor from '@/components/dashboard/zones/zone-editor';
import RiskAssessment from '@/components/dashboard/zones/risk-assessment';

const ZonesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showZoneEditor, setShowZoneEditor] = useState(false);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const {
    fetchZones,
    setFilters,
    resetFilters,
    totalZones,
    activeZones,
    highRiskZones,
    isLoading
  } = useZoneStore();

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  useEffect(() => {
    setFilters({ searchTerm: searchQuery });
  }, [searchQuery, setFilters]);

  const handleCreateZone = () => {
    setSelectedZoneId(null);
    setShowZoneEditor(true);
  };

  const handleEditZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setShowZoneEditor(true);
  };

  const handleShowRiskAssessment = (zoneId?: string) => {
    setSelectedZoneId(zoneId || null);
    setShowRiskAssessment(true);
  };

  const stats = [
    {
      label: 'Total Zones',
      value: totalZones,
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      label: 'Active Zones',
      value: activeZones,
      icon: Shield,
      color: 'text-green-600'
    },
    {
      label: 'High Risk Zones',
      value: highRiskZones,
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Zone Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage geofences, risk zones, and safety monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleShowRiskAssessment()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Risk Assessment
          </button>
          
          <button
            onClick={handleCreateZone}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Zone
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search zones by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Zone List */}
      <ZoneList
        onEditZone={handleEditZone}
        onShowRiskAssessment={handleShowRiskAssessment}
        isLoading={isLoading}
      />

      {/* Zone Editor Modal */}
      {showZoneEditor && (
        <ZoneEditor
          zoneId={selectedZoneId}
          onClose={() => setShowZoneEditor(false)}
          onSave={() => {
            setShowZoneEditor(false);
            fetchZones();
          }}
        />
      )}

      {/* Risk Assessment Modal */}
      {showRiskAssessment && (
        <RiskAssessment
          zoneId={selectedZoneId}
          onClose={() => setShowRiskAssessment(false)}
        />
      )}
    </div>
  );
};

export default ZonesPage;
