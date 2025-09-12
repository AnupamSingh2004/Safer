-- Smart Tourist Safety System - Complete Database Schema
-- PostgreSQL with Supabase optimizations
-- Version: 1.0.0
-- Date: September 12, 2025

-- =============================================================================
-- EXTENSIONS & SETUP
-- =============================================================================

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create custom types
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'tourism_admin', 
    'police_admin',
    'medical_admin',
    'operator',
    'field_agent',
    'viewer',
    'tourist'
);

CREATE TYPE alert_type AS ENUM (
    'critical_emergency',
    'medical_emergency',
    'security_threat',
    'natural_disaster',
    'missing_person',
    'panic_button',
    'accident',
    'violence',
    'geofence_violation',
    'anomaly_detected',
    'suspicious_activity',
    'weather_warning',
    'system_alert',
    'maintenance',
    'information',
    'routine_check'
);

CREATE TYPE alert_priority AS ENUM ('critical', 'high', 'medium', 'low');

CREATE TYPE alert_status AS ENUM (
    'active',
    'acknowledged', 
    'in_progress',
    'resolved',
    'closed',
    'false_alarm',
    'escalated'
);

CREATE TYPE tourist_status AS ENUM ('active', 'inactive', 'expired', 'suspended');

CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');

CREATE TYPE zone_type AS ENUM (
    'geofence',
    'poi',
    'restricted',
    'safe',
    'tourist_spot',
    'emergency',
    'medical',
    'police',
    'transport'
);

CREATE TYPE document_type AS ENUM (
    'aadhar',
    'passport',
    'voter_id',
    'driving_license',
    'visa',
    'pan_card'
);

CREATE TYPE visitor_type AS ENUM ('domestic', 'international');

CREATE TYPE location_source AS ENUM ('gps', 'network', 'manual', 'iot_device', 'bluetooth', 'wifi');

CREATE TYPE notification_channel AS ENUM ('push', 'email', 'sms', 'in_app', 'voice');

CREATE TYPE blockchain_network AS ENUM ('mainnet', 'polygon', 'testnet');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users table (System operators, admins, field agents)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'operator',
    department VARCHAR(100),
    badge_number VARCHAR(50),
    avatar_url TEXT,
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Status and verification
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    backup_codes TEXT[],
    
    -- Permissions and access
    permissions JSONB DEFAULT '[]',
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_data JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Tourists table (Visitors to be tracked)
CREATE TABLE tourists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    nationality VARCHAR(100) NOT NULL,
    photo_url TEXT,
    
    -- Identity Documents
    identity_type document_type NOT NULL,
    identity_number VARCHAR(100) NOT NULL,
    identity_document_url TEXT,
    secondary_document_url TEXT,
    verification_status verification_status DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    -- Travel Information
    visitor_type visitor_type NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    purpose_of_visit VARCHAR(100),
    
    -- Accommodation
    accommodation_name VARCHAR(200),
    accommodation_address TEXT,
    accommodation_phone VARCHAR(20),
    accommodation_coordinates POINT,
    
    -- Emergency Contacts (JSONB for flexibility)
    emergency_contacts JSONB NOT NULL DEFAULT '[]',
    
    -- Medical Information
    medical_info JSONB DEFAULT '{}',
    blood_group VARCHAR(10),
    medical_certificate_url TEXT,
    insurance_details JSONB DEFAULT '{}',
    
    -- Transportation
    transport_info JSONB DEFAULT '{}',
    
    -- Preferences
    preferences JSONB DEFAULT '{}',
    
    -- Digital Identity & Blockchain
    wallet_address VARCHAR(42),
    digital_id_hash VARCHAR(255),
    biometric_hash VARCHAR(255),
    blockchain_verified BOOLEAN DEFAULT false,
    blockchain_tx_hash VARCHAR(66),
    
    -- Safety and Tracking
    current_location POINT,
    last_known_location POINT,
    last_location_update TIMESTAMP WITH TIME ZONE,
    safety_score INTEGER DEFAULT 50 CHECK (safety_score >= 0 AND safety_score <= 100),
    risk_level INTEGER DEFAULT 2 CHECK (risk_level >= 1 AND risk_level <= 5),
    
    -- Status and assignments
    status tourist_status DEFAULT 'active',
    assigned_officer_id UUID REFERENCES users(id),
    tracking_enabled BOOLEAN DEFAULT true,
    location_sharing_enabled BOOLEAN DEFAULT true,
    
    -- Consent and Privacy
    consent_data_processing BOOLEAN NOT NULL DEFAULT false,
    consent_location_tracking BOOLEAN NOT NULL DEFAULT false,
    consent_emergency_sharing BOOLEAN NOT NULL DEFAULT false,
    consent_medical_sharing BOOLEAN DEFAULT false,
    consent_marketing BOOLEAN DEFAULT false,
    
    -- Itinerary and planned activities
    itinerary JSONB DEFAULT '[]',
    planned_zones UUID[] DEFAULT '{}',
    
    -- Audit and metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT check_dates CHECK (check_out_date >= check_in_date),
    CONSTRAINT unique_identity UNIQUE (identity_type, identity_number)
);

-- Zones table (Geofences, POIs, restricted areas)
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type zone_type NOT NULL,
    category VARCHAR(100),
    
    -- Geographic data
    geometry GEOMETRY(GEOMETRY, 4326) NOT NULL,
    center_point POINT,
    radius_meters NUMERIC,
    area_sq_meters NUMERIC,
    
    -- Risk and safety
    risk_level INTEGER DEFAULT 2 CHECK (risk_level >= 1 AND risk_level <= 5),
    safety_score INTEGER DEFAULT 50 CHECK (safety_score >= 0 AND safety_score <= 100),
    
    -- Visual properties
    color VARCHAR(7) DEFAULT '#3B82F6',
    fill_color VARCHAR(7) DEFAULT '#3B82F6',
    stroke_width INTEGER DEFAULT 2,
    opacity NUMERIC(3,2) DEFAULT 0.7,
    icon VARCHAR(100),
    
    -- Metadata and properties
    properties JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Operating schedule
    operating_hours JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    
    -- Rules and alerts
    entry_rules JSONB DEFAULT '[]',
    exit_rules JSONB DEFAULT '[]',
    capacity_limit INTEGER,
    current_occupancy INTEGER DEFAULT 0,
    
    -- Status and assignments
    is_active BOOLEAN DEFAULT true,
    is_monitored BOOLEAN DEFAULT true,
    assigned_officers UUID[] DEFAULT '{}',
    monitoring_level INTEGER DEFAULT 2 CHECK (monitoring_level >= 1 AND monitoring_level <= 5),
    
    -- Contact and emergency info
    contact_info JSONB DEFAULT '{}',
    emergency_procedures TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Alerts table (Incidents, emergencies, notifications)
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated alert ID
    
    -- Basic information
    type alert_type NOT NULL,
    priority alert_priority NOT NULL,
    status alert_status DEFAULT 'active',
    severity INTEGER DEFAULT 2 CHECK (severity >= 1 AND severity <= 5),
    
    -- Content
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    resolution TEXT,
    
    -- Location
    location POINT,
    location_address TEXT,
    location_accuracy NUMERIC,
    location_source location_source DEFAULT 'manual',
    zone_id UUID REFERENCES zones(id),
    
    -- Relationships
    tourist_id UUID REFERENCES tourists(id),
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    assigned_team UUID[] DEFAULT '{}',
    
    -- Timeline
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    response_started_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Response and escalation
    response_time_minutes INTEGER,
    resolution_time_minutes INTEGER,
    escalation_level INTEGER DEFAULT 0,
    escalated_at TIMESTAMP WITH TIME ZONE,
    escalated_to UUID REFERENCES users(id),
    auto_escalated BOOLEAN DEFAULT false,
    
    -- Evidence and attachments
    attachments JSONB DEFAULT '[]',
    evidence_files JSONB DEFAULT '[]',
    witness_statements JSONB DEFAULT '[]',
    photos TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    audio_recordings TEXT[] DEFAULT '{}',
    
    -- Response actions
    response_actions JSONB DEFAULT '[]',
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- External references
    external_case_number VARCHAR(100),
    police_fir_number VARCHAR(100),
    medical_case_number VARCHAR(100),
    insurance_claim_number VARCHAR(100),
    
    -- Analytics and metadata
    source VARCHAR(50) DEFAULT 'admin_panel',
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    impact_assessment JSONB DEFAULT '{}',
    
    -- Notifications sent
    notifications_sent JSONB DEFAULT '[]',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Location History table (GPS tracking data)
CREATE TABLE location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist_id UUID NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    
    -- Location data
    location POINT NOT NULL,
    altitude NUMERIC,
    accuracy NUMERIC,
    heading NUMERIC CHECK (heading >= 0 AND heading <= 360),
    speed NUMERIC CHECK (speed >= 0),
    
    -- Timing
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    server_received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Source and context
    source location_source DEFAULT 'gps',
    device_info JSONB DEFAULT '{}',
    
    -- Activity context
    activity VARCHAR(50), -- walking, driving, stationary, etc.
    activity_confidence NUMERIC(3,2),
    indoors BOOLEAN,
    
    -- Zone analysis (computed fields)
    zones_entered UUID[] DEFAULT '{}',
    zones_exited UUID[] DEFAULT '{}',
    current_zones UUID[] DEFAULT '{}',
    
    -- Safety and risk
    safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
    risk_indicators JSONB DEFAULT '{}',
    anomaly_detected BOOLEAN DEFAULT false,
    anomaly_score NUMERIC(3,2),
    
    -- Verification and quality
    verified BOOLEAN DEFAULT false,
    quality_score NUMERIC(3,2),
    
    -- Emergency context
    is_emergency BOOLEAN DEFAULT false,
    panic_button_pressed BOOLEAN DEFAULT false,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Partitioning helper
    partition_date DATE GENERATED ALWAYS AS (DATE(recorded_at)) STORED
);

-- Alert Updates table (Status changes, notes, actions)
CREATE TABLE alert_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    
    -- Update details
    update_type VARCHAR(50) NOT NULL, -- status_change, note, escalation, assignment, etc.
    old_status alert_status,
    new_status alert_status,
    
    -- Content
    title VARCHAR(200),
    content TEXT NOT NULL,
    
    -- Actions and assignments
    action_taken VARCHAR(200),
    assigned_to UUID REFERENCES users(id),
    assigned_from UUID REFERENCES users(id),
    
    -- Attachments
    attachments JSONB DEFAULT '[]',
    
    -- Timing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    is_internal BOOLEAN DEFAULT false,
    
    -- Notifications
    notify_stakeholders BOOLEAN DEFAULT true,
    notifications_sent JSONB DEFAULT '[]'
);

-- =============================================================================
-- BLOCKCHAIN & DIGITAL IDENTITY TABLES
-- =============================================================================

-- Blockchain Records table (Digital identity on blockchain)
CREATE TABLE blockchain_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference data
    tourist_id UUID NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL, -- identity, verification, update, etc.
    
    -- Blockchain data
    network blockchain_network NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    block_hash VARCHAR(66),
    
    -- Identity data
    identity_hash VARCHAR(255) NOT NULL,
    biometric_hash VARCHAR(255),
    document_hashes JSONB DEFAULT '[]',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    issuer_address VARCHAR(42),
    verifier_address VARCHAR(42),
    
    -- Validity
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    revocation_reason TEXT,
    
    -- Gas and costs
    gas_used BIGINT,
    gas_price BIGINT,
    transaction_fee NUMERIC(20,8),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, failed
    confirmations INTEGER DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT unique_tx_hash UNIQUE (transaction_hash),
    CONSTRAINT check_validity_dates CHECK (valid_until > valid_from)
);

-- Verification Requests table (KYC and identity verification)
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist_id UUID NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    
    -- Request details
    request_type VARCHAR(50) NOT NULL, -- kyc, identity, medical, etc.
    status verification_status DEFAULT 'pending',
    
    -- Documents submitted
    documents JSONB NOT NULL DEFAULT '[]',
    biometric_data JSONB DEFAULT '{}',
    
    -- Verification process
    verification_method VARCHAR(50), -- manual, automated, hybrid
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    verification_score NUMERIC(3,2),
    
    -- AI/ML analysis
    ai_analysis_results JSONB DEFAULT '{}',
    fraud_risk_score NUMERIC(3,2),
    confidence_score NUMERIC(3,2),
    
    -- Timeline
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Rejection details
    rejection_reason TEXT,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES users(id),
    
    -- External verification
    external_verification_id VARCHAR(255),
    external_verification_status VARCHAR(50),
    external_verification_data JSONB DEFAULT '{}',
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =============================================================================
-- SYSTEM & OPERATIONAL TABLES
-- =============================================================================

-- Notifications table (System notifications, alerts)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Recipients
    recipient_id UUID REFERENCES users(id),
    tourist_id UUID REFERENCES tourists(id),
    recipient_type VARCHAR(50) NOT NULL, -- user, tourist, group, broadcast
    
    -- Content
    type VARCHAR(50) NOT NULL, -- alert, system, reminder, update, emergency
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Delivery
    channels notification_channel[] NOT NULL DEFAULT '{push}',
    priority alert_priority DEFAULT 'medium',
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, failed, read
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Attachments and actions
    attachments JSONB DEFAULT '[]',
    action_buttons JSONB DEFAULT '[]',
    deep_link_url TEXT,
    
    -- Context and references
    related_alert_id UUID REFERENCES alerts(id),
    related_zone_id UUID REFERENCES zones(id),
    context_data JSONB DEFAULT '{}',
    
    -- Delivery tracking
    delivery_attempts INTEGER DEFAULT 0,
    delivery_errors JSONB DEFAULT '[]',
    
    -- Personalization
    language VARCHAR(10) DEFAULT 'en',
    localized_content JSONB DEFAULT '{}',
    
    -- Analytics
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE,
    engagement_data JSONB DEFAULT '{}',
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- System Settings table (Configuration management)
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(200) NOT NULL,
    value JSONB NOT NULL,
    data_type VARCHAR(50) NOT NULL DEFAULT 'string',
    
    -- Metadata
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false,
    is_readonly BOOLEAN DEFAULT false,
    validation_schema JSONB,
    
    -- Environment
    environment VARCHAR(50) DEFAULT 'production',
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT unique_setting UNIQUE (category, key, environment)
);

-- Audit Logs table (Complete system audit trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    
    -- User context
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    user_role user_role,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Additional context
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Risk and security
    risk_level INTEGER DEFAULT 1 CHECK (risk_level >= 1 AND risk_level <= 5),
    security_event BOOLEAN DEFAULT false,
    
    -- Timing
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Partitioning helper
    partition_date DATE GENERATED ALWAYS AS (DATE(timestamp)) STORED
);

-- Files table (Document and media storage tracking)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- File details
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(255) NOT NULL,
    
    -- Storage
    storage_provider VARCHAR(50) NOT NULL DEFAULT 'local',
    storage_path TEXT NOT NULL,
    storage_url TEXT,
    
    -- Classification
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    
    -- Relationships
    tourist_id UUID REFERENCES tourists(id),
    alert_id UUID REFERENCES alerts(id),
    uploaded_by UUID REFERENCES users(id),
    
    -- Security
    is_sensitive BOOLEAN DEFAULT false,
    access_level VARCHAR(50) DEFAULT 'private',
    encryption_key VARCHAR(255),
    
    -- Processing
    processing_status VARCHAR(50) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_metadata JSONB DEFAULT '{}',
    
    -- AI analysis
    ai_analysis_status VARCHAR(50) DEFAULT 'pending',
    ai_analysis_results JSONB DEFAULT '{}',
    content_warnings JSONB DEFAULT '[]',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Lifecycle
    expires_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ANALYTICS & REPORTING TABLES
-- =============================================================================

-- Analytics Events table (System usage and behavior tracking)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event details
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    event_category VARCHAR(100),
    
    -- User context
    user_id UUID REFERENCES users(id),
    tourist_id UUID REFERENCES tourists(id),
    session_id VARCHAR(255),
    
    -- Technical context
    ip_address INET,
    user_agent TEXT,
    platform VARCHAR(50),
    device_type VARCHAR(50),
    
    -- Location context
    location POINT,
    zone_id UUID REFERENCES zones(id),
    
    -- Event data
    properties JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    
    -- Timing
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_ms INTEGER,
    
    -- Partitioning helper
    partition_date DATE GENERATED ALWAYS AS (DATE(timestamp)) STORED
);

-- Safety Scores History table (Track safety score changes over time)
CREATE TABLE safety_scores_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist_id UUID NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    
    -- Score data
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    previous_score INTEGER,
    score_change INTEGER,
    
    -- Calculation details
    factors JSONB NOT NULL DEFAULT '{}',
    calculation_method VARCHAR(50) DEFAULT 'standard',
    calculation_version VARCHAR(20) DEFAULT '1.0',
    
    -- Context
    location POINT,
    zone_id UUID REFERENCES zones(id),
    related_alert_id UUID REFERENCES alerts(id),
    
    -- Timing
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    -- Partitioning helper
    partition_date DATE GENERATED ALWAYS AS (DATE(calculated_at)) STORED
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- Tourists table indexes
CREATE INDEX idx_tourists_email ON tourists(email);
CREATE INDEX idx_tourists_identity ON tourists(identity_type, identity_number);
CREATE INDEX idx_tourists_status ON tourists(status);
CREATE INDEX idx_tourists_check_dates ON tourists(check_in_date, check_out_date);
CREATE INDEX idx_tourists_nationality ON tourists(nationality);
CREATE INDEX idx_tourists_assigned_officer ON tourists(assigned_officer_id);
CREATE INDEX idx_tourists_verification_status ON tourists(verification_status);
CREATE INDEX idx_tourists_location ON tourists USING GIST(current_location);
CREATE INDEX idx_tourists_safety_score ON tourists(safety_score);
CREATE INDEX idx_tourists_wallet_address ON tourists(wallet_address);

-- Zones table indexes
CREATE INDEX idx_zones_type ON zones(type);
CREATE INDEX idx_zones_active ON zones(is_active);
CREATE INDEX idx_zones_geometry ON zones USING GIST(geometry);
CREATE INDEX idx_zones_center_point ON zones USING GIST(center_point);
CREATE INDEX idx_zones_risk_level ON zones(risk_level);
CREATE INDEX idx_zones_name_search ON zones USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Alerts table indexes
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_tourist_id ON alerts(tourist_id);
CREATE INDEX idx_alerts_assigned_to ON alerts(assigned_to);
CREATE INDEX idx_alerts_reported_by ON alerts(reported_by);
CREATE INDEX idx_alerts_location ON alerts USING GIST(location);
CREATE INDEX idx_alerts_reported_at ON alerts(reported_at);
CREATE INDEX idx_alerts_alert_number ON alerts(alert_number);
CREATE INDEX idx_alerts_zone_id ON alerts(zone_id);
CREATE INDEX idx_alerts_escalation ON alerts(escalation_level, escalated_at);
CREATE INDEX idx_alerts_search ON alerts USING GIN(to_tsvector('english', title || ' ' || description));

-- Location History table indexes (with partitioning consideration)
CREATE INDEX idx_location_history_tourist_id ON location_history(tourist_id);
CREATE INDEX idx_location_history_recorded_at ON location_history(recorded_at);
CREATE INDEX idx_location_history_location ON location_history USING GIST(location);
CREATE INDEX idx_location_history_tourist_time ON location_history(tourist_id, recorded_at);
CREATE INDEX idx_location_history_source ON location_history(source);
CREATE INDEX idx_location_history_emergency ON location_history(is_emergency);
CREATE INDEX idx_location_history_partition ON location_history(partition_date);
CREATE INDEX idx_location_history_zones ON location_history USING GIN(current_zones);

-- Alert Updates indexes
CREATE INDEX idx_alert_updates_alert_id ON alert_updates(alert_id);
CREATE INDEX idx_alert_updates_created_by ON alert_updates(created_by);
CREATE INDEX idx_alert_updates_created_at ON alert_updates(created_at);
CREATE INDEX idx_alert_updates_type ON alert_updates(update_type);

-- Blockchain Records indexes
CREATE INDEX idx_blockchain_records_tourist_id ON blockchain_records(tourist_id);
CREATE INDEX idx_blockchain_records_tx_hash ON blockchain_records(transaction_hash);
CREATE INDEX idx_blockchain_records_contract ON blockchain_records(contract_address);
CREATE INDEX idx_blockchain_records_network ON blockchain_records(network);
CREATE INDEX idx_blockchain_records_status ON blockchain_records(status);
CREATE INDEX idx_blockchain_records_validity ON blockchain_records(valid_from, valid_until);

-- Verification Requests indexes
CREATE INDEX idx_verification_requests_tourist_id ON verification_requests(tourist_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_verified_by ON verification_requests(verified_by);
CREATE INDEX idx_verification_requests_submitted_at ON verification_requests(submitted_at);

-- Notifications indexes
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_tourist_id ON notifications(tourist_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- System Settings indexes
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_environment ON system_settings(environment);

-- Audit Logs indexes (with partitioning consideration)
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_partition ON audit_logs(partition_date);
CREATE INDEX idx_audit_logs_security ON audit_logs(security_event, risk_level);

-- Files indexes
CREATE INDEX idx_files_tourist_id ON files(tourist_id);
CREATE INDEX idx_files_alert_id ON files(alert_id);
CREATE INDEX idx_files_category ON files(category);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_hash ON files(file_hash);
CREATE INDEX idx_files_created_at ON files(created_at);

-- Analytics Events indexes (with partitioning consideration)
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_tourist_id ON analytics_events(tourist_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_partition ON analytics_events(partition_date);
CREATE INDEX idx_analytics_events_location ON analytics_events USING GIST(location);

-- Safety Scores History indexes
CREATE INDEX idx_safety_scores_tourist_id ON safety_scores_history(tourist_id);
CREATE INDEX idx_safety_scores_calculated_at ON safety_scores_history(calculated_at);
CREATE INDEX idx_safety_scores_tourist_time ON safety_scores_history(tourist_id, calculated_at);
CREATE INDEX idx_safety_scores_partition ON safety_scores_history(partition_date);

-- =============================================================================
-- TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourists_updated_at BEFORE UPDATE ON tourists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blockchain_records_updated_at BEFORE UPDATE ON blockchain_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate alert numbers
CREATE OR REPLACE FUNCTION generate_alert_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.alert_number IS NULL THEN
        NEW.alert_number := 'ALT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('alert_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for alert numbers
CREATE SEQUENCE IF NOT EXISTS alert_number_seq;

-- Apply alert number trigger
CREATE TRIGGER generate_alert_number_trigger BEFORE INSERT ON alerts FOR EACH ROW EXECUTE FUNCTION generate_alert_number();

-- Function to update tourist location and zones
CREATE OR REPLACE FUNCTION update_tourist_location_zones()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current_location in tourists table
    UPDATE tourists 
    SET 
        current_location = NEW.location,
        last_location_update = NEW.recorded_at,
        last_known_location = CASE 
            WHEN OLD.location IS NOT NULL THEN OLD.location 
            ELSE current_location 
        END
    WHERE id = NEW.tourist_id;
    
    -- Find zones that contain this location
    NEW.current_zones := ARRAY(
        SELECT id::text 
        FROM zones 
        WHERE is_active = true 
        AND ST_Contains(geometry, NEW.location)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply location update trigger
CREATE TRIGGER update_tourist_location_zones_trigger 
    BEFORE INSERT ON location_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_tourist_location_zones();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourists ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY users_select_policy ON users FOR SELECT USING (
    auth.uid()::text = id::text OR 
    auth.jwt() ->> 'role' IN ('super_admin', 'tourism_admin', 'police_admin')
);

CREATE POLICY users_update_policy ON users FOR UPDATE USING (
    auth.uid()::text = id::text OR 
    auth.jwt() ->> 'role' IN ('super_admin', 'tourism_admin')
);

-- Tourists RLS policies  
CREATE POLICY tourists_select_policy ON tourists FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'tourism_admin', 'police_admin', 'operator', 'field_agent', 'viewer') OR
    assigned_officer_id::text = auth.uid()::text
);

-- Alerts RLS policies
CREATE POLICY alerts_select_policy ON alerts FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'tourism_admin', 'police_admin', 'operator', 'field_agent', 'viewer') OR
    assigned_to::text = auth.uid()::text OR
    reported_by::text = auth.uid()::text
);

-- Location history RLS policies (most restrictive)
CREATE POLICY location_history_select_policy ON location_history FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'tourism_admin', 'police_admin', 'operator') OR
    EXISTS (
        SELECT 1 FROM tourists 
        WHERE id = tourist_id 
        AND assigned_officer_id::text = auth.uid()::text
    )
);

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description, environment) VALUES
('general', 'site_name', '"Smart Tourist Safety System"', 'Application name', 'production'),
('general', 'default_language', '"en"', 'Default system language', 'production'),
('general', 'timezone', '"Asia/Kolkata"', 'Default timezone', 'production'),
('security', 'session_timeout', '60', 'Session timeout in minutes', 'production'),
('security', 'max_login_attempts', '5', 'Maximum failed login attempts', 'production'),
('tracking', 'default_update_interval', '300', 'Default location update interval in seconds', 'production'),
('tracking', 'max_history_days', '90', 'Maximum days to retain location history', 'production'),
('alerts', 'auto_escalation_enabled', 'true', 'Enable automatic alert escalation', 'production'),
('alerts', 'escalation_threshold', '15', 'Alert escalation threshold in minutes', 'production'),
('blockchain', 'enabled', 'true', 'Enable blockchain features', 'production'),
('blockchain', 'network', '"testnet"', 'Default blockchain network', 'production')
ON CONFLICT (category, key, environment) DO NOTHING;

-- Note: Default admin user creation should be handled through secure deployment scripts
-- with environment-specific credentials. See deployment documentation for admin setup.

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON DATABASE postgres IS 'Smart Tourist Safety System Database - Comprehensive tracking and safety management for tourists';

-- Table comments
COMMENT ON TABLE users IS 'System users including admins, operators, and field agents';
COMMENT ON TABLE tourists IS 'Tourist profiles and tracking information';
COMMENT ON TABLE zones IS 'Geographic zones including geofences, POIs, and restricted areas';
COMMENT ON TABLE alerts IS 'Incident alerts and emergency notifications';
COMMENT ON TABLE location_history IS 'GPS tracking data and location history for tourists';
COMMENT ON TABLE blockchain_records IS 'Blockchain-based digital identity records';
COMMENT ON TABLE verification_requests IS 'KYC and identity verification workflows';
COMMENT ON TABLE notifications IS 'System notifications and alerts';
COMMENT ON TABLE audit_logs IS 'Complete audit trail for all system activities';
COMMENT ON TABLE analytics_events IS 'User behavior and system usage analytics';

-- Column comments for key fields
COMMENT ON COLUMN tourists.safety_score IS 'Calculated safety score from 0-100 based on multiple factors';
COMMENT ON COLUMN zones.geometry IS 'PostGIS geometry for zone boundaries and shapes';
COMMENT ON COLUMN alerts.alert_number IS 'Auto-generated unique alert identifier';
COMMENT ON COLUMN location_history.partition_date IS 'Generated column for table partitioning by date';

-- =============================================================================
-- FINAL OPTIMIZATIONS
-- =============================================================================

-- Analyze tables for query planning
ANALYZE users;
ANALYZE tourists;
ANALYZE zones;
ANALYZE alerts;
ANALYZE location_history;
ANALYZE blockchain_records;
ANALYZE verification_requests;
ANALYZE notifications;
ANALYZE audit_logs;
ANALYZE analytics_events;

-- Vacuum for cleanup
VACUUM ANALYZE;

-- Grant permissions for application user
-- Note: Actual user grants should be managed through environment-specific scripts
