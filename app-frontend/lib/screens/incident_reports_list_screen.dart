import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';
import '../widgets/responsive_utils.dart';
import 'dart:math' as math;

class IncidentReportsListScreen extends StatefulWidget {
  const IncidentReportsListScreen({super.key});

  @override
  State<IncidentReportsListScreen> createState() => _IncidentReportsListScreenState();
}

class _IncidentReportsListScreenState extends State<IncidentReportsListScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  
  List<Map<String, dynamic>> _incidents = [];
  List<Map<String, dynamic>> _filteredIncidents = [];
  String _selectedSeverityFilter = 'All';
  String _selectedCategoryFilter = 'All';
  Position? _userLocation;
  bool _isLoading = true;
  
  final List<String> _severityFilters = ['All', 'Critical', 'High', 'Medium', 'Low'];
  final List<String> _categoryFilters = [
    'All', 'Theft', 'Harassment', 'Fraud/Scam', 'Lost Item', 
    'Suspicious Activity', 'Medical Emergency', 'Accident', 'Violence', 'Vandalism', 'Other'
  ];

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _loadData();
  }

  void _setupAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    // Get user location
    await _getUserLocation();
    
    // Load hardcoded incidents (simulating server data)
    await _loadHardcodedIncidents();
    
    // Filter incidents within 3km radius
    _filterIncidentsByDistance();
    
    // Apply current filters
    _applyFilters();
    
    setState(() {
      _isLoading = false;
    });
    
    _animationController.forward();
  }

  Future<void> _getUserLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          return;
        }
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      
      setState(() {
        _userLocation = position;
      });
    } catch (e) {
      debugPrint('Error getting location: $e');
    }
  }

  Future<void> _loadHardcodedIncidents() async {
    // Simulate loading from server
    await Future.delayed(const Duration(milliseconds: 800));
    
    final now = DateTime.now();
    
    _incidents = [
      {
        'id': '1',
        'title': 'Stolen Backpack at Train Station',
        'description': 'Black backpack with laptop stolen from platform bench. Security cameras may have footage.',
        'category': 'Theft',
        'severity': 'High',
        'location': {
          'latitude': _userLocation?.latitude ?? 28.6139 + (math.Random().nextDouble() - 0.5) * 0.01,
          'longitude': _userLocation?.longitude ?? 77.2090 + (math.Random().nextDouble() - 0.5) * 0.01,
          'address': 'Central Railway Station',
        },
        'timestamp': now.subtract(const Duration(minutes: 15)).toIso8601String(),
        'status': 'Active',
        'reporter': 'Anonymous',
        'hasImage': true,
        'viewCount': 12,
        'isVerified': true,
      },
      {
        'id': '2',
        'title': 'Suspicious Person Following Tourist',
        'description': 'Man in blue jacket following female tourist near market area. Tourist looked uncomfortable.',
        'category': 'Suspicious Activity',
        'severity': 'Medium',
        'location': {
          'latitude': _userLocation?.latitude ?? 28.6129 + (math.Random().nextDouble() - 0.5) * 0.02,
          'longitude': _userLocation?.longitude ?? 77.2100 + (math.Random().nextDouble() - 0.5) * 0.02,
          'address': 'Main Market Plaza',
        },
        'timestamp': now.subtract(const Duration(minutes: 32)).toIso8601String(),
        'status': 'Investigating',
        'reporter': 'Sarah K.',
        'hasImage': false,
        'viewCount': 8,
        'isVerified': false,
      },
      {
        'id': '3',
        'title': 'Fake Currency Exchange Scam',
        'description': 'Tourist was given fake currency notes in exchange for dollars. Scammer fled the scene.',
        'category': 'Fraud/Scam',
        'severity': 'Critical',
        'location': {
          'latitude': _userLocation?.latitude ?? 28.6149 + (math.Random().nextDouble() - 0.5) * 0.015,
          'longitude': _userLocation?.longitude ?? 77.2080 + (math.Random().nextDouble() - 0.5) * 0.015,
          'address': 'Tourist Exchange Point',
        },
        'timestamp': now.subtract(const Duration(hours: 1, minutes: 5)).toIso8601String(),
        'status': 'Resolved',
        'reporter': 'Mike Johnson',
        'hasImage': true,
        'viewCount': 23,
        'isVerified': true,
      },
      {
        'id': '4',
        'title': 'Lost Passport and Wallet',
        'description': 'Lost brown leather wallet with passport, credit cards, and cash. Last seen at restaurant.',
        'category': 'Lost Item',
        'severity': 'High',
        'location': {
          'latitude': _userLocation?.latitude ?? 28.6119 + (math.Random().nextDouble() - 0.5) * 0.02,
          'longitude': _userLocation?.longitude ?? 77.2110 + (math.Random().nextDouble() - 0.5) * 0.02,
          'address': 'Riverside Restaurant',
        },
        'timestamp': now.subtract(const Duration(hours: 2, minutes: 20)).toIso8601String(),
        'status': 'Active',
        'reporter': 'Emma Wilson',
        'hasImage': true,
        'viewCount': 15,
        'isVerified': false,
      },
      {
        'id': '5',
        'title': 'Aggressive Street Vendor Harassment',
        'description': 'Vendor became aggressive when tourist declined to buy items. Blocked path and demanded money.',
        'category': 'Harassment',
        'severity': 'Medium',
        'location': {
          'latitude': _userLocation?.latitude ?? 28.6159 + (math.Random().nextDouble() - 0.5) * 0.02,
          'longitude': _userLocation?.longitude ?? 77.2070 + (math.Random().nextDouble() - 0.5) * 0.02,
          'address': 'Heritage Street Market',
        },
        'timestamp': now.subtract(const Duration(hours: 3, minutes: 45)).toIso8601String(),
        'status': 'Investigating',
        'reporter': 'Anonymous',
        'hasImage': false,
        'viewCount': 6,
        'isVerified': true,
      },
      {
        'id': '6',
        'title': 'Tourist Medical Emergency',
        'description': 'Elderly tourist collapsed near monument. Ambulance called, situation handled by medical team.',
        'category': 'Medical Emergency',
        'severity': 'Critical',
        'location': {
          'latitude': _userLocation?.latitude ?? 28.6169 + (math.Random().nextDouble() - 0.5) * 0.01,
          'longitude': _userLocation?.longitude ?? 77.2060 + (math.Random().nextDouble() - 0.5) * 0.01,
          'address': 'Historical Monument Park',
        },
        'timestamp': now.subtract(const Duration(hours: 4, minutes: 10)).toIso8601String(),
        'status': 'Resolved',
        'reporter': 'Park Security',
        'hasImage': false,
        'viewCount': 31,
        'isVerified': true,
      }
    ];
  }

  void _filterIncidentsByDistance() {
    if (_userLocation == null) return;
    
    _incidents = _incidents.where((incident) {
      double distance = Geolocator.distanceBetween(
        _userLocation!.latitude,
        _userLocation!.longitude,
        incident['location']['latitude'],
        incident['location']['longitude'],
      ) / 1000; // Convert to kilometers
      
      incident['distance'] = distance;
      return distance <= 3.0; // Within 3km radius
    }).toList();
  }

  void _applyFilters() {
    _filteredIncidents = _incidents.where((incident) {
      bool severityMatch = _selectedSeverityFilter == 'All' || 
                          incident['severity'] == _selectedSeverityFilter;
                          
      bool categoryMatch = _selectedCategoryFilter == 'All' || 
                          incident['category'] == _selectedCategoryFilter;
                          
      return severityMatch && categoryMatch;
    }).toList();
    
    // Sort by severity priority (Critical > High > Medium > Low) and then by timestamp
    _filteredIncidents.sort((a, b) {
      final severityOrder = {'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3};
      int severityCompare = (severityOrder[a['severity']] ?? 4)
                              .compareTo(severityOrder[b['severity']] ?? 4);
      
      if (severityCompare != 0) return severityCompare;
      
      // If same severity, sort by most recent
      return DateTime.parse(b['timestamp']).compareTo(DateTime.parse(a['timestamp']));
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const ThemeAwareText.heading('📍 Nearby Incidents'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: _isLoading 
        ? _buildLoadingWidget()
        : FadeTransition(
            opacity: _fadeAnimation,
            child: Column(
              children: [
                // Header Stats
                _buildHeaderStats(),
                
                // Filters
                _buildFilters(),
                
                // Incidents List
                Expanded(
                  child: _filteredIncidents.isEmpty 
                    ? _buildEmptyState()
                    : _buildIncidentsList(),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildLoadingWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(
            color: EmergencyColorPalette.primary[500],
            strokeWidth: 3,
          ),
          const SizedBox(height: 20),
          Text(
            'Loading nearby incidents...',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderStats() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            EmergencyColorPalette.primary[500]!,
            EmergencyColorPalette.primary[600]!,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: EmergencyColorPalette.primary[500]!.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.location_on,
              color: Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${_filteredIncidents.length} Incidents Nearby',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Within 3km radius',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Text(
              'LIVE',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Filter by Severity',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _severityFilters.length,
              itemBuilder: (context, index) {
                String filter = _severityFilters[index];
                bool isSelected = _selectedSeverityFilter == filter;
                Color filterColor = _getSeverityColor(filter);
                
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(
                      filter,
                      style: TextStyle(
                        color: isSelected ? Colors.white : filterColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: filterColor,
                    backgroundColor: Colors.white,
                    side: BorderSide(color: filterColor, width: 1.5),
                    onSelected: (selected) {
                      setState(() {
                        _selectedSeverityFilter = filter;
                        _applyFilters();
                      });
                    },
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Filter by Category',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categoryFilters.length,
              itemBuilder: (context, index) {
                String filter = _categoryFilters[index];
                bool isSelected = _selectedCategoryFilter == filter;
                
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(
                      filter,
                      style: TextStyle(
                        color: isSelected ? Colors.white : EmergencyColorPalette.primary[600],
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: EmergencyColorPalette.primary[500],
                    backgroundColor: Colors.white,
                    side: BorderSide(color: EmergencyColorPalette.primary[500]!, width: 1.5),
                    onSelected: (selected) {
                      setState(() {
                        _selectedCategoryFilter = filter;
                        _applyFilters();
                      });
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIncidentsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filteredIncidents.length,
      itemBuilder: (context, index) {
        final incident = _filteredIncidents[index];
        return _buildIncidentCard(incident, index);
      },
    );
  }

  Widget _buildIncidentCard(Map<String, dynamic> incident, int index) {
    final now = DateTime.now();
    final incidentTime = DateTime.parse(incident['timestamp']);
    final timeAgo = _getTimeAgo(now.difference(incidentTime));
    
    Color severityColor = _getSeverityColor(incident['severity']);
    IconData categoryIcon = _getCategoryIcon(incident['category']);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: severityColor.withOpacity(0.3),
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: severityColor.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: severityColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    categoryIcon,
                    color: Colors.white,
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
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: severityColor,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              incident['severity'].toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            incident['category'],
                            style: TextStyle(
                              color: Colors.grey[700],
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        incident['title'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                ),
                _buildStatusBadge(incident['status']),
              ],
            ),
          ),
          
          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  incident['description'],
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black87,
                    height: 1.4,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                
                // Location & Distance
                Row(
                  children: [
                    Icon(
                      Icons.location_on,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        incident['location']['address'],
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[700],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: EmergencyColorPalette.info[100],
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '${incident['distance']?.toStringAsFixed(1) ?? '0.0'}km',
                        style: TextStyle(
                          color: EmergencyColorPalette.info[700],
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 12),
                
                // Footer
                Row(
                  children: [
                    Icon(
                      Icons.access_time,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 4),
                    Text(
                      timeAgo,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const Spacer(),
                    if (incident['hasImage'])
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.blue[100],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.image, size: 12, color: Colors.blue[700]),
                            const SizedBox(width: 2),
                            Text(
                              'Photo',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.blue[700],
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(width: 8),
                    if (incident['isVerified'])
                      Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: EmergencyColorPalette.secondary[500],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Icon(
                          Icons.verified,
                          size: 12,
                          color: Colors.white,
                        ),
                      ),
                    const SizedBox(width: 8),
                    Text(
                      '${incident['viewCount']} views',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Action Buttons
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _viewIncidentDetails(incident),
                    icon: const Icon(Icons.visibility, size: 16, color: Colors.white),
                    label: const Text(
                      'View Details',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmergencyColorPalette.primary[500],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      elevation: 2,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () => _shareIncident(incident),
                  icon: const Icon(Icons.share, size: 16),
                  label: const Text('Share', style: TextStyle(fontWeight: FontWeight.w600)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.grey[700],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: BorderSide(color: Colors.grey[300]!),
                    ),
                    elevation: 1,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color statusColor;
    IconData statusIcon;
    
    switch (status.toLowerCase()) {
      case 'active':
        statusColor = EmergencyColorPalette.danger[500]!;
        statusIcon = Icons.radio_button_checked;
        break;
      case 'investigating':
        statusColor = EmergencyColorPalette.warning[500]!;
        statusIcon = Icons.search;
        break;
      case 'resolved':
        statusColor = EmergencyColorPalette.secondary[500]!;
        statusIcon = Icons.check_circle;
        break;
      default:
        statusColor = Colors.grey[600]!;
        statusIcon = Icons.help;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: statusColor.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(statusIcon, size: 12, color: statusColor),
          const SizedBox(width: 4),
          Text(
            status,
            style: TextStyle(
              color: statusColor,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(50),
            ),
            child: Icon(
              Icons.location_off,
              size: 48,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'No Incidents Found',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'No incidents match your current filters\nin the nearby area.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              height: 1.4,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              setState(() {
                _selectedSeverityFilter = 'All';
                _selectedCategoryFilter = 'All';
                _applyFilters();
              });
            },
            icon: const Icon(Icons.refresh, color: Colors.white),
            label: const Text(
              'Clear Filters',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.primary[500],
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Color _getSeverityColor(String severity) {
    switch (severity.toLowerCase()) {
      case 'critical':
        return Colors.red[900]!;
      case 'high':
        return EmergencyColorPalette.danger[500]!;
      case 'medium':
        return EmergencyColorPalette.warning[500]!;
      case 'low':
        return EmergencyColorPalette.secondary[500]!;
      default:
        return Colors.grey[600]!;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'theft':
        return Icons.local_police;
      case 'harassment':
        return Icons.warning;
      case 'fraud/scam':
        return Icons.money_off;
      case 'lost item':
        return Icons.search;
      case 'suspicious activity':
        return Icons.visibility;
      case 'medical emergency':
        return Icons.local_hospital;
      case 'accident':
        return Icons.car_crash;
      case 'violence':
        return Icons.dangerous;
      case 'vandalism':
        return Icons.broken_image;
      default:
        return Icons.report_problem;
    }
  }

  String _getTimeAgo(Duration difference) {
    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  void _viewIncidentDetails(Map<String, dynamic> incident) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildIncidentDetailsModal(incident),
    );
  }

  Widget _buildIncidentDetailsModal(Map<String, dynamic> incident) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        children: [
          // Handle
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Header
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
              'Incident Details',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
          ),
          
          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    incident['title'],
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    incident['description'],
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.black87,
                      height: 1.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Additional details would go here
                  Text(
                    'Reporter: ${incident['reporter']}',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Status: ${incident['status']}',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
          
          // Close Button
          Padding(
            padding: const EdgeInsets.all(20),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmergencyColorPalette.primary[500],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                  'Close',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _shareIncident(Map<String, dynamic> incident) {
    // Simulate sharing functionality
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Sharing incident: ${incident['title']}',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: EmergencyColorPalette.primary[500],
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
