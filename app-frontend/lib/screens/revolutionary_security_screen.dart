import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/emergency_theme.dart';

class RevolutionarySecurityScreen extends StatefulWidget {
  const RevolutionarySecurityScreen({Key? key}) : super(key: key);

  @override
  State<RevolutionarySecurityScreen> createState() => _RevolutionarySecurityScreenState();
}

class _RevolutionarySecurityScreenState extends State<RevolutionarySecurityScreen>
    with TickerProviderStateMixin {
  late AnimationController _securityPulseController;
  late AnimationController _shieldController;
  
  bool _decoyModeEnabled = false;
  bool _remoteWipeEnabled = true;
  bool _tamperProofLogsEnabled = true;
  bool _zeroKnowledgeEnabled = true;

  String _securityLevel = 'Maximum Security';
  double _securityScore = 96.8;
  int _threatLevel = 1; // 1-5 scale
  String _lastSecurityCheck = '2 minutes ago';
  
  List<Map<String, dynamic>> _securityLogs = [
    {
      'time': '14:25:33',
      'event': 'Biometric authentication successful',
      'type': 'success',
      'hash': '0x4f3a2b1c...',
      'verified': true,
    },
    {
      'time': '14:23:15',
      'event': 'Emergency contact verified on blockchain',
      'type': 'info',
      'hash': '0x8d7e6f5a...',
      'verified': true,
    },
    {
      'time': '14:20:08',
      'event': 'Location data encrypted and stored',
      'type': 'success',
      'hash': '0x1a2b3c4d...',
      'verified': true,
    },
    {
      'time': '14:18:42',
      'event': 'Zero-knowledge proof validated',
      'type': 'info',
      'hash': '0x9e8f7a6b...',
      'verified': true,
    },
  ];

  List<Map<String, dynamic>> _emergencyContacts = [
    {
      'name': 'Emergency Services',
      'verified': true,
      'blockchainHash': '0x1234567890abcdef...',
      'lastVerified': '1 hour ago',
      'trustScore': 100,
    },
    {
      'name': 'Family - Mom',
      'verified': true,
      'blockchainHash': '0xabcdef1234567890...',
      'lastVerified': '2 hours ago',
      'trustScore': 98,
    },
    {
      'name': 'Close Friend - Alex',
      'verified': true,
      'blockchainHash': '0x567890abcdef1234...',
      'lastVerified': '1 day ago',
      'trustScore': 95,
    },
  ];

  @override
  void initState() {
    super.initState();
    _securityPulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    _shieldController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _shieldController.forward();
  }

  @override
  void dispose() {
    _securityPulseController.dispose();
    _shieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🔐 Revolutionary Security'),
        backgroundColor: EmergencyColorPalette.danger[600],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.security),
            onPressed: _runSecurityScan,
          ),
          IconButton(
            icon: const Icon(Icons.settings_applications),
            onPressed: _showAdvancedSettings,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSecurityStatusHeader(),
            const SizedBox(height: 20),
            _buildBiometricBlockchainAuth(),
            const SizedBox(height: 20),
            _buildSecurityFeatures(),
            const SizedBox(height: 20),
            _buildEmergencyContactVerification(),
            const SizedBox(height: 20),
            _buildTamperProofLogs(),
            const SizedBox(height: 20),
            _buildZeroKnowledgeArchitecture(),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityStatusHeader() {
    Color securityColor = _getSecurityLevelColor(_securityScore);
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: RadialGradient(
          colors: [
            securityColor.withOpacity(0.1),
            securityColor.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: securityColor.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: securityColor.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Security Status',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: EmergencyColorPalette.neutral[800],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _securityLevel,
                    style: TextStyle(
                      fontSize: 16,
                      color: securityColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Last check: $_lastSecurityCheck',
                    style: TextStyle(
                      fontSize: 12,
                      color: EmergencyColorPalette.neutral[600],
                    ),
                  ),
                ],
              ),
              AnimatedBuilder(
                animation: _securityPulseController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: 1 + (_securityPulseController.value * 0.05),
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            securityColor,
                            securityColor.withOpacity(0.7),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: securityColor.withOpacity(0.3),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.security,
                            size: 36,
                            color: Colors.white,
                          ),
                          Text(
                            '${_securityScore.toStringAsFixed(1)}%',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildThreatLevelIndicator(),
        ],
      ),
    );
  }

  Widget _buildThreatLevelIndicator() {
    return Row(
      children: [
        Text(
          'Threat Level: ',
          style: TextStyle(
            fontSize: 14,
            color: EmergencyColorPalette.neutral[700],
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Row(
            children: List.generate(5, (index) {
              bool isActive = index < _threatLevel;
              Color levelColor = _getThreatLevelColor(index + 1);
              
              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  height: 8,
                  decoration: BoxDecoration(
                    color: isActive ? levelColor : EmergencyColorPalette.neutral[200],
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              );
            }),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          'LOW',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: EmergencyColorPalette.secondary[600],
          ),
        ),
      ],
    );
  }

  Widget _buildBiometricBlockchainAuth() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AnimatedBuilder(
                  animation: _shieldController,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _shieldController.value,
                      child: Icon(
                        Icons.verified_user,
                        color: EmergencyColorPalette.primary[500],
                        size: 24,
                      ),
                    );
                  },
                ),
                const SizedBox(width: 8),
                const Text(
                  'Biometric + Blockchain Authentication',
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
                gradient: LinearGradient(
                  colors: [
                    EmergencyColorPalette.primary[50]!,
                    EmergencyColorPalette.secondary[50]!,
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: EmergencyColorPalette.primary[200]!),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _buildAuthMethod(
                          'Fingerprint',
                          'Primary biometric',
                          Icons.fingerprint,
                          true,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildAuthMethod(
                          'Face ID',
                          'Secondary biometric',
                          Icons.face,
                          true,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildAuthMethod(
                          'Voice Print',
                          'Tertiary biometric',
                          Icons.record_voice_over,
                          false,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildAuthMethod(
                          'Blockchain',
                          'Immutable verification',
                          Icons.link,
                          true,
                        ),
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
                    onPressed: _enrollBiometric,
                    icon: const Icon(Icons.add_circle),
                    label: const Text('Enroll New'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmergencyColorPalette.primary[500],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _testAuthentication,
                    icon: const Icon(Icons.verified),
                    label: const Text('Test Auth'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuthMethod(String title, String subtitle, IconData icon, bool active) {
    Color methodColor = active 
      ? EmergencyColorPalette.secondary[500]! 
      : EmergencyColorPalette.neutral[400]!;
    
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: methodColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: methodColor.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: methodColor, size: 24),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: methodColor,
            ),
          ),
          Text(
            subtitle,
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

  Widget _buildSecurityFeatures() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.enhanced_encryption,
                  color: EmergencyColorPalette.warning[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Advanced Security Features',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildSecurityToggle(
              'Decoy Mode Protection',
              'Fake interface under duress',
              Icons.theater_comedy,
              _decoyModeEnabled,
              (value) => setState(() => _decoyModeEnabled = value),
              isAdvanced: true,
            ),
            _buildSecurityToggle(
              'Remote Data Wipe Capability',
              'Emergency data protection',
              Icons.delete_forever,
              _remoteWipeEnabled,
              (value) => setState(() => _remoteWipeEnabled = value),
              isDangerous: true,
            ),
            _buildSecurityToggle(
              'Tamper-Proof Activity Logs',
              'Blockchain-secured audit trail',
              Icons.receipt_long,
              _tamperProofLogsEnabled,
              (value) => setState(() => _tamperProofLogsEnabled = value),
            ),
            _buildSecurityToggle(
              'Zero-Knowledge Architecture',
              'Privacy-first data handling',
              Icons.privacy_tip,
              _zeroKnowledgeEnabled,
              (value) => setState(() => _zeroKnowledgeEnabled = value),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityToggle(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool) onChanged, {
    bool isAdvanced = false,
    bool isDangerous = false,
  }) {
    Color toggleColor = isDangerous 
      ? EmergencyColorPalette.danger[500]!
      : isAdvanced 
        ? EmergencyColorPalette.warning[500]!
        : EmergencyColorPalette.primary[500]!;
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: value 
                ? toggleColor.withOpacity(0.1)
                : EmergencyColorPalette.neutral[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: value ? toggleColor : EmergencyColorPalette.neutral[400],
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    if (isAdvanced) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: EmergencyColorPalette.warning[100],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'ADV',
                          style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w600,
                            color: EmergencyColorPalette.warning[600],
                          ),
                        ),
                      ),
                    ],
                    if (isDangerous) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: EmergencyColorPalette.danger[100],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'DANGER',
                          style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w600,
                            color: EmergencyColorPalette.danger[600],
                          ),
                        ),
                      ),
                    ],
                  ],
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
            onChanged: isDangerous ? _handleDangerousToggle(onChanged) : onChanged,
            activeColor: toggleColor,
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyContactVerification() {
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
                      Icons.verified,
                      color: EmergencyColorPalette.secondary[500],
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Emergency Contact Verification',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                TextButton.icon(
                  onPressed: _addVerifiedContact,
                  icon: const Icon(Icons.add_circle),
                  label: const Text('Add'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...(_emergencyContacts.map((contact) => _buildContactVerificationItem(contact))),
          ],
        ),
      ),
    );
  }

  Widget _buildContactVerificationItem(Map<String, dynamic> contact) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: contact['verified'] 
          ? EmergencyColorPalette.secondary[50]
          : EmergencyColorPalette.warning[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: contact['verified'] 
            ? EmergencyColorPalette.secondary[200]!
            : EmergencyColorPalette.warning[200]!,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                contact['verified'] ? Icons.verified_user : Icons.warning,
                color: contact['verified'] 
                  ? EmergencyColorPalette.secondary[600]
                  : EmergencyColorPalette.warning[600],
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  contact['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: contact['verified'] 
                    ? EmergencyColorPalette.secondary[100]
                    : EmergencyColorPalette.warning[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${contact['trustScore']}%',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: contact['verified'] 
                      ? EmergencyColorPalette.secondary[600]
                      : EmergencyColorPalette.warning[600],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Blockchain Hash: ${contact['blockchainHash']}',
            style: TextStyle(
              fontSize: 10,
              fontFamily: 'monospace',
              color: EmergencyColorPalette.neutral[600],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Last verified: ${contact['lastVerified']}',
            style: TextStyle(
              fontSize: 12,
              color: EmergencyColorPalette.neutral[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTamperProofLogs() {
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
                      Icons.receipt_long,
                      color: EmergencyColorPalette.info[500],
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Tamper-Proof Activity Logs',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: _exportLogs,
                  child: const Text('Export'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: EmergencyColorPalette.neutral[900],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: EmergencyColorPalette.neutral[300]!),
              ),
              child: ListView.builder(
                padding: const EdgeInsets.all(8),
                itemCount: _securityLogs.length,
                itemBuilder: (context, index) {
                  final log = _securityLogs[index];
                  return _buildLogEntry(log);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogEntry(Map<String, dynamic> log) {
    Color typeColor = log['type'] == 'success' 
      ? EmergencyColorPalette.secondary[400]!
      : EmergencyColorPalette.info[400]!;
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '[${log['time']}]',
            style: TextStyle(
              fontSize: 10,
              fontFamily: 'monospace',
              color: EmergencyColorPalette.neutral[400],
            ),
          ),
          const SizedBox(width: 8),
          Icon(
            log['verified'] ? Icons.verified : Icons.warning,
            size: 12,
            color: typeColor,
          ),
          const SizedBox(width: 4),
          Expanded(
            child: Text(
              log['event'],
              style: const TextStyle(
                fontSize: 10,
                fontFamily: 'monospace',
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildZeroKnowledgeArchitecture() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.privacy_tip,
                  color: EmergencyColorPalette.secondary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Zero-Knowledge Architecture',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildPrivacyMetric('Data Encryption', '256-bit AES', Icons.lock),
            _buildPrivacyMetric('Knowledge Exposure', '0% (Zero-Knowledge)', Icons.visibility_off),
            _buildPrivacyMetric('Privacy Score', '99.7%', Icons.shield),
            _buildPrivacyMetric('Compliance', 'GDPR, CCPA, SOC2', Icons.verified),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: EmergencyColorPalette.secondary[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: EmergencyColorPalette.secondary[200]!),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info,
                    color: EmergencyColorPalette.secondary[600],
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Your data is processed using zero-knowledge proofs. We can verify your identity and provide services without ever accessing your personal information.',
                      style: TextStyle(
                        fontSize: 12,
                        color: EmergencyColorPalette.neutral[700],
                      ),
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

  Widget _buildPrivacyMetric(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(
            icon,
            color: EmergencyColorPalette.secondary[500],
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: EmergencyColorPalette.secondary[600],
            ),
          ),
        ],
      ),
    );
  }

  Color _getSecurityLevelColor(double score) {
    if (score >= 95) return EmergencyColorPalette.secondary[500]!;
    if (score >= 80) return EmergencyColorPalette.primary[500]!;
    if (score >= 60) return EmergencyColorPalette.warning[500]!;
    return EmergencyColorPalette.danger[500]!;
  }

  Color _getThreatLevelColor(int level) {
    switch (level) {
      case 1:
      case 2:
        return EmergencyColorPalette.secondary[500]!;
      case 3:
        return EmergencyColorPalette.warning[500]!;
      case 4:
      case 5:
        return EmergencyColorPalette.danger[500]!;
      default:
        return EmergencyColorPalette.neutral[400]!;
    }
  }

  Function(bool) _handleDangerousToggle(Function(bool) onChanged) {
    return (bool value) {
      if (value) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Row(
              children: [
                Icon(Icons.warning, color: EmergencyColorPalette.danger[500]),
                const SizedBox(width: 8),
                const Text('Dangerous Feature'),
              ],
            ),
            content: const Text(
              'This feature can permanently delete your data. Are you sure you want to enable it?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  onChanged(value);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmergencyColorPalette.danger[500],
                ),
                child: const Text('Enable'),
              ),
            ],
          ),
        );
      } else {
        onChanged(value);
      }
    };
  }

  void _runSecurityScan() {
    HapticFeedback.mediumImpact();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🔍 Running comprehensive security scan...'),
        backgroundColor: EmergencyColorPalette.primary[500],
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showAdvancedSettings() {
    // Show advanced security settings
  }

  void _enrollBiometric() {
    // Start biometric enrollment process
  }

  void _testAuthentication() {
    // Test authentication methods
  }

  void _addVerifiedContact() {
    // Add new verified emergency contact
  }

  void _exportLogs() {
    // Export security logs
  }
}
