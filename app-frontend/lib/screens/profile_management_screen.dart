import 'package:flutter/material.dart';
import '../services/profile_management_service.dart';
import '../models/tourist_profile.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';
import '../widgets/responsive_utils.dart';

class ProfileManagementScreen extends StatefulWidget {
  const ProfileManagementScreen({Key? key}) : super(key: key);

  @override
  State<ProfileManagementScreen> createState() => _ProfileManagementScreenState();
}

class _ProfileManagementScreenState extends State<ProfileManagementScreen> {
  TouristProfile? _profile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await ProfileManagementService.getCurrentProfile();
      setState(() {
        _profile = profile;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: ThemeAwareText.heading('👤 Profile Management'),
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _profile == null
              ? _buildCreateProfile()
              : _buildProfileView(),
    );
  }

  Widget _buildCreateProfile() {
    final theme = Theme.of(context);
    
    return ResponsiveColumn(
      children: [
        Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              Icon(
                Icons.person_add,
                size: 80,
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
              const SizedBox(height: 16),
              const ThemeAwareText.heading('Create Your Profile'),
              const SizedBox(height: 8),
              ThemeAwareText(
                'Set up your blockchain-verified tourist profile',
                style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: _showCreateProfileDialog,
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.primary[500],
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.add),
                SizedBox(width: 8),
                Text('Create Profile'),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProfileView() {
    return ResponsiveColumn(
      children: [
        // Profile Header
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                EmergencyColorPalette.primary[500]!,
                EmergencyColorPalette.secondary[500]!,
              ],
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              CircleAvatar(
                radius: 40,
                backgroundColor: Colors.white,
                child: Icon(
                  Icons.person,
                  size: 50,
                  color: EmergencyColorPalette.primary[500],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                _profile!.name,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _profile!.nationality,
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_profile!.isBlockchainVerified) ...[
                    const Icon(Icons.verified, color: Colors.white, size: 20),
                    const SizedBox(width: 4),
                    const Text(
                      '🔒 BLOCKCHAIN VERIFIED',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),

        // Profile Details
        _buildProfileSection('Personal Information', [
          _buildDetailRow('Email', _profile!.email),
          _buildDetailRow('Phone', _profile!.phone),
          _buildDetailRow('Passport', _profile!.passportNumber),
          _buildDetailRow('Trust Score', '${_profile!.trustScore}/100'),
        ]),

        // Emergency Contacts
        _buildEmergencyContactsSection(),

        // Blockchain Info
        _buildBlockchainSection(),

        // Action Buttons
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              ElevatedButton(
                onPressed: _editProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmergencyColorPalette.secondary[500],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.edit),
                    SizedBox(width: 8),
                    Text('Edit Profile'),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _viewBlockchainHistory,
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmergencyColorPalette.info[500],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.history),
                    SizedBox(width: 8),
                    Text('View Blockchain History'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildProfileSection(String title, List<Widget> children) {
    final theme = Theme.of(context);
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
          Padding(
            padding: const EdgeInsets.all(16),
            child: ThemeAwareText.subheading(title),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    final theme = Theme.of(context);
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: theme.colorScheme.onSurface,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyContactsSection() {
    final theme = Theme.of(context);
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const ThemeAwareText.subheading('Emergency Contacts'),
                IconButton(
                  onPressed: _addEmergencyContact,
                  icon: const Icon(Icons.add),
                ),
              ],
            ),
          ),
          ...(_profile!.emergencyContacts.map((contact) => ListTile(
                leading: CircleAvatar(
                  backgroundColor: contact.isPrimary
                      ? theme.colorScheme.error
                      : theme.colorScheme.secondary,
                  child: Text(
                    contact.name[0].toUpperCase(),
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
                title: Text(contact.name),
                subtitle: Text('${contact.relationship} • ${contact.phone}'),
                trailing: contact.isPrimary
                    ? const Icon(Icons.star, color: Colors.amber)
                    : null,
              ))),
        ],
      ),
    );
  }

  Widget _buildBlockchainSection() {
    final theme = Theme.of(context);
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
          const Padding(
            padding: EdgeInsets.all(16),
            child: ThemeAwareText.subheading('🔒 Blockchain Verification'),
          ),
          _buildDetailRow('Wallet Address', 
              '${_profile!.walletAddress.substring(0, 8)}...${_profile!.walletAddress.substring(_profile!.walletAddress.length - 6)}'),
          _buildDetailRow('KYC Status', _profile!.kycData.isVerified ? '✅ Verified' : '⏳ Pending'),
          _buildDetailRow('Verification Date', 
              _profile!.kycData.verificationTimestamp.toString().substring(0, 10)),
          _buildDetailRow('Blockchain Hash', 
              '${_profile!.blockchainHash.substring(0, 10)}...'),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  void _showCreateProfileDialog() {
    // Show a form to create profile
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Profile creation form would be shown here'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _editProfile() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Profile editing form would be shown here'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _addEmergencyContact() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Add emergency contact form would be shown here'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _viewBlockchainHistory() async {
    final history = await ProfileManagementService.getBlockchainHistory(_profile!.id);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('🔒 Blockchain History'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: history.length,
            itemBuilder: (context, index) {
              final tx = history[index];
              return ListTile(
                leading: const Icon(Icons.link, color: Colors.blue),
                title: Text(tx['type']),
                subtitle: Text('${tx['txHash']}\n${tx['timestamp'].toString().substring(0, 19)}'),
                trailing: Text(tx['status']),
                isThreeLine: true,
              );
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
