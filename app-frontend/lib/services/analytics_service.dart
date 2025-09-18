import 'package:flutter/foundation.dart';

class AnalyticsService {
  static final Map<String, dynamic> _mockAnalytics = {
    'totalUsers': 1245,
    'activeIncidents': 3,
    'avgResponseTime': 3.2,
    'avgTrustScore': 87,
    'todayReports': 12,
    'resolvedIncidents': 145,
    'activeResponders': 23,
    'networkCoverage': 94,
    'emergency': {
      'emergencyCalls': 156,
      'avgResponse': 2.8,
      'resolved': 142,
      'pending': 14,
    },
    'location': {
      'locationsTracked': 1200,
      'accuracy': 96,
      'updatesPerHour': 450,
      'activeUsers': 234,
    },
    'community': {
      'communitySize': 1245,
      'trustScore': 87,
      'messages': 3456,
      'reputation': 2890,
    },
  };

  static Future<Map<String, dynamic>> getAnalytics() async {
    try {
      // Simulate API call delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      // In a real app, this would fetch from the backend
      debugPrint('Analytics data loaded');
      return Map.from(_mockAnalytics);
    } catch (e) {
      debugPrint('Error loading analytics: $e');
      return _mockAnalytics;
    }
  }

  static Future<Map<String, dynamic>> getEmergencyAnalytics() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      return _mockAnalytics['emergency'] as Map<String, dynamic>;
    } catch (e) {
      debugPrint('Error loading emergency analytics: $e');
      return {};
    }
  }

  static Future<Map<String, dynamic>> getLocationAnalytics() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      return _mockAnalytics['location'] as Map<String, dynamic>;
    } catch (e) {
      debugPrint('Error loading location analytics: $e');
      return {};
    }
  }

  static Future<Map<String, dynamic>> getCommunityAnalytics() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      return _mockAnalytics['community'] as Map<String, dynamic>;
    } catch (e) {
      debugPrint('Error loading community analytics: $e');
      return {};
    }
  }

  static Future<List<Map<String, dynamic>>> getActivityTrends({int days = 7}) async {
    try {
      await Future.delayed(const Duration(milliseconds: 400));
      
      // Mock activity trend data
      final trends = <Map<String, dynamic>>[];
      final now = DateTime.now();
      
      for (int i = days - 1; i >= 0; i--) {
        final date = now.subtract(Duration(days: i));
        trends.add({
          'date': date.toIso8601String().substring(0, 10),
          'incidents': (15 + (i * 2) + (i % 3) * 5).clamp(0, 30),
          'responses': (12 + (i * 1.5) + (i % 4) * 3).round().clamp(0, 25),
          'users': (200 + (i * 10) + (i % 5) * 20).clamp(180, 300),
        });
      }
      
      return trends;
    } catch (e) {
      debugPrint('Error loading activity trends: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getIncidentTypes() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      
      return [
        {'type': 'Medical Emergency', 'count': 45, 'percentage': 35},
        {'type': 'Lost Tourist', 'count': 38, 'percentage': 30},
        {'type': 'Theft/Crime', 'count': 25, 'percentage': 20},
        {'type': 'Natural Disaster', 'count': 12, 'percentage': 10},
        {'type': 'Other', 'count': 6, 'percentage': 5},
      ];
    } catch (e) {
      debugPrint('Error loading incident types: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getHotspots() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      
      return [
        {'name': 'Times Square', 'lat': 40.7580, 'lng': -73.9855, 'incidents': 23},
        {'name': 'Central Park', 'lat': 40.7829, 'lng': -73.9654, 'incidents': 18},
        {'name': 'Brooklyn Bridge', 'lat': 40.7061, 'lng': -73.9969, 'incidents': 15},
        {'name': 'Statue of Liberty', 'lat': 40.6892, 'lng': -74.0445, 'incidents': 12},
        {'name': 'Empire State Building', 'lat': 40.7484, 'lng': -73.9857, 'incidents': 9},
      ];
    } catch (e) {
      debugPrint('Error loading hotspots: $e');
      return [];
    }
  }

  static Future<void> trackEvent(String eventName, Map<String, dynamic> properties) async {
    try {
      await Future.delayed(const Duration(milliseconds: 100));
      debugPrint('Analytics event tracked: $eventName with properties: $properties');
    } catch (e) {
      debugPrint('Error tracking event: $e');
    }
  }

  static Future<void> updateMetric(String metricName, dynamic value) async {
    try {
      await Future.delayed(const Duration(milliseconds: 100));
      _mockAnalytics[metricName] = value;
      debugPrint('Metric updated: $metricName = $value');
    } catch (e) {
      debugPrint('Error updating metric: $e');
    }
  }
}
