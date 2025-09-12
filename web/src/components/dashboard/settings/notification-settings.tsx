'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  Smartphone,
  AlertTriangle,
  Shield,
  MapPin,
  Users,
  Clock,
  Volume2,
  VolumeX,
  Vibrate,
  Eye,
  EyeOff,
  Settings,
  Plus,
  X,
  Check,
  Info,
  Zap,
  Moon,
  Sun,
  Globe,
  Calendar,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationChannel {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  webhook?: boolean;
}

interface NotificationPreferences {
  // Alert Types
  emergencyAlerts: NotificationChannel;
  safetyAlerts: NotificationChannel;
  systemAlerts: NotificationChannel;
  touristUpdates: NotificationChannel;
  zoneAlerts: NotificationChannel;
  weatherAlerts: NotificationChannel;
  
  // Timing & Frequency
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  
  // Delivery Preferences
  deliveryMethod: 'immediate' | 'batched' | 'digest';
  batchInterval: number; // minutes
  digestFrequency: 'daily' | 'weekly';
  digestTime: string;
  
  // Sound & Vibration
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  soundVolume: number; // 0-100
  customSounds: {
    emergency: string;
    safety: string;
    general: string;
  };
  
  // Filtering & Priority
  minimumPriority: 'low' | 'medium' | 'high' | 'critical';
  locationBasedFiltering: boolean;
  maxDistance: number; // km
  
  // Channels Configuration
  emailSettings: {
    enabled: boolean;
    address: string;
    htmlFormat: boolean;
    includeAttachments: boolean;
  };
  
  smsSettings: {
    enabled: boolean;
    phoneNumber: string;
    shortFormat: boolean;
  };
  
  pushSettings: {
    enabled: boolean;
    showOnLockScreen: boolean;
    showPreview: boolean;
    groupNotifications: boolean;
  };
  
  // Emergency Contacts
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
    priority: number;
    alertTypes: string[];
    enabled: boolean;
  }>;
  
  // Escalation Rules
  escalationRules: Array<{
    id: string;
    name: string;
    triggerAfter: number; // minutes
    alertTypes: string[];
    actions: Array<{
      type: 'call' | 'sms' | 'email';
      target: string;
      message: string;
    }>;
    enabled: boolean;
  }>;
  
  // Advanced Settings
  duplicateDetection: boolean;
  smartFiltering: boolean;
  machineLearningOptimization: boolean;
  crossPlatformSync: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences | undefined;
  onChange: (changes: Partial<NotificationPreferences>) => void;
  pendingChanges: Partial<NotificationPreferences>;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onChange,
  pendingChanges,
}) => {
  const [activeSection, setActiveSection] = useState<string>('alerts');
  
  // Default preferences
  const defaultPreferences: NotificationPreferences = {
    emergencyAlerts: { email: true, sms: true, push: true, inApp: true, webhook: false },
    safetyAlerts: { email: true, sms: false, push: true, inApp: true, webhook: false },
    systemAlerts: { email: false, sms: false, push: true, inApp: true, webhook: false },
    touristUpdates: { email: true, sms: false, push: false, inApp: true, webhook: false },
    zoneAlerts: { email: false, sms: false, push: true, inApp: true, webhook: false },
    weatherAlerts: { email: false, sms: false, push: true, inApp: false, webhook: false },
    
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      timezone: 'Asia/Kolkata',
    },
    
    deliveryMethod: 'immediate',
    batchInterval: 15,
    digestFrequency: 'daily',
    digestTime: '08:00',
    
    soundEnabled: true,
    vibrationEnabled: true,
    soundVolume: 75,
    customSounds: {
      emergency: 'alarm',
      safety: 'bell',
      general: 'notification',
    },
    
    minimumPriority: 'medium',
    locationBasedFiltering: true,
    maxDistance: 50,
    
    emailSettings: {
      enabled: true,
      address: '',
      htmlFormat: true,
      includeAttachments: false,
    },
    
    smsSettings: {
      enabled: false,
      phoneNumber: '',
      shortFormat: true,
    },
    
    pushSettings: {
      enabled: true,
      showOnLockScreen: true,
      showPreview: true,
      groupNotifications: true,
    },
    
    emergencyContacts: [],
    escalationRules: [],
    
    duplicateDetection: true,
    smartFiltering: true,
    machineLearningOptimization: false,
    crossPlatformSync: true,
  };

  // Merge with defaults and pending changes
  const currentPreferences = {
    ...defaultPreferences,
    ...preferences,
    ...pendingChanges,
  };

  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    onChange({ [key]: value });
  };

  const updateNestedPreference = <T extends keyof NotificationPreferences>(
    parent: T,
    key: keyof NotificationPreferences[T],
    value: any
  ) => {
    const current = currentPreferences[parent] as any;
    updatePreference(parent, { ...current, [key]: value });
  };

  const updateChannelPreference = (
    alertType: keyof Pick<NotificationPreferences, 'emergencyAlerts' | 'safetyAlerts' | 'systemAlerts' | 'touristUpdates' | 'zoneAlerts' | 'weatherAlerts'>,
    channel: keyof NotificationChannel,
    value: boolean
  ) => {
    const current = currentPreferences[alertType] as NotificationChannel;
    updatePreference(alertType, { ...current, [channel]: value });
  };

  const addEmergencyContact = () => {
    const newContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: '',
      priority: 1,
      alertTypes: ['emergency'],
      enabled: true,
    };
    
    updatePreference('emergencyContacts', [
      ...currentPreferences.emergencyContacts,
      newContact,
    ]);
  };

  const updateEmergencyContact = (id: string, updates: Partial<NotificationPreferences['emergencyContacts'][0]>) => {
    const updated = currentPreferences.emergencyContacts.map(contact =>
      contact.id === id ? { ...contact, ...updates } : contact
    );
    updatePreference('emergencyContacts', updated);
  };

  const removeEmergencyContact = (id: string) => {
    const filtered = currentPreferences.emergencyContacts.filter(contact => contact.id !== id);
    updatePreference('emergencyContacts', filtered);
  };

  const sections = [
    {
      id: 'alerts',
      title: 'Alert Types',
      icon: Bell,
      description: 'Configure notification preferences for different alert types',
    },
    {
      id: 'channels',
      title: 'Delivery Channels',
      icon: MessageSquare,
      description: 'Set up email, SMS, and push notification settings',
    },
    {
      id: 'timing',
      title: 'Timing & Schedule',
      icon: Clock,
      description: 'Configure when and how often to receive notifications',
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      icon: Users,
      description: 'Manage emergency contacts and escalation rules',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: Settings,
      description: 'Smart filtering and advanced notification features',
    },
  ];

  const alertTypes = [
    {
      key: 'emergencyAlerts' as const,
      title: 'Emergency Alerts',
      description: 'Critical alerts requiring immediate attention',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      key: 'safetyAlerts' as const,
      title: 'Safety Alerts',
      description: 'Important safety information and warnings',
      icon: Shield,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      key: 'systemAlerts' as const,
      title: 'System Alerts',
      description: 'System status and maintenance notifications',
      icon: Settings,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      key: 'touristUpdates' as const,
      title: 'Tourist Updates',
      description: 'Updates about tourist activities and status',
      icon: Users,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      key: 'zoneAlerts' as const,
      title: 'Zone Alerts',
      description: 'Notifications about zone entries and exits',
      icon: MapPin,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      key: 'weatherAlerts' as const,
      title: 'Weather Alerts',
      description: 'Weather warnings and updates',
      icon: Globe,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
  ];

  const renderChannelToggle = (
    alertType: typeof alertTypes[0]['key'],
    channel: keyof NotificationChannel,
    icon: React.ComponentType<{ className?: string }>
  ) => {
    const Icon = icon;
    const enabled = currentPreferences[alertType][channel];

    return (
      <button
        onClick={() => updateChannelPreference(alertType, channel, !enabled)}
        className={cn(
          'p-2 rounded-lg border-2 transition-colors',
          enabled
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 text-gray-400 hover:border-gray-300'
        )}
        title={`${channel.toUpperCase()} notifications`}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  };

  const renderAlertSettings = () => (
    <div className="space-y-6">
      {/* Alert Types Configuration */}
      <div className="space-y-4">
        {alertTypes.map((alertType) => {
          const Icon = alertType.icon;
          return (
            <div key={alertType.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className={cn('rounded-lg p-2', alertType.bgColor)}>
                  <Icon className={cn('h-5 w-5', alertType.iconColor)} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{alertType.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{alertType.description}</p>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Channels:</span>
                    {renderChannelToggle(alertType.key, 'email', Mail)}
                    {renderChannelToggle(alertType.key, 'sms', MessageSquare)}
                    {renderChannelToggle(alertType.key, 'push', Smartphone)}
                    {renderChannelToggle(alertType.key, 'inApp', Bell)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Settings */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Global Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Priority Level
            </label>
            <select
              value={currentPreferences.minimumPriority}
              onChange={(e) => updatePreference('minimumPriority', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low - All notifications</option>
              <option value="medium">Medium - Important and above</option>
              <option value="high">High - High priority only</option>
              <option value="critical">Critical - Emergency only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Location-Based Filtering</div>
              <div className="text-sm text-gray-600">Only receive alerts relevant to your location</div>
            </div>
            <button
              onClick={() => updatePreference('locationBasedFiltering', !currentPreferences.locationBasedFiltering)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                currentPreferences.locationBasedFiltering ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  currentPreferences.locationBasedFiltering ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {currentPreferences.locationBasedFiltering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Distance: {currentPreferences.maxDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={currentPreferences.maxDistance}
                onChange={(e) => updatePreference('maxDistance', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChannelSettings = () => (
    <div className="space-y-6">
      {/* Email Settings */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 rounded-lg p-2">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Configure email delivery settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
            <button
              onClick={() => updateNestedPreference('emailSettings', 'enabled', !currentPreferences.emailSettings.enabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                currentPreferences.emailSettings.enabled ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  currentPreferences.emailSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {currentPreferences.emailSettings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentPreferences.emailSettings.address}
                  onChange={(e) => updateNestedPreference('emailSettings', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">HTML Format</span>
                <button
                  onClick={() => updateNestedPreference('emailSettings', 'htmlFormat', !currentPreferences.emailSettings.htmlFormat)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    currentPreferences.emailSettings.htmlFormat ? 'bg-blue-600' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      currentPreferences.emailSettings.htmlFormat ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SMS Settings */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-100 rounded-lg p-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Configure SMS delivery settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enable SMS Notifications</span>
            <button
              onClick={() => updateNestedPreference('smsSettings', 'enabled', !currentPreferences.smsSettings.enabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                currentPreferences.smsSettings.enabled ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  currentPreferences.smsSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {currentPreferences.smsSettings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={currentPreferences.smsSettings.phoneNumber}
                  onChange={(e) => updateNestedPreference('smsSettings', 'phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Short Format</span>
                <button
                  onClick={() => updateNestedPreference('smsSettings', 'shortFormat', !currentPreferences.smsSettings.shortFormat)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    currentPreferences.smsSettings.shortFormat ? 'bg-blue-600' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      currentPreferences.smsSettings.shortFormat ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Push Settings */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-100 rounded-lg p-2">
            <Smartphone className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Configure mobile and desktop push notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'enabled', label: 'Enable Push Notifications' },
            { key: 'showOnLockScreen', label: 'Show on Lock Screen' },
            { key: 'showPreview', label: 'Show Message Preview' },
            { key: 'groupNotifications', label: 'Group Related Notifications' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{setting.label}</span>
              <button
                onClick={() => updateNestedPreference('pushSettings', setting.key as any, !currentPreferences.pushSettings[setting.key as keyof typeof currentPreferences.pushSettings])}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  currentPreferences.pushSettings[setting.key as keyof typeof currentPreferences.pushSettings] ? 'bg-blue-600' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    currentPreferences.pushSettings[setting.key as keyof typeof currentPreferences.pushSettings] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimingSettings = () => (
    <div className="space-y-6">
      {/* Delivery Method */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Delivery Method</h4>
        <div className="space-y-3">
          {[
            { value: 'immediate', label: 'Immediate', description: 'Send notifications right away' },
            { value: 'batched', label: 'Batched', description: 'Group notifications together' },
            { value: 'digest', label: 'Digest', description: 'Send summary at scheduled times' },
          ].map((method) => (
            <label key={method.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                value={method.value}
                checked={currentPreferences.deliveryMethod === method.value}
                onChange={(e) => updatePreference('deliveryMethod', e.target.value as any)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900">{method.label}</div>
                <div className="text-sm text-gray-600">{method.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">Quiet Hours</h4>
            <p className="text-sm text-gray-600">Reduce notifications during specific hours</p>
          </div>
          <button
            onClick={() => updateNestedPreference('quietHours', 'enabled', !currentPreferences.quietHours.enabled)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              currentPreferences.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                currentPreferences.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {currentPreferences.quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={currentPreferences.quietHours.startTime}
                onChange={(e) => updateNestedPreference('quietHours', 'startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={currentPreferences.quietHours.endTime}
                onChange={(e) => updateNestedPreference('quietHours', 'endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sound Settings */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Sound & Vibration</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enable Sounds</span>
            <button
              onClick={() => updatePreference('soundEnabled', !currentPreferences.soundEnabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                currentPreferences.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  currentPreferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {currentPreferences.soundEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {currentPreferences.soundVolume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={currentPreferences.soundVolume}
                onChange={(e) => updatePreference('soundVolume', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enable Vibration</span>
            <button
              onClick={() => updatePreference('vibrationEnabled', !currentPreferences.vibrationEnabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                currentPreferences.vibrationEnabled ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  currentPreferences.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactsSettings = () => (
    <div className="space-y-6">
      {/* Emergency Contacts */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">Emergency Contacts</h4>
            <p className="text-sm text-gray-600">People to notify in case of emergencies</p>
          </div>
          <button
            onClick={addEmergencyContact}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        {currentPreferences.emergencyContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No emergency contacts added yet.</p>
            <p className="text-sm">Add contacts to notify them during emergencies.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentPreferences.emergencyContacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {contact.name || 'Unnamed Contact'}
                    </span>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs',
                      contact.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    )}>
                      {contact.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(contact.id, { name: e.target.value })}
                    placeholder="Full name"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={contact.relationship}
                    onChange={(e) => updateEmergencyContact(contact.id, { relationship: e.target.value })}
                    placeholder="Relationship"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateEmergencyContact(contact.id, { phone: e.target.value })}
                    placeholder="Phone number"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateEmergencyContact(contact.id, { email: e.target.value })}
                    placeholder="Email address"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      {/* Smart Features */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Smart Features</h4>
        <div className="space-y-4">
          {[
            {
              key: 'duplicateDetection',
              label: 'Duplicate Detection',
              description: 'Prevent duplicate notifications for the same event',
            },
            {
              key: 'smartFiltering',
              label: 'Smart Filtering',
              description: 'Use AI to filter irrelevant notifications',
            },
            {
              key: 'machineLearningOptimization',
              label: 'Learning Optimization',
              description: 'Learn from your preferences to improve notifications',
            },
            {
              key: 'crossPlatformSync',
              label: 'Cross-Platform Sync',
              description: 'Sync notification settings across all devices',
            },
          ].map((feature) => (
            <div key={feature.key} className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{feature.label}</div>
                <div className="text-sm text-gray-600">{feature.description}</div>
              </div>
              <button
                onClick={() => updatePreference(feature.key as keyof NotificationPreferences, !currentPreferences[feature.key as keyof NotificationPreferences])}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  currentPreferences[feature.key as keyof NotificationPreferences] ? 'bg-blue-600' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    currentPreferences[feature.key as keyof NotificationPreferences] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'alerts':
        return renderAlertSettings();
      case 'channels':
        return renderChannelSettings();
      case 'timing':
        return renderTimingSettings();
      case 'contacts':
        return renderContactsSettings();
      case 'advanced':
        return renderAdvancedSettings();
      default:
        return renderAlertSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-colors',
                isActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )} />
                <span className={cn(
                  'font-medium',
                  isActive ? 'text-blue-900' : 'text-gray-900'
                )}>
                  {section.title}
                </span>
              </div>
              <p className={cn(
                'text-sm',
                isActive ? 'text-blue-700' : 'text-gray-600'
              )}>
                {section.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {(() => {
              const activeSection_data = sections.find(s => s.id === activeSection);
              const Icon = activeSection_data?.icon || Bell;
              return (
                <>
                  <div className="bg-blue-100 rounded-lg p-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activeSection_data?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeSection_data?.description}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
        <div className="p-6">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};