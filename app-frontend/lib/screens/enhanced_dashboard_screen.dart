import 'package:flutter/material.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';
import '../widgets/responsive_utils.dart';
import '../services/push_notification_service.dart';
import '../services/shake_detection_service.dart';
import 'ai_emergency_detection_screen.dart';
import 'advanced_emergency_response_screen.dart';
import 'enhanced_chatbot_screen.dart';
import 'incident_report_screen.dart';
import 'incident_reports_list_screen.dart';

import 'notifications_screen.dart';
import 'settings_screen.dart';
// NEW BLOCKCHAIN FEATURES
import 'profile_management_screen.dart';
import 'notification_center_screen.dart';
import 'analytics_screen.dart';
import 'community_interaction_screen.dart';
import 'nearby_places_screen.dart';

class EnhancedDashboardScreen extends StatefulWidget {
  const EnhancedDashboardScreen({Key? key}) : super(key: key);

  @override
  State<EnhancedDashboardScreen> createState() => _EnhancedDashboardScreenState();
}

class _EnhancedDashboardScreenState extends State<EnhancedDashboardScreen> 
    with TickerProviderStateMixin {
  late AnimationController _safetyScoreController;
  late AnimationController _pulseController;
  
  // Mock data for demonstration
  double _safetyScore = 87.5;
  String _currentLocation = 'Guwahati, India';
  String _riskLevel = 'Low Risk';
  int _nearbyTourists = 156;
  int _activeAlerts = 2;

  List<Map<String, dynamic>> _recentActivities = [
    {
      'type': 'location',
      'title': 'Safe zone entered',
      'subtitle': 'Guwahati Tourist Zone',
      'time': '5 min ago',
      'icon': Icons.location_on,
      'color': EmergencyColorPalette.secondary[500],
    },
    {
      'type': 'ai',
      'title': 'AI Safety Check',
      'subtitle': 'Normal behavior patterns detected',
      'time': '15 min ago',
      'icon': Icons.psychology,
      'color': EmergencyColorPalette.primary[500],
    },
    {
      'type': 'alert',
      'title': 'Weather Alert',
      'subtitle': 'Heavy rain expected in 2 hours',
      'time': '1 hour ago',
      'icon': Icons.warning,
      'color': EmergencyColorPalette.warning[500],
    },
  ];

  List<Map<String, dynamic>> _quickActions = [
    {
      'title': 'Emergency\nPanic',
      'icon': Icons.emergency,
      'color': EmergencyColorPalette.danger[500],
      'route': '/emergency-response',
    },
    {
      'title': 'Report\nIncident',
      'icon': Icons.report_problem,
      'color': EmergencyColorPalette.warning[500],
      'route': '/incident-report',
    },
    {
      'title': 'Nearby\nIncidents',
      'icon': Icons.location_on,
      'color': EmergencyColorPalette.primary[500],
      'route': '/incident-list',
    },
    {
      'title': 'AI Safety\nDetection',
      'icon': Icons.psychology,
      'color': EmergencyColorPalette.info[500],
      'route': '/ai-detection',
    },
    {
      'title': 'Smart\nChatbot',
      'icon': Icons.chat_bubble,
      'color': EmergencyColorPalette.secondary[500],
      'route': '/chatbot',
    },
    // NEW BLOCKCHAIN FEATURES
    {
      'title': '👤 Profile\nManagement',
      'icon': Icons.person,
      'color': Colors.blue,
      'route': '/profile-management',
    },
    {
      'title': '🔔 Notification\nCenter',
      'icon': Icons.notifications,
      'color': Colors.purple,
      'route': '/notification-center',
    },
    {
      'title': '📊 Analytics\nDashboard',
      'icon': Icons.analytics,
      'color': Colors.green,
      'route': '/analytics',
    },
    {
      'title': '🤝 Community\nInteraction',
      'icon': Icons.people,
      'color': Colors.orange,
      'route': '/community',
    },
    {
      'title': '📍 Nearby\nPlaces',
      'icon': Icons.place,
      'color': EmergencyColorPalette.info[600],
      'route': '/nearby-places',
    },
  ];

  @override
  void initState() {
    super.initState();
    _safetyScoreController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    _safetyScoreController.forward();
    
    // Initialize blockchain-enhanced services
    _initializeServices();
  }

  /// Initialize all blockchain-enhanced services
  Future<void> _initializeServices() async {
    try {
      // Initialize Push Notification Service
      final pushService = PushNotificationService();
      await pushService.initialize();
      
      // Listen for notifications
      pushService.notificationStream.listen((notification) {
        _showNotificationSnackbar(notification);
      });
      
      // Initialize Shake Detection Service
      final shakeService = ShakeDetectionService();
      await shakeService.initializeWithEmergencyCallback(() {
        _handleEmergencyActivation();
      });
      
      print('✅ All blockchain services initialized');
    } catch (e) {
      print('⚠️ Error initializing services: $e');
    }
  }

  /// Handle emergency activation from shake or button
  void _handleEmergencyActivation() {
    final pushService = PushNotificationService();
    
    // Send emergency notification
    pushService.sendEmergencyNotification(
      title: 'EMERGENCY ACTIVATED',
      body: 'Emergency services have been contacted. Your location is being shared with authorities.',
      data: {
        'location': _currentLocation,
        'timestamp': DateTime.now().toIso8601String(),
        'method': 'shake_gesture',
        'safetyScore': _safetyScore,
      },
    );
    
    // Show emergency dialog
    _showEmergencyDialog();
  }

  /// Show notification as snackbar
  void _showNotificationSnackbar(PushNotification notification) {
    if (!mounted) return;
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              notification.title,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(notification.body),
          ],
        ),
        backgroundColor: _getNotificationColor(notification.type),
        duration: const Duration(seconds: 4),
        action: SnackBarAction(
          label: 'VIEW',
          textColor: Colors.white,
          onPressed: () {
            // Navigate to appropriate screen based on notification type
            _handleNotificationTap(notification);
          },
        ),
      ),
    );
  }

  /// Get notification color based on type
  Color _getNotificationColor(String type) {
    switch (type) {
      case 'emergency':
        return EmergencyColorPalette.danger[500]!;
      case 'safety':
        return EmergencyColorPalette.secondary[500]!;
      case 'weather':
        return EmergencyColorPalette.warning[500]!;
      case 'blockchain':
        return EmergencyColorPalette.info[500]!;
      default:
        return EmergencyColorPalette.primary[500]!;
    }
  }

  /// Handle notification tap
  void _handleNotificationTap(PushNotification notification) {
    switch (notification.type) {
      case 'emergency':
        Navigator.pushNamed(context, '/emergency-response');
        break;
      case 'blockchain':
        Navigator.pushNamed(context, '/blockchain-history');
        break;
      default:
        Navigator.pushNamed(context, '/notifications');
        break;
    }
  }

  /// Show emergency activation dialog
  void _showEmergencyDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(
              Icons.emergency,
              color: EmergencyColorPalette.danger[500],
              size: 32,
            ),
            const SizedBox(width: 12),
            const Text('🚨 EMERGENCY ACTIVATED'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('✅ Emergency services contacted'),
            const Text('📍 Location shared with authorities'),
            const Text('🔒 Alert logged on blockchain'),
            const SizedBox(height: 16),
            Text(
              'Location: $_currentLocation',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              'Time: ${DateTime.now().toString().substring(0, 19)}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/emergency-response');
            },
            child: const Text('OPEN EMERGENCY PANEL'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.danger[500],
              foregroundColor: Colors.white,
            ),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _safetyScoreController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image(
              image: const AssetImage('assets/logo/safer_logo.png'),
              height: 32,
              width: 32,
              errorBuilder: (context, error, stackTrace) => const Icon(
                Icons.security,
                size: 28,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 8),
            const ThemeAwareText.heading('SAFER'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: _showNotifications,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showSettings,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshDashboard,
        child: ResponsiveColumn(
          children: [
            Padding(
              padding: ResponsiveUtils.getResponsiveMargin(context),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSafetyScoreHeader(),
                  const SizedBox(height: 20),
                  _buildLocationStatus(),
                  const SizedBox(height: 20),
                  _buildQuickActions(),
                  const SizedBox(height: 20),
                  _buildLiveStats(),
                  const SizedBox(height: 20),
                  _buildRecentActivities(),
                  const SizedBox(height: 20),
                  _buildEmergencyFeatures(),
                  const SizedBox(height: 80), // Extra space for FAB
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: AnimatedBuilder(
        animation: _pulseController,
        builder: (context, child) {
          return Transform.scale(
            scale: 1 + (_pulseController.value * 0.1),
            child: FloatingActionButton(
              onPressed: _quickEmergency,
              backgroundColor: EmergencyColorPalette.danger[500],
              child: const Icon(Icons.emergency, color: Colors.white),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSafetyScoreHeader() {
    Color scoreColor = _getSafetyScoreColor(_safetyScore);
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            scoreColor.withOpacity(0.1),
            scoreColor.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: scoreColor.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: scoreColor.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ThemeAwareText.subheading(
                    'AI Safety Score',
                  ),
                  const SizedBox(height: 4),
                  ThemeAwareText(
                    _riskLevel,
                    style: TextStyle(
                      fontSize: 16,
                      color: scoreColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const ThemeAwareText.caption(
                    'Last updated: Just now',
                  ),
                ],
              ),
              AnimatedBuilder(
                animation: _safetyScoreController,
                builder: (context, child) {
                  return Container(
                    width: 100,
                    height: 100,
                    child: Stack(
                      children: [
                        Center(
                          child: SizedBox(
                            width: 100,
                            height: 100,
                            child: CircularProgressIndicator(
                              value: (_safetyScore / 100) * _safetyScoreController.value,
                              strokeWidth: 8,
                              backgroundColor: scoreColor.withOpacity(0.2),
                              valueColor: AlwaysStoppedAnimation<Color>(scoreColor),
                            ),
                          ),
                        ),
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                '${(_safetyScore * _safetyScoreController.value).toStringAsFixed(1)}',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black54,
                                      offset: Offset(0, 1),
                                      blurRadius: 2,
                                    ),
                                  ],
                                ),
                              ),
                              const Text(
                                '/100',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.white70,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black54,
                                      offset: Offset(0, 1),
                                      blurRadius: 2,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildSafetyScoreBreakdown(),
        ],
      ),
    );
  }

  Widget _buildSafetyScoreBreakdown() {
    return Row(
      children: [
        Expanded(
          child: _buildScoreComponent('Location', 95, EmergencyColorPalette.secondary[500]!),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildScoreComponent('Behavior', 85, EmergencyColorPalette.primary[500]!),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildScoreComponent('Environment', 82, EmergencyColorPalette.warning[500]!),
        ),
      ],
    );
  }

  Widget _buildScoreComponent(String label, double score, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: EmergencyColorPalette.neutral[800],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${score.toStringAsFixed(0)}%',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationStatus() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.location_on,
                  color: EmergencyColorPalette.primary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                Text(
                  'Current Location Status',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _currentLocation,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Safe Tourist Zone • Well-lit area',
                        style: TextStyle(
                          fontSize: 14,
                          color: EmergencyColorPalette.secondary[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: EmergencyColorPalette.secondary[100],
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: EmergencyColorPalette.secondary[300]!),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.check_circle,
                        size: 16,
                        color: EmergencyColorPalette.secondary[600],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'SAFE',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: EmergencyColorPalette.secondary[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ThemeAwareText.subheading('Quick Actions'),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 1.8, // Made buttons smaller/shorter
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: _quickActions.length,
          itemBuilder: (context, index) {
            final action = _quickActions[index];
            return _buildQuickActionCard(action);
          },
        ),
      ],
    );
  }

  Widget _buildQuickActionCard(Map<String, dynamic> action) {
    return InkWell(
      onTap: () => _navigateToAction(action['route']),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              action['color'].withOpacity(0.1),
              action['color'].withOpacity(0.05),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: action['color'].withOpacity(0.3)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: action['color'].withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(
                action['icon'],
                color: action['color'],
                size: 24, // Smaller icon
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FlexibleText(
                action['title'],
                textAlign: TextAlign.left,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveStats() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.analytics,
                  color: EmergencyColorPalette.info[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const ThemeAwareText.subheading(
                  'Live Statistics',
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    'Nearby Tourists',
                    '$_nearbyTourists',
                    Icons.people,
                    EmergencyColorPalette.primary[500]!,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatItem(
                    'Active Alerts',
                    '$_activeAlerts',
                    Icons.warning,
                    EmergencyColorPalette.warning[500]!,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    'Emergency Response',
                    '< 5 min',
                    Icons.emergency,
                    EmergencyColorPalette.danger[500]!,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatItem(
                    'AI Confidence',
                    '94.7%',
                    Icons.psychology,
                    EmergencyColorPalette.secondary[500]!,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentActivities() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.history,
                      color: EmergencyColorPalette.neutral[500],
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Recent Activities',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...(_recentActivities.map((activity) => _buildActivityItem(activity))),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(Map<String, dynamic> activity) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: activity['color'].withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              activity['icon'],
              color: activity['color'],
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activity['title'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  activity['subtitle'],
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ],
            ),
          ),
          Text(
            activity['time'],
            style: TextStyle(
              fontSize: 12,
              color: EmergencyColorPalette.neutral[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyFeatures() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.security,
                  color: EmergencyColorPalette.danger[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Emergency Features Status',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildFeatureStatus('AI Emergency Detection', true, 'Active'),
            _buildFeatureStatus('Panic Button', true, 'Ready'),
            _buildFeatureStatus('Auto Emergency Calls', true, 'Enabled'),
            _buildFeatureStatus('Location Tracking', true, 'Broadcasting'),
            _buildFeatureStatus('Blockchain Logging', true, 'Secured'),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureStatus(String feature, bool isActive, String status) {
    Color statusColor = isActive 
      ? EmergencyColorPalette.secondary[500]! 
      : EmergencyColorPalette.neutral[400]!;
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            feature,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: statusColor.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isActive ? Icons.check_circle : Icons.circle,
                  size: 12,
                  color: statusColor,
                ),
                const SizedBox(width: 4),
                Text(
                  status,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: statusColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getSafetyScoreColor(double score) {
    if (score >= 80) return ZoneRiskColors.safe;
    if (score >= 60) return ZoneRiskColors.lowRisk;
    if (score >= 40) return ZoneRiskColors.moderateRisk;
    return ZoneRiskColors.highRisk;
  }

  Future<void> _refreshDashboard() async {
    // Simulate refresh delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Update mock data
    setState(() {
      _safetyScore = 85.0 + (10.0 * (DateTime.now().millisecond / 1000));
      _nearbyTourists = 150 + (DateTime.now().second % 20);
      _activeAlerts = DateTime.now().second % 5;
    });
    
    _safetyScoreController.reset();
    _safetyScoreController.forward();
  }

  void _navigateToAction(String route) {
    switch (route) {
      case '/emergency-response':
        // Trigger emergency notification when emergency button is pressed
        _handleEmergencyActivation();
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AdvancedEmergencyResponseScreen(),
          ),
        );
        break;
      case '/incident-report':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const IncidentReportScreen(),
          ),
        );
        break;
      case '/incident-list':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const IncidentReportsListScreen(),
          ),
        );
        break;
      case '/ai-detection':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AIEmergencyDetectionScreen(),
          ),
        );
        break;
      case '/chatbot':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const EnhancedChatbotScreen(userType: 'tourist'),
          ),
        );
        break;
      case '/notifications':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const NotificationCenterScreen(),
          ),
        );
        break;
      // NEW BLOCKCHAIN FEATURES
      case '/profile-management':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const ProfileManagementScreen(),
          ),
        );
        break;
      case '/notification-center':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const NotificationCenterScreen(),
          ),
        );
        break;
      case '/analytics':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AnalyticsScreen(),
          ),
        );
        break;
      case '/community':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const CommunityInteractionScreen(),
          ),
        );
        break;
      case '/nearby-places':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const NearbyPlacesScreen(),
          ),
        );
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$route feature coming soon!'),
            backgroundColor: EmergencyColorPalette.primary[500],
          ),
        );
    }
  }

  void _quickEmergency() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const AdvancedEmergencyResponseScreen(),
      ),
    );
  }

  void _showNotifications() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const NotificationsScreen()),
    );
  }

  void _showSettings() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SettingsScreen()),
    );
  }
}
