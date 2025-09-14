import 'package:flutter/material.dart';
import '../theme/emergency_theme.dart';

class NextGenLocationIntelligenceScreen extends StatefulWidget {
  const NextGenLocationIntelligenceScreen({Key? key}) : super(key: key);

  @override
  State<NextGenLocationIntelligenceScreen> createState() => _NextGenLocationIntelligenceScreenState();
}

class _NextGenLocationIntelligenceScreenState extends State<NextGenLocationIntelligenceScreen> 
    with TickerProviderStateMixin {
  late AnimationController _mapController;
  
  bool _indoorPositioningEnabled = true;
  bool _offlineMapEnabled = true;
  bool _crowdsourcedUpdatesEnabled = true;
  bool _weatherIntegratedRouting = true;
  bool _culturalZoneAwareness = true;
  bool _multiLanguageNames = true;

  String _currentLocation = 'Times Square, NYC';
  String _indoorLocation = 'Floor 2, Zone A, near Info Desk';
  double _locationAccuracy = 2.3; // meters
  int _nearbyBeacons = 8;
  String _weatherCondition = 'Clear, 22°C';
  String _culturalZone = 'Tourist-Friendly Zone';

  List<Map<String, dynamic>> _nearbyPlaces = [
    {
      'name': 'Emergency Medical Center',
      'distance': '150m',
      'type': 'emergency',
      'safetyRating': 5,
      'crowdLevel': 'Low',
      'icon': Icons.local_hospital,
      'color': EmergencyColorPalette.danger[500],
    },
    {
      'name': 'Police Station',
      'distance': '300m',
      'type': 'safety',
      'safetyRating': 5,
      'crowdLevel': 'Medium',
      'icon': Icons.local_police,
      'color': EmergencyColorPalette.primary[500],
    },
    {
      'name': 'Tourist Information Center',
      'distance': '80m',
      'type': 'info',
      'safetyRating': 4,
      'crowdLevel': 'High',
      'icon': Icons.info,
      'color': EmergencyColorPalette.info[500],
    },
    {
      'name': 'Safe Rest Area',
      'distance': '200m',
      'type': 'rest',
      'safetyRating': 4,
      'crowdLevel': 'Low',
      'icon': Icons.chair,
      'color': EmergencyColorPalette.secondary[500],
    },
  ];

  List<Map<String, dynamic>> _safetyRoutes = [
    {
      'destination': 'Central Park',
      'duration': '15 min',
      'safetyScore': 92,
      'crowdLevel': 'Medium',
      'weather': 'Good',
      'cultural': 'Tourist-friendly',
      'type': 'walking',
    },
    {
      'destination': 'Museum District',
      'duration': '20 min',
      'safetyScore': 88,
      'crowdLevel': 'High',
      'weather': 'Good',
      'cultural': 'Cultural zone',
      'type': 'public_transport',
    },
    {
      'destination': 'Shopping District',
      'duration': '12 min',
      'safetyScore': 85,
      'crowdLevel': 'Very High',
      'weather': 'Good',
      'cultural': 'Commercial zone',
      'type': 'walking',
    },
  ];

  @override
  void initState() {
    super.initState();
    _mapController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🗺️ Smart Location Intelligence'),
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: _refreshLocation,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showLocationSettings,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildLocationStatusCard(),
            const SizedBox(height: 20),
            _buildIndoorPositioning(),
            const SizedBox(height: 20),
            _buildLocationFeatures(),
            const SizedBox(height: 20),
            _buildNearbyPlaces(),
            const SizedBox(height: 20),
            _buildSafetyRoutes(),
            const SizedBox(height: 20),
            _buildCulturalIntelligence(),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationStatusCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            EmergencyColorPalette.primary[50]!,
            EmergencyColorPalette.primary[100]!,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: EmergencyColorPalette.primary[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AnimatedBuilder(
                animation: _mapController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: 1 + (_mapController.value * 0.1),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: EmergencyColorPalette.primary[500],
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.location_on,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Current Location',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      _currentLocation,
                      style: TextStyle(
                        fontSize: 16,
                        color: EmergencyColorPalette.neutral[700],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildLocationMetrics(),
        ],
      ),
    );
  }

  Widget _buildLocationMetrics() {
    return Row(
      children: [
        Expanded(
          child: _buildMetricItem(
            'Accuracy',
            '${_locationAccuracy}m',
            Icons.gps_fixed,
            EmergencyColorPalette.secondary[500]!,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildMetricItem(
            'Beacons',
            '$_nearbyBeacons',
            Icons.bluetooth,
            EmergencyColorPalette.info[500]!,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildMetricItem(
            'Signal',
            'Strong',
            Icons.signal_cellular_4_bar,
            EmergencyColorPalette.secondary[500]!,
          ),
        ),
      ],
    );
  }

  Widget _buildMetricItem(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: EmergencyColorPalette.neutral[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIndoorPositioning() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.maps_home_work,
                  color: EmergencyColorPalette.secondary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Indoor Positioning System',
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
                color: EmergencyColorPalette.secondary[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: EmergencyColorPalette.secondary[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.location_city,
                        color: EmergencyColorPalette.secondary[600],
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Indoor Location',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: EmergencyColorPalette.secondary[700],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _indoorLocation,
                    style: TextStyle(
                      fontSize: 16,
                      color: EmergencyColorPalette.neutral[800],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _buildIndoorFeatures(),
          ],
        ),
      ),
    );
  }

  Widget _buildIndoorFeatures() {
    return Column(
      children: [
        _buildFeatureRow(
          'WiFi/Bluetooth Beacon Navigation',
          'High precision indoor tracking',
          Icons.wifi,
          _indoorPositioningEnabled,
          (value) => setState(() => _indoorPositioningEnabled = value),
        ),
        _buildFeatureRow(
          'Floor Plan Integration',
          'Interactive building maps',
          Icons.map,
          true,
          null,
        ),
        _buildFeatureRow(
          'Emergency Exit Routes',
          'Fastest evacuation paths',
          Icons.exit_to_app,
          true,
          null,
        ),
      ],
    );
  }

  Widget _buildLocationFeatures() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.auto_awesome,
                  color: EmergencyColorPalette.warning[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Smart Location Features',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildFeatureRow(
              'Offline Maps with AI Routes',
              'Smart offline route optimization',
              Icons.map,
              _offlineMapEnabled,
              (value) => setState(() => _offlineMapEnabled = value),
            ),
            _buildFeatureRow(
              'Crowdsourced Safety Updates',
              'Community-driven safety data',
              Icons.groups,
              _crowdsourcedUpdatesEnabled,
              (value) => setState(() => _crowdsourcedUpdatesEnabled = value),
            ),
            _buildFeatureRow(
              'Weather-Integrated Routing',
              'Weather-aware safe path planning',
              Icons.wb_sunny,
              _weatherIntegratedRouting,
              (value) => setState(() => _weatherIntegratedRouting = value),
            ),
            _buildFeatureRow(
              'Cultural Zone Awareness',
              'Respect local customs and restrictions',
              Icons.temple_buddhist,
              _culturalZoneAwareness,
              (value) => setState(() => _culturalZoneAwareness = value),
            ),
            _buildFeatureRow(
              'Multi-Language Location Names',
              'Native language place recognition',
              Icons.translate,
              _multiLanguageNames,
              (value) => setState(() => _multiLanguageNames = value),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureRow(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool)? onChanged,
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
          if (onChanged != null)
            Switch(
              value: value,
              onChanged: onChanged,
              activeColor: EmergencyColorPalette.primary[500],
            )
          else
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: EmergencyColorPalette.secondary[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'ACTIVE',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: EmergencyColorPalette.secondary[600],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNearbyPlaces() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.place,
                  color: EmergencyColorPalette.info[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Nearby Important Places',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...(_nearbyPlaces.map((place) => _buildPlaceItem(place))),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceItem(Map<String, dynamic> place) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: place['color'].withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: place['color'].withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: place['color'].withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              place['icon'],
              color: place['color'],
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  place['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      place['distance'],
                      style: TextStyle(
                        fontSize: 12,
                        color: EmergencyColorPalette.neutral[600],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '• ${place['crowdLevel']} crowd',
                      style: TextStyle(
                        fontSize: 12,
                        color: EmergencyColorPalette.neutral[600],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            children: [
              Row(
                children: List.generate(
                  5,
                  (index) => Icon(
                    index < place['safetyRating'] ? Icons.star : Icons.star_border,
                    size: 12,
                    color: EmergencyColorPalette.warning[500],
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Safety',
                style: TextStyle(
                  fontSize: 10,
                  color: EmergencyColorPalette.neutral[500],
                ),
              ),
            ],
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.navigation, size: 20),
            onPressed: () => _navigateToPlace(place),
            color: place['color'],
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyRoutes() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.route,
                  color: EmergencyColorPalette.secondary[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'AI-Optimized Safety Routes',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...(_safetyRoutes.map((route) => _buildRouteItem(route))),
          ],
        ),
      ),
    );
  }

  Widget _buildRouteItem(Map<String, dynamic> route) {
    Color scoreColor = _getRouteScoreColor(route['safetyScore']);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scoreColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: scoreColor.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  route['destination'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: scoreColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${route['safetyScore']}% Safe',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: scoreColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                route['type'] == 'walking' ? Icons.directions_walk : Icons.directions_bus,
                size: 16,
                color: EmergencyColorPalette.neutral[600],
              ),
              const SizedBox(width: 4),
              Text(
                route['duration'],
                style: TextStyle(
                  fontSize: 12,
                  color: EmergencyColorPalette.neutral[600],
                ),
              ),
              const SizedBox(width: 16),
              Icon(
                Icons.groups,
                size: 16,
                color: EmergencyColorPalette.neutral[600],
              ),
              const SizedBox(width: 4),
              Text(
                route['crowdLevel'],
                style: TextStyle(
                  fontSize: 12,
                  color: EmergencyColorPalette.neutral[600],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Weather: ${route['weather']} • Cultural: ${route['cultural']}',
                  style: TextStyle(
                    fontSize: 12,
                    color: EmergencyColorPalette.neutral[600],
                  ),
                ),
              ),
              ElevatedButton(
                onPressed: () => _selectRoute(route),
                style: ElevatedButton.styleFrom(
                  backgroundColor: scoreColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  minimumSize: Size.zero,
                ),
                child: const Text('Select'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCulturalIntelligence() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.public,
                  color: EmergencyColorPalette.info[500],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Cultural Intelligence',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildCulturalInfo('Current Zone', _culturalZone, Icons.location_city),
            _buildCulturalInfo('Weather Condition', _weatherCondition, Icons.wb_sunny),
            _buildCulturalInfo('Local Time', '2:30 PM EST', Icons.access_time),
            _buildCulturalInfo('Cultural Notes', 'Photography allowed, English widely spoken', Icons.info),
          ],
        ),
      ),
    );
  }

  Widget _buildCulturalInfo(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(
            icon,
            color: EmergencyColorPalette.info[500],
            size: 20,
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: EmergencyColorPalette.neutral[600],
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getRouteScoreColor(int score) {
    if (score >= 85) return ZoneRiskColors.safe;
    if (score >= 70) return ZoneRiskColors.lowRisk;
    if (score >= 50) return ZoneRiskColors.moderateRisk;
    return ZoneRiskColors.highRisk;
  }

  void _refreshLocation() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🗺️ Refreshing location data...'),
        backgroundColor: EmergencyColorPalette.primary[500],
      ),
    );
  }

  void _showLocationSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Location Settings'),
        content: const Text('Configure location accuracy and privacy settings.'),
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

  void _navigateToPlace(Map<String, dynamic> place) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🧭 Navigating to ${place['name']}...'),
        backgroundColor: place['color'],
      ),
    );
  }

  void _selectRoute(Map<String, dynamic> route) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🚶 Starting route to ${route['destination']}...'),
        backgroundColor: EmergencyColorPalette.secondary[500],
      ),
    );
  }
}
