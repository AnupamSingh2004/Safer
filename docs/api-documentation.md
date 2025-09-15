# 🔗 Smart Tourist Safety System - API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Authentication Endpoints](#authentication-endpoints)
- [Tourist Management](#tourist-management)
- [Alert System](#alert-system)
- [Zone Management](#zone-management)
- [Blockchain Integration](#blockchain-integration)
- [Mobile App APIs](#mobile-app-apis)
- [Dashboard APIs](#dashboard-apis)
- [WebSocket Integration](#websocket-integration)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Overview

The Smart Tourist Safety System provides RESTful APIs for managing tourists, emergency alerts, geofencing, blockchain digital identities, and real-time communication between mobile apps and web dashboards.

### API Features
- 🔐 **JWT-based Authentication** with role-based access control
- 🌐 **RESTful Design** with consistent response formats
- 📱 **Mobile-First** endpoints optimized for Flutter integration
- 🖥️ **Dashboard APIs** for tourism department and police
- ⛓️ **Blockchain Integration** for digital identity management
- 🚨 **Real-time Alerts** via WebSocket connections
- 🌍 **Multilingual Support** with i18n response headers

## Base URLs

| Environment | Backend API | Web Dashboard | Mobile App |
|-------------|-------------|---------------|------------|
| Development | `http://localhost:3001` | `http://localhost:8001` | Flutter Dev |
| Production  | `https://api.tourist-safety.gov.in` | `https://dashboard.tourist-safety.gov.in` | Play Store |

## Authentication

### Authentication Methods
1. **JWT Tokens** - Primary authentication for all endpoints
2. **Google OAuth** - Social login for tourists
3. **Government ID** - Secure login for officials
4. **Blockchain Verification** - Digital identity validation

### Headers Required
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Version: v1
X-Client-Type: web|mobile
```

### Token Refresh
```http
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

---

## Authentication Endpoints

### 🔐 User Registration
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "tourist@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "userType": "tourist|official|admin",
  "governmentId": "optional_for_officials",
  "department": "tourism|police|admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "usr_123456789",
      "email": "tourist@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "tourist",
      "isVerified": false,
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

### 🔑 User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "tourist@example.com",
  "password": "SecurePass123!",
  "deviceId": "optional_device_identifier",
  "fcmToken": "optional_for_notifications"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "usr_123456789",
      "email": "tourist@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "tourist",
      "profileComplete": true,
      "digitalIdGenerated": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    },
    "permissions": ["view_profile", "create_alert", "track_location"]
  }
}
```

### 🌐 Google OAuth Login
```http
POST /api/auth/google-signin
```

**Request Body:**
```json
{
  "googleToken": "google_oauth_token",
  "userType": "tourist",
  "deviceInfo": {
    "platform": "android|ios|web",
    "version": "1.0.0"
  }
}
```

### 🔄 Token Refresh
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 🚪 Logout
```http
POST /api/auth/logout
```

**Request Body:**
```json
{
  "deviceId": "optional_device_identifier"
}
```

---

## Tourist Management

### 👥 Get All Tourists (Dashboard Only)
```http
GET /api/shared/tourists
```

**Query Parameters:**
```
?page=1&limit=20&status=active&zone=zone_id&search=john&sortBy=lastSeen&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tourists": [
      {
        "id": "tst_123456789",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+919876543210",
        "currentLocation": {
          "latitude": 28.6139,
          "longitude": 77.2090,
          "address": "New Delhi, India",
          "lastUpdated": "2025-01-15T10:30:00Z"
        },
        "safetyScore": 85,
        "status": "active|inactive|emergency",
        "digitalId": "did_blockchain_hash",
        "itinerary": {
          "startDate": "2025-01-15",
          "endDate": "2025-01-20",
          "destinations": ["Delhi", "Agra", "Jaipur"]
        },
        "emergencyContacts": [
          {
            "name": "Emergency Contact",
            "phone": "+911234567890",
            "relationship": "Family"
          }
        ],
        "activeAlerts": 2,
        "lastSeen": "2025-01-15T10:25:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    },
    "statistics": {
      "total": 150,
      "active": 120,
      "emergency": 5,
      "safetyScoreAvg": 82
    }
  }
}
```

### 👤 Get Tourist Details
```http
GET /api/shared/tourists/{id}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tourist": {
      "id": "tst_123456789",
      "personalInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+919876543210",
        "nationality": "Indian",
        "aadhaarHash": "hashed_aadhaar",
        "passportHash": "hashed_passport"
      },
      "currentLocation": {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "address": "New Delhi, India",
        "accuracy": 10,
        "lastUpdated": "2025-01-15T10:30:00Z"
      },
      "safetyMetrics": {
        "safetyScore": 85,
        "riskLevel": "low|medium|high",
        "behaviorPattern": "normal|suspicious|emergency",
        "lastRiskAssessment": "2025-01-15T10:00:00Z"
      },
      "digitalIdentity": {
        "blockchainId": "did_blockchain_hash",
        "isVerified": true,
        "issueDate": "2025-01-15T08:00:00Z",
        "expiryDate": "2025-01-20T23:59:59Z",
        "verificationLevel": "basic|enhanced|premium"
      },
      "travelInfo": {
        "itinerary": {
          "startDate": "2025-01-15",
          "endDate": "2025-01-20",
          "destinations": ["Delhi", "Agra", "Jaipur"],
          "accommodations": [
            {
              "name": "Hotel Taj",
              "address": "Delhi",
              "checkIn": "2025-01-15",
              "checkOut": "2025-01-17"
            }
          ]
        },
        "transportationMode": "train|flight|bus|car",
        "groupSize": 2,
        "travelPurpose": "tourism|business|family"
      },
      "emergencyInfo": {
        "contacts": [
          {
            "name": "Emergency Contact",
            "phone": "+911234567890",
            "relationship": "Family",
            "isPrimary": true
          }
        ],
        "medicalInfo": {
          "allergies": ["peanuts"],
          "medications": ["insulin"],
          "bloodGroup": "O+",
          "emergencyMedicalContact": "+911234567890"
        }
      },
      "alertHistory": [
        {
          "id": "alt_123456789",
          "type": "geofence_violation",
          "severity": "medium",
          "message": "Entered restricted zone",
          "timestamp": "2025-01-15T09:30:00Z",
          "resolved": true
        }
      ],
      "locationHistory": [
        {
          "latitude": 28.6139,
          "longitude": 77.2090,
          "timestamp": "2025-01-15T10:30:00Z",
          "accuracy": 10
        }
      ]
    }
  }
}
```

### 📍 Update Tourist Location
```http
POST /api/shared/tourists/{id}/location
```

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "accuracy": 10,
  "speed": 5.5,
  "heading": 180,
  "altitude": 250,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Alert System

### 🚨 Get All Alerts
```http
GET /api/shared/alerts
```

**Query Parameters:**
```
?page=1&limit=20&severity=high&status=active&touristId=tst_123&type=emergency&dateFrom=2025-01-15
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alt_123456789",
        "type": "emergency|geofence_violation|panic_button|anomaly_detected|medical_emergency",
        "severity": "low|medium|high|critical",
        "status": "active|acknowledged|resolved|dismissed",
        "priority": 1,
        "tourist": {
          "id": "tst_123456789",
          "name": "John Doe",
          "phone": "+919876543210",
          "profileImage": "profile_url"
        },
        "location": {
          "latitude": 28.6139,
          "longitude": 77.2090,
          "address": "New Delhi, India",
          "accuracy": 10
        },
        "message": "Tourist pressed panic button",
        "description": "Detailed description of the alert situation",
        "timestamp": "2025-01-15T10:30:00Z",
        "acknowledgedBy": {
          "officerId": "off_123456789",
          "name": "Officer Smith",
          "department": "Police",
          "acknowledgedAt": "2025-01-15T10:32:00Z"
        },
        "responseTeam": [
          {
            "memberId": "resp_123456789",
            "name": "Response Team Leader",
            "role": "Team Lead",
            "contact": "+911234567890",
            "eta": "15 minutes"
          }
        ],
        "evidence": [
          {
            "type": "image|video|audio|document",
            "url": "evidence_file_url",
            "uploadedAt": "2025-01-15T10:31:00Z"
          }
        ],
        "aiAnalysis": {
          "riskLevel": "high",
          "recommendedActions": ["immediate_response", "notify_emergency_contacts"],
          "confidence": 0.92
        }
      }
    ],
    "statistics": {
      "total": 45,
      "active": 12,
      "resolved": 30,
      "critical": 3
    }
  }
}
```

### 🆔 Get Alert Details
```http
GET /api/shared/alerts/{id}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "alt_123456789",
      "type": "panic_button",
      "severity": "critical",
      "status": "active",
      "tourist": {
        "id": "tst_123456789",
        "personalInfo": {
          "firstName": "John",
          "lastName": "Doe",
          "phone": "+919876543210",
          "emergencyContacts": [
            {
              "name": "Emergency Contact",
              "phone": "+911234567890",
              "relationship": "Family"
            }
          ]
        }
      },
      "incidentDetails": {
        "location": {
          "latitude": 28.6139,
          "longitude": 77.2090,
          "address": "New Delhi, India",
          "nearbyLandmarks": ["Red Fort", "Chandni Chowk"],
          "zoneInfo": {
            "id": "zone_123",
            "name": "Historic Delhi",
            "riskLevel": "medium"
          }
        },
        "timeline": [
          {
            "timestamp": "2025-01-15T10:30:00Z",
            "event": "Panic button pressed",
            "details": "Tourist activated emergency alert"
          },
          {
            "timestamp": "2025-01-15T10:32:00Z",
            "event": "Alert acknowledged",
            "officer": "Officer Smith",
            "details": "Alert received and acknowledged by control room"
          }
        ],
        "evidence": [
          {
            "type": "image",
            "url": "evidence_photo_url",
            "caption": "Photo taken at incident location",
            "uploadedAt": "2025-01-15T10:31:00Z"
          }
        ]
      },
      "responseInfo": {
        "acknowledgedBy": {
          "officerId": "off_123456789",
          "name": "Officer Smith",
          "department": "Police",
          "contact": "+911234567890",
          "acknowledgedAt": "2025-01-15T10:32:00Z"
        },
        "responseTeam": [
          {
            "memberId": "resp_123456789",
            "name": "Emergency Response Team",
            "role": "First Responder",
            "currentLocation": {
              "latitude": 28.6100,
              "longitude": 77.2050
            },
            "eta": "12 minutes",
            "contact": "+911234567890"
          }
        ],
        "actionsTaken": [
          "Emergency contacts notified",
          "Response team dispatched",
          "Medical assistance requested"
        ],
        "estimatedResolution": "2025-01-15T11:00:00Z"
      },
      "aiAnalysis": {
        "riskAssessment": "high",
        "locationAnalysis": {
          "crowdDensity": "moderate",
          "safetyRating": 6.5,
          "nearbyHospitals": 3,
          "nearbyPoliceStations": 2
        },
        "recommendedActions": [
          "immediate_police_response",
          "notify_emergency_contacts",
          "medical_standby"
        ],
        "predictedOutcome": "resolved_within_30_minutes",
        "confidence": 0.89
      }
    }
  }
}
```

### ✅ Update Alert Status
```http
PATCH /api/shared/alerts/{id}
```

**Request Body:**
```json
{
  "status": "acknowledged|resolved|dismissed",
  "officerId": "off_123456789",
  "notes": "Response team dispatched to location",
  "actionsTaken": ["team_dispatched", "contacts_notified"],
  "resolutionDetails": {
    "outcome": "tourist_safe",
    "description": "False alarm - tourist safe and secure",
    "followUpRequired": false
  }
}
```

---

## Zone Management

### 🗺️ Get All Zones
```http
GET /api/shared/zones
```

**Query Parameters:**
```
?type=safe|restricted|emergency&city=Delhi&active=true&riskLevel=high
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "zones": [
      {
        "id": "zone_123456789",
        "name": "Red Fort Area",
        "type": "tourist_attraction|restricted|emergency|medical|police",
        "riskLevel": "low|medium|high|critical",
        "status": "active|inactive|temporary",
        "geometry": {
          "type": "polygon",
          "coordinates": [
            [
              [77.2400, 28.6562],
              [77.2410, 28.6562],
              [77.2410, 28.6572],
              [77.2400, 28.6572],
              [77.2400, 28.6562]
            ]
          ]
        },
        "center": {
          "latitude": 28.6567,
          "longitude": 77.2405
        },
        "radius": 500,
        "description": "Historic monument area with moderate tourist traffic",
        "safetyInfo": {
          "riskFactors": ["crowded_area", "pickpocketing"],
          "safetyMeasures": ["cctv_monitored", "police_patrol"],
          "emergencyServices": {
            "nearestHospital": {
              "name": "LNJP Hospital",
              "distance": 2.5,
              "contact": "+911234567890"
            },
            "nearestPoliceStation": {
              "name": "Red Fort Police Station",
              "distance": 0.5,
              "contact": "+911234567890"
            }
          }
        },
        "restrictions": {
          "timeRestrictions": {
            "startTime": "06:00",
            "endTime": "18:00"
          },
          "accessLevel": "public|restricted|emergency_only",
          "specialPermissions": ["photography_restricted"]
        },
        "statistics": {
          "currentTourists": 45,
          "dailyAverage": 200,
          "incidentCount": 2,
          "lastIncident": "2025-01-14T15:30:00Z"
        },
        "createdAt": "2025-01-10T08:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    ],
    "statistics": {
      "totalZones": 150,
      "activeZones": 142,
      "highRiskZones": 12,
      "restrictedZones": 8
    }
  }
}
```

### 🎯 Get Zone Details
```http
GET /api/shared/zones/{id}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "zone": {
      "id": "zone_123456789",
      "basicInfo": {
        "name": "Red Fort Area",
        "type": "tourist_attraction",
        "status": "active",
        "riskLevel": "medium",
        "description": "Historic monument area with moderate tourist traffic"
      },
      "geographicInfo": {
        "geometry": {
          "type": "polygon",
          "coordinates": [
            [
              [77.2400, 28.6562],
              [77.2410, 28.6562],
              [77.2410, 28.6572],
              [77.2400, 28.6572],
              [77.2400, 28.6562]
            ]
          ]
        },
        "center": {
          "latitude": 28.6567,
          "longitude": 77.2405
        },
        "area": 0.25,
        "perimeter": 2.1
      },
      "safetyProfile": {
        "riskFactors": [
          {
            "factor": "crowded_area",
            "severity": "medium",
            "description": "High tourist concentration during peak hours"
          },
          {
            "factor": "pickpocketing",
            "severity": "low",
            "description": "Occasional reports of petty theft"
          }
        ],
        "safetyMeasures": [
          {
            "measure": "cctv_monitored",
            "coverage": "90%",
            "description": "24/7 CCTV surveillance"
          },
          {
            "measure": "police_patrol",
            "frequency": "hourly",
            "description": "Regular police patrolling"
          }
        ],
        "emergencyServices": {
          "hospitals": [
            {
              "name": "LNJP Hospital",
              "distance": 2.5,
              "contact": "+911234567890",
              "specialties": ["Emergency", "Trauma"]
            }
          ],
          "policeStations": [
            {
              "name": "Red Fort Police Station",
              "distance": 0.5,
              "contact": "+911234567890",
              "jurisdiction": "Central Delhi"
            }
          ],
          "fireStations": [
            {
              "name": "Central Delhi Fire Station",
              "distance": 1.2,
              "contact": "+911234567890"
            }
          ]
        }
      },
      "currentStatus": {
        "touristsInZone": 45,
        "alertLevel": "green|yellow|orange|red",
        "lastUpdated": "2025-01-15T10:30:00Z",
        "weatherConditions": {
          "temperature": 22,
          "condition": "clear",
          "visibility": "good"
        }
      },
      "statistics": {
        "daily": {
          "averageTourists": 200,
          "peakHours": ["10:00-12:00", "15:00-17:00"],
          "incidentRate": 0.5
        },
        "weekly": {
          "totalVisitors": 1400,
          "totalIncidents": 3,
          "resolutionTime": "15 minutes"
        },
        "historical": {
          "safetyTrend": "improving",
          "popularityTrend": "stable",
          "lastMajorIncident": "2025-01-10T14:30:00Z"
        }
      }
    }
  }
}
```

---

## Blockchain Integration

### ⛓️ Generate Digital Identity
```http
POST /api/blockchain/generate-identity
```

**Request Body:**
```json
{
  "touristId": "tst_123456789",
  "kycData": {
    "aadhaarHash": "hashed_aadhaar_number",
    "passportHash": "hashed_passport_number",
    "documentProofs": ["aadhaar_url", "passport_url"]
  },
  "tripDetails": {
    "startDate": "2025-01-15",
    "endDate": "2025-01-20",
    "destinations": ["Delhi", "Agra", "Jaipur"],
    "purpose": "tourism"
  },
  "emergencyContacts": [
    {
      "name": "Emergency Contact",
      "phone": "+911234567890",
      "relationship": "Family"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Digital identity generated successfully",
  "data": {
    "digitalId": {
      "blockchainId": "did:tourist:0x1234567890abcdef",
      "transactionHash": "0xabcdef1234567890",
      "contractAddress": "0x1234567890abcdef",
      "tokenId": 12345,
      "qrCode": "base64_qr_code_image",
      "issuedAt": "2025-01-15T10:30:00Z",
      "expiresAt": "2025-01-20T23:59:59Z",
      "verificationLevel": "basic|enhanced|premium"
    },
    "blockchain": {
      "network": "ethereum|polygon",
      "blockNumber": 19123456,
      "gasUsed": 150000,
      "gasPrice": "20 gwei"
    },
    "verification": {
      "status": "verified",
      "verifiedBy": "Government of India",
      "verificationDate": "2025-01-15T10:30:00Z",
      "trustScore": 95
    }
  }
}
```

### ✅ Verify Digital Identity
```http
POST /api/blockchain/verify-identity
```

**Request Body:**
```json
{
  "digitalId": "did:tourist:0x1234567890abcdef",
  "verificationMethod": "qr_scan|manual_entry|nfc",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "verifierId": "off_123456789"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Identity verification successful",
  "data": {
    "verification": {
      "isValid": true,
      "touristInfo": {
        "id": "tst_123456789",
        "name": "John Doe",
        "nationality": "Indian",
        "verificationLevel": "enhanced"
      },
      "identityStatus": {
        "isActive": true,
        "isExpired": false,
        "isRevoked": false,
        "lastVerified": "2025-01-15T10:30:00Z"
      },
      "tripInfo": {
        "startDate": "2025-01-15",
        "endDate": "2025-01-20",
        "destinations": ["Delhi", "Agra", "Jaipur"],
        "daysRemaining": 3
      },
      "blockchain": {
        "blockchainId": "did:tourist:0x1234567890abcdef",
        "contractValid": true,
        "lastBlockchainUpdate": "2025-01-15T08:00:00Z"
      }
    },
    "recommendations": [
      "Identity verified successfully",
      "Tourist is authorized for current location",
      "No security concerns detected"
    ]
  }
}
```

### 📋 Get Identity Records
```http
GET /api/blockchain/identity-records
```

**Query Parameters:**
```
?page=1&limit=20&status=active&dateFrom=2025-01-15&touristId=tst_123
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "rec_123456789",
        "digitalId": "did:tourist:0x1234567890abcdef",
        "tourist": {
          "id": "tst_123456789",
          "name": "John Doe",
          "nationality": "Indian"
        },
        "blockchain": {
          "transactionHash": "0xabcdef1234567890",
          "blockNumber": 19123456,
          "contractAddress": "0x1234567890abcdef",
          "tokenId": 12345
        },
        "status": "active|expired|revoked",
        "issuedAt": "2025-01-15T10:30:00Z",
        "expiresAt": "2025-01-20T23:59:59Z",
        "verificationCount": 15,
        "lastVerified": "2025-01-15T09:45:00Z",
        "trustScore": 95
      }
    ],
    "statistics": {
      "totalRecords": 1250,
      "activeRecords": 980,
      "expiredRecords": 200,
      "revokedRecords": 70
    }
  }
}
```

---

## Mobile App APIs

### 📱 Mobile Profile Management
```http
GET /api/mobile/profile
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "tst_123456789",
      "personalInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+919876543210",
        "profileImage": "profile_image_url"
      },
      "safetyStatus": {
        "safetyScore": 85,
        "lastLocationUpdate": "2025-01-15T10:30:00Z",
        "emergencyContactsCount": 2,
        "activeAlerts": 0
      },
      "digitalIdentity": {
        "blockchainId": "did:tourist:0x1234567890abcdef",
        "isVerified": true,
        "qrCode": "base64_qr_code",
        "expiresAt": "2025-01-20T23:59:59Z"
      },
      "preferences": {
        "language": "en|hi|regional",
        "notifications": {
          "emergencyAlerts": true,
          "safetyReminders": true,
          "locationUpdates": true
        },
        "privacy": {
          "locationSharing": "always|contacts_only|emergency_only",
          "profileVisibility": "public|private"
        }
      }
    }
  }
}
```

### 🆘 Panic Button
```http
POST /api/mobile/panic
```

**Request Body:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "accuracy": 10
  },
  "emergencyType": "medical|security|accident|other",
  "message": "Optional emergency message",
  "audioRecording": "base64_audio_data",
  "photos": ["base64_image_data"],
  "contactEmergencyServices": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Emergency alert created successfully",
  "data": {
    "alert": {
      "id": "alt_emergency_123456789",
      "status": "active",
      "priority": "critical",
      "responseTime": "5 minutes",
      "nearestResponders": [
        {
          "type": "police",
          "name": "Delhi Police Control Room",
          "contact": "+91100",
          "eta": "8 minutes"
        },
        {
          "type": "medical",
          "name": "Ambulance Service",
          "contact": "+91108",
          "eta": "12 minutes"
        }
      ]
    },
    "immediateActions": [
      "Emergency contacts notified",
      "Response teams dispatched",
      "Tourist location shared with authorities"
    ],
    "trackingId": "TRACK_EMG_123456789"
  }
}
```

### 📊 Safety Score Update
```http
GET /api/mobile/safety-score
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "safetyScore": {
      "current": 85,
      "trend": "improving|stable|declining",
      "lastUpdated": "2025-01-15T10:30:00Z",
      "factors": [
        {
          "category": "location_behavior",
          "score": 90,
          "impact": "positive",
          "description": "Staying in safe areas"
        },
        {
          "category": "time_patterns",
          "score": 80,
          "impact": "neutral",
          "description": "Regular activity patterns"
        },
        {
          "category": "emergency_preparedness",
          "score": 85,
          "impact": "positive",
          "description": "Emergency contacts updated"
        }
      ],
      "recommendations": [
        "Continue following planned itinerary",
        "Update emergency contacts if needed",
        "Enable location sharing for family"
      ],
      "riskLevel": "low|medium|high"
    }
  }
}
```

### 📍 Location Tracking
```http
POST /api/mobile/tracking
```

**Request Body:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "accuracy": 10,
    "speed": 5.5,
    "heading": 180,
    "altitude": 250
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "batteryLevel": 85,
  "networkType": "wifi|4g|5g",
  "activityType": "walking|driving|stationary"
}
```

---

## WebSocket Integration

### 🔌 WebSocket Connection
```javascript
// Client-side connection
const socket = io('wss://api.tourist-safety.gov.in', {
  auth: {
    token: 'jwt_token'
  },
  query: {
    userType: 'tourist|official|admin',
    userId: 'user_id'
  }
});
```

### 📡 Real-time Events

#### Tourist Events
```javascript
// Listen for emergency alerts
socket.on('emergency_alert', (data) => {
  console.log('Emergency Alert:', data);
  // Handle emergency notification
});

// Listen for safety updates
socket.on('safety_update', (data) => {
  console.log('Safety Update:', data);
  // Update safety score/status
});

// Listen for zone notifications
socket.on('zone_notification', (data) => {
  console.log('Zone Alert:', data);
  // Handle geofence entry/exit
});
```

#### Dashboard Events
```javascript
// Listen for new alerts
socket.on('new_alert', (data) => {
  console.log('New Alert:', data);
  // Update dashboard with new alert
});

// Listen for tourist updates
socket.on('tourist_update', (data) => {
  console.log('Tourist Update:', data);
  // Update tourist information
});

// Listen for system updates
socket.on('system_update', (data) => {
  console.log('System Update:', data);
  // Handle system-wide notifications
});
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_REQUIRED` | 401 | JWT token missing or invalid |
| `AUTHORIZATION_FAILED` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Request data validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `BLOCKCHAIN_ERROR` | 500 | Blockchain operation failed |
| `EMERGENCY_PROCESSING` | 500 | Emergency alert processing error |
| `LOCATION_REQUIRED` | 400 | Location data required for operation |

---

## Rate Limiting

### Rate Limits by Endpoint Type
| Endpoint Category | Rate Limit | Window |
|-------------------|------------|---------|
| Authentication | 5 requests | 1 minute |
| Emergency/Panic | 10 requests | 1 minute |
| Location Updates | 60 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Blockchain Operations | 20 requests | 5 minutes |

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642291200
X-RateLimit-Window: 60
```

---

## API Versioning

Current API Version: **v1**

### Version Headers
```http
X-API-Version: v1
Accept: application/json; version=1
```

### Version Compatibility
- **v1**: Current stable version
- **v2**: In development (preview available)

---

## Security Considerations

### HTTPS Only
All API endpoints require HTTPS in production.

### CORS Configuration
```javascript
// Allowed origins
const allowedOrigins = [
  'https://dashboard.tourist-safety.gov.in',
  'https://admin.tourist-safety.gov.in',
  'capacitor://localhost', // Mobile app
  'http://localhost:3000'   // Development only
];
```

### Content Security Policy
```http
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
```

---

## API Testing

### Postman Collection
Import the Postman collection from: `docs/api-collection.json`

### Example cURL Commands
```bash
# Login
curl -X POST https://api.tourist-safety.gov.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Tourists
curl -X GET https://api.tourist-safety.gov.in/api/shared/tourists \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create Emergency Alert
curl -X POST https://api.tourist-safety.gov.in/api/mobile/panic \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location":{"latitude":28.6139,"longitude":77.2090},"emergencyType":"medical"}'
```

---

## Support & Contact

For API support and technical assistance:
- **Email**: api-support@tourist-safety.gov.in
- **Documentation**: https://docs.tourist-safety.gov.in
- **Status Page**: https://status.tourist-safety.gov.in
- **Developer Portal**: https://developer.tourist-safety.gov.in

---

*Last Updated: January 15, 2025*
*API Documentation Version: 1.0.0*
