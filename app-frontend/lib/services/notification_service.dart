import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();
  static final List<Map<String, dynamic>> _notificationHistory = [];

  static Future<void> init() async {
    try {
      // Android initialization settings
      const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
      
      // iOS initialization settings
      const iosSettings = DarwinInitializationSettings(
        requestSoundPermission: true,
        requestBadgePermission: true,
        requestAlertPermission: true,
      );

      const initSettings = InitializationSettings(
        android: androidSettings,
        iOS: iosSettings,
      );

      await _notifications.initialize(
        initSettings,
        onDidReceiveNotificationResponse: _onNotificationTapped,
      );

      // Request permissions for Android 13+
      await _notifications
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
          ?.requestNotificationsPermission();

      debugPrint('✅ NotificationService initialized with smartphone notifications');
    } catch (e) {
      debugPrint('Error initializing notifications: $e');
    }
  }

  static void _onNotificationTapped(NotificationResponse response) {
    debugPrint('Notification tapped: ${response.payload}');
    // Handle notification tap - could navigate to specific screen
  }

  static Future<void> showIncidentReportedNotification(Map<String, dynamic> incident) async {
    try {
      const androidDetails = AndroidNotificationDetails(
        'incident_reports',
        'Incident Reports',
        channelDescription: 'Notifications for incident report submissions',
        importance: Importance.high,
        priority: Priority.high,
        icon: '@mipmap/ic_launcher',
      );

      const iosDetails = DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      );

      const notificationDetails = NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      );

      final notificationId = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      
      await _notifications.show(
        notificationId,
        '✅ Incident Report Submitted',
        'Your ${incident['category']} report has been submitted successfully.',
        notificationDetails,
        payload: 'incident_${incident['id']}',
      );
      
      final notification = {
        'id': notificationId,
        'title': 'Incident Report Submitted',
        'body': 'Your ${incident['category']} report has been submitted successfully.',
        'timestamp': DateTime.now().toIso8601String(),
        'type': 'incident_reported',
        'payload': incident['id'],
      };
      
      _notificationHistory.add(notification);
      debugPrint('✅ Smartphone notification sent: ${notification['title']}');
    } catch (e) {
      debugPrint('Error showing incident report notification: $e');
    }
  }

  static Future<void> showEmergencyActivatedNotification() async {
    try {
      const androidDetails = AndroidNotificationDetails(
        'emergency_alerts',
        'Emergency Alerts',
        channelDescription: 'Critical emergency notifications',
        importance: Importance.max,
        priority: Priority.max,
        icon: '@mipmap/ic_launcher',
        playSound: true,
        enableVibration: true,
      );

      const iosDetails = DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
        interruptionLevel: InterruptionLevel.critical,
      );

      const notificationDetails = NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      );

      final notificationId = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      
      await _notifications.show(
        notificationId,
        '🚨 EMERGENCY ACTIVATED',
        'Emergency services are being contacted. Help is on the way.',
        notificationDetails,
        payload: 'emergency_activated',
      );
      
      debugPrint('🚨 Emergency notification sent to smartphone');
    } catch (e) {
      debugPrint('Error showing emergency notification: $e');
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

  // Additional methods for notification center
  static Future<List<Map<String, dynamic>>> getAllNotifications() async {
    try {
      // In a real app, this would fetch from the server
      await Future.delayed(const Duration(milliseconds: 300));
      
      // Return a mix of saved history and mock data
      final mockNotifications = [
        {
          'id': '1',
          'title': '🚨 Emergency Alert',
          'message': 'Tourist assistance request in your area. Your help may be needed.',
          'type': 'emergency',
          'priority': 'high',
          'read': false,
          'timestamp': DateTime.now().subtract(const Duration(minutes: 5)).toIso8601String(),
          'data': {'location': 'Times Square, NYC', 'distance': '0.2 miles'}
        },
        {
          'id': '2',
          'title': '⚠️ Weather Alert',
          'message': 'Heavy rain expected in your area. Stay safe and avoid low-lying areas.',
          'type': 'alert',
          'priority': 'medium',
          'read': false,
          'timestamp': DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
          'data': {'severity': 'moderate', 'duration': '2-4 hours'}
        },
        {
          'id': '3',
          'title': '📍 Location Update',
          'message': 'Your location has been updated successfully.',
          'type': 'info',
          'priority': 'low',
          'read': true,
          'timestamp': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
          'data': null
        },
        {
          'id': '4',
          'title': '✅ Profile Verified',
          'message': 'Your blockchain profile verification is complete!',
          'type': 'info',
          'priority': 'medium',
          'read': false,
          'timestamp': DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
          'data': {'verificationHash': '0x1234...5678'}
        },
      ];
      
      return mockNotifications;
    } catch (e) {
      debugPrint('Error getting all notifications: $e');
      return [];
    }
  }

  static Future<void> markAllAsRead() async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      // In real app, would update server
      debugPrint('All notifications marked as read');
    } catch (e) {
      debugPrint('Error marking all as read: $e');
    }
  }

  static Future<void> clearAllNotifications() async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      _notificationHistory.clear();
      debugPrint('All notifications cleared');
    } catch (e) {
      debugPrint('Error clearing all notifications: $e');
    }
  }

  static Future<void> markAsRead(String notificationId) async {
    try {
      await Future.delayed(const Duration(milliseconds: 100));
      // In real app, would update server
      debugPrint('Notification $notificationId marked as read');
    } catch (e) {
      debugPrint('Error marking notification as read: $e');
    }
  }

  static Future<void> deleteNotification(String notificationId) async {
    try {
      await Future.delayed(const Duration(milliseconds: 100));
      _notificationHistory.removeWhere((n) => n['id'].toString() == notificationId);
      debugPrint('Notification $notificationId deleted');
    } catch (e) {
      debugPrint('Error deleting notification: $e');
    }
  }

  static Future<void> sendNotification(
    String title,
    String message, {
    String type = 'info',
    String priority = 'medium',
    Map<String, dynamic>? data,
  }) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      
      final notification = {
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'title': title,
        'message': message,
        'type': type,
        'priority': priority,
        'read': false,
        'timestamp': DateTime.now().toIso8601String(),
        'data': data,
      };
      
      _notificationHistory.add(notification);
      debugPrint('Notification sent: $title');
    } catch (e) {
      debugPrint('Error sending notification: $e');
    }
  }
}
