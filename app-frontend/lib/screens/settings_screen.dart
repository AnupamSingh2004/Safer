import 'package:flutter/material.dart';
import '../widgets/theme_aware_text.dart';
import '../widgets/responsive_utils.dart';

class SettingsScreen extends StatefulWidget {
  final String userType;
  
  const SettingsScreen({Key? key, this.userType = 'tourist'}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String selectedLanguage = 'English';
  bool notificationsEnabled = true;
  bool locationEnabled = true;
  bool autoSync = true;
  String selectedTheme = 'Light';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const ThemeAwareText.heading('⚙️ Settings'),
        centerTitle: true,
      ),
      body: ResponsiveColumn(
        children: [
          Padding(
            padding: ResponsiveUtils.getResponsiveMargin(context),
            child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Language Settings
            _buildSettingsSection(
              'Language Preferences',
              [
                _buildLanguageSelector(),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Notification Settings
            _buildSettingsSection(
              'Notifications',
              [
                _buildSwitchTile(
                  'Enable Notifications',
                  'Receive health alerts and updates',
                  notificationsEnabled,
                  (value) {
                    setState(() {
                      notificationsEnabled = value;
                    });
                  },
                ),
                _buildNotificationTypes(),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Location Settings
            _buildSettingsSection(
              'Location & Privacy',
              [
                _buildSwitchTile(
                  'Location Services',
                  'Allow location access for risk mapping',
                  locationEnabled,
                  (value) {
                    setState(() {
                      locationEnabled = value;
                    });
                  },
                ),
                _buildLocationAccuracy(),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Data Sync Settings
            _buildSettingsSection(
              'Data Sync',
              [
                _buildSwitchTile(
                  'Auto Sync',
                  'Automatically sync data when connected',
                  autoSync,
                  (value) {
                    setState(() {
                      autoSync = value;
                    });
                  },
                ),
                _buildSyncOptions(),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // App Settings
            _buildSettingsSection(
              'App Settings',
              [
                _buildThemeSelector(),
                _buildCacheSettings(),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Advanced Settings
            _buildSettingsSection(
              'Advanced',
              [
                _buildAdvancedOption('Export Data', Icons.download, () {
                  _showExportDialog();
                }),
                _buildAdvancedOption('Clear Cache', Icons.clear, () {
                  _showClearCacheDialog();
                }),
                _buildAdvancedOption('Reset Settings', Icons.restore, () {
                  _showResetDialog();
                }),
              ],
            ),
            
            const SizedBox(height: 40),
            ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection(String title, List<Widget> children) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildLanguageSelector() {
    final languages = ['English', 'Hindi', 'Bengali', 'Telugu', 'Tamil', 'Marathi'];
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Language',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            border: Border.all(color: theme.colorScheme.outline),
            borderRadius: BorderRadius.circular(8),
          ),
          child: DropdownButton<String>(
            value: selectedLanguage,
            isExpanded: true,
            underline: const SizedBox(),
            dropdownColor: theme.colorScheme.surface,
            onChanged: (String? newValue) {
              setState(() {
                selectedLanguage = newValue!;
              });
            },
            items: languages.map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(
                  value,
                  style: TextStyle(color: theme.colorScheme.onSurface),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 14,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: theme.colorScheme.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationTypes() {
    final notificationTypes = [
      'Health Alerts',
      'Weather Updates',
      'Emergency Notifications',
      'Reminder Notifications',
    ];
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Notification Types',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        ...notificationTypes.map((type) => 
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Row(
              children: [
                Checkbox(
                  value: true,
                  onChanged: notificationsEnabled ? (value) {} : null,
                  activeColor: theme.colorScheme.primary,
                ),
                Text(
                  type,
                  style: TextStyle(color: theme.colorScheme.onSurface),
                ),
              ],
            ),
          ),
        ).toList(),
      ],
    );
  }

  Widget _buildLocationAccuracy() {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Location Accuracy',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Radio<String>(
              value: 'High',
              groupValue: 'High',
              onChanged: locationEnabled ? (value) {} : null,
              activeColor: theme.colorScheme.primary,
            ),
            Text(
              'High (GPS + Network)',
              style: TextStyle(color: theme.colorScheme.onSurface),
            ),
          ],
        ),
        Row(
          children: [
            Radio<String>(
              value: 'Medium',
              groupValue: 'High',
              onChanged: locationEnabled ? (value) {} : null,
              activeColor: theme.colorScheme.primary,
            ),
            Text(
              'Medium (Network only)',
              style: TextStyle(color: theme.colorScheme.onSurface),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSyncOptions() {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sync Options',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Checkbox(
              value: true,
              onChanged: autoSync ? (value) {} : null,
              activeColor: theme.colorScheme.primary,
            ),
            Text(
              'Sync on WiFi only',
              style: TextStyle(color: theme.colorScheme.onSurface),
            ),
          ],
        ),
        Row(
          children: [
            Checkbox(
              value: false,
              onChanged: autoSync ? (value) {} : null,
              activeColor: theme.colorScheme.primary,
            ),
            Text(
              'Sync on mobile data',
              style: TextStyle(color: theme.colorScheme.onSurface),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildThemeSelector() {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Theme',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Radio<String>(
              value: 'Light',
              groupValue: selectedTheme,
              onChanged: (value) {
                setState(() {
                  selectedTheme = value!;
                });
              },
              activeColor: theme.colorScheme.primary,
            ),
            Text(
              'Light',
              style: TextStyle(color: theme.colorScheme.onSurface),
            ),
            const SizedBox(width: 20),
            Radio<String>(
              value: 'Dark',
              groupValue: selectedTheme,
              onChanged: (value) {
                setState(() {
                  selectedTheme = value!;
                });
              },
              activeColor: theme.colorScheme.primary,
            ),
            Text(
              'Dark',
              style: TextStyle(color: theme.colorScheme.onSurface),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCacheSettings() {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Cache Settings',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Cache size: 45.2 MB',
          style: TextStyle(
            fontSize: 14,
            color: theme.colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Last cleared: 2 days ago',
          style: TextStyle(
            fontSize: 14,
            color: theme.colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildAdvancedOption(String title, IconData icon, VoidCallback onTap) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        child: Row(
          children: [
            Icon(
              icon,
              color: theme.colorScheme.primary,
              size: 24,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: theme.colorScheme.onSurface,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: theme.colorScheme.onSurface.withOpacity(0.6),
            ),
          ],
        ),
      ),
    );
  }

  void _showExportDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Export Data'),
        content: const Text('Export your health data and settings?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _exportData();
            },
            child: const Text('Export'),
          ),
        ],
      ),
    );
  }

  void _showClearCacheDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Cache'),
        content: const Text('This will clear all cached data. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _clearCache();
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showResetDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reset Settings'),
        content: const Text('This will reset all settings to default. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _resetSettings();
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }

  void _exportData() {
    final theme = Theme.of(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Data export started...'),
        backgroundColor: theme.colorScheme.primary,
      ),
    );
  }

  void _clearCache() {
    final theme = Theme.of(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Cache cleared successfully'),
        backgroundColor: theme.colorScheme.primary,
      ),
    );
  }

  void _resetSettings() {
    setState(() {
      selectedLanguage = 'English';
      notificationsEnabled = true;
      locationEnabled = true;
      autoSync = true;
      selectedTheme = 'Light';
    });
    
    final theme = Theme.of(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Settings reset to default'),
        backgroundColor: theme.colorScheme.primary,
      ),
    );
  }
}
