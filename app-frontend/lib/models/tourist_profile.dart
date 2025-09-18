/// 🔒 BLOCKCHAIN VERIFIED KYC Data Structure
class BlockchainKYCData {
  final String documentType; // "passport", "aadhaar", "driving_license"
  final String documentHash; // 🔒 IPFS hash of encrypted document
  final String fullNameHash; // 🔐 Hash of full name for privacy
  final String nationalityHash; // 🌍 Hash of nationality
  final DateTime verificationTimestamp; // ⏰ VERIFICATION TIMESTAMP
  final String verifiedBy; // 👨‍💼 VERIFIED BY AUTHORITY
  final bool isVerified; // ✅ BLOCKCHAIN VERIFIED STATUS
  final DateTime? expiryTimestamp; // ⏰ EXPIRY TIMESTAMP
  final int trustScore; // ⭐ TRUST SCORE (0-100)
  final String? biometricHash; // 👤 BIOMETRIC VERIFICATION HASH

  BlockchainKYCData({
    required this.documentType,
    required this.documentHash,
    required this.fullNameHash,
    required this.nationalityHash,
    required this.verificationTimestamp,
    required this.verifiedBy,
    required this.isVerified,
    this.expiryTimestamp,
    required this.trustScore,
    this.biometricHash,
  });

  factory BlockchainKYCData.fromJson(Map<String, dynamic> json) {
    return BlockchainKYCData(
      documentType: json['documentType'],
      documentHash: json['documentHash'],
      fullNameHash: json['fullNameHash'],
      nationalityHash: json['nationalityHash'],
      verificationTimestamp: DateTime.parse(json['verificationTimestamp']),
      verifiedBy: json['verifiedBy'],
      isVerified: json['isVerified'],
      expiryTimestamp: json['expiryTimestamp'] != null 
          ? DateTime.parse(json['expiryTimestamp']) 
          : null,
      trustScore: json['trustScore'],
      biometricHash: json['biometricHash'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'documentType': documentType,
      'documentHash': documentHash,
      'fullNameHash': fullNameHash,
      'nationalityHash': nationalityHash,
      'verificationTimestamp': verificationTimestamp.toIso8601String(),
      'verifiedBy': verifiedBy,
      'isVerified': isVerified,
      'expiryTimestamp': expiryTimestamp?.toIso8601String(),
      'trustScore': trustScore,
      'biometricHash': biometricHash,
    };
  }
}

/// 🌐 DECENTRALIZED Trip Data Structure
class TripData {
  final String itineraryHash; // IPFS hash of encrypted itinerary
  final DateTime startTimestamp;
  final DateTime endTimestamp;
  final String purpose; // "tourism", "business", "transit", "medical"
  final int groupSize;
  final String accommodationHash; // IPFS hash of accommodation details

  TripData({
    required this.itineraryHash,
    required this.startTimestamp,
    required this.endTimestamp,
    required this.purpose,
    required this.groupSize,
    required this.accommodationHash,
  });

  factory TripData.fromJson(Map<String, dynamic> json) {
    return TripData(
      itineraryHash: json['itineraryHash'],
      startTimestamp: DateTime.parse(json['startTimestamp']),
      endTimestamp: DateTime.parse(json['endTimestamp']),
      purpose: json['purpose'],
      groupSize: json['groupSize'],
      accommodationHash: json['accommodationHash'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'itineraryHash': itineraryHash,
      'startTimestamp': startTimestamp.toIso8601String(),
      'endTimestamp': endTimestamp.toIso8601String(),
      'purpose': purpose,
      'groupSize': groupSize,
      'accommodationHash': accommodationHash,
    };
  }
}

/// 🔒 BLOCKCHAIN VERIFIED Tourist Profile - Enhanced for SIH 2025 Demo
/// All data is cryptographically secured and tamper-proof
class TouristProfile {
  final String id; // Blockchain identity ID
  final String walletAddress; // Tourist wallet address (0x...)
  final String touristIdHash; // Hash of government-issued tourist ID
  final String name;
  final String email;
  final String phone;
  final String nationality;
  final String passportNumber;
  final DateTime? dateOfBirth;
  final String? profileImageUrl;
  final List<EmergencyContact> emergencyContacts;
  final UserPreferences preferences;
  final BlockchainKYCData kycData; // 🔒 BLOCKCHAIN VERIFIED KYC
  final TripData tripData; // 🌐 DECENTRALIZED TRIP INFO
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isBlockchainVerified; // ✅ BLOCKCHAIN VERIFIED STATUS
  final int trustScore; // ⭐ TRUST SCORE (0-100)
  final String blockchainHash; // 🔐 IMMUTABLE RECORD HASH

  TouristProfile({
    required this.id,
    required this.walletAddress,
    required this.touristIdHash,
    required this.name,
    required this.email,
    required this.phone,
    required this.nationality,
    required this.passportNumber,
    this.dateOfBirth,
    this.profileImageUrl,
    required this.emergencyContacts,
    required this.preferences,
    required this.kycData,
    required this.tripData,
    required this.createdAt,
    required this.updatedAt,
    required this.isBlockchainVerified,
    required this.trustScore,
    required this.blockchainHash,
  });

  factory TouristProfile.fromJson(Map<String, dynamic> json) {
    return TouristProfile(
      id: json['id'],
      walletAddress: json['walletAddress'],
      touristIdHash: json['touristIdHash'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      nationality: json['nationality'],
      passportNumber: json['passportNumber'],
      dateOfBirth: json['dateOfBirth'] != null 
          ? DateTime.parse(json['dateOfBirth']) 
          : null,
      profileImageUrl: json['profileImageUrl'],
      emergencyContacts: (json['emergencyContacts'] as List)
          .map((e) => EmergencyContact.fromJson(e))
          .toList(),
      preferences: UserPreferences.fromJson(json['preferences']),
      kycData: BlockchainKYCData.fromJson(json['kycData']),
      tripData: TripData.fromJson(json['tripData']),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      isBlockchainVerified: json['isBlockchainVerified'],
      trustScore: json['trustScore'],
      blockchainHash: json['blockchainHash'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'walletAddress': walletAddress,
      'touristIdHash': touristIdHash,
      'name': name,
      'email': email,
      'phone': phone,
      'nationality': nationality,
      'passportNumber': passportNumber,
      'dateOfBirth': dateOfBirth?.toIso8601String(),
      'profileImageUrl': profileImageUrl,
      'emergencyContacts': emergencyContacts.map((e) => e.toJson()).toList(),
      'preferences': preferences.toJson(),
      'kycData': kycData.toJson(),
      'tripData': tripData.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isBlockchainVerified': isBlockchainVerified,
      'trustScore': trustScore,
      'blockchainHash': blockchainHash,
    };
  }

  TouristProfile copyWith({
    String? name,
    String? email,
    String? phone,
    String? nationality,
    String? passportNumber,
    DateTime? dateOfBirth,
    String? profileImageUrl,
    List<EmergencyContact>? emergencyContacts,
    UserPreferences? preferences,
    BlockchainKYCData? kycData,
    TripData? tripData,
    bool? isBlockchainVerified,
    int? trustScore,
  }) {
    return TouristProfile(
      id: id,
      walletAddress: walletAddress,
      touristIdHash: touristIdHash,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      nationality: nationality ?? this.nationality,
      passportNumber: passportNumber ?? this.passportNumber,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      emergencyContacts: emergencyContacts ?? this.emergencyContacts,
      preferences: preferences ?? this.preferences,
      kycData: kycData ?? this.kycData,
      tripData: tripData ?? this.tripData,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
      isBlockchainVerified: isBlockchainVerified ?? this.isBlockchainVerified,
      trustScore: trustScore ?? this.trustScore,
      blockchainHash: blockchainHash, // This stays the same as it's immutable
    );
  }
}

class EmergencyContact {
  final String id;
  final String name;
  final String phone;
  final String relationship;
  final String? email;
  final bool isPrimary;

  EmergencyContact({
    required this.id,
    required this.name,
    required this.phone,
    required this.relationship,
    this.email,
    required this.isPrimary,
  });

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      id: json['id'],
      name: json['name'],
      phone: json['phone'],
      relationship: json['relationship'],
      email: json['email'],
      isPrimary: json['isPrimary'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'relationship': relationship,
      'email': email,
      'isPrimary': isPrimary,
    };
  }
}

class UserPreferences {
  final String language;
  final bool pushNotifications;
  final bool emailNotifications;
  final bool smsNotifications;
  final bool emergencyAlerts;
  final bool weatherAlerts;
  final bool locationSharing;
  final String emergencyContactOrder;

  UserPreferences({
    required this.language,
    required this.pushNotifications,
    required this.emailNotifications,
    required this.smsNotifications,
    required this.emergencyAlerts,
    required this.weatherAlerts,
    required this.locationSharing,
    required this.emergencyContactOrder,
  });

  factory UserPreferences.fromJson(Map<String, dynamic> json) {
    return UserPreferences(
      language: json['language'],
      pushNotifications: json['pushNotifications'],
      emailNotifications: json['emailNotifications'],
      smsNotifications: json['smsNotifications'],
      emergencyAlerts: json['emergencyAlerts'],
      weatherAlerts: json['weatherAlerts'],
      locationSharing: json['locationSharing'],
      emergencyContactOrder: json['emergencyContactOrder'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'language': language,
      'pushNotifications': pushNotifications,
      'emailNotifications': emailNotifications,
      'smsNotifications': smsNotifications,
      'emergencyAlerts': emergencyAlerts,
      'weatherAlerts': weatherAlerts,
      'locationSharing': locationSharing,
      'emergencyContactOrder': emergencyContactOrder,
    };
  }

  UserPreferences copyWith({
    String? language,
    bool? pushNotifications,
    bool? emailNotifications,
    bool? smsNotifications,
    bool? emergencyAlerts,
    bool? weatherAlerts,
    bool? locationSharing,
    String? emergencyContactOrder,
  }) {
    return UserPreferences(
      language: language ?? this.language,
      pushNotifications: pushNotifications ?? this.pushNotifications,
      emailNotifications: emailNotifications ?? this.emailNotifications,
      smsNotifications: smsNotifications ?? this.smsNotifications,
      emergencyAlerts: emergencyAlerts ?? this.emergencyAlerts,
      weatherAlerts: weatherAlerts ?? this.weatherAlerts,
      locationSharing: locationSharing ?? this.locationSharing,
      emergencyContactOrder: emergencyContactOrder ?? this.emergencyContactOrder,
    );
  }
}
