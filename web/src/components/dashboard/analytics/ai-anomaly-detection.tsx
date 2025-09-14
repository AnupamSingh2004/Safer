/**
 * Smart Tourist Safety System - AI Anomaly Detection
 * Advanced AI anomaly detection with pattern recognition visualization
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  Eye,
  TrendingUp,
  Clock,
  MapPin,
  User,
  Zap,
  Target,
  Shield,
  Activity,
  RefreshCw,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Gauge,
  Waves,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiService, type AnomalyDetection } from '@/services/ai-service';
import { formatDate, formatDateTime } from '@/lib/utils';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface AnomalyDetectionProps {
  className?: string;
  showFilters?: boolean;
  autoRefresh?: boolean;
  onAnomalySelect?: (anomaly: AnomalyDetection) => void;
}

interface AnomalyFilters {
  severity: string[];
  status: string[];
  type: string[];
  timeRange: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AIAnomalyDetection({
  className = '',
  showFilters = true,
  autoRefresh = true,
  onAnomalySelect
}: AnomalyDetectionProps) {
  // State Management
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyDetection | null>(null);
  const [filters, setFilters] = useState<AnomalyFilters>({
    severity: [],
    status: [],
    type: [],
    timeRange: '24h'
  });
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load anomalies
  const loadAnomalies = async () => {
    try {
      setIsLoading(true);
      const data = await aiService.getAnomalyDetections({
        severity: filters.severity.length > 0 ? filters.severity : undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        limit: 50
      });
      setAnomalies(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load anomalies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    loadAnomalies();
    
    if (autoRefresh) {
      const interval = setInterval(loadAnomalies, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [filters, autoRefresh]);

  // Filtered and sorted anomalies
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(anomaly => {
      if (filters.severity.length > 0 && !filters.severity.includes(anomaly.severity)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(anomaly.status)) {
        return false;
      }
      if (filters.type.length > 0 && !filters.type.includes(anomaly.anomalyType)) {
        return false;
      }
      return true;
    }).sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }, [anomalies, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAnomalies.length;
    const critical = filteredAnomalies.filter(a => a.severity === 'critical').length;
    const high = filteredAnomalies.filter(a => a.severity === 'high').length;
    const active = filteredAnomalies.filter(a => a.status === 'active').length;
    const avgConfidence = filteredAnomalies.reduce((sum, a) => sum + a.confidence, 0) / total || 0;

    return { total, critical, high, active, avgConfidence };
  }, [filteredAnomalies]);

  // Utility functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'false_positive': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAnomalyTypeIcon = (type: string) => {
    switch (type) {
      case 'location_deviation': return <MapPin className="w-5 h-5" />;
      case 'prolonged_inactivity': return <Clock className="w-5 h-5" />;
      case 'unusual_speed': return <Zap className="w-5 h-5" />;
      case 'geofence_violation': return <Shield className="w-5 h-5" />;
      case 'panic_pattern': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const toggleCardExpansion = (anomalyId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(anomalyId)) {
      newExpanded.delete(anomalyId);
    } else {
      newExpanded.add(anomalyId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Anomaly Detection
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time pattern recognition and behavioral analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnomalies}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Anomalies</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">High Priority</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.high}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Cases</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.avgConfidence.toFixed(1)}%</p>
              </div>
              <Gauge className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Types</option>
              <option value="location_deviation">Location Deviation</option>
              <option value="prolonged_inactivity">Prolonged Inactivity</option>
              <option value="unusual_speed">Unusual Speed</option>
              <option value="geofence_violation">Geofence Violation</option>
              <option value="panic_pattern">Panic Pattern</option>
            </select>

            <div className="text-xs text-gray-500">
              Last updated: {formatDateTime(lastUpdate)}
            </div>
          </div>
        </Card>
      )}

      {/* Anomaly List */}
      <div className="space-y-4">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading AI anomaly data...</span>
              </div>
            </div>
          ) : filteredAnomalies.length === 0 ? (
            <Card className="p-8 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Anomalies Detected
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The AI system is monitoring tourist behavior patterns. No anomalies match your current filters.
              </p>
            </Card>
          ) : (
            filteredAnomalies.map((anomaly, index) => (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Anomaly Type Icon */}
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0">
                        {getAnomalyTypeIcon(anomaly.anomalyType)}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {anomaly.touristName}
                          </h3>
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(anomaly.status)}
                            <span className="text-xs text-gray-500 capitalize">
                              {anomaly.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {anomaly.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(anomaly.detectedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{anomaly.location.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{anomaly.confidence}% confidence</span>
                          </div>
                        </div>

                        {/* Confidence Progress */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">AI Confidence</span>
                            <span className="text-gray-700 dark:text-gray-300">{anomaly.confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${anomaly.confidence}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {expandedCards.has(anomaly.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                            >
                              {/* Context Section */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 dark:text-white">Context Analysis</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-medium text-green-700 dark:text-green-300 mb-1">
                                      Expected Behavior
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {anomaly.context.expectedBehavior}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-red-700 dark:text-red-300 mb-1">
                                      Actual Behavior
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {anomaly.context.actualBehavior}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Deviation Score
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                      <div 
                                        className="bg-red-600 h-3 rounded-full transition-all duration-300" 
                                        style={{ width: `${anomaly.context.deviationScore}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium">
                                      {anomaly.context.deviationScore}/100
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Recommendations Section */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">Recommended Actions</h4>
                                {anomaly.recommendations.map((rec, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <span className="text-sm text-blue-700 dark:text-blue-300">
                                      {rec}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Location Section */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 dark:text-white">Location Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Latitude:</span>
                                    <span className="ml-2 font-mono">{anomaly.location.latitude.toFixed(6)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Longitude:</span>
                                    <span className="ml-2 font-mono">{anomaly.location.longitude.toFixed(6)}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-sm">Address:</span>
                                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                                    {anomaly.location.address}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardExpansion(anomaly.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedCards.has(anomaly.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAnomaly(anomaly);
                          onAnomalySelect?.(anomaly);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            AI System Active
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default AIAnomalyDetection;