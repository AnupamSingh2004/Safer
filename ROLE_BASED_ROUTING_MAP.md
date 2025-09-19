# 🎯 Role-Based Smart Tourist Safety System - Complete Routing Map

## 📋 Overview
This document organizes all system URLs by **user roles** and their specific access rights, responsibilities, and management interfaces. Each role has a clear hierarchy with appropriate functionality access.

---

## 🌐 Development Environment Services

### Primary Services
| Service | URL | Port | Status | Description |
|---------|-----|------|--------|-------------|
| **Web Dashboard** | http://localhost:8001 | 8001 | ✅ Active | Main government dashboard interface (Next.js frontend) |
| **Backend API Server** | http://localhost:3001 | 3001 | ✅ Active | Backend Next.js server with API routes and blockchain services |
| **Mobile App (Web)** | http://localhost:8080 | 8080 | 🔄 Development | Flutter mobile app web version |

---

## 👑 SUPER ADMIN - Complete System Access

### Super Admin Dashboard URLs
```
http://localhost:8001/dashboard/overview               # Main Dashboard Overview
http://localhost:8001/dashboard/analytics              # Analytics & Reports
http://localhost:8001/dashboard/administration         # User Management Hub
http://localhost:8001/dashboard/administration/users   # Manage All Users
http://localhost:8001/dashboard/administration/users/create # Create New Users
http://localhost:8001/dashboard/administration/operators # Operator Management
http://localhost:8001/dashboard/administration/operators/assignments # Operator Assignments
http://localhost:8001/dashboard/administration/logs    # System Logs
http://localhost:8001/dashboard/administration/permissions # Permission Management
http://localhost:8001/dashboard/settings/system        # System Settings
```

### Super Admin System Management
```
http://localhost:8001/admin                            # System Admin Panel
http://localhost:8001/admin/users                      # Global User Management
http://localhost:8001/admin/users/create               # Create System Users
http://localhost:8001/admin/backup                     # System Backup
http://localhost:8001/admin/logs                       # System Logs
http://localhost:8001/admin/permissions                # Global Permissions
```

### Super Admin APIs
```
http://localhost:3001/api/auth/register                # Create New Users
http://localhost:3001/api/analytics/dashboard          # System Analytics
http://localhost:3001/api/blockchain/contract-deploy   # Deploy Blockchain Contracts
http://localhost:3001/api/blockchain/contract-status   # Contract Management
```

### Super Admin Capabilities
- ✅ **Full CRUD Operations**: Create, Read, Update, Delete all entities
- ✅ **User Management**: Create/manage all user roles
- ✅ **System Administration**: Access system-level configurations
- ✅ **Operator Assignment**: Assign operators to tourists and zones
- ✅ **Blockchain Management**: Deploy and manage smart contracts
- ✅ **System Logs**: Full audit trail access

---

## 🛡️ ADMIN - Administrative Management

### Admin Dashboard URLs
```
http://localhost:8001/dashboard/overview               # Main Dashboard Overview
http://localhost:8001/dashboard/tourists               # Tourist Management Hub
http://localhost:8001/dashboard/tourists/create        # Register New Tourists
http://localhost:8001/dashboard/alerts                 # Alert Management
http://localhost:8001/dashboard/alerts/create          # Create Safety Alerts
http://localhost:8001/dashboard/zones                  # Zone Management
http://localhost:8001/dashboard/zones/create           # Create New Zones
http://localhost:8001/dashboard/analytics              # Analytics & Reports
http://localhost:8001/dashboard/blockchain             # Digital Identity Management
http://localhost:8001/dashboard/blockchain/digital-ids # Manage Digital IDs
http://localhost:8001/dashboard/blockchain/generate    # Generate New Digital IDs
http://localhost:8001/dashboard/administration         # User Administration
http://localhost:8001/dashboard/administration/users   # Manage Users (Non-Super)
http://localhost:8001/dashboard/administration/operators # Manage Operators
```

### Admin User Management
```
http://localhost:8001/dashboard/administration/users/create # Create Operators/Viewers
http://localhost:8001/dashboard/administration/operators/assignments # Assign Operators
http://localhost:8001/dashboard/settings/users         # User Settings Management
```

### Admin APIs
```
http://localhost:3001/api/tourists                     # Tourist Management
http://localhost:3001/api/tourists/search              # Tourist Search
http://localhost:3001/api/alerts                       # Alert Management
http://localhost:3001/api/alerts/bulk-update           # Bulk Alert Operations
http://localhost:3001/api/zones                        # Zone Management
http://localhost:3001/api/blockchain/generate-id       # Generate Digital IDs
http://localhost:3001/api/blockchain/verify-id         # Verify Digital IDs
http://localhost:3001/api/analytics/reports            # Generate Reports
```

### Admin Capabilities
- ✅ **Tourist Operations**: Full CRUD on tourist data
- ✅ **Alert Management**: Create, manage, and resolve alerts
- ✅ **Zone Administration**: Create and manage safety zones
- ✅ **User Management**: Create operators and viewers
- ✅ **Operator Assignment**: Assign operators to specific tourists
- ✅ **Digital Identity**: Generate and manage digital IDs
- ❌ **System Administration**: Cannot access system-level configs
- ❌ **Super Admin Creation**: Cannot create other admins

---

## 👨‍💼 OPERATOR - Field Operations & Tourist Assignment

### Operator Dashboard URLs
```
http://localhost:8001/dashboard/overview               # Dashboard Overview
http://localhost:8001/dashboard/operator               # Operator Hub (My Profile)
http://localhost:8001/dashboard/operator/profile       # My Operator Profile & ID
http://localhost:8001/dashboard/operator/assigned-tourists # My Assigned Tourists
http://localhost:8001/dashboard/operator/assignments   # My Current Assignments
http://localhost:8001/dashboard/operator/workload      # My Workload Management
http://localhost:8001/dashboard/operator/reports       # My Activity Reports
```

### Operator Tourist Management
```
http://localhost:8001/dashboard/tourists               # View Assigned Tourists
http://localhost:8001/dashboard/tourists/create        # Register New Tourists
http://localhost:8001/dashboard/tourists/{id}          # Tourist Details (Assigned)
http://localhost:8001/dashboard/tourists/{id}/location # Track Tourist Location
http://localhost:8001/dashboard/tourists/{id}/digital-id # Manage Tourist Digital ID
```

### Operator Alert Management
```
http://localhost:8001/dashboard/alerts                 # View/Create Alerts
http://localhost:8001/dashboard/alerts/active          # Monitor Active Alerts
http://localhost:8001/dashboard/alerts/create          # Create Safety Alerts
http://localhost:8001/dashboard/alerts/emergency       # Handle Emergency Alerts
```

### Operator APIs
```
http://localhost:3001/api/tourists                     # Access Assigned Tourists
http://localhost:3001/api/alerts                       # Alert Management
http://localhost:3001/api/alerts/active                # Monitor Active Alerts
http://localhost:3001/api/mobile/tracking              # Mobile Location Tracking
http://localhost:3001/api/mobile/panic                 # Handle Panic Buttons
http://localhost:3001/api/shared/tourists              # Shared Tourist Data
http://localhost:3001/api/shared/alerts                # Shared Alert System
```

### Operator Capabilities
- ✅ **Assigned Tourist Management**: Full access to assigned tourists
- ✅ **Alert Creation**: Create and manage safety alerts
- ✅ **Zone Monitoring**: Monitor assigned zones
- ✅ **Mobile Integration**: Handle mobile app communications
- ✅ **Digital ID Verification**: Verify tourist digital identities
- ✅ **Workload Tracking**: Track personal assignment load
- ❌ **User Management**: Cannot create or manage users
- ❌ **System Administration**: No admin access
- ❌ **Unassigned Tourists**: Cannot access non-assigned tourists

### Key Operator Questions Addressed:
- **"What is my operator ID?"** → `/dashboard/operator/profile`
- **"Which tourists are assigned to me?"** → `/dashboard/operator/assigned-tourists`
- **"What's my current workload?"** → `/dashboard/operator/workload`
- **"How do I report my activities?"** → `/dashboard/operator/reports`

---

## 👁️ VIEWER - Read-Only Monitoring

### Viewer Dashboard URLs
```
http://localhost:8001/dashboard/overview               # Dashboard Overview (Read-Only)
http://localhost:8001/dashboard/tourists               # View All Tourists (Read-Only)
http://localhost:8001/dashboard/alerts                 # Monitor Alerts (Read-Only)
http://localhost:8001/dashboard/alerts/active          # View Active Alerts
http://localhost:8001/dashboard/zones                  # View Safety Zones
http://localhost:8001/dashboard/analytics              # View Analytics & Reports
http://localhost:8001/dashboard/blockchain             # View Blockchain Records
```

### Viewer APIs (Read-Only)
```
http://localhost:3001/api/tourists                     # View Tourist Data
http://localhost:3001/api/alerts                       # View Alert Data
http://localhost:3001/api/zones                        # View Zone Information
http://localhost:3001/api/analytics/dashboard          # View Analytics
http://localhost:3001/api/shared/tourists              # Shared Tourist Views
http://localhost:3001/api/shared/alerts                # Shared Alert Views
```

### Viewer Capabilities
- ✅ **Monitoring**: View all dashboard data
- ✅ **Analytics**: Access reports and analytics
- ✅ **Real-time Alerts**: Monitor safety alerts
- ✅ **Tourist Tracking**: View tourist locations and status
- ❌ **Create Operations**: Cannot create any entities
- ❌ **Edit Operations**: Cannot modify any data
- ❌ **Delete Operations**: Cannot delete any records
- ❌ **Administrative Access**: No user or system management

---

## 🎯 TOURIST - Mobile App Access (Future Implementation)

### Tourist Mobile URLs (Flutter App)
```
http://localhost:8080/                                 # Mobile App Home
http://localhost:8080/#/profile                        # Tourist Profile
http://localhost:8080/#/safety                         # Safety Features
http://localhost:8080/#/emergency                      # Emergency Contacts
http://localhost:8080/#/digital-id                     # My Digital Identity
```

### Tourist APIs
```
http://localhost:3001/api/mobile/profile               # Tourist Profile
http://localhost:3001/api/mobile/tracking              # Location Sharing
http://localhost:3001/api/mobile/panic                 # Panic Button
http://localhost:3001/api/mobile/safety-score          # Personal Safety Score
http://localhost:3001/api/mobile/kyc-upload            # KYC Document Upload
```

### Tourist Capabilities
- ✅ **Profile Management**: Manage personal information
- ✅ **Location Sharing**: Share location with authorities
- ✅ **Emergency Features**: Panic button and emergency contacts
- ✅ **Digital Identity**: Access personal digital ID
- ✅ **Safety Notifications**: Receive safety alerts
- ❌ **Administrative Access**: No dashboard access
- ❌ **Other Tourist Data**: Cannot view other tourists

---

## 🔌 API ENDPOINTS (Cross-Platform Integration)

### Authentication APIs
```
http://localhost:3001/api/auth/login                   # System Login
http://localhost:3001/api/auth/register                # User Registration
http://localhost:3001/api/auth/logout                  # User Logout
http://localhost:3001/api/auth/refresh                 # Token Refresh
http://localhost:3001/api/auth/verify                  # Email Verification
http://localhost:3001/api/auth/[...nextauth]           # NextAuth Handler
http://localhost:3001/api/auth/google-signin           # Google Authentication
```

### Shared APIs (Role-Based Access)
```
http://localhost:3001/api/shared/alerts                # Cross-Platform Alerts
http://localhost:3001/api/shared/zones                 # Shared Zone Data
http://localhost:3001/api/shared/tourists              # Shared Tourist Data
http://localhost:3001/api/shared/notifications         # System Notifications
```

### Blockchain APIs
```
http://localhost:3001/api/blockchain/generate-identity # Generate Digital Identity
http://localhost:3001/api/blockchain/verify-identity   # Verify Digital Identity
http://localhost:3001/api/blockchain/transaction-status # Transaction Status
http://localhost:3001/api/blockchain/identity-records  # Identity Records
```

---

## 🧪 TESTING & DEVELOPMENT URLs

### Demo & Testing Routes
```
**http://localhost:8001/demo/integration     **            # Mobile-Web Integration Demo
http://localhost:8001/demo/mobile-simulator            # Mobile App Simulator
http://localhost:8001/demo/transitions                 # UI Transition Examples
http://localhost:8001/theme-test-simple                # Theme Testing
http://localhost:8001/css-debug                        # CSS Debug Tools
http://localhost:8001/test-components                  # Component Testing
```

### Development APIs
```
http://localhost:3001/api/websocket                    # WebSocket Connection
http://localhost:3001/api/webhooks/blockchain          # Blockchain Webhooks
http://localhost:3001/api/webhooks/payment             # Payment Webhooks
```

---

## 🔗 WEBSOCKET & REAL-TIME URLS

### Real-Time Communication
```
ws://localhost:3001/api/websocket                      # WebSocket Connection
http://localhost:3001/api/websocket                    # WebSocket HTTP Endpoint
```

---

## 🚀 Quick Access by Role

### Super Admin Quick Links
```
🏠 Dashboard:          http://localhost:8001/dashboard/overview
👑 Admin Panel:        http://localhost:8001/admin
👥 User Management:    http://localhost:8001/dashboard/administration/users
🔧 System Settings:    http://localhost:8001/dashboard/settings/system
📊 Analytics:          http://localhost:8001/dashboard/analytics
```

### Admin Quick Links
```
🏠 Dashboard:          http://localhost:8001/dashboard/overview
👥 Tourists:           http://localhost:8001/dashboard/tourists
🚨 Alerts:             http://localhost:8001/dashboard/alerts
⚙️ User Management:    http://localhost:8001/dashboard/administration/users
🗺️ Zones:              http://localhost:8001/dashboard/zones
```

### Operator Quick Links
```
🏠 Dashboard:          http://localhost:8001/dashboard/overview
👨‍💼 My Profile:         http://localhost:8001/dashboard/operator/profile
👥 My Tourists:        http://localhost:8001/dashboard/operator/assigned-tourists
📋 My Assignments:     http://localhost:8001/dashboard/operator/assignments
📊 My Workload:        http://localhost:8001/dashboard/operator/workload
```

### Viewer Quick Links
```
🏠 Dashboard:          http://localhost:8001/dashboard/overview
👁️ Monitor Tourists:   http://localhost:8001/dashboard/tourists
🚨 Monitor Alerts:     http://localhost:8001/dashboard/alerts
📊 View Analytics:     http://localhost:8001/dashboard/analytics
```

---

## 🛠️ Development Commands

### Start All Services
```bash
# Web Dashboard (Port 8001)
cd web && npm run dev

# Backend API Server (Port 3001)
cd backend && npm run dev

# Mobile App (Port 8080)
cd app-frontend && flutter run -d web-server --web-port 8080
```

### Role-Based Testing Checklist

#### Super Admin Testing
- [ ] Login at http://localhost:8001/login
- [ ] Create new admin user at `/dashboard/administration/users/create`
- [ ] Access system admin panel at `/admin`
- [ ] Deploy blockchain contract via API
- [ ] View system logs at `/admin/logs`

#### Admin Testing
- [ ] Login and access dashboard
- [ ] Create new operator at `/dashboard/administration/users/create`
- [ ] Assign operator to tourists at `/dashboard/administration/operators/assignments`
- [ ] Generate digital IDs at `/dashboard/blockchain/generate`
- [ ] Create safety zones at `/dashboard/zones/create`

#### Operator Testing
- [ ] Login and view operator profile at `/dashboard/operator/profile`
- [ ] Check assigned tourists at `/dashboard/operator/assigned-tourists`
- [ ] View workload at `/dashboard/operator/workload`
- [ ] Create alert for assigned tourist
- [ ] Test mobile integration APIs

#### Viewer Testing
- [ ] Login with read-only access
- [ ] Verify cannot access create/edit forms
- [ ] Monitor real-time alerts
- [ ] View analytics and reports
- [ ] Confirm no administrative access

---

## 📞 Role-Based Support & Troubleshooting

### Missing Functionality Identified:
1. **Operator Assignment System**: Each operator needs to see their unique ID and assigned tourists
2. **Workload Management**: Operators need visibility into their assignment load
3. **Role-Based Navigation**: Dashboard menus should adapt based on user role
4. **Hierarchy Management**: Clear reporting structure and assignment chains

### Implementation Priority:
1. **Operator Profile Pages**: Essential for operational hierarchy
2. **Assignment Management**: Critical for tourist safety
3. **Role-Based UI**: Prevents confusion and unauthorized access
4. **Real-time Assignment Updates**: For dynamic workload distribution

---

*Generated for SIH 2025 Smart Tourist Safety System - Role-Based Routing Architecture*