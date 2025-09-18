/**
 * Smart Tourist Safety System - Enhanced AI Anomaly Detection
 * Advanced anomaly detection with new pattern recognition including:
 * - Prolonged inactivity detection
 * - Silent/distress behavior flagging
 * - Missing person investigation tools
 * - Automated alert generation
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  Eye,
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
  UserX,
  PhoneOff,
  BatteryLow,
  Wifi,
  WifiOff,
  Navigation,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Phone,
  MessageSquare,
  Camera,
  Calendar,
  TrendingDown,
  TrendingUp,
  Pause,
  Play,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// ENHANCED TYPES & INTERFACES
// ============================================================================

interface EnhancedAnomalyDetection {
  id: string;
  touristId: string;
  touristName: string;
  anomalyType: 'location_dropout' | 'prolonged_inactivity' | 'route_deviation' | 
                'silent_distress' | 'emergency_pattern' | 'device_offline' | 
                'unusual_behavior' | 'missing_checkin' | 'panic_sequence';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'escalated' | 'resolved' | 'false_positive';
  description: string;
  detectedAt: string;
  lastLocation: {
    coordinates: [number, number];
    address: string;
    timestamp: string;
    accuracy: number;
  };
  confidence: number;
  riskScore: number;
  patterns: {
    duration: number; // minutes
    frequency: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  deviceInfo: {
    batteryLevel?: number;
    connectivity: 'online' | 'offline' | 'intermittent';
    lastSeen: string;
    signalStrength?: number;
  };
  behaviorIndicators: {
    silentDuration?: number;
    inactivityDuration?: number;
    deviationDistance?: number;
    emergencySignals?: string[];
    communicationPatterns?: 'normal' | 'erratic' | 'ceased';
  };
  investigationNotes?: string;
  assignedOfficer?: string;
  escalationReason?: string;
  resolution?: string;
}

interface AnomalyFilters {
  severity: string[];
  status: string[];
  type: string[];
  timeRange: string;
  officer: string;
  riskLevel: string[];
}

interface InvestigationAction {
  id: string;
  anomalyId: string;
  actionType: 'contact_attempt' | 'location_check' | 'emergency_contact' | 
               'field_dispatch' | 'efir_generation' | 'escalation';
  description: string;
  takenBy: string;
  timestamp: string;
  outcome: string;
  nextAction?: string;
}

// ============================================================================
// MOCK ENHANCED DATA
// ============================================================================

const mockEnhancedAnomalies: EnhancedAnomalyDetection[] = [
  {
    id: 'ANM-001',
    touristId: 'T002',
    touristName: 'Maria Garcia',
    anomalyType: 'prolonged_inactivity',
    severity: 'high',
    status: 'investigating',
    description: 'Tourist has been inactive for 3+ hours with no movement detected. Last known location at India Gate.',
    detectedAt: '2024-01-20T16:30:00Z',
    lastLocation: {
      coordinates: [77.2295, 28.6129],
      address: 'India Gate, Rajpath, New Delhi',
      timestamp: '2024-01-20T13:15:00Z',
      accuracy: 5
    },
    confidence: 87,
    riskScore: 78,
    patterns: {
      duration: 195,
      frequency: 1,
      trend: 'increasing'
    },
    deviceInfo: {
      batteryLevel: 23,
      connectivity: 'intermittent',
      lastSeen: '2024-01-20T16:25:00Z',
      signalStrength: 2
    },
    behaviorIndicators: {
      inactivityDuration: 195,
      communicationPatterns: 'ceased'
    },
    assignedOfficer: 'Inspector Raj Kumar',
    investigationNotes: 'Multiple contact attempts failed. Device shows low battery. Dispatching field team to last known location.'
  },
  {
    id: 'ANM-002',
    touristId: 'T005',
    touristName: 'David Wilson',
    anomalyType: 'silent_distress',
    severity: 'critical',
    status: 'escalated',
    description: 'Unusual sequence of app interactions suggesting distress. Emergency gesture pattern detected.',
    detectedAt: '2024-01-20T15:45:00Z',
    lastLocation: {
      coordinates: [77.2500, 28.5525],
      address: 'Lotus Temple, Bahapur, New Delhi',
      timestamp: '2024-01-20T15:30:00Z',
      accuracy: 3
    },
    confidence: 94,
    riskScore: 92,
    patterns: {
      duration: 45,
      frequency: 3,
      trend: 'increasing'
    },
    deviceInfo: {
      batteryLevel: 67,
      connectivity: 'online',
      lastSeen: '2024-01-20T15:44:00Z',
      signalStrength: 4
    },
    behaviorIndicators: {
      emergencySignals: ['Triple tap detected', 'Volume button sequence', 'Screen shake pattern'],
      communicationPatterns: 'erratic'
    },
    assignedOfficer: 'Inspector Priya Singh',
    escalationReason: 'Emergency pattern detected with high confidence',
    investigationNotes: 'Emergency response team dispatched. Tourist may be in immediate danger.'
  },
  {
    id: 'ANM-003',
    touristId: 'T007',
    touristName: 'Ahmed Hassan',
    anomalyType: 'location_dropout',
    severity: 'medium',
    status: 'active',
    description: 'Sudden location tracking failure in known coverage area. Device possibly switched off.',
    detectedAt: '2024-01-20T17:00:00Z',
    lastLocation: {
      coordinates: [77.2411, 28.6562],
      address: 'Red Fort, Netaji Subhash Marg, New Delhi',
      timestamp: '2024-01-20T16:45:00Z',
      accuracy: 8
    },
    confidence: 72,
    riskScore: 45,
    patterns: {
      duration: 15,
      frequency: 1,
      trend: 'stable'
    },
    deviceInfo: {
      connectivity: 'offline',
      lastSeen: '2024-01-20T16:45:00Z'
    },
    behaviorIndicators: {
      silentDuration: 15
    }
  }
];

const mockInvestigationActions: InvestigationAction[] = [
  {
    id: 'ACT-001',
    anomalyId: 'ANM-001',
    actionType: 'contact_attempt',
    description: 'Called tourist mobile number - no response',
    takenBy: 'Inspector Raj Kumar',
    timestamp: '2024-01-20T16:35:00Z',
    outcome: 'No response',
    nextAction: 'Contact emergency contact'
  },
  {
    id: 'ACT-002',
    anomalyId: 'ANM-001',
    actionType: 'emergency_contact',
    description: 'Contacted brother Carlos Garcia - tourist was last seen at India Gate',
    takenBy: 'Inspector Raj Kumar',
    timestamp: '2024-01-20T16:40:00Z',
    outcome: 'Confirmed last location',
    nextAction: 'Field verification'
  },
  {
    id: 'ACT-003',
    anomalyId: 'ANM-002',
    actionType: 'field_dispatch',
    description: 'Emergency response team dispatched to Lotus Temple',
    takenBy: 'Inspector Priya Singh',
    timestamp: '2024-01-20T15:50:00Z',
    outcome: 'Team en route',
    nextAction: 'Location sweep'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EnhancedAnomalyDetection() {
  const [anomalies, setAnomalies] = useState<EnhancedAnomalyDetection[]>(mockEnhancedAnomalies);
  const [actions, setActions] = useState<InvestigationAction[]>(mockInvestigationActions);
  const [selectedAnomaly, setSelectedAnomaly] = useState<EnhancedAnomalyDetection | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [filters, setFilters] = useState<AnomalyFilters>({
    severity: [],
    status: [],
    type: [],
    timeRange: '24h',
    officer: '',
    riskLevel: []
  });
  const [showInvestigationPanel, setShowInvestigationPanel] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = anomalies.length;
    const critical = anomalies.filter(a => a.severity === 'critical').length;
    const active = anomalies.filter(a => a.status === 'active' || a.status === 'investigating').length;
    const highRisk = anomalies.filter(a => a.riskScore > 70).length;
    const avgResponseTime = 12; // Mock data

    return { total, critical, active, highRisk, avgResponseTime };
  }, [anomalies]);

  // Filtered anomalies
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
    }).sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }, [anomalies, filters]);

  // Utility functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getAnomalyTypeIcon = (type: string) => {
    switch (type) {
      case 'prolonged_inactivity': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'silent_distress': return <UserX className="h-5 w-5 text-red-500" />;
      case 'location_dropout': return <MapPin className="h-5 w-5 text-yellow-500" />;
      case 'route_deviation': return <Navigation className="h-5 w-5 text-blue-500" />;
      case 'device_offline': return <WifiOff className="h-5 w-5 text-gray-500" />;
      case 'emergency_pattern': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-purple-500" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const generateEFIR = (anomaly: EnhancedAnomalyDetection) => {
    // This would integrate with the E-FIR generation system
    console.log('Generating E-FIR for anomaly:', anomaly.id);
    // Implementation for E-FIR generation would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enhanced AI Anomaly Detection
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced pattern recognition with behavioral analysis and emergency detection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="gap-2"
          >
            {isAutoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isAutoRefresh ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Critical Anomalies"
          value={stats.critical}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="red"
          subtitle="Immediate attention"
        />
        <StatCard
          title="Active Cases"
          value={stats.active}
          icon={<Activity className="h-6 w-6" />}
          color="orange"
          subtitle="Under investigation"
        />
        <StatCard
          title="High Risk"
          value={stats.highRisk}
          icon={<Shield className="h-6 w-6" />}
          color="yellow"
          subtitle="Risk score > 70"
        />
        <StatCard
          title="Total Detected"
          value={stats.total}
          icon={<Eye className="h-6 w-6" />}
          color="blue"
          subtitle="Last 24 hours"
        />
        <StatCard
          title="Avg Response"
          value={`${stats.avgResponseTime}min`}
          icon={<Clock className="h-6 w-6" />}
          color="green"
          subtitle="Investigation time"
        />
      </div>

      {/* Enhanced Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enhanced Filters:</span>
          </div>
          
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Anomaly Types</option>
            <option value="prolonged_inactivity">Prolonged Inactivity</option>
            <option value="silent_distress">Silent Distress</option>
            <option value="location_dropout">Location Dropout</option>
            <option value="route_deviation">Route Deviation</option>
            <option value="emergency_pattern">Emergency Pattern</option>
            <option value="device_offline">Device Offline</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Officers</option>
            <option value="Inspector Raj Kumar">Inspector Raj Kumar</option>
            <option value="Inspector Priya Singh">Inspector Priya Singh</option>
          </select>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowInvestigationPanel(!showInvestigationPanel)}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Investigation Panel
          </Button>
        </div>
      </Card>

      {/* Enhanced Anomaly Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAnomalies.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Anomalies Detected
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The enhanced AI system is monitoring tourist behavior patterns. No anomalies match your current filters.
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
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-purple-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getAnomalyTypeIcon(anomaly.anomalyType)}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {anomaly.touristName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {anomaly.anomalyType.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        anomaly.severity === 'critical' ? 'destructive' :
                        anomaly.severity === 'high' ? 'warning' :
                        'secondary'
                      }>
                        {anomaly.severity}
                      </Badge>
                      <Badge variant={
                        anomaly.status === 'active' ? 'destructive' :
                        anomaly.status === 'investigating' ? 'warning' :
                        anomaly.status === 'escalated' ? 'destructive' :
                        'success'
                      }>
                        {anomaly.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {anomaly.description}
                  </p>

                  {/* Enhanced Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Risk & Confidence */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risk Assessment</div>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${getRiskScoreColor(anomaly.riskScore)}`}>
                          Risk: {anomaly.riskScore}%
                        </span>
                        <span className="text-sm text-gray-600">
                          Confidence: {anomaly.confidence}%
                        </span>
                      </div>
                    </div>

                    {/* Device Status */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Device Status</div>
                      <div className="flex items-center space-x-2">
                        {anomaly.deviceInfo.connectivity === 'online' ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {anomaly.deviceInfo.connectivity}
                        </span>
                        {anomaly.deviceInfo.batteryLevel && (
                          <div className="flex items-center space-x-1">
                            <BatteryLow className={`h-4 w-4 ${anomaly.deviceInfo.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                            <span className="text-xs">{anomaly.deviceInfo.batteryLevel}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration & Pattern */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pattern Analysis</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {anomaly.patterns.duration}min
                        </span>
                        <div className="flex items-center space-x-1">
                          {anomaly.patterns.trend === 'increasing' ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : anomaly.patterns.trend === 'decreasing' ? (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          ) : (
                            <Activity className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="text-xs capitalize">{anomaly.patterns.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Behavior Indicators */}
                  {anomaly.behaviorIndicators && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Behavior Indicators</div>
                      <div className="flex flex-wrap gap-2">
                        {anomaly.behaviorIndicators.inactivityDuration && (
                          <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            <Clock className="h-3 w-3 mr-1" />
                            Inactive: {anomaly.behaviorIndicators.inactivityDuration}min
                          </span>
                        )}
                        {anomaly.behaviorIndicators.silentDuration && (
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            <PhoneOff className="h-3 w-3 mr-1" />
                            Silent: {anomaly.behaviorIndicators.silentDuration}min
                          </span>
                        )}
                        {anomaly.behaviorIndicators.emergencySignals?.map((signal, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {signal}
                          </span>
                        ))}
                        {anomaly.behaviorIndicators.communicationPatterns && (
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                            anomaly.behaviorIndicators.communicationPatterns === 'ceased' ? 'bg-red-100 text-red-800' :
                            anomaly.behaviorIndicators.communicationPatterns === 'erratic' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Comm: {anomaly.behaviorIndicators.communicationPatterns}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Last Location */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Last Known Location</div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">{anomaly.lastLocation.address}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {new Date(anomaly.lastLocation.timestamp).toLocaleString()} • 
                          Accuracy: {anomaly.lastLocation.accuracy}m
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Investigation Notes */}
                  {anomaly.investigationNotes && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                        Investigation Notes
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        {anomaly.investigationNotes}
                      </div>
                      {anomaly.assignedOfficer && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Assigned to: {anomaly.assignedOfficer}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <MapPin className="h-4 w-4" />
                      Locate
                    </Button>
                    {(anomaly.severity === 'critical' || anomaly.severity === 'high') && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-2"
                        onClick={() => generateEFIR(anomaly)}
                      >
                        <FileText className="h-4 w-4" />
                        Generate E-FIR
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Escalate
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Investigation Panel Sidebar */}
      <AnimatePresence>
        {showInvestigationPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Investigation Actions</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowInvestigationPanel(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {actions.map((action) => (
                <div key={action.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{action.actionType.replace('_', ' ')}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{action.description}</p>
                  <p className="text-xs text-gray-600">By: {action.takenBy}</p>
                  <p className="text-xs text-gray-600">Outcome: {action.outcome}</p>
                  {action.nextAction && (
                    <p className="text-xs text-blue-600 mt-1">Next: {action.nextAction}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green';
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600'
  };

  return (
    <Card className={`p-4 border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-70">{subtitle}</p>
        </div>
        <div className="opacity-60">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default EnhancedAnomalyDetection;