import 'package:flutter/foundation.dart';

class NotificationService {
  // Simulated notification service for hardcoded implementation
  static final List<Map<String, dynamic>> _notificationHistory = [];

  static Future<void> init() async {
    try {
      // Simulate initialization
      await Future.delayed(const Duration(milliseconds: 100));
      debugPrint('NotificationService initialized (simulated)');
    } catch (e) {
      debugPrint('Error initializing notifications: $e');
    }
  }

  static Future<void> showIncidentReportedNotification(Map<String, dynamic> incident) async {
    try {
      // Simulate showing notification
      await Future.delayed(const Duration(milliseconds: 300));
      
      final notification = {
        'id': DateTime.now().millisecondsSinceEpoch,
        'title': 'Incident Report Submitted',
        'body': 'Your ${incident['category']} report has been submitted successfully.',
        'timestamp': DateTime.now().toIso8601String(),
        'type': 'incident_reported',
        'payload': incident['id'],
      };
      
      _notificationHistory.add(notification);
      debugPrint('✅ Notification shown: ${notification['title']}');
    } catch (e) {
      debugPrint('Error showing incident report notification: $e');
    }
  }

  static Future<void> notifyNearbyUsers(Map<String, dynamic> incident, double radiusKm) async {
    try {
      // Simulate notifying nearby users (in real app, this would be server-side)
      await Future.delayed(const Duration(milliseconds: 500));
      
      final notification = {
        'id': DateTime.now().millisecondsSinceEpoch,
        'title': 'Nearby Users Alerted',
        'body': 'Users within ${radiusKm}km have been notified about the ${incident['category']} incident.',
        'timestamp': DateTime.now().toIso8601String(),
        'type': 'nearby_alert',
        'payload': 'nearby_alert_${incident['id']}',
      };
      
      _notificationHistory.add(notification);
      debugPrint('📡 Notification sent to nearby users: ${notification['title']}');
    } catch (e) {
      debugPrint('Error notifying nearby users: $e');
    }
  }

  static Future<void> showNearbyIncidentAlert(Map<String, dynamic> incident, double distanceKm) async {
    try {
      String severityEmoji = _getSeverityEmoji(incident['severity']);
      String title = 'Nearby ${incident['category']} $severityEmoji';
      String body = '${incident['title']} - ${distanceKm.toStringAsFixed(1)}km away';

      final notification = {
        'id': DateTime.now().millisecondsSinceEpoch,
        'title': title,
        'body': body,
        'timestamp': DateTime.now().toIso8601String(),
        'type': 'nearby_incident',
        'payload': 'incident_${incident['id']}',
        'severity': incident['severity'],
        'distance': distanceKm,
      };
      
      _notificationHistory.add(notification);
      debugPrint('⚠️ Nearby incident alert: $title');
    } catch (e) {
      debugPrint('Error showing nearby incident alert: $e');
    }
  }

  static Future<void> showEmergencyAlert(String title, String message, {String? payload}) async {
    try {
      final notification = {
        'id': DateTime.now().millisecondsSinceEpoch,
        'title': title,
        'body': message,
        'timestamp': DateTime.now().toIso8601String(),
        'type': 'emergency',
        'payload': payload,
        'priority': 'critical',
      };
      
      _notificationHistory.add(notification);
      debugPrint('🚨 EMERGENCY ALERT: $title - $message');
    } catch (e) {
      debugPrint('Error showing emergency alert: $e');
    }
  }

  static String _getSeverityEmoji(String severity) {
    switch (severity.toLowerCase()) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🟠';
      case 'critical':
        return '🔴';
      default:
        return '⚠️';
    }
  }

  static Future<void> cancelNotification(int notificationId) async {
    try {
      _notificationHistory.removeWhere((n) => n['id'] == notificationId);
      debugPrint('Notification $notificationId cancelled');
    } catch (e) {
      debugPrint('Error canceling notification: $e');
    }
  }

  static Future<void> cancelAllNotifications() async {
    try {
      _notificationHistory.clear();
      debugPrint('All notifications cancelled');
    } catch (e) {
      debugPrint('Error canceling all notifications: $e');
    }
  }

  static List<Map<String, dynamic>> getNotificationHistory() {
    return List.from(_notificationHistory);
  }
}
