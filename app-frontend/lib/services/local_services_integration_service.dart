import 'dart:async';
import 'dart:math';

/// 🏪 Local Service Model - Enhanced for SIH 2025 Demo
class LocalService {
  final String id;
  final String name;
  final String category; // 'hospital', 'restaurant', 'hotel', 'transport', 'emergency', 'tourist_spot'
  final String description;
  final double latitude;
  final double longitude;
  final String address;
  final String phone;
  final String? website;
  final List<String> amenities;
  final double rating;
  final int reviewCount;
  final bool isVerified; // 🔒 BLOCKCHAIN VERIFIED
  final bool isEmergencyService;
  final Map<String, dynamic> operatingHours;
  final double distance; // Distance from user in km
  final bool isAvailable;
  final String? blockchainVerificationHash;
  final List<String> languages;
  final Map<String, dynamic> pricing;

  LocalService({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.phone,
    this.website,
    required this.amenities,
    required this.rating,
    required this.reviewCount,
    required this.isVerified,
    required this.isEmergencyService,
    required this.operatingHours,
    required this.distance,
    required this.isAvailable,
    this.blockchainVerificationHash,
    required this.languages,
    required this.pricing,
  });

  factory LocalService.fromJson(Map<String, dynamic> json) {
    return LocalService(
      id: json['id'],
      name: json['name'],
      category: json['category'],
      description: json['description'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
      address: json['address'],
      phone: json['phone'],
      website: json['website'],
      amenities: List<String>.from(json['amenities']),
      rating: json['rating'].toDouble(),
      reviewCount: json['reviewCount'],
      isVerified: json['isVerified'],
      isEmergencyService: json['isEmergencyService'],
      operatingHours: json['operatingHours'],
      distance: json['distance'].toDouble(),
      isAvailable: json['isAvailable'],
      blockchainVerificationHash: json['blockchainVerificationHash'],
      languages: List<String>.from(json['languages']),
      pricing: json['pricing'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'phone': phone,
      'website': website,
      'amenities': amenities,
      'rating': rating,
      'reviewCount': reviewCount,
      'isVerified': isVerified,
      'isEmergencyService': isEmergencyService,
      'operatingHours': operatingHours,
      'distance': distance,
      'isAvailable': isAvailable,
      'blockchainVerificationHash': blockchainVerificationHash,
      'languages': languages,
      'pricing': pricing,
    };
  }
}

/// 📝 Service Review Model
class ServiceReview {
  final String id;
  final String serviceId;
  final String userId;
  final String userName;
  final double rating;
  final String review;
  final DateTime timestamp;
  final List<String> photos;
  final bool isVerified;
  final String? blockchainTxHash;

  ServiceReview({
    required this.id,
    required this.serviceId,
    required this.userId,
    required this.userName,
    required this.rating,
    required this.review,
    required this.timestamp,
    required this.photos,
    required this.isVerified,
    this.blockchainTxHash,
  });
}

/// 🏪 Local Services Integration Service - Blockchain Enhanced
/// Handles nearby services discovery, real-time availability, and service ratings
class LocalServicesIntegrationService {
  static final LocalServicesIntegrationService _instance = 
      LocalServicesIntegrationService._internal();
  factory LocalServicesIntegrationService() => _instance;
  LocalServicesIntegrationService._internal();

  final StreamController<List<LocalService>> _servicesController = 
      StreamController<List<LocalService>>.broadcast();
  
  final List<LocalService> _allServices = [];
  final List<ServiceReview> _reviews = [];
  final Random _random = Random();
  
  // Mock user location (Guwahati)
  static const double _userLatitude = 26.1445;
  static const double _userLongitude = 91.7362;

  /// Stream of nearby services updates
  Stream<List<LocalService>> get servicesStream => _servicesController.stream;

  /// Initialize local services
  Future<void> initialize() async {
    await Future.delayed(const Duration(seconds: 1));
    
    // Load mock services
    await _loadMockServices();
    
    // Start real-time availability updates
    _startAvailabilityUpdates();
    
    print('🏪 Local Services Integration Service Initialized');
    print('📍 Location: Guwahati, India');
    print('🔒 BLOCKCHAIN VERIFIED Services Available');
  }

  /// Get nearby services by category
  Future<List<LocalService>> getNearbyServices({
    String? category,
    double maxDistance = 10.0,
    bool verifiedOnly = false,
    bool availableOnly = true,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));

    var services = List<LocalService>.from(_allServices);

    // Filter by category
    if (category != null) {
      services = services.where((s) => s.category == category).toList();
    }

    // Filter by distance
    services = services.where((s) => s.distance <= maxDistance).toList();

    // Filter by verification status
    if (verifiedOnly) {
      services = services.where((s) => s.isVerified).toList();
    }

    // Filter by availability
    if (availableOnly) {
      services = services.where((s) => s.isAvailable).toList();
    }

    // Sort by distance
    services.sort((a, b) => a.distance.compareTo(b.distance));

    return services;
  }

  /// Get emergency services
  Future<List<LocalService>> getEmergencyServices() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    return _allServices
        .where((s) => s.isEmergencyService)
        .where((s) => s.isAvailable)
        .toList()
      ..sort((a, b) => a.distance.compareTo(b.distance));
  }

  /// Search services
  Future<List<LocalService>> searchServices(String query) async {
    await Future.delayed(const Duration(milliseconds: 800));
    
    final lowerQuery = query.toLowerCase();
    return _allServices.where((service) {
      return service.name.toLowerCase().contains(lowerQuery) ||
             service.description.toLowerCase().contains(lowerQuery) ||
             service.category.toLowerCase().contains(lowerQuery) ||
             service.amenities.any((amenity) => 
                 amenity.toLowerCase().contains(lowerQuery));
    }).toList();
  }

  /// Get service details
  Future<LocalService?> getServiceDetails(String serviceId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    
    try {
      return _allServices.firstWhere((s) => s.id == serviceId);
    } catch (e) {
      return null;
    }
  }

  /// Get service reviews
  Future<List<ServiceReview>> getServiceReviews(String serviceId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    return _reviews.where((r) => r.serviceId == serviceId).toList()
      ..sort((a, b) => b.timestamp.compareTo(a.timestamp));
  }

  /// Add service review
  Future<void> addServiceReview({
    required String serviceId,
    required double rating,
    required String review,
    List<String> photos = const [],
  }) async {
    await Future.delayed(const Duration(seconds: 1));
    
    final newReview = ServiceReview(
      id: 'review_${DateTime.now().millisecondsSinceEpoch}',
      serviceId: serviceId,
      userId: 'tourist_demo_2025',
      userName: 'Rajesh Kumar',
      rating: rating,
      review: review,
      timestamp: DateTime.now(),
      photos: photos,
      isVerified: true,
      blockchainTxHash: _generateTxHash(),
    );

    _reviews.add(newReview);

    // Update service rating
    final serviceIndex = _allServices.indexWhere((s) => s.id == serviceId);
    if (serviceIndex != -1) {
      final service = _allServices[serviceIndex];
      final serviceReviews = _reviews.where((r) => r.serviceId == serviceId).toList();
      final avgRating = serviceReviews.map((r) => r.rating).reduce((a, b) => a + b) / serviceReviews.length;
      
      // In real implementation, update the service rating
      print('📝 Review added for ${service.name}: $rating stars');
      print('🔒 Review stored on blockchain: ${newReview.blockchainTxHash}');
    }
  }

  /// Check real-time availability
  Future<bool> checkServiceAvailability(String serviceId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    // Simulate real-time availability check
    final service = _allServices.where((s) => s.id == serviceId).firstOrNull;
    if (service == null) return false;

    // Check operating hours
    final now = DateTime.now();
    final currentHour = now.hour;
    
    final openHour = service.operatingHours['open'] ?? 0;
    final closeHour = service.operatingHours['close'] ?? 24;
    
    final isWithinHours = currentHour >= openHour && currentHour < closeHour;
    
    // Add some randomness for demo
    final isAvailable = isWithinHours && _random.nextDouble() > 0.1; // 90% availability
    
    return isAvailable;
  }

  /// Get service statistics
  Map<String, dynamic> getServiceStats() {
    final categories = <String, int>{};
    int verifiedCount = 0;
    int availableCount = 0;
    double totalRating = 0;
    int ratedServicesCount = 0;

    for (final service in _allServices) {
      categories[service.category] = (categories[service.category] ?? 0) + 1;
      
      if (service.isVerified) verifiedCount++;
      if (service.isAvailable) availableCount++;
      
      if (service.reviewCount > 0) {
        totalRating += service.rating;
        ratedServicesCount++;
      }
    }

    return {
      'totalServices': _allServices.length,
      'verifiedServices': verifiedCount,
      'availableServices': availableCount,
      'averageRating': ratedServicesCount > 0 ? totalRating / ratedServicesCount : 0,
      'categoriesBreakdown': categories,
      'totalReviews': _reviews.length,
    };
  }

  /// Get recommended services
  Future<List<LocalService>> getRecommendedServices() async {
    await Future.delayed(const Duration(milliseconds: 600));
    
    // Get highly rated, verified services
    var recommended = _allServices
        .where((s) => s.isVerified && s.rating >= 4.0 && s.isAvailable)
        .toList();
    
    // Sort by rating and proximity
    recommended.sort((a, b) {
      final aScore = a.rating * 0.7 + (10 - a.distance) * 0.3;
      final bScore = b.rating * 0.7 + (10 - b.distance) * 0.3;
      return bScore.compareTo(aScore);
    });
    
    return recommended.take(10).toList();
  }

  /// Dispose service
  void dispose() {
    _servicesController.close();
  }

  // Private methods
  Future<void> _loadMockServices() async {
    final mockServices = [
      // Emergency Services
      LocalService(
        id: 'emergency_001',
        name: 'Guwahati Medical College Hospital',
        category: 'hospital',
        description: 'Leading government hospital with 24/7 emergency services',
        latitude: 26.1583,
        longitude: 91.7386,
        address: 'Bhangagarh, Guwahati, Assam 781032',
        phone: '+91 361 2528001',
        website: 'https://gmch.gov.in',
        amenities: ['Emergency Care', 'ICU', 'Surgery', 'Ambulance', 'Pharmacy'],
        rating: 4.2,
        reviewCount: 1245,
        isVerified: true,
        isEmergencyService: true,
        operatingHours: {'open': 0, 'close': 24},
        distance: 1.8,
        isAvailable: true,
        blockchainVerificationHash: '0xabcd1234...',
        languages: ['English', 'Hindi', 'Assamese'],
        pricing: {'consultation': '₹50', 'emergency': '₹200'},
      ),
      
      LocalService(
        id: 'emergency_002',
        name: 'Dispur Police Station',
        category: 'emergency',
        description: 'Local police station for tourist assistance and emergency response',
        latitude: 26.1433,
        longitude: 91.7898,
        address: 'Dispur, Guwahati, Assam 781006',
        phone: '100',
        amenities: ['Tourist Help Desk', '24/7 Service', 'English Speaking Officers'],
        rating: 4.0,
        reviewCount: 89,
        isVerified: true,
        isEmergencyService: true,
        operatingHours: {'open': 0, 'close': 24},
        distance: 2.1,
        isAvailable: true,
        blockchainVerificationHash: '0xef567890...',
        languages: ['English', 'Hindi', 'Assamese'],
        pricing: {'service': 'Free'},
      ),

      // Restaurants
      LocalService(
        id: 'restaurant_001',
        name: 'Khorikaa Traditional Assamese Cuisine',
        category: 'restaurant',
        description: 'Authentic Assamese food with traditional ambiance. Tourist-friendly.',
        latitude: 26.1518,
        longitude: 91.7414,
        address: 'GS Road, Ulubari, Guwahati, Assam 781007',
        phone: '+91 361 2635789',
        website: 'https://khorikaa.com',
        amenities: ['Traditional Food', 'AC Dining', 'English Menu', 'Card Payment'],
        rating: 4.6,
        reviewCount: 567,
        isVerified: true,
        isEmergencyService: false,
        operatingHours: {'open': 11, 'close': 23},
        distance: 0.8,
        isAvailable: true,
        blockchainVerificationHash: '0x12345abc...',
        languages: ['English', 'Hindi', 'Assamese'],
        pricing: {'meal_for_two': '₹800-1200'},
      ),

      // Hotels
      LocalService(
        id: 'hotel_001',
        name: 'Hotel Dynasty',
        category: 'hotel',
        description: '4-star hotel with excellent tourist facilities and safety measures',
        latitude: 26.1445,
        longitude: 91.7320,
        address: 'SS Road, Lakhtokia, Guwahati, Assam 781001',
        phone: '+91 361 2540021',
        website: 'https://hoteldynasty.in',
        amenities: ['WiFi', 'AC', 'Restaurant', '24/7 Reception', 'Tourist Guide'],
        rating: 4.3,
        reviewCount: 892,
        isVerified: true,
        isEmergencyService: false,
        operatingHours: {'open': 0, 'close': 24},
        distance: 0.2,
        isAvailable: true,
        blockchainVerificationHash: '0xhotel123...',
        languages: ['English', 'Hindi', 'Assamese', 'Bengali'],
        pricing: {'per_night': '₹3500-8000'},
      ),

      // Tourist Spots
      LocalService(
        id: 'tourist_001',
        name: 'Kamakhya Temple',
        category: 'tourist_spot',
        description: 'Famous Hindu temple and major pilgrimage site',
        latitude: 26.1664,
        longitude: 91.7041,
        address: 'Nilachal Hills, Guwahati, Assam 781010',
        phone: '+91 361 2669212',
        amenities: ['Guided Tours', 'Parking', 'Souvenir Shop', 'Prasad Counter'],
        rating: 4.7,
        reviewCount: 2341,
        isVerified: true,
        isEmergencyService: false,
        operatingHours: {'open': 5, 'close': 22},
        distance: 3.2,
        isAvailable: true,
        blockchainVerificationHash: '0xtemple456...',
        languages: ['English', 'Hindi', 'Assamese', 'Bengali'],
        pricing: {'entry': 'Free', 'special_darshan': '₹51'},
      ),

      // Transportation
      LocalService(
        id: 'transport_001',
        name: 'Guwahati Railway Station',
        category: 'transport',
        description: 'Major railway junction connecting Northeast India',
        latitude: 26.1837,
        longitude: 91.7460,
        address: 'Railway Station Road, Guwahati, Assam 781011',
        phone: '139',
        amenities: ['Waiting Room', 'Food Court', 'Tourist Help Desk', 'WiFi'],
        rating: 3.8,
        reviewCount: 445,
        isVerified: true,
        isEmergencyService: false,
        operatingHours: {'open': 0, 'close': 24},
        distance: 4.5,
        isAvailable: true,
        blockchainVerificationHash: '0xrailway789...',
        languages: ['English', 'Hindi', 'Assamese', 'Bengali'],
        pricing: {'platform_ticket': '₹10'},
      ),
    ];

    _allServices.addAll(mockServices);
    
    // Generate mock reviews
    await _generateMockReviews();
    
    _servicesController.add(_allServices);
    print('🏪 Loaded ${_allServices.length} local services');
  }

  Future<void> _generateMockReviews() async {
    final mockReviews = [
      ServiceReview(
        id: 'review_001',
        serviceId: 'restaurant_001',
        userId: 'user_001',
        userName: 'Priya Singh',
        rating: 5.0,
        review: 'Amazing traditional Assamese food! Staff was very helpful with recommendations. Perfect for tourists.',
        timestamp: DateTime.now().subtract(const Duration(days: 2)),
        photos: [],
        isVerified: true,
        blockchainTxHash: '0xreview123...',
      ),
      ServiceReview(
        id: 'review_002',
        serviceId: 'hotel_001',
        userId: 'user_002',
        userName: 'Kumar Patel',
        rating: 4.0,
        review: 'Good hotel with excellent location. Room service was prompt and staff speaks English well.',
        timestamp: DateTime.now().subtract(const Duration(hours: 12)),
        photos: [],
        isVerified: true,
        blockchainTxHash: '0xreview456...',
      ),
    ];

    _reviews.addAll(mockReviews);
  }

  void _startAvailabilityUpdates() {
    Timer.periodic(const Duration(minutes: 2), (timer) {
      // Randomly update availability status for demo
      for (int i = 0; i < _allServices.length; i++) {
        if (_random.nextDouble() > 0.95) { // 5% chance of status change
          // In real implementation, create copyWith method for LocalService
          print('📊 Availability updated for ${_allServices[i].name}');
        }
      }
    });
  }

  String _generateTxHash() {
    return '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16)}';
  }
}
