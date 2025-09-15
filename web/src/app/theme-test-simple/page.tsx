/**
 * Unified Theme Test Page
 * Simple page to test the new unified theme system
 */

'use client';

import { useUnifiedTheme, useEmergencyMode } from '@/lib/theme/unified-theme-provider';
import { 
  ThemePanel,
  ThemeToggle,
  ThemeSelector,
  EmergencyToggle,
  AccessibilityControls
} from '@/components/theme/unified-theme-components';

export default function ThemeTestPage() {
  const { 
    theme, 
    resolvedTheme, 
    isLoaded,
    animationsEnabled,
    customAccentColor 
  } = useUnifiedTheme();
  
  const { emergencyMode, emergencySeverity } = useEmergencyMode();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎨 Unified Theme System Test</h1>
          <p className="text-muted-foreground">
            Testing the complete unified theme system with all features
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Information */}
          <div className="space-y-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Current Theme Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-medium capitalize">{theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolved Theme:</span>
                  <span className="font-medium capitalize">{resolvedTheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emergency Mode:</span>
                  <span className={`font-medium ${emergencyMode ? 'text-red-600' : 'text-green-600'}`}>
                    {emergencyMode ? `Active (${emergencySeverity})` : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Animations:</span>
                  <span className="font-medium">{animationsEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custom Accent:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: customAccentColor }}
                    />
                    <span className="font-medium">{customAccentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Theme Controls */}
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Quick Controls</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Theme Toggle:</label>
                  <div className="mt-2 flex gap-2">
                    <ThemeToggle variant="button" showLabel />
                    <ThemeToggle variant="icon" />
                    <ThemeToggle variant="compact" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Emergency Mode:</label>
                  <div className="mt-2">
                    <EmergencyToggle variant="button" showSeverity />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Selector Demo */}
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Theme Selector</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Grid Variant:</label>
                  <div className="mt-2">
                    <ThemeSelector variant="grid" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dropdown Variant:</label>
                  <div className="mt-2">
                    <ThemeSelector variant="dropdown" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Theme Panel */}
          <div className="space-y-6">
            <ThemePanel showEmergencyMode showAccessibility />
          </div>
        </div>

        {/* Color Palette Demo */}
        <div className="p-6 border border-border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Color Palette Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-lg">
              <h3 className="font-medium">Primary</h3>
              <p className="text-sm opacity-90">Primary colors</p>
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
              <h3 className="font-medium">Secondary</h3>
              <p className="text-sm opacity-90">Secondary colors</p>
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-lg">
              <h3 className="font-medium">Muted</h3>
              <p className="text-sm">Muted elements</p>
            </div>
            <div className="p-4 bg-accent text-accent-foreground rounded-lg">
              <h3 className="font-medium">Accent</h3>
              <p className="text-sm opacity-90">Accent colors</p>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="p-6 border border-border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Component Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                  Primary
                </button>
                <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90">
                  Secondary
                </button>
                <button className="px-3 py-2 border border-border rounded hover:bg-muted">
                  Outline
                </button>
                <button className="px-3 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90">
                  Destructive
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Status Indicators</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Error</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Controls */}
        <AccessibilityControls />
      </div>
    </div>
  );
}