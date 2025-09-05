# Smart Tourist Safety Monitoring & Incident Response System 🛡️

<div align="center">
  <img src="./assets/logo/logo.jpeg" alt="Tourist Safety System Logo" width="200"/>
  
  [![Flutter](https://img.shields.io/badge/Flutter-3.8.1-blue.svg)](https://flutter.dev/)
  [![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
  [![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-purple.svg)](https://ethereum.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
</div>

**SafeTour** - An AI-powered, blockchain-secured tourist safety monitoring system that ensures real-time protection and incident response for travelers across India's diverse regions.

## 🌟 System Overview

The Smart Tourist Safety Monitoring & Incident Response System is a comprehensive platform designed to enhance tourist safety through cutting-edge technology integration. The system combines AI-powered anomaly detection, blockchain-based identity verification, real-time geo-fencing, and multi-stakeholder dashboards to create a robust safety net for tourists.

### Key Features
- 🆔 **Digital Tourist ID Generation** - Blockchain-based secure identity system
- 📱 **Mobile Safety App** - Real-time tracking and emergency features
- 🤖 **AI Anomaly Detection** - Behavioral pattern analysis and alerts
- 🌍 **Geo-fencing** - Location-based safety zones and alerts
- 🚨 **Emergency Response** - Instant panic button and automated alerts
- 📊 **Administrative Dashboard** - Real-time monitoring for authorities
- 🔗 **IoT Integration** - Smart wearables for enhanced tracking
- 🌐 **Multilingual Support** - 10+ Indian languages + English

## 🏗️ System Architecture

### Technology Stack

#### Frontend Applications
```
📱 Mobile App (app-frontend/)
├── Framework: Flutter 3.8.1+
├── State Management: Provider/Riverpod
├── Navigation: GoRouter
├── Local Storage: Hive/SQLite
├── Maps: Google Maps SDK
├── Push Notifications: Firebase Cloud Messaging
└── Security: Flutter Secure Storage

🌐 Web Dashboard (web/)
├── Framework: Next.js 14 + TypeScript
├── UI Framework: Tailwind CSS + shadcn/ui
├── State Management: Zustand/Redux Toolkit
├── Authentication: NextAuth.js
├── Charts: Chart.js/Recharts
├── Maps: Leaflet/Mapbox
└── Real-time: Socket.io Client
```

#### Backend Infrastructure
```
🔧 API Server (Backend services in Next.js)
├── Runtime: Node.js + TypeScript
├── Framework: Next.js API Routes
├── Database: PostgreSQL + Prisma ORM
├── Cache: Redis
├── File Storage: AWS S3/Cloudinary
├── Authentication: JWT + OAuth 2.0
├── Real-time: Socket.io
├── Message Queue: Bull Queue
└── Monitoring: Winston + Sentry

⛓️ Blockchain Network
├── Platform: Ethereum/Polygon
├── Smart Contracts: Solidity
├── Web3 Integration: Web3.js/Ethers.js
├── IPFS: Distributed file storage
└── Wallet Integration: MetaMask/WalletConnect

🤖 AI/ML Services
├── Framework: TensorFlow/PyTorch
├── APIs: Python FastAPI
├── Models: Anomaly Detection, Route Prediction
├── Deployment: Docker + Kubernetes
└── Data Pipeline: Apache Kafka
```

## 🏛️ System Components & Flow

### 1. Digital Tourist ID Generation Platform

#### Overview
A blockchain-based identity verification system that creates secure, tamper-proof digital IDs for tourists at entry points.

#### Components
- **Registration Portal** (Web + Mobile)
- **KYC Verification Service**
- **Blockchain Smart Contracts**
- **ID Generation Engine**
- **QR Code Generator**

#### Flow
```mermaid
graph TD
    A[Tourist Arrives] --> B[Entry Point Registration]
    B --> C[KYC Document Upload]
    C --> D[Aadhaar/Passport Verification]
    D --> E[Trip Itinerary Input]
    E --> F[Emergency Contacts]
    F --> G[Blockchain ID Generation]
    G --> H[QR Code Creation]
    H --> I[Digital ID Issued]
    I --> J[Mobile App Integration]
```

#### Technical Implementation
```typescript
// Smart Contract Structure
contract TouristIdentity {
    struct TouristID {
        string touristHash;
        string kycHash;
        string itineraryHash;
        address[] emergencyContacts;
        uint256 validFrom;
        uint256 validTo;
        bool isActive;
    }
    
    mapping(address => TouristID) public touristIDs;
    
    function generateTouristID(
        string memory _touristData,
        string memory _kycData,
        string memory _itinerary
    ) external returns (uint256);
}
```

### 2. Mobile Application Architecture

#### Core Modules

##### Authentication & Profile Module
```dart
// lib/modules/auth/
├── models/
│   ├── user_model.dart
│   ├── tourist_id_model.dart
│   └── kyc_model.dart
├── services/
│   ├── auth_service.dart
│   ├── biometric_service.dart
│   └── blockchain_service.dart
├── screens/
│   ├── login_screen.dart
│   ├── registration_screen.dart
│   └── profile_screen.dart
└── widgets/
    ├── kyc_upload_widget.dart
    └── id_display_widget.dart
```

##### Safety & Tracking Module
```dart
// lib/modules/safety/
├── models/
│   ├── location_model.dart
│   ├── safety_score_model.dart
│   └── geofence_model.dart
├── services/
│   ├── location_service.dart
│   ├── geofencing_service.dart
│   ├── panic_service.dart
│   └── tracking_service.dart
├── screens/
│   ├── safety_dashboard.dart
│   ├── panic_screen.dart
│   └── tracking_screen.dart
└── widgets/
    ├── safety_score_widget.dart
    ├── panic_button_widget.dart
    └── location_tracker_widget.dart
```

#### Safety Score Algorithm
```dart
class SafetyScoreCalculator {
  double calculateSafetyScore({
    required LocationData currentLocation,
    required List<GeofenceZone> nearbyZones,
    required TravelPattern userPattern,
    required TimeOfDay currentTime,
  }) {
    double baseScore = 100.0;
    
    // Zone-based scoring
    for (GeofenceZone zone in nearbyZones) {
      switch (zone.riskLevel) {
        case RiskLevel.high:
          baseScore -= 30;
          break;
        case RiskLevel.medium:
          baseScore -= 15;
          break;
        case RiskLevel.low:
          baseScore -= 5;
          break;
      }
    }
    
    // Time-based scoring
    if (currentTime.hour < 6 || currentTime.hour > 22) {
      baseScore -= 20;
    }
    
    // Pattern deviation scoring
    if (userPattern.isDeviatingFromPlan()) {
      baseScore -= 25;
    }
    
    return math.max(0, math.min(100, baseScore));
  }
}
```

### 3. AI-Based Anomaly Detection System

#### Detection Models

##### Location Anomaly Detection
```python
# AI Service - Location Anomaly Detection
class LocationAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1)
        self.scaler = StandardScaler()
    
    def detect_anomalies(self, location_data):
        """
        Detect anomalies in location patterns
        """
        features = self.extract_features(location_data)
        scaled_features = self.scaler.transform(features)
        anomaly_scores = self.model.decision_function(scaled_features)
        
        return {
            'is_anomaly': anomaly_scores < -0.5,
            'confidence': abs(anomaly_scores),
            'alert_level': self.calculate_alert_level(anomaly_scores)
        }
    
    def extract_features(self, location_data):
        """
        Extract relevant features for anomaly detection
        """
        return np.array([
            location_data.speed,
            location_data.direction_change,
            location_data.stay_duration,
            location_data.distance_from_route,
            location_data.time_since_last_update
        ])
```

##### Behavioral Pattern Analysis
```python
class BehavioralAnalyzer:
    def __init__(self):
        self.lstm_model = self.build_lstm_model()
    
    def analyze_behavior(self, user_activity):
        """
        Analyze user behavior patterns for anomaly detection
        """
        sequence = self.prepare_sequence(user_activity)
        prediction = self.lstm_model.predict(sequence)
        
        anomaly_threshold = 0.7
        is_anomalous = prediction < anomaly_threshold
        
        return {
            'behavioral_score': prediction[0],
            'is_anomalous': is_anomalous,
            'risk_factors': self.identify_risk_factors(user_activity)
        }
```

#### Alert Generation System
```typescript
// Alert Generation Service
class AlertService {
    async generateAlert(
        alertType: AlertType,
        touristId: string,
        location: Location,
        severity: AlertSeverity
    ): Promise<Alert> {
        const alert: Alert = {
            id: generateAlertId(),
            touristId,
            type: alertType,
            location,
            severity,
            timestamp: new Date(),
            status: AlertStatus.ACTIVE,
            assignedOfficers: []
        };
        
        // Store in database
        await this.alertRepository.create(alert);
        
        // Notify relevant authorities
        await this.notificationService.notifyAuthorities(alert);
        
        // Notify emergency contacts
        await this.notificationService.notifyEmergencyContacts(alert);
        
        // Log in blockchain for immutability
        await this.blockchainService.logAlert(alert);
        
        return alert;
    }
}

### 4. Web Dashboard (Next.js) - Tourism Department & Police Interface

#### Complete Web Application Architecture

##### Project Structure (web/)
```typescript
web/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── overview/
│   │   │   │   └── page.tsx          # Main dashboard
│   │   │   ├── tourists/
│   │   │   │   ├── page.tsx          # Tourist management
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Individual tourist details
│   │   │   ├── alerts/
│   │   │   │   ├── page.tsx          # Alert management
│   │   │   │   ├── active/
│   │   │   │   │   └── page.tsx      # Active alerts
│   │   │   │   └── history/
│   │   │   │       └── page.tsx      # Alert history
│   │   │   ├── zones/
│   │   │   │   ├── page.tsx          # Risk zone management
│   │   │   │   └── [zoneId]/
│   │   │   │       └── page.tsx      # Zone details
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx          # Reports & analytics
│   │   │   │   ├── incidents/
│   │   │   │   │   └── page.tsx      # Incident reports
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx      # Statistical analysis
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # System settings
│   │   │   └── layout.tsx            # Dashboard layout
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify/
│   │   │   │       └── route.ts
│   │   │   ├── tourists/
│   │   │   │   ├── route.ts          # CRUD operations
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── location/
│   │   │   │   │       └── route.ts
│   │   │   │   └── search/
│   │   │   │       └── route.ts
│   │   │   ├── alerts/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── bulk/
│   │   │   │       └── route.ts
│   │   │   ├── zones/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── analytics/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── heatmap/
│   │   │   │   │   └── route.ts
│   │   │   │   └── reports/
│   │   │   │       └── route.ts
│   │   │   └── websocket/
│   │   │       └── route.ts          # WebSocket handler
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── alert.tsx
│   │   │   └── ...
│   │   ├── dashboard/                # Dashboard-specific components
│   │   │   ├── overview/
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   ├── TouristHeatMap.tsx
│   │   │   │   ├── AlertsOverview.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   ├── tourists/
│   │   │   │   ├── TouristTable.tsx
│   │   │   │   ├── TouristDetails.tsx
│   │   │   │   ├── TouristSearch.tsx
│   │   │   │   └── TouristFilters.tsx
│   │   │   ├── alerts/
│   │   │   │   ├── AlertPanel.tsx
│   │   │   │   ├── AlertDetails.tsx
│   │   │   │   ├── AlertActions.tsx
│   │   │   │   └── AlertFilters.tsx
│   │   │   ├── maps/
│   │   │   │   ├── InteractiveMap.tsx
│   │   │   │   ├── HeatMapLayer.tsx
│   │   │   │   ├── GeofenceLayer.tsx
│   │   │   │   └── TouristMarkers.tsx
│   │   │   └── charts/
│   │   │       ├── LineChart.tsx
│   │   │       ├── BarChart.tsx
│   │   │       ├── PieChart.tsx
│   │   │       └── AreaChart.tsx
│   │   ├── forms/                    # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── AlertForm.tsx
│   │   │   ├── ZoneForm.tsx
│   │   │   └── SettingsForm.tsx
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── common/                   # Common components
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── NotificationToast.tsx
│   ├── lib/                          # Utility functions
│   │   ├── auth.ts                   # Authentication utilities
│   │   ├── api.ts                    # API client setup
│   │   ├── websocket.ts              # WebSocket connection
│   │   ├── utils.ts                  # General utilities
│   │   ├── validations.ts            # Form validation schemas
│   │   └── constants.ts              # App constants
│   ├── services/                     # Business logic services
│   │   ├── authService.ts
│   │   ├── touristService.ts
│   │   ├── alertService.ts
│   │   ├── analyticsService.ts
│   │   └── notificationService.ts
│   ├── stores/                       # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── dashboardStore.ts
│   │   ├── alertStore.ts
│   │   └── touristStore.ts
│   ├── types/                        # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── tourist.ts
│   │   ├── alert.ts
│   │   ├── dashboard.ts
│   │   └── api.ts
│   └── hooks/                        # Custom React hooks
│       ├── useAuth.ts
│       ├── useWebSocket.ts
│       ├── useLocalStorage.ts
│       └── useDebounce.ts
├── public/                           # Static assets
│   ├── icons/
│   ├── images/
│   └── logos/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

#### Dashboard Components Implementation

##### Main Dashboard Overview
```typescript
// src/app/(dashboard)/overview/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDashboardStore } from '@/stores/dashboardStore';
import StatsCards from '@/components/dashboard/overview/StatsCards';
import TouristHeatMap from '@/components/dashboard/overview/TouristHeatMap';
import AlertsOverview from '@/components/dashboard/overview/AlertsOverview';
import RecentActivity from '@/components/dashboard/overview/RecentActivity';

interface DashboardData {
    activeTourists: number;
    activeAlerts: Alert[];
    touristClusters: TouristCluster[];
    riskZones: RiskZone[];
    recentIncidents: Incident[];
    statistics: DashboardStats;
}

export default function DashboardOverview() {
    const [dashboardData, setDashboardData] = useState<DashboardData>();
    const [loading, setLoading] = useState(true);
    const { 
        activeTourists, 
        activeAlerts, 
        updateTouristCount, 
        addAlert,
        updateStatistics 
    } = useDashboardStore();

    // WebSocket connection for real-time updates
    const { isConnected, sendMessage } = useWebSocket('/api/websocket', {
        onMessage: (data) => {
            handleWebSocketMessage(data);
        },
        onConnect: () => {
            console.log('Dashboard connected to WebSocket');
            sendMessage({ type: 'JOIN_DASHBOARD', role: 'admin' });
        },
        onDisconnect: () => {
            console.log('Dashboard disconnected from WebSocket');
        }
    });

    const handleWebSocketMessage = (data: any) => {
        switch (data.type) {
            case 'TOURIST_UPDATE':
                updateTouristCount(data.payload.count);
                setDashboardData(prev => ({
                    ...prev!,
                    touristClusters: data.payload.clusters
                }));
                break;
                
            case 'ALERT_GENERATED':
                addAlert(data.payload.alert);
                // Trigger notification
                showNotification('New Alert', data.payload.alert.message);
                break;
                
            case 'ZONE_UPDATE':
                setDashboardData(prev => ({
                    ...prev!,
                    riskZones: data.payload.zones
                }));
                break;
                
            case 'STATISTICS_UPDATE':
                updateStatistics(data.payload.stats);
                break;
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await fetch('/api/analytics/dashboard');
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tourism Safety Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-600">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>
            
            {/* Statistics Cards */}
            <StatsCards statistics={dashboardData?.statistics} />
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heat Map - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <TouristHeatMap 
                        clusters={dashboardData?.touristClusters} 
                        riskZones={dashboardData?.riskZones}
                    />
                </div>
                
                {/* Alerts Panel */}
                <div className="lg:col-span-1">
                    <AlertsOverview alerts={activeAlerts} />
                </div>
            </div>
            
            {/* Recent Activity */}
            <RecentActivity incidents={dashboardData?.recentIncidents} />
        </div>
    );
}
```

##### Advanced Tourist Heat Map Component
```typescript
// src/components/dashboard/overview/TouristHeatMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface TouristHeatMapProps {
    clusters: TouristCluster[];
    riskZones: RiskZone[];
}

// Custom hook for heat layer management
function HeatLayerManager({ clusters, riskZones }: TouristHeatMapProps) {
    const map = useMap();
    const heatLayerRef = useRef<L.HeatLayer>();
    const riskLayersRef = useRef<L.LayerGroup>();

    useEffect(() => {
        if (!clusters) return;

        // Remove existing heat layer
        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
        }

        // Generate heat map data
        const heatData: [number, number, number][] = clusters.map(cluster => [
            cluster.latitude,
            cluster.longitude,
            Math.min(cluster.touristCount / 10, 1) // Normalize intensity
        ]);

        // Create new heat layer
        heatLayerRef.current = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.0: '#00ff00',  // Green for low density
                0.3: '#ffff00',  // Yellow for medium density
                0.6: '#ff8000',  // Orange for high density
                1.0: '#ff0000'   // Red for very high density
            }
        }).addTo(map);

    }, [clusters, map]);

    useEffect(() => {
        if (!riskZones) return;

        // Remove existing risk zone layers
        if (riskLayersRef.current) {
            map.removeLayer(riskLayersRef.current);
        }

        // Create risk zone layer group
        riskLayersRef.current = L.layerGroup();

        riskZones.forEach(zone => {
            const color = getRiskZoneColor(zone.riskLevel);
            const circle = L.circle([zone.latitude, zone.longitude], {
                radius: zone.radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                weight: 2
            });

            circle.bindPopup(`
                <div class="p-2">
                    <h3 class="font-bold">${zone.name}</h3>
                    <p class="text-sm">Risk Level: ${zone.riskLevel}</p>
                    <p class="text-sm">Tourists in zone: ${zone.touristCount}</p>
                </div>
            `);

            riskLayersRef.current?.addLayer(circle);
        });

        riskLayersRef.current.addTo(map);

    }, [riskZones, map]);

    return null;
}

function getRiskZoneColor(riskLevel: string): string {
    switch (riskLevel.toLowerCase()) {
        case 'high': return '#ff4444';
        case 'medium': return '#ffaa00';
        case 'low': return '#44ff44';
        default: return '#888888';
    }
}

export default function TouristHeatMap({ clusters, riskZones }: TouristHeatMapProps) {
    const [mapCenter, setMapCenter] = useState<[number, number]>([26.2006, 92.9376]); // Guwahati coordinates
    const [selectedCluster, setSelectedCluster] = useState<TouristCluster | null>(null);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tourist Distribution</h2>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm">Low Density</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-sm">Medium Density</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm">High Density</span>
                    </div>
                </div>
            </div>
            
            <div className="h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <HeatLayerManager clusters={clusters} riskZones={riskZones} />
                </MapContainer>
            </div>
            
            {selectedCluster && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold">Selected Cluster</h3>
                    <p className="text-sm">Location: {selectedCluster.latitude}, {selectedCluster.longitude}</p>
                    <p className="text-sm">Tourist Count: {selectedCluster.touristCount}</p>
                    <p className="text-sm">Last Updated: {new Date(selectedCluster.lastUpdated).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}

##### Heat Map Implementation
```typescript
// Tourist Heat Map Component
const TouristHeatMap: React.FC<{ clusters: TouristCluster[] }> = ({ clusters }) => {
    const mapRef = useRef<L.Map>();
    
    useEffect(() => {
        if (!mapRef.current || !clusters) return;
        
        // Clear existing heat layers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof HeatmapLayer) {
                mapRef.current?.removeLayer(layer);
            }
        });
        
        // Generate heat map data
        const heatData = clusters.map(cluster => [
            cluster.latitude,
            cluster.longitude,
            cluster.touristCount / 10 // Normalize intensity
        ]);
        
        // Add heat layer
        const heatLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.0: 'green',
                0.5: 'yellow',
                1.0: 'red'
            }
        }).addTo(mapRef.current);
        
    }, [clusters]);
    
    return <div id="heatmap" className="h-96 w-full" />;
};
```

##### Additional Web Dashboard Components

###### Alert Management System
```typescript
// src/components/dashboard/alerts/AlertPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MapPin, User } from 'lucide-react';

interface AlertPanelProps {
    alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const handleAlertAction = async (alertId: string, action: string) => {
        try {
            const response = await fetch(`/api/alerts/${alertId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to update alert:', error);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Active Alerts ({alerts.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 border-b">
                        <div className="flex justify-between items-start mb-2">
                            <Badge className={`bg-${alert.severity === 'high' ? 'red' : 'yellow'}-500`}>
                                {alert.severity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>Tourist ID: {alert.touristId}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}</span>
                            </div>
                        </div>
                        {alert.status === 'active' && (
                            <div className="flex space-x-2 mt-3">
                                <Button size="sm" onClick={() => handleAlertAction(alert.id, 'investigate')}>
                                    Investigate
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
```

###### Tourism Analytics Dashboard
```typescript
// src/app/(dashboard)/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        loadAnalyticsData();
    }, []);

    const loadAnalyticsData = async () => {
        try {
            const response = await fetch('/api/analytics/dashboard');
            const data = await response.json();
            setAnalyticsData(data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">Tourism Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tourist Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData?.touristFlow}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="tourists" stroke="#3B82F6" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Safety Incidents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData?.incidents}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#F59E0B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
```

### 5. IoT Integration Architecture

#### Smart Wearable Device Integration
```python
# IoT Device Communication Service
class IoTDeviceManager:
    def __init__(self):
        self.mqtt_client = mqtt.Client()
        self.device_registry = {}
    
    async def register_device(self, device_id: str, tourist_id: str):
        """Register IoT device with tourist"""
        device_info = {
            'device_id': device_id,
            'tourist_id': tourist_id,
            'last_heartbeat': datetime.now(),
            'battery_level': 100,
            'is_active': True
        }
        
        self.device_registry[device_id] = device_info
        await self.database.save_device_registration(device_info)
    
    def process_device_data(self, device_id: str, sensor_data: dict):
        """Process incoming sensor data from IoT devices"""
        if device_id not in self.device_registry:
            return
        
        # Update device status
        self.device_registry[device_id]['last_heartbeat'] = datetime.now()
        
        # Analyze sensor data
        health_metrics = self.analyze_health_data(sensor_data)
        location_data = self.extract_location_data(sensor_data)
        
        # Check for emergency conditions
        if self.detect_emergency(health_metrics, location_data):
            self.trigger_emergency_alert(device_id, sensor_data)
    
    def detect_emergency(self, health_metrics: dict, location_data: dict) -> bool:
        """Detect emergency situations from sensor data"""
        emergency_conditions = [
            health_metrics.get('heart_rate', 0) > 150,  # High heart rate
            health_metrics.get('heart_rate', 100) < 40,  # Low heart rate
            location_data.get('motion_detected', True) is False,  # No motion
            health_metrics.get('fall_detected', False) is True  # Fall detection
        ]
        
        return any(emergency_conditions)
```

#### Device Data Models
```dart
// IoT Device Models (Flutter)
class IoTDevice {
  final String deviceId;
  final String deviceType;
  final Map<String, dynamic> capabilities;
  final BatteryStatus batteryStatus;
  final ConnectionStatus connectionStatus;
  
  const IoTDevice({
    required this.deviceId,
    required this.deviceType,
    required this.capabilities,
    required this.batteryStatus,
    required this.connectionStatus,
  });
}

class SensorData {
  final double? heartRate;
  final double? bodyTemperature;
  final bool motionDetected;
  final bool fallDetected;
  final LocationData location;
  final DateTime timestamp;
  
  const SensorData({
    this.heartRate,
    this.bodyTemperature,
    required this.motionDetected,
    required this.fallDetected,
    required this.location,
    required this.timestamp,
  });
}
```

## 🚀 Installation & Setup

### Prerequisites
- **Flutter SDK** (3.8.1 or higher)
- **Node.js** (18.0 or higher)
- **Python** (3.9 or higher) for AI services
- **PostgreSQL** (13 or higher)
- **Redis** (6.0 or higher)
- **Docker** (optional, for containerized deployment)

### Project Structure
```
project1/
├── app-frontend/          # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart
│   │   ├── config/        # App configuration
│   │   ├── models/        # Data models
│   │   ├── screens/       # UI screens
│   │   ├── services/      # Business logic services
│   │   ├── theme/         # App theming
│   │   └── widgets/       # Reusable UI components
│   ├── android/           # Android-specific files
│   ├── ios/               # iOS-specific files
│   ├── pubspec.yaml       # Flutter dependencies
│   └── README.md
├── web/                   # Next.js web dashboard
│   ├── src/
│   │   ├── app/           # Next.js 14 App Router
│   │   ├── components/    # React components
│   │   ├── lib/           # Utility functions
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── README.md
├── backend/               # Backend services (to be created)
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── ai-services/       # Python AI/ML services
│   │   ├── anomaly_detection/
│   │   ├── behavioral_analysis/
│   │   └── risk_assessment/
│   └── blockchain/        # Smart contracts
│       ├── contracts/
│       ├── migrations/
│       └── scripts/
├── docs/                  # Documentation
├── docker-compose.yml     # Docker configuration
└── README.md             # This file
```

### Quick Start

#### 1. Mobile App Setup (Flutter)
```bash
# Navigate to app directory
cd app-frontend

# Install Flutter dependencies
flutter pub get

# Run on Android
flutter run -d android

# Run on iOS
flutter run -d ios
```

#### 2. Web Dashboard Setup (Next.js)
```bash
# Navigate to web directory
cd web

# Install Node.js dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
# or
yarn dev

# Open http://localhost:3000 in your browser
```

#### 3. Backend Services Setup
```bash
# Create backend directory structure
mkdir -p backend/src/{api,services,models,middleware,utils}
mkdir -p backend/ai-services/{anomaly_detection,behavioral_analysis,risk_assessment}
mkdir -p backend/blockchain/{contracts,migrations,scripts}

# Initialize Node.js project
cd backend
npm init -y

# Install dependencies
npm install express typescript prisma @prisma/client
npm install -D @types/node ts-node nodemon

# Set up database
npx prisma init
npx prisma migrate dev --name init
```

#### 4. Database Setup
```sql
-- PostgreSQL Database Schema
CREATE DATABASE tourist_safety_db;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tourist profiles
CREATE TABLE tourist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    digital_id_hash VARCHAR(255) UNIQUE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    emergency_contacts JSONB,
    travel_itinerary JSONB,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location tracking
CREATE TABLE location_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_id UUID REFERENCES tourist_profiles(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_automated BOOLEAN DEFAULT TRUE
);

-- Alerts and incidents
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_id UUID REFERENCES tourist_profiles(id),
    alert_type VARCHAR(50),
    severity VARCHAR(20),
    location POINT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
```

### Environment Configuration

#### Flutter Environment (.env in app-frontend/)
```dart
// lib/config/environment.dart
class Environment {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.safetour.com'
  );
  
  static const String blockchainRpcUrl = String.fromEnvironment(
    'BLOCKCHAIN_RPC_URL',
    defaultValue: 'https://polygon-rpc.com'
  );
  
  static const String googleMapsApiKey = String.fromEnvironment(
    'GOOGLE_MAPS_API_KEY'
  );
}
```

#### Next.js Environment (.env.local in web/)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tourist_safety_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Blockchain
BLOCKCHAIN_RPC_URL="https://polygon-rpc.com"
PRIVATE_KEY="your-private-key"

# External APIs
GOOGLE_MAPS_API_KEY="your-google-maps-key"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"

# Redis
REDIS_URL="redis://localhost:6379"
```

## 📊 System Workflows

### User Registration & ID Generation Flow
```mermaid
sequenceDiagram
    participant T as Tourist
    participant MA as Mobile App
    participant API as Backend API
    participant BC as Blockchain
    participant KYC as KYC Service
    
    T->>MA: Open Registration
    MA->>T: Request KYC Documents
    T->>MA: Upload Documents + Itinerary
    MA->>API: Submit Registration Data
    API->>KYC: Verify Documents
    KYC-->>API: Verification Result
    API->>BC: Generate Digital ID
    BC-->>API: ID Hash + Transaction
    API->>MA: Registration Complete
    MA->>T: Show Digital ID
```

### Emergency Alert Flow
```mermaid
sequenceDiagram
    participant T as Tourist
    participant MA as Mobile App
    participant API as Backend API
    participant AI as AI Service
    participant AUTH as Authorities
    participant EC as Emergency Contacts
    
    T->>MA: Panic Button Pressed
    MA->>API: Emergency Alert + Location
    API->>AI: Analyze Situation
    AI-->>API: Risk Assessment
    API->>AUTH: Notify Police Dashboard
    API->>EC: Send SMS/Call Alerts
    AUTH->>API: Acknowledge Alert
    API->>MA: Confirmation + ETA
    MA->>T: Help is Coming
```

### Anomaly Detection Flow
```mermaid
sequenceDiagram
    participant MA as Mobile App
    participant API as Backend API
    participant AI as AI Service
    participant ML as ML Models
    participant AUTH as Authorities
    
    loop Every 30 seconds
        MA->>API: Send Location + Activity Data
        API->>AI: Process Data
        AI->>ML: Run Anomaly Detection
        ML-->>AI: Anomaly Score
        
        alt If Anomaly Detected
            AI->>API: Generate Alert
            API->>AUTH: Notify Dashboard
            API->>MA: Request Check-in
            MA->>Tourist: "Are you safe?"
            
            alt No Response in 5 minutes
                API->>AUTH: Escalate Alert
                API->>Emergency Contacts: Send Notifications
            end
        end
    end
```

## 🔐 Security & Privacy Features

### Data Encryption
```typescript
// End-to-End Encryption Service
class EncryptionService {
    private static readonly ALGORITHM = 'aes-256-gcm';
    
    static encrypt(data: any, key: string): EncryptedData {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(this.ALGORITHM, key);
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }
    
    static decrypt(encryptedData: EncryptedData, key: string): any {
        const decipher = crypto.createDecipher(this.ALGORITHM, key);
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }
}
```

### Blockchain Privacy
```solidity
// Privacy-Preserving Smart Contract
contract PrivateTouristData {
    using SafeMath for uint256;
    
    struct EncryptedData {
        bytes32 dataHash;
        bytes encryptedData;
        uint256 timestamp;
        address accessor;
    }
    
    mapping(address => EncryptedData) private touristData;
    mapping(address => bool) public authorizedAuthorities;
    
    modifier onlyAuthorized() {
        require(
            authorizedAuthorities[msg.sender] || 
            msg.sender == touristData[msg.sender].accessor,
            "Unauthorized access"
        );
        _;
    }
    
    function storeEncryptedData(
        bytes32 _dataHash,
        bytes memory _encryptedData
    ) external {
        touristData[msg.sender] = EncryptedData({
            dataHash: _dataHash,
            encryptedData: _encryptedData,
            timestamp: block.timestamp,
            accessor: msg.sender
        });
    }
    
    function getEncryptedData(address _tourist) 
        external 
        view 
        onlyAuthorized 
        returns (EncryptedData memory) {
        return touristData[_tourist];
    }
}
```

## 🌍 Multilingual Support Implementation

### Language Configuration
```dart
// lib/config/languages.dart
class SupportedLanguages {
  static const Map<String, String> languages = {
    'en': 'English',
    'hi': 'हिंदी',
    'bn': 'বাংলা',
    'te': 'తెలుగు',
    'mr': 'मराठी',
    'ta': 'தமிழ்',
    'gu': 'ગુજરાતી',
    'kn': 'ಕನ್ನಡ',
    'ml': 'മലയാളം',
    'pa': 'ਪੰਜਾਬੀ',
    'or': 'ଓଡ଼ିଆ',
    'as': 'অসমীয়া',
  };
  
  static const Map<String, String> emergencyPhrases = {
    'help_me': {
      'en': 'Help me!',
      'hi': 'मेरी मदद करें!',
      'bn': 'আমাকে সাহায্য করুন!',
      // ... other languages
    },
    'emergency': {
      'en': 'Emergency',
      'hi': 'आपातकाल',
      'bn': 'জরুরি অবস্থা',
      // ... other languages
    }
  };
}
```

### Voice Support Integration
```dart
// lib/services/voice_service.dart
class VoiceService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _tts = FlutterTts();
  
  Future<void> initializeVoiceSupport(String languageCode) async {
    await _speech.initialize(
      onStatus: (status) => print('Status: $status'),
      onError: (error) => print('Error: $error'),
    );
    
    await _tts.setLanguage(languageCode);
    await _tts.setSpeechRate(0.8);
    await _tts.setVolume(1.0);
  }
  
  Future<String?> listenForEmergencyCommand() async {
    if (!_speech.isAvailable) return null;
    
    bool available = await _speech.listen(
      onResult: (result) {
        String command = result.recognizedWords.toLowerCase();
        
        // Check for emergency keywords in multiple languages
        List<String> emergencyKeywords = [
          'help', 'emergency', 'danger', 'police',
          'मदद', 'आपातकाल', 'खतरा', 'पुलिस',
          'সাহায্য', 'জরুরি', 'বিপদ', 'পুলিশ'
        ];
        
        for (String keyword in emergencyKeywords) {
          if (command.contains(keyword)) {
            triggerEmergencyAlert();
            return;
          }
        }
      },
      localeId: getCurrentLanguageCode(),
      listenFor: Duration(seconds: 30),
    );
    
    return null;
  }
  
  Future<void> speakEmergencyInstructions(String message) async {
    await _tts.speak(message);
  }
}
```

## 📈 Performance & Scalability

### Database Optimization
```sql
-- Performance Indexes
CREATE INDEX idx_location_logs_tourist_timestamp 
ON location_logs(tourist_id, timestamp DESC);

CREATE INDEX idx_alerts_status_created 
ON alerts(status, created_at DESC);

CREATE INDEX idx_tourist_profiles_digital_id 
ON tourist_profiles(digital_id_hash);

-- Partitioning for large tables
CREATE TABLE location_logs_2024 PARTITION OF location_logs
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Caching Strategy
```typescript
// Redis Caching Service
class CacheService {
    private redis: Redis;
    
    constructor() {
        this.redis = new Redis(process.env.REDIS_URL);
    }
    
    async cacheTouristLocation(touristId: string, location: Location): Promise<void> {
        const key = `tourist:${touristId}:location`;
        await this.redis.setex(key, 300, JSON.stringify(location)); // 5 min TTL
    }
    
    async getCachedLocation(touristId: string): Promise<Location | null> {
        const key = `tourist:${touristId}:location`;
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    
    async cacheRiskZones(zones: RiskZone[]): Promise<void> {
        await this.redis.setex('risk:zones', 3600, JSON.stringify(zones)); // 1 hour TTL
    }
}
```

## 🧪 Testing Strategy

### Unit Testing (Flutter)
```dart
// test/services/safety_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import '../lib/services/safety_service.dart';

class MockLocationService extends Mock implements LocationService {}

void main() {
  group('SafetyService Tests', () {
    late SafetyService safetyService;
    late MockLocationService mockLocationService;
    
    setUp(() {
      mockLocationService = MockLocationService();
      safetyService = SafetyService(mockLocationService);
    });
    
    test('should calculate safety score correctly', () async {
      // Arrange
      final location = LocationData(
        latitude: 26.2006,
        longitude: 92.9376,
        accuracy: 10.0,
      );
      
      when(mockLocationService.getCurrentLocation())
          .thenAnswer((_) async => location);
      
      // Act
      final score = await safetyService.calculateSafetyScore();
      
      // Assert
      expect(score, isA<double>());
      expect(score, greaterThanOrEqualTo(0));
      expect(score, lessThanOrEqualTo(100));
    });
    
    test('should trigger panic alert', () async {
      // Arrange & Act
      final alertId = await safetyService.triggerPanicAlert();
      
      // Assert
      expect(alertId, isNotNull);
      verify(mockLocationService.getCurrentLocation()).called(1);
    });
  });
}
```

### Integration Testing (Next.js)
```typescript
// __tests__/api/alerts.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../../src/app/api/alerts/route';

describe('/api/alerts', () => {
    test('should create alert successfully', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                touristId: 'test-tourist-id',
                type: 'PANIC',
                location: {
                    latitude: 26.2006,
                    longitude: 92.9376
                }
            }
        });
        
        await handler(req, res);
        
        expect(res._getStatusCode()).toBe(201);
        
        const data = JSON.parse(res._getData());
        expect(data.alert).toBeDefined();
        expect(data.alert.id).toBeDefined();
    });
});
```

## 🚀 Deployment Guide

### Docker Configuration
```dockerfile
# Dockerfile.web (Next.js)
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/tourist_safety
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: tourist_safety
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
  
  ai-service:
    build:
      context: ./backend/ai-services
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### Production Deployment (AWS)
```bash
# Deploy to AWS ECS
aws ecs create-cluster --cluster-name tourist-safety-cluster

# Deploy Flutter app to App Store/Play Store
cd app-frontend
flutter build apk --release
flutter build ios --release

# Deploy web dashboard to Vercel
vercel --prod

# Set up monitoring
kubectl apply -f k8s/monitoring.yaml
```

## 📚 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register
Content-Type: application/json

{
  "email": "tourist@example.com",
  "phone": "+91-9876543210",
  "kycDocuments": {
    "aadhaar": "base64_encoded_document",
    "passport": "base64_encoded_document"
  },
  "emergencyContacts": [
    {
      "name": "John Doe",
      "phone": "+91-9876543211",
      "relation": "family"
    }
  ]
}

Response: 201 Created
{
  "tourist": {
    "id": "uuid",
    "digitalId": "blockchain_hash",
    "qrCode": "base64_qr_code"
  },
  "accessToken": "jwt_token"
}
```

### Safety Endpoints
```typescript
POST /api/safety/panic
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": {
    "latitude": 26.2006,
    "longitude": 92.9376,
    "accuracy": 10.0
  },
  "message": "Need immediate help"
}

Response: 201 Created
{
  "alert": {
    "id": "alert_uuid",
    "status": "ACTIVE",
    "estimatedResponseTime": "5-10 minutes",
    "nearestOfficer": {
      "name": "Officer Singh",
      "badgeNumber": "12345",
      "eta": "7 minutes"
    }
  }
}
```

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards
- **Flutter**: Follow [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style)
- **Next.js**: Use ESLint + Prettier configuration
- **Python**: Follow PEP 8 standards
- **Git**: Use [Conventional Commits](https://www.conventionalcommits.org/)

### Testing Requirements
- Minimum 80% code coverage
- All tests must pass before merging
- Integration tests for API endpoints
- Widget tests for Flutter components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Smart India Hackathon 2024** for the problem statement
- **Government of India** for promoting digital innovation
- **Open Source Community** for the amazing tools and libraries

## 📞 Support & Contact

- **Project Maintainer**: [Your Name](mailto:maintainer@example.com)
- **Documentation**: [Wiki](https://github.com/AnupamSingh2004/sih-project/wiki)
- **Issues**: [GitHub Issues](https://github.com/AnupamSingh2004/sih-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AnupamSingh2004/sih-project/discussions)

---

<div align="center">
  <p><strong>Made with ❤️ for Tourist Safety in India</strong></p>
  <p>© 2024 Smart Tourist Safety System. All rights reserved.</p>
</div>
```
