/**
 * Smart Tourist Safety System - UI Components Demo
 * Comprehensive showcase of all UI components for development and testing
 */

import React from 'react';
import {
  Button,
  EmergencyButton,
  ActionButton,
  IconButton,
  ButtonGroup,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  TouristCard,
  AlertCard,
  StatsCard,
  Input,
  SearchInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
  Label,
  FieldLabel,
  EmergencyLabel,
  SectionLabel,
  StatusLabel,
  BadgeLabel,
  FormGroupLabel,
} from './index';

import { 
  Search, 
  Bell, 
  MapPin, 
  Shield, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Eye,
} from 'lucide-react';

export default function UIComponentsDemo() {
  const [searchValue, setSearchValue] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');

  // Sample data for cards
  const sampleTourist = {
    id: '1',
    name: 'John Smith',
    nationality: 'USA',
    status: 'safe' as const,
    lastLocation: 'Goa Beach Resort',
    lastSeen: '2 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format',
  };

  const sampleAlert = {
    id: '1',
    type: 'emergency' as const,
    severity: 'high' as const,
    title: 'Tourist Missing',
    description: 'Tourist has not checked in for over 6 hours and is not responding to calls.',
    location: 'Manali Hill Station',
    timestamp: '10 minutes ago',
    status: 'open' as const,
    touristName: 'Sarah Johnson',
  };

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Smart Tourist Safety UI Components
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive showcase of all UI components designed for emergency services 
          and tourist safety monitoring systems.
        </p>
      </div>

      {/* Button Components */}
      <section className="space-y-6">
        <SectionLabel section="Button Components" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Basic Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Buttons</CardTitle>
              <CardDescription>Primary button variants for general use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="destructive">Danger</Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Buttons</CardTitle>
              <CardDescription>Critical action buttons for emergency situations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmergencyButton>PANIC BUTTON</EmergencyButton>
              <EmergencyButton emergencyType="medical">MEDICAL EMERGENCY</EmergencyButton>
              <EmergencyButton emergencyType="security">SECURITY ALERT</EmergencyButton>
            </CardContent>
          </Card>

          {/* Button Sizes & States */}
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes & States</CardTitle>
              <CardDescription>Different sizes and loading states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
              <div className="space-y-2">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action & Icon Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Action Buttons</CardTitle>
              <CardDescription>Buttons with icons and descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActionButton
                icon={<MapPin className="h-5 w-5" />}
                title="Track Location"
                description="View real-time location on map"
              />
              <ActionButton
                icon={<Bell className="h-5 w-5" />}
                title="Send Alert"
                description="Notify emergency contacts"
              />
              <ActionButton
                icon={<Shield className="h-5 w-5" />}
                title="Safety Check"
                description="Perform safety verification"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Icon Buttons</CardTitle>
              <CardDescription>Compact icon-only buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <IconButton icon={<Search className="h-4 w-4" />} aria-label="Search" />
                <IconButton icon={<Bell className="h-4 w-4" />} aria-label="Notifications" />
                <IconButton icon={<MapPin className="h-4 w-4" />} aria-label="Location" />
                <IconButton icon={<Users className="h-4 w-4" />} aria-label="Users" />
                <IconButton icon={<Shield className="h-4 w-4" />} aria-label="Security" />
              </div>
              <div className="mt-4">
                <ButtonGroup>
                  <Button variant="outline">Option 1</Button>
                  <Button variant="outline">Option 2</Button>
                  <Button variant="outline">Option 3</Button>
                </ButtonGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Input Components */}
      <section className="space-y-6">
        <SectionLabel section="Input Components" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Basic Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Inputs</CardTitle>
              <CardDescription>Standard form input components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Standard input"
                label="Name"
                required
              />
              <Input
                placeholder="With help text"
                label="Tourist ID"
                helperText="Enter your tourist identification number"
              />
              <Input
                placeholder="Error state"
                label="Emergency Contact"
                errorMessage="This field is required"
                state="error"
              />
              <Input
                placeholder="Success state"
                label="Verification Code"
                state="success"
                rightIcon={<CheckCircle className="h-4 w-4 text-green-500" />}
              />
            </CardContent>
          </Card>

          {/* Specialized Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Specialized Inputs</CardTitle>
              <CardDescription>Purpose-built input components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchInput
                placeholder="Search tourists..."
                label="Search"
                onSearch={(value) => setSearchValue(value)}
              />
              <EmailInput
                placeholder="email@example.com"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                validateOnBlur
              />
              <PasswordInput
                placeholder="Enter password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showStrength
                minLength={8}
              />
              <PhoneInput
                placeholder="Phone number"
                label="Emergency Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                countryCode="+91"
                format="international"
              />
            </CardContent>
          </Card>

          {/* Input Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Input Variants</CardTitle>
              <CardDescription>Different styles and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Default variant"
                label="Default"
                variant="default"
              />
              <Input
                placeholder="Outline variant"
                label="Outline"
                variant="outline"
              />
              <Input
                placeholder="Filled variant"
                label="Filled"
                variant="filled"
              />
              <div className="space-y-2">
                <Label>Input Sizes</Label>
                <Input placeholder="Small" inputSize="sm" />
                <Input placeholder="Default" inputSize="default" />
                <Input placeholder="Large" inputSize="lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Label Components */}
      <section className="space-y-6">
        <SectionLabel section="Label Components" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Basic Labels */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Labels</CardTitle>
              <CardDescription>Standard labeling components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Default Label</Label>
                <Label required>Required Field</Label>
                <Label optional>Optional Field</Label>
                <Label
                  icon={<Mail className="h-4 w-4" />}
                >
                  Label with Icon
                </Label>
                <Label
                  tooltip="This is helpful information"
                >
                  Label with Tooltip
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Status Labels */}
          <Card>
            <CardHeader>
              <CardTitle>Status Labels</CardTitle>
              <CardDescription>Status indication labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusLabel status="active">Active Status</StatusLabel>
              <StatusLabel status="pending">Pending Status</StatusLabel>
              <StatusLabel status="error">Error Status</StatusLabel>
              <StatusLabel status="success">Success Status</StatusLabel>
              <StatusLabel status="warning">Warning Status</StatusLabel>
              <StatusLabel status="inactive">Inactive Status</StatusLabel>
            </CardContent>
          </Card>

          {/* Emergency & Badge Labels */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency & Badge Labels</CardTitle>
              <CardDescription>Critical and badged labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmergencyLabel emergencyType="critical" blinking>
                CRITICAL ALERT
              </EmergencyLabel>
              <EmergencyLabel emergencyType="warning">
                WARNING STATUS
              </EmergencyLabel>
              <EmergencyLabel emergencyType="alert">
                ALERT CONDITION
              </EmergencyLabel>
              
              <div className="space-y-2 mt-4">
                <BadgeLabel badge="New">Recent Activity</BadgeLabel>
                <BadgeLabel badge={5} badgeVariant="error">Unread Alerts</BadgeLabel>
                <BadgeLabel badge="VIP" badgeVariant="primary">Tourist Status</BadgeLabel>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card Components */}
      <section className="space-y-6">
        <SectionLabel section="Card Components" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Tourist Card */}
          <TouristCard
            tourist={sampleTourist}
            onViewDetails={(id) => console.log('View details:', id)}
            onTrack={(id) => console.log('Track tourist:', id)}
          />

          {/* Alert Card */}
          <AlertCard
            alert={sampleAlert}
            onViewDetails={(id) => console.log('View alert:', id)}
            onResolve={(id) => console.log('Resolve alert:', id)}
          />

          {/* Stats Cards */}
          <StatsCard
            title="Total Tourists"
            value="1,234"
            change={{ value: 12, type: 'increase', period: 'last month' }}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatsCard
            title="Active Alerts"
            value="23"
            change={{ value: 5, type: 'decrease', period: 'last week' }}
            icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
            color="yellow"
          />
          
          <StatsCard
            title="Safe Zones"
            value="156"
            icon={<Shield className="h-6 w-6 text-green-600" />}
            color="green"
          />
          
          <StatsCard
            title="Response Time"
            value="4.2 min"
            change={{ value: 8, type: 'decrease', period: 'this month' }}
            icon={<Phone className="h-6 w-6 text-blue-600" />}
            color="blue"
          />
        </div>
      </section>

      {/* Complex Form Example */}
      <section className="space-y-6">
        <SectionLabel section="Complete Form Example" />
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Tourist Registration Form</CardTitle>
            <CardDescription>
              Example form using multiple components together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormGroupLabel
              label="Personal Information"
              fieldId="personal-info"
              description="Basic tourist identification details"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                required
              />
              <Input
                label="Nationality"
                placeholder="Country of origin"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmailInput
                label="Email Address"
                placeholder="email@example.com"
                required
                validateOnBlur
              />
              <PhoneInput
                label="Mobile Number"
                placeholder="Mobile number"
                countryCode="+91"
                required
              />
            </div>

            <FormGroupLabel
              label="Emergency Contacts"
              fieldId="emergency-contacts"
              description="Primary emergency contact information"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Emergency Contact Name"
                placeholder="Contact name"
                required
              />
              <PhoneInput
                label="Emergency Contact Phone"
                placeholder="Emergency phone"
                countryCode="+91"
                required
              />
            </div>

            <FormGroupLabel
              label="Travel Information"
              fieldId="travel-info"
              description="Trip details and itinerary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Destination"
                placeholder="Primary destination"
                leftIcon={<MapPin className="h-4 w-4" />}
              />
              <Input
                label="Duration (days)"
                placeholder="Trip duration"
                type="number"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save Draft</Button>
            <div className="space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Register Tourist</Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-6">
        <SectionLabel section="Usage Guidelines" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Color Coding</CardTitle>
              <CardDescription>Consistent color usage for emergency situations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Critical/Emergency - Immediate action required</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>Warning - Caution needed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Moderate Risk - Monitor situation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Safe/Success - All clear</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Information - General status</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>Built-in accessibility and usability features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>WCAG 2.1 compliant color contrast ratios</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Keyboard navigation support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Screen reader compatibility</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Focus indicators and ARIA labels</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Mobile-responsive design</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}