-- ============================================================================
-- Smart Tourist Safety System - Test Users Seed Data
-- Sample users for development, testing, and demo purposes
-- Created: September 15, 2025
-- ============================================================================

-- Clear existing test data (development only)
-- DELETE FROM user_notifications WHERE user_id LIKE 'test-%';
-- DELETE FROM user_sessions WHERE user_id LIKE 'test-%';
-- DELETE FROM audit_logs WHERE user_id LIKE 'test-%';
-- DELETE FROM user_role_permissions WHERE user_id LIKE 'test-%';
-- DELETE FROM user_security WHERE user_id LIKE 'test-%';
-- DELETE FROM user_profiles WHERE user_id LIKE 'test-%';
-- DELETE FROM users WHERE id LIKE 'test-%';

-- ============================================================================
-- INSERT PERMISSION CATEGORIES
-- ============================================================================

INSERT INTO permission_categories (id, name, description, icon, sort_order) VALUES
('cat-dashboard', 'Dashboard', 'Dashboard and analytics access', 'BarChart3', 1),
('cat-users', 'User Management', 'User and role management', 'Users', 2),
('cat-tourists', 'Tourist Management', 'Tourist tracking and safety', 'MapPin', 3),
('cat-alerts', 'Alert Management', 'Safety alerts and notifications', 'AlertTriangle', 4),
('cat-zones', 'Zone Management', 'Geographic zones and geofencing', 'Map', 5),
('cat-blockchain', 'Blockchain', 'Digital identity and verification', 'Shield', 6),
('cat-system', 'System Administration', 'System settings and configuration', 'Settings', 7);

-- ============================================================================
-- INSERT PERMISSIONS
-- ============================================================================

INSERT INTO permissions (id, name, description, category_id, resource, action, is_system) VALUES
-- Dashboard permissions
('perm-view-dashboard', 'view_dashboard', 'View main dashboard', 'cat-dashboard', 'dashboard', 'view', true),
('perm-manage-dashboard', 'manage_dashboard', 'Manage dashboard configuration', 'cat-dashboard', 'dashboard', 'manage', true),
('perm-view-analytics', 'view_analytics', 'View analytics and reports', 'cat-dashboard', 'analytics', 'view', true),
('perm-export-data', 'export_data', 'Export system data', 'cat-dashboard', 'data', 'export', true),

-- User management permissions
('perm-view-users', 'view_users', 'View user list and profiles', 'cat-users', 'users', 'view', true),
('perm-create-user', 'create_user', 'Create new users', 'cat-users', 'users', 'create', true),
('perm-update-user', 'update_user', 'Update user information', 'cat-users', 'users', 'update', true),
('perm-delete-user', 'delete_user', 'Delete users', 'cat-users', 'users', 'delete', true),
('perm-manage-roles', 'manage_roles', 'Manage user roles and permissions', 'cat-users', 'roles', 'manage', true),

-- Tourist management permissions
('perm-view-tourists', 'view_tourists', 'View tourist information', 'cat-tourists', 'tourists', 'view', true),
('perm-create-tourist', 'create_tourist', 'Register new tourists', 'cat-tourists', 'tourists', 'create', true),
('perm-update-tourist', 'update_tourist', 'Update tourist information', 'cat-tourists', 'tourists', 'update', true),
('perm-delete-tourist', 'delete_tourist', 'Delete tourist records', 'cat-tourists', 'tourists', 'delete', true),
('perm-track-tourist', 'track_tourist', 'Track tourist location', 'cat-tourists', 'tourists', 'track', true),

-- Alert management permissions
('perm-view-alerts', 'view_alerts', 'View safety alerts', 'cat-alerts', 'alerts', 'view', true),
('perm-create-alert', 'create_alert', 'Create safety alerts', 'cat-alerts', 'alerts', 'create', true),
('perm-update-alert', 'update_alert', 'Update alert information', 'cat-alerts', 'alerts', 'update', true),
('perm-delete-alert', 'delete_alert', 'Delete alerts', 'cat-alerts', 'alerts', 'delete', true),
('perm-resolve-alert', 'resolve_alert', 'Resolve safety alerts', 'cat-alerts', 'alerts', 'resolve', true),
('perm-escalate-alert', 'escalate_alert', 'Escalate critical alerts', 'cat-alerts', 'alerts', 'escalate', true),

-- Zone management permissions
('perm-view-zones', 'view_zones', 'View geographic zones', 'cat-zones', 'zones', 'view', true),
('perm-create-zone', 'create_zone', 'Create safety zones', 'cat-zones', 'zones', 'create', true),
('perm-update-zone', 'update_zone', 'Update zone information', 'cat-zones', 'zones', 'update', true),
('perm-delete-zone', 'delete_zone', 'Delete zones', 'cat-zones', 'zones', 'delete', true),
('perm-manage-geofencing', 'manage_geofencing', 'Manage geofencing rules', 'cat-zones', 'geofencing', 'manage', true),

-- Blockchain permissions
('perm-view-blockchain', 'view_blockchain', 'View blockchain data', 'cat-blockchain', 'blockchain', 'view', true),
('perm-manage-blockchain', 'manage_blockchain', 'Manage blockchain operations', 'cat-blockchain', 'blockchain', 'manage', true),
('perm-generate-digital-id', 'generate_digital_id', 'Generate digital IDs', 'cat-blockchain', 'digital_id', 'generate', true),
('perm-verify-digital-id', 'verify_digital_id', 'Verify digital identities', 'cat-blockchain', 'digital_id', 'verify', true),

-- System administration permissions
('perm-view-logs', 'view_logs', 'View system logs', 'cat-system', 'logs', 'view', true),
('perm-manage-settings', 'manage_settings', 'Manage system settings', 'cat-system', 'settings', 'manage', true),
('perm-system-admin', 'system_admin', 'Full system administration', 'cat-system', 'system', 'admin', true);

-- ============================================================================
-- INSERT DEPARTMENTS
-- ============================================================================

INSERT INTO departments (id, name, description, location, contact_number, email) VALUES
('dept-admin', 'Administration', 'System administration and management', 'Government IT Center, Sector 62, Noida', '+91-120-2345678', 'admin@touristsafety.com'),
('dept-operations', 'Field Operations', 'On-ground tourist safety operations', 'Multiple field centers across tourist destinations', '+91-120-2345679', 'operations@touristsafety.com'),
('dept-monitoring', 'Safety Monitoring', 'Centralized monitoring and surveillance', 'Control Room, India Gate Complex, New Delhi', '+91-120-2345680', 'monitoring@touristsafety.com'),
('dept-emergency', 'Emergency Response', 'Emergency response and crisis management', 'Emergency Response Center, CP, New Delhi', '+91-120-2345681', 'emergency@touristsafety.com'),
('dept-technology', 'Technology', 'IT infrastructure and development', 'Tech Hub, Cyber City, Gurugram', '+91-124-2345682', 'tech@touristsafety.com');

-- ============================================================================
-- INSERT ROLES
-- ============================================================================

INSERT INTO roles (id, name, display_name, description, level, is_system) VALUES
('role-super-admin', 'super_admin', 'Super Administrator', 'Full system access with all permissions', 100, true),
('role-operator', 'operator', 'Field Operator', 'Field operations and tourist management', 50, true),
('role-viewer', 'viewer', 'Safety Viewer', 'Read-only access to safety information', 10, true),
('role-emergency', 'emergency_responder', 'Emergency Responder', 'Emergency response and crisis management', 75, false),
('role-analyst', 'data_analyst', 'Data Analyst', 'Analytics and reporting access', 30, false);

-- ============================================================================
-- INSERT ROLE PERMISSIONS
-- ============================================================================

-- Super Admin - All permissions
INSERT INTO role_permissions (id, role_id, permission_id) 
SELECT CONCAT('rp-super-', ROW_NUMBER() OVER (ORDER BY p.id)), 'role-super-admin', p.id 
FROM permissions p;

-- Field Operator permissions
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
('rp-op-1', 'role-operator', 'perm-view-dashboard'),
('rp-op-2', 'role-operator', 'perm-view-tourists'),
('rp-op-3', 'role-operator', 'perm-create-tourist'),
('rp-op-4', 'role-operator', 'perm-update-tourist'),
('rp-op-5', 'role-operator', 'perm-track-tourist'),
('rp-op-6', 'role-operator', 'perm-view-alerts'),
('rp-op-7', 'role-operator', 'perm-create-alert'),
('rp-op-8', 'role-operator', 'perm-update-alert'),
('rp-op-9', 'role-operator', 'perm-resolve-alert'),
('rp-op-10', 'role-operator', 'perm-view-zones'),
('rp-op-11', 'role-operator', 'perm-create-zone'),
('rp-op-12', 'role-operator', 'perm-update-zone'),
('rp-op-13', 'role-operator', 'perm-view-blockchain'),
('rp-op-14', 'role-operator', 'perm-verify-digital-id');

-- Safety Viewer permissions
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
('rp-view-1', 'role-viewer', 'perm-view-dashboard'),
('rp-view-2', 'role-viewer', 'perm-view-tourists'),
('rp-view-3', 'role-viewer', 'perm-view-alerts'),
('rp-view-4', 'role-viewer', 'perm-view-zones'),
('rp-view-5', 'role-viewer', 'perm-view-blockchain');

-- Emergency Responder permissions
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
('rp-emr-1', 'role-emergency', 'perm-view-dashboard'),
('rp-emr-2', 'role-emergency', 'perm-view-tourists'),
('rp-emr-3', 'role-emergency', 'perm-update-tourist'),
('rp-emr-4', 'role-emergency', 'perm-track-tourist'),
('rp-emr-5', 'role-emergency', 'perm-view-alerts'),
('rp-emr-6', 'role-emergency', 'perm-create-alert'),
('rp-emr-7', 'role-emergency', 'perm-update-alert'),
('rp-emr-8', 'role-emergency', 'perm-resolve-alert'),
('rp-emr-9', 'role-emergency', 'perm-escalate-alert'),
('rp-emr-10', 'role-emergency', 'perm-view-zones'),
('rp-emr-11', 'role-emergency', 'perm-view-blockchain');

-- Data Analyst permissions
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
('rp-ana-1', 'role-analyst', 'perm-view-dashboard'),
('rp-ana-2', 'role-analyst', 'perm-view-analytics'),
('rp-ana-3', 'role-analyst', 'perm-export-data'),
('rp-ana-4', 'role-analyst', 'perm-view-tourists'),
('rp-ana-5', 'role-analyst', 'perm-view-alerts'),
('rp-ana-6', 'role-analyst', 'perm-view-zones'),
('rp-ana-7', 'role-analyst', 'perm-view-blockchain');

-- ============================================================================
-- INSERT TEST USERS
-- ============================================================================

-- Test Super Admin
INSERT INTO users (id, email, password_hash, name, role_id, department_id, phone, avatar, is_active, is_verified, email_verified_at) VALUES
('test-admin-001', 'admin.test@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test Administrator', 'role-super-admin', 'dept-admin', '+91-9876543210', 'https://ui-avatars.com/api/?name=Test+Administrator&background=3b82f6&color=fff', true, true, NOW());

-- Test Field Operators
INSERT INTO users (id, email, password_hash, name, role_id, department_id, phone, avatar, is_active, is_verified, email_verified_at) VALUES
('test-op-001', 'operator1@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Raj Kumar Singh', 'role-operator', 'dept-operations', '+91-9876543211', 'https://ui-avatars.com/api/?name=Raj+Kumar+Singh&background=10b981&color=fff', true, true, NOW()),
('test-op-002', 'operator2@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya Sharma', 'role-operator', 'dept-operations', '+91-9876543212', 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff', true, true, NOW()),
('test-op-003', 'operator3@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mohammed Hassan', 'role-operator', 'dept-operations', '+91-9876543213', 'https://ui-avatars.com/api/?name=Mohammed+Hassan&background=10b981&color=fff', true, true, NOW());

-- Test Safety Viewers
INSERT INTO users (id, email, password_hash, name, role_id, department_id, phone, avatar, is_active, is_verified, email_verified_at) VALUES
('test-view-001', 'viewer1@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Anita Devi', 'role-viewer', 'dept-monitoring', '+91-9876543214', 'https://ui-avatars.com/api/?name=Anita+Devi&background=f59e0b&color=fff', true, true, NOW()),
('test-view-002', 'viewer2@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Suresh Gupta', 'role-viewer', 'dept-monitoring', '+91-9876543215', 'https://ui-avatars.com/api/?name=Suresh+Gupta&background=f59e0b&color=fff', true, true, NOW());

-- Test Emergency Responder
INSERT INTO users (id, email, password_hash, name, role_id, department_id, phone, avatar, is_active, is_verified, email_verified_at) VALUES
('test-emr-001', 'emergency@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Vikash Yadav', 'role-emergency', 'dept-emergency', '+91-9876543216', 'https://ui-avatars.com/api/?name=Dr+Vikash+Yadav&background=ef4444&color=fff', true, true, NOW());

-- Test Data Analyst
INSERT INTO users (id, email, password_hash, name, role_id, department_id, phone, avatar, is_active, is_verified, email_verified_at) VALUES
('test-ana-001', 'analyst@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kavya Reddy', 'role-analyst', 'dept-technology', '+91-9876543217', 'https://ui-avatars.com/api/?name=Kavya+Reddy&background=8b5cf6&color=fff', true, true, NOW());

-- Inactive Test User
INSERT INTO users (id, email, password_hash, name, role_id, department_id, phone, avatar, is_active, is_verified, email_verified_at) VALUES
('test-inactive-001', 'inactive@touristsafety.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Inactive User', 'role-viewer', 'dept-monitoring', '+91-9876543218', 'https://ui-avatars.com/api/?name=Inactive+User&background=6b7280&color=fff', false, false, NULL);

-- ============================================================================
-- INSERT USER PROFILES
-- ============================================================================

INSERT INTO user_profiles (id, user_id, first_name, last_name, designation, employee_id, badge_number, emergency_contact, emergency_contact_name, emergency_contact_relation, address_line1, city, state, country, pincode) VALUES
('prof-test-admin-001', 'test-admin-001', 'Test', 'Administrator', 'System Administrator', 'ADMIN001', 'ADM001', '+91-9876543219', 'Emergency Contact Admin', 'Spouse', 'Government IT Center, Sector 62', 'Noida', 'Uttar Pradesh', 'India', '201301'),
('prof-test-op-001', 'test-op-001', 'Raj Kumar', 'Singh', 'Senior Field Operator', 'OP001', 'FLD001', '+91-9876543220', 'Mrs. Sunita Singh', 'Spouse', 'Police Station, Connaught Place', 'New Delhi', 'Delhi', 'India', '110001'),
('prof-test-op-002', 'test-op-002', 'Priya', 'Sharma', 'Field Operator', 'OP002', 'FLD002', '+91-9876543221', 'Mr. Amit Sharma', 'Spouse', 'Tourist Help Center, Red Fort', 'New Delhi', 'Delhi', 'India', '110006'),
('prof-test-op-003', 'test-op-003', 'Mohammed', 'Hassan', 'Field Operator', 'OP003', 'FLD003', '+91-9876543222', 'Mrs. Fatima Hassan', 'Spouse', 'Jama Masjid Area Police Post', 'New Delhi', 'Delhi', 'India', '110006'),
('prof-test-view-001', 'test-view-001', 'Anita', 'Devi', 'Safety Monitor', 'MON001', 'SAF001', '+91-9876543223', 'Mr. Raman Devi', 'Spouse', 'Control Room, India Gate', 'New Delhi', 'Delhi', 'India', '110003'),
('prof-test-view-002', 'test-view-002', 'Suresh', 'Gupta', 'Safety Monitor', 'MON002', 'SAF002', '+91-9876543224', 'Mrs. Rekha Gupta', 'Spouse', 'Monitoring Center, Rajpath', 'New Delhi', 'Delhi', 'India', '110001'),
('prof-test-emr-001', 'test-emr-001', 'Dr. Vikash', 'Yadav', 'Emergency Response Coordinator', 'EMR001', 'EMR001', '+91-9876543225', 'Dr. Priyanka Yadav', 'Spouse', 'Emergency Response Center, CP', 'New Delhi', 'Delhi', 'India', '110001'),
('prof-test-ana-001', 'test-ana-001', 'Kavya', 'Reddy', 'Senior Data Analyst', 'ANA001', 'DATA001', '+91-9876543226', 'Mr. Srinivas Reddy', 'Spouse', 'Tech Hub, Cyber City', 'Gurugram', 'Haryana', 'India', '122002'),
('prof-test-inactive-001', 'test-inactive-001', 'Inactive', 'User', 'Former Employee', 'INA001', 'OLD001', '+91-9876543227', 'Contact Person', 'Friend', 'Former Address', 'Unknown', 'Unknown', 'India', '000000');

-- ============================================================================
-- INSERT USER SECURITY SETTINGS
-- ============================================================================

INSERT INTO user_security (id, user_id, two_factor_enabled, login_attempts, last_password_change, session_timeout) VALUES
('sec-test-admin-001', 'test-admin-001', true, 0, NOW(), 60),
('sec-test-op-001', 'test-op-001', false, 0, NOW(), 30),
('sec-test-op-002', 'test-op-002', false, 0, NOW(), 30),
('sec-test-op-003', 'test-op-003', false, 0, NOW(), 30),
('sec-test-view-001', 'test-view-001', false, 0, NOW(), 30),
('sec-test-view-002', 'test-view-002', false, 0, NOW(), 30),
('sec-test-emr-001', 'test-emr-001', true, 0, NOW(), 45),
('sec-test-ana-001', 'test-ana-001', false, 0, NOW(), 30),
('sec-test-inactive-001', 'test-inactive-001', false, 5, DATE_SUB(NOW(), INTERVAL 30 DAY), 30);

-- ============================================================================
-- INSERT SAMPLE USER SESSIONS
-- ============================================================================

INSERT INTO user_sessions (id, user_id, device_name, device_type, platform, browser, ip_address, user_agent, location, expires_at, last_activity) VALUES
('sess-admin-001', 'test-admin-001', 'Admin Desktop', 'desktop', 'Windows', 'Chrome', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Noida, UP', DATE_ADD(NOW(), INTERVAL 1 HOUR), NOW()),
('sess-op-001', 'test-op-001', 'Field Tablet', 'tablet', 'Android', 'Chrome Mobile', '192.168.1.101', 'Mozilla/5.0 (Linux; Android 11; Tablet) AppleWebKit/537.36', 'New Delhi, DL', DATE_ADD(NOW(), INTERVAL 30 MINUTE), NOW()),
('sess-view-001', 'test-view-001', 'Monitor Station', 'desktop', 'Windows', 'Edge', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'New Delhi, DL', DATE_ADD(NOW(), INTERVAL 30 MINUTE), NOW());

-- ============================================================================
-- INSERT SAMPLE NOTIFICATIONS
-- ============================================================================

INSERT INTO user_notifications (id, user_id, title, message, type, priority, channel) VALUES
('notif-001', 'test-admin-001', 'System Health Check', 'All systems operational. Weekly maintenance scheduled for Sunday 2 AM.', 'info', 'normal', 'in_app'),
('notif-002', 'test-op-001', 'New Tourist Registration', 'Tourist group from Japan registered in your zone. Please verify documents.', 'info', 'normal', 'in_app'),
('notif-003', 'test-emr-001', 'Emergency Alert', 'Medical emergency reported at Red Fort. Immediate response required.', 'error', 'urgent', 'in_app'),
('notif-004', 'test-view-001', 'Zone Boundary Update', 'Safety zone boundaries updated for India Gate area.', 'info', 'normal', 'in_app'),
('notif-005', 'test-ana-001', 'Weekly Report Ready', 'Tourist safety analytics report for this week is ready for review.', 'success', 'normal', 'in_app');

-- ============================================================================
-- INSERT SAMPLE API KEYS
-- ============================================================================

INSERT INTO api_keys (id, name, key_hash, key_prefix, user_id, permissions, rate_limit, expires_at) VALUES
('api-key-001', 'Mobile App Integration', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tss_mobile_', 'test-admin-001', '["view_tourists", "create_tourist", "view_alerts"]', 5000, DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('api-key-002', 'Analytics Dashboard', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tss_analytics_', 'test-ana-001', '["view_analytics", "export_data"]', 1000, DATE_ADD(NOW(), INTERVAL 6 MONTH));

-- ============================================================================
-- INSERT SYSTEM SETTINGS
-- ============================================================================

INSERT INTO system_settings (id, key_name, value, data_type, description, category, is_public) VALUES
('set-001', 'app.name', 'Smart Tourist Safety System', 'string', 'Application name', 'general', true),
('set-002', 'app.version', '1.0.0', 'string', 'Current application version', 'general', true),
('set-003', 'auth.session_timeout', '30', 'number', 'Default session timeout in minutes', 'security', false),
('set-004', 'auth.max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', 'security', false),
('set-005', 'auth.require_2fa', 'false', 'boolean', 'Require two-factor authentication', 'security', false),
('set-006', 'notification.email_enabled', 'true', 'boolean', 'Enable email notifications', 'notifications', false),
('set-007', 'notification.sms_enabled', 'true', 'boolean', 'Enable SMS notifications', 'notifications', false),
('set-008', 'system.timezone', 'Asia/Kolkata', 'string', 'System default timezone', 'general', true),
('set-009', 'system.language', 'en', 'string', 'Default system language', 'general', true),
('set-010', 'emergency.response_time', '5', 'number', 'Emergency response time in minutes', 'emergency', true);

-- ============================================================================
-- INSERT SAMPLE AUDIT LOGS
-- ============================================================================

INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) VALUES
('audit-001', 'test-admin-001', 'USER_LOGIN', 'user', 'test-admin-001', '{}', '{"login_time": "' || NOW() || '", "ip": "192.168.1.100"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('audit-002', 'test-op-001', 'TOURIST_CREATED', 'tourist', 'tourist-001', '{}', '{"name": "John Doe", "nationality": "USA", "created_by": "test-op-001"}', '192.168.1.101', 'Mozilla/5.0 (Linux; Android 11; Tablet) AppleWebKit/537.36'),
('audit-003', 'test-emr-001', 'ALERT_CREATED', 'alert', 'alert-001', '{}', '{"type": "medical_emergency", "location": "Red Fort", "severity": "high"}', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('audit-004', 'system', 'SYSTEM_STARTUP', 'system', 'main', '{}', '{"startup_time": "' || NOW() || '", "version": "1.0.0"}', '127.0.0.1', 'System Process'),
('audit-005', 'test-ana-001', 'REPORT_GENERATED', 'report', 'weekly-001', '{}', '{"report_type": "weekly_safety", "period": "2025-09-08_to_2025-09-15"}', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- ============================================================================
-- UPDATE DEPARTMENT HEADS
-- ============================================================================

UPDATE departments SET head_user_id = 'test-admin-001' WHERE id = 'dept-admin';
UPDATE departments SET head_user_id = 'test-op-001' WHERE id = 'dept-operations';
UPDATE departments SET head_user_id = 'test-view-001' WHERE id = 'dept-monitoring';
UPDATE departments SET head_user_id = 'test-emr-001' WHERE id = 'dept-emergency';
UPDATE departments SET head_user_id = 'test-ana-001' WHERE id = 'dept-technology';

-- ============================================================================
-- CREATE SAMPLE USER ROLE PERMISSIONS (Individual overrides)
-- ============================================================================

-- Give analyst special permission to manage dashboard
INSERT INTO user_role_permissions (id, user_id, permission_id, granted, granted_by, reason) VALUES
('urp-001', 'test-ana-001', 'perm-manage-dashboard', true, 'test-admin-001', 'Special permission for analytics dashboard management');

-- Remove delete permission from one operator
INSERT INTO user_role_permissions (id, user_id, permission_id, granted, granted_by, reason) VALUES
('urp-002', 'test-op-003', 'perm-delete-tourist', false, 'test-admin-001', 'Restricted delete access for junior operator');

-- ============================================================================
-- VERIFICATION QUERIES (COMMENTED FOR PRODUCTION)
-- ============================================================================

/*
-- Verify user creation
SELECT 
    u.id, u.email, u.name, r.display_name as role, d.name as department,
    p.first_name, p.last_name, p.employee_id
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE u.id LIKE 'test-%'
ORDER BY r.level DESC, u.name;

-- Verify role permissions
SELECT 
    r.display_name as role,
    COUNT(rp.permission_id) as permission_count,
    GROUP_CONCAT(p.name SEPARATOR ', ') as permissions
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.is_active = true
GROUP BY r.id, r.display_name
ORDER BY r.level DESC;

-- Verify user permissions (combining role and individual)
SELECT 
    u.name as user_name,
    r.display_name as role,
    COUNT(DISTINCT up.permission_id) as total_permissions
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN user_permissions up ON u.id = up.user_id
WHERE u.id LIKE 'test-%'
GROUP BY u.id, u.name, r.display_name
ORDER BY total_permissions DESC;
*/

-- ============================================================================
-- COMPLETION LOG
-- ============================================================================

INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) VALUES
(CONCAT('audit-', UUID()), 'system', 'SEED_DATA_COMPLETE', 'database', 'test_users_seed', '{}', JSON_OBJECT('message', 'Test users seed data inserted successfully', 'timestamp', NOW()), '127.0.0.1', 'Database Seed Script');