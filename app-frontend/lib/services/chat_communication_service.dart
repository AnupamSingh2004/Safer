import 'dart:async';

/// 💬 Chat Message Model - Enhanced for SIH 2025 Demo
class ChatMessage {
  final String id;
  final String senderId;
  final String senderName;
  final String senderType; // 'tourist', 'government', 'emergency', 'system'
  final String message;
  final DateTime timestamp;
  final bool isRead;
  final String? attachmentUrl;
  final String? attachmentType; // 'image', 'video', 'document', 'location'
  final Map<String, dynamic>? metadata;
  final String? blockchainTxHash; // 🔒 BLOCKCHAIN TRANSACTION HASH
  final String priority; // 'low', 'medium', 'high', 'emergency'
  final String? translatedMessage; // For multi-language support
  final String? originalLanguage;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.senderType,
    required this.message,
    required this.timestamp,
    this.isRead = false,
    this.attachmentUrl,
    this.attachmentType,
    this.metadata,
    this.blockchainTxHash,
    this.priority = 'medium',
    this.translatedMessage,
    this.originalLanguage,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      senderId: json['senderId'],
      senderName: json['senderName'],
      senderType: json['senderType'],
      message: json['message'],
      timestamp: DateTime.parse(json['timestamp']),
      isRead: json['isRead'] ?? false,
      attachmentUrl: json['attachmentUrl'],
      attachmentType: json['attachmentType'],
      metadata: json['metadata'],
      blockchainTxHash: json['blockchainTxHash'],
      priority: json['priority'] ?? 'medium',
      translatedMessage: json['translatedMessage'],
      originalLanguage: json['originalLanguage'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'senderId': senderId,
      'senderName': senderName,
      'senderType': senderType,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
      'attachmentUrl': attachmentUrl,
      'attachmentType': attachmentType,
      'metadata': metadata,
      'blockchainTxHash': blockchainTxHash,
      'priority': priority,
      'translatedMessage': translatedMessage,
      'originalLanguage': originalLanguage,
    };
  }

  ChatMessage copyWith({
    bool? isRead,
    String? translatedMessage,
    Map<String, dynamic>? metadata,
  }) {
    return ChatMessage(
      id: id,
      senderId: senderId,
      senderName: senderName,
      senderType: senderType,
      message: message,
      timestamp: timestamp,
      isRead: isRead ?? this.isRead,
      attachmentUrl: attachmentUrl,
      attachmentType: attachmentType,
      metadata: metadata ?? this.metadata,
      blockchainTxHash: blockchainTxHash,
      priority: priority,
      translatedMessage: translatedMessage ?? this.translatedMessage,
      originalLanguage: originalLanguage,
    );
  }
}

/// 💬 Chat Channel Model
class ChatChannel {
  final String id;
  final String name;
  final String type; // 'emergency', 'general', 'tourism_support', 'government'
  final List<String> participants;
  final DateTime createdAt;
  final DateTime lastMessageAt;
  final bool isActive;
  final Map<String, dynamic> metadata;

  ChatChannel({
    required this.id,
    required this.name,
    required this.type,
    required this.participants,
    required this.createdAt,
    required this.lastMessageAt,
    this.isActive = true,
    this.metadata = const {},
  });

  factory ChatChannel.fromJson(Map<String, dynamic> json) {
    return ChatChannel(
      id: json['id'],
      name: json['name'],
      type: json['type'],
      participants: List<String>.from(json['participants']),
      createdAt: DateTime.parse(json['createdAt']),
      lastMessageAt: DateTime.parse(json['lastMessageAt']),
      isActive: json['isActive'] ?? true,
      metadata: json['metadata'] ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'participants': participants,
      'createdAt': createdAt.toIso8601String(),
      'lastMessageAt': lastMessageAt.toIso8601String(),
      'isActive': isActive,
      'metadata': metadata,
    };
  }
}

/// 💬 Chat Communication Service - Blockchain Enhanced
/// Handles tourist-government communication and emergency channels
class ChatCommunicationService {
  static final ChatCommunicationService _instance = ChatCommunicationService._internal();
  factory ChatCommunicationService() => _instance;
  ChatCommunicationService._internal();

  final StreamController<ChatMessage> _messageController = 
      StreamController<ChatMessage>.broadcast();
  final StreamController<ChatChannel> _channelController = 
      StreamController<ChatChannel>.broadcast();

  final List<ChatMessage> _messages = [];
  final List<ChatChannel> _channels = [];
  final Map<String, List<ChatMessage>> _channelMessages = {};

  String _currentUserId = 'tourist_demo_2025';
  String _currentUserName = 'Rajesh Kumar';
  String _preferredLanguage = 'English';

  /// Stream of new messages
  Stream<ChatMessage> get messageStream => _messageController.stream;
  
  /// Stream of channel updates
  Stream<ChatChannel> get channelStream => _channelController.stream;

  /// Initialize chat service
  Future<void> initialize() async {
    await Future.delayed(const Duration(seconds: 1));
    
    // Create default channels
    await _createDefaultChannels();
    
    // Send welcome messages
    await _sendWelcomeMessages();
    
    // Start auto-response system
    _startAutoResponseSystem();
    
    print('💬 Chat Communication Service Initialized');
    print('🔒 BLOCKCHAIN SECURED MESSAGING');
  }

  /// Get all available channels
  List<ChatChannel> getChannels() => List.unmodifiable(_channels);

  /// Get messages for a specific channel
  List<ChatMessage> getChannelMessages(String channelId) {
    return List.unmodifiable(_channelMessages[channelId] ?? []);
  }

  /// Send a message to a channel
  Future<void> sendMessage({
    required String channelId,
    required String message,
    String? attachmentUrl,
    String? attachmentType,
    Map<String, dynamic>? metadata,
  }) async {
    final chatMessage = ChatMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
      senderId: _currentUserId,
      senderName: _currentUserName,
      senderType: 'tourist',
      message: message,
      timestamp: DateTime.now(),
      attachmentUrl: attachmentUrl,
      attachmentType: attachmentType,
      metadata: metadata,
      blockchainTxHash: _generateTxHash(),
      priority: _determinePriority(message),
    );

    // Store message
    _channelMessages[channelId] ??= [];
    _channelMessages[channelId]!.insert(0, chatMessage);
    _messages.insert(0, chatMessage);

    // Update channel last message time
    final channelIndex = _channels.indexWhere((c) => c.id == channelId);
    if (channelIndex != -1) {
      // In real implementation, create a copyWith method for ChatChannel
    }

    // Store on blockchain (simulate)
    await _storeMessageOnBlockchain(chatMessage);

    // Emit message
    _messageController.add(chatMessage);

    // Trigger auto-response
    _triggerAutoResponse(channelId, message);

    print('💬 Message sent to channel $channelId: $message');
  }

  /// Send emergency message
  Future<void> sendEmergencyMessage({
    required String message,
    required String location,
    Map<String, dynamic>? emergencyData,
  }) async {
    // Create emergency channel if not exists
    const emergencyChannelId = 'emergency_channel';
    if (!_channels.any((c) => c.id == emergencyChannelId)) {
      await _createEmergencyChannel();
    }

    await sendMessage(
      channelId: emergencyChannelId,
      message: '🚨 EMERGENCY: $message\n📍 Location: $location',
      metadata: {
        'type': 'emergency',
        'location': location,
        'emergencyData': emergencyData,
        'timestamp': DateTime.now().toIso8601String(),
      },
    );

    // Send immediate emergency response
    Timer(const Duration(seconds: 2), () {
      _sendSystemMessage(
        channelId: emergencyChannelId,
        message: '🚨 EMERGENCY RECEIVED\n\n✅ Your emergency alert has been logged\n📞 Emergency services have been notified\n📍 Your location is being tracked\n⏰ Response team ETA: 8-12 minutes\n\nStay calm and wait for assistance.',
        senderName: 'Emergency Response System',
        priority: 'emergency',
      );
    });
  }

  /// Translate message to preferred language
  Future<String> translateMessage(String message, String targetLanguage) async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Mock translation (in real app, use Google Translate API)
    final translations = {
      'Hello': {
        'Hindi': 'नमस्ते',
        'Bengali': 'হ্যালো',
        'Assamese': 'নমস্কাৰ',
      },
      'Emergency': {
        'Hindi': 'आपातकाल',
        'Bengali': 'জরুরি',
        'Assamese': 'জৰুৰীকালীন',
      },
      'Help': {
        'Hindi': 'सहायता',
        'Bengali': 'সাহায্য',
        'Assamese': 'সহায়',
      },
    };

    for (String word in translations.keys) {
      if (message.contains(word) && translations[word]![targetLanguage] != null) {
        message = message.replaceAll(word, translations[word]![targetLanguage]!);
      }
    }

    return message;
  }

  /// Mark messages as read
  Future<void> markMessagesAsRead(String channelId, List<String> messageIds) async {
    for (String messageId in messageIds) {
      final messages = _channelMessages[channelId] ?? [];
      final index = messages.indexWhere((m) => m.id == messageId);
      if (index != -1) {
        _channelMessages[channelId]![index] = messages[index].copyWith(isRead: true);
      }
    }
  }

  /// Get unread message count
  int getUnreadCount(String channelId) {
    final messages = _channelMessages[channelId] ?? [];
    return messages.where((m) => !m.isRead && m.senderId != _currentUserId).length;
  }

  /// Set preferred language
  void setPreferredLanguage(String language) {
    _preferredLanguage = language;
  }

  /// Dispose service
  void dispose() {
    _messageController.close();
    _channelController.close();
  }

  // Private methods
  Future<void> _createDefaultChannels() async {
    final channels = [
      ChatChannel(
        id: 'tourism_support',
        name: '🏛️ Tourism Support',
        type: 'tourism_support',
        participants: [_currentUserId, 'tourism_officer_001'],
        createdAt: DateTime.now(),
        lastMessageAt: DateTime.now(),
        metadata: {'description': 'General tourism assistance and information'},
      ),
      ChatChannel(
        id: 'government_services',
        name: '🏛️ Government Services',
        type: 'government',
        participants: [_currentUserId, 'govt_officer_001'],
        createdAt: DateTime.now(),
        lastMessageAt: DateTime.now(),
        metadata: {'description': 'Official government services and documentation'},
      ),
      ChatChannel(
        id: 'safety_assistance',
        name: '🛡️ Safety Assistance',
        type: 'general',
        participants: [_currentUserId, 'safety_officer_001'],
        createdAt: DateTime.now(),
        lastMessageAt: DateTime.now(),
        metadata: {'description': 'Safety guidance and assistance'},
      ),
    ];

    _channels.addAll(channels);
    
    for (var channel in channels) {
      _channelMessages[channel.id] = [];
    }
  }

  Future<void> _createEmergencyChannel() async {
    final emergencyChannel = ChatChannel(
      id: 'emergency_channel',
      name: '🚨 Emergency Response',
      type: 'emergency',
      participants: [_currentUserId, 'emergency_responder_001'],
      createdAt: DateTime.now(),
      lastMessageAt: DateTime.now(),
      metadata: {'description': 'Emergency response and coordination'},
    );

    _channels.insert(0, emergencyChannel);
    _channelMessages[emergencyChannel.id] = [];
    _channelController.add(emergencyChannel);
  }

  Future<void> _sendWelcomeMessages() async {
    await Future.delayed(const Duration(seconds: 2));

    await _sendSystemMessage(
      channelId: 'tourism_support',
      message: '🙏 Welcome to Guwahati, Rajesh!\n\nI\'m your dedicated tourism support officer. I can help you with:\n\n🗺️ Local attractions and guides\n🍽️ Restaurant recommendations\n🚌 Transportation options\n🏨 Accommodation assistance\n📞 Emergency contacts\n\nFeel free to ask me anything!',
      senderName: 'Tourism Officer Priya',
    );

    await Future.delayed(const Duration(seconds: 3));

    await _sendSystemMessage(
      channelId: 'safety_assistance',
      message: '🛡️ Safety Monitoring Active\n\nYour current safety status:\n\n✅ Location: Safe Zone (Guwahati Tourist Area)\n⭐ Safety Score: 92/100\n🔒 Blockchain Verified Profile\n📱 Emergency Features Enabled\n\nI\'ll keep you updated on any safety alerts in your area.',
      senderName: 'Safety AI Assistant',
    );
  }

  Future<void> _sendSystemMessage({
    required String channelId,
    required String message,
    required String senderName,
    String priority = 'medium',
  }) async {
    final systemMessage = ChatMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
      senderId: 'system_${channelId}',
      senderName: senderName,
      senderType: 'system',
      message: message,
      timestamp: DateTime.now(),
      blockchainTxHash: _generateTxHash(),
      priority: priority,
    );

    _channelMessages[channelId] ??= [];
    _channelMessages[channelId]!.insert(0, systemMessage);
    _messages.insert(0, systemMessage);

    await _storeMessageOnBlockchain(systemMessage);
    _messageController.add(systemMessage);
  }

  void _startAutoResponseSystem() {
    // Auto-respond to certain keywords
    messageStream.listen((message) {
      if (message.senderId == _currentUserId) {
        Timer(const Duration(seconds: 2), () {
          _generateAutoResponse(message);
        });
      }
    });
  }

  void _triggerAutoResponse(String channelId, String message) {
    // Will be handled by the auto-response system
  }

  void _generateAutoResponse(ChatMessage userMessage) {
    final message = userMessage.message.toLowerCase();
    String? response;
    String senderName = 'AI Assistant';

    if (message.contains('help') || message.contains('assistance')) {
      response = '🤝 I\'m here to help! Please let me know what specific assistance you need, and I\'ll connect you with the right person or provide the information you\'re looking for.';
    } else if (message.contains('emergency') || message.contains('urgent')) {
      response = '🚨 I understand this is urgent. If this is a life-threatening emergency, please call 112 immediately. Otherwise, I\'m here to assist you right away.';
      senderName = 'Emergency Response Team';
    } else if (message.contains('location') || message.contains('where')) {
      response = '📍 Based on your GPS, you\'re currently in Guwahati Tourist Area. This is a verified safe zone with 24/7 monitoring. Would you like directions to any specific location?';
    } else if (message.contains('food') || message.contains('restaurant')) {
      response = '🍽️ Great choice! Guwahati has amazing local cuisine. I recommend trying traditional Assamese dishes. Would you like me to suggest some nearby restaurants with high safety ratings?';
    } else if (message.contains('thank')) {
      response = '🙏 You\'re very welcome! I\'m glad I could help. Feel free to reach out anytime during your stay in Guwahati. Have a wonderful and safe trip!';
    }

    if (response != null) {
      _sendSystemMessage(
        channelId: userMessage.metadata?['channelId'] ?? 'tourism_support',
        message: response,
        senderName: senderName,
      );
    }
  }

  String _generateTxHash() {
    return '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16)}';
  }

  String _determinePriority(String message) {
    final lowerMessage = message.toLowerCase();
    if (lowerMessage.contains('emergency') || lowerMessage.contains('urgent') || lowerMessage.contains('help')) {
      return 'high';
    } else if (lowerMessage.contains('important') || lowerMessage.contains('need')) {
      return 'medium';
    }
    return 'low';
  }

  Future<void> _storeMessageOnBlockchain(ChatMessage message) async {
    await Future.delayed(const Duration(milliseconds: 300));
    print('🔒 Message stored on blockchain: ${message.blockchainTxHash}');
  }
}
