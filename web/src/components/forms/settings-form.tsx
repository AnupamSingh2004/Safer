'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  Bell,
  Globe,
  Palette,
  Monitor
} from 'lucide-react';
import { LoadingButton } from '@/components/common/loading';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  bio: string;
  avatar?: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  emergencyAlerts: boolean;
  touristUpdates: boolean;
  weeklyReports: boolean;
  systemMaintenance: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  autoLogout: number;
  twoFactorEnabled: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

interface SystemSettings {
  realTimeUpdates: boolean;
  dataRefreshRate: number;
  performanceMode: 'standard' | 'high' | 'power-saver';
  debugMode: boolean;
}

// Profile Settings Form
export const ProfileSettingsForm: React.FC<{
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onSave: () => Promise<void>;
  loading?: boolean;
}> = ({ profile, onChange, onSave, loading = false }) => {
  const [showEmail, setShowEmail] = useState(true);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-600">Update your profile photo</p>
          <button className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upload Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            First Name *
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Last Name *
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline h-4 w-4 mr-1" />
          Email Address *
        </label>
        <div className="relative">
          <input
            type={showEmail ? "email" : "password"}
            value={profile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your email address"
            required
          />
          <button
            type="button"
            onClick={() => setShowEmail(!showEmail)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="inline h-4 w-4 mr-1" />
          Phone Number
        </label>
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline h-4 w-4 mr-1" />
            Department
          </label>
          <select
            value={profile.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Department</option>
            <option value="Emergency Response">Emergency Response</option>
            <option value="Tourist Services">Tourist Services</option>
            <option value="Security">Security</option>
            <option value="Administration">Administration</option>
            <option value="Analytics">Analytics</option>
            <option value="IT Support">IT Support</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="inline h-4 w-4 mr-1" />
            Role
          </label>
          <select
            value={profile.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Role</option>
            <option value="Administrator">Administrator</option>
            <option value="Senior Operator">Senior Operator</option>
            <option value="Operator">Operator</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Analyst">Analyst</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Tell us about yourself and your experience..."
          maxLength={500}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {profile.bio.length}/500 characters
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <LoadingButton
          loading={loading}
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4" />
          Save Profile
        </LoadingButton>
      </div>
    </div>
  );
};

// Notification Settings Form
export const NotificationSettingsForm: React.FC<{
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  onSave: () => Promise<void>;
  loading?: boolean;
}> = ({ settings, onChange, onSave, loading = false }) => {
  const toggleSetting = (key: keyof NotificationSettings) => {
    onChange({ ...settings, [key]: !settings[key] });
  };

  const handleInputChange = (key: keyof NotificationSettings, value: string | number) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Emergency alerts cannot be disabled for safety reasons. You will always receive critical safety notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Alert Types
        </h4>
        <div className="space-y-3">
          {[
            { 
              key: 'emergencyAlerts', 
              label: 'Emergency Alerts', 
              desc: 'Critical safety alerts and emergency situations',
              disabled: true,
              required: true
            },
            { 
              key: 'touristUpdates', 
              label: 'Tourist Updates', 
              desc: 'New tourist registrations and status changes',
              disabled: false,
              required: false
            },
            { 
              key: 'systemMaintenance', 
              label: 'System Maintenance', 
              desc: 'Scheduled maintenance and system updates',
              disabled: false,
              required: false
            },
            { 
              key: 'weeklyReports', 
              label: 'Weekly Reports', 
              desc: 'Summary reports and analytics',
              disabled: false,
              required: false
            }
          ].map(item => (
            <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  {item.required && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
              <button
                disabled={item.disabled}
                onClick={() => !item.disabled && toggleSetting(item.key as keyof NotificationSettings)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${settings[item.key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${settings[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Methods */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Delivery Methods</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'emailAlerts', label: 'Email Notifications', icon: Mail },
            { key: 'smsAlerts', label: 'SMS Alerts', icon: Phone },
            { key: 'pushNotifications', label: 'Push Notifications', icon: Bell }
          ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => toggleSetting(item.key as keyof NotificationSettings)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                  ${settings[item.key as keyof NotificationSettings] 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${settings[item.key as keyof NotificationSettings] ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="mt-2">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    settings[item.key as keyof NotificationSettings] 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {settings[item.key as keyof NotificationSettings] ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiet Hours */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Quiet Hours</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Enable Quiet Hours</div>
              <div className="text-sm text-gray-600">Reduce non-emergency notifications during specified hours</div>
            </div>
            <button
              onClick={() => toggleSetting('quietHours')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.quietHours ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.quietHours ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {settings.quietHours && (
            <div className="grid grid-cols-2 gap-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.quietStart}
                  onChange={(e) => handleInputChange('quietStart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.quietEnd}
                  onChange={(e) => handleInputChange('quietEnd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <LoadingButton
          loading={loading}
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4" />
          Save Notification Settings
        </LoadingButton>
      </div>
    </div>
  );
};

// Security Settings Form
export const SecuritySettingsForm: React.FC<{
  settings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
  onSave: () => Promise<void>;
  loading?: boolean;
}> = ({ settings, onChange, onSave, loading = false }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof SecuritySettings, value: string | number | boolean) => {
    onChange({ ...settings, [field]: value });
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(settings.newPassword);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Change Password
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={settings.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={settings.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {settings.newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${strengthColors[strength - 1] || 'bg-gray-200'} transition-all`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {strengthLabels[strength - 1] || 'Very Weak'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Password must contain: 8+ characters, uppercase, number, special character
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={settings.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  settings.confirmPassword && settings.newPassword !== settings.confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {settings.confirmPassword && settings.newPassword !== settings.confirmPassword && (
              <div className="text-xs text-red-600 mt-1">
                Passwords do not match
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Session Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Auto Logout</div>
              <div className="text-sm text-gray-600">Automatically log out after period of inactivity</div>
            </div>
            <select
              value={settings.autoLogout}
              onChange={(e) => handleInputChange('autoLogout', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
            </div>
            <button
              onClick={() => handleInputChange('twoFactorEnabled', !settings.twoFactorEnabled)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <LoadingButton
          loading={loading}
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={
            !settings.currentPassword || 
            !settings.newPassword || 
            settings.newPassword !== settings.confirmPassword ||
            strength < 3
          }
        >
          <Save className="h-4 w-4" />
          Update Security Settings
        </LoadingButton>
      </div>
    </div>
  );
};
