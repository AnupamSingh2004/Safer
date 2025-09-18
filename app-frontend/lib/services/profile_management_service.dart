import 'dart:convert';
import '../models/tourist_profile.dart';

/// 🔒 BLOCKCHAIN VERIFIED Profile Management Service
/// Handles all tourist profile operations with immutable blockchain storage
class ProfileManagementService {
  static const String _storageKey = 'tourist_profile';
  
  // Mock blockchain wallet addresses for demo
  static const List<String> _mockWalletAddresses = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    '0x9876543210fedcba9876543210fedcba98765432',
  ];

  /// Create a new tourist profile with blockchain verification
  static Future<TouristProfile> createProfile({
    required String name,
    required String email,
    required String phone,
    required String nationality,
    required String passportNumber,
    DateTime? dateOfBirth,
    required List<EmergencyContact> emergencyContacts,
  }) async {
    // Simulate blockchain interaction delay
    await Future.delayed(const Duration(seconds: 2));
    
    final now = DateTime.now();
    final mockProfile = TouristProfile(
      id: 'tourist_${now.millisecondsSinceEpoch}',
      walletAddress: _mockWalletAddresses[0], // Mock wallet address
      touristIdHash: _generateTouristIdHash(passportNumber),
      name: name,
      email: email,
      phone: phone,
      nationality: nationality,
      passportNumber: passportNumber,
      dateOfBirth: dateOfBirth,
      profileImageUrl: null,
      emergencyContacts: emergencyContacts,
      preferences: _getDefaultPreferences(),
      kycData: _getMockKYCData(),
      tripData: _getMockTripData(),
      createdAt: now,
      updatedAt: now,
      isBlockchainVerified: true, // ✅ BLOCKCHAIN VERIFIED
      trustScore: 85, // Initial trust score
      blockchainHash: _generateBlockchainHash(),
    );

    // Store locally (simulating blockchain storage)
    await _storeProfileLocally(mockProfile);
    
    return mockProfile;
  }

  /// Get current tourist profile
  static Future<TouristProfile?> getCurrentProfile() async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Return mock profile for demo
    return _getMockProfile();
  }

  /// Update tourist profile
  static Future<TouristProfile> updateProfile(
    TouristProfile currentProfile,
    Map<String, dynamic> updates,
  ) async {
    // Simulate blockchain transaction delay
    await Future.delayed(const Duration(seconds: 1));
    
    final updatedProfile = currentProfile.copyWith(
      name: updates['name'],
      email: updates['email'],
      phone: updates['phone'],
      nationality: updates['nationality'],
      passportNumber: updates['passportNumber'],
      dateOfBirth: updates['dateOfBirth'],
      profileImageUrl: updates['profileImageUrl'],
      emergencyContacts: updates['emergencyContacts'],
      preferences: updates['preferences'],
      kycData: updates['kycData'],
      tripData: updates['tripData'],
      isBlockchainVerified: updates['isBlockchainVerified'],
      trustScore: updates['trustScore'],
    );

    await _storeProfileLocally(updatedProfile);
    return updatedProfile;
  }

  /// Add emergency contact
  static Future<List<EmergencyContact>> addEmergencyContact(
    List<EmergencyContact> currentContacts,
    EmergencyContact newContact,
  ) async {
    await Future.delayed(const Duration(milliseconds: 800));
    
    final updatedContacts = List<EmergencyContact>.from(currentContacts);
    updatedContacts.add(newContact);
    
    return updatedContacts;
  }

  /// Remove emergency contact
  static Future<List<EmergencyContact>> removeEmergencyContact(
    List<EmergencyContact> currentContacts,
    String contactId,
  ) async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    return currentContacts.where((contact) => contact.id != contactId).toList();
  }

  /// Verify profile on blockchain
  static Future<bool> verifyProfileOnBlockchain(String profileId) async {
    // Simulate blockchain verification process
    await Future.delayed(const Duration(seconds: 3));
    
    // Mock verification success
    return true;
  }

  /// Get blockchain transaction history
  static Future<List<Map<String, dynamic>>> getBlockchainHistory(String profileId) async {
    await Future.delayed(const Duration(seconds: 1));
    
    return [
      {
        'type': 'profile_created',
        'timestamp': DateTime.now().subtract(const Duration(days: 5)),
        'txHash': '0xabc123...def456',
        'status': '✅ VERIFIED',
        'blockNumber': 12345678,
      },
      {
        'type': 'kyc_verified',
        'timestamp': DateTime.now().subtract(const Duration(days: 4)),
        'txHash': '0xdef456...abc123',
        'status': '✅ VERIFIED',
        'blockNumber': 12345680,
      },
      {
        'type': 'emergency_contact_added',
        'timestamp': DateTime.now().subtract(const Duration(days: 2)),
        'txHash': '0x789ghi...jkl012',
        'status': '✅ VERIFIED',
        'blockNumber': 12345682,
      },
    ];
  }

  // Private helper methods
  static Future<void> _storeProfileLocally(TouristProfile profile) async {
    // Simulate local storage
    await Future.delayed(const Duration(milliseconds: 100));
  }

  static String _generateTouristIdHash(String passportNumber) {
    return 'hash_${passportNumber.hashCode.abs()}';
  }

  static String _generateBlockchainHash() {
    return '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16)}';
  }

  static UserPreferences _getDefaultPreferences() {
    return UserPreferences(
      language: 'English',
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      emergencyAlerts: true,
      weatherAlerts: true,
      locationSharing: true,
      emergencyContactOrder: 'priority',
    );
  }

  static BlockchainKYCData _getMockKYCData() {
    return BlockchainKYCData(
      documentType: 'passport',
      documentHash: 'ipfs://Qm...abc123',
      fullNameHash: 'name_hash_${DateTime.now().millisecondsSinceEpoch}',
      nationalityHash: 'nationality_hash_${DateTime.now().millisecondsSinceEpoch}',
      verificationTimestamp: DateTime.now().subtract(const Duration(days: 3)),
      verifiedBy: '0xGovernmentAuthority123',
      isVerified: true,
      expiryTimestamp: DateTime.now().add(const Duration(days: 365)),
      trustScore: 95,
      biometricHash: 'biometric_hash_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  static TripData _getMockTripData() {
    return TripData(
      itineraryHash: 'ipfs://Qm...trip123',
      startTimestamp: DateTime.now(),
      endTimestamp: DateTime.now().add(const Duration(days: 14)),
      purpose: 'tourism',
      groupSize: 2,
      accommodationHash: 'ipfs://Qm...hotel123',
    );
  }

  static TouristProfile _getMockProfile() {
    final now = DateTime.now();
    return TouristProfile(
      id: 'tourist_demo_2025',
      walletAddress: _mockWalletAddresses[0],
      touristIdHash: 'hash_demo_tourist',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      nationality: 'Indian',
      passportNumber: 'K1234567',
      dateOfBirth: DateTime(1995, 3, 15),
      profileImageUrl: null,
      emergencyContacts: [
        EmergencyContact(
          id: 'contact_1',
          name: 'Priya Kumar',
          phone: '+91 98765 43211',
          relationship: 'Spouse',
          email: 'priya.kumar@email.com',
          isPrimary: true,
        ),
        EmergencyContact(
          id: 'contact_2',
          name: 'Ram Kumar',
          phone: '+91 98765 43212',
          relationship: 'Father',
          email: 'ram.kumar@email.com',
          isPrimary: false,
        ),
      ],
      preferences: _getDefaultPreferences(),
      kycData: _getMockKYCData(),
      tripData: _getMockTripData(),
      createdAt: now.subtract(const Duration(days: 5)),
      updatedAt: now,
      isBlockchainVerified: true,
      trustScore: 92,
      blockchainHash: '0xabc123def456789',
    );
  }
}
