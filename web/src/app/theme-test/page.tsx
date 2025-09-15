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
        <Card className="border-emergency-500 bg-emergency-50 dark:bg-emergency-950">
          <CardHeader>
            <CardTitle className="text-emergency-700 dark:text-emergency-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Situation Detected
            </CardTitle>
            <CardDescription className="text-emergency-600 dark:text-emergency-500">
              Tourist safety incident reported in your area. Emergency services have been notified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button className="bg-emergency-600 hover:bg-emergency-700 text-white">
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency
              </Button>
              <Button variant="outline" className="border-emergency-500 text-emergency-700 hover:bg-emergency-50">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      name: 'Safety Zone Card',
      component: (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success-500" />
              Safe Zone - Hotel District
            </CardTitle>
            <CardDescription>
              High security area with 24/7 monitoring and emergency response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <Badge className="bg-success-100 text-success-700 border-success-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                2.3 km away
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                24/7 Coverage
              </span>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      name: 'Tourist Health Card',
      component: (
        <Card className="border-l-4 border-l-info-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-info-500" />
              Health & Medical Info
            </CardTitle>
            <CardDescription>
              Quick access to medical facilities and health services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-foreground">Nearest Hospital</div>
                <div className="text-muted-foreground">City General Hospital</div>
                <div className="text-info-600">1.2 km • 5 min drive</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Emergency Number</div>
                <div className="text-muted-foreground">Tourist Helpline</div>
                <div className="text-success-600 font-mono">1363</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Theme System Testing</h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive validation of the Smart Tourist Safety System theme implementation
          </p>
        </div>

        {/* Theme Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Controls</CardTitle>
            <CardDescription>
              Test theme switching, emergency mode, and transition behaviors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Switcher */}
            <div className="flex items-center gap-4">
              <label className="font-medium">Current Theme:</label>
              <SimpleThemeSwitcher variant="compact" />
              <Badge variant={isLoading ? "secondary" : "default"}>
                {isLoading ? "Loading..." : theme}
              </Badge>
            </div>

            {/* Emergency Mode Toggle */}
            <div className="flex items-center gap-4">
              <label className="font-medium">Emergency Mode:</label>
              <Button
                onClick={toggleEmergencyMode}
                variant={emergencyMode ? "destructive" : "outline"}
                className={emergencyMode ? "bg-emergency-600 hover:bg-emergency-700" : ""}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {emergencyMode ? "Disable Emergency" : "Enable Emergency"}
              </Button>
              <Badge variant={emergencyMode ? "destructive" : "secondary"}>
                {emergencyMode ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Transition Test */}
            <div className="flex items-center gap-4">
              <label className="font-medium">Transition Test:</label>
              <Button onClick={testTransitions} variant="outline">
                Test Smooth Transitions
              </Button>
              {transitionTest && (
                <Badge className="animate-pulse">Testing...</Badge>
              )}
            </div>

            {/* Quick Theme Switches */}
            <div className="flex flex-wrap gap-2">
              {themes.map((themeName) => (
                <Button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  variant={theme === themeName ? "default" : "outline"}
                  size="sm"
                >
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Color System Test */}
        <Card>
          <CardHeader>
            <CardTitle>Color System Validation</CardTitle>
            <CardDescription>
              Emergency services color palette across all theme variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {colorTests.map(({ name, class: className, icon: Icon }) => (
                <motion.div
                  key={name}
                  className={`${className} p-4 rounded-lg text-center space-y-2`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="h-8 w-8 mx-auto" />
                  <div className="font-medium">{name}</div>
                  <div className="text-xs opacity-90">
                    {name.toLowerCase()}-500
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component Testing */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Component Theme Testing</h2>
          <div className="grid gap-6">
            {componentTests.map(({ name, component }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold mb-3">{name}</h3>
                {component}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Accessibility Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
            <CardDescription>
              Theme system accessibility and usability validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Focus Indicators</h4>
                <div className="space-y-2">
                  <Button className="w-full">Focusable Button</Button>
                  <input 
                    type="text" 
                    placeholder="Focus this input"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">High Contrast Support</h4>
                <p className="text-sm text-muted-foreground">
                  Switch to high-contrast theme to test accessibility compliance
                </p>
                <Button 
                  onClick={() => setTheme('high-contrast')}
                  variant="outline"
                  disabled={theme === 'high-contrast'}
                >
                  Test High Contrast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Performance & FOIT Prevention</CardTitle>
            <CardDescription>
              Theme loading performance and flash prevention metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">Theme Loading</div>
                <div className={`${isLoading ? 'text-warning-600' : 'text-success-600'}`}>
                  {isLoading ? 'Loading...' : 'Loaded'}
                </div>
              </div>
              <div>
                <div className="font-medium">FOIT Prevention</div>
                <div className="text-success-600">Active</div>
              </div>
              <div>
                <div className="font-medium">CSS Variables</div>
                <div className="text-success-600">Enhanced</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm">
          Smart Tourist Safety System - Theme Testing Suite
        </div>
      </div>
    </div>
  );
};

export default ThemeTestPage;