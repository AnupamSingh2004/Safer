import 'package:flutter/foundation.dart';

class CommunityService {
  static final List<Map<String, dynamic>> _mockMessages = [
    {
      'id': '1',
      'senderId': 'user_123',
      'senderName': 'Alex Chen',
      'senderTrustScore': 92,
      'content': 'Hey everyone! Just arrived in NYC. Any recommendations for must-see spots?',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 15)).toIso8601String(),
      'location': 'Times Square',
    },
    {
      'id': '2',
      'senderId': 'user_456',
      'senderName': 'Maria Rodriguez',
      'senderTrustScore': 85,
      'content': 'Central Park is beautiful this time of year! Don\'t miss the Bethesda Fountain.',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 12)).toIso8601String(),
      'location': 'Central Park',
    },
    {
      'id': '3',
      'senderId': 'current_user',
      'senderName': 'You',
      'senderTrustScore': 87,
      'content': 'Thanks for the tip! Planning to visit there tomorrow.',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 8)).toIso8601String(),
      'location': 'Times Square',
    },
    {
      'id': '4',
      'senderId': 'user_789',
      'senderName': 'John Smith',
      'senderTrustScore': 78,
      'content': 'Anyone know good late-night food spots near Broadway?',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 5)).toIso8601String(),
      'location': 'Broadway',
    },
  ];

  static final List<Map<String, dynamic>> _mockNearbyUsers = [
    {
      'id': 'user_123',
      'name': 'Alex Chen',
      'trustScore': 92,
      'distance': 150,
      'status': 'Exploring Times Square 🗽',
      'lastSeen': DateTime.now().subtract(const Duration(minutes: 2)).toIso8601String(),
      'nationality': 'Canada',
      'isHelper': true,
    },
    {
      'id': 'user_456',
      'name': 'Maria Rodriguez',
      'trustScore': 85,
      'distance': 230,
      'status': 'Looking for breakfast spots ☕',
      'lastSeen': DateTime.now().subtract(const Duration(minutes: 5)).toIso8601String(),
      'nationality': 'Spain',
      'isHelper': false,
    },
    {
      'id': 'user_789',
      'name': 'John Smith',
      'trustScore': 78,
      'distance': 320,
      'status': 'First time in NYC! 🎭',
      'lastSeen': DateTime.now().subtract(const Duration(minutes: 8)).toIso8601String(),
      'nationality': 'UK',
      'isHelper': false,
    },
    {
      'id': 'user_101',
      'name': 'Sophie Laurent',
      'trustScore': 96,
      'distance': 180,
      'status': 'Local guide available 🌟',
      'lastSeen': DateTime.now().subtract(const Duration(minutes: 1)).toIso8601String(),
      'nationality': 'France',
      'isHelper': true,
    },
  ];

  static Future<List<Map<String, dynamic>>> getMessages() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      debugPrint('Community messages loaded');
      return List.from(_mockMessages);
    } catch (e) {
      debugPrint('Error loading messages: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getNearbyUsers() async {
    try {
      await Future.delayed(const Duration(milliseconds: 400));
      debugPrint('Nearby users loaded');
      return List.from(_mockNearbyUsers);
    } catch (e) {
      debugPrint('Error loading nearby users: $e');
      return [];
    }
  }

  static Future<void> sendMessage(String content) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      
      final newMessage = {
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'senderId': 'current_user',
        'senderName': 'You',
        'senderTrustScore': 87,
        'content': content,
        'timestamp': DateTime.now().toIso8601String(),
        'location': 'Current Location',
      };
      
      _mockMessages.insert(0, newMessage);
      debugPrint('Message sent: $content');
    } catch (e) {
      debugPrint('Error sending message: $e');
    }
  }

  static Future<void> sendDirectMessage(String recipientId, String content) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      debugPrint('Direct message sent to $recipientId: $content');
    } catch (e) {
      debugPrint('Error sending direct message: $e');
    }
  }

  static Future<void> requestHelp(String helperId, String helpType, String description) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      debugPrint('Help requested from $helperId: $helpType - $description');
    } catch (e) {
      debugPrint('Error requesting help: $e');
    }
  }

  static Future<void> offerHelp(String recipientId, String helpType) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      debugPrint('Help offered to $recipientId: $helpType');
    } catch (e) {
      debugPrint('Error offering help: $e');
    }
  }

  static Future<Map<String, dynamic>> getUserProfile(String userId) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      
      final user = _mockNearbyUsers.firstWhere(
        (u) => u['id'] == userId,
        orElse: () => {
          'id': userId,
          'name': 'Unknown User',
          'trustScore': 50,
          'nationality': 'Unknown',
          'isHelper': false,
        },
      );
      
      return Map.from(user);
    } catch (e) {
      debugPrint('Error getting user profile: $e');
      return {};
    }
  }

  static Future<void> updateTrustScore(String userId, int score) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      debugPrint('Trust score updated for $userId: $score');
    } catch (e) {
      debugPrint('Error updating trust score: $e');
    }
  }

  static Future<void> reportUser(String userId, String reason) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      debugPrint('User reported: $userId - $reason');
    } catch (e) {
      debugPrint('Error reporting user: $e');
    }
  }

  static Future<void> blockUser(String userId) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      debugPrint('User blocked: $userId');
    } catch (e) {
      debugPrint('Error blocking user: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getGroups() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      
      return [
        {
          'id': 'group_1',
          'name': 'NYC First Timers',
          'description': 'Help and tips for first-time visitors to New York City',
          'memberCount': 245,
          'category': 'Tourism',
          'isPublic': true,
          'location': 'New York City',
        },
        {
          'id': 'group_2',
          'name': 'Photography Enthusiasts',
          'description': 'Sharing the best photo spots and techniques',
          'memberCount': 156,
          'category': 'Photography',
          'isPublic': true,
          'location': 'Global',
        },
        {
          'id': 'group_3',
          'name': 'Emergency Responders',
          'description': 'Verified helpers for emergency situations',
          'memberCount': 89,
          'category': 'Emergency',
          'isPublic': false,
          'location': 'New York City',
        },
      ];
    } catch (e) {
      debugPrint('Error loading groups: $e');
      return [];
    }
  }

  static Future<void> joinGroup(String groupId) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      debugPrint('Joined group: $groupId');
    } catch (e) {
      debugPrint('Error joining group: $e');
    }
  }

  static Future<void> leaveGroup(String groupId) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200));
      debugPrint('Left group: $groupId');
    } catch (e) {
      debugPrint('Error leaving group: $e');
    }
  }

  static Future<Map<String, dynamic>> getCommunityStats() async {
    try {
      await Future.delayed(const Duration(milliseconds: 400));
      
      return {
        'totalUsers': 1245,
        'activeUsers': 234,
        'messagesExchanged': 3456,
        'helpRequestsFulfilled': 189,
        'averageTrustScore': 82,
        'topHelpers': [
          {'name': 'Sophie Laurent', 'helpCount': 45},
          {'name': 'Alex Chen', 'helpCount': 38},
          {'name': 'Maria Rodriguez', 'helpCount': 32},
        ],
      };
    } catch (e) {
      debugPrint('Error loading community stats: $e');
      return {};
    }
  }
}
