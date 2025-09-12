/**
 * Risk Assessment Component - Analyze zone safety and scoring
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Clock,
  Users,
  MapPin,
  Download,
  RefreshCw
} from 'lucide-react';
import { useZoneStore } from '@/stores/zone-store';
import { RiskLevel } from '@/types/zone';

interface RiskAssessmentProps {
  zoneId: string | null;
  onClose: () => void;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  zoneId,
  onClose
}) => {
  const { zones, analytics, fetchZoneAnalytics, calculateZoneRisk } = useZoneStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [riskScore, setRiskScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const zone = zoneId ? zones.find(z => z.id === zoneId) : null;
  const zoneAnalytics = zoneId ? analytics[zoneId] : null;

  useEffect(() => {
    if (zoneId) {
      loadRiskData();
    }
  }, [zoneId, selectedTimeRange]);

  const loadRiskData = async () => {
    if (!zoneId) return;
    
    setIsLoading(true);
    try {
      const timeRanges = {
        '24h': { start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString() },
        '7d': { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString() },
        '30d': { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString() }
      };

      await fetchZoneAnalytics(zoneId, timeRanges[selectedTimeRange as keyof typeof timeRanges]);
      const calculatedRisk = await calculateZoneRisk(zoneId);
      setRiskScore(calculatedRisk);
    } catch (error) {
      console.error('Error loading risk data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.VERY_LOW:
        return 'text-green-700 bg-green-100';
      case RiskLevel.LOW:
        return 'text-blue-700 bg-blue-100';
      case RiskLevel.MODERATE:
        return 'text-yellow-700 bg-yellow-100';
      case RiskLevel.HIGH:
        return 'text-orange-700 bg-orange-100';
      case RiskLevel.VERY_HIGH:
        return 'text-red-700 bg-red-100';
      case RiskLevel.CRITICAL:
        return 'text-red-900 bg-red-200';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 20) return 'text-green-600';
    if (score < 40) return 'text-blue-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  // Mock risk factors for demonstration
  const riskFactors = [
    { name: 'Historical Incidents', value: 15, max: 100, impact: 'medium' },
    { name: 'Current Weather', value: 25, max: 100, impact: 'low' },
    { name: 'Crowd Density', value: zone?.statistics.currentOccupancy || 0, max: zone?.accessRestrictions.maxOccupancy || 100, impact: 'high' },
    { name: 'Recent Alerts', value: zone?.statistics.alertsTriggeredToday || 0, max: 10, impact: 'high' },
    { name: 'Time of Day', value: 30, max: 100, impact: 'medium' },
    { name: 'Accessibility', value: zone?.accessRestrictions.requiresGuide ? 80 : 20, max: 100, impact: 'medium' }
  ];

  const recommendations = [
    {
      priority: 'high',
      title: 'Increase Patrol Frequency',
      description: 'Recent alert patterns suggest increased security presence needed during peak hours.',
      action: 'Deploy additional security personnel from 2-6 PM'
    },
    {
      priority: 'medium',
      title: 'Update Safety Signage',
      description: 'Ensure all warning signs are visible and up-to-date with current risk information.',
      action: 'Inspect and refresh safety signage within 48 hours'
    },
    {
      priority: 'low',
      title: 'Review Access Restrictions',
      description: 'Consider adjusting maximum occupancy based on recent usage patterns.',
      action: 'Analyze occupancy data and adjust limits if necessary'
    }
  ];

  if (!zone) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a Zone
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please select a zone to view its risk assessment.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Risk Assessment: {zone.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getRiskLevelColor(zone.riskLevel)}`}>
                {zone.riskLevel.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                Zone ID: {zone.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Time Range Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Range:
              </label>
              <div className="flex gap-2">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={loadRiskData}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Risk Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Risk Score</p>
                  <p className={`text-3xl font-bold ${getRiskScoreColor(riskScore)}`}>
                    {riskScore}
                  </p>
                  <p className="text-xs text-blue-500">/ 100</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Occupancy</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {zone.statistics.currentOccupancy}
                  </p>
                  <p className="text-xs text-gray-500">
                    / {zone.accessRestrictions.maxOccupancy || 'Unlimited'}
                  </p>
                </div>
                <Users className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alerts Today</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {zone.statistics.alertsTriggeredToday}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {zone.statistics.alertsTriggeredToday > 5 ? (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-green-500" />
                    )}
                    <span className="text-xs text-gray-500">vs yesterday</span>
                  </div>
                </div>
                <AlertTriangle className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Dwell Time</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {zone.statistics.averageDwellTime}
                  </p>
                  <p className="text-xs text-gray-500">minutes</p>
                </div>
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Risk Factors Analysis
              </h3>
              
              <div className="space-y-4">
                {riskFactors.map((factor, index) => {
                  const percentage = (factor.value / factor.max) * 100;
                  const impactColor = factor.impact === 'high' ? 'text-red-600' : 
                                    factor.impact === 'medium' ? 'text-yellow-600' : 'text-green-600';
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {factor.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${impactColor} bg-opacity-10`}>
                            {factor.impact} impact
                          </span>
                          <span className="text-sm text-gray-600">
                            {factor.value}/{factor.max}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage < 30 ? 'bg-green-500' :
                            percentage < 60 ? 'bg-yellow-500' :
                            percentage < 80 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Risk Mitigation Recommendations
              </h3>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        rec.priority === 'high' ? 'bg-red-500' :
                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {rec.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rec.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {rec.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Action: {rec.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Trends */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Historical Risk Trends
            </h3>
            
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Risk trend charts will be displayed here</p>
                <p className="text-sm text-gray-400">Integrate with charting library for production</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
