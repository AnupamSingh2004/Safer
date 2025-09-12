'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth, useAuthActions } from '@/stores/auth-store';
import { UserSettings } from '@/components/dashboard/settings/user-settings';
import { SystemSettings } from '@/components/dashboard/settings/system-settings';
import { NotificationSettings } from '@/components/dashboard/settings/notification-settings';
import { LoadingButton } from '@/components/common/loading-spinner';
import { SimpleErrorFallback } from '@/components/common/error-fallback';

type SettingsTab = 'profile' | 'system' | 'notifications' | 'security';

interface SettingsPageState {
  activeTab: SettingsTab;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  successMessage: string | null;
}

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { updateProfile, changePassword, updatePreferences } = useAuthActions();
  
  const [state, setState] = useState<SettingsPageState>({
    activeTab: 'profile',
    hasUnsavedChanges: false,
    isSaving: false,
    lastSaved: null,
    error: null,
    successMessage: null,
  });

  const [pendingChanges, setPendingChanges] = useState<{
    profile?: any;
    system?: any;
    notifications?: any;
    security?: any;
  }>({});

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = Object.values(pendingChanges).some(changes => 
      changes && Object.keys(changes).length > 0
    );
    setState(prev => ({ ...prev, hasUnsavedChanges: hasChanges }));
  }, [pendingChanges]);

  // Clear messages after timeout
  useEffect(() => {
    if (state.successMessage || state.error) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, successMessage: null, error: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.successMessage, state.error]);

  const updateActiveTab = (tab: SettingsTab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const updatePendingChanges = (section: keyof typeof pendingChanges, changes: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [section]: { ...prev[section], ...changes }
    }));
  };

  const clearPendingChanges = (section?: keyof typeof pendingChanges) => {
    if (section) {
      setPendingChanges(prev => ({ ...prev, [section]: {} }));
    } else {
      setPendingChanges({});
    }
  };

  const saveChanges = async () => {
    try {
      setState(prev => ({ ...prev, isSaving: true, error: null }));

      // Save profile changes
      if (pendingChanges.profile && Object.keys(pendingChanges.profile).length > 0) {
        await updateProfile(pendingChanges.profile);
      }

      // Save system preferences
      if (pendingChanges.system && Object.keys(pendingChanges.system).length > 0) {
        await updatePreferences({ 
          ...user?.preferences,
          ...pendingChanges.system 
        });
      }

      // Save notification preferences
      if (pendingChanges.notifications && Object.keys(pendingChanges.notifications).length > 0) {
        await updatePreferences({ 
          ...user?.preferences,
          notifications: {
            ...user?.preferences?.notifications,
            ...pendingChanges.notifications
          }
        });
      }

      // Handle password change separately
      if (pendingChanges.security?.passwordChange) {
        await changePassword(pendingChanges.security.passwordChange);
      }

      // Clear all pending changes
      clearPendingChanges();

      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        successMessage: 'Settings saved successfully!'
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to save settings'
      }));
    }
  };

  const discardChanges = () => {
    clearPendingChanges();
    setState(prev => ({ 
      ...prev, 
      successMessage: 'Changes discarded',
      error: null 
    }));
  };

  if (!isAuthenticated) {
    return (
      <SimpleErrorFallback 
        error={new Error('You must be logged in to access settings')}
        className="mt-8"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information and account details',
      badge: pendingChanges.profile && Object.keys(pendingChanges.profile).length > 0 ? '•' : null,
    },
    {
      id: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Application preferences and configuration',
      badge: pendingChanges.system && Object.keys(pendingChanges.system).length > 0 ? '•' : null,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alert preferences and communication settings',
      badge: pendingChanges.notifications && Object.keys(pendingChanges.notifications).length > 0 ? '•' : null,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password, privacy, and security settings',
      badge: pendingChanges.security && Object.keys(pendingChanges.security).length > 0 ? '•' : null,
    },
  ] as const;

  const activeTabData = tabs.find(tab => tab.id === state.activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600">
                    Manage your account preferences and system configuration
                  </p>
                </div>
              </div>

              {/* Save Actions */}
              {state.hasUnsavedChanges && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Unsaved changes
                  </span>
                  <button
                    onClick={discardChanges}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Discard
                  </button>
                  <LoadingButton
                    loading={state.isSaving}
                    onClick={saveChanges}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </LoadingButton>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {state.successMessage && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{state.successMessage}</span>
                  {state.lastSaved && (
                    <span className="text-xs text-green-600 ml-auto">
                      Saved at {state.lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {state.error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{state.error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Settings Categories</h3>
              </div>
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = state.activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => updateActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4 w-4 ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-blue-600 text-lg leading-none">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* User Info Card */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'No email'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Role: {user?.role || 'User'}</span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {activeTabData && (
                    <>
                      <div className="bg-blue-100 rounded-lg p-2">
                        <activeTabData.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {activeTabData.label} Settings
                        </h2>
                        <p className="text-gray-600 text-sm">
                          {activeTabData.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {state.activeTab === 'profile' && (
                  <UserSettings
                    user={user}
                    onChange={(changes) => updatePendingChanges('profile', changes)}
                    pendingChanges={pendingChanges.profile || {}}
                  />
                )}

                {state.activeTab === 'system' && (
                  <SystemSettings
                    preferences={user?.preferences}
                    onChange={(changes) => updatePendingChanges('system', changes)}
                    pendingChanges={pendingChanges.system || {}}
                  />
                )}

                {state.activeTab === 'notifications' && (
                  <NotificationSettings
                    preferences={user?.preferences?.notifications}
                    onChange={(changes) => updatePendingChanges('notifications', changes)}
                    pendingChanges={pendingChanges.notifications || {}}
                  />
                )}

                {state.activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Security Settings</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Security settings are coming soon. This will include password changes, 
                            two-factor authentication, and privacy controls.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar (Mobile) */}
      {state.hasUnsavedChanges && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">You have unsaved changes</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={discardChanges}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Discard
              </button>
              <LoadingButton
                loading={state.isSaving}
                onClick={saveChanges}
                className="bg-blue-600 text-white hover:bg-blue-700"
                size="sm"
              >
                <Save className="h-4 w-4" />
                Save
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
