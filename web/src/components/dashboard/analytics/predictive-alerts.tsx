/**
 * Smart Tourist Safety System - Predictive Alerts
 * AI-powered predictive analysis for risk areas and potential incidents
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  Cloud,
  Users,
  Shield,
  Zap,
  Clock,
  MapPin,
  Eye,
  Target,
  BarChart3,
  RefreshCw,
  Filter,
  Download,
  Settings,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Calendar,
  Thermometer,
  Activity,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiService, type PredictiveAlert } from '@/services/ai-service';
import { formatDate, formatDateTime } from '@/lib/utils';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface PredictiveAlertsProps {
  className?: string;
  showFilters?: boolean;
  autoRefresh?: boolean;
  onAlertSelect?: (alert: PredictiveAlert) => void;
}

interface AlertFilters {
  type: string[];
  severity: string[];
  probability: number;
  timeframe: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PredictiveAlerts({
  className = '',
  showFilters = true,
  autoRefresh = true,
  onAlertSelect
}: PredictiveAlertsProps) {
  // State Management
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<PredictiveAlert | null>(null);
  const [filters, setFilters] = useState<AlertFilters>({
    type: [],
    severity: [],
    probability: 0,
    timeframe: '24h'
  });
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load alerts
  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await aiService.getPredictiveAlerts({
        type: filters.type.length > 0 ? filters.type : undefined,
        severity: filters.severity.length > 0 ? filters.severity : undefined,
        probability: filters.probability > 0 ? filters.probability : undefined,
        limit: 20
      });
      setAlerts(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load predictive alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    loadAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(loadAlerts, 45000); // Refresh every 45 seconds
      return () => clearInterval(interval);
    }
  }, [filters, autoRefresh]);

  // Filtered and sorted alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filters.type.length > 0 && !filters.type.includes(alert.type)) {
        return false;
      }
      if (filters.severity.length > 0 && !filters.severity.includes(alert.severity)) {
        return false;
      }
      if (filters.probability > 0 && alert.probability < filters.probability) {
        return false;
      }
      return true;
    }).sort((a, b) => b.probability - a.probability);
  }, [alerts, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAlerts.length;
    const highProbability = filteredAlerts.filter(a => a.probability >= 80).length;
    const criticalSeverity = filteredAlerts.filter(a => a.severity === 'critical').length;
    const within24h = filteredAlerts.filter(a => 
      a.predictedTime.getTime() <= Date.now() + 24 * 60 * 60 * 1000
    ).length;
    const avgProbability = filteredAlerts.reduce((sum, a) => sum + a.probability, 0) / total || 0;

    return { total, highProbability, criticalSeverity, within24h, avgProbability };
  }, [filteredAlerts]);

  // Utility functions
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'weather_incident': return <Cloud className="w-5 h-5" />;
      case 'crowd_density': return <Users className="w-5 h-5" />;
      case 'security_threat': return <Shield className="w-5 h-5" />;
      case 'risk_area': return <AlertTriangle className="w-5 h-5" />;
      case 'infrastructure_failure': return <Zap className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weather_incident': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'crowd_density': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'security_threat': return 'bg-red-100 text-red-700 border-red-300';
      case 'risk_area': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'infrastructure_failure': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 90) return 'text-red-600';
    if (probability >= 70) return 'text-orange-600';
    if (probability >= 50) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getTimeUntilPrediction = (predictedTime: Date) => {
    const now = new Date();
    const diff = predictedTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return 'Less than 1h';
  };

  const toggleCardExpansion = (alertId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Predictive Alerts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered forecasting for potential safety incidents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAlerts}
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
                <p className="text-sm font-medium text-red-600 dark:text-red-400">High Probability</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.highProbability}</p>
              </div>
              <Gauge className="w-8 h-8 text-red-500" />
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
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Critical Severity</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.criticalSeverity}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Within 24h</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.within24h}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Avg Probability</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.avgProbability.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
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
              <option value="">All Types</option>
              <option value="weather_incident">Weather Incident</option>
              <option value="crowd_density">Crowd Density</option>
              <option value="security_threat">Security Threat</option>
              <option value="risk_area">Risk Area</option>
              <option value="infrastructure_failure">Infrastructure</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="0">All Probabilities</option>
              <option value="90">90%+ High Risk</option>
              <option value="70">70%+ Likely</option>
              <option value="50">50%+ Possible</option>
            </select>

            <div className="text-xs text-gray-500">
              Last updated: {formatDateTime(lastUpdate)}
            </div>
          </div>
        </Card>
      )}

      {/* Alert List */}
      <div className="space-y-4">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing predictive patterns...</span>
              </div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Predictive Alerts
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI analysis shows no significant risk patterns for the selected filters.
              </p>
            </Card>
          ) : (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Alert Type Icon */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(alert.type)}`}>
                        {getAlertTypeIcon(alert.type)}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className={`text-sm font-semibold ${getProbabilityColor(alert.probability)}`}>
                            {alert.probability}% probability
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {alert.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>In {getTimeUntilPrediction(alert.predictedTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{alert.affectedTourists} tourists affected</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{alert.confidence}% confidence</span>
                          </div>
                        </div>

                        {/* Probability Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Risk Probability</span>
                            <span className={`font-medium ${getProbabilityColor(alert.probability)}`}>
                              {alert.probability}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                alert.probability >= 80 ? 'bg-red-500' : 
                                alert.probability >= 60 ? 'bg-orange-500' :
                                alert.probability >= 40 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${alert.probability}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {expandedCards.has(alert.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                            >
                              {/* Contributing Factors */}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  Contributing Factors
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {alert.factors.map((factor, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                      <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                      <span className="text-sm text-yellow-700 dark:text-yellow-300">
                                        {factor}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Mitigation Steps */}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  Recommended Mitigation Steps
                                </h4>
                                <div className="space-y-2">
                                  {alert.mitigationSteps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                                      <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                        {idx + 1}
                                      </div>
                                      <span className="text-sm text-green-700 dark:text-green-300">
                                        {step}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Historical Data */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Historical Accuracy
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{alert.historicalData.accuracy}%</span>
                                  </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Similar Incidents
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{alert.historicalData.similarIncidents} cases</span>
                                  </div>
                                </div>
                              </div>

                              {/* Affected Zones */}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  Affected Zones
                                </h4>
                                <div className="flex gap-2 flex-wrap">
                                  {alert.affectedZones.map((zone, idx) => (
                                    <Badge key={idx} variant="outline" className="gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {zone}
                                    </Badge>
                                  ))}
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
                        onClick={() => toggleCardExpansion(alert.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedCards.has(alert.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAlert(alert);
                          onAlertSelect?.(alert);
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
        className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Predictive AI Active
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default PredictiveAlerts;