/**
 * Zone Editor Component - Create/edit zones with map integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Circle, 
  Pentagon,
  Settings,
  AlertTriangle,
  Shield,
  Users,
  Clock
} from 'lucide-react';
import { useZoneStore } from '@/stores/zone-store';
import { Zone, ZoneType, RiskLevel, AlertPriority } from '@/types/zone';

interface ZoneEditorProps {
  zoneId: string | null;
  onClose: () => void;
  onSave: () => void;
}

const ZoneEditor: React.FC<ZoneEditorProps> = ({
  zoneId,
  onClose,
  onSave
}) => {
  const { zones, createZone, updateZone, getZoneById } = useZoneStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: ZoneType.SAFE_ZONE,
    riskLevel: RiskLevel.LOW,
    geometry: {
      center: { latitude: 40.7589, longitude: -73.9851 },
      radius: 500
    },
    alertSettings: {
      enableEntryAlerts: false,
      enableExitAlerts: false,
      enableDwellTimeAlerts: false,
      maxDwellTime: 60,
      alertPriority: AlertPriority.LOW,
      autoEscalate: false,
      escalationTime: 30
    },
    accessRestrictions: {
      requiresPermission: false,
      requiresGuide: false,
      maxOccupancy: 100
    }
  });

  const [geometryType, setGeometryType] = useState<'circle' | 'polygon'>('circle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (zoneId) {
      const zone = getZoneById(zoneId);
      if (zone) {
        setFormData({
          name: zone.name,
          description: zone.description || '',
          type: zone.type,
          riskLevel: zone.riskLevel,
          geometry: zone.geometry,
          alertSettings: zone.alertSettings,
          accessRestrictions: zone.accessRestrictions
        });
        
        // Determine geometry type
        if ('points' in zone.geometry) {
          setGeometryType('polygon');
        } else {
          setGeometryType('circle');
        }
      }
    }
  }, [zoneId, getZoneById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (zoneId) {
        await updateZone(zoneId, formData);
      } else {
        await createZone(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving zone:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {zoneId ? 'Edit Zone' : 'Create New Zone'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Zone Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter zone name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Zone Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={ZoneType.SAFE_ZONE}>Safe Zone</option>
                  <option value={ZoneType.RISK_ZONE}>Risk Zone</option>
                  <option value={ZoneType.RESTRICTED_ZONE}>Restricted Zone</option>
                  <option value={ZoneType.TOURIST_ATTRACTION}>Tourist Attraction</option>
                  <option value={ZoneType.ACCOMMODATION}>Accommodation</option>
                  <option value={ZoneType.TRANSPORT_HUB}>Transport Hub</option>
                  <option value={ZoneType.MEDICAL_FACILITY}>Medical Facility</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter zone description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Level
              </label>
              <select
                value={formData.riskLevel}
                onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={RiskLevel.VERY_LOW}>Very Low</option>
                <option value={RiskLevel.LOW}>Low</option>
                <option value={RiskLevel.MODERATE}>Moderate</option>
                <option value={RiskLevel.HIGH}>High</option>
                <option value={RiskLevel.VERY_HIGH}>Very High</option>
                <option value={RiskLevel.CRITICAL}>Critical</option>
              </select>
            </div>
          </div>

          {/* Geometry Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Geometry Configuration
            </h3>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGeometryType('circle')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  geometryType === 'circle'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Circle className="w-4 h-4" />
                Circular Zone
              </button>
              
              <button
                type="button"
                onClick={() => setGeometryType('polygon')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  geometryType === 'polygon'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Pentagon className="w-4 h-4" />
                Polygon Zone
              </button>
            </div>

            {geometryType === 'circle' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.geometry.center?.latitude || 0}
                    onChange={(e) => handleNestedChange('geometry', 'center', {
                      ...formData.geometry.center,
                      latitude: parseFloat(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.geometry.center?.longitude || 0}
                    onChange={(e) => handleNestedChange('geometry', 'center', {
                      ...formData.geometry.center,
                      longitude: parseFloat(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Radius (meters)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.geometry.radius || 100}
                    onChange={(e) => handleNestedChange('geometry', 'radius', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {geometryType === 'polygon' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Polygon zone creation will use map interface for coordinate selection in production.
                  For now, circular zones are recommended.
                </p>
              </div>
            )}
          </div>

          {/* Alert Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alert Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.alertSettings.enableEntryAlerts}
                    onChange={(e) => handleNestedChange('alertSettings', 'enableEntryAlerts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Entry Alerts</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.alertSettings.enableExitAlerts}
                    onChange={(e) => handleNestedChange('alertSettings', 'enableExitAlerts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Exit Alerts</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.alertSettings.enableDwellTimeAlerts}
                    onChange={(e) => handleNestedChange('alertSettings', 'enableDwellTimeAlerts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Dwell Time Alerts</span>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Dwell Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.alertSettings.maxDwellTime}
                    onChange={(e) => handleNestedChange('alertSettings', 'maxDwellTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alert Priority
                  </label>
                  <select
                    value={formData.alertSettings.alertPriority}
                    onChange={(e) => handleNestedChange('alertSettings', 'alertPriority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={AlertPriority.LOW}>Low</option>
                    <option value={AlertPriority.MEDIUM}>Medium</option>
                    <option value={AlertPriority.HIGH}>High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Access Restrictions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Access Restrictions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessRestrictions.requiresPermission}
                    onChange={(e) => handleNestedChange('accessRestrictions', 'requiresPermission', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Requires Permission</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessRestrictions.requiresGuide}
                    onChange={(e) => handleNestedChange('accessRestrictions', 'requiresGuide', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Requires Guide</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Occupancy
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.accessRestrictions.maxOccupancy}
                  onChange={(e) => handleNestedChange('accessRestrictions', 'maxOccupancy', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZoneEditor;
