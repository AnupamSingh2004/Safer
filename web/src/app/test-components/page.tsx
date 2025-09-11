/**
 * Component Testing Page
 * Test page to verify UI components and Tailwind styles are working
 */

'use client';

import { 
  Button, 
  ButtonGroup, 
  EmergencyButton, 
  ActionButton, 
  IconButton 
} from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Search, 
  Plus,
  ArrowRight,
  Shield,
  Heart,
  Phone
} from 'lucide-react';

export default function TestComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Component Testing Page
          </h1>
          <p className="text-lg text-gray-600">
            Testing UI components and Tailwind CSS integration
          </p>
        </div>

        {/* Basic Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Basic Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
          </div>
        </section>

        {/* Button Sizes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </section>

        {/* Buttons with Loading States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Loading States</h2>
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading...</Button>
            <Button loading loadingText="Saving...">Save Data</Button>
            <Button variant="outline" loading>Processing</Button>
          </div>
        </section>

        {/* Buttons with Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Tourist
            </Button>
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
              Continue
            </Button>
            <Button 
              variant="success" 
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Verified
            </Button>
            <Button 
              variant="destructive" 
              leftIcon={<AlertTriangle className="h-4 w-4" />}
            >
              Alert
            </Button>
          </div>
        </section>

        {/* Emergency Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Emergency Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <EmergencyButton>
              PANIC BUTTON
            </EmergencyButton>
            <EmergencyButton emergencyType="medical">
              MEDICAL EMERGENCY
            </EmergencyButton>
            <EmergencyButton emergencyType="security">
              SECURITY ALERT
            </EmergencyButton>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Action Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionButton
              icon={<MapPin className="h-5 w-5" />}
              title="View Location"
              description="See tourist's current position"
            />
            <ActionButton
              icon={<Shield className="h-5 w-5" />}
              title="Safety Check"
              description="Verify tourist safety status"
            />
            <ActionButton
              icon={<Heart className="h-5 w-5" />}
              title="Medical Info"
              description="Access medical records"
            />
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Icon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <IconButton 
              icon={<Search className="h-4 w-4" />} 
              aria-label="Search"
            />
            <IconButton 
              icon={<MapPin className="h-4 w-4" />} 
              aria-label="Location"
              variant="outline"
            />
            <IconButton 
              icon={<Phone className="h-4 w-4" />} 
              aria-label="Call"
              variant="destructive"
              size="icon-lg"
            />
          </div>
        </section>

        {/* Button Groups */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Button Groups</h2>
          <div className="space-y-4">
            <ButtonGroup orientation="horizontal" spacing="md">
              <Button variant="outline">Cancel</Button>
              <Button variant="secondary">Draft</Button>
              <Button>Save</Button>
            </ButtonGroup>
            
            <ButtonGroup orientation="vertical" spacing="sm">
              <Button variant="outline" fullWidth>View Profile</Button>
              <Button variant="outline" fullWidth>Edit Details</Button>
              <Button variant="destructive" fullWidth>Remove Tourist</Button>
            </ButtonGroup>
          </div>
        </section>

        {/* Full Width Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Full Width Buttons</h2>
          <div className="max-w-md space-y-3">
            <Button fullWidth>Full Width Default</Button>
            <Button variant="outline" fullWidth>Full Width Outline</Button>
            <Button variant="destructive" fullWidth>Full Width Destructive</Button>
          </div>
        </section>

        {/* Tailwind Test Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tailwind CSS Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold mb-2">Blue Theme</h3>
              <p className="text-blue-600 text-sm">
                Testing blue color palette from our theme
              </p>
            </div>
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Green Theme</h3>
              <p className="text-green-600 text-sm">
                Testing green color palette from our theme
              </p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Red Theme</h3>
              <p className="text-red-600 text-sm">
                Testing red color palette for alerts
              </p>
            </div>
          </div>
        </section>

        {/* CSS Variables Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">CSS Variables Test</h2>
          <div className="space-y-4">
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-foreground">
                This uses CSS variables: background, border, and foreground colors
              </p>
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-4">
              <p>Primary background with primary foreground text</p>
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
              <p>Secondary background with secondary foreground text</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
