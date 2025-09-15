-- Smart Tourist Safety System - Default Admin User Seed Data
-- Creates the initial admin user for system access

-- ============================================================================
-- ADMIN USER SEED DATA
-- ============================================================================

-- Insert default admin user
INSERT INTO users (
    id,
    email,
    password_hash,
    name,
    role,
    phone,
    department,
    location,
    avatar,
    permissions,
    is_active,
    is_verified,
    email_verified_at,
    created_at,
    updated_at
) VALUES (
    'admin-001',
    'admin@touristsafety.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: admin123
    'System Administrator',
    'super_admin',
    '+91-9876543210',
    'Administration',
    'System Control Center',
    'https://ui-avatars.com/api/?name=System+Administrator&background=3b82f6&color=fff',
    '["manage_users", "system_admin", "view_analytics", "manage_settings", "view_dashboard", "manage_dashboard", "export_data", "view_tourists", "create_tourist", "update_tourist", "delete_tourist", "track_tourist", "view_alerts", "create_alert", "update_alert", "delete_alert", "resolve_alert", "escalate_alert", "emergency_response", "view_zones", "create_zone", "update_zone", "delete_zone", "manage_geofencing", "view_blockchain", "manage_blockchain", "generate_digital_id", "verify_digital_id", "view_logs"]',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Insert admin user profile
INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    designation,
    employee_id,
    badge_number,
    emergency_contact,
    address,
    city,
    state,
    pincode,
    created_at,
    updated_at
) VALUES (
    'admin-001',
    'System',
    'Administrator',
    'System Administrator',
    'ADMIN001',
    'SYS001',
    '+91-9876543211',
    'Government IT Center, Sector 62',
    'Noida',
    'Uttar Pradesh',
    '201301',
    NOW(),
    NOW()
);

-- Insert admin user security settings
INSERT INTO user_security (
    user_id,
    two_factor_enabled,
    login_attempts,
    last_password_change,
    session_timeout,
    account_locked_until,
    password_reset_token,
    password_reset_expires,
    created_at,
    updated_at
) VALUES (
    'admin-001',
    false,
    0,
    NOW(),
    30,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- ============================================================================
-- ADDITIONAL SAMPLE USERS FOR TESTING
-- ============================================================================

-- Insert sample operator user
INSERT INTO users (
    id,
    email,
    password_hash,
    name,
    role,
    phone,
    department,
    location,
    avatar,
    permissions,
    is_active,
    is_verified,
    email_verified_at,
    created_at,
    updated_at
) VALUES (
    'operator-001',
    'operator@touristsafety.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: operator123
    'Operations Manager',
    'operator',
    '+91-9876543220',
    'Operations',
    'Field Command Center',
    'https://ui-avatars.com/api/?name=Operations+Manager&background=10b981&color=fff',
    '["view_dashboard", "view_tourists", "create_tourist", "update_tourist", "track_tourist", "view_alerts", "create_alert", "update_alert", "resolve_alert", "view_zones", "create_zone", "update_zone", "view_blockchain", "verify_digital_id"]',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Insert operator user profile
INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    designation,
    employee_id,
    badge_number,
    emergency_contact,
    address,
    city,
    state,
    pincode,
    created_at,
    updated_at
) VALUES (
    'operator-001',
    'Operations',
    'Manager',
    'Senior Operations Manager',
    'OPS001',
    'OP001',
    '+91-9876543221',
    'Police Station, Connaught Place',
    'New Delhi',
    'Delhi',
    '110001',
    NOW(),
    NOW()
);

-- Insert operator user security settings
INSERT INTO user_security (
    user_id,
    two_factor_enabled,
    login_attempts,
    last_password_change,
    session_timeout,
    account_locked_until,
    password_reset_token,
    password_reset_expires,
    created_at,
    updated_at
) VALUES (
    'operator-001',
    false,
    0,
    NOW(),
    30,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Insert sample viewer user
INSERT INTO users (
    id,
    email,
    password_hash,
    name,
    role,
    phone,
    department,
    location,
    avatar,
    permissions,
    is_active,
    is_verified,
    email_verified_at,
    created_at,
    updated_at
) VALUES (
    'viewer-001',
    'viewer@touristsafety.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: viewer123
    'Safety Monitor',
    'viewer',
    '+91-9876543230',
    'Monitoring',
    'Tourist Information Center',
    'https://ui-avatars.com/api/?name=Safety+Monitor&background=f59e0b&color=fff',
    '["view_dashboard", "view_tourists", "view_alerts", "view_zones", "view_blockchain"]',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Insert viewer user profile
INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    designation,
    employee_id,
    badge_number,
    emergency_contact,
    address,
    city,
    state,
    pincode,
    created_at,
    updated_at
) VALUES (
    'viewer-001',
    'Safety',
    'Monitor',
    'Tourist Safety Monitor',
    'VIEW001',
    'TM001',
    '+91-9876543231',
    'Tourist Info Center, India Gate',
    'New Delhi',
    'Delhi',
    '110003',
    NOW(),
    NOW()
);

-- Insert viewer user security settings
INSERT INTO user_security (
    user_id,
    two_factor_enabled,
    login_attempts,
    last_password_change,
    session_timeout,
    account_locked_until,
    password_reset_token,
    password_reset_expires,
    created_at,
    updated_at
) VALUES (
    'viewer-001',
    false,
    0,
    NOW(),
    30,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- ============================================================================
-- AUDIT LOG FOR INITIAL SETUP
-- ============================================================================

-- Log the initial admin setup
INSERT INTO audit_logs (
    id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
) VALUES (
    CONCAT('audit-', UUID()),
    'system',
    'INITIAL_SETUP',
    'user',
    'admin-001',
    '{}',
    '{"message": "Default admin user created during system initialization", "email": "admin@touristsafety.com", "role": "super_admin"}',
    '127.0.0.1',
    'System Setup',
    NOW()
);

-- Log sample users creation
INSERT INTO audit_logs (
    id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
) VALUES (
    CONCAT('audit-', UUID()),
    'system',
    'INITIAL_SETUP',
    'user',
    'operator-001',
    '{}',
    '{"message": "Sample operator user created during system initialization", "email": "operator@touristsafety.com", "role": "operator"}',
    '127.0.0.1',
    'System Setup',
    NOW()
);

INSERT INTO audit_logs (
    id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
) VALUES (
    CONCAT('audit-', UUID()),
    'system',
    'INITIAL_SETUP',
    'user',
    'viewer-001',
    '{}',
    '{"message": "Sample viewer user created during system initialization", "email": "viewer@touristsafety.com", "role": "viewer"}',
    '127.0.0.1',
    'System Setup',
    NOW()
);

-- ============================================================================
-- DEPARTMENT AND LOCATION SEED DATA
-- ============================================================================

-- Insert departments
INSERT INTO departments (
    id,
    name,
    description,
    head_user_id,
    location,
    contact_number,
    email,
    is_active,
    created_at,
    updated_at
) VALUES 
(
    'dept-admin',
    'Administration',
    'System administration and management',
    'admin-001',
    'Government IT Center',
    '+91-9876543210',
    'admin@touristsafety.com',
    true,
    NOW(),
    NOW()
),
(
    'dept-ops',
    'Operations',
    'Field operations and tourist safety management',
    'operator-001',
    'Field Command Centers',
    '+91-9876543220',
    'operations@touristsafety.com',
    true,
    NOW(),
    NOW()
),
(
    'dept-monitor',
    'Monitoring',
    'Safety monitoring and surveillance',
    'viewer-001',
    'Tourist Information Centers',
    '+91-9876543230',
    'monitoring@touristsafety.com',
    true,
    NOW(),
    NOW()
);

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================

-- Insert system settings
INSERT INTO system_settings (
    key_name,
    value,
    description,
    category,
    is_public,
    created_at,
    updated_at
) VALUES 
(
    'system.default_password',
    'TouristSafety@2024',
    'Default password for new users',
    'security',
    false,
    NOW(),
    NOW()
),
(
    'system.session_timeout',
    '30',
    'Session timeout in minutes',
    'security',
    false,
    NOW(),
    NOW()
),
(
    'system.require_2fa',
    'false',
    'Require two-factor authentication for all users',
    'security',
    false,
    NOW(),
    NOW()
),
(
    'system.max_login_attempts',
    '5',
    'Maximum login attempts before account lockout',
    'security',
    false,
    NOW(),
    NOW()
),
(
    'system.admin_email',
    'admin@touristsafety.com',
    'System administrator email',
    'general',
    true,
    NOW(),
    NOW()
),
(
    'system.organization_name',
    'Smart Tourist Safety System',
    'Organization name',
    'general',
    true,
    NOW(),
    NOW()
),
(
    'system.timezone',
    'Asia/Kolkata',
    'System default timezone',
    'general',
    true,
    NOW(),
    NOW()
);

-- ============================================================================
-- INITIAL PERMISSIONS SETUP
-- ============================================================================

-- Insert permission categories
INSERT INTO permission_categories (
    id,
    name,
    description,
    icon,
    sort_order,
    created_at,
    updated_at
) VALUES 
(
    'cat-dashboard',
    'Dashboard',
    'Dashboard and analytics permissions',
    'BarChart3',
    1,
    NOW(),
    NOW()
),
(
    'cat-users',
    'User Management',
    'User and role management permissions',
    'Users',
    2,
    NOW(),
    NOW()
),
(
    'cat-tourists',
    'Tourist Management',
    'Tourist tracking and management permissions',
    'MapPin',
    3,
    NOW(),
    NOW()
),
(
    'cat-alerts',
    'Alert Management',
    'Safety alert and notification permissions',
    'AlertTriangle',
    4,
    NOW(),
    NOW()
),
(
    'cat-zones',
    'Zone Management',
    'Geographic zone and geofencing permissions',
    'Map',
    5,
    NOW(),
    NOW()
),
(
    'cat-blockchain',
    'Blockchain',
    'Digital identity and blockchain permissions',
    'Shield',
    6,
    NOW(),
    NOW()
),
(
    'cat-system',
    'System Administration',
    'System settings and administrative permissions',
    'Settings',
    7,
    NOW(),
    NOW()
);

-- ============================================================================
-- COMPLETION LOG
-- ============================================================================

-- Log the successful completion of seed data insertion
INSERT INTO audit_logs (
    id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
) VALUES (
    CONCAT('audit-', UUID()),
    'system',
    'SEED_COMPLETE',
    'system',
    'initial-setup',
    '{}',
    '{"message": "Initial seed data insertion completed successfully", "timestamp": NOW()}',
    '127.0.0.1',
    'System Setup',
    NOW()
);

-- ============================================================================
-- VERIFICATION QUERIES (Commented out for production)
-- ============================================================================

/*
-- Verify admin user creation
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.is_active,
    p.employee_id,
    p.designation
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE u.email = 'admin@touristsafety.com';

-- Verify all sample users
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.is_active,
    u.department
FROM users u
WHERE u.email IN ('admin@touristsafety.com', 'operator@touristsafety.com', 'viewer@touristsafety.com');

-- Verify departments
SELECT * FROM departments;

-- Verify system settings
SELECT * FROM system_settings;
*/