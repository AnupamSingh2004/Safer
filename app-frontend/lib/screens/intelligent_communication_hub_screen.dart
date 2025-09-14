import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/emergency_theme.dart';

class IntelligentCommunicationHubScreen extends StatefulWidget {
  const IntelligentCommunicationHubScreen({Key? key}) : super(key: key);

  @override
  State<IntelligentCommunicationHubScreen> createState() => _IntelligentCommunicationHubScreenState();
}

class _IntelligentCommunicationHubScreenState extends State<IntelligentCommunicationHubScreen>
    with TickerProviderStateMixin {
  late AnimationController _voiceController;
  late AnimationController _translationController;
  
  bool _emergencyContactSyncEnabled = true;
  bool _offlineMessagingEnabled = true;
  bool _isListening = false;
  bool _isTranslating = false;

  String _selectedLanguage = 'English';
  String _emergencyMessage = 'I need immediate help. This is an emergency.';
  String _lastTranslation = 'मुझे तत्काल सहायता चाहिए। यह एक आपातकाल है।';
  
  List<String> _supportedLanguages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian'
  ];

  List<Map<String, dynamic>> _communicationChannels = [
    {
      'name': 'Emergency Services',
      'type': 'voice_call',
      'enabled': true,
      'icon': Icons.call,
      'color': EmergencyColorPalette.danger[500],
      'status': 'Ready',
    },
    {
      'name': 'SMS Alert',
      'type': 'sms',
      'enabled': true,
      'icon': Icons.sms,
      'color': EmergencyColorPalette.primary[500],
      'status': 'Active',
    },
    {
      'name': 'WhatsApp',
      'type': 'whatsapp',
      'enabled': true,
      'icon': Icons.chat,
      'color': EmergencyColorPalette.secondary[500],
      'status': 'Connected',
    },
    {
      'name': 'Email Alert',
      'type': 'email',
      'enabled': true,
      'icon': Icons.email,
      'color': EmergencyColorPalette.info[500],
      'status': 'Configured',
    },
    {
      'name': 'Push Notification',
      'type': 'push',
      'enabled': true,
      'icon': Icons.notifications,
      'color': EmergencyColorPalette.warning[500],
      'status': 'Active',
    },
  ];

  List<Map<String, dynamic>> _recentTranslations = [
    {
      'original': 'Where is the nearest hospital?',
      'translated': 'निकटतम अस्पताल कहाँ है?',
      'language': 'Hindi',
      'time': '2 min ago',
    },
    {
      'original': 'I need help',
      'translated': '我需要帮助',
      'language': 'Chinese',
      'time': '5 min ago',
    },
    {
      'original': 'Emergency assistance required',
      'translated': 'Se requiere asistencia de emergencia',
      'language': 'Spanish',
      'time': '10 min ago',
    },
  ];

  @override
  void initState() {
    super.initState();
    _voiceController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    _translationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _voiceController.dispose();
    _translationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🤖 Communication Hub'),
        backgroundColor: EmergencyColorPalette.info[500],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_isListening ? Icons.mic : Icons.mic_none),
            onPressed: _toggleVoiceListening,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showCommunicationSettings,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildVoiceToTextEmergency(),
            const SizedBox(height: 20),
            _buildRealTimeTranslation(),
            const SizedBox(height: 20),
            _buildCommunicationChannels(),
            const SizedBox(height: 20),
            _buildEmergencyContactSync(),
            const SizedBox(height: 20),
            _buildOfflineMessaging(),
            const SizedBox(height: 20),
            _buildRecentTranslations(),
          ],
        ),
      ),
    );
  }

  Widget _buildVoiceToTextEmergency() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AnimatedBuilder(
                  animation: _voiceController,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _isListening ? 1 + (_voiceController.value * 0.2) : 1,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: _isListening 
                            ? EmergencyColorPalette.danger[500]
                            : EmergencyColorPalette.primary[500],
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _isListening ? Icons.mic : Icons.record_voice_over,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Voice-to-Text Emergency SOS',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        _isListening 
                          ? 'Listening for emergency commands...'
                          : 'Speak emergency messages in any language',
                        style: TextStyle(
                          fontSize: 14,
                          color: EmergencyColorPalette.neutral[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _isListening 
                  ? EmergencyColorPalette.danger[50]
                  : EmergencyColorPalette.neutral[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _isListening 
                    ? EmergencyColorPalette.danger[200]!
                    : EmergencyColorPalette.neutral[200]!,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Emergency Message Template:',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: EmergencyColorPalette.neutral[700],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _emergencyMessage,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _activateVoiceEmergency,
                    icon: Icon(_isListening ? Icons.stop : Icons.mic),
                    label: Text(_isListening ? 'Stop Listening' : 'Start Voice SOS'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isListening 
                        ? EmergencyColorPalette.danger[500]
                        : EmergencyColorPalette.primary[500],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton(
                  onPressed: _customizeEmergencyMessage,
                  child: const Text('Customize'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRealTimeTranslation() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AnimatedBuilder(
                  animation: _translationController,
                  builder: (context, child) {
                    return Transform.rotate(
                      angle: _isTranslating ? _translationController.value * 2 * 3.14159 : 0,
                      child: Icon(
                        Icons.translate,
                        color: EmergencyColorPalette.secondary[500],
                        size: 24,
                      ),
                    );
                  },
                ),
                const SizedBox(width: 8),
                const Text(
                  'Real-Time Language Translation',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedLanguage,
                    decoration: InputDecoration(
                      labelText: 'Target Language',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    items: _supportedLanguages.map((language) {
                      return DropdownMenuItem(
                        value: language,
                        child: Text(language),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() => _selectedLanguage = value!);
                      _translateMessage();
                    },
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton.icon(
                  onPressed: _translateMessage,
                  icon: const Icon(Icons.translate),
                  label: const Text('Translate'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: EmergencyColorPalette.secondary[500],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    EmergencyColorPalette.secondary[50]!,
                    EmergencyColorPalette.primary[50]!,
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: EmergencyColorPalette.secondary[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Original (English):',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: EmergencyColorPalette.neutral[700],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _emergencyMessage,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Divider(height: 20),
                  Text(
                    'Translated ($_selectedLanguage):',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: EmergencyColorPalette.neutral[700],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _lastTranslation,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: EmergencyColorPalette.secondary[700],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCommunicationChannels() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.hub,
                  color: EmergencyColorPalette.warning[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Multi-Channel Alert Broadcasting',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...(_communicationChannels.map((channel) => _buildChannelItem(channel))),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _testAllChannels,
                    icon: const Icon(Icons.send),
                    label: const Text('Test All Channels'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmergencyColorPalette.warning[500],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: _emergencyBroadcast,
                  icon: const Icon(Icons.emergency),
                  label: const Text('Emergency Broadcast'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChannelItem(Map<String, dynamic> channel) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: channel['enabled'] 
          ? channel['color'].withOpacity(0.1)
          : EmergencyColorPalette.neutral[100],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: channel['enabled'] 
            ? channel['color'].withOpacity(0.3)
            : EmergencyColorPalette.neutral[300]!,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: channel['enabled'] 
                ? channel['color'].withOpacity(0.2)
                : EmergencyColorPalette.neutral[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              channel['icon'],
              color: channel['enabled'] 
                ? channel['color']
                : EmergencyColorPalette.neutral[400],
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  channel['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  'Status: ${channel['status']}',
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: channel['enabled'],
            onChanged: (value) {
              setState(() => channel['enabled'] = value);
            },
            activeColor: channel['color'],
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyContactSync() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.sync,
                  color: EmergencyColorPalette.info[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Emergency Contact Network Sync',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildSyncFeature(
              'Auto-sync with family/friends',
              'Automatically keep emergency contacts updated',
              Icons.family_restroom,
              _emergencyContactSyncEnabled,
              (value) => setState(() => _emergencyContactSyncEnabled = value),
            ),
            _buildSyncFeature(
              'Cross-platform synchronization',
              'Sync contacts across all devices',
              Icons.devices,
              true,
              null,
            ),
            _buildSyncFeature(
              'Real-time status updates',
              'Get instant updates on contact availability',
              Icons.update,
              true,
              null,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildSyncStat('Synced Contacts', '12'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSyncStat('Last Sync', '5 min ago'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSyncStat('Sync Status', 'Active'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSyncFeature(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool)? onChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: value 
                ? EmergencyColorPalette.info[100]
                : EmergencyColorPalette.neutral[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: value 
                ? EmergencyColorPalette.info[500]
                : EmergencyColorPalette.neutral[400],
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ],
            ),
          ),
          if (onChanged != null)
            Switch(
              value: value,
              onChanged: onChanged,
              activeColor: EmergencyColorPalette.info[500],
            )
          else
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: EmergencyColorPalette.secondary[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'ACTIVE',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: EmergencyColorPalette.secondary[600],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSyncStat(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: EmergencyColorPalette.info[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: EmergencyColorPalette.info[200]!),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: EmergencyColorPalette.info[600],
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: EmergencyColorPalette.neutral[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildOfflineMessaging() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.offline_bolt,
                  color: EmergencyColorPalette.warning[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Offline Emergency Messaging',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: EmergencyColorPalette.warning[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: EmergencyColorPalette.warning[200]!),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.device_hub,
                        color: EmergencyColorPalette.warning[600],
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Mesh Networking for Remote Areas',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildMeshStat('Connected Devices', '8'),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMeshStat('Network Range', '2.5 km'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _enableMeshNetwork,
                    icon: const Icon(Icons.network_check),
                    label: const Text('Enable Mesh'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _offlineMessagingEnabled 
                        ? EmergencyColorPalette.secondary[500]
                        : EmergencyColorPalette.warning[500],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: _testOfflineMessage,
                  icon: const Icon(Icons.send),
                  label: const Text('Test Message'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMeshStat(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: EmergencyColorPalette.warning[100],
        borderRadius: BorderRadius.circular(6),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: EmergencyColorPalette.warning[700],
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: EmergencyColorPalette.neutral[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTranslations() {
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
                      'Recent Translations',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: _clearTranslationHistory,
                  child: const Text('Clear'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...(_recentTranslations.map((translation) => _buildTranslationItem(translation))),
          ],
        ),
      ),
    );
  }

  Widget _buildTranslationItem(Map<String, dynamic> translation) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: EmergencyColorPalette.neutral[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: EmergencyColorPalette.neutral[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                translation['language'],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: EmergencyColorPalette.primary[600],
                ),
              ),
              Text(
                translation['time'],
                style: TextStyle(
                  fontSize: 10,
                  color: EmergencyColorPalette.neutral[500],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            translation['original'],
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            translation['translated'],
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: EmergencyColorPalette.secondary[700],
            ),
          ),
        ],
      ),
    );
  }

  void _toggleVoiceListening() {
    setState(() => _isListening = !_isListening);
    
    if (_isListening) {
      _voiceController.repeat(reverse: true);
      HapticFeedback.mediumImpact();
    } else {
      _voiceController.stop();
      _voiceController.reset();
    }
  }

  void _activateVoiceEmergency() {
    _toggleVoiceListening();
    
    if (_isListening) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('🎤 Voice emergency mode activated - Say "Help" 3 times'),
          backgroundColor: EmergencyColorPalette.danger[500],
        ),
      );
    }
  }

  void _translateMessage() {
    setState(() => _isTranslating = true);
    _translationController.repeat();
    
    // Simulate translation delay
    Future.delayed(const Duration(seconds: 2), () {
      setState(() => _isTranslating = false);
      _translationController.stop();
      _translationController.reset();
      
      // Mock translation based on selected language
      _updateTranslation();
    });
  }

  void _updateTranslation() {
    Map<String, String> translations = {
      'Hindi': 'मुझे तत्काल सहायता चाहिए। यह एक आपातकाल है।',
      'Spanish': 'Necesito ayuda inmediata. Esta es una emergencia.',
      'French': "J'ai besoin d'aide immédiate. C'est une urgence.",
      'German': 'Ich brauche sofortige Hilfe. Das ist ein Notfall.',
      'Chinese': '我需要立即帮助。这是紧急情况。',
      'Japanese': '緊急事態です。すぐに助けが必要です。',
      'Arabic': 'أحتاج مساعدة فورية. هذه حالة طارئة.',
    };
    
    setState(() {
      _lastTranslation = translations[_selectedLanguage] ?? _emergencyMessage;
    });
  }

  void _customizeEmergencyMessage() {
    // Show dialog to customize emergency message
  }

  void _testAllChannels() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('📡 Testing all communication channels...'),
        backgroundColor: EmergencyColorPalette.warning[500],
      ),
    );
  }

  void _emergencyBroadcast() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.warning, color: EmergencyColorPalette.danger[500]),
            const SizedBox(width: 8),
            const Text('Emergency Broadcast'),
          ],
        ),
        content: const Text('This will send emergency alerts to all configured channels. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _sendEmergencyBroadcast();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.danger[500],
            ),
            child: const Text('Send Alert'),
          ),
        ],
      ),
    );
  }

  void _sendEmergencyBroadcast() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🚨 Emergency broadcast sent to all channels'),
        backgroundColor: EmergencyColorPalette.danger[500],
      ),
    );
  }

  void _enableMeshNetwork() {
    setState(() => _offlineMessagingEnabled = !_offlineMessagingEnabled);
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_offlineMessagingEnabled 
          ? '🌐 Mesh network enabled for offline messaging'
          : '📴 Mesh network disabled'),
        backgroundColor: _offlineMessagingEnabled 
          ? EmergencyColorPalette.secondary[500]
          : EmergencyColorPalette.neutral[500],
      ),
    );
  }

  void _testOfflineMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('📨 Testing offline message delivery...'),
        backgroundColor: EmergencyColorPalette.info[500],
      ),
    );
  }

  void _clearTranslationHistory() {
    setState(() => _recentTranslations.clear());
  }

  void _showCommunicationSettings() {
    // Show communication settings dialog
  }
}
