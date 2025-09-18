import 'package:flutter/material.dart';
import '../services/analytics_service.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({Key? key}) : super(key: key);

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> with TickerProviderStateMixin {
  Map<String, dynamic> _analytics = {};
  bool _isLoading = true;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadAnalytics();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadAnalytics() async {
    try {
      final analytics = await AnalyticsService.getAnalytics();
      setState(() {
        _analytics = analytics;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const ThemeAwareText.heading('📊 Analytics Dashboard'),
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: _refreshAnalytics,
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh data',
          ),
          IconButton(
            onPressed: _exportData,
            icon: const Icon(Icons.download),
            tooltip: 'Export data',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          isScrollable: false,
          tabAlignment: TabAlignment.fill,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
            Tab(icon: Icon(Icons.security), text: 'Emergency'),
            Tab(icon: Icon(Icons.location_on), text: 'Location'),
            Tab(icon: Icon(Icons.people), text: 'Community'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildOverviewTab(),
                _buildEmergencyTab(),
                _buildLocationTab(),
                _buildCommunityTab(),
              ],
            ),
    );
  }

  Widget _buildOverviewTab() {
    return RefreshIndicator(
      onRefresh: _loadAnalytics,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Key Metrics Cards
            _buildMetricsGrid(),
            const SizedBox(height: 20),
            
            // Recent Activity Chart
            _buildChartCard('📈 Activity Trends', _buildActivityChart()),
            const SizedBox(height: 20),
            
            // Quick Stats
            _buildQuickStats(),
          ],
        ),
      ),
    );
  }

  Widget _buildEmergencyTab() {
    final emergencyData = _analytics['emergency'] as Map<String, dynamic>? ?? {};
    
    return RefreshIndicator(
      onRefresh: _loadAnalytics,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Emergency Response Stats
            _buildEmergencyMetrics(emergencyData),
            const SizedBox(height: 20),
            
            // Response Time Chart
            _buildChartCard('⏱️ Response Times', _buildResponseTimeChart()),
            const SizedBox(height: 20),
            
            // Incident Types
            _buildChartCard('🚨 Incident Types', _buildIncidentTypesChart()),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationTab() {
    final locationData = _analytics['location'] as Map<String, dynamic>? ?? {};
    
    return RefreshIndicator(
      onRefresh: _loadAnalytics,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Location Stats
            _buildLocationMetrics(locationData),
            const SizedBox(height: 20),
            
            // Hotspots Map
            _buildChartCard('🗺️ Activity Hotspots', _buildHotspotsMap()),
            const SizedBox(height: 20),
            
            // Movement Patterns
            _buildChartCard('🚶 Movement Patterns', _buildMovementChart()),
          ],
        ),
      ),
    );
  }

  Widget _buildCommunityTab() {
    final communityData = _analytics['community'] as Map<String, dynamic>? ?? {};
    
    return RefreshIndicator(
      onRefresh: _loadAnalytics,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Community Stats
            _buildCommunityMetrics(communityData),
            const SizedBox(height: 20),
            
            // User Engagement
            _buildChartCard('👥 User Engagement', _buildEngagementChart()),
            const SizedBox(height: 20),
            
            // Trust Network
            _buildChartCard('🤝 Trust Network', _buildTrustNetworkChart()),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricsGrid() {
    final metrics = [
      {
        'title': 'Total Users',
        'value': _analytics['totalUsers']?.toString() ?? '0',
        'icon': Icons.people,
        'color': EmergencyColorPalette.primary[500]!,
        'change': '+12%',
      },
      {
        'title': 'Active Incidents',
        'value': _analytics['activeIncidents']?.toString() ?? '0',
        'icon': Icons.warning,
        'color': EmergencyColorPalette.warning[500]!,
        'change': '-5%',
      },
      {
        'title': 'Response Time',
        'value': '${_analytics['avgResponseTime'] ?? 0}min',
        'icon': Icons.timer,
        'color': Colors.green,
        'change': '-15%',
      },
      {
        'title': 'Trust Score',
        'value': '${_analytics['avgTrustScore'] ?? 0}/100',
        'icon': Icons.verified,
        'color': EmergencyColorPalette.info[500]!,
        'change': '+8%',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.5,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: metrics.length,
      itemBuilder: (context, index) {
        final metric = metrics[index];
        return _buildMetricCard(metric);
      },
    );
  }

  Widget _buildMetricCard(Map<String, dynamic> metric) {
    final theme = Theme.of(context);
    
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(
                  metric['icon'],
                  color: metric['color'],
                  size: 24,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: metric['change'].startsWith('+') 
                        ? Colors.green.withOpacity(0.1)
                        : Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    metric['change'],
                    style: TextStyle(
                      color: metric['change'].startsWith('+') 
                          ? Colors.green
                          : Colors.red,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const Spacer(),
            Text(
              metric['value'],
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              metric['title'],
              style: TextStyle(
                color: theme.colorScheme.onSurface.withOpacity(0.6),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChartCard(String title, Widget chart) {
    final theme = Theme.of(context);
    
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ThemeAwareText.subheading(title),
            const SizedBox(height: 16),
            chart,
          ],
        ),
      ),
    );
  }

  Widget _buildActivityChart() {
    final theme = Theme.of(context);
    return Container(
      height: 200,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.show_chart, size: 48, color: theme.colorScheme.onSurface.withOpacity(0.6)),
            const SizedBox(height: 8),
            Text('Activity Chart', style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
            Text('(Chart library integration needed)', 
                 style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.4), fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildResponseTimeChart() {
    final theme = Theme.of(context);
    return Container(
      height: 200,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.timeline, size: 48, color: theme.colorScheme.onSurface.withOpacity(0.6)),
            const SizedBox(height: 8),
            Text('Response Time Trends', style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
            Text('Avg: 3.2 minutes', style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface)),
          ],
        ),
      ),
    );
  }

  Widget _buildIncidentTypesChart() {
    final theme = Theme.of(context);
    return Container(
      height: 200,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.pie_chart, size: 48, color: theme.colorScheme.onSurface.withOpacity(0.6)),
            const SizedBox(height: 8),
            Text('Incident Distribution', style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
            Text('Medical: 40% | Lost: 30% | Theft: 20% | Other: 10%', 
                 style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurface.withOpacity(0.7))),
          ],
        ),
      ),
    );
  }

  Widget _buildHotspotsMap() {
    return Container(
      height: 200,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.map, size: 48, color: Colors.grey),
            SizedBox(height: 8),
            Text('Activity Hotspots Map', style: TextStyle(color: Colors.grey)),
            Text('Top locations: Times Square, Central Park, Brooklyn Bridge', 
                 style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildMovementChart() {
    return Container(
      height: 200,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.trending_up, size: 48, color: Colors.grey),
            SizedBox(height: 8),
            Text('Movement Patterns', style: TextStyle(color: Colors.grey)),
            Text('Peak hours: 10AM-2PM, 6PM-9PM', 
                 style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildEngagementChart() {
    return Container(
      height: 200,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.groups, size: 48, color: Colors.grey),
            SizedBox(height: 8),
            Text('User Engagement', style: TextStyle(color: Colors.grey)),
            Text('Daily active: 85% | Weekly: 92% | Monthly: 98%', 
                 style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustNetworkChart() {
    return Container(
      height: 200,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.account_tree, size: 48, color: Colors.grey),
            SizedBox(height: 8),
            Text('Trust Network Analysis', style: TextStyle(color: Colors.grey)),
            Text('Network density: 78% | Avg connections: 12', 
                 style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ThemeAwareText.subheading('📋 Quick Stats'),
        const SizedBox(height: 12),
        _buildStatRow('Today\'s Reports', '${_analytics['todayReports'] ?? 0}'),
        _buildStatRow('Resolved Incidents', '${_analytics['resolvedIncidents'] ?? 0}'),
        _buildStatRow('Active Responders', '${_analytics['activeResponders'] ?? 0}'),
        _buildStatRow('Network Coverage', '${_analytics['networkCoverage'] ?? 0}%'),
      ],
    );
  }

  Widget _buildEmergencyMetrics(Map<String, dynamic> data) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                '🚨 Emergency Calls',
                data['emergencyCalls']?.toString() ?? '0',
                Colors.red,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                '⏱️ Avg Response',
                '${data['avgResponse'] ?? 0}min',
                Colors.orange,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                '✅ Resolved',
                data['resolved']?.toString() ?? '0',
                Colors.green,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                '⏳ Pending',
                data['pending']?.toString() ?? '0',
                Colors.blue,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLocationMetrics(Map<String, dynamic> data) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                '📍 Locations Tracked',
                data['locationsTracked']?.toString() ?? '0',
                Colors.blue,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                '🎯 Accuracy',
                '${data['accuracy'] ?? 0}%',
                Colors.green,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                '⚡ Updates/Hour',
                data['updatesPerHour']?.toString() ?? '0',
                Colors.orange,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                '🏃 Active Users',
                data['activeUsers']?.toString() ?? '0',
                Colors.purple,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCommunityMetrics(Map<String, dynamic> data) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                '👥 Community Size',
                data['communitySize']?.toString() ?? '0',
                Colors.blue,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                '🤝 Trust Score',
                '${data['trustScore'] ?? 0}/100',
                Colors.green,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                '💬 Messages',
                data['messages']?.toString() ?? '0',
                Colors.orange,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                '🏆 Reputation',
                data['reputation']?.toString() ?? '0',
                Colors.purple,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    final theme = Theme.of(context);
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildStatRow(String label, String value) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface)),
        ],
      ),
    );
  }

  void _refreshAnalytics() {
    setState(() {
      _isLoading = true;
    });
    _loadAnalytics();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📊 Analytics data refreshed'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _exportData() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📥 Data export started (feature under development)'),
        backgroundColor: Colors.green,
      ),
    );
  }
}
