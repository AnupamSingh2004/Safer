'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Upload, 
  Camera,
  Lock,
  Bell,
  Globe,
  Clock,
  Key,
  Smartphone,
  AlertTriangle,
  Check
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/unified-theme-components';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  designation?: string;
  employeeId?: string;
  badgeNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country: string;
  pincode?: string;
  alternateEmail?: string;
  skills?: string[];
  certifications?: string[];
  notes?: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  lastPasswordChange: string;
  loginAttempts: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  alertTypes: {
    emergency: boolean;
    system: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    loadUserData();
  }, []);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockUser: UserData = {
        id: 'user-001',
        email: 'john.doe@touristsafety.com',
        name: 'John Doe',
        phone: '+91-9876543210',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
        role: 'Field Operator',
        department: 'Operations',
        isActive: true,
        lastLogin: '2025-09-15T10:30:00Z',
        createdAt: '2025-01-15T08:00:00Z'
      };

      const mockProfile: UserProfile = {
        id: 'profile-001',
        firstName: 'John',
        lastName: 'Doe',
        designation: 'Senior Field Operator',
        employeeId: 'OP001',
        badgeNumber: 'FLD001',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        nationality: 'Indian',
        emergencyContact: '+91-9876543211',
        emergencyContactName: 'Jane Doe',
        emergencyContactRelation: 'Spouse',
        addressLine1: 'Police Station, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110001',
        alternateEmail: 'john.personal@gmail.com',
        skills: ['Tourist Safety', 'Emergency Response', 'Communication'],
        certifications: ['First Aid Certified', 'Security Officer License'],
        notes: 'Experienced field operator with 8+ years in tourist safety'
      };

      const mockSecurity: SecuritySettings = {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        lastPasswordChange: '2025-08-15T08:00:00Z',
        loginAttempts: 0
      };

      const mockNotifications: NotificationSettings = {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        alertTypes: {
          emergency: true,
          system: true,
          updates: false,
          marketing: false
        }
      };

      setUser(mockUser);
      setProfile(mockProfile);
      setSecurity(mockSecurity);
      setNotifications(mockNotifications);
      setFormData(mockProfile);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      console.log('Updating profile:', formData);
      setProfile({ ...profile!, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      console.log('Changing password');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotifications = async (newSettings: NotificationSettings) => {
    setIsLoading(true);
    try {
      // Mock API call
      console.log('Updating notifications:', newSettings);
      setNotifications(newSettings);
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle2FA = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      const newSecurity = { ...security!, twoFactorEnabled: !security!.twoFactorEnabled };
      setSecurity(newSecurity);
      console.log('2FA toggled:', newSecurity.twoFactorEnabled);
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // TAB COMPONENTS
  // ============================================================================

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-600">{profile?.designation}</p>
          <p className="text-sm text-gray-500">Employee ID: {profile?.employeeId}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={isEditing ? formData.firstName || '' : profile?.firstName || ''}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={isEditing ? formData.lastName || '' : profile?.lastName || ''}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={isEditing ? formData.emergencyContact || '' : profile?.emergencyContact || ''}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                readOnly={!isEditing}
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={isEditing ? formData.designation || '' : profile?.designation || ''}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Badge Number
            </label>
            <input
              type="text"
              value={isEditing ? formData.badgeNumber || '' : profile?.badgeNumber || ''}
              onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={isEditing ? formData.dateOfBirth || '' : profile?.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                readOnly={!isEditing}
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={isEditing ? formData.gender || '' : profile?.gender || ''}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={isEditing ? formData.addressLine1 || '' : profile?.addressLine1 || ''}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={isEditing ? formData.city || '' : profile?.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={isEditing ? formData.state || '' : profile?.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code
              </label>
              <input
                type="text"
                value={isEditing ? formData.pincode || '' : profile?.pincode || ''}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={isEditing ? formData.country || '' : profile?.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={isEditing ? formData.emergencyContactName || '' : profile?.emergencyContactName || ''}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <input
                type="text"
                value={isEditing ? formData.emergencyContactRelation || '' : profile?.emergencyContactRelation || ''}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={isEditing ? formData.emergencyContact || '' : profile?.emergencyContact || ''}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={updateProfile}
              disabled={isLoading}
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

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={toggle2FA}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              security?.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              security?.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        {security?.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Two-factor authentication is enabled</span>
            </div>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={changePassword}
            disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Session Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">Automatically log out after period of inactivity</p>
            </div>
            <span className="text-sm text-gray-500">{security?.sessionTimeout} minutes</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Last Password Change</p>
              <p className="text-sm text-gray-600">When you last updated your password</p>
            </div>
            <span className="text-sm text-gray-500">
              {security?.lastPasswordChange ? new Date(security.lastPasswordChange).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
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
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <button
              onClick={() => updateNotifications({ 
                ...notifications!, 
                emailNotifications: !notifications!.emailNotifications 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications?.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
            </div>
            <button
              onClick={() => updateNotifications({ 
                ...notifications!, 
                smsNotifications: !notifications!.smsNotifications 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications?.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications in browser</p>
              </div>
            </div>
            <button
              onClick={() => updateNotifications({ 
                ...notifications!, 
                pushNotifications: !notifications!.pushNotifications 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications?.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">Emergency Alerts</p>
                <p className="text-sm text-gray-600">Critical safety and emergency notifications</p>
              </div>
            </div>
            <button
              onClick={() => updateNotifications({ 
                ...notifications!, 
                alertTypes: { ...notifications!.alertTypes, emergency: !notifications!.alertTypes.emergency }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.alertTypes.emergency ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications?.alertTypes.emergency ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">System Updates</p>
                <p className="text-sm text-gray-600">System maintenance and update notifications</p>
              </div>
            </div>
            <button
              onClick={() => updateNotifications({ 
                ...notifications!, 
                alertTypes: { ...notifications!.alertTypes, system: !notifications!.alertTypes.system }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.alertTypes.system ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications?.alertTypes.system ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Feature Updates</p>
                <p className="text-sm text-gray-600">New features and improvement notifications</p>
              </div>
            </div>
            <button
              onClick={() => updateNotifications({ 
                ...notifications!, 
                alertTypes: { ...notifications!.alertTypes, updates: !notifications!.alertTypes.updates }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.alertTypes.updates ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications?.alertTypes.updates ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 relative">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
          
          {/* Theme Switcher */}
          <div className="absolute top-0 right-0">
            <ThemeToggle variant="button" size="md" showLabel />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => {
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
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}