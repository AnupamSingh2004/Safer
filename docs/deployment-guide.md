# 🚀 Smart Tourist Safety System - Deployment Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Blockchain Network Setup](#blockchain-network-setup)
- [Backend Deployment](#backend-deployment)
- [Web Dashboard Deployment](#web-dashboard-deployment)
- [Mobile App Deployment](#mobile-app-deployment)
- [Domain & SSL Configuration](#domain--ssl-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive instructions for deploying the Smart Tourist Safety System across development, staging, and production environments.

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Web Dashboard  │    │  Admin Panel    │
│  (Flutter APK)  │    │   (Next.js)     │    │   (Next.js)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │        Backend API            │
                 │       (Next.js API)           │
                 └───────────────┬───────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│    Database    │    │   Blockchain      │    │   File Storage    │
│   (Supabase)   │    │   (Ethereum)      │    │   (Supabase)      │
└────────────────┘    └───────────────────┘    └───────────────────┘
```

---

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / Windows 10+ / macOS 12+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB available space
- **Network**: Stable internet connection

### Required Software
```bash
# Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker & Docker Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Git
sudo apt-get install git

# Flutter (for mobile development)
snap install flutter --classic

# PM2 (for production process management)
npm install -g pm2
```

### Required Accounts & Services
- ✅ **Supabase Account** - Database & storage
- ✅ **Vercel Account** - Web hosting
- ✅ **Infura/Alchemy** - Ethereum node access
- ✅ **Google Cloud** - Maps API & Firebase
- ✅ **Cloudflare** - CDN & DNS (optional)

---

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/AnupamSingh2004/sih-project.git
cd sih-project
```

### 2. Environment Variables

#### Backend Environment (.env)
```bash
# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/tourist_safety

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001

# Blockchain Configuration
ETHEREUM_NETWORK=mainnet
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_infura_key
PRIVATE_KEY=your_ethereum_private_key
CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# File Upload
UPLOAD_MAX_SIZE=50mb
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=production
PORT=3001
```

#### Web Dashboard Environment (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:8001

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Maps & Location
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_DEFAULT_LAT=28.6139
NEXT_PUBLIC_DEFAULT_LNG=77.2090

# Blockchain
NEXT_PUBLIC_ETHEREUM_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Environment
NODE_ENV=production
PORT=8001
```

---

## Database Setup

### 1. Supabase Setup
```sql
-- Create main tables
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  user_type VARCHAR(50) DEFAULT 'tourist',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create tourists table
CREATE TABLE tourists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  aadhaar_hash VARCHAR(255),
  passport_hash VARCHAR(255),
  current_location JSONB,
  safety_score INTEGER DEFAULT 80,
  digital_id VARCHAR(255),
  emergency_contacts JSONB,
  itinerary JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES tourists(id),
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  location JSONB,
  message TEXT,
  evidence JSONB,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create zones table
CREATE TABLE zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  risk_level VARCHAR(50) DEFAULT 'low',
  geometry JSONB NOT NULL,
  center JSONB,
  radius FLOAT,
  description TEXT,
  safety_info JSONB,
  restrictions JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_tourists_user_id ON tourists(user_id);
CREATE INDEX idx_tourists_status ON tourists(status);
CREATE INDEX idx_alerts_tourist_id ON alerts(tourist_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_zones_type ON zones(type);
CREATE INDEX idx_zones_status ON zones(status);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourists ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
```

### 2. Database Migration
```bash
cd backend
npm run db:migrate
```

### 3. Seed Data
```bash
cd backend
node scripts/seed-data.js
```

---

## Blockchain Network Setup

### 1. Hardhat Configuration
```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    mainnet: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### 2. Deploy Smart Contracts
```bash
cd backend

# For development (local network)
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# For testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# For mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify contracts
npx hardhat run scripts/verify-contracts.js --network mainnet
```

### 3. Contract Verification
```bash
# Verify on Etherscan
npx hardhat verify --network mainnet CONTRACT_ADDRESS "Constructor Args"
```

---

## Backend Deployment

### 1. Local Development
```bash
cd backend
npm install
npm run dev
```

### 2. Production Build
```bash
cd backend
npm install --production
npm run build
```

### 3. PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'tourist-safety-backend',
    script: 'npm',
    args: 'start',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Docker Deployment
```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY backend/ .

# Build application
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -f Dockerfile.backend -t tourist-safety-backend .
docker run -d -p 3001:3001 --env-file .env tourist-safety-backend
```

### 5. Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Configure vercel.json
cat > backend/vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/app/api/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

# Deploy to Vercel
cd backend
vercel --prod
```

---

## Web Dashboard Deployment

### 1. Local Development
```bash
cd web
npm install
npm run dev
```

### 2. Production Build
```bash
cd web
npm install --production
npm run build
npm run start
```

### 3. Static Export (Optional)
```bash
cd web
npm run build
npm run export
```

### 4. Vercel Deployment
```bash
cd web
vercel --prod
```

### 5. Netlify Deployment
```bash
# Build for Netlify
cd web
npm run build

# Create _redirects file for SPA routing
echo "/*    /index.html   200" > out/_redirects

# Deploy to Netlify
# Upload the 'out' folder to Netlify dashboard
```

### 6. Docker Deployment
```dockerfile
# Dockerfile.web
FROM node:18-alpine AS builder

WORKDIR /app
COPY web/package*.json ./
RUN npm ci

COPY web/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

## Mobile App Deployment

### 1. Flutter Build Configuration
```yaml
# pubspec.yaml - Update version
version: 1.0.0+1

# Environment configuration
flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
```

### 2. Android APK Build
```bash
cd app-frontend

# Clean previous builds
flutter clean
flutter pub get

# Build APK for release
flutter build apk --release

# Build App Bundle for Play Store
flutter build appbundle --release

# Generated files location:
# APK: build/app/outputs/flutter-apk/app-release.apk
# Bundle: build/app/outputs/bundle/release/app-release.aab
```

### 3. iOS Build (macOS only)
```bash
cd app-frontend

# Install iOS dependencies
cd ios && pod install && cd ..

# Build for iOS
flutter build ios --release

# Archive for App Store
open ios/Runner.xcworkspace
# Use Xcode to archive and upload
```

### 4. Android Signing
```bash
# Generate keystore
keytool -genkey -v -keystore ~/android-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias tourist-safety-key

# Configure signing in android/app/build.gradle
android {
    signingConfigs {
        release {
            keyAlias 'tourist-safety-key'
            keyPassword 'your_key_password'
            storeFile file('/path/to/android-keystore.jks')
            storePassword 'your_store_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 5. Play Store Deployment
```bash
# Create signed bundle
flutter build appbundle --release

# Upload to Google Play Console
# 1. Go to Google Play Console
# 2. Create new app or select existing
# 3. Upload app-release.aab to Internal Testing
# 4. Fill app details and screenshots
# 5. Submit for review
```

---

## Domain & SSL Configuration

### 1. Domain Setup
```bash
# Example DNS configuration
# A Record: api.tourist-safety.gov.in -> Server IP
# A Record: dashboard.tourist-safety.gov.in -> Server IP
# CNAME: www.tourist-safety.gov.in -> tourist-safety.gov.in
```

### 2. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d tourist-safety.gov.in -d www.tourist-safety.gov.in

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Nginx Configuration
```nginx
# /etc/nginx/sites-available/tourist-safety
server {
    listen 80;
    server_name tourist-safety.gov.in www.tourist-safety.gov.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tourist-safety.gov.in www.tourist-safety.gov.in;

    ssl_certificate /etc/letsencrypt/live/tourist-safety.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tourist-safety.gov.in/privkey.pem;

    # Web Dashboard
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Monitoring & Logging

### 1. Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit

# Configure log rotation
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 2. Health Check Endpoints
```javascript
// Add to backend API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  });
});

app.get('/health/detailed', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    checks: {
      database: 'connected',
      blockchain: 'connected',
      redis: 'connected',
      external_apis: 'operational'
    },
    metrics: {
      memory_usage: process.memoryUsage(),
      cpu_usage: process.cpuUsage(),
      active_connections: 150
    }
  });
});
```

### 3. Logging Configuration
```javascript
// winston.config.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'tourist-safety-api' },
  transports: [
    new winston.transports.File({ 
      filename: './logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: './logs/combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

### 4. Error Tracking (Sentry)
```javascript
// Install Sentry
npm install @sentry/node @sentry/nextjs

// Configure Sentry
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## Backup & Recovery

### 1. Database Backup
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
BACKUP_FILE="tourist_safety_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup Supabase database
pg_dump $DATABASE_URL > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Database backup completed: $BACKUP_FILE.gz"
```

### 2. Application Code Backup
```bash
#!/bin/bash
# backup-application.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/application"
APP_DIR="/var/www/tourist-safety"

# Create backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz $APP_DIR

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Application backup completed: app_backup_$DATE.tar.gz"
```

### 3. Automated Backup Cron
```bash
# Add to crontab
sudo crontab -e

# Daily database backup at 2 AM
0 2 * * * /path/to/backup-database.sh

# Weekly application backup on Sunday at 3 AM
0 3 * * 0 /path/to/backup-application.sh
```

### 4. Recovery Procedures
```bash
# Database Recovery
gunzip tourist_safety_backup_YYYYMMDD_HHMMSS.sql.gz
psql $DATABASE_URL < tourist_safety_backup_YYYYMMDD_HHMMSS.sql

# Application Recovery
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/
sudo systemctl restart nginx
pm2 restart all
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Backend API Not Starting
```bash
# Check logs
pm2 logs tourist-safety-backend

# Common fixes:
# - Check environment variables
# - Verify database connection
# - Check port availability
sudo netstat -tulpn | grep :3001

# Restart services
pm2 restart tourist-safety-backend
```

#### 2. Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Supabase status
curl -I https://your-project.supabase.co/rest/v1/

# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### 3. Blockchain Connection Issues
```bash
# Test Ethereum connection
curl -X POST $ETHEREUM_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check contract deployment
npx hardhat run scripts/verify-deployment.js --network mainnet
```

#### 4. Mobile App Build Issues
```bash
# Clear Flutter cache
flutter clean
flutter pub get

# Check Flutter doctor
flutter doctor

# Common Android issues:
cd android && ./gradlew clean && cd ..
```

#### 5. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Performance Issues
```bash
# Check system resources
htop
df -h
free -m

# Check application performance
pm2 monit

# Check database performance
# Run EXPLAIN ANALYZE on slow queries
```

### Emergency Procedures

#### 1. System Rollback
```bash
# Stop current version
pm2 stop all

# Deploy previous version
git checkout previous-release-tag
npm install
npm run build
pm2 start ecosystem.config.js
```

#### 2. Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < /backups/database/tourist_safety_backup_YYYYMMDD.sql
```

#### 3. Emergency Maintenance Mode
```nginx
# Add to nginx configuration
if (-f /var/www/maintenance.html) {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    root /var/www;
    rewrite ^(.*)$ /maintenance.html break;
}
```

### Support Contacts

- **DevOps Team**: devops@tourist-safety.gov.in
- **Database Admin**: dba@tourist-safety.gov.in
- **Security Team**: security@tourist-safety.gov.in
- **Emergency Hotline**: +91-XXX-XXX-XXXX

---

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] Smart contracts deployed and verified
- [ ] SSL certificates installed
- [ ] Backup procedures tested
- [ ] Monitoring configured

### Deployment
- [ ] Backend API deployed and tested
- [ ] Web dashboard deployed and tested
- [ ] Mobile app built and tested
- [ ] DNS records updated
- [ ] Load balancer configured
- [ ] CDN configured (if applicable)

### Post-deployment
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup schedules active
- [ ] Performance baselines established
- [ ] Security scans completed
- [ ] User acceptance testing completed

---

*Last Updated: January 15, 2025*
*Deployment Guide Version: 1.0.0*
