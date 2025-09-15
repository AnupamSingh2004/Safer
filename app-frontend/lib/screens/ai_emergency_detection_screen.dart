import 'package:flutter/material.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';
import '../widgets/responsive_utils.dart';

class AIEmergencyDetectionScreen extends StatefulWidget {
  const AIEmergencyDetectionScreen({Key? key}) : super(key: key);

  @override
  State<AIEmergencyDetectionScreen> createState() => _AIEmergencyDetectionScreenState();
}

class _AIEmergencyDetectionScreenState extends State<AIEmergencyDetectionScreen> {
  bool _behavioralDetectionEnabled = true;
  bool _voiceStressAnalysisEnabled = true;
  bool _crowdDensityMonitoring = true;
  bool _contextAwareSafety = true;
  bool _predictiveAlerts = true;

  // Mock data for demonstration
  double _safetyScore = 92.5;
  String _currentRiskLevel = 'Low Risk';
  List<String> _detectedAnomalies = [
    'Unusual movement pattern detected at 14:23',
    'Voice stress indicators found in last call',
    'High crowd density in current area'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const ThemeAwareText.heading('🧠 AI Emergency Detection'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showSettingsDialog,
          ),
        ],
      ),
      body: ResponsiveColumn(
        children: [
          Padding(
            padding: ResponsiveUtils.getResponsiveMargin(context),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
            _buildSafetyScoreCard(),
            const SizedBox(height: 20),
            _buildAIDetectionStatus(),
            const SizedBox(height: 20),
            _buildDetectionFeatures(),
            const SizedBox(height: 20),
            _buildRecentAnomalies(),
            const SizedBox(height: 20),
            _buildBehavioralInsights(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyScoreCard() {
    Color scoreColor = _getSafetyScoreColor(_safetyScore);
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [scoreColor.withOpacity(0.1), scoreColor.withOpacity(0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: scoreColor.withOpacity(0.3)),
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
                    'AI Safety Score',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: EmergencyColorPalette.neutral[700],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _currentRiskLevel,
                    style: TextStyle(
                      fontSize: 14,
                      color: scoreColor,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: scoreColor, width: 4),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${_safetyScore.toStringAsFixed(1)}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: scoreColor,
                        ),
                      ),
                      Text(
                        '/100',
                        style: TextStyle(
                          fontSize: 12,
                          color: EmergencyColorPalette.neutral[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: _safetyScore / 100,
            backgroundColor: EmergencyColorPalette.neutral[200],
            valueColor: AlwaysStoppedAnimation<Color>(scoreColor),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildAIDetectionStatus() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.psychology,
                  color: EmergencyColorPalette.primary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'AI Detection Systems',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildDetectionToggle(
              'Behavioral Anomaly Detection',
              'ML-based unusual behavior analysis',
              _behavioralDetectionEnabled,
              (value) => setState(() => _behavioralDetectionEnabled = value),
              Icons.analytics,
            ),
            _buildDetectionToggle(
              'Voice Stress Analysis',
              'Detects distress in voice patterns',
              _voiceStressAnalysisEnabled,
              (value) => setState(() => _voiceStressAnalysisEnabled = value),
              Icons.record_voice_over,
            ),
            _buildDetectionToggle(
              'Crowd Density Intelligence',
              'Camera-based crowd safety analysis',
              _crowdDensityMonitoring,
              (value) => setState(() => _crowdDensityMonitoring = value),
              Icons.groups,
            ),
            _buildDetectionToggle(
              'Context-Aware Safety Scoring',
              'Real-time environment risk assessment',
              _contextAwareSafety,
              (value) => setState(() => _contextAwareSafety = value),
              Icons.location_on,
            ),
            _buildDetectionToggle(
              'Predictive Emergency Alerts',
              'AI predicts emergencies before they happen',
              _predictiveAlerts,
              (value) => setState(() => _predictiveAlerts = value),
              Icons.warning,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetectionToggle(
    String title,
    String subtitle,
    bool value,
    Function(bool) onChanged,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: value 
                ? EmergencyColorPalette.primary[100]
                : EmergencyColorPalette.neutral[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: value 
                ? EmergencyColorPalette.primary[500]
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
            activeColor: EmergencyColorPalette.primary[500],
          ),
        ],
      ),
    );
  }

  Widget _buildDetectionFeatures() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.memory,
                  color: EmergencyColorPalette.secondary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'AI Model Performance',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildPerformanceMetric('Detection Accuracy', '95.2%', Colors.green),
            _buildPerformanceMetric('Processing Latency', '<200ms', Colors.blue),
            _buildPerformanceMetric('False Positive Rate', '<3%', Colors.orange),
            _buildPerformanceMetric('Emergency Prediction Precision', '89.7%', Colors.purple),
          ],
        ),
      ),
    );
  }

  Widget _buildPerformanceMetric(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: EmergencyColorPalette.neutral[700],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: color.withOpacity(0.3)),
            ),
            child: Text(
              value,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentAnomalies() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.warning_amber,
                  color: EmergencyColorPalette.warning[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Recent Anomaly Detections',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_detectedAnomalies.isEmpty)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: EmergencyColorPalette.secondary[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: EmergencyColorPalette.secondary[200]!),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: EmergencyColorPalette.secondary[500],
                    ),
                    const SizedBox(width: 12),
                    const Text('No anomalies detected in the last 24 hours'),
                  ],
                ),
              )
            else
              ...(_detectedAnomalies.map((anomaly) => _buildAnomalyItem(anomaly))),
          ],
        ),
      ),
    );
  }

  Widget _buildAnomalyItem(String anomaly) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: EmergencyColorPalette.warning[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: EmergencyColorPalette.warning[200]!),
      ),
      child: Row(
        children: [
          Icon(
            Icons.info_outline,
            color: EmergencyColorPalette.warning[500],
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              anomaly,
              style: TextStyle(
                fontSize: 14,
                color: EmergencyColorPalette.neutral[700],
              ),
            ),
          ),
          TextButton(
            onPressed: () => _showAnomalyDetails(anomaly),
            child: const Text('Details'),
          ),
        ],
      ),
    );
  }

  Widget _buildBehavioralInsights() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.insights,
                  color: EmergencyColorPalette.info[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Behavioral Insights',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildInsightItem(
              'Movement Pattern',
              'Normal walking pace, consistent route',
              Icons.directions_walk,
              EmergencyColorPalette.secondary[500]!,
            ),
            _buildInsightItem(
              'Communication Style',
              'Calm voice patterns detected',
              Icons.chat,
              EmergencyColorPalette.secondary[500]!,
            ),
            _buildInsightItem(
              'Environmental Awareness',
              'Good situational awareness indicators',
              Icons.visibility,
              EmergencyColorPalette.secondary[500]!,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInsightItem(String title, String description, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
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
        ],
      ),
    );
  }

  Color _getSafetyScoreColor(double score) {
    if (score >= 80) return ZoneRiskColors.safe;
    if (score >= 60) return ZoneRiskColors.lowRisk;
    if (score >= 40) return ZoneRiskColors.moderateRisk;
    return ZoneRiskColors.highRisk;
  }

  void _showSettingsDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('AI Detection Settings'),
        content: const Text('Configure AI detection sensitivity and parameters.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showAnomalyDetails(String anomaly) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Anomaly Details'),
        content: Text(anomaly),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement dismiss functionality
            },
            child: const Text('Dismiss'),
          ),
        ],
      ),
    );
  }
}
