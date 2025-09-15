/**
 * Theme Test Page
 * Simple page to test theme switching functionality
 */

'use client';

import { useEnhancedTheme } from '@/hooks/use-enhanced-theme';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';

export default function ThemeTestPage() {
  const { theme, resolvedTheme, emergencyMode, toggleEmergencyMode } = useEnhancedTheme();

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Theme Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Current Theme Info</h2>
            <p><strong>Theme:</strong> {theme}</p>
            <p><strong>Resolved Theme:</strong> {resolvedTheme}</p>
            <p><strong>Emergency Mode:</strong> {emergencyMode ? 'Enabled' : 'Disabled'}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Theme Controls</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Theme Switcher Component:</h3>
                <ThemeSwitcher />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Emergency Mode Toggle:</h3>
                <button
                  onClick={toggleEmergencyMode}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    emergencyMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {emergencyMode ? 'Exit Emergency Mode' : 'Enter Emergency Mode'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Theme Preview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card border rounded-lg">
                <h3 className="font-medium text-card-foreground">Card Example</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This card should adapt to the current theme.
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">Muted Background</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This shows muted colors in the current theme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}