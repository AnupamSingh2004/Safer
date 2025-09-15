import 'package:flutter/material.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';
import '../widgets/responsive_utils.dart';

class EnhancedChatbotScreen extends StatefulWidget {
  final String userType;
  
  const EnhancedChatbotScreen({
    Key? key,
    required this.userType,
  }) : super(key: key);

  @override
  State<EnhancedChatbotScreen> createState() => _EnhancedChatbotScreenState();
}

class _EnhancedChatbotScreenState extends State<EnhancedChatbotScreen>
    with TickerProviderStateMixin {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  late AnimationController _typingController;
  
  bool _isTyping = false;
  String _selectedLanguage = 'English';
  
  List<String> _supportedLanguages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'
  ];

  List<Map<String, dynamic>> _messages = [
    {
      'text': '🛡️ Hello! I\'m your AI Tourist Safety Assistant. I can help you with emergency procedures, safety information, local guidance, and answer any questions about your safety. How can I assist you today?',
      'isBot': true,
      'timestamp': DateTime.now().subtract(const Duration(minutes: 1)),
      'type': 'welcome',
    }
  ];

  List<Map<String, dynamic>> _quickActions = [
    {
      'text': 'Emergency Help',
      'icon': Icons.emergency,
      'color': EmergencyColorPalette.danger[500],
      'response': '🚨 EMERGENCY PROTOCOL ACTIVATED\n\n1. Stay calm and find a safe location\n2. If immediate danger: Call local emergency services (911/112/100)\n3. Share your location with emergency contacts\n4. I\'m connecting you to emergency services now\n\nYour current safety score: 87/100\nNearest hospital: 0.8km away\nNearest police station: 0.5km away',
    },
    {
      'text': 'Find Safe Places',
      'icon': Icons.place,
      'color': EmergencyColorPalette.secondary[500],
      'response': '🏥 SAFE PLACES NEAR YOU:\n\n• City Hospital - 0.8km (⭐⭐⭐⭐⭐)\n• Police Station - 0.5km (⭐⭐⭐⭐⭐)\n• Tourist Info Center - 0.3km (⭐⭐⭐⭐)\n• Safe Rest Area - 0.6km (⭐⭐⭐⭐)\n• Embassy/Consulate - 2.1km (⭐⭐⭐⭐⭐)\n\nAll locations are well-lit, have CCTV coverage, and 24/7 security. Would you like directions to any of these?',
    },
    {
      'text': 'Local Safety Info',
      'icon': Icons.info,
      'color': EmergencyColorPalette.primary[500],
      'response': '📍 LOCAL SAFETY INFORMATION:\n\n🌍 Current Location: Times Square, NYC\n🔒 Safety Level: HIGH (Safe tourist zone)\n👥 Crowd Level: Medium\n🌤️ Weather: Clear, 22°C\n\n✅ SAFE PRACTICES:\n• Stay in well-lit areas\n• Keep valuables secure\n• Emergency number: 911\n• Tourist police available 24/7\n\n⚠️ AVOID:\n• Isolated areas after dark\n• Unlicensed taxi services\n• Street vendors in certain areas',
    },
    {
      'text': 'Language Help',
      'icon': Icons.translate,
      'color': EmergencyColorPalette.info[500],
      'response': '🗣️ LANGUAGE ASSISTANCE:\n\n🔤 Key Emergency Phrases:\n• "Help me" - "Ayúdame" (Spanish)\n• "I need a doctor" - "मुझे डॉक्टर चाहिए" (Hindi)\n• "Where is hospital?" - "医院在哪里?" (Chinese)\n• "Call police" - "Appelez la police" (French)\n\n🤖 I can translate your messages in real-time to communicate with locals. Just type your message and I\'ll provide translations in the local language!',
    },
  ];

  // Hardcoded intelligent responses
  Map<String, String> _responses = {
    'hello': '👋 Hello! I\'m here to ensure your safety. How can I help you today?',
    'help': '🆘 I can assist with:\n• Emergency procedures\n• Finding safe places\n• Local safety information\n• Language translation\n• Cultural guidance\n\nWhat specific help do you need?',
    'emergency': '🚨 EMERGENCY ACTIVATED!\n\n1. Are you in immediate danger? (Y/N)\n2. What type of emergency?\n3. Current location being tracked\n4. Emergency services being contacted\n\nStay calm, help is on the way!',
    'hospital': '🏥 NEAREST HOSPITALS:\n\n1. City General Hospital\n   📍 0.8km away - 3 min drive\n   ⭐ Rating: 4.8/5\n   📞 Emergency: +1-555-0123\n\n2. Metropolitan Medical Center\n   📍 1.2km away - 5 min drive\n   ⭐ Rating: 4.6/5\n   📞 Emergency: +1-555-0456\n\nWould you like directions or should I call an ambulance?',
    'police': '👮 NEAREST POLICE STATIONS:\n\n1. Central Police Station\n   📍 0.5km away - 2 min walk\n   📞 Non-emergency: +1-555-0789\n   📞 Emergency: 911\n\n2. Tourist Police Unit\n   📍 0.3km away - 1 min walk\n   📞 Direct: +1-555-0321\n   🌐 Multilingual support available\n\nShould I contact them for you?',
    'location': '📍 CURRENT LOCATION ANALYSIS:\n\n🏙️ Area: Times Square, NYC\n🔒 Safety Score: 92/100 (Very Safe)\n👥 Crowd Density: Medium\n🌟 Tourist Rating: ⭐⭐⭐⭐⭐\n🚔 Police Presence: High\n💡 Lighting: Excellent\n📹 CCTV Coverage: 100%\n\n✅ This is a very safe tourist area with excellent emergency services coverage.',
    'weather': '🌤️ WEATHER & SAFETY IMPACT:\n\n📊 Current: Clear, 22°C\n📈 Forecast: Sunny, 18-25°C\n☔ Rain Risk: 10%\n💨 Wind: Light breeze\n\n✅ SAFETY IMPACT:\n• Excellent visibility\n• Safe walking conditions\n• No weather-related risks\n• Perfect for outdoor activities\n\nNo weather-related safety concerns today!',
    'translate': '🌐 TRANSLATION SERVICES:\n\nI can translate between 50+ languages including:\n• English ↔ Spanish\n• English ↔ Hindi\n• English ↔ Chinese\n• English ↔ French\n• English ↔ German\n\nJust type your message and tell me which language you need, or say "translate to [language]" before your message!',
    'food': '🍽️ SAFE EATING RECOMMENDATIONS:\n\n✅ RECOMMENDED:\n• Licensed restaurants with health certificates\n• Hotel restaurants\n• Popular tourist establishments\n• Food courts in malls\n\n⚠️ BE CAUTIOUS:\n• Street vendors (check hygiene)\n• Unlicensed establishments\n• Raw/undercooked food\n• Tap water (use bottled)\n\n🏆 TOP RATED NEARBY:\n1. Grand Plaza Restaurant (0.2km)\n2. Tourist Café Corner (0.4km)\n3. Safe Harbor Diner (0.6km)',
    'transport': '🚗 SAFE TRANSPORTATION:\n\n✅ RECOMMENDED:\n• Official taxis (licensed)\n• Ride-sharing apps (Uber/Lyft)\n• Public transit (subway/bus)\n• Hotel shuttles\n\n⚠️ AVOID:\n• Unlicensed vehicles\n• Solo night travel in remote areas\n• Overcrowded transport\n\n📱 APPS TO USE:\n• Uber/Lyft for rides\n• Citymapper for public transit\n• Google Maps for walking\n\nWould you like me to book a safe ride for you?',
  };

  @override
  void initState() {
    super.initState();
    _typingController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _typingController.dispose();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const ThemeAwareText.heading('🤖 AI Safety Assistant'),
        centerTitle: true,
        actions: [
          DropdownButton<String>(
            value: _selectedLanguage,
            dropdownColor: EmergencyColorPalette.primary[500],
            style: const TextStyle(color: Colors.white),
            underline: Container(),
            items: _supportedLanguages.map((language) {
              return DropdownMenuItem(
                value: language,
                child: Text(language, style: const TextStyle(color: Colors.white)),
              );
            }).toList(),
            onChanged: (value) {
              setState(() => _selectedLanguage = value!);
              _addBotMessage('🌐 Language changed to $_selectedLanguage. I\'ll now respond in your preferred language!');
            },
          ),
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: _showHelpDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          _buildQuickActions(),
          Expanded(
            child: _buildMessageList(),
          ),
          if (_isTyping) _buildTypingIndicator(),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Container(
      height: 120,
      padding: const EdgeInsets.all(12),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _quickActions.length,
        itemBuilder: (context, index) {
          final action = _quickActions[index];
          return Container(
            width: 100,
            margin: const EdgeInsets.only(right: 12),
            child: InkWell(
              onTap: () => _handleQuickAction(action),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      action['color'].withOpacity(0.1),
                      action['color'].withOpacity(0.05),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: action['color'].withOpacity(0.3)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      action['icon'],
                      color: action['color'],
                      size: 28,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      action['text'],
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: EmergencyColorPalette.neutral[700],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMessageList() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final message = _messages[index];
        return _buildMessageBubble(message);
      },
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    bool isBot = message['isBot'] ?? false;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isBot ? MainAxisAlignment.start : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isBot) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: EmergencyColorPalette.primary[500],
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.smart_toy,
                color: Colors.white,
                size: 18,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isBot 
                  ? EmergencyColorPalette.primary[50]
                  : EmergencyColorPalette.secondary[500],
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isBot ? 4 : 16),
                  bottomRight: Radius.circular(isBot ? 16 : 4),
                ),
                border: isBot 
                  ? Border.all(color: EmergencyColorPalette.primary[200]!)
                  : null,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message['text'],
                    style: TextStyle(
                      fontSize: 14,
                      color: isBot 
                        ? EmergencyColorPalette.neutral[800]
                        : Colors.white,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatTimestamp(message['timestamp']),
                    style: TextStyle(
                      fontSize: 10,
                      color: isBot 
                        ? EmergencyColorPalette.neutral[500]
                        : Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (!isBot) ...[
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: EmergencyColorPalette.secondary[500],
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person,
                color: Colors.white,
                size: 18,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: EmergencyColorPalette.primary[500],
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.smart_toy,
              color: Colors.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: EmergencyColorPalette.primary[50],
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: EmergencyColorPalette.primary[200]!),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedBuilder(
                  animation: _typingController,
                  builder: (context, child) {
                    return Row(
                      children: List.generate(3, (index) {
                        double delay = index * 0.2;
                        double animValue = (_typingController.value + delay) % 1.0;
                        return Container(
                          width: 8,
                          height: 8,
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          decoration: BoxDecoration(
                            color: EmergencyColorPalette.primary[500]!.withOpacity(
                              0.3 + (animValue * 0.7),
                            ),
                            shape: BoxShape.circle,
                          ),
                        );
                      }),
                    );
                  },
                ),
                const SizedBox(width: 8),
                Text(
                  'AI is thinking...',
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: EmergencyColorPalette.neutral[200]!),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Ask about safety, emergencies, or local information...',
                hintStyle: TextStyle(color: EmergencyColorPalette.neutral[500]),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide(color: EmergencyColorPalette.neutral[300]!),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                suffixIcon: IconButton(
                  icon: Icon(
                    Icons.emergency,
                    color: EmergencyColorPalette.danger[500],
                  ),
                  onPressed: _sendEmergencyMessage,
                ),
              ),
              maxLines: 3,
              minLines: 1,
              onSubmitted: _sendMessage,
            ),
          ),
          const SizedBox(width: 8),
          FloatingActionButton(
            mini: true,
            onPressed: () => _sendMessage(_messageController.text),
            backgroundColor: EmergencyColorPalette.primary[500],
            child: const Icon(Icons.send, color: Colors.white),
          ),
        ],
      ),
    );
  }

  void _handleQuickAction(Map<String, dynamic> action) {
    _addUserMessage(action['text']);
    _addBotMessage(action['response']);
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    
    _addUserMessage(text);
    _messageController.clear();
    
    // Simulate bot response delay
    _showTyping();
    Future.delayed(const Duration(seconds: 2), () {
      _hideTyping();
      _generateResponse(text.toLowerCase());
    });
  }

  void _sendEmergencyMessage() {
    _addUserMessage('🚨 EMERGENCY - I need immediate help!');
    _generateResponse('emergency');
  }

  void _addUserMessage(String text) {
    setState(() {
      _messages.add({
        'text': text,
        'isBot': false,
        'timestamp': DateTime.now(),
      });
    });
    _scrollToBottom();
  }

  void _addBotMessage(String text) {
    setState(() {
      _messages.add({
        'text': text,
        'isBot': true,
        'timestamp': DateTime.now(),
      });
    });
    _scrollToBottom();
  }

  void _generateResponse(String userInput) {
    String response = 'I understand you\'re asking about "$userInput". Let me help you with that!\n\n';
    
    // Check for keywords and provide appropriate responses
    if (userInput.contains('emergency') || userInput.contains('help') || userInput.contains('urgent')) {
      response = _responses['emergency']!;
    } else if (userInput.contains('hospital') || userInput.contains('medical') || userInput.contains('doctor')) {
      response = _responses['hospital']!;
    } else if (userInput.contains('police') || userInput.contains('security') || userInput.contains('crime')) {
      response = _responses['police']!;
    } else if (userInput.contains('location') || userInput.contains('where') || userInput.contains('address')) {
      response = _responses['location']!;
    } else if (userInput.contains('weather') || userInput.contains('rain') || userInput.contains('temperature')) {
      response = _responses['weather']!;
    } else if (userInput.contains('translate') || userInput.contains('language') || userInput.contains('speak')) {
      response = _responses['translate']!;
    } else if (userInput.contains('food') || userInput.contains('restaurant') || userInput.contains('eat')) {
      response = _responses['food']!;
    } else if (userInput.contains('transport') || userInput.contains('taxi') || userInput.contains('bus') || userInput.contains('ride')) {
      response = _responses['transport']!;
    } else if (userInput.contains('hello') || userInput.contains('hi') || userInput.contains('hey')) {
      response = _responses['hello']!;
    } else {
      // Generic helpful response
      response = '🤖 I\'m here to help with your safety and travel needs!\n\n' +
                'I can assist with:\n' +
                '• Emergency services and procedures\n' +
                '• Finding safe places (hospitals, police, etc.)\n' +
                '• Local safety information\n' +
                '• Language translation\n' +
                '• Transportation guidance\n' +
                '• Food safety recommendations\n' +
                '• Weather and area information\n\n' +
                'Feel free to ask me anything about staying safe during your travels!';
    }
    
    _addBotMessage(response);
  }

  void _showTyping() {
    setState(() => _isTyping = true);
    _typingController.repeat();
    _scrollToBottom();
  }

  void _hideTyping() {
    setState(() => _isTyping = false);
    _typingController.stop();
    _typingController.reset();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${timestamp.day}/${timestamp.month} ${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}';
    }
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.help_outline, color: EmergencyColorPalette.primary[500]),
            const SizedBox(width: 8),
            const Text('AI Assistant Help'),
          ],
        ),
        content: const SingleChildScrollView(
          child: Text(
            '🤖 AI SAFETY ASSISTANT FEATURES:\n\n'
            '🚨 EMERGENCY SUPPORT:\n'
            '• Instant emergency protocols\n'
            '• Emergency services contact\n'
            '• Real-time safety guidance\n\n'
            '🗺️ LOCATION SERVICES:\n'
            '• Find safe places nearby\n'
            '• Navigation assistance\n'
            '• Area safety information\n\n'
            '🌐 LANGUAGE SUPPORT:\n'
            '• Real-time translation\n'
            '• Emergency phrases\n'
            '• 50+ languages supported\n\n'
            '📱 QUICK ACTIONS:\n'
            '• Use the buttons above for common requests\n'
            '• Type any question for detailed help\n'
            '• Emergency button for immediate assistance\n\n'
            'Stay safe and feel free to ask anything!',
          ),
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.primary[500],
            ),
            child: const Text('Got it!'),
          ),
        ],
      ),
    );
  }
}
