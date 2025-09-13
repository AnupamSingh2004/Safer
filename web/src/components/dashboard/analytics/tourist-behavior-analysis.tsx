/**
 * Smart Tourist Safety System - Tourist Behavior Analysis
 * Advanced AI analysis for movement patterns, route deviations, and behavioral insights
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  Route,
  Clock,
  Camera,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Compass,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Map,
  Timer,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiService, type BehaviorPattern } from '@/services/ai-service';
import { formatDate, formatDateTime } from '@/lib/utils';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface TouristBehaviorAnalysisProps {
  className?: string;
  showFilters?: boolean;
  autoRefresh?: boolean;
  onPatternSelect?: (pattern: BehaviorPattern) => void;
}

interface BehaviorFilters {
  patternType: string[];
  riskLevel: string[];
  trendDirection: string[];
  touristId?: string;
}

interface BehaviorInsight {
  id: string;
  category: 'movement' | 'social' | 'risk' | 'preference' | 'temporal';
  title: string;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  confidence: number;
  dataPoints: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TouristBehaviorAnalysis({
  className = '',
  showFilters = true,
  autoRefresh = true,
  onPatternSelect
}: TouristBehaviorAnalysisProps) {
  // State Management
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [insights, setInsights] = useState<BehaviorInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<BehaviorPattern | null>(null);
  const [filters, setFilters] = useState<BehaviorFilters>({
    patternType: [],
    riskLevel: [],
    trendDirection: [],
    touristId: undefined
  });
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'patterns' | 'insights'>('patterns');

  // Mock insights data
  const mockInsights: BehaviorInsight[] = [
    {
      id: 'insight-1',
      category: 'movement',
      title: 'Adventure-Seeking Behavior Trend',
      description: '68% of tourists show increased adventure-seeking patterns, with 23% deviation from safe routes',
      impact: 'negative',
      confidence: 87,
      dataPoints: 1247
    },
    {
      id: 'insight-2',
      category: 'temporal',
      title: 'Peak Activity Hours Shift',
      description: 'Tourist activity peaks have shifted 2 hours earlier, indicating adaptation to local climate',
      impact: 'positive',
      confidence: 92,
      dataPoints: 2156
    },
    {
      id: 'insight-3',
      category: 'social',
      title: 'Group vs Solo Behavior',
      description: 'Solo travelers show 45% higher risk scores but better emergency response compliance',
      impact: 'neutral',
      confidence: 78,
      dataPoints: 892
    },
    {
      id: 'insight-4',
      category: 'preference',
      title: 'Route Preference Analysis',
      description: 'Scenic routes preferred by 82% of tourists despite longer duration and higher risk',
      impact: 'neutral',
      confidence: 94,
      dataPoints: 1683
    }
  ];

  // Load patterns and insights
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [patternsData] = await Promise.all([
        aiService.getBehaviorPatterns(filters.touristId),
      ]);
      setPatterns(patternsData);
      setInsights(mockInsights);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load behavior analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [filters, autoRefresh]);

  // Filtered patterns
  const filteredPatterns = useMemo(() => {
    return patterns.filter(pattern => {
      if (filters.patternType.length > 0 && !filters.patternType.includes(pattern.patternType)) {
        return false;
      }
      if (filters.riskLevel.length > 0) {
        const riskLevel = pattern.riskScore >= 70 ? 'high' : pattern.riskScore >= 40 ? 'medium' : 'low';
        if (!filters.riskLevel.includes(riskLevel)) {
          return false;
        }
      }
      if (filters.trendDirection.length > 0 && !filters.trendDirection.includes(pattern.trendDirection)) {
        return false;
      }
      return true;
    }).sort((a, b) => b.confidence - a.confidence);
  }, [patterns, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredPatterns.length;
    const highRisk = filteredPatterns.filter(p => p.riskScore >= 70).length;
    const increasing = filteredPatterns.filter(p => p.trendDirection === 'increasing').length;
    const highConfidence = filteredPatterns.filter(p => p.confidence >= 80).length;
    const avgRiskScore = filteredPatterns.reduce((sum, p) => sum + p.riskScore, 0) / total || 0;

    return { total, highRisk, increasing, highConfidence, avgRiskScore };
  }, [filteredPatterns]);

  // Utility functions
  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'route_preference': return <Route className="w-5 h-5" />;
      case 'time_pattern': return <Clock className="w-5 h-5" />;
      case 'location_preference': return <MapPin className="w-5 h-5" />;
      case 'social_behavior': return <Users className="w-5 h-5" />;
      case 'risk_behavior': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'route_preference': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'time_pattern': return 'bg-green-100 text-green-700 border-green-300';
      case 'location_preference': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'social_behavior': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'risk_behavior': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return 'text-red-600';
    if (riskScore >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'movement': return <Route className="w-5 h-5" />;
      case 'social': return <Users className="w-5 h-5" />;
      case 'risk': return <Shield className="w-5 h-5" />;
      case 'preference': return <Heart className="w-5 h-5" />;
      case 'temporal': return <Clock className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tourist Behavior Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered insights into movement patterns and behavioral trends
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
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
                <p className="text-sm font-medium text-red-600 dark:text-red-400">High Risk Patterns</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.highRisk}</p>
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
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Increasing Trends</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.increasing}</p>
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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">High Confidence</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.highConfidence}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
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
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg Risk Score</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.avgRiskScore.toFixed(1)}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('patterns')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'patterns'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Behavior Patterns
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'insights'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4 inline mr-2" />
          AI Insights
        </button>
      </div>

      {/* Filters */}
      {showFilters && activeTab === 'patterns' && (
        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Pattern Types</option>
              <option value="route_preference">Route Preference</option>
              <option value="time_pattern">Time Pattern</option>
              <option value="location_preference">Location Preference</option>
              <option value="social_behavior">Social Behavior</option>
              <option value="risk_behavior">Risk Behavior</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Risk Levels</option>
              <option value="high">High Risk (70+)</option>
              <option value="medium">Medium Risk (40-69)</option>
              <option value="low">Low Risk (below 40)</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Trends</option>
              <option value="increasing">Increasing</option>
              <option value="stable">Stable</option>
              <option value="decreasing">Decreasing</option>
            </select>

            <div className="text-xs text-gray-500">
              Last updated: {formatDateTime(lastUpdate)}
            </div>
          </div>
        </Card>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'patterns' ? (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-500">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing behavior patterns...</span>
                </div>
              </div>
            ) : filteredPatterns.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Behavior Patterns Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No tourist behavior patterns match your current filters.
                </p>
              </Card>
            ) : (
              filteredPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.touristId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-green-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Pattern Type Icon */}
                        <div className={`p-2 rounded-lg flex-shrink-0 ${getPatternTypeColor(pattern.patternType)}`}>
                          {getPatternTypeIcon(pattern.patternType)}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {pattern.touristName}
                            </h3>
                            <Badge variant="outline" className="gap-1">
                              <User className="w-3 h-3" />
                              {pattern.patternType.replace('_', ' ')}
                            </Badge>
                            <span className={`text-sm font-semibold ${getRiskColor(pattern.riskScore)}`}>
                              Risk: {pattern.riskScore}/100
                            </span>
                            {getTrendIcon(pattern.trendDirection)}
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {pattern.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              <span>Frequency: {pattern.frequency}/10</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span>Confidence: {pattern.confidence}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Last seen: {formatDate(pattern.lastSeen)}</span>
                            </div>
                          </div>

                          {/* Risk Score Progress */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-500">Risk Assessment</span>
                              <span className={`font-medium ${getRiskColor(pattern.riskScore)}`}>
                                {pattern.riskScore}/100
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  pattern.riskScore >= 70 ? 'bg-red-500' : 
                                  pattern.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${pattern.riskScore}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedCards.has(pattern.touristId) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                              >
                                {/* Insights */}
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Behavioral Insights
                                  </h4>
                                  <div className="space-y-2">
                                    {pattern.insights.map((insight, idx) => (
                                      <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">
                                          {insight}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Recommendations */}
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Safety Recommendations
                                  </h4>
                                  <div className="space-y-2">
                                    {pattern.recommendations.map((rec, idx) => (
                                      <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-green-700 dark:text-green-300">
                                          {rec}
                                        </span>
                                      </div>
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
                          onClick={() => toggleCardExpansion(pattern.touristId)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedCards.has(pattern.touristId) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPattern(pattern);
                            onPatternSelect?.(pattern);
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex-shrink-0">
                      {getInsightIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {insight.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                          <span className={`text-sm font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{insight.confidence}% confidence</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{insight.dataPoints.toLocaleString()} data points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-16 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Behavior Analysis Active
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default TouristBehaviorAnalysis;