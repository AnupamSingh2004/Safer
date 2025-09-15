'use client';

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Palette, 
  Globe, 
  Clock, 
  Map,
  Database,
  Wifi,
  Shield,
  Eye,
  Sun,
  Moon,
  Smartphone,
  Laptop,
  Settings,
  Zap,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Save,
  Check,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedTheme } from '@/lib/theme/unified-theme-provider';

type ThemeMode = 'light' | 'dark' | 'system';

interface SystemPreferences {
  // Display & Theme
  theme: ThemeMode;
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  
  // Language & Region
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  numberFormat: 'US' | 'EU' | 'IN';
  
  // Dashboard & Interface
  defaultView: 'overview' | 'map' | 'alerts' | 'tourists';
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  showWelcomeMessage: boolean;
  enableKeyboardShortcuts: boolean;
  enableTooltips: boolean;
  
  // Map Settings
  mapProvider: 'google' | 'openstreetmap' | 'mapbox';
  mapStyle: 'standard' | 'satellite' | 'terrain' | 'dark';
  defaultZoom: number;
  showTraffic: boolean;
  showPublicTransit: boolean;
  enableGeolocation: boolean;
  
  // Data & Performance
  dataRetention: number; // days
  cacheDuration: number; // hours
  enableOfflineMode: boolean;
  dataSyncFrequency: number; // minutes
  enableBackgroundSync: boolean;
  
  // Notifications & Sounds
  enableSounds: boolean;
  soundVolume: number; // 0-100
  enableHaptics: boolean;
  notificationPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  // Security & Privacy
  sessionTimeout: number; // minutes
  enableTwoFactor: boolean;
  showOnlineStatus: boolean;
  enableLocationTracking: boolean;
  dataSharing: 'none' | 'anonymized' | 'full';
  
  // Advanced
  developerMode: boolean;
  enableDebugLogs: boolean;
  apiTimeout: number; // seconds
  maxRetries: number;
  enableBetaFeatures: boolean;
}

interface SystemSettingsProps {
  preferences: SystemPreferences | undefined;
  onChange: (changes: Partial<SystemPreferences>) => void;
  pendingChanges: Partial<SystemPreferences>;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  preferences,
  onChange,
  pendingChanges,
}) => {
  const [activeSection, setActiveSection] = useState<string>('display');
  
  // Default values
  const defaultPreferences: SystemPreferences = {
    theme: 'light',
    colorScheme: 'blue',
    fontSize: 'medium',
    compactMode: false,
    highContrast: false,
    reduceMotion: false,
    language: 'English',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'INR',
    numberFormat: 'IN',
    defaultView: 'overview',
    autoRefresh: true,
    refreshInterval: 30,
    showWelcomeMessage: true,
    enableKeyboardShortcuts: true,
    enableTooltips: true,
    mapProvider: 'google',
    mapStyle: 'standard',
    defaultZoom: 10,
    showTraffic: true,
    showPublicTransit: false,
    enableGeolocation: true,
    dataRetention: 90,
    cacheDuration: 24,
    enableOfflineMode: false,
    dataSyncFrequency: 5,
    enableBackgroundSync: true,
    enableSounds: true,
    soundVolume: 75,
    enableHaptics: true,
    notificationPosition: 'top-right',
    sessionTimeout: 60,
    enableTwoFactor: false,
    showOnlineStatus: true,
    enableLocationTracking: true,
    dataSharing: 'anonymized',
    developerMode: false,
    enableDebugLogs: false,
    apiTimeout: 30,
    maxRetries: 3,
    enableBetaFeatures: false,
  };

  // Merge with defaults and pending changes
  const currentPreferences = {
    ...defaultPreferences,
    ...preferences,
    ...pendingChanges,
  };

  const updatePreference = <K extends keyof SystemPreferences>(
    key: K,
    value: SystemPreferences[K]
  ) => {
    onChange({ [key]: value });
  };

  const resetToDefaults = () => {
    onChange(defaultPreferences);
  };

  const sections = [
    {
      id: 'display',
      title: 'Display & Theme',
      icon: Palette,
      description: 'Customize the appearance and theme',
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: Globe,
      description: 'Language, timezone, and format settings',
    },
    {
      id: 'interface',
      title: 'Interface',
      icon: Monitor,
      description: 'Dashboard layout and behavior settings',
    },
    {
      id: 'map',
      title: 'Map Settings',
      icon: Map,
      description: 'Map provider and display preferences',
    },
    {
      id: 'data',
      title: 'Data & Performance',
      icon: Database,
      description: 'Data storage and synchronization settings',
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      description: 'Security and privacy preferences',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: Settings,
      description: 'Developer and advanced system settings',
    },
  ];

  const renderToggle = (
    label: string,
    key: keyof SystemPreferences,
    description?: string,
    icon?: React.ComponentType<{ className?: string }>
  ) => {
    const Icon = icon;
    const value = currentPreferences[key] as boolean;

    return (
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="bg-gray-100 rounded-lg p-2">
              <Icon className="h-4 w-4 text-gray-600" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{label}</div>
            {description && (
              <div className="text-sm text-gray-600">{description}</div>
            )}
          </div>
        </div>
        <button
          onClick={() => updatePreference(key, !value)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            value ? 'bg-blue-600' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              value ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    );
  };

  const renderSelect = (
    label: string,
    key: keyof SystemPreferences,
    options: Array<{ value: any; label: string; description?: string }>,
    description?: string
  ) => {
    const value = currentPreferences[key];

    return (
      <div className="py-3">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        <select
          value={value as string}
          onChange={(e) => updatePreference(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderSlider = (
    label: string,
    key: keyof SystemPreferences,
    min: number,
    max: number,
    step: number,
    unit?: string,
    description?: string
  ) => {
    const value = currentPreferences[key] as number;

    return (
      <div className="py-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-900">{label}</label>
          <span className="text-sm text-gray-600">
            {value}{unit}
          </span>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => updatePreference(key, parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    );
  };

  const renderDisplaySettings = () => (
    <div className="space-y-4">
      {/* Theme Selection */}
      <div className="py-3">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Theme
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
          ].map((theme) => {
            const Icon = theme.icon;
            const isSelected = currentPreferences.theme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => updatePreference('theme', theme.value as ThemeMode)}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors',
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5',
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                )} />
                <span className={cn(
                  'font-medium',
                  isSelected ? 'text-blue-900' : 'text-gray-700'
                )}>
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Scheme */}
      {renderSelect(
        'Color Scheme',
        'colorScheme',
        [
          { value: 'blue', label: 'Blue (Default)' },
          { value: 'green', label: 'Green' },
          { value: 'purple', label: 'Purple' },
          { value: 'orange', label: 'Orange' },
        ],
        'Primary color theme for the interface'
      )}

      {/* Font Size */}
      {renderSelect(
        'Font Size',
        'fontSize',
        [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium (Recommended)' },
          { value: 'large', label: 'Large' },
        ]
      )}

      {/* Display Options */}
      {renderToggle(
        'Compact Mode',
        'compactMode',
        'Reduce spacing for more content on screen',
        Monitor
      )}

      {renderToggle(
        'High Contrast',
        'highContrast',
        'Increase contrast for better visibility',
        Eye
      )}

      {renderToggle(
        'Reduce Motion',
        'reduceMotion',
        'Minimize animations and transitions',
        Zap
      )}
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="space-y-4">
      {renderSelect(
        'Language',
        'language',
        [
          { value: 'English', label: 'English' },
          { value: 'Hindi', label: 'हिन्दी (Hindi)' },
          { value: 'Bengali', label: 'বাংলা (Bengali)' },
          { value: 'Spanish', label: 'Español (Spanish)' },
          { value: 'French', label: 'Français (French)' },
        ]
      )}

      {renderSelect(
        'Timezone',
        'timezone',
        [
          { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
          { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
          { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
          { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
          { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
        ]
      )}

      {renderSelect(
        'Date Format',
        'dateFormat',
        [
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
        ]
      )}

      {renderSelect(
        'Time Format',
        'timeFormat',
        [
          { value: '24h', label: '24-hour (14:30)' },
          { value: '12h', label: '12-hour (2:30 PM)' },
        ]
      )}

      {renderSelect(
        'Currency',
        'currency',
        [
          { value: 'INR', label: '₹ Indian Rupee (INR)' },
          { value: 'USD', label: '$ US Dollar (USD)' },
          { value: 'EUR', label: '€ Euro (EUR)' },
          { value: 'GBP', label: '£ British Pound (GBP)' },
        ]
      )}
    </div>
  );

  const renderInterfaceSettings = () => (
    <div className="space-y-4">
      {renderSelect(
        'Default Dashboard View',
        'defaultView',
        [
          { value: 'overview', label: 'Overview' },
          { value: 'map', label: 'Map View' },
          { value: 'alerts', label: 'Alerts' },
          { value: 'tourists', label: 'Tourists' },
        ],
        'The page to show when you first log in'
      )}

      {renderToggle(
        'Auto Refresh',
        'autoRefresh',
        'Automatically refresh data at regular intervals',
        RotateCcw
      )}

      {currentPreferences.autoRefresh && renderSlider(
        'Refresh Interval',
        'refreshInterval',
        10,
        300,
        10,
        ' seconds',
        'How often to refresh data automatically'
      )}

      {renderToggle(
        'Show Welcome Message',
        'showWelcomeMessage',
        'Display welcome message on dashboard',
        Info
      )}

      {renderToggle(
        'Enable Keyboard Shortcuts',
        'enableKeyboardShortcuts',
        'Use keyboard shortcuts for quick actions',
        Laptop
      )}

      {renderToggle(
        'Enable Tooltips',
        'enableTooltips',
        'Show helpful tooltips on hover',
        HelpCircle
      )}
    </div>
  );

  const renderMapSettings = () => (
    <div className="space-y-4">
      {renderSelect(
        'Map Provider',
        'mapProvider',
        [
          { value: 'google', label: 'Google Maps' },
          { value: 'openstreetmap', label: 'OpenStreetMap' },
          { value: 'mapbox', label: 'Mapbox' },
        ]
      )}

      {renderSelect(
        'Map Style',
        'mapStyle',
        [
          { value: 'standard', label: 'Standard' },
          { value: 'satellite', label: 'Satellite' },
          { value: 'terrain', label: 'Terrain' },
          { value: 'dark', label: 'Dark' },
        ]
      )}

      {renderSlider(
        'Default Zoom Level',
        'defaultZoom',
        1,
        20,
        1,
        '',
        'Initial zoom level when opening maps'
      )}

      {renderToggle(
        'Show Traffic',
        'showTraffic',
        'Display traffic information on maps',
        Map
      )}

      {renderToggle(
        'Show Public Transit',
        'showPublicTransit',
        'Display public transportation routes',
        Map
      )}

      {renderToggle(
        'Enable Geolocation',
        'enableGeolocation',
        'Allow location access for better features',
        Globe
      )}
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-4">
      {renderSlider(
        'Data Retention',
        'dataRetention',
        7,
        365,
        7,
        ' days',
        'How long to keep historical data'
      )}

      {renderSlider(
        'Cache Duration',
        'cacheDuration',
        1,
        168,
        1,
        ' hours',
        'How long to cache data locally'
      )}

      {renderToggle(
        'Enable Offline Mode',
        'enableOfflineMode',
        'Work with cached data when offline',
        Wifi
      )}

      {renderSlider(
        'Data Sync Frequency',
        'dataSyncFrequency',
        1,
        60,
        1,
        ' minutes',
        'How often to sync data with server'
      )}

      {renderToggle(
        'Enable Background Sync',
        'enableBackgroundSync',
        'Sync data even when app is not active',
        Database
      )}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      {renderSlider(
        'Session Timeout',
        'sessionTimeout',
        5,
        240,
        5,
        ' minutes',
        'Automatically log out after inactivity'
      )}

      {renderToggle(
        'Enable Two-Factor Authentication',
        'enableTwoFactor',
        'Add an extra layer of security',
        Shield
      )}

      {renderToggle(
        'Show Online Status',
        'showOnlineStatus',
        'Let others see when you are online',
        Eye
      )}

      {renderToggle(
        'Enable Location Tracking',
        'enableLocationTracking',
        'Allow the system to track your location',
        Map
      )}

      {renderSelect(
        'Data Sharing',
        'dataSharing',
        [
          { value: 'none', label: 'No data sharing' },
          { value: 'anonymized', label: 'Anonymized analytics only' },
          { value: 'full', label: 'Full analytics (recommended)' },
        ],
        'Help improve the system by sharing usage data'
      )}
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-4">
      {renderToggle(
        'Developer Mode',
        'developerMode',
        'Enable advanced developer features',
        Settings
      )}

      {renderToggle(
        'Enable Debug Logs',
        'enableDebugLogs',
        'Log detailed debugging information',
        Monitor
      )}

      {renderSlider(
        'API Timeout',
        'apiTimeout',
        5,
        120,
        5,
        ' seconds',
        'How long to wait for server responses'
      )}

      {renderSlider(
        'Max Retries',
        'maxRetries',
        1,
        10,
        1,
        '',
        'Number of times to retry failed requests'
      )}

      {renderToggle(
        'Enable Beta Features',
        'enableBetaFeatures',
        'Try new features before they are released',
        Zap
      )}

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={resetToDefaults}
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'display':
        return renderDisplaySettings();
      case 'language':
        return renderLanguageSettings();
      case 'interface':
        return renderInterfaceSettings();
      case 'map':
        return renderMapSettings();
      case 'data':
        return renderDataSettings();
      case 'security':
        return renderSecuritySettings();
      case 'advanced':
        return renderAdvancedSettings();
      default:
        return renderDisplaySettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
              const Icon = activeSection_data?.icon || Settings;
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