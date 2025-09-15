import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/emergency_theme.dart';
import '../services/notification_service.dart';

class NotificationDemoScreen extends StatefulWidget {
  const NotificationDemoScreen({super.key});

  @override
  State<NotificationDemoScreen> createState() => _NotificationDemoScreenState();
}

class _NotificationDemoScreenState extends State<NotificationDemoScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  
  List<Map<String, dynamic>> _notificationHistory = [];

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _loadNotificationHistory();
  }

  void _setupAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    _animationController.forward();
  }

  void _loadNotificationHistory() {
    setState(() {
      _notificationHistory = NotificationService.getNotificationHistory();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Notification Center',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        backgroundColor: EmergencyColorPalette.primary[600],
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        systemOverlayStyle: SystemUiOverlayStyle.light,
        actions: [
          IconButton(
            icon: const Icon(Icons.clear_all, color: Colors.white),
            onPressed: _clearAllNotifications,
          ),
        ],
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: Column(
          children: [
            // Header
            _buildHeader(),
            
            // Demo Buttons
            _buildDemoButtons(),
            
            // Notification History
            Expanded(
              child: _buildNotificationHistory(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            EmergencyColorPalette.primary[500]!,
            EmergencyColorPalette.primary[600]!,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: EmergencyColorPalette.primary[500]!.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.notifications_active,
              color: Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Notification System',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Demo & History (${_notificationHistory.length} notifications)',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDemoButtons() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Demo Notifications',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildDemoButton(
                  'Incident Report',
                  Icons.report_problem,
                  EmergencyColorPalette.primary[500]!,
                  _showIncidentReportDemo,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildDemoButton(
                  'Nearby Alert',
                  Icons.location_on,
                  EmergencyColorPalette.warning[500]!,
                  _showNearbyIncidentDemo,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildDemoButton(
                  'Emergency Alert',
                  Icons.warning,
                  EmergencyColorPalette.danger[500]!,
                  _showEmergencyAlertDemo,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildDemoButton(
                  'Nearby Users',
                  Icons.group,
                  EmergencyColorPalette.secondary[500]!,
                  _showNearbyUsersDemo,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildDemoButton(String title, IconData icon, Color color, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(vertical: 16),
        elevation: 4,
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 24),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationHistory() {
    if (_notificationHistory.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(50),
              ),
              child: Icon(
                Icons.notifications_none,
                size: 48,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'No Notifications Yet',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try the demo buttons above to see\nhow notifications work',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
                height: 1.4,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Notification History',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _notificationHistory.length,
            itemBuilder: (context, index) {
              final notification = _notificationHistory.reversed.toList()[index];
              return _buildNotificationCard(notification);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification) {
    Color typeColor = _getNotificationTypeColor(notification['type']);
    IconData typeIcon = _getNotificationTypeIcon(notification['type']);
    
    final timestamp = DateTime.parse(notification['timestamp']);
    final timeAgo = _getTimeAgo(DateTime.now().difference(timestamp));
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(
          color: typeColor.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: typeColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                typeIcon,
                color: typeColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    notification['title'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notification['body'],
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.black87,
                      height: 1.3,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: typeColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          notification['type'].toString().replaceAll('_', ' ').toUpperCase(),
                          style: TextStyle(
                            color: typeColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        timeAgo,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getNotificationTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'incident_reported':
        return EmergencyColorPalette.primary[500]!;
      case 'nearby_alert':
        return EmergencyColorPalette.secondary[500]!;
      case 'nearby_incident':
        return EmergencyColorPalette.warning[500]!;
      case 'emergency':
        return EmergencyColorPalette.danger[500]!;
      default:
        return Colors.grey[600]!;
    }
  }

  IconData _getNotificationTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'incident_reported':
        return Icons.report_problem;
      case 'nearby_alert':
        return Icons.group;
      case 'nearby_incident':
        return Icons.location_on;
      case 'emergency':
        return Icons.warning;
      default:
        return Icons.notifications;
    }
  }

  String _getTimeAgo(Duration difference) {
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  void _showIncidentReportDemo() async {
    final sampleIncident = {
      'id': 'demo_${DateTime.now().millisecondsSinceEpoch}',
      'category': 'Theft',
      'title': 'Demo Incident Report',
      'severity': 'High',
    };

    await NotificationService.showIncidentReportedNotification(sampleIncident);
    _loadNotificationHistory();
    
    _showSuccessSnackBar('Incident report notification sent!');
  }

  void _showNearbyIncidentDemo() async {
    final sampleIncident = {
      'id': 'demo_nearby_${DateTime.now().millisecondsSinceEpoch}',
      'category': 'Suspicious Activity',
      'title': 'Suspicious Person in Area',
      'severity': 'Medium',
    };

    await NotificationService.showNearbyIncidentAlert(sampleIncident, 1.2);
    _loadNotificationHistory();
    
    _showSuccessSnackBar('Nearby incident alert sent!');
  }

  void _showEmergencyAlertDemo() async {
    await NotificationService.showEmergencyAlert(
      'EMERGENCY ALERT',
      'This is a demonstration of emergency alert notifications. In real scenarios, this would be used for critical safety warnings.',
    );
    _loadNotificationHistory();
    
    _showSuccessSnackBar('Emergency alert sent!');
  }

  void _showNearbyUsersDemo() async {
    final sampleIncident = {
      'id': 'demo_users_${DateTime.now().millisecondsSinceEpoch}',
      'category': 'Harassment',
      'title': 'Tourist Harassment Incident',
      'severity': 'High',
    };

    await NotificationService.notifyNearbyUsers(sampleIncident, 3.0);
    _loadNotificationHistory();
    
    _showSuccessSnackBar('Nearby users notified!');
  }

  void _clearAllNotifications() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Clear All Notifications',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const Text(
          'Are you sure you want to clear all notification history?',
          style: TextStyle(fontSize: 16, height: 1.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              'Cancel',
              style: TextStyle(
                color: Colors.grey[600],
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              NotificationService.cancelAllNotifications();
              setState(() {
                _notificationHistory.clear();
              });
              Navigator.of(context).pop();
              _showSuccessSnackBar('All notifications cleared!');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.danger[500],
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              'Clear All',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: EmergencyColorPalette.secondary[500],
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
