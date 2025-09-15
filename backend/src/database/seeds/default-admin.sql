-- ============================================================================
-- Smart Tourist Safety System - Default Admin Account Setup
-- Creates default administrator account for initial system access
-- ============================================================================

-- Create default admin user profile
INSERT INTO user_profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    role,
    department,
    permissions,
    is_active,
    created_at,
    updated_at,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Fixed UUID for default admin
    'admin@touristsafety.gov.in',
    'System Administrator',
    'System',
    'Administrator',
    'super_admin',
    'Information Technology',
    ARRAY[
        'system.manage_users',
        'system.configure',
        'system.backup',
        'system.manage_roles',
        'analytics.view',
        'analytics.export',
        'tourists.view',
        'tourists.create',
        'tourists.edit',
        'tourists.delete',
        'alerts.view',
        'alerts.create',
        'alerts.edit',
        'alerts.resolve',
        'emergency.respond',
        'zones.view',
        'zones.create',
        'zones.edit',
        'zones.delete',
        'blockchain.view',
        'blockchain.generate_identity',
        'blockchain.verify_identity',
        'reports.generate',
        'reports.export'
    ],
    true,
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    is_active = true;

-- Create secondary admin user for backup access
INSERT INTO user_profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    role,
    department,
    permissions,
    is_active,
    created_at,
    updated_at,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000002', -- Fixed UUID for backup admin
    'backup.admin@touristsafety.gov.in',
    'Backup Administrator',
    'Backup',
    'Administrator',
    'admin',
    'Information Technology',
    ARRAY[
        'system.manage_users',
        'system.configure',
        'analytics.view',
        'analytics.export',
        'tourists.view',
        'tourists.create',
        'tourists.edit',
        'alerts.view',
        'alerts.create',
        'alerts.edit',
        'alerts.resolve',
        'emergency.respond',
        'zones.view',
        'zones.create',
        'zones.edit',
        'blockchain.view',
        'blockchain.generate_identity',
        'blockchain.verify_identity',
        'reports.generate',
        'reports.export'
    ],
    true,
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    is_active = true;

-- Create demo operator user for testing
INSERT INTO user_profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    role,
    department,
    permissions,
    is_active,
    created_at,
    updated_at,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000003', -- Fixed UUID for demo operator
    'operator@touristsafety.gov.in',
    'Demo Operator',
    'Demo',
    'Operator',
    'operator',
    'Emergency Response',
    ARRAY[
        'analytics.view',
        'tourists.view',
        'tourists.create',
        'tourists.edit',
        'alerts.view',
        'alerts.create',
        'alerts.edit',
        'alerts.resolve',
        'emergency.respond',
        'zones.view',
        'blockchain.view',
        'blockchain.verify_identity',
        'reports.generate'
    ],
    true,
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    is_active = true;

-- Create demo analyst user for testing
INSERT INTO user_profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    role,
    department,
    permissions,
    is_active,
    created_at,
    updated_at,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000004', -- Fixed UUID for demo analyst
    'analyst@touristsafety.gov.in',
    'Demo Analyst',
    'Demo',
    'Analyst',
    'analyst',
    'Data Analytics',
    ARRAY[
        'analytics.view',
        'analytics.export',
        'tourists.view',
        'alerts.view',
        'zones.view',
        'blockchain.view',
        'reports.generate',
        'reports.export'
    ],
    true,
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    is_active = true;

-- Create demo field agent user for testing
INSERT INTO user_profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    role,
    department,
    badge_number,
    permissions,
    is_active,
    created_at,
    updated_at,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000005', -- Fixed UUID for demo field agent
    'field.agent@touristsafety.gov.in',
    'Demo Field Agent',
    'Demo',
    'Field Agent',
    'field_agent',
    'Field Operations',
    'FA001',
    ARRAY[
        'tourists.view',
        'alerts.view',
        'alerts.create',
        'emergency.respond',
        'zones.view',
        'blockchain.verify_identity'
    ],
    true,
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    is_active = true;

-- Insert sample departments for reference
INSERT INTO departments (
    id,
    name,
    description,
    head_of_department,
    contact_email,
    contact_phone,
    is_active,
    created_at,
    updated_at
) VALUES 
    (
        'dept_001',
        'Information Technology',
        'IT Department responsible for system administration and technical support',
        'System Administrator',
        'it@touristsafety.gov.in',
        '+91-11-12345001',
        true,
        NOW(),
        NOW()
    ),
    (
        'dept_002',
        'Emergency Response',
        'Emergency response and crisis management department',
        'Emergency Response Chief',
        'emergency@touristsafety.gov.in',
        '+91-11-12345002',
        true,
        NOW(),
        NOW()
    ),
    (
        'dept_003',
        'Data Analytics',
        'Data analysis and reporting department',
        'Chief Data Analyst',
        'analytics@touristsafety.gov.in',
        '+91-11-12345003',
        true,
        NOW(),
        NOW()
    ),
    (
        'dept_004',
        'Field Operations',
        'Field operations and on-ground response teams',
        'Field Operations Manager',
        'field@touristsafety.gov.in',
        '+91-11-12345004',
        true,
        NOW(),
        NOW()
    ),
    (
        'dept_005',
        'Tourism Department',
        'Government tourism department liaison',
        'Tourism Director',
        'tourism@touristsafety.gov.in',
        '+91-11-12345005',
        true,
        NOW(),
        NOW()
    ),
    (
        'dept_006',
        'Police Administration',
        'Police department coordination and response',
        'Police Commissioner',
        'police@touristsafety.gov.in',
        '+91-100',
        true,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    is_active = true;

-- Insert default system settings
INSERT INTO system_settings (
    key,
    value,
    description,
    category,
    is_public,
    created_at,
    updated_at
) VALUES 
    (
        'default_user_role',
        'operator',
        'Default role assigned to new users',
        'user_management',
        false,
        NOW(),
        NOW()
    ),
    (
        'require_email_verification',
        'true',
        'Whether new users must verify their email address',
        'security',
        false,
        NOW(),
        NOW()
    ),
    (
        'password_min_length',
        '8',
        'Minimum password length requirement',
        'security',
        false,
        NOW(),
        NOW()
    ),
    (
        'session_timeout_minutes',
        '480',
        'User session timeout in minutes (8 hours)',
        'security',
        false,
        NOW(),
        NOW()
    ),
    (
        'max_failed_login_attempts',
        '5',
        'Maximum failed login attempts before account lockout',
        'security',
        false,
        NOW(),
        NOW()
    ),
    (
        'system_maintenance_mode',
        'false',
        'Enable system maintenance mode',
        'system',
        true,
        NOW(),
        NOW()
    ),
    (
        'emergency_contact_number',
        '+91-112',
        'Primary emergency contact number',
        'emergency',
        true,
        NOW(),
        NOW()
    ),
    (
        'system_timezone',
        'Asia/Kolkata',
        'Default system timezone',
        'system',
        false,
        NOW(),
        NOW()
    )
ON CONFLICT (key) DO UPDATE SET
    updated_at = NOW();

-- Create audit log entry for default admin creation
INSERT INTO audit_logs (
    id,
    user_id,
    action,
    resource_type,
    resource_id,
    changes,
    ip_address,
    user_agent,
    created_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'CREATE_DEFAULT_ADMIN',
    'user_profile',
    '00000000-0000-0000-0000-000000000001',
    '{"message": "Default administrator accounts created during system initialization"}',
    '127.0.0.1',
    'System Initialization',
    NOW()
);

-- Update schema version
INSERT INTO schema_versions (
    version,
    description,
    applied_at
) VALUES (
    '1.0.0',
    'Initial schema with default admin accounts',
    NOW()
)
ON CONFLICT (version) DO UPDATE SET
    applied_at = NOW();

COMMIT;

-- ============================================================================
-- IMPORTANT NOTES FOR DEPLOYMENT:
-- ============================================================================
-- 
-- 1. DEFAULT CREDENTIALS:
--    - Email: admin@touristsafety.gov.in
--    - Password: Must be set separately in Supabase Auth
--    - Role: super_admin
--
-- 2. SECURITY CHECKLIST:
--    - Change default admin password immediately after deployment
--    - Update email addresses to match your domain
--    - Review and adjust permissions as needed
--    - Enable two-factor authentication for admin accounts
--    - Set up proper backup procedures
--
-- 3. SUPABASE AUTH SETUP:
--    These SQL statements create the user profiles in the database.
--    You must also create corresponding users in Supabase Auth:
--    
--    supabase.auth.admin.createUser({
--      id: '00000000-0000-0000-0000-000000000001',
--      email: 'admin@touristsafety.gov.in',
--      password: 'your-secure-password',
--      email_confirm: true,
--      user_metadata: {
--        display_name: 'System Administrator',
--        role: 'super_admin'
--      }
--    })
--
-- 4. ENVIRONMENT VARIABLES:
--    Make sure to set appropriate environment variables:
--    - SUPABASE_URL
--    - SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY
--    - JWT_SECRET
--    - ENCRYPTION_KEY
--
-- ============================================================================