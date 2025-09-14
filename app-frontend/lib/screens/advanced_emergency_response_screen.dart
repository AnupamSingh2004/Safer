import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/emergency_theme.dart';

class AdvancedEmergencyResponseScreen extends StatefulWidget {
  const AdvancedEmergencyResponseScreen({Key? key}) : super(key: key);

  @override
  State<AdvancedEmergencyResponseScreen> createState() => _AdvancedEmergencyResponseScreenState();
}

class _AdvancedEmergencyResponseScreenState extends State<AdvancedEmergencyResponseScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _shakeController;
  
  bool _silentModeEnabled = false;
  bool _videoRecordingEnabled = true;
  bool _audioStreamingEnabled = true;
  bool _blockchainLoggingEnabled = true;
  bool _emergencyActive = false;

  List<Map<String, dynamic>> _emergencyContacts = [
    {'name': 'Emergency Services', 'number': '911', 'priority': 1, 'type': 'official'},
    {'name': 'Local Police', 'number': '100', 'priority': 2, 'type': 'official'},
    {'name': 'Family - Mom', 'number': '+1234567890', 'priority': 3, 'type': 'family'},
    {'name': 'Close Friend', 'number': '+0987654321', 'priority': 4, 'type': 'friend'},
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..repeat(reverse: true);
    
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _shakeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🚨 Emergency Response'),
        backgroundColor: EmergencyColorPalette.danger[500],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_silentModeEnabled ? Icons.volume_off : Icons.volume_up),
            onPressed: () => setState(() => _silentModeEnabled = !_silentModeEnabled),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildEmergencyPanicButton(),
            const SizedBox(height: 24),
            _buildEmergencyModeSelector(),
            const SizedBox(height: 20),
            _buildEmergencyFeatures(),
            const SizedBox(height: 20),
            _buildEmergencyContactsHierarchy(),
            const SizedBox(height: 20),
            _buildEmergencySettings(),
          ],
        ),
      ),
    );
  }

  Widget _buildEmergencyPanicButton() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: RadialGradient(
          colors: [
            EmergencyColorPalette.danger[50]!,
            EmergencyColorPalette.danger[100]!,
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: EmergencyColorPalette.danger[200]!),
      ),
      child: Column(
        children: [
          Text(
            _emergencyActive ? 'EMERGENCY ACTIVE' : 'EMERGENCY PANIC BUTTON',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: EmergencyColorPalette.danger[700],
            ),
          ),
          const SizedBox(height: 24),
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Transform.scale(
                scale: _emergencyActive ? 1 + (_pulseController.value * 0.1) : 1,
                child: GestureDetector(
                  onTap: _handleEmergencyActivation,
                  onLongPress: _activateEmergency,
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _emergencyActive 
                        ? EmergencyColorPalette.danger[600]
                        : EmergencyColorPalette.danger[500],
                      boxShadow: [
                        BoxShadow(
                          color: EmergencyColorPalette.danger[300]!,
                          blurRadius: _emergencyActive ? 20 : 10,
                          spreadRadius: _emergencyActive ? 5 : 2,
                        ),
                      ],
                    ),
                    child: Icon(
                      _emergencyActive ? Icons.stop : Icons.warning,
                      size: 48,
                      color: Colors.white,
                    ),
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Text(
            _emergencyActive 
              ? 'Tap to stop emergency\nLong press to continue'
              : 'Tap to test\nLong press to activate',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: EmergencyColorPalette.neutral[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyModeSelector() {
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
                  color: EmergencyColorPalette.primary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Emergency Activation Modes',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildActivationMode(
              'Button Press',
              'Long press the panic button',
              Icons.touch_app,
              true,
            ),
            _buildActivationMode(
              'Shake Gesture',
              'Shake device vigorously 3 times',
              Icons.vibration,
              true,
            ),
            _buildActivationMode(
              'Voice Command',
              'Say "Emergency Help" 3 times',
              Icons.record_voice_over,
              true,
            ),
            _buildActivationMode(
              'Hardware Button',
              'Press volume down + power 5 times',
              Icons.phonelink,
              false,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivationMode(String title, String description, IconData icon, bool enabled) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: enabled 
                ? EmergencyColorPalette.secondary[100]
                : EmergencyColorPalette.neutral[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: enabled 
                ? EmergencyColorPalette.secondary[500]
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
                  description,
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: enabled,
            onChanged: (value) {
              // Handle mode toggle
            },
            activeColor: EmergencyColorPalette.secondary[500],
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
                  Icons.featured_play_list,
                  color: EmergencyColorPalette.warning[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Emergency Features',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildFeatureToggle(
              'Silent Emergency Mode',
              'Stealth emergency activation without alerts',
              Icons.volume_off,
              _silentModeEnabled,
              (value) => setState(() => _silentModeEnabled = value),
            ),
            _buildFeatureToggle(
              'Automatic Video Recording',
              'Background emergency documentation',
              Icons.videocam,
              _videoRecordingEnabled,
              (value) => setState(() => _videoRecordingEnabled = value),
            ),
            _buildFeatureToggle(
              'Live Audio Streaming',
              'Real-time audio to emergency contacts',
              Icons.mic,
              _audioStreamingEnabled,
              (value) => setState(() => _audioStreamingEnabled = value),
            ),
            _buildFeatureToggle(
              'Emergency Blockchain Logging',
              'Immutable emergency evidence',
              Icons.security,
              _blockchainLoggingEnabled,
              (value) => setState(() => _blockchainLoggingEnabled = value),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureToggle(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool) onChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: value 
                ? EmergencyColorPalette.warning[100]
                : EmergencyColorPalette.neutral[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: value 
                ? EmergencyColorPalette.warning[500]
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
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: EmergencyColorPalette.warning[500],
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyContactsHierarchy() {
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
                      Icons.contacts,
                      color: EmergencyColorPalette.info[500],
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Emergency Contact Hierarchy',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                TextButton.icon(
                  onPressed: _addEmergencyContact,
                  icon: const Icon(Icons.add),
                  label: const Text('Add'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...(_emergencyContacts.asMap().entries.map((entry) {
              int index = entry.key;
              Map<String, dynamic> contact = entry.value;
              return _buildContactItem(contact, index + 1);
            })),
          ],
        ),
      ),
    );
  }

  Widget _buildContactItem(Map<String, dynamic> contact, int priority) {
    Color typeColor = _getContactTypeColor(contact['type']);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: typeColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: typeColor.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: typeColor,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '$priority',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  contact['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  contact['number'],
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: typeColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              contact['type'].toUpperCase(),
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: typeColor,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.call, size: 20),
            onPressed: () => _callContact(contact),
            color: EmergencyColorPalette.secondary[500],
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencySettings() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.settings,
                  color: EmergencyColorPalette.neutral[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Emergency Settings',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildSettingItem(
              'Auto-Call Delay',
              '10 seconds',
              Icons.timer,
              () => _showDelaySettings(),
            ),
            _buildSettingItem(
              'Location Sharing',
              'Always enabled during emergency',
              Icons.location_on,
              () => _showLocationSettings(),
            ),
            _buildSettingItem(
              'Emergency Message Template',
              'Customize automatic messages',
              Icons.message,
              () => _showMessageSettings(),
            ),
            _buildSettingItem(
              'Biometric Verification',
              'Fingerprint to cancel emergency',
              Icons.fingerprint,
              () => _showBiometricSettings(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingItem(String title, String subtitle, IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: EmergencyColorPalette.neutral[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: EmergencyColorPalette.neutral[500],
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
            Icon(
              Icons.chevron_right,
              color: EmergencyColorPalette.neutral[400],
            ),
          ],
        ),
      ),
    );
  }

  Color _getContactTypeColor(String type) {
    switch (type) {
      case 'official':
        return EmergencyColorPalette.danger[500]!;
      case 'family':
        return EmergencyColorPalette.secondary[500]!;
      case 'friend':
        return EmergencyColorPalette.primary[500]!;
      default:
        return EmergencyColorPalette.neutral[500]!;
    }
  }

  void _handleEmergencyActivation() {
    if (_emergencyActive) {
      _deactivateEmergency();
    } else {
      _showEmergencyTest();
    }
  }

  void _activateEmergency() {
    HapticFeedback.heavyImpact();
    setState(() => _emergencyActive = true);
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🚨 EMERGENCY ACTIVATED - Contacting emergency services...'),
        backgroundColor: EmergencyColorPalette.danger[500],
        duration: const Duration(seconds: 5),
        action: SnackBarAction(
          label: 'CANCEL',
          textColor: Colors.white,
          onPressed: _deactivateEmergency,
        ),
      ),
    );
  }

  void _deactivateEmergency() {
    setState(() => _emergencyActive = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Emergency deactivated'),
        backgroundColor: EmergencyColorPalette.secondary[500],
      ),
    );
  }

  void _showEmergencyTest() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.warning, color: EmergencyColorPalette.warning[500]),
            const SizedBox(width: 8),
            const Text('Test Emergency System'),
          ],
        ),
        content: const Text('This will test the emergency system without contacting authorities. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _runEmergencyTest();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.warning[500],
            ),
            child: const Text('Test'),
          ),
        ],
      ),
    );
  }

  void _runEmergencyTest() {
    // Simulate emergency test
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🧪 Running emergency system test...'),
        backgroundColor: EmergencyColorPalette.info[500],
      ),
    );
  }

  void _addEmergencyContact() {
    // Navigate to add contact screen
  }

  void _callContact(Map<String, dynamic> contact) {
    // Implement calling functionality
  }

  void _showDelaySettings() {
    // Show delay configuration dialog
  }

  void _showLocationSettings() {
    // Show location settings dialog
  }

  void _showMessageSettings() {
    // Show message template settings
  }

  void _showBiometricSettings() {
    // Show biometric verification settings
  }
}
