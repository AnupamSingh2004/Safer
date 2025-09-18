import 'dart:async';
import 'dart:math';

/// 🔔 Push Notification Model - Enhanced for SIH 2025 Demo
class PushNotification {
  final String id;
  final String title;
  final String body;
  final String type; // 'emergency', 'safety', 'weather', 'travel', 'blockchain'
  final Map<String, dynamic> data;
  final DateTime timestamp;
  final String priority; // 'high', 'medium', 'low'
  final bool isRead;
  final String? imageUrl;
  final String? actionUrl;
  final String? blockchainTxHash; // 🔒 BLOCKCHAIN TRANSACTION HASH

  PushNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.data,
    required this.timestamp,
    required this.priority,
    this.isRead = false,
    this.imageUrl,
    this.actionUrl,
    this.blockchainTxHash,
  });

  factory PushNotification.fromJson(Map<String, dynamic> json) {
    return PushNotification(
      id: json['id'],
      title: json['title'],
      body: json['body'],
      type: json['type'],
      data: json['data'] ?? {},
      timestamp: DateTime.parse(json['timestamp']),
      priority: json['priority'],
      isRead: json['isRead'] ?? false,
      imageUrl: json['imageUrl'],
      actionUrl: json['actionUrl'],
      blockchainTxHash: json['blockchainTxHash'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'body': body,
      'type': type,
      'data': data,
      'timestamp': timestamp.toIso8601String(),
      'priority': priority,
      'isRead': isRead,
      'imageUrl': imageUrl,
      'actionUrl': actionUrl,
      'blockchainTxHash': blockchainTxHash,
    };
  }

  PushNotification copyWith({
    bool? isRead,
    Map<String, dynamic>? data,
  }) {
    return PushNotification(
      id: id,
      title: title,
      body: body,
      type: type,
      data: data ?? this.data,
      timestamp: timestamp,
      priority: priority,
      isRead: isRead ?? this.isRead,
      imageUrl: imageUrl,
      actionUrl: actionUrl,
      blockchainTxHash: blockchainTxHash,
    );
  }
}

/// 🔔 Push Notification Service - Blockchain-Enhanced
/// Handles device registration, real-time alerts, and notification history
class PushNotificationService {
  static final PushNotificationService _instance = PushNotificationService._internal();
  factory PushNotificationService() => _instance;
  PushNotificationService._internal();

  final StreamController<PushNotification> _notificationController = 
      StreamController<PushNotification>.broadcast();
  
  final List<PushNotification> _notificationHistory = [];
  final Random _random = Random();
  
  String? _deviceToken;
  bool _isInitialized = false;

  /// Stream of real-time notifications
  Stream<PushNotification> get notificationStream => _notificationController.stream;

  /// Get notification history
  List<PushNotification> get notificationHistory => List.unmodifiable(_notificationHistory);

  /// Initialize push notification service
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    // Simulate device registration
    await Future.delayed(const Duration(seconds: 1));
    _deviceToken = _generateDeviceToken();
    
    // Register device with blockchain
    await _registerDeviceOnBlockchain();
    
    // Start listening for notifications
    _startNotificationListener();
    
    _isInitialized = true;
    print('🔔 Push Notification Service Initialized');
    print('📱 Device Token: $_deviceToken');
    print('🔒 BLOCKCHAIN REGISTERED');
  }

  /// Register device for push notifications
  Future<String> registerDevice() async {
    await Future.delayed(const Duration(seconds: 1));
    
    if (_deviceToken == null) {
      _deviceToken = _generateDeviceToken();
      await _registerDeviceOnBlockchain();
    }
    
    return _deviceToken!;
  }

  /// Send emergency notification
  Future<void> sendEmergencyNotification({
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    final notification = PushNotification(
      id: 'emergency_${DateTime.now().millisecondsSinceEpoch}',
      title: '🚨 $title',
      body: body,
      type: 'emergency',
      data: data ?? {},
      timestamp: DateTime.now(),
      priority: 'high',
      imageUrl: null,
      actionUrl: '/emergency-response',
      blockchainTxHash: _generateTxHash(),
    );

    // Store on blockchain (simulate)
    await _storeNotificationOnBlockchain(notification);
    
    // Add to history
    _notificationHistory.insert(0, notification);
    
    // Emit to stream
    _notificationController.add(notification);
    
    print('🚨 EMERGENCY NOTIFICATION SENT: $title');
  }

  /// Send safety alert
  Future<void> sendSafetyAlert({
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    final notification = PushNotification(
      id: 'safety_${DateTime.now().millisecondsSinceEpoch}',
      title: '🛡️ $title',
      body: body,
      type: 'safety',
      data: data ?? {},
      timestamp: DateTime.now(),
      priority: 'medium',
      imageUrl: null,
      actionUrl: '/safety-dashboard',
      blockchainTxHash: _generateTxHash(),
    );

    await _storeNotificationOnBlockchain(notification);
    _notificationHistory.insert(0, notification);
    _notificationController.add(notification);
  }

  /// Send weather alert
  Future<void> sendWeatherAlert({
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    final notification = PushNotification(
      id: 'weather_${DateTime.now().millisecondsSinceEpoch}',
      title: '🌦️ $title',
      body: body,
      type: 'weather',
      data: data ?? {},
      timestamp: DateTime.now(),
      priority: 'medium',
      imageUrl: null,
      actionUrl: '/weather-alerts',
      blockchainTxHash: _generateTxHash(),
    );

    await _storeNotificationOnBlockchain(notification);
    _notificationHistory.insert(0, notification);
    _notificationController.add(notification);
  }

  /// Send blockchain verification notification
  Future<void> sendBlockchainNotification({
    required String title,
    required String body,
    required String txHash,
    Map<String, dynamic>? data,
  }) async {
    final notification = PushNotification(
      id: 'blockchain_${DateTime.now().millisecondsSinceEpoch}',
      title: '🔒 $title',
      body: body,
      type: 'blockchain',
      data: data ?? {},
      timestamp: DateTime.now(),
      priority: 'low',
      imageUrl: null,
      actionUrl: '/blockchain-history',
      blockchainTxHash: txHash,
    );

    await _storeNotificationOnBlockchain(notification);
    _notificationHistory.insert(0, notification);
    _notificationController.add(notification);
  }

  /// Mark notification as read
  Future<void> markAsRead(String notificationId) async {
    final index = _notificationHistory.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      _notificationHistory[index] = _notificationHistory[index].copyWith(isRead: true);
    }
  }

  /// Clear all notifications
  Future<void> clearAllNotifications() async {
    _notificationHistory.clear();
  }

  /// Get unread notification count
  int get unreadCount => _notificationHistory.where((n) => !n.isRead).length;

  /// Dispose service
  void dispose() {
    _notificationController.close();
  }

  // Private methods
  String _generateDeviceToken() {
    final chars = 'abcdef0123456789';
    return List.generate(64, (index) => chars[_random.nextInt(chars.length)]).join();
  }

  String _generateTxHash() {
    final chars = 'abcdef0123456789';
    return '0x${List.generate(64, (index) => chars[_random.nextInt(chars.length)]).join()}';
  }

  Future<void> _registerDeviceOnBlockchain() async {
    // Simulate blockchain registration
    await Future.delayed(const Duration(seconds: 2));
    print('🔒 Device registered on blockchain with token: $_deviceToken');
  }

  Future<void> _storeNotificationOnBlockchain(PushNotification notification) async {
    // Simulate blockchain storage
    await Future.delayed(const Duration(milliseconds: 500));
    print('🔒 Notification stored on blockchain: ${notification.blockchainTxHash}');
  }

  void _startNotificationListener() {
    // Simulate periodic notifications for demo
    Timer.periodic(const Duration(minutes: 5), (timer) {
      if (_random.nextDouble() > 0.7) { // 30% chance every 5 minutes
        _sendRandomNotification();
      }
    });

    // Send initial demo notifications
    _sendInitialDemoNotifications();
  }

  void _sendRandomNotification() {
    final notifications = [
      {
        'title': 'Safety Zone Update',
        'body': 'You are now in a verified safe zone - Guwahati Tourist Area',
        'type': 'safety',
      },
      {
        'title': 'Weather Alert',
        'body': 'Light rain expected in your area in the next 2 hours',
        'type': 'weather',
      },
      {
        'title': 'Profile Verified',
        'body': 'Your tourist profile has been blockchain verified ✅',
        'type': 'blockchain',
      },
    ];

    final notification = notifications[_random.nextInt(notifications.length)];
    
    switch (notification['type']) {
      case 'safety':
        sendSafetyAlert(
          title: notification['title']!,
          body: notification['body']!,
        );
        break;
      case 'weather':
        sendWeatherAlert(
          title: notification['title']!,
          body: notification['body']!,
        );
        break;
      case 'blockchain':
        sendBlockchainNotification(
          title: notification['title']!,
          body: notification['body']!,
          txHash: _generateTxHash(),
        );
        break;
    }
  }

  void _sendInitialDemoNotifications() {
    // Send some demo notifications after initialization
    Timer(const Duration(seconds: 3), () {
      sendBlockchainNotification(
        title: 'Profile Created',
        body: 'Your tourist profile has been successfully created and stored on blockchain',
        txHash: _generateTxHash(),
      );
    });

    Timer(const Duration(seconds: 8), () {
      sendSafetyAlert(
        title: 'Welcome to Guwahati',
        body: 'Safety monitoring is now active. Your current safety score: 92/100',
      );
    });
  }
}
