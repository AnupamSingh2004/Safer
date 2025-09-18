import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';

class NearbyPlacesScreen extends StatefulWidget {
  const NearbyPlacesScreen({Key? key}) : super(key: key);

  @override
  State<NearbyPlacesScreen> createState() => _NearbyPlacesScreenState();
}

class _NearbyPlacesScreenState extends State<NearbyPlacesScreen> with TickerProviderStateMixin {
  late TabController _tabController;


  // Sample data - in real app, this would come from API
  final List<Map<String, dynamic>> _hotels = [
    {
      'name': 'The Taj Mahal Palace',
      'address': 'Apollo Bunder, Colaba, Mumbai',
      'distance': '0.8 km',
      'rating': 4.5,
      'price': '₹15,000/night',
      'phone': '+91-22-6665-3366',
      'image': 'hotel1.jpg',
      'amenities': ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    },
    {
      'name': 'Hotel Marine Plaza',
      'address': 'Marine Drive, Mumbai',
      'distance': '1.2 km',
      'rating': 4.2,
      'price': '₹8,500/night',
      'phone': '+91-22-2285-1212',
      'image': 'hotel2.jpg',
      'amenities': ['WiFi', 'Restaurant', 'Gym', 'Bar'],
    },
    {
      'name': 'Trident Bandra Kurla',
      'address': 'Bandra Kurla Complex, Mumbai',
      'distance': '2.5 km',
      'rating': 4.3,
      'price': '₹12,000/night',
      'phone': '+91-22-6672-4444',
      'image': 'hotel3.jpg',
      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Business Center'],
    },
  ];

  final List<Map<String, dynamic>> _attractions = [
    {
      'name': 'Gateway of India',
      'address': 'Apollo Bunder, Colaba, Mumbai',
      'distance': '0.5 km',
      'rating': 4.4,
      'type': 'Historical Monument',
      'timings': '24 hours',
      'entry_fee': 'Free',
      'description': 'Iconic monument built during British Raj',
    },
    {
      'name': 'Marine Drive',
      'address': 'Netaji Subhash Chandra Bose Road, Mumbai',
      'distance': '1.0 km',
      'rating': 4.3,
      'type': 'Scenic Drive',
      'timings': '24 hours',
      'entry_fee': 'Free',
      'description': 'Famous promenade along the Arabian Sea',
    },
    {
      'name': 'Chhatrapati Shivaji Terminus',
      'address': 'Dr Dadabhai Naoroji Rd, Fort, Mumbai',
      'distance': '1.8 km',
      'rating': 4.2,
      'type': 'Railway Station / UNESCO Site',
      'timings': '24 hours',
      'entry_fee': 'Free',
      'description': 'Historic railway station and UNESCO World Heritage Site',
    },
  ];

  final List<Map<String, dynamic>> _restaurants = [
    {
      'name': 'Leopold Cafe',
      'address': 'Colaba Causeway, Mumbai',
      'distance': '0.6 km',
      'rating': 4.1,
      'cuisine': 'Continental, Indian',
      'price_range': '₹500-1500',
      'phone': '+91-22-2202-0131',
    },
    {
      'name': 'Trishna Restaurant',
      'address': 'Rampart Row, Fort, Mumbai',
      'distance': '1.4 km',
      'rating': 4.6,
      'cuisine': 'Seafood, Asian',
      'price_range': '₹2000-3000',
      'phone': '+91-22-2270-3213',
    },
  ];

  final List<Map<String, dynamic>> _emergencyServices = [
    {
      'name': 'GT Hospital',
      'address': 'Lt PN Kotnis Rd, Byculla, Mumbai',
      'distance': '2.2 km',
      'type': 'Government Hospital',
      'phone': '102',
      'emergency': true,
    },
    {
      'name': 'Colaba Police Station',
      'address': 'Colaba, Mumbai',
      'distance': '0.3 km',
      'type': 'Police Station',
      'phone': '100',
      'emergency': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const ThemeAwareText.heading('🏨 Nearby Places'),
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          isScrollable: false,
          tabs: const [
            Tab(icon: Icon(Icons.hotel), text: 'Hotels'),
            Tab(icon: Icon(Icons.place), text: 'Attractions'),
            Tab(icon: Icon(Icons.restaurant), text: 'Food'),
            Tab(icon: Icon(Icons.emergency), text: 'Emergency'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildHotelsTab(),
          _buildAttractionsTab(),
          _buildRestaurantsTab(),
          _buildEmergencyTab(),
        ],
      ),
    );
  }

  Widget _buildHotelsTab() {
    return RefreshIndicator(
      onRefresh: _refreshData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _hotels.length,
        itemBuilder: (context, index) {
          final hotel = _hotels[index];
          return _buildHotelCard(hotel);
        },
      ),
    );
  }

  Widget _buildHotelCard(Map<String, dynamic> hotel) {
    final theme = Theme.of(context);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: EmergencyColorPalette.primary[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.hotel,
                    color: EmergencyColorPalette.primary[500],
                    size: 30,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        hotel['name'],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        hotel['address'],
                        style: TextStyle(
                          fontSize: 12,
                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Text(
                          hotel['rating'].toString(),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      hotel['distance'],
                      style: TextStyle(
                        fontSize: 12,
                        color: EmergencyColorPalette.primary[500],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              hotel['price'],
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: EmergencyColorPalette.secondary[600],
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: (hotel['amenities'] as List<String>).map((amenity) {
                return Chip(
                  label: Text(
                    amenity,
                    style: const TextStyle(fontSize: 10),
                  ),
                  backgroundColor: theme.colorScheme.surface,
                  side: BorderSide(color: theme.colorScheme.outline),
                );
              }).toList(),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _callPlace(hotel['phone']),
                    icon: const Icon(Icons.phone, size: 16),
                    label: const Text('Call'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmergencyColorPalette.primary[500],
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _navigateToPlace(hotel['address']),
                    icon: const Icon(Icons.directions, size: 16),
                    label: const Text('Navigate'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttractionsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _attractions.length,
      itemBuilder: (context, index) {
        final attraction = _attractions[index];
        return _buildAttractionCard(attraction);
      },
    );
  }

  Widget _buildAttractionCard(Map<String, dynamic> attraction) {
    final theme = Theme.of(context);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: EmergencyColorPalette.info[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.place,
                    color: EmergencyColorPalette.info[500],
                    size: 30,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        attraction['name'],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        attraction['type'],
                        style: TextStyle(
                          fontSize: 12,
                          color: EmergencyColorPalette.info[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Text(
                          attraction['rating'].toString(),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      attraction['distance'],
                      style: TextStyle(
                        fontSize: 12,
                        color: EmergencyColorPalette.primary[500],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              attraction['description'],
              style: TextStyle(
                fontSize: 14,
                color: theme.colorScheme.onSurface.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildInfoChip('⏰ ${attraction['timings']}'),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildInfoChip('🎫 ${attraction['entry_fee']}'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => _navigateToPlace(attraction['address']),
                icon: const Icon(Icons.directions, size: 16),
                label: const Text('Get Directions'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRestaurantsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _restaurants.length,
      itemBuilder: (context, index) {
        final restaurant = _restaurants[index];
        return _buildRestaurantCard(restaurant);
      },
    );
  }

  Widget _buildRestaurantCard(Map<String, dynamic> restaurant) {
    final theme = Theme.of(context);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: EmergencyColorPalette.secondary[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.restaurant,
                    color: EmergencyColorPalette.secondary[500],
                    size: 30,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        restaurant['name'],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        restaurant['cuisine'],
                        style: TextStyle(
                          fontSize: 12,
                          color: EmergencyColorPalette.secondary[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Text(
                          restaurant['rating'].toString(),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      restaurant['distance'],
                      style: TextStyle(
                        fontSize: 12,
                        color: EmergencyColorPalette.primary[500],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              restaurant['price_range'],
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: EmergencyColorPalette.secondary[600],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _callPlace(restaurant['phone']),
                    icon: const Icon(Icons.phone, size: 16),
                    label: const Text('Call'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmergencyColorPalette.secondary[500],
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _navigateToPlace(restaurant['address']),
                    icon: const Icon(Icons.directions, size: 16),
                    label: const Text('Navigate'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmergencyTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _emergencyServices.length,
      itemBuilder: (context, index) {
        final service = _emergencyServices[index];
        return _buildEmergencyCard(service);
      },
    );
  }

  Widget _buildEmergencyCard(Map<String, dynamic> service) {
    final theme = Theme.of(context);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: EmergencyColorPalette.danger[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    service['type'] == 'Police Station' ? Icons.local_police : Icons.local_hospital,
                    color: EmergencyColorPalette.danger[500],
                    size: 30,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        service['name'],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        service['type'],
                        style: TextStyle(
                          fontSize: 12,
                          color: EmergencyColorPalette.danger[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  service['distance'],
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.primary[500],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _callPlace(service['phone']),
                    icon: const Icon(Icons.phone, size: 16),
                    label: Text('Call ${service['phone']}'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmergencyColorPalette.danger[500],
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _navigateToPlace(service['address']),
                    icon: const Icon(Icons.directions, size: 16),
                    label: const Text('Navigate'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(String text) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.colorScheme.outline),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 12,
          color: theme.colorScheme.onSurface,
        ),
      ),
    );
  }

  Future<void> _refreshData() async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
  }

  void _callPlace(String phoneNumber) async {
    final Uri phoneUri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(phoneUri)) {
      await launchUrl(phoneUri);
    }
  }

  void _navigateToPlace(String address) async {
    final Uri mapsUri = Uri(
      scheme: 'https',
      host: 'www.google.com',
      path: '/maps/search/',
      query: address,
    );
    if (await canLaunchUrl(mapsUri)) {
      await launchUrl(mapsUri, mode: LaunchMode.externalApplication);
    }
  }
}
