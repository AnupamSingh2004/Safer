import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'dart:async';
import 'dart:math';
import '../theme/emergency_theme.dart';
import '../services/notification_service.dart';

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
  bool _shakeToActivateEnabled = true;
  
  // Shake detection variables
  StreamSubscription<AccelerometerEvent>? _accelerometerSubscription;
  List<double> _shakeBuffer = [];
  DateTime _lastShakeTime = DateTime.now();
  int _shakeCount = 0;

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
    
    _initShakeDetection();
  }
  
  void _initShakeDetection() {
    if (_shakeToActivateEnabled) {
      _accelerometerSubscription = accelerometerEvents.listen((AccelerometerEvent event) {
        _onAccelerometerEvent(event);
      });
    }
  }
  
  void _onAccelerometerEvent(AccelerometerEvent event) {
    // Calculate shake intensity
    double intensity = sqrt(event.x * event.x + event.y * event.y + event.z * event.z);
    
    // Detect significant shake (threshold around 15-20)
    if (intensity > 18.0) {
      DateTime now = DateTime.now();
      
      // Check if this shake is within reasonable time from last shake
      if (now.difference(_lastShakeTime).inMilliseconds > 200) {
        _shakeCount++;
        _lastShakeTime = now;
        
        // If 3 shakes detected within 2 seconds, trigger emergency
        if (_shakeCount >= 3) {
          _shakeCount = 0; // Reset counter
          if (!_emergencyActive) {
            _activateEmergency();
          }
        }
      }
      
      // Reset shake count if too much time has passed
      if (now.difference(_lastShakeTime).inSeconds > 2) {
        _shakeCount = 0;
      }
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _shakeController.dispose();
    _accelerometerSubscription?.cancel();
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
          const SizedBox(width: 8),
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  contact['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  contact['number'],
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 4),
          Flexible(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
              decoration: BoxDecoration(
                color: typeColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                contact['type'].toUpperCase(),
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  color: typeColor,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
          SizedBox(
            width: 36,
            child: IconButton(
              icon: const Icon(Icons.call, size: 18),
              onPressed: () => _callContact(contact),
              color: EmergencyColorPalette.secondary[500],
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(
                minWidth: 36,
                minHeight: 36,
              ),
            ),
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
            SwitchListTile(
              title: const Text('Shake to Activate'),
              subtitle: const Text('Shake device 3 times to trigger emergency'),
              value: _shakeToActivateEnabled,
              onChanged: (bool value) {
                setState(() {
                  _shakeToActivateEnabled = value;
                  if (value) {
                    _initShakeDetection();
                  } else {
                    _accelerometerSubscription?.cancel();
                  }
                });
              },
              secondary: const Icon(Icons.vibration),
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
    
    // Send smartphone notification instead of in-app snackbar
    _sendEmergencyNotification();
    
    // Optional: Show brief confirmation snackbar
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          '🚨 Emergency activated - Check your notifications',
          overflow: TextOverflow.ellipsis,
          maxLines: 1,
        ),
        backgroundColor: EmergencyColorPalette.danger[500],
        duration: const Duration(seconds: 2),
        action: SnackBarAction(
          label: 'CANCEL',
          textColor: Colors.white,
          onPressed: _deactivateEmergency,
        ),
      ),
    );
  }

  void _sendEmergencyNotification() async {
    try {
      // Send smartphone notification
      await NotificationService.showEmergencyActivatedNotification();
    } catch (e) {
      debugPrint('Error sending emergency notification: $e');
    }
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
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.warning, color: EmergencyColorPalette.warning[500], size: 20),
            const SizedBox(width: 6),
            const Flexible(
              child: Text(
                'Test Emergency System',
                overflow: TextOverflow.ellipsis,
              ),
            ),
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
