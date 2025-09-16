# 🚀 Smart Tourist Safety System - Complete Localhost Routing Map

## 📋 Overview
This document provides a comprehensive mapping of all localhost URLs for the SIH 2025 Smart Tourist Safety System, organized by the project structure and grouped for easy navigation during development and demonstration.

---

## 🌐 Development Environment Services

### Primary Services
| Service | URL | Port | Status | Description |
|---------|-----|------|--------|-------------|
| **Web Dashboard** | http://localhost:8001 | 8001 | ✅ Active | Main government dashboard interface (Next.js frontend) |
| **Backend API Server** | http://localhost:3001 | 3001 | ✅ Active | Backend Next.js server with API routes and blockchain services |
| **Mobile App (Web)** | http://localhost:8080 | 8080 | 🔄 Development | Flutter mobile app web version |

---

## 🏠 Public & Authentication Routes

### Main Application Routes
```
http://localhost:8001/                          # Home Page
http://localhost:8001/about                     # About Page
http://localhost:8001/contact                   # Contact Page
http://localhost:8001/help                      # Help & Documentation
http://localhost:8001/support                   # Support Center
http://localhost:8001/profile                   # User Profile
http://localhost:8001/emergency                 # Emergency Information
```

### Authentication System
```
http://localhost:8001/login                     # Login Page
http://localhost:8001/register                  # Registration Page
http://localhost:8001/auth/logout               # Logout Handler
http://localhost:8001/auth/error                # Authentication Error Page
```

---

## 📊 Dashboard Routes (Government Interface)

### Main Dashboard Navigation
```
http://localhost:8001/dashboard/overview        # Main Dashboard Overview
http://localhost:8001/dashboard/tourists        # Tourist Management
http://localhost:8001/dashboard/alerts          # Alert Management System
http://localhost:8001/dashboard/zones           # Zone Management
http://localhost:8001/dashboard/analytics       # Analytics & Reports
http://localhost:8001/dashboard/blockchain      # Blockchain & Digital Identity
http://localhost:8001/dashboard/settings        # User Settings
```

### Tourist Management System
```
http://localhost:8001/dashboard/tourists                    # All Tourists
http://localhost:8001/dashboard/tourists/create             # Create New Tourist
http://localhost:8001/dashboard/tourists/{id}               # Tourist Details
http://localhost:8001/dashboard/tourists/{id}/edit          # Edit Tourist
http://localhost:8001/dashboard/tourists/{id}/location      # Tourist Location
http://localhost:8001/dashboard/tourists/{id}/digital-id    # Tourist Digital ID
```

### Alert Management System
```
http://localhost:8001/dashboard/alerts                      # All Alerts
http://localhost:8001/dashboard/alerts/active               # Active Alerts
http://localhost:8001/dashboard/alerts/history              # Alert History
http://localhost:8001/dashboard/alerts/emergency            # Emergency Alerts
http://localhost:8001/dashboard/alerts/create               # Create Alert
http://localhost:8001/dashboard/alerts/{id}                 # Alert Details
```

### Zone Management
```
http://localhost:8001/dashboard/zones                       # All Zones
http://localhost:8001/dashboard/zones/create                # Create Zone
http://localhost:8001/dashboard/zones/{id}                  # Zone Details
http://localhost:8001/dashboard/zones/{id}/edit             # Edit Zone
```

### Analytics & Reports
```
http://localhost:8001/dashboard/analytics                   # Analytics Overview
http://localhost:8001/dashboard/analytics/heatmap           # Tourist Heatmap
http://localhost:8001/dashboard/analytics/reports           # Generated Reports
```

### Blockchain & Digital Identity
```
http://localhost:8001/dashboard/blockchain                         # Blockchain Overview
http://localhost:8001/dashboard/blockchain/digital-ids             # All Digital IDs
http://localhost:8001/dashboard/blockchain/digital-ids/generate    # Generate New ID
http://localhost:8001/dashboard/blockchain/digital-ids/verify      # Verify Digital ID
http://localhost:8001/dashboard/blockchain/records                 # Blockchain Records
```

### Administration (Super Admin/Admin Only)
```
http://localhost:8001/dashboard/administration                     # Administration Panel
http://localhost:8001/dashboard/administration/users               # User Management
http://localhost:8001/dashboard/administration/users/create        # Create User
```

---

## 🔧 Alternative Dashboard Routes

### Direct Dashboard Access
```
http://localhost:8001/dashboard                        # Alternative Dashboard
http://localhost:8001/dashboard/advanced-ui            # Advanced UI Components
http://localhost:8001/dashboard/alerts                 # Direct Alert Access
http://localhost:8001/dashboard/analytics              # Direct Analytics
http://localhost:8001/dashboard/communication          # Communication Hub
http://localhost:8001/dashboard/location               # Location Intelligence
http://localhost:8001/dashboard/register-tourist       # Tourist Registration
```

---

## 🎮 Demo & Testing Routes

### Demo System
```
http://localhost:8001/demo/integration                 # Mobile-Web Integration Demo
http://localhost:8001/demo/mobile-simulator            # Mobile App Simulator
http://localhost:8001/demo/transitions                 # UI Transition Examples
```

### System Administration
```
http://localhost:8001/admin                            # Admin Panel
http://localhost:8001/admin/users                      # User Management
http://localhost:8001/admin/users/create               # Create Admin User
http://localhost:8001/admin/users/{id}/edit            # Edit User
```

### Development Testing
```
http://localhost:8001/theme-test-simple                # Theme Testing
http://localhost:8001/css-debug                        # CSS Debug Tools
http://localhost:8001/test-components                  # Component Testing
```

---

## 🔌 API Endpoints (Backend Integration)

### Authentication API
```
http://localhost:3001/api/auth/login                   # User Login
http://localhost:3001/api/auth/register                # User Registration
http://localhost:3001/api/auth/logout                  # User Logout
http://localhost:3001/api/auth/refresh                 # Token Refresh
http://localhost:3001/api/auth/verify                  # Email Verification
http://localhost:3001/api/auth/[...nextauth]           # NextAuth Handler
http://localhost:3001/api/auth/google-signin           # Google Authentication
```

### Tourist Management API
```
http://localhost:3001/api/tourists                     # All Tourists
http://localhost:3001/api/tourists/search              # Search Tourists
http://localhost:3001/api/tourists/{id}                # Tourist by ID
http://localhost:3001/api/tourists/{id}/digital-id     # Tourist Digital ID
http://localhost:3001/api/tourists/{id}/location       # Tourist Location
```

### Alert Management API
```
http://localhost:3001/api/alerts                       # All Alerts
http://localhost:3001/api/alerts/active                # Active Alerts
http://localhost:3001/api/alerts/emergency             # Emergency Alerts
http://localhost:3001/api/alerts/{id}                  # Alert by ID
http://localhost:3001/api/alerts/{id}/resolve          # Resolve Alert
http://localhost:3001/api/alerts/bulk-update           # Bulk Alert Update
```

### Blockchain API
```
http://localhost:3001/api/blockchain/generate-id       # Generate Digital ID
http://localhost:3001/api/blockchain/verify-id         # Verify Digital ID
http://localhost:3001/api/blockchain/generate-identity # Generate Identity
http://localhost:3001/api/blockchain/verify-identity   # Verify Identity
http://localhost:3001/api/blockchain/transaction-status # Transaction Status
http://localhost:3001/api/blockchain/contract-deploy   # Deploy Contract
http://localhost:3001/api/blockchain/contract-status   # Contract Status
http://localhost:3001/api/blockchain/identity-records  # Identity Records
```

### Analytics API
```
http://localhost:3001/api/analytics/dashboard          # Dashboard Analytics
http://localhost:3001/api/analytics/heatmap            # Heatmap Data
http://localhost:3001/api/analytics/reports            # Report Generation
```

### Mobile API
```
http://localhost:3001/api/mobile/tracking              # Location Tracking
http://localhost:3001/api/mobile/panic                 # Panic Button
http://localhost:3001/api/mobile/safety-score          # Safety Score
http://localhost:3001/api/mobile/kyc-upload            # KYC Document Upload
http://localhost:3001/api/mobile/profile               # Mobile Profile
```

### Shared API (Cross-platform)
```
http://localhost:3001/api/shared/alerts                # Shared Alerts
http://localhost:3001/api/shared/zones                 # Shared Zones
http://localhost:3001/api/shared/tourists              # Shared Tourists
http://localhost:3001/api/shared/notifications         # Shared Notifications
http://localhost:3001/api/shared/tourists/{id}         # Tourist by ID
http://localhost:3001/api/shared/tourists/{id}/alerts  # Tourist Alerts
http://localhost:3001/api/shared/tourists/{id}/location # Tourist Location
http://localhost:3001/api/shared/zones/{id}            # Zone by ID
http://localhost:3001/api/shared/alerts/{id}           # Alert by ID
```

### WebSocket & Real-time
```
http://localhost:3001/api/websocket                    # WebSocket Connection
```

### Webhooks
```
http://localhost:3001/api/webhooks/blockchain          # Blockchain Webhooks
http://localhost:3001/api/webhooks/payment             # Payment Webhooks
```

---

## 📱 Mobile Application Routes

### Flutter Mobile App (Web Version)
```
http://localhost:8080/                                 # Mobile App Home
http://localhost:8080/#/                               # Flutter Web Router
```

---

## 🚀 Quick Access URLs (Most Important)

### For Demo & Presentation
```
🏠 Main Dashboard:     http://localhost:8001/dashboard/overview
🔐 Login:              http://localhost:8001/login
👥 Tourists:           http://localhost:8001/dashboard/tourists
🚨 Alerts:             http://localhost:8001/dashboard/alerts
📊 Analytics:          http://localhost:8001/dashboard/analytics
🔗 Blockchain:         http://localhost:8001/dashboard/blockchain
🎮 Demo Integration:   http://localhost:8001/demo/integration
📱 Mobile Simulator:   http://localhost:8001/demo/mobile-simulator
```

### For Development
```
🔧 API Base:           http://localhost:3001
🛠️ Theme Testing:      http://localhost:8001/theme-test-simple
👨‍💼 Admin Panel:        http://localhost:8001/admin
📋 All Alerts API:     http://localhost:3001/api/alerts
🏗️ Generate ID API:    http://localhost:3001/api/blockchain/generate-id
```

---

## 🛠️ Development Commands

### Start Services
```bash
# Web Dashboard (Port 8001)
cd web && npm run dev

# Backend API Server (Port 3001)
cd backend && npm run dev

# Mobile App (Port 8080)
cd app-frontend && flutter run -d web-server --web-port 8080
```

### Access Routes Programmatically
```javascript
// In browser console (development mode only)
logAllRoutes()              // See all available routes
ROUTES                      // Access routes object
QUICK_ACCESS               // Quick access URLs
```

---

## 📋 Role-Based Access Summary

### Super Admin
- ✅ All routes and functionalities
- ✅ System administration
- ✅ User management
- ✅ Full CRUD operations

### Admin
- ✅ All dashboard routes
- ✅ User administration
- ✅ Full CRUD operations
- ❌ System-level administration

### Operator
- ✅ Dashboard overview, tourists, alerts, zones, analytics, blockchain
- ✅ Create and edit operations
- ❌ Delete operations
- ❌ User management

### Viewer
- ✅ Dashboard overview, tourists, alerts, zones, analytics, blockchain
- ❌ Create, edit, or delete operations
- ❌ Administrative functions

---

## 🎯 Testing Checklist

### Frontend Testing
- [ ] Login at http://localhost:8001/login
- [ ] Dashboard at http://localhost:8001/dashboard/overview
- [ ] Tourist management at http://localhost:8001/dashboard/tourists
- [ ] Alert system at http://localhost:8001/dashboard/alerts
- [ ] Demo integration at http://localhost:8001/demo/integration

### Backend Testing
- [ ] API health check at http://localhost:3001/api/auth/verify
- [ ] Tourist data at http://localhost:3001/api/tourists
- [ ] Alert system at http://localhost:3001/api/alerts/active
- [ ] Blockchain integration at http://localhost:3001/api/blockchain/generate-id

### Integration Testing
- [ ] Mobile-web sync at http://localhost:8001/demo/integration
- [ ] Real-time alerts between mobile simulator and dashboard
- [ ] Blockchain ID generation and verification
- [ ] Role-based access control across all routes

---

## 📞 Support

For development issues or route-related questions:
- Check browser console for route helpers: `logAllRoutes()`
- Verify services are running on correct ports
- Ensure environment variables are properly configured
- Test API endpoints individually before integration

---

*Generated for SIH 2025 Smart Tourist Safety System - Complete Development Routing Map*