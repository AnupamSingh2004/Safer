# Smart Tourist Safety Monitoring & Incident Response System

<div align="center">
  <img src="./assets/logo/logo.jpeg" alt="SafeTour Logo" width="150" height="150"/>
  
  [![Flutter](https://img.shields.io/badge/Flutter-3.8.1+-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
  [![Solidity](https://img.shields.io/badge/Solidity-0.8+-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
  [![Hardhat](https://img.shields.io/badge/Hardhat-2.0+-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)](https://hardhat.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](./LICENSE)
</div>

**SafeTour** - A comprehensive AI-powered, blockchain-secured tourist safety platform for Smart India Hackathon 2024, featuring real-time monitoring, digital identity management, and emergency response systems.

## 🎯 Problem Statement Solution

This system addresses the critical need for **Smart Tourist Safety Monitoring & Incident Response** as outlined in SIH 2024. Our solution provides:

- **Digital Tourist ID Generation** via blockchain technology
- **Mobile safety app** with real-time tracking and emergency features  
- **Web dashboard** for tourism departments and police
- **AI-based anomaly detection** for behavioral pattern analysis
- **Multilingual support** for accessibility across diverse regions

## 🏗 Architecture Overview

### Technology Stack

| Component | Technology | Implementation Status |
|-----------|------------|----------------------|
| **Mobile App** | Flutter 3.8.1+ | ✅ Core features implemented |
| **Web Dashboard** | Next.js 14 + TypeScript | ✅ Dashboard with real-time features |
| **Backend API** | Next.js API Routes | ✅ Authentication & core endpoints |
| **Database** | PostgreSQL + Prisma | ✅ Schema designed & migrations ready |
| **Blockchain** | Ethereum/Hardhat + Solidity | ✅ Smart contracts for identity management |
| **Authentication** | NextAuth.js + JWT | ✅ Google OAuth integration |
| **Styling** | Tailwind CSS + shadcn/ui | ✅ Modern responsive design |

### Project Structure

```
sih-project/
├── app-frontend/              # Flutter Mobile Application
│   ├── lib/
│   │   ├── screens/          # 20+ UI screens implemented
│   │   ├── services/         # API & authentication services
│   │   ├── models/           # Data models for user & chat
│   │   └── widgets/          # Reusable UI components
│   ├── android/              # Android platform configuration
│   └── ios/                  # iOS platform configuration
│
├── web/                      # Next.js Web Dashboard
│   ├── src/
│   │   ├── app/             # App router with protected routes
│   │   ├── components/      # Comprehensive UI component library
│   │   │   ├── dashboard/   # Dashboard-specific components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── charts/      # Data visualization components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── services/        # API service layer
│   │   ├── stores/          # State management (Zustand)
│   │   └── types/           # TypeScript type definitions
│
├── backend/                  # Unified Backend Services
│   ├── contracts/           # Solidity smart contracts
│   │   ├── IdentityRegistry.sol
│   │   ├── TouristIdentity.sol
│   │   └── EmergencyLogging.sol
│   ├── src/
│   │   ├── app/api/         # Next.js API routes
│   │   ├── lib/blockchain/  # Web3 integration layer
│   │   ├── services/        # Business logic services
│   │   └── database/        # Schema & migrations
│   └── scripts/             # Deployment & testing scripts
│
└── docs/                    # Technical documentation
```

## 🚀 Key Features Implemented

### 1. Digital Tourist ID System
- ✅ **Blockchain-based Identity Registry** - Smart contracts for secure ID generation
- ✅ **KYC Integration** - Document upload and verification workflow
- ✅ **QR Code Generation** - Digital ID with secure QR representation
- ✅ **Identity Verification** - Tamper-proof blockchain verification

### 2. Mobile Application (Flutter)
- ✅ **User Authentication** - Google OAuth integration
- ✅ **Safety Dashboard** - Real-time safety score and alerts
- ✅ **Emergency Features** - Panic button and emergency contacts
- ✅ **Location Tracking** - GPS integration with geo-fencing
- ✅ **Profile Management** - Tourist profile and preferences
- ✅ **Multilingual Support** - Hindi and English language support
- ✅ **Push Notifications** - Real-time alert system

### 3. Web Dashboard (Next.js)
- ✅ **Administrator Dashboard** - Real-time tourist monitoring
- ✅ **Alert Management** - Comprehensive alert filtering and response
- ✅ **Analytics Dashboard** - Tourist flow and safety analytics
- ✅ **Interactive Maps** - Heat maps and geo-fence visualization
- ✅ **Tourist Management** - Digital ID records and tracking
- ✅ **Blockchain Integration** - Smart contract interaction interface
- ✅ **Real-time Updates** - WebSocket integration for live data

### 4. Blockchain Infrastructure
- ✅ **Smart Contracts** - Identity registry and emergency logging
- ✅ **Web3 Integration** - Ethereum blockchain connectivity
- ✅ **Contract Deployment** - Automated deployment scripts
- ✅ **Identity Management** - Decentralized identity verification
- ✅ **Emergency Logging** - Immutable incident records

### 5. Authentication & Security
- ✅ **Multi-platform Auth** - Unified authentication for web and mobile
- ✅ **JWT Token System** - Secure session management
- ✅ **Role-based Access** - Different access levels for users and admins
- ✅ **Google OAuth** - Social authentication integration
- ✅ **Secure Storage** - Encrypted data storage on mobile

## 📱 Mobile App Features

### Core Screens Implemented
- **Authentication Flow** - Login, registration, user type selection
- **Dashboard** - Safety overview with real-time metrics
- **Profile Management** - User profile and emergency contacts
- **Emergency Features** - Panic button and alert system
- **Tools & Services** - Legal assistance and document management
- **Notifications** - Real-time safety and emergency alerts
- **Settings** - App preferences and security settings

### Technical Implementation
- **State Management** - Provider pattern for state management
- **API Integration** - RESTful API communication with backend
- **Local Storage** - Secure storage for user data and tokens
- **Push Notifications** - Firebase Cloud Messaging integration
- **Maps Integration** - Google Maps for location services

## 🌐 Web Dashboard Features

### Dashboard Modules
- **Overview Dashboard** - Real-time statistics and active alerts
- **Tourist Management** - Complete tourist registry and tracking
- **Alert System** - Alert creation, management, and response
- **Analytics** - Data visualization and reporting tools
- **Blockchain Interface** - Smart contract interaction dashboard
- **Zone Management** - Geo-fence creation and management

### UI Components Library
- **Charts & Visualization** - Interactive charts using Recharts
- **Data Tables** - Advanced filtering and sorting capabilities
- **Form Components** - Comprehensive form handling system
- **Maps Integration** - Interactive maps with real-time data
- **Authentication UI** - Complete auth flow components
- **Theme System** - Dark/light mode with consistent styling

## 🔗 Blockchain Implementation

### Smart Contracts
```solidity
// Key contracts implemented
├── IdentityRegistry.sol     # Tourist identity management
├── TouristIdentity.sol      # Individual tourist records  
├── EmergencyLogging.sol     # Incident logging system
└── IdentityVerification.sol # Verification mechanisms
```

### Web3 Integration
- **Contract Deployment** - Automated deployment with Hardhat
- **Identity Generation** - Blockchain-based ID creation
- **Verification System** - Tamper-proof identity verification
- **Emergency Records** - Immutable incident logging

## 🛠 Development Setup

### Prerequisites
```bash
# Required software versions
Flutter SDK: 3.8.1+
Node.js: 18.0+
PostgreSQL: 13+
Git: 2.0+
```

### Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/AnupamSingh2004/sih-project.git
cd sih-project
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database and API keys in .env
npm run db:migrate
npm run dev
```

#### 3. Web Dashboard Setup  
```bash
cd web
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
# Access at http://localhost:3000
```

#### 4. Mobile App Setup
```bash
cd app-frontend
flutter pub get
flutter run
# Runs on connected device/emulator
```

#### 5. Blockchain Setup
```bash
cd backend
npx hardhat compile
npx hardhat node
# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BLOCKCHAIN_RPC_URL="http://localhost:8545"
```

#### Web (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_BLOCKCHAIN_RPC="http://localhost:8545"
```

#### Mobile (app-frontend/.env)
```env
API_BASE_URL="http://localhost:3000/api"
GOOGLE_MAPS_API_KEY="your-maps-key"
```

## 📊 Database Schema

### Core Tables
- **users** - User authentication and profiles
- **tourist_profiles** - Tourist-specific information
- **digital_ids** - Blockchain identity records  
- **alerts** - Safety alerts and incidents
- **locations** - Location tracking data
- **zones** - Geo-fence definitions
- **emergency_contacts** - Emergency contact information

### Migrations
```sql
-- Available migrations
001_initial_tables.sql           # Core user and profile tables
002_blockchain_integration.sql   # Blockchain identity tables  
003_indexes_and_optimizations.sql # Performance optimizations
```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/verify` - Token verification

### Mobile Endpoints
- `GET /api/mobile/profile` - User profile
- `POST /api/mobile/panic` - Emergency panic button
- `PUT /api/mobile/tracking` - Location updates
- `GET /api/mobile/safety-score` - Safety score calculation

### Dashboard Endpoints
- `GET /api/dashboard/overview` - Dashboard statistics
- `GET /api/dashboard/tourists` - Tourist management
- `GET /api/dashboard/analytics` - Analytics data

### Blockchain Endpoints
- `POST /api/blockchain/generate-identity` - Create digital ID
- `POST /api/blockchain/verify-identity` - Verify digital ID
- `GET /api/blockchain/identity-records` - ID records

## 🚀 Deployment Status

### Current Implementation Status
- ✅ **Mobile App**: Core features implemented, ready for testing
- ✅ **Web Dashboard**: Full administrative interface completed
- ✅ **Authentication**: Multi-platform auth system working
- ✅ **Blockchain**: Smart contracts deployed and functional
- ✅ **Database**: Schema implemented with sample data
- 🚧 **AI Integration**: Basic anomaly detection (in development)
- 🚧 **IoT Features**: Smart wearable integration (planned)

### Deployment Targets
- **Mobile**: Android APK ready for distribution
- **Web**: Vercel deployment configured
- **Backend**: Railway/Render deployment ready
- **Blockchain**: Polygon testnet deployment

## 🎨 UI/UX Highlights

### Design System
- **Modern Interface** - Clean, intuitive design following Material Design
- **Responsive Layout** - Optimized for all screen sizes
- **Dark/Light Themes** - Complete theme system implementation  
- **Accessibility** - WCAG compliance with proper contrast ratios
- **Multilingual** - Hindi and English language support

### Component Library
- **shadcn/ui Components** - Professional UI component library
- **Custom Components** - Specialized dashboard and mobile components
- **Interactive Charts** - Real-time data visualization
- **Maps Integration** - Interactive mapping with real-time updates

## 🏆 Hackathon Achievements

### Technical Excellence
- **Full-stack Implementation** - Complete mobile and web applications
- **Blockchain Integration** - Working smart contracts with Web3 connectivity
- **Real-time Features** - WebSocket integration for live updates
- **Professional UI/UX** - Production-ready user interface design
- **Comprehensive API** - RESTful API with proper authentication

### Innovation Highlights
- **Unified Backend** - Single Next.js backend serving both web and mobile
- **Blockchain Identity** - Tamper-proof digital ID system
- **Multi-platform Auth** - Seamless authentication across platforms
- **Real-time Monitoring** - Live tourist tracking and alert system

## 🤝 Team & Contributions

### Development Team
- **Frontend Development** - Flutter mobile app and Next.js web dashboard
- **Blockchain Development** - Smart contracts and Web3 integration
- **UI/UX Design** - Modern interface design and user experience
- **System Architecture** - Full-stack architecture and database design

### Key Achievements
- **500+ commits** across multiple repositories
- **20+ UI screens** implemented in mobile app
- **15+ dashboard components** for web interface
- **4 smart contracts** deployed and tested
- **Complete authentication** system with OAuth integration

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