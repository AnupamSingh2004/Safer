-- Smart Tourist Safety System - Blockchain Integration Migration
-- Migration: 002_blockchain_integration.sql
-- Description: Add blockchain and digital identity tables with smart contract integration
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
    '002',
    'blockchain_integration',
    'Add blockchain and digital identity tables with smart contract integration',
    '1.0.0',
    CURRENT_TIMESTAMP,
    'system'
) ON CONFLICT (migration_id) DO NOTHING;

-- =============================================================================
-- BLOCKCHAIN SPECIFIC TYPES
-- =============================================================================

DO $$ 
BEGIN
    -- Blockchain network types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blockchain_network') THEN
        CREATE TYPE blockchain_network AS ENUM ('mainnet', 'polygon', 'testnet');
    END IF;

    -- Smart contract types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_type') THEN
        CREATE TYPE contract_type AS ENUM (
            'identity_registry',
            'identity_verification', 
            'tourist_identity',
            'emergency_logging',
            'zone_verification',
            'reputation_system'
        );
    END IF;

    -- Blockchain transaction status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blockchain_status') THEN
        CREATE TYPE blockchain_status AS ENUM (
            'pending',
            'confirming',
            'confirmed',
            'failed',
            'reverted',
            'cancelled'
        );
    END IF;

    -- Digital identity verification methods
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_method') THEN
        CREATE TYPE verification_method AS ENUM (
            'manual',
            'automated',
            'hybrid',
            'biometric',
            'document_scan',
            'video_call',
            'third_party_api'
        );
    END IF;

END $$;

-- =============================================================================
-- BLOCKCHAIN TABLES
-- =============================================================================

-- Blockchain Records table (Digital identity on blockchain)
CREATE TABLE IF NOT EXISTS blockchain_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference data
    tourist_id UUID NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL, -- identity, verification, update, emergency, etc.
    
    -- Blockchain data
    network blockchain_network NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    contract_type contract_type,
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    block_hash VARCHAR(66),
    
    -- Identity data
    identity_hash VARCHAR(255) NOT NULL,
    biometric_hash VARCHAR(255),
    document_hashes JSONB DEFAULT '[]',
    
    -- Smart contract function data
    function_name VARCHAR(100),
    function_params JSONB DEFAULT '{}',
    function_result JSONB DEFAULT '{}',
    
    -- Metadata and additional data
    metadata JSONB DEFAULT '{}',
    issuer_address VARCHAR(42),
    verifier_address VARCHAR(42),
    
    -- Validity and lifecycle
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    revocation_reason TEXT,
    revocation_tx_hash VARCHAR(66),
    
    -- Gas and transaction costs
    gas_used BIGINT,
    gas_price BIGINT,
    transaction_fee NUMERIC(20,8),
    transaction_fee_usd NUMERIC(10,2),
    
    -- Status and confirmations
    status blockchain_status DEFAULT 'pending',
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 12,
    
    -- Event logs and receipt data
    event_logs JSONB DEFAULT '[]',
    transaction_receipt JSONB DEFAULT '{}',
    
    -- Retry and error handling
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance metrics
    processing_time_ms INTEGER,
    network_latency_ms INTEGER,
    
    -- Audit and tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT unique_tx_hash UNIQUE (transaction_hash),
    CONSTRAINT check_validity_dates CHECK (valid_until IS NULL OR valid_until > valid_from),
    CONSTRAINT check_gas_values CHECK (gas_used >= 0 AND gas_price >= 0),
    CONSTRAINT check_confirmations CHECK (confirmations >= 0 AND required_confirmations > 0)
);

-- Verification Requests table (Enhanced KYC and identity verification)
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist_id UUID NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    
    -- Request details
    request_type VARCHAR(50) NOT NULL, -- kyc, identity, medical, travel, emergency_contact
    status verification_status DEFAULT 'pending',
    priority alert_priority DEFAULT 'medium',
    
    -- Documents and data submitted
    documents JSONB NOT NULL DEFAULT '[]',
    biometric_data JSONB DEFAULT '{}',
    additional_data JSONB DEFAULT '{}',
    
    -- Verification process
    verification_method verification_method DEFAULT 'manual',
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    verification_score NUMERIC(3,2),
    confidence_level NUMERIC(3,2),
    
    -- AI/ML analysis results
    ai_analysis_results JSONB DEFAULT '{}',
    fraud_risk_score NUMERIC(3,2),
    document_quality_score NUMERIC(3,2),
    face_match_score NUMERIC(3,2),
    liveness_score NUMERIC(3,2),
    
    -- Blockchain integration
    blockchain_record_id UUID REFERENCES blockchain_records(id),
    identity_hash VARCHAR(255),
    verification_hash VARCHAR(255),
    
    -- Timeline and SLA
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Rejection and appeals
    rejection_reason TEXT,
    rejection_category VARCHAR(100),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES users(id),
    appeal_submitted BOOLEAN DEFAULT false,
    appeal_details JSONB DEFAULT '{}',
    
    -- External verification services
    external_verification_id VARCHAR(255),
    external_verification_provider VARCHAR(100),
    external_verification_status VARCHAR(50),
    external_verification_data JSONB DEFAULT '{}',
    external_verification_cost NUMERIC(10,2),
    
    -- Quality assurance
    qa_required BOOLEAN DEFAULT false,
    qa_completed BOOLEAN DEFAULT false,
    qa_reviewer_id UUID REFERENCES users(id),
    qa_notes TEXT,
    qa_score NUMERIC(3,2),
    
    -- Compliance and regulations
    compliance_checks JSONB DEFAULT '{}',
    regulatory_flags JSONB DEFAULT '[]',
    sanctions_check_status VARCHAR(50),
    sanctions_check_results JSONB DEFAULT '{}',
    
    -- Communication and notifications
    notifications_sent JSONB DEFAULT '[]',
    communication_log JSONB DEFAULT '[]',
    
    -- Audit and metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Smart Contracts table (Track deployed contracts and their status)
CREATE TABLE IF NOT EXISTS smart_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contract identification
    name VARCHAR(200) NOT NULL,
    contract_type contract_type NOT NULL,
    version VARCHAR(20) NOT NULL,
    
    -- Deployment details
    network blockchain_network NOT NULL,
    contract_address VARCHAR(42) UNIQUE NOT NULL,
    deployment_tx_hash VARCHAR(66) NOT NULL,
    deployer_address VARCHAR(42) NOT NULL,
    deployed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    deployed_by UUID REFERENCES users(id),
    
    -- Contract source and ABI
    source_code TEXT,
    bytecode TEXT,
    abi JSONB NOT NULL,
    compiler_version VARCHAR(50),
    optimization_enabled BOOLEAN DEFAULT true,
    optimization_runs INTEGER DEFAULT 200,
    
    -- Status and verification
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_source VARCHAR(100), -- etherscan, sourcify, etc.
    verification_status VARCHAR(50),
    
    -- Gas and costs
    deployment_gas_used BIGINT,
    deployment_gas_price BIGINT,
    deployment_cost NUMERIC(20,8),
    deployment_cost_usd NUMERIC(10,2),
    
    -- Upgrade and proxy information
    is_upgradeable BOOLEAN DEFAULT false,
    proxy_address VARCHAR(42),
    implementation_address VARCHAR(42),
    admin_address VARCHAR(42),
    upgrade_history JSONB DEFAULT '[]',
    
    -- Security and audits
    security_audits JSONB DEFAULT '[]',
    known_vulnerabilities JSONB DEFAULT '[]',
    last_security_scan TIMESTAMP WITH TIME ZONE,
    security_score INTEGER CHECK (security_score >= 0 AND security_score <= 100),
    
    -- Usage statistics
    total_transactions BIGINT DEFAULT 0,
    total_gas_used BIGINT DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE,
    
    -- Configuration and parameters
    configuration JSONB DEFAULT '{}',
    parameters JSONB DEFAULT '{}',
    
    -- Monitoring and alerts
    monitoring_enabled BOOLEAN DEFAULT true,
    alert_thresholds JSONB DEFAULT '{}',
    
    -- Documentation and metadata
    description TEXT,
    documentation_url TEXT,
    repository_url TEXT,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Blockchain Transactions table (Track all blockchain interactions)
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Transaction identification
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number BIGINT,
    block_hash VARCHAR(66),
    transaction_index INTEGER,
    
    -- Network and contract
    network blockchain_network NOT NULL,
    contract_address VARCHAR(42),
    contract_id UUID REFERENCES smart_contracts(id),
    
    -- Transaction details
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    value NUMERIC(30,18) DEFAULT 0,
    gas_limit BIGINT NOT NULL,
    gas_used BIGINT,
    gas_price BIGINT,
    gas_price_gwei NUMERIC(10,2),
    
    -- Function call details
    function_name VARCHAR(100),
    function_signature VARCHAR(10),
    input_data TEXT,
    decoded_input JSONB DEFAULT '{}',
    
    -- Transaction status and confirmation
    status blockchain_status NOT NULL,
    confirmations INTEGER DEFAULT 0,
    confirmation_timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Error handling
    error_message TEXT,
    revert_reason TEXT,
    
    -- Event logs and receipts
    logs JSONB DEFAULT '[]',
    decoded_logs JSONB DEFAULT '[]',
    receipt JSONB DEFAULT '{}',
    
    -- Related entities
    tourist_id UUID REFERENCES tourists(id),
    alert_id UUID REFERENCES alerts(id),
    verification_request_id UUID REFERENCES verification_requests(id),
    blockchain_record_id UUID REFERENCES blockchain_records(id),
    
    -- Timing and performance
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mined_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    
    -- Cost analysis
    transaction_fee NUMERIC(20,8),
    transaction_fee_usd NUMERIC(10,2),
    
    -- Metadata and context
    context JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    initiated_by UUID REFERENCES users(id),
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Digital Identity Profiles table (Comprehensive digital identity management)
CREATE TABLE IF NOT EXISTS digital_identity_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist_id UUID UNIQUE NOT NULL REFERENCES tourists(id) ON DELETE CASCADE,
    
    -- Core identity data
    identity_hash VARCHAR(255) UNIQUE NOT NULL,
    public_key TEXT,
    wallet_address VARCHAR(42),
    
    -- Biometric hashes (privacy-preserving)
    face_hash VARCHAR(255),
    fingerprint_hash VARCHAR(255),
    voice_hash VARCHAR(255),
    iris_hash VARCHAR(255),
    
    -- Document verification hashes
    primary_document_hash VARCHAR(255),
    secondary_document_hash VARCHAR(255),
    additional_document_hashes JSONB DEFAULT '[]',
    
    -- Blockchain presence
    blockchain_records UUID[] DEFAULT '{}',
    primary_blockchain_record UUID REFERENCES blockchain_records(id),
    verification_level INTEGER DEFAULT 1 CHECK (verification_level >= 1 AND verification_level <= 5),
    
    -- Trust and reputation
    trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    reputation_score INTEGER DEFAULT 50 CHECK (reputation_score >= 0 AND reputation_score <= 100),
    verification_count INTEGER DEFAULT 0,
    successful_verifications INTEGER DEFAULT 0,
    
    -- Privacy settings
    privacy_level INTEGER DEFAULT 3 CHECK (privacy_level >= 1 AND privacy_level <= 5),
    data_sharing_consent JSONB DEFAULT '{}',
    anonymization_level INTEGER DEFAULT 2 CHECK (anonymization_level >= 1 AND anonymization_level <= 5),
    
    -- Compliance and regulatory
    kyc_completed BOOLEAN DEFAULT false,
    kyc_level INTEGER DEFAULT 1 CHECK (kyc_level >= 1 AND kyc_level <= 3),
    aml_checked BOOLEAN DEFAULT false,
    sanctions_cleared BOOLEAN DEFAULT false,
    regulatory_compliance JSONB DEFAULT '{}',
    
    -- Security features
    multi_factor_enabled BOOLEAN DEFAULT false,
    biometric_enabled BOOLEAN DEFAULT false,
    hardware_key_enrolled BOOLEAN DEFAULT false,
    security_keys JSONB DEFAULT '[]',
    
    -- Activity and usage
    last_verification TIMESTAMP WITH TIME ZONE,
    last_blockchain_update TIMESTAMP WITH TIME ZONE,
    verification_frequency INTEGER DEFAULT 0,
    
    -- Risk assessment
    risk_factors JSONB DEFAULT '[]',
    fraud_indicators JSONB DEFAULT '[]',
    anomaly_score NUMERIC(3,2) DEFAULT 0.0,
    
    -- External integrations
    external_verifications JSONB DEFAULT '{}',
    third_party_scores JSONB DEFAULT '{}',
    
    -- Lifecycle management
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_renewed TIMESTAMP WITH TIME ZONE,
    renewal_required BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_suspended BOOLEAN DEFAULT false,
    suspension_reason TEXT,
    suspended_at TIMESTAMP WITH TIME ZONE,
    suspended_by UUID REFERENCES users(id),
    
    -- Audit
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =============================================================================
-- BLOCKCHAIN SPECIFIC INDEXES
-- =============================================================================

-- Blockchain Records indexes
CREATE INDEX IF NOT EXISTS idx_blockchain_records_tourist_id ON blockchain_records(tourist_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_tx_hash ON blockchain_records(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_contract ON blockchain_records(contract_address);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_network ON blockchain_records(network);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_status ON blockchain_records(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_validity ON blockchain_records(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_block ON blockchain_records(block_number);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_identity_hash ON blockchain_records(identity_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_type ON blockchain_records(record_type);

-- Verification Requests indexes
CREATE INDEX IF NOT EXISTS idx_verification_requests_tourist_id ON verification_requests(tourist_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_verified_by ON verification_requests(verified_by);
CREATE INDEX IF NOT EXISTS idx_verification_requests_submitted_at ON verification_requests(submitted_at);
CREATE INDEX IF NOT EXISTS idx_verification_requests_method ON verification_requests(verification_method);
CREATE INDEX IF NOT EXISTS idx_verification_requests_type ON verification_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_verification_requests_blockchain ON verification_requests(blockchain_record_id);

-- Smart Contracts indexes
CREATE INDEX IF NOT EXISTS idx_smart_contracts_address ON smart_contracts(contract_address);
CREATE INDEX IF NOT EXISTS idx_smart_contracts_network ON smart_contracts(network);
CREATE INDEX IF NOT EXISTS idx_smart_contracts_type ON smart_contracts(contract_type);
CREATE INDEX IF NOT EXISTS idx_smart_contracts_active ON smart_contracts(is_active);
CREATE INDEX IF NOT EXISTS idx_smart_contracts_deployment ON smart_contracts(deployed_at);
CREATE INDEX IF NOT EXISTS idx_smart_contracts_deployer ON smart_contracts(deployer_address);

-- Blockchain Transactions indexes
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_hash ON blockchain_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_block ON blockchain_transactions(block_number);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_network ON blockchain_transactions(network);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_contract ON blockchain_transactions(contract_address);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_from ON blockchain_transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_to ON blockchain_transactions(to_address);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_status ON blockchain_transactions(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_tourist ON blockchain_transactions(tourist_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_submitted ON blockchain_transactions(submitted_at);

-- Digital Identity Profiles indexes
CREATE INDEX IF NOT EXISTS idx_digital_identity_tourist_id ON digital_identity_profiles(tourist_id);
CREATE INDEX IF NOT EXISTS idx_digital_identity_hash ON digital_identity_profiles(identity_hash);
CREATE INDEX IF NOT EXISTS idx_digital_identity_wallet ON digital_identity_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_digital_identity_trust_score ON digital_identity_profiles(trust_score);
CREATE INDEX IF NOT EXISTS idx_digital_identity_verification_level ON digital_identity_profiles(verification_level);
CREATE INDEX IF NOT EXISTS idx_digital_identity_kyc ON digital_identity_profiles(kyc_completed);
CREATE INDEX IF NOT EXISTS idx_digital_identity_active ON digital_identity_profiles(is_active);

-- =============================================================================
-- BLOCKCHAIN SPECIFIC TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update digital identity profile when blockchain record is created
CREATE OR REPLACE FUNCTION update_digital_identity_on_blockchain_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or create digital identity profile
    INSERT INTO digital_identity_profiles (
        tourist_id,
        identity_hash,
        wallet_address,
        primary_blockchain_record,
        blockchain_records,
        last_blockchain_update,
        verification_count
    )
    SELECT 
        NEW.tourist_id,
        NEW.identity_hash,
        t.wallet_address,
        NEW.id,
        ARRAY[NEW.id],
        CURRENT_TIMESTAMP,
        1
    FROM tourists t
    WHERE t.id = NEW.tourist_id
    ON CONFLICT (tourist_id) DO UPDATE SET
        identity_hash = CASE 
            WHEN NEW.record_type = 'identity' THEN NEW.identity_hash 
            ELSE digital_identity_profiles.identity_hash 
        END,
        blockchain_records = array_append(digital_identity_profiles.blockchain_records, NEW.id),
        last_blockchain_update = CURRENT_TIMESTAMP,
        verification_count = digital_identity_profiles.verification_count + 1,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply digital identity update trigger
DROP TRIGGER IF EXISTS update_digital_identity_trigger ON blockchain_records;
CREATE TRIGGER update_digital_identity_trigger 
    AFTER INSERT ON blockchain_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_digital_identity_on_blockchain_record();

-- Function to update tourist blockchain status
CREATE OR REPLACE FUNCTION update_tourist_blockchain_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update tourist blockchain verification status
    UPDATE tourists 
    SET 
        blockchain_verified = CASE 
            WHEN NEW.status = 'confirmed' AND NEW.record_type = 'identity' THEN true
            ELSE blockchain_verified
        END,
        digital_id_hash = CASE 
            WHEN NEW.record_type = 'identity' THEN NEW.identity_hash
            ELSE digital_id_hash
        END,
        wallet_address = CASE 
            WHEN NEW.issuer_address IS NOT NULL THEN NEW.issuer_address
            ELSE wallet_address
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.tourist_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply tourist blockchain status update trigger
DROP TRIGGER IF EXISTS update_tourist_blockchain_trigger ON blockchain_records;
CREATE TRIGGER update_tourist_blockchain_trigger 
    AFTER UPDATE OF status ON blockchain_records 
    FOR EACH ROW 
    WHEN (NEW.status IS DISTINCT FROM OLD.status)
    EXECUTE FUNCTION update_tourist_blockchain_status();

-- Function to track blockchain transaction performance
CREATE OR REPLACE FUNCTION track_blockchain_performance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update processing time when transaction is mined
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        NEW.processing_time_ms := EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - NEW.submitted_at)) * 1000;
        NEW.mined_at := CURRENT_TIMESTAMP;
    END IF;
    
    -- Update smart contract statistics
    IF NEW.contract_id IS NOT NULL AND NEW.status = 'confirmed' THEN
        UPDATE smart_contracts 
        SET 
            total_transactions = total_transactions + 1,
            total_gas_used = total_gas_used + COALESCE(NEW.gas_used, 0),
            last_interaction = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.contract_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply blockchain performance tracking trigger
DROP TRIGGER IF EXISTS track_blockchain_performance_trigger ON blockchain_transactions;
CREATE TRIGGER track_blockchain_performance_trigger 
    BEFORE UPDATE ON blockchain_transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION track_blockchain_performance();

-- =============================================================================
-- BLOCKCHAIN DATA AND CONFIGURATION
-- =============================================================================

-- Insert default smart contract configurations
INSERT INTO system_settings (category, key, value, description, environment) VALUES
('blockchain', 'enabled', 'true', 'Enable blockchain features', 'development'),
('blockchain', 'network', '"testnet"', 'Default blockchain network', 'development'),
('blockchain', 'gas_limit', '500000', 'Default gas limit for transactions', 'development'),
('blockchain', 'gas_price', '20000000000', 'Default gas price in wei', 'development'),
('blockchain', 'confirmation_blocks', '12', 'Required confirmation blocks', 'development'),
('blockchain', 'identity_contract_address', '"0x5FbDB2315678afecb367f032d93F642f64180aa3"', 'Tourist Identity Contract Address', 'development'),
('blockchain', 'registry_contract_address', '"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"', 'Identity Registry Contract Address', 'development'),
('blockchain', 'verification_contract_address', '"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"', 'Identity Verification Contract Address', 'development'),
('verification', 'auto_verify_threshold', '0.85', 'Automatic verification confidence threshold', 'development'),
('verification', 'manual_review_threshold', '0.7', 'Manual review requirement threshold', 'development'),
('verification', 'fraud_risk_threshold', '0.3', 'Fraud risk alert threshold', 'development'),
('verification', 'biometric_match_threshold', '0.9', 'Biometric matching threshold', 'development')
ON CONFLICT (category, key, environment) DO NOTHING;

-- Insert sample smart contracts (for development)
INSERT INTO smart_contracts (
    name,
    contract_type,
    version,
    network,
    contract_address,
    deployment_tx_hash,
    deployer_address,
    deployed_at,
    abi,
    is_active,
    description
) VALUES 
(
    'Tourist Identity Contract',
    'tourist_identity',
    '1.0.0',
    'testnet',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0x096BCE976Eb62286328abFf88c24a1eEe3a8d0ED',
    CURRENT_TIMESTAMP,
    '[]'::jsonb,
    true,
    'Main contract for managing tourist digital identities'
),
(
    'Identity Registry Contract',
    'identity_registry',
    '1.0.0',
    'testnet',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    '0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef1',
    '0x096BCE976Eb62286328abFf88c24a1eEe3a8d0ED',
    CURRENT_TIMESTAMP,
    '[]'::jsonb,
    true,
    'Registry for all verified digital identities'
),
(
    'Identity Verification Contract',
    'identity_verification',
    '1.0.0',
    'testnet',
    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    '0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef12',
    '0x096BCE976Eb62286328abFf88c24a1eEe3a8d0ED',
    CURRENT_TIMESTAMP,
    '[]'::jsonb,
    true,
    'Contract for verification workflows and attestations'
)
ON CONFLICT (contract_address) DO NOTHING;

-- =============================================================================
-- ADD BLOCKCHAIN FIELDS TO EXISTING TABLES
-- =============================================================================

-- Add blockchain-related fields to tourists table
DO $$
BEGIN
    -- Add wallet_address if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tourists' AND column_name = 'wallet_address') THEN
        ALTER TABLE tourists ADD COLUMN wallet_address VARCHAR(42);
        CREATE INDEX IF NOT EXISTS idx_tourists_wallet_address ON tourists(wallet_address);
    END IF;
    
    -- Add digital_id_hash if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tourists' AND column_name = 'digital_id_hash') THEN
        ALTER TABLE tourists ADD COLUMN digital_id_hash VARCHAR(255);
    END IF;
    
    -- Add biometric_hash if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tourists' AND column_name = 'biometric_hash') THEN
        ALTER TABLE tourists ADD COLUMN biometric_hash VARCHAR(255);
    END IF;
    
    -- Add blockchain_verified if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tourists' AND column_name = 'blockchain_verified') THEN
        ALTER TABLE tourists ADD COLUMN blockchain_verified BOOLEAN DEFAULT false;
    END IF;
    
    -- Add blockchain_tx_hash if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tourists' AND column_name = 'blockchain_tx_hash') THEN
        ALTER TABLE tourists ADD COLUMN blockchain_tx_hash VARCHAR(66);
    END IF;
END $$;

-- =============================================================================
-- APPLY UPDATED_AT TRIGGERS TO NEW TABLES
-- =============================================================================

-- Apply updated_at trigger to new blockchain tables
DROP TRIGGER IF EXISTS update_blockchain_records_updated_at ON blockchain_records;
CREATE TRIGGER update_blockchain_records_updated_at BEFORE UPDATE ON blockchain_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_verification_requests_updated_at ON verification_requests;
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_smart_contracts_updated_at ON smart_contracts;
CREATE TRIGGER update_smart_contracts_updated_at BEFORE UPDATE ON smart_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blockchain_transactions_updated_at ON blockchain_transactions;
CREATE TRIGGER update_blockchain_transactions_updated_at BEFORE UPDATE ON blockchain_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_digital_identity_profiles_updated_at ON digital_identity_profiles;
CREATE TRIGGER update_digital_identity_profiles_updated_at BEFORE UPDATE ON digital_identity_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ADDITIONAL SUPPORTING TABLES
-- =============================================================================

-- Files table enhancement for blockchain documents
DO $$
BEGIN
    -- Add blockchain_hash if it doesn't exist in files table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'blockchain_hash') THEN
            ALTER TABLE files ADD COLUMN blockchain_hash VARCHAR(255);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'blockchain_verified') THEN
            ALTER TABLE files ADD COLUMN blockchain_verified BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'verification_request_id') THEN
            ALTER TABLE files ADD COLUMN verification_request_id UUID REFERENCES verification_requests(id);
        END IF;
    END IF;
END $$;

-- Analytics Events enhancement for blockchain events
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'blockchain_tx_hash') THEN
            ALTER TABLE analytics_events ADD COLUMN blockchain_tx_hash VARCHAR(66);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'smart_contract_id') THEN
            ALTER TABLE analytics_events ADD COLUMN smart_contract_id UUID REFERENCES smart_contracts(id);
        END IF;
    END IF;
END $$;

-- =============================================================================
-- BLOCKCHAIN SPECIFIC VIEWS
-- =============================================================================

-- View for tourist blockchain status
CREATE OR REPLACE VIEW tourist_blockchain_status AS
SELECT 
    t.id,
    t.first_name,
    t.last_name,
    t.email,
    t.wallet_address,
    t.blockchain_verified,
    t.digital_id_hash,
    dip.trust_score,
    dip.verification_level,
    dip.kyc_completed,
    COUNT(br.id) as blockchain_records_count,
    COUNT(CASE WHEN br.status = 'confirmed' THEN 1 END) as confirmed_records,
    MAX(br.created_at) as last_blockchain_activity
FROM tourists t
LEFT JOIN digital_identity_profiles dip ON t.id = dip.tourist_id
LEFT JOIN blockchain_records br ON t.id = br.tourist_id
GROUP BY t.id, t.first_name, t.last_name, t.email, t.wallet_address, 
         t.blockchain_verified, t.digital_id_hash, dip.trust_score, 
         dip.verification_level, dip.kyc_completed;

-- View for blockchain transaction summary
CREATE OR REPLACE VIEW blockchain_transaction_summary AS
SELECT 
    bt.network,
    bt.contract_address,
    sc.name as contract_name,
    sc.contract_type,
    COUNT(*) as total_transactions,
    COUNT(CASE WHEN bt.status = 'confirmed' THEN 1 END) as confirmed_transactions,
    COUNT(CASE WHEN bt.status = 'failed' THEN 1 END) as failed_transactions,
    AVG(bt.gas_used) as avg_gas_used,
    SUM(bt.transaction_fee) as total_fees,
    AVG(bt.processing_time_ms) as avg_processing_time_ms
FROM blockchain_transactions bt
LEFT JOIN smart_contracts sc ON bt.contract_id = sc.id
GROUP BY bt.network, bt.contract_address, sc.name, sc.contract_type;

-- =============================================================================
-- MIGRATION COMPLETION
-- =============================================================================

-- Update migration history with completion status
UPDATE migration_history 
SET 
    description = description || ' - COMPLETED',
    rollback_sql = $rollback$
        -- Rollback script for migration 002
        DROP VIEW IF EXISTS blockchain_transaction_summary CASCADE;
        DROP VIEW IF EXISTS tourist_blockchain_status CASCADE;
        
        DROP TABLE IF EXISTS digital_identity_profiles CASCADE;
        DROP TABLE IF EXISTS blockchain_transactions CASCADE;
        DROP TABLE IF EXISTS smart_contracts CASCADE;
        DROP TABLE IF EXISTS verification_requests CASCADE;
        DROP TABLE IF EXISTS blockchain_records CASCADE;
        
        -- Drop blockchain-specific types
        DROP TYPE IF EXISTS verification_method CASCADE;
        DROP TYPE IF EXISTS blockchain_status CASCADE;
        DROP TYPE IF EXISTS contract_type CASCADE;
        DROP TYPE IF EXISTS blockchain_network CASCADE;
        
        -- Remove blockchain columns from existing tables
        ALTER TABLE tourists DROP COLUMN IF EXISTS wallet_address CASCADE;
        ALTER TABLE tourists DROP COLUMN IF EXISTS digital_id_hash CASCADE;
        ALTER TABLE tourists DROP COLUMN IF EXISTS biometric_hash CASCADE;
        ALTER TABLE tourists DROP COLUMN IF EXISTS blockchain_verified CASCADE;
        ALTER TABLE tourists DROP COLUMN IF EXISTS blockchain_tx_hash CASCADE;
        
        -- Drop blockchain-specific functions
        DROP FUNCTION IF EXISTS update_digital_identity_on_blockchain_record() CASCADE;
        DROP FUNCTION IF EXISTS update_tourist_blockchain_status() CASCADE;
        DROP FUNCTION IF EXISTS track_blockchain_performance() CASCADE;
    $rollback$
WHERE migration_id = '002';

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
    'Applied migration 002_blockchain_integration.sql - Blockchain and digital identity features added',
    '{"migration_id": "002", "migration_name": "blockchain_integration", "version": "1.0.0"}',
    'system',
    'super_admin'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration 002_blockchain_integration.sql completed successfully';
    RAISE NOTICE 'Created blockchain tables: blockchain_records, verification_requests, smart_contracts, blockchain_transactions, digital_identity_profiles';
    RAISE NOTICE 'Added blockchain fields to existing tables and created supporting views';
END $$;
