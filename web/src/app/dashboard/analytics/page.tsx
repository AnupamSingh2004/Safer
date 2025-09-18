/**
 * North East India Tourism Safety Analytics Dashboard
 * Role-based analytics with comprehensive tourism safety insights
 * 
 * ACCESS LEVELS:
 * - Super Admin: Full access to all analytics, cross-state data, system metrics
 * - State Admin: State-specific data, district analytics, performance metrics  
 * - District Admin: District-level data, operator analytics, local insights
 * - Operator: Limited to assigned zones, tourist interactions, safety reports
 * - Viewer: Read-only access to basic statistics and public reports
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  AlertTriangle,
  Activity,
  FileText,
  TrendingUp,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Calendar,
  Target,
  Shield,
  MapPin,
  Clock,
  Database,
  Zap,
  CheckCircle,
  Mountain,
  TreePine,
  Camera,
  Compass,
  Crown,
  Lock,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/auth-store';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type AnalyticsTab = 'overview' | 'tourists' | 'safety' | 'performance' | 'reports' | 'heritage' | 'trekking';
type UserRole = 'super_admin' | 'state_admin' | 'district_admin' | 'operator' | 'viewer';

interface AnalyticsAccess {
  canViewOverview: boolean;
  canViewTourists: boolean;
  canViewSafety: boolean;
  canViewPerformance: boolean;
  canViewReports: boolean;
  canViewHeritage: boolean;
  canViewTrekking: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
  dataScope: 'all_states' | 'single_state' | 'district' | 'zone' | 'read_only';
}

interface NEIndiaAnalytics {
  totalTourists: number;
  activeTourists: number;
  safetyIncidents: number;
  systemUptime: number;
  responseTime: number;
  satisfaction: number;
  reportsGenerated: number;
  dataProcessed: string;
  trekkingRoutes: number;
  heritageSites: number;
  tribalCommunities: number;
  borderCrossings: number;
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

const getAnalyticsAccess = (role: UserRole): AnalyticsAccess => {
  switch (role) {
    case 'super_admin':
      return {
        canViewOverview: true,
        canViewTourists: true,
        canViewSafety: true,
        canViewPerformance: true,
        canViewReports: true,
        canViewHeritage: true,
        canViewTrekking: true,
        canExportData: true,
        canManageSettings: true,
        dataScope: 'all_states'
      };
    case 'state_admin':
      return {
        canViewOverview: true,
        canViewTourists: true,
        canViewSafety: true,
        canViewPerformance: true,
        canViewReports: true,
        canViewHeritage: true,
        canViewTrekking: true,
        canExportData: true,
        canManageSettings: false,
        dataScope: 'single_state'
      };
    case 'district_admin':
      return {
        canViewOverview: true,
        canViewTourists: true,
        canViewSafety: true,
        canViewPerformance: false,
        canViewReports: true,
        canViewHeritage: true,
        canViewTrekking: true,
        canExportData: false,
        canManageSettings: false,
        dataScope: 'district'
      };
    case 'operator':
      return {
        canViewOverview: true,
        canViewTourists: true,
        canViewSafety: true,
        canViewPerformance: false,
        canViewReports: false,
        canViewHeritage: false,
        canViewTrekking: true,
        canExportData: false,
        canManageSettings: false,
        dataScope: 'zone'
      };
    case 'viewer':
      return {
        canViewOverview: true,
        canViewTourists: false,
        canViewSafety: false,
        canViewPerformance: false,
        canViewReports: false,
        canViewHeritage: true,
        canViewTrekking: false,
        canExportData: false,
        canManageSettings: false,
        dataScope: 'read_only'
      };
    default:
      return {
        canViewOverview: false,
        canViewTourists: false,
        canViewSafety: false,
        canViewPerformance: false,
        canViewReports: false,
        canViewHeritage: false,
        canViewTrekking: false,
        canExportData: false,
        canManageSettings: false,
        dataScope: 'read_only'
      };
  }
};

// ============================================================================
// NORTH EAST INDIA SPECIFIC DATA
// ============================================================================

const NE_INDIA_OVERVIEW: NEIndiaAnalytics = {
  totalTourists: 18647,
  activeTourists: 4321,
  safetyIncidents: 23,
  systemUptime: 99.7,
  responseTime: 180,
  satisfaction: 4.7,
  reportsGenerated: 156,
  dataProcessed: '3.2 TB',
  trekkingRoutes: 145,
  heritageSites: 89,
  tribalCommunities: 67,
  borderCrossings: 12
};

const ANALYTICS_TABS = [
  {
    id: 'overview' as AnalyticsTab,
    label: 'Overview',
    icon: BarChart3,
    description: 'North East India tourism safety overview',
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    roles: ['super_admin', 'state_admin', 'district_admin', 'operator', 'viewer']
  },
  {
    id: 'tourists' as AnalyticsTab,
    label: 'Tourist Analytics',
    icon: Users,
    description: 'Tourist behavior across 8 NE states',
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
    roles: ['super_admin', 'state_admin', 'district_admin', 'operator']
  },
  {
    id: 'safety' as AnalyticsTab,
    label: 'Safety Incidents',
    icon: AlertTriangle,
    description: 'Cross-border and trekking safety monitoring',
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
    roles: ['super_admin', 'state_admin', 'district_admin', 'operator']
  },
  {
    id: 'trekking' as AnalyticsTab,
    label: 'Trekking Routes',
    icon: Mountain,
    description: 'High-altitude trekking safety analytics',
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    roles: ['super_admin', 'state_admin', 'district_admin', 'operator']
  },
  {
    id: 'heritage' as AnalyticsTab,
    label: 'Heritage Sites',
    icon: Camera,
    description: 'Cultural heritage site monitoring',
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    roles: ['super_admin', 'state_admin', 'district_admin', 'viewer']
  },
  {
    id: 'performance' as AnalyticsTab,
    label: 'System Performance',
    icon: Activity,
    description: 'Cross-state system health metrics',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
    roles: ['super_admin', 'state_admin']
  },
  {
    id: 'reports' as AnalyticsTab,
    label: 'Government Reports',
    icon: FileText,
    description: 'Official state and central government reports',
    color: 'text-teal-600',
    bg: 'bg-teal-100 dark:bg-teal-900/20',
    roles: ['super_admin', 'state_admin', 'district_admin']
  },
];

const NE_OVERVIEW_METRICS = [
  {
    title: 'Total Tourists',
    value: '24,832',
    change: '+18.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    description: 'Across 8 NE states (Jan 2025)',
    subtext: 'Peak winter trekking season'
  },
  {
    title: 'Digital IDs Issued',
    value: '23,547',
    change: '+24.3%',
    trend: 'up',
    icon: Shield,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    description: 'Blockchain verified tourists',
    subtext: '94.8% adoption rate'
  },
  {
    title: 'Active Trekkers',
    value: '6,421',
    change: '+32.1%',
    trend: 'up',
    icon: Mountain,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    description: 'High-altitude routes',
    subtext: 'Tawang, Dzukou Valley peaks'
  },
  {
    title: 'Safety Incidents',
    value: '12',
    change: '-52.3%',
    trend: 'down',
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20',
    description: 'This month (excellent)',
    subtext: 'AI prevention working'
  },
  {
    title: 'Heritage Visits',
    value: '15,789',
    change: '+22.4%',
    trend: 'up',
    icon: Camera,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    description: 'Cultural sites',
    subtext: 'Majuli, Kaziranga trending'
  },
  {
    title: 'Avg Response Time',
    value: '2.1min',
    change: '-35.7%',
    trend: 'down',
    icon: Clock,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    description: 'Emergency response',
    subtext: 'GPS + panic button system'
  },
  {
    title: 'Tourist Satisfaction',
    value: '4.8/5',
    change: '+8.9%',
    trend: 'up',
    icon: Target,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-900/20',
    description: 'Overall experience rating',
    subtext: '18,234 feedback responses'
  },
  {
    title: 'Geo-fence Alerts',
    value: '147',
    change: '+12.6%',
    trend: 'up',
    icon: MapPin,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
    description: 'Border & restricted zones',
    subtext: '96% appropriate warnings'
  },
];

const NE_RECENT_INSIGHTS = [
  {
    id: 'insight-001',
    type: 'ai_detection',
    title: 'AI Anomaly Detection Success',
    description: 'AI system detected 3 lost trekkers in Dzukou Valley within 15 minutes using GPS deviation patterns. All tourists safely rescued.',
    timestamp: '2 hours ago',
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    location: 'Nagaland-Manipur Border',
    priority: 'high'
  },
  {
    id: 'insight-002',
    type: 'blockchain_verification',
    title: 'Digital ID Verification Milestone',
    description: 'Crossed 25,000 blockchain-verified digital tourist IDs. Moreh and Dawki border checkpoints leading adoption.',
    timestamp: '4 hours ago',
    icon: Shield,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    location: 'Border Entry Points',
    priority: 'medium'
  },
  {
    id: 'insight-003',
    type: 'geo_fencing',
    title: 'Restricted Zone Alert System',
    description: 'Geo-fencing prevented 23 tourists from entering restricted tribal areas near Myanmar border. Automatic rerouting successful.',
    timestamp: '6 hours ago',
    icon: MapPin,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    location: 'Arunachal Pradesh',
    priority: 'high'
  },
  {
    id: 'insight-004',
    type: 'heritage_tourism',
    title: 'Majuli Cultural Exchange Peak',
    description: 'River island heritage tours reached record 890 visitors today. Living root bridge tours in Meghalaya also trending.',
    timestamp: '8 hours ago',
    icon: Camera,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    location: 'Assam & Meghalaya',
    priority: 'low'
  },
  {
    id: 'insight-005',
    type: 'emergency_response',
    title: 'Rapid Response Team Deployment',
    description: 'Emergency team dispatched to Tawang monastery area for altitude sickness case. Helicopter rescue completed in 28 minutes.',
    timestamp: '12 hours ago',
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20',
    location: 'Arunachal Pradesh',
    priority: 'high'
  },
  {
    id: 'insight-006',
    type: 'trekking_safety',
    title: 'Winter Trekking Season Analytics',
    description: 'Increased safety protocols for Sandakphu and Goecha La treks. Weather monitoring and gear verification mandatory.',
    timestamp: '1 day ago',
    icon: Mountain,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    location: 'Sikkim Border',
    priority: 'medium'
  },
];

const NE_QUICK_STATS = [
  { label: 'Active Trekking Routes', value: '156', icon: Mountain, desc: 'High-altitude monitored paths', detail: 'Dzukou, Sandakphu, Goecha La' },
  { label: 'Digital ID Centers', value: '47', icon: Shield, desc: 'Blockchain verification points', detail: 'Airports, borders, hotels' },
  { label: 'Heritage Sites Protected', value: '89', icon: Camera, desc: 'UNESCO & cultural landmarks', detail: 'Majuli, Kaziranga, monasteries' },
  { label: 'Tribal Communities', value: '73', icon: Users, desc: 'Partner indigenous groups', detail: 'Apatani, Khasi, Naga tribes' },
  { label: 'Border Entry Points', value: '18', icon: Compass, desc: 'International crossing gates', detail: 'Moreh, Dawki, Nathula' },
  { label: 'Emergency Response Units', value: '34', icon: AlertTriangle, desc: 'Rapid deployment teams', detail: 'Helicopter & ground rescue' },
  { label: 'AI Detection Systems', value: '125', icon: Zap, desc: 'Smart monitoring nodes', detail: 'GPS, behavior, anomaly detection' },
  { label: 'Geo-fence Zones', value: '267', icon: MapPin, desc: 'Smart boundary alerts', detail: 'Restricted, sensitive, safe areas' },
  { label: 'Success Rate', value: '98.2%', icon: CheckCircle, desc: 'Incident prevention/resolution', detail: 'All emergency responses' },
  { label: 'Multilingual Support', value: '12', icon: Activity, desc: 'Regional languages + English', detail: 'Voice + text emergency access' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function AnalyticsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState(NE_INDIA_OVERVIEW);
  const [insights, setInsights] = useState(NE_RECENT_INSIGHTS);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  // Get user role and access permissions
  const userRole = (user?.role as UserRole) || 'viewer';
  const access = getAnalyticsAccess(userRole);
  
  // Filter tabs based on user permissions
  const availableTabs = ANALYTICS_TABS.filter(tab => 
    tab.roles.includes(userRole) && 
    access[`canView${tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}` as keyof AnalyticsAccess]
  );

  // Auto-set first available tab if current tab is not accessible
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(tab => tab.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  // Real-time data simulation
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeTourists: prev.activeTourists + Math.floor(Math.random() * 10 - 5),
        safetyIncidents: Math.max(0, prev.safetyIncidents + Math.floor(Math.random() * 3 - 1)),
        systemUptime: Math.min(100, prev.systemUptime + (Math.random() * 0.1 - 0.05)),
        responseTime: Math.max(60, prev.responseTime + Math.floor(Math.random() * 20 - 10))
      }));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Add new insights periodically
  useEffect(() => {
    const insightInterval = setInterval(() => {
      const newInsights = [
        {
          id: `insight-${Date.now()}`,
          type: 'ai_detection',
          title: 'New Tourist Assistance',
          description: 'AI detected tourist requiring assistance near Tawang Monastery. Local guide dispatched.',
          timestamp: 'Just now',
          icon: Zap,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          location: 'Arunachal Pradesh',
          priority: 'medium'
        },
        {
          id: `insight-${Date.now() + 1}`,
          type: 'heritage_tourism',
          title: 'Popular Heritage Site',
          description: 'Majuli river island experiencing high visitor traffic. Additional safety measures activated.',
          timestamp: '2 minutes ago',
          icon: Camera,
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-100 dark:bg-purple-900/20',
          location: 'Assam',
          priority: 'low'
        }
      ];
      
      setInsights(prev => [newInsights[Math.floor(Math.random() * newInsights.length)], ...prev.slice(0, 5)]);
    }, 15000); // Add new insight every 15 seconds

    return () => clearInterval(insightInterval);
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Get trend info
  const getTrendInfo = (trend: 'up' | 'down') => {
    return trend === 'up' 
      ? { icon: TrendingUp, color: 'text-green-600 dark:text-green-400' }
      : { icon: TrendingUp, color: 'text-red-600 dark:text-red-400', rotation: 'rotate-180' };
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRealTimeData(prev => ({
      ...prev,
      totalTourists: prev.totalTourists + Math.floor(Math.random() * 100),
      activeTourists: prev.activeTourists + Math.floor(Math.random() * 50),
      satisfaction: Math.min(5.0, prev.satisfaction + (Math.random() * 0.2 - 0.1))
    }));
    setLastUpdate(new Date());
    setRefreshing(false);
  };

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    // Simulate data refresh for new time range
    setRealTimeData(prev => ({
      ...prev,
      totalTourists: range === '7d' ? prev.totalTourists * 7 : 
                    range === '30d' ? prev.totalTourists * 30 : prev.totalTourists
    }));
  };

  // Handle region filter
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    // Filter data based on region
    const regionMultiplier = region === 'all' ? 1 : 
                           region === 'arunachal' ? 0.3 :
                           region === 'assam' ? 0.4 : 0.2;
    setRealTimeData(prev => ({
      ...prev,
      activeTourists: Math.floor(prev.activeTourists * regionMultiplier)
    }));
  };

  // Get data scope message
  const getDataScopeMessage = () => {
    switch (access.dataScope) {
      case 'all_states': return 'All 8 North East States';
      case 'single_state': return `State Data`;
      case 'district': return `District Data`;
      case 'zone': return `Zone Data`;
      case 'read_only': return 'Public Data Only';
      default: return 'Limited Access';
    }
  };

  // Render overview tab content
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {NE_OVERVIEW_METRICS.map((metric) => {
          const Icon = metric.icon;
          const trendInfo = getTrendInfo(metric.trend as 'up' | 'down');
          const TrendIcon = trendInfo.icon;
          
          return (
            <div key={metric.title} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform', metric.bg)}>
                  <Icon className={cn('h-5 w-5', metric.color)} />
                </div>
                <div className={cn('flex items-center text-xs font-semibold px-2 py-1 rounded-full', 
                  trendInfo.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300')}>
                  <TrendIcon className={cn('h-3 w-3 mr-1', trendInfo.rotation)} />
                  {metric.change}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {metric.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {metric.description}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 italic">
                  {metric.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="dashboard-card">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          Northeast India Tourism Infrastructure
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {NE_QUICK_STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors border border-gray-200 dark:border-gray-600 group">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                  {stat.desc}
                </div>
                <div className="text-xs text-primary font-medium opacity-75">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Insights */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Real-time AI & System Insights
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live monitoring active
          </div>
        </div>
        
        <div className="grid gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const getPriorityColor = (priority: string) => {
              switch (priority) {
                case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
                case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
                case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
                default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
              }
            };
            
            return (
              <div key={insight.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                <div className={cn('p-2 rounded-lg shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform', insight.bg)}>
                  <Icon className={cn('h-5 w-5', insight.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={cn('text-xs font-medium px-2 py-1 rounded-full border', getPriorityColor(insight.priority || 'low'))}>
                        {insight.priority || 'low'} priority
                      </span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                        {insight.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {insight.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container component-stack-lg">
      {/* Page Header */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              Analytics Dashboard
              <div className="flex items-center gap-2 ml-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
              </div>
            </h1>
            <p className="text-base text-muted-foreground">
              Comprehensive analytics and insights for the tourist safety system • Data scope: {getDataScopeMessage()}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select 
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Region Filter */}
            <select 
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All States</option>
              <option value="arunachal">Arunachal Pradesh</option>
              <option value="assam">Assam</option>
              <option value="meghalaya">Meghalaya</option>
              <option value="sikkim">Sikkim</option>
            </select>
            
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="text-base font-semibold text-foreground">
                {lastUpdate.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
            
            <div className="h-12 w-px bg-border" />

            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                  : 'bg-background text-muted-foreground border-border hover:bg-muted/50'
              }`}
            >
              <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
              Auto-refresh
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl border border-border transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
              Refresh
            </button>
            
            {access.canExportData && (
              <button className="flex items-center gap-2 px-6 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            
            {access.canManageSettings && (
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-2" aria-label="Analytics tabs">
            {ANALYTICS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-3 border-b-3 font-semibold text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  )}
                >
                  <div className={cn('p-2 rounded-lg mr-3', isActive ? tab.bg : 'bg-muted/50')}>
                    <Icon className={cn('w-5 h-5', isActive ? tab.color : 'text-muted-foreground')} />
                  </div>
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs opacity-75 font-normal">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {renderOverview()}
              </div>
            )}          {activeTab === 'tourists' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Tourist Behavior Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis of tourist movement patterns, safety scores, and preferences across Northeast India
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tourists..."
                      className="pl-10 pr-4 py-2 w-48 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <select className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>All Activities</option>
                    <option>Trekking</option>
                    <option>Wildlife Safari</option>
                    <option>Heritage Tours</option>
                    <option>Adventure Sports</option>
                  </select>
                </div>
              </div>
              
              {/* Tourist Flow Map */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Live Tourist Distribution
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">6,421</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Active in Arunachal Pradesh</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Tawang, Ziro Valley hotspots</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">4,832</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Active in Assam</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Kaziranga, Majuli trending</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">3,156</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Active in Meghalaya</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Shillong, Cherrapunji peaks</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">2,234</div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Active in Sikkim</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Gangtok, Nathula corridor</div>
                    </div>
                  </div>
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm italic">
                    Real-time GPS tracking with 5-minute refresh intervals
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Safety Score Distribution</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">High (8.0-10.0)</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">18,234</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '73%'}}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Medium (5.0-7.9)</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">5,432</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '22%'}}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Low (0-4.9)</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">1,166</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '5%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Popular Activities</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">High-altitude Trekking</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">38%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Wildlife Safari</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">24%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Cultural Heritage</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">19%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Adventure Sports</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Border Tourism</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">7%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Safety Incident Analytics & Prevention
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered anomaly detection, emergency response monitoring, and predictive safety analysis
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-200 dark:bg-green-700 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-300" />
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">98.2%</div>
                  </div>
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200">Prevention Success Rate</div>
                  <div className="text-xs text-green-600 dark:text-green-400">AI anomaly detection</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-200 dark:bg-blue-700 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">1.8min</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">Avg Response Time</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Emergency deployment</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-200 dark:bg-red-700 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-700 dark:text-red-300" />
                    </div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">12</div>
                  </div>
                  <div className="text-sm font-semibold text-red-800 dark:text-red-200">Active Incidents</div>
                  <div className="text-xs text-red-600 dark:text-red-400">This month</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-200 dark:bg-purple-700 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                    </div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">34</div>
                  </div>
                  <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">Rescue Units</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Active deployment</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    Recent Safety Incidents
                  </h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-400 dark:border-yellow-600 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Altitude Sickness - Tawang</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Tourist: Sarah Chen | 2.1 min response | Resolved</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">4 hours ago</div>
                    </div>
                    <div className="border-l-4 border-green-400 dark:border-green-600 pl-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Lost Trekker - Dzukou Valley</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Tourist: Mike Kumar | AI detected | Found safe</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">8 hours ago</div>
                    </div>
                    <div className="border-l-4 border-blue-400 dark:border-blue-600 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Equipment Failure - Sandakphu</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Tourist: Lisa Wong | Panic button | Assisted</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">12 hours ago</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    High-Risk Zone Alerts
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div>
                        <div className="text-sm font-semibold text-red-800 dark:text-red-200">Myanmar Border Area</div>
                        <div className="text-xs text-red-600 dark:text-red-400">23 geo-fence alerts triggered</div>
                      </div>
                      <div className="text-lg font-bold text-red-700 dark:text-red-300">HIGH</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div>
                        <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Nathula Pass Weather</div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">Sudden weather change warning</div>
                      </div>
                      <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">MED</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div>
                        <div className="text-sm font-semibold text-orange-800 dark:text-orange-200">Cherrapunji Landslide</div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">Route diversion activated</div>
                      </div>
                      <div className="text-lg font-bold text-orange-700 dark:text-orange-300">MED</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  System Performance Analytics
                </h3>
                <p className="text-lg text-muted-foreground">
                  Monitor system health, performance metrics, and service availability
                </p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance Analytics</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    System performance metrics and operational efficiency for NE India tourism.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Custom Reports
                </h3>
                <p className="text-lg text-muted-foreground">
                  Create, schedule, and manage custom analytics reports for various stakeholders
                </p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Custom Reports</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate and customize detailed reports for North East India tourism insights.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
