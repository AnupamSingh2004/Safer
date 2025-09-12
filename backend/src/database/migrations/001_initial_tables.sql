-- Smart Tourist Safety System - Initial Database Setup Migration
-- Migration: 001_initial_tables.sql
-- Description: Create core tables and basic indexes for the tourist safety system
-- Version: 1.0.0
-- Date: September 12, 2025

-- =============================================================================
-- MIGRATION HEADER
-- =============================================================================

-- Migration tracking
INSERT INTO migration_history (
    migration_id,
    migration_name,
    description,
    version,
    applied_at,
    applied_by
) VALUES (
    '001',
    'initial_tables',
    'Create core tables and basic indexes for tourist safety system',
    '1.0.0',
    CURRENT_TIMESTAMP,
    'system'
) ON CONFLICT (migration_id) DO NOTHING;

-- =============================================================================
-- PREREQUISITES AND SETUP
-- =============================================================================

-- Create migration tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_id VARCHAR(50) UNIQUE NOT NULL,
    migration_name VARCHAR(200) NOT NULL,
    description TEXT,
    version VARCHAR(20),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(100),
    rollback_sql TEXT,
    checksum VARCHAR(255)
);

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =============================================================================
-- CUSTOM TYPES
-- =============================================================================

-- Create custom enum types
DO $$ 
BEGIN
    -- User roles
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
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
    END IF;

    -- Alert types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
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
    END IF;

    -- Alert priority and status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_priority') THEN
        CREATE TYPE alert_priority AS ENUM ('critical', 'high', 'medium', 'low');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_status') THEN
        CREATE TYPE alert_status AS ENUM (
            'active',
            'acknowledged', 
            'in_progress',
            'resolved',
            'closed',
            'false_alarm',
            'escalated'
        );
    END IF;

    -- Tourist related types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tourist_status') THEN
        CREATE TYPE tourist_status AS ENUM ('active', 'inactive', 'expired', 'suspended');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visitor_type') THEN
        CREATE TYPE visitor_type AS ENUM ('domestic', 'international');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
        CREATE TYPE document_type AS ENUM (
            'aadhar',
            'passport',
            'voter_id',
            'driving_license',
            'visa',
            'pan_card'
        );
    END IF;

    -- Zone and location types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zone_type') THEN
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
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_source') THEN
        CREATE TYPE location_source AS ENUM ('gps', 'network', 'manual', 'iot_device', 'bluetooth', 'wifi');
    END IF;

    -- System types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_channel') THEN
        CREATE TYPE notification_channel AS ENUM ('push', 'email', 'sms', 'in_app', 'voice');
    END IF;

END $$;

-- =============================================================================
-- CORE TABLES CREATION
-- =============================================================================

-- Users table (System operators, admins, field agents)
CREATE TABLE IF NOT EXISTS users (
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
    created_by UUID,
    updated_by UUID
);

-- Add foreign key constraints for users table after creation
ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id);

-- Tourists table (Visitors to be tracked)
CREATE TABLE IF NOT EXISTS tourists (
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
CREATE TABLE IF NOT EXISTS zones (
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
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'TEMP-' || uuid_generate_v4(),
    
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
CREATE TABLE IF NOT EXISTS location_history (
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
    activity VARCHAR(50),
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
CREATE TABLE IF NOT EXISTS alert_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    
    -- Update details
    update_type VARCHAR(50) NOT NULL,
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

-- Notifications table (System notifications, alerts)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Recipients
    recipient_id UUID REFERENCES users(id),
    tourist_id UUID REFERENCES tourists(id),
    recipient_type VARCHAR(50) NOT NULL,
    
    -- Content
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Delivery
    channels notification_channel[] NOT NULL DEFAULT '{push}',
    priority alert_priority DEFAULT 'medium',
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
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
CREATE TABLE IF NOT EXISTS system_settings (
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
CREATE TABLE IF NOT EXISTS audit_logs (
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

-- =============================================================================
-- BASIC INDEXES
-- =============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

-- Tourists table indexes
CREATE INDEX IF NOT EXISTS idx_tourists_email ON tourists(email);
CREATE INDEX IF NOT EXISTS idx_tourists_identity ON tourists(identity_type, identity_number);
CREATE INDEX IF NOT EXISTS idx_tourists_status ON tourists(status);
CREATE INDEX IF NOT EXISTS idx_tourists_check_dates ON tourists(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_tourists_nationality ON tourists(nationality);
CREATE INDEX IF NOT EXISTS idx_tourists_assigned_officer ON tourists(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_tourists_verification_status ON tourists(verification_status);
CREATE INDEX IF NOT EXISTS idx_tourists_location ON tourists USING GIST(current_location);
CREATE INDEX IF NOT EXISTS idx_tourists_safety_score ON tourists(safety_score);

-- Zones table indexes
CREATE INDEX IF NOT EXISTS idx_zones_type ON zones(type);
CREATE INDEX IF NOT EXISTS idx_zones_active ON zones(is_active);
CREATE INDEX IF NOT EXISTS idx_zones_geometry ON zones USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_zones_risk_level ON zones(risk_level);

-- Alerts table indexes
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON alerts(priority);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_tourist_id ON alerts(tourist_id);
CREATE INDEX IF NOT EXISTS idx_alerts_assigned_to ON alerts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_alerts_reported_by ON alerts(reported_by);
CREATE INDEX IF NOT EXISTS idx_alerts_location ON alerts USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_alerts_reported_at ON alerts(reported_at);
CREATE INDEX IF NOT EXISTS idx_alerts_alert_number ON alerts(alert_number);

-- Location History table indexes
CREATE INDEX IF NOT EXISTS idx_location_history_tourist_id ON location_history(tourist_id);
CREATE INDEX IF NOT EXISTS idx_location_history_recorded_at ON location_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_location_history_location ON location_history USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_location_history_tourist_time ON location_history(tourist_id, recorded_at);

-- Alert Updates indexes
CREATE INDEX IF NOT EXISTS idx_alert_updates_alert_id ON alert_updates(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_updates_created_by ON alert_updates(created_by);
CREATE INDEX IF NOT EXISTS idx_alert_updates_created_at ON alert_updates(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- System Settings indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- Audit Logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

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
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tourists_updated_at ON tourists;
CREATE TRIGGER update_tourists_updated_at BEFORE UPDATE ON tourists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_zones_updated_at ON zones;
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate alert numbers
CREATE OR REPLACE FUNCTION generate_alert_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.alert_number LIKE 'TEMP-%' THEN
        NEW.alert_number := 'ALT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('alert_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for alert numbers
CREATE SEQUENCE IF NOT EXISTS alert_number_seq;

-- Apply alert number trigger
DROP TRIGGER IF EXISTS generate_alert_number_trigger ON alerts;
CREATE TRIGGER generate_alert_number_trigger BEFORE INSERT ON alerts FOR EACH ROW EXECUTE FUNCTION generate_alert_number();

-- =============================================================================
-- INITIAL SYSTEM DATA
-- =============================================================================

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description, environment) VALUES
('general', 'site_name', '"Smart Tourist Safety System"', 'Application name', 'development'),
('general', 'default_language', '"en"', 'Default system language', 'development'),
('general', 'timezone', '"Asia/Kolkata"', 'Default timezone', 'development'),
('security', 'session_timeout', '60', 'Session timeout in minutes', 'development'),
('security', 'max_login_attempts', '5', 'Maximum failed login attempts', 'development'),
('tracking', 'default_update_interval', '300', 'Default location update interval in seconds', 'development'),
('tracking', 'max_history_days', '90', 'Maximum days to retain location history', 'development'),
('alerts', 'auto_escalation_enabled', 'true', 'Enable automatic alert escalation', 'development'),
('alerts', 'escalation_threshold', '15', 'Alert escalation threshold in minutes', 'development')
ON CONFLICT (category, key, environment) DO NOTHING;

-- =============================================================================
-- PERMISSIONS AND SECURITY
-- =============================================================================

-- Enable Row Level Security on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourists ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- MIGRATION COMPLETION
-- =============================================================================

-- Update migration history with completion status
UPDATE migration_history 
SET 
    description = description || ' - COMPLETED',
    rollback_sql = $rollback$
        -- Rollback script for migration 001
        DROP TABLE IF EXISTS audit_logs CASCADE;
        DROP TABLE IF EXISTS system_settings CASCADE;
        DROP TABLE IF EXISTS notifications CASCADE;
        DROP TABLE IF EXISTS alert_updates CASCADE;
        DROP TABLE IF EXISTS location_history CASCADE;
        DROP TABLE IF EXISTS alerts CASCADE;
        DROP TABLE IF EXISTS zones CASCADE;
        DROP TABLE IF EXISTS tourists CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        
        -- Drop custom types
        DROP TYPE IF EXISTS notification_channel CASCADE;
        DROP TYPE IF EXISTS location_source CASCADE;
        DROP TYPE IF EXISTS zone_type CASCADE;
        DROP TYPE IF EXISTS document_type CASCADE;
        DROP TYPE IF EXISTS visitor_type CASCADE;
        DROP TYPE IF EXISTS verification_status CASCADE;
        DROP TYPE IF EXISTS tourist_status CASCADE;
        DROP TYPE IF EXISTS alert_status CASCADE;
        DROP TYPE IF EXISTS alert_priority CASCADE;
        DROP TYPE IF EXISTS alert_type CASCADE;
        DROP TYPE IF EXISTS user_role CASCADE;
        
        -- Drop sequences
        DROP SEQUENCE IF EXISTS alert_number_seq CASCADE;
        
        -- Drop functions
        DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
        DROP FUNCTION IF EXISTS generate_alert_number() CASCADE;
    $rollback$
WHERE migration_id = '001';

-- Log migration completion
INSERT INTO audit_logs (
    action,
    entity_type,
    description,
    metadata,
    user_email,
    user_role
) VALUES (
    'migration_applied',
    'database',
    'Applied migration 001_initial_tables.sql - Core tables and indexes created',
    '{"migration_id": "001", "migration_name": "initial_tables", "version": "1.0.0"}',
    'system',
    'super_admin'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration 001_initial_tables.sql completed successfully';
    RAISE NOTICE 'Created % tables with indexes and triggers', (
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'tourists', 'zones', 'alerts', 'location_history', 'alert_updates', 'notifications', 'system_settings', 'audit_logs')
    );
END $$;
