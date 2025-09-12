/**
 * Zone List Component - Display zone cards with risk levels
 */

'use client';

import React from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Users, 
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Power,
  PowerOff
} from 'lucide-react';
import { useZoneStore } from '@/stores/zone-store';
import { Zone, RiskLevel, ZoneStatus } from '@/types/zone';

interface ZoneListProps {
  onEditZone: (zoneId: string) => void;
  onShowRiskAssessment: (zoneId: string) => void;
  isLoading: boolean;
}

const ZoneList: React.FC<ZoneListProps> = ({
  onEditZone,
  onShowRiskAssessment,
  isLoading
}) => {
  const { 
    filteredZones, 
    toggleZoneStatus,
    selectZone 
  } = useZoneStore();

  const getRiskLevelColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.VERY_LOW:
        return 'bg-green-100 text-green-800 border-green-200';
      case RiskLevel.LOW:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case RiskLevel.MODERATE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RiskLevel.HIGH:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case RiskLevel.VERY_HIGH:
        return 'bg-red-100 text-red-800 border-red-200';
      case RiskLevel.CRITICAL:
        return 'bg-red-200 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getZoneTypeIcon = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return Shield;
      case 'risk_zone':
        return AlertTriangle;
      case 'tourist_attraction':
        return MapPin;
      default:
        return MapPin;
    }
  };

  const handleToggleStatus = async (zoneId: string) => {
    await toggleZoneStatus(zoneId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredZones.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No zones found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria or create a new zone.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredZones.map((zone) => {
        const ZoneIcon = getZoneTypeIcon(zone.type);
        
        return (
          <div
            key={zone.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Zone Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${zone.status === ZoneStatus.ACTIVE ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    <ZoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {zone.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {zone.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getRiskLevelColor(zone.riskLevel)}`}>
                    {zone.riskLevel.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {zone.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {zone.description}
                </p>
              )}

              {/* Zone Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Occupancy</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {zone.statistics.currentOccupancy}
                  </p>
                  {zone.accessRestrictions.maxOccupancy && (
                    <p className="text-xs text-gray-500">
                      / {zone.accessRestrictions.maxOccupancy}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Alerts Today</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {zone.statistics.alertsTriggeredToday}
                  </p>
                </div>
              </div>

              {/* Zone Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${zone.status === ZoneStatus.ACTIVE ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {zone.status === ZoneStatus.ACTIVE ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Avg: {zone.statistics.averageDwellTime}m
                  </span>
                </div>
              </div>

              {/* Geofence Status */}
              {zone.isGeofenceActive && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">
                    Geofence Active
                  </span>
                </div>
              )}
            </div>

            {/* Zone Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditZone(zone.id)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => onShowRiskAssessment(zone.id)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>

                <button
                  onClick={() => handleToggleStatus(zone.id)}
                  className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                    zone.status === ZoneStatus.ACTIVE
                      ? 'text-red-700 hover:bg-red-100'
                      : 'text-green-700 hover:bg-green-100'
                  }`}
                >
                  {zone.status === ZoneStatus.ACTIVE ? (
                    <>
                      <PowerOff className="w-4 h-4" />
                      Disable
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4" />
                      Enable
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ZoneList;
