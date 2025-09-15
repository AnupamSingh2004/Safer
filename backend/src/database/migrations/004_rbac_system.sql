-- ============================================================================
-- Smart Tourist Safety System - RBAC Database Migration
-- Migration 004: Role-Based Access Control System
-- Created: September 15, 2025
-- ============================================================================

-- Drop existing tables if they exist (for development only)
-- DROP TABLE IF EXISTS audit_logs;
-- DROP TABLE IF EXISTS user_sessions;
-- DROP TABLE IF EXISTS user_role_permissions;
-- DROP TABLE IF EXISTS role_permissions;
-- DROP TABLE IF EXISTS permissions;
-- DROP TABLE IF EXISTS user_security;
-- DROP TABLE IF EXISTS user_profiles;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS roles;
-- DROP TABLE IF EXISTS departments;
-- DROP TABLE IF EXISTS permission_categories;

-- ============================================================================
-- PERMISSION CATEGORIES TABLE
-- ============================================================================

CREATE TABLE permission_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for performance
CREATE INDEX idx_permission_categories_active_sort ON permission_categories(is_active, sort_order);

-- ============================================================================
-- PERMISSIONS TABLE
-- ============================================================================

CREATE TABLE permissions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id VARCHAR(50),
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    conditions JSON,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES permission_categories(id) ON DELETE SET NULL,
    UNIQUE KEY unique_resource_action (resource, action)
);

-- Create indexes for performance
CREATE INDEX idx_permissions_category ON permissions(category_id);
CREATE INDEX idx_permissions_resource_action ON permissions(resource, action);
CREATE INDEX idx_permissions_active ON permissions(is_active);

-- ============================================================================
-- DEPARTMENTS TABLE
-- ============================================================================

CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    head_user_id VARCHAR(50),
    location VARCHAR(200),
    contact_number VARCHAR(20),
    email VARCHAR(100),
    budget DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_head ON departments(head_user_id);

-- ============================================================================
-- ROLES TABLE
-- ============================================================================

CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    level INT NOT NULL DEFAULT 0,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_roles_active ON roles(is_active);
CREATE INDEX idx_roles_level ON roles(level);

-- ============================================================================
-- ROLE PERMISSIONS TABLE
-- ============================================================================

CREATE TABLE role_permissions (
    id VARCHAR(50) PRIMARY KEY,
    role_id VARCHAR(50) NOT NULL,
    permission_id VARCHAR(50) NOT NULL,
    granted_by VARCHAR(50),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    conditions JSON,
    is_active BOOLEAN DEFAULT true,
    
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Create indexes
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX idx_role_permissions_active ON role_permissions(is_active);

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    department_id VARCHAR(50),
    phone VARCHAR(20),
    avatar VARCHAR(500),
    location VARCHAR(200),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    login_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_verified ON users(is_verified);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================

CREATE TABLE user_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    middle_name VARCHAR(100),
    designation VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    badge_number VARCHAR(50),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    nationality VARCHAR(50),
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_relation VARCHAR(50),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    alternate_email VARCHAR(255),
    work_schedule JSON,
    skills JSON,
    certifications JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_profiles_employee_id ON user_profiles(employee_id);
CREATE INDEX idx_user_profiles_badge ON user_profiles(badge_number);
CREATE INDEX idx_user_profiles_city ON user_profiles(city);

-- ============================================================================
-- USER SECURITY TABLE
-- ============================================================================

CREATE TABLE user_security (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    two_factor_backup_codes JSON,
    login_attempts INT DEFAULT 0,
    last_failed_login TIMESTAMP NULL,
    account_locked_until TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP NULL,
    phone_verification_token VARCHAR(10),
    phone_verification_expires TIMESTAMP NULL,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_history JSON,
    session_timeout INT DEFAULT 30, -- minutes
    ip_whitelist JSON,
    device_fingerprints JSON,
    security_questions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_security_reset_token ON user_security(password_reset_token);
CREATE INDEX idx_user_security_email_token ON user_security(email_verification_token);
CREATE INDEX idx_user_security_locked ON user_security(account_locked_until);

-- ============================================================================
-- USER ROLE PERMISSIONS (Additional permissions for specific users)
-- ============================================================================

CREATE TABLE user_role_permissions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    permission_id VARCHAR(50) NOT NULL,
    granted BOOLEAN DEFAULT true,
    granted_by VARCHAR(50),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    reason TEXT,
    conditions JSON,
    is_active BOOLEAN DEFAULT true,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_permission (user_id, permission_id)
);

-- Create indexes
CREATE INDEX idx_user_role_permissions_user ON user_role_permissions(user_id);
CREATE INDEX idx_user_role_permissions_permission ON user_role_permissions(permission_id);
CREATE INDEX idx_user_role_permissions_active ON user_role_permissions(is_active);

-- ============================================================================
-- USER SESSIONS TABLE
-- ============================================================================

CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    device_name VARCHAR(200),
    device_type VARCHAR(50),
    platform VARCHAR(50),
    browser VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    location VARCHAR(200),
    session_data JSON,
    refresh_token VARCHAR(255) UNIQUE,
    access_token_hash VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_last_activity ON user_sessions(last_activity);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    session_id VARCHAR(128),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    old_values JSON,
    new_values JSON,
    changes JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    location VARCHAR(200),
    status ENUM('success', 'failure', 'pending') DEFAULT 'success',
    error_message TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_session ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);

-- ============================================================================
-- API KEYS TABLE (For system integrations)
-- ============================================================================

CREATE TABLE api_keys (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    user_id VARCHAR(50),
    permissions JSON,
    rate_limit INT DEFAULT 1000,
    rate_limit_window INT DEFAULT 3600, -- seconds
    last_used_at TIMESTAMP NULL,
    last_used_ip VARCHAR(45),
    usage_count INT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- ============================================================================
-- SYSTEM SETTINGS TABLE
-- ============================================================================

CREATE TABLE system_settings (
    id VARCHAR(50) PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json', 'array') DEFAULT 'string',
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    is_encrypted BOOLEAN DEFAULT false,
    validation_rules JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_system_settings_key ON system_settings(key_name);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_public ON system_settings(is_public);

-- ============================================================================
-- NOTIFICATION TEMPLATES TABLE
-- ============================================================================

CREATE TABLE notification_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(200),
    body_text TEXT,
    body_html TEXT,
    template_type ENUM('email', 'sms', 'push', 'webhook') NOT NULL,
    variables JSON,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_notification_templates_type ON notification_templates(template_type);
CREATE INDEX idx_notification_templates_active ON notification_templates(is_active);

-- ============================================================================
-- USER NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE user_notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'system') DEFAULT 'info',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    channel ENUM('in_app', 'email', 'sms', 'push') DEFAULT 'in_app',
    data JSON,
    read_at TIMESTAMP NULL,
    acknowledged_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON user_notifications(read_at);
CREATE INDEX idx_user_notifications_type ON user_notifications(type);
CREATE INDEX idx_user_notifications_priority ON user_notifications(priority);
CREATE INDEX idx_user_notifications_created ON user_notifications(created_at);

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINTS (After all tables are created)
-- ============================================================================

-- Add foreign key for department head
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_head 
FOREIGN KEY (head_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for user details with profile and role information
CREATE VIEW user_details AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.phone,
    u.avatar,
    u.location,
    u.timezone,
    u.language,
    u.is_active,
    u.is_verified,
    u.last_login_at,
    u.last_login_ip,
    u.login_count,
    u.created_at,
    u.updated_at,
    r.name as role_name,
    r.display_name as role_display_name,
    r.level as role_level,
    d.name as department_name,
    d.location as department_location,
    p.first_name,
    p.last_name,
    p.designation,
    p.employee_id,
    p.badge_number,
    p.emergency_contact,
    p.city,
    p.state,
    p.country,
    s.two_factor_enabled,
    s.account_locked_until,
    s.last_password_change
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN user_security s ON u.id = s.user_id;

-- View for role permissions
CREATE VIEW role_permission_details AS
SELECT 
    r.id as role_id,
    r.name as role_name,
    r.display_name as role_display_name,
    p.id as permission_id,
    p.name as permission_name,
    p.resource,
    p.action,
    pc.name as category_name,
    rp.conditions,
    rp.expires_at,
    rp.is_active
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
LEFT JOIN permission_categories pc ON p.category_id = pc.id
WHERE rp.is_active = true AND p.is_active = true;

-- View for user permissions (combining role and individual permissions)
CREATE VIEW user_permissions AS
SELECT DISTINCT
    u.id as user_id,
    u.email,
    p.id as permission_id,
    p.name as permission_name,
    p.resource,
    p.action,
    'role' as source,
    r.name as role_name
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.is_active = true 
  AND r.is_active = true 
  AND rp.is_active = true 
  AND p.is_active = true
  AND (rp.expires_at IS NULL OR rp.expires_at > NOW())

UNION

SELECT DISTINCT
    u.id as user_id,
    u.email,
    p.id as permission_id,
    p.name as permission_name,
    p.resource,
    p.action,
    'user' as source,
    'individual' as role_name
FROM users u
JOIN user_role_permissions urp ON u.id = urp.user_id
JOIN permissions p ON urp.permission_id = p.id
WHERE u.is_active = true 
  AND urp.is_active = true 
  AND urp.granted = true
  AND p.is_active = true
  AND (urp.expires_at IS NULL OR urp.expires_at > NOW());

-- ============================================================================
-- CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Trigger to update user updated_at timestamp
DELIMITER //
CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- Trigger to update user_profiles updated_at timestamp
CREATE TRIGGER tr_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- Trigger to update user_security updated_at timestamp
CREATE TRIGGER tr_user_security_updated_at
    BEFORE UPDATE ON user_security
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- Trigger to update user_sessions updated_at timestamp
CREATE TRIGGER tr_user_sessions_updated_at
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- ============================================================================
-- CREATE STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================================================

DELIMITER //

-- Procedure to get user permissions
CREATE PROCEDURE GetUserPermissions(IN userId VARCHAR(50))
BEGIN
    SELECT DISTINCT
        p.resource,
        p.action,
        p.name as permission_name,
        up.source
    FROM user_permissions up
    JOIN permissions p ON up.permission_id = p.id
    WHERE up.user_id = userId
    ORDER BY p.resource, p.action;
END//

-- Procedure to create audit log entry
CREATE PROCEDURE CreateAuditLog(
    IN userId VARCHAR(50),
    IN sessionId VARCHAR(128),
    IN actionName VARCHAR(100),
    IN entityType VARCHAR(50),
    IN entityId VARCHAR(50),
    IN oldValues JSON,
    IN newValues JSON,
    IN ipAddress VARCHAR(45),
    IN userAgent TEXT
)
BEGIN
    INSERT INTO audit_logs (
        id, user_id, session_id, action, entity_type, entity_id,
        old_values, new_values, ip_address, user_agent
    ) VALUES (
        CONCAT('audit-', UUID()), userId, sessionId, actionName, entityType, entityId,
        oldValues, newValues, ipAddress, userAgent
    );
END//

-- Procedure to cleanup expired sessions
CREATE PROCEDURE CleanupExpiredSessions()
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR last_activity < DATE_SUB(NOW(), INTERVAL 7 DAY);
END//

DELIMITER ;

-- ============================================================================
-- CREATE INDEXES FOR FULL-TEXT SEARCH
-- ============================================================================

-- Full-text search on user names and emails
ALTER TABLE users ADD FULLTEXT(name, email);
ALTER TABLE user_profiles ADD FULLTEXT(first_name, last_name, designation);

-- ============================================================================
-- MIGRATION COMPLETION LOG
-- ============================================================================

INSERT INTO audit_logs (
    id, user_id, action, entity_type, entity_id, 
    old_values, new_values, ip_address, user_agent
) VALUES (
    CONCAT('audit-', UUID()),
    'system',
    'MIGRATION_COMPLETE',
    'database',
    '004_rbac_system',
    '{}',
    JSON_OBJECT('migration', '004_rbac_system', 'completed_at', NOW()),
    '127.0.0.1',
    'Database Migration Script'
);