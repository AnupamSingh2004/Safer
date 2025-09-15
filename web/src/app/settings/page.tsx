'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  Shield,
  Bell,
  Globe,
  Users,
  Database,
  Lock,
  Key,
  Clock,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  AlertTriangle,
  Check,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Minus
} from 'lucide-react';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

interface SystemSettings {
  general: {
    appName: string;
    appVersion: string;
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    logoUrl: string;
    favicon: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    require2FA: boolean;
    allowedFileTypes: string[];
    maxFileSize: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    webhookEnabled: boolean;
    emailProvider: string;
    smsProvider: string;
    defaultSender: string;
  };
  api: {
    rateLimit: number;
    rateLimitWindow: number;
    apiKeyExpiry: number;
    allowCORS: boolean;
    corsOrigins: string[];
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    backupRetention: number;
    backupLocation: string;
  };
}

interface UserRole {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  userCount: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('super_admin'); // Mock user role
  
  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    loadSettings();
    loadRoles();
  }, []);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockSettings: SystemSettings = {
        general: {
          appName: 'Smart Tourist Safety System',
          appVersion: '1.0.0',
          timezone: 'Asia/Kolkata',
          language: 'en',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          logoUrl: '/logo.png',
          favicon: '/favicon.ico'
        },
        security: {
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecialChars: true,
          require2FA: false,
          allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
          maxFileSize: 10 // MB
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: true,
          webhookEnabled: false,
          emailProvider: 'smtp',
          smsProvider: 'twilio',
          defaultSender: 'noreply@touristsafety.com'
        },
        api: {
          rateLimit: 1000,
          rateLimitWindow: 3600,
          apiKeyExpiry: 365,
          allowCORS: true,
          corsOrigins: ['http://localhost:3000', 'https://touristsafety.com']
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          backupRetention: 30,
          backupLocation: '/backups'
        }
      };
      
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      // Mock data - replace with actual API call
      const mockRoles: UserRole[] = [
        {
          id: 'super_admin',
          name: 'super_admin',
          displayName: 'Super Administrator',
          permissions: ['all'],
          userCount: 5
        },
        {
          id: 'operator',
          name: 'operator',
          displayName: 'Field Operator',
          permissions: ['view_dashboard', 'manage_tourists', 'create_alerts'],
          userCount: 45
        },
        {
          id: 'viewer',
          name: 'viewer',
          displayName: 'Safety Viewer',
          permissions: ['view_dashboard', 'view_tourists', 'view_alerts'],
          userCount: 100
        }
      ];
      
      setRoles(mockRoles);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const saveSettings = async (section: keyof SystemSettings, data: any) => {
    setIsSaving(true);
    try {
      // Mock API call
      console.log('Saving settings:', section, data);
      
      setSettings(prev => prev ? {
        ...prev,
        [section]: { ...prev[section], ...data }
      } : null);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // PERMISSION CHECKS
  // ============================================================================

  const canManageSettings = () => {
    return userRole === 'super_admin';
  };

  const canViewSettings = () => {
    return ['super_admin', 'operator'].includes(userRole);
  };

  // ============================================================================
  // TAB COMPONENTS
  // ============================================================================

  const GeneralTab = () => {
    const [formData, setFormData] = useState(settings?.general || {});

    useEffect(() => {
      setFormData(settings?.general || {});
    }, [settings]);

    const handleSave = () => {
      saveSettings('general', formData);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Name
              </label>
              <input
                type="text"
                value={formData.appName || ''}
                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                value={formData.appVersion || ''}
                onChange={(e) => setFormData({ ...formData, appVersion: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone || ''}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <select
                value={formData.language || ''}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={formData.dateFormat || ''}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Format
              </label>
              <select
                value={formData.timeFormat || ''}
                onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              >
                <option value="24h">24 Hour</option>
                <option value="12h">12 Hour</option>
              </select>
            </div>
          </div>

          {canManageSettings() && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SecurityTab = () => {
    const [formData, setFormData] = useState(settings?.security || {});

    useEffect(() => {
      setFormData(settings?.security || {});
    }, [settings]);

    const handleSave = () => {
      saveSettings('security', formData);
    };

    return (
      <div className="space-y-6">
        {/* Authentication Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={formData.sessionTimeout || ''}
                onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={formData.maxLoginAttempts || ''}
                onChange={(e) => setFormData({ ...formData, maxLoginAttempts: parseInt(e.target.value) })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Require Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Force all users to enable 2FA</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, require2FA: !formData.require2FA })}
                disabled={!canManageSettings()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.require2FA ? 'bg-blue-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.require2FA ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Password Policy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="6"
                max="128"
                value={formData.passwordMinLength || ''}
                onChange={(e) => setFormData({ ...formData, passwordMinLength: parseInt(e.target.value) })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Require uppercase letters</span>
                <button
                  onClick={() => setFormData({ ...formData, passwordRequireUppercase: !formData.passwordRequireUppercase })}
                  disabled={!canManageSettings()}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.passwordRequireUppercase ? 'bg-blue-600' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.passwordRequireUppercase ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Require numbers</span>
                <button
                  onClick={() => setFormData({ ...formData, passwordRequireNumbers: !formData.passwordRequireNumbers })}
                  disabled={!canManageSettings()}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.passwordRequireNumbers ? 'bg-blue-600' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.passwordRequireNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Require special characters</span>
                <button
                  onClick={() => setFormData({ ...formData, passwordRequireSpecialChars: !formData.passwordRequireSpecialChars })}
                  disabled={!canManageSettings()}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.passwordRequireSpecialChars ? 'bg-blue-600' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.passwordRequireSpecialChars ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Security */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload Security</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.maxFileSize || ''}
                onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed File Types
              </label>
              <div className="flex flex-wrap gap-2">
                {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'csv', 'xlsx'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.allowedFileTypes?.includes(type) || false}
                      onChange={(e) => {
                        const types = formData.allowedFileTypes || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, allowedFileTypes: [...types, type] });
                        } else {
                          setFormData({ ...formData, allowedFileTypes: types.filter(t => t !== type) });
                        }
                      }}
                      disabled={!canManageSettings()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {canManageSettings() && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const NotificationsTab = () => {
    const [formData, setFormData] = useState(settings?.notifications || {});

    useEffect(() => {
      setFormData(settings?.notifications || {});
    }, [settings]);

    const handleSave = () => {
      saveSettings('notifications', formData);
    };

    return (
      <div className="space-y-6">
        {/* Notification Channels */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Send notifications via email</p>
                </div>
              </div>
              <button
                onClick={() => setFormData({ ...formData, emailEnabled: !formData.emailEnabled })}
                disabled={!canManageSettings()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.emailEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Send notifications via SMS</p>
                </div>
              </div>
              <button
                onClick={() => setFormData({ ...formData, smsEnabled: !formData.smsEnabled })}
                disabled={!canManageSettings()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.smsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.smsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Send browser push notifications</p>
                </div>
              </div>
              <button
                onClick={() => setFormData({ ...formData, pushEnabled: !formData.pushEnabled })}
                disabled={!canManageSettings()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.pushEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Provider Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Provider
              </label>
              <select
                value={formData.emailProvider || ''}
                onChange={(e) => setFormData({ ...formData, emailProvider: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              >
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="aws-ses">AWS SES</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Provider
              </label>
              <select
                value={formData.smsProvider || ''}
                onChange={(e) => setFormData({ ...formData, smsProvider: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              >
                <option value="twilio">Twilio</option>
                <option value="nexmo">Nexmo</option>
                <option value="aws-sns">AWS SNS</option>
                <option value="msg91">MSG91</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Sender Email
              </label>
              <input
                type="email"
                value={formData.defaultSender || ''}
                onChange={(e) => setFormData({ ...formData, defaultSender: e.target.value })}
                disabled={!canManageSettings()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {canManageSettings() && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const UserRolesTab = () => {
    if (!canViewSettings()) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">You don't have permission to view user roles and permissions.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Roles & Permissions</h3>
            <p className="text-sm text-gray-600">Manage user roles and their associated permissions</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{role.displayName}</h4>
                      <p className="text-sm text-gray-600">{role.userCount} users</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        role.name === 'super_admin' ? 'bg-red-100 text-red-700' :
                        role.name === 'operator' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {role.name}
                      </span>
                      {canManageSettings() && (
                        <button className="text-gray-400 hover:text-gray-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.slice(0, 5).map((permission, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {permission}
                      </span>
                    ))}
                    {role.permissions.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{role.permissions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="mt-2 text-gray-600">Manage system configuration and preferences</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', label: 'General', icon: Settings, available: true },
                { id: 'security', label: 'Security', icon: Shield, available: canViewSettings() },
                { id: 'notifications', label: 'Notifications', icon: Bell, available: canViewSettings() },
                { id: 'roles', label: 'User Roles', icon: Users, available: canViewSettings() }
              ].filter(tab => tab.available).map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && <GeneralTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'roles' && <UserRolesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}