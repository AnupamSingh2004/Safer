/**
 * Smart Tourist Safety System - Emergency Broadcast System
 * System-wide emergency announcements with multilingual support and accessibility
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Volume2,
  VolumeX,
  Send,
  Users,
  Globe,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  Speaker,
  Eye,
  EyeOff,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Calendar,
  Timer,
  Zap,
  Shield,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'alert' | 'critical' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'immediate';
  status: 'draft' | 'scheduled' | 'broadcasting' | 'sent' | 'cancelled' | 'expired';
  
  // Targeting
  targetAudience: {
    type: 'all' | 'tourists' | 'authorities' | 'emergency_services' | 'custom';
    criteria?: {
      location?: {
        coordinates: [number, number];
        radius: number;
        areas: string[];
      };
      demographics?: {
        ageGroups: string[];
        languages: string[];
        nationalities: string[];
      };
      activity?: {
        tourTypes: string[];
        riskLevels: string[];
      };
    };
    estimatedReach: number;
  };

  // Channels and delivery
  channels: Array<'push' | 'sms' | 'email' | 'voice' | 'digital_signage' | 'social_media' | 'radio'>;
  languages: string[];
  translations: Record<string, { title: string; message: string; voiceScript?: string }>;
  
  // Timing
  scheduledAt?: string;
  expiresAt?: string;
  repeatInterval?: number; // in minutes
  maxRepeats?: number;
  
  // Content formatting
  formatting: {
    useEmergencyTone: boolean;
    includeSiren: boolean;
    voiceSettings: {
      enabled: boolean;
      speed: number;
      volume: number;
      voice: 'male' | 'female' | 'neutral';
    };
    visualSettings: {
      flashingText: boolean;
      emergencyColors: boolean;
      fontSize: 'normal' | 'large' | 'extra-large';
    };
  };

  // Delivery tracking
  deliveryStats: {
    total: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    byChannel: Record<string, { sent: number; delivered: number; failed: number }>;
    byLanguage: Record<string, { sent: number; delivered: number; failed: number }>;
    responseRate: number;
    averageResponseTime: number;
  };

  // Metadata
  createdBy: string;
  approvedBy?: string;
  cancelledBy?: string;
  reason?: string;
  tags: string[];
  linkedAlerts: string[];
  attachments: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  broadcastStarted?: string;
  broadcastCompleted?: string;
  lastRepeated?: string;
}

interface BroadcastTemplate {
  id: string;
  name: string;
  category: 'emergency' | 'safety' | 'weather' | 'security' | 'health' | 'transport' | 'general';
  severity: 'info' | 'warning' | 'alert' | 'critical' | 'emergency';
  title: string;
  message: string;
  variables: string[];
  defaultChannels: string[];
  defaultLanguages: string[];
  previewAudio?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EmergencyBroadcastProps {
  className?: string;
  onBroadcastCreated?: (broadcast: EmergencyBroadcast) => void;
  onBroadcastSent?: (broadcastId: string) => void;
  onBroadcastCancelled?: (broadcastId: string, reason: string) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockBroadcastTemplates: BroadcastTemplate[] = [
  {
    id: 'template_missing_person',
    name: 'Missing Person Alert',
    category: 'emergency',
    severity: 'emergency',
    title: 'EMERGENCY: Missing Tourist Alert',
    message: 'Tourist {{name}} ({{age}} years, {{nationality}}) is missing in {{location}}. Last seen: {{lastSeen}}. If you see this person, immediately contact {{emergencyNumber}}.',
    variables: ['name', 'age', 'nationality', 'location', 'lastSeen', 'emergencyNumber'],
    defaultChannels: ['push', 'sms', 'voice', 'digital_signage'],
    defaultLanguages: ['en', 'hi', 'local'],
    isActive: true,
    usageCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_weather_warning',
    name: 'Severe Weather Warning',
    category: 'weather',
    severity: 'alert',
    title: 'Weather Alert: {{weatherType}}',
    message: '{{weatherType}} warning issued for {{areas}}. Expected duration: {{duration}}. Tourists are advised to {{advice}}. Monitor updates on {{infoSource}}.',
    variables: ['weatherType', 'areas', 'duration', 'advice', 'infoSource'],
    defaultChannels: ['push', 'sms', 'email'],
    defaultLanguages: ['en', 'hi'],
    isActive: true,
    usageCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_security_alert',
    name: 'Security Alert',
    category: 'security',
    severity: 'critical',
    title: 'Security Alert: {{threatType}}',
    message: 'Security alert in {{location}}. {{description}}. Tourists should {{instructions}}. Emergency contact: {{emergencyNumber}}.',
    variables: ['threatType', 'location', 'description', 'instructions', 'emergencyNumber'],
    defaultChannels: ['push', 'sms', 'voice'],
    defaultLanguages: ['en', 'hi', 'local'],
    isActive: true,
    usageCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_evacuation',
    name: 'Evacuation Notice',
    category: 'emergency',
    severity: 'emergency',
    title: 'URGENT: Evacuation Required',
    message: 'IMMEDIATE EVACUATION required from {{area}} due to {{reason}}. Proceed to {{safetyPoint}}. Follow evacuation route {{routeNumber}}. Emergency assistance: {{emergencyNumber}}.',
    variables: ['area', 'reason', 'safetyPoint', 'routeNumber', 'emergencyNumber'],
    defaultChannels: ['push', 'sms', 'voice', 'digital_signage', 'radio'],
    defaultLanguages: ['en', 'hi', 'local'],
    isActive: true,
    usageCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_health_advisory',
    name: 'Health Advisory',
    category: 'health',
    severity: 'warning',
    title: 'Health Advisory: {{healthIssue}}',
    message: 'Health advisory issued for {{areas}}. {{description}}. Symptoms include {{symptoms}}. Seek medical attention if {{conditions}}. Helpline: {{healthline}}.',
    variables: ['healthIssue', 'areas', 'description', 'symptoms', 'conditions', 'healthline'],
    defaultChannels: ['push', 'email', 'sms'],
    defaultLanguages: ['en', 'hi'],
    isActive: true,
    usageCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

const mockChannels = [
  { 
    id: 'push', 
    name: 'Push Notifications', 
    icon: <Smartphone className="w-4 h-4" />, 
    reach: 95, 
    cost: 'Free',
    deliveryTime: '< 1s'
  },
  { 
    id: 'sms', 
    name: 'SMS Messages', 
    icon: <MessageSquare className="w-4 h-4" />, 
    reach: 98, 
    cost: '$0.05/msg',
    deliveryTime: '< 5s'
  },
  { 
    id: 'email', 
    name: 'Email Alerts', 
    icon: <Mail className="w-4 h-4" />, 
    reach: 85, 
    cost: '$0.01/msg',
    deliveryTime: '< 10s'
  },
  { 
    id: 'voice', 
    name: 'Voice Calls', 
    icon: <Phone className="w-4 h-4" />, 
    reach: 99, 
    cost: '$0.15/min',
    deliveryTime: '< 3s'
  },
  { 
    id: 'digital_signage', 
    name: 'Digital Signage', 
    icon: <Speaker className="w-4 h-4" />, 
    reach: 60, 
    cost: 'Free',
    deliveryTime: 'Immediate'
  },
  { 
    id: 'radio', 
    name: 'Emergency Radio', 
    icon: <Volume2 className="w-4 h-4" />, 
    reach: 80, 
    cost: '$50/broadcast',
    deliveryTime: 'Immediate'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EmergencyBroadcast: React.FC<EmergencyBroadcastProps> = ({
  className = '',
  onBroadcastCreated,
  onBroadcastSent,
  onBroadcastCancelled
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState<'compose' | 'targeting' | 'channels' | 'review' | 'sending'>('compose');
  const [selectedTemplate, setSelectedTemplate] = useState<BroadcastTemplate | null>(null);
  const [broadcastData, setBroadcastData] = useState<Partial<EmergencyBroadcast>>({
    title: '',
    message: '',
    severity: 'warning',
    priority: 'medium',
    channels: ['push', 'sms'],
    languages: ['en'],
    translations: {},
    targetAudience: {
      type: 'all',
      estimatedReach: 0
    },
    formatting: {
      useEmergencyTone: false,
      includeSiren: false,
      voiceSettings: {
        enabled: false,
        speed: 1,
        volume: 0.8,
        voice: 'neutral'
      },
      visualSettings: {
        flashingText: false,
        emergencyColors: false,
        fontSize: 'normal'
      }
    },
    tags: []
  });
  
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState('en');
  const [voicePreviewPlaying, setVoicePreviewPlaying] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Computed values
  const estimatedReach = useMemo(() => {
    // Mock calculation based on target audience and channels
    let base = 1000; // Base tourist population
    
    if (broadcastData.targetAudience?.type === 'tourists') base *= 0.8;
    if (broadcastData.targetAudience?.type === 'authorities') base *= 0.1;
    if (broadcastData.targetAudience?.criteria?.location) base *= 0.3;
    
    return Math.floor(base);
  }, [broadcastData.targetAudience]);

  const estimatedCost = useMemo(() => {
    const channels = broadcastData.channels || [];
    const reach = estimatedReach;
    
    let totalCost = 0;
    channels.forEach(channel => {
      switch (channel) {
        case 'sms':
          totalCost += reach * 0.05;
          break;
        case 'voice':
          totalCost += reach * 0.15;
          break;
        case 'email':
          totalCost += reach * 0.01;
          break;
        case 'radio':
          totalCost += 50;
          break;
        default:
          // Push, digital signage are free
          break;
      }
    });
    
    return totalCost;
  }, [broadcastData.channels, estimatedReach]);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleTemplateSelect = (template: BroadcastTemplate) => {
    setSelectedTemplate(template);
    setBroadcastData(prev => ({
      ...prev,
      title: template.title,
      message: template.message,
      severity: template.severity,
      channels: template.defaultChannels as any,
      languages: template.defaultLanguages
    }));
    
    // Initialize template variables
    const initialVariables: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVariables[variable] = '';
    });
    setTemplateVariables(initialVariables);
  };

  const handleFieldUpdate = (field: string, value: any) => {
    setBroadcastData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChannelToggle = (channelId: string) => {
    const currentChannels = broadcastData.channels || [];
    const updatedChannels = currentChannels.includes(channelId as any)
      ? currentChannels.filter(c => c !== channelId)
      : [...currentChannels, channelId as any];
    
    handleFieldUpdate('channels', updatedChannels);
  };

  const handleLanguageToggle = (languageCode: string) => {
    const currentLanguages = broadcastData.languages || [];
    const updatedLanguages = currentLanguages.includes(languageCode)
      ? currentLanguages.filter(l => l !== languageCode)
      : [...currentLanguages, languageCode];
    
    handleFieldUpdate('languages', updatedLanguages);
  };

  const handleVariableUpdate = (variable: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const generatePreviewMessage = (language: string = 'en') => {
    let message = broadcastData.message || '';
    
    // Replace template variables
    if (selectedTemplate) {
      Object.entries(templateVariables).forEach(([variable, value]) => {
        const placeholder = `{{${variable}}}`;
        message = message.replace(new RegExp(placeholder, 'g'), value || `[${variable}]`);
      });
    }
    
    return message;
  };

  const handleVoicePreview = async () => {
    if (voicePreviewPlaying) {
      setVoicePreviewPlaying(false);
      // Stop voice playback
      window.speechSynthesis.cancel();
      return;
    }

    const message = generatePreviewMessage(previewLanguage);
    if (!message.trim()) return;

    setVoicePreviewPlaying(true);

    try {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = previewLanguage === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = broadcastData.formatting?.voiceSettings?.speed || 1;
      utterance.volume = broadcastData.formatting?.voiceSettings?.volume || 0.8;

      utterance.onend = () => {
        setVoicePreviewPlaying(false);
      };

      utterance.onerror = () => {
        setVoicePreviewPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Voice preview failed:', error);
      setVoicePreviewPlaying(false);
    }
  };

  const handleSendBroadcast = async () => {
    try {
      setIsSending(true);
      setCurrentStep('sending');

      // Create broadcast record
      const broadcast: EmergencyBroadcast = {
        ...broadcastData,
        id: `broadcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'broadcasting',
        targetAudience: {
          ...broadcastData.targetAudience!,
          estimatedReach
        },
        deliveryStats: {
          total: estimatedReach,
          sent: 0,
          delivered: 0,
          read: 0,
          failed: 0,
          byChannel: {},
          byLanguage: {},
          responseRate: 0,
          averageResponseTime: 0
        },
        createdBy: 'admin_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        broadcastStarted: new Date().toISOString()
      } as EmergencyBroadcast;

      // Simulate broadcast sending
      await simulateBroadcastSending(broadcast);

      if (onBroadcastSent) {
        onBroadcastSent(broadcast.id);
      }

      // Reset form after successful send
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Failed to send broadcast:', error);
    } finally {
      setIsSending(false);
    }
  };

  const simulateBroadcastSending = async (broadcast: EmergencyBroadcast) => {
    const channels = broadcast.channels;
    const totalSteps = channels.length * 3; // 3 steps per channel
    let currentStep = 0;

    for (const channel of channels) {
      // Step 1: Preparing
      currentStep++;
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Sending
      currentStep++;
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Confirming
      currentStep++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Mark as sent
    broadcast.status = 'sent';
    broadcast.broadcastCompleted = new Date().toISOString();
    broadcast.deliveryStats.sent = broadcast.deliveryStats.total;
    broadcast.deliveryStats.delivered = Math.floor(broadcast.deliveryStats.total * 0.95);
  };

  const resetForm = () => {
    setCurrentStep('compose');
    setSelectedTemplate(null);
    setBroadcastData({
      title: '',
      message: '',
      severity: 'warning',
      priority: 'medium',
      channels: ['push', 'sms'],
      languages: ['en'],
      translations: {},
      targetAudience: {
        type: 'all',
        estimatedReach: 0
      },
      formatting: {
        useEmergencyTone: false,
        includeSiren: false,
        voiceSettings: {
          enabled: false,
          speed: 1,
          volume: 0.8,
          voice: 'neutral'
        },
        visualSettings: {
          flashingText: false,
          emergencyColors: false,
          fontSize: 'normal'
        }
      },
      tags: []
    });
    setTemplateVariables({});
    setIsPreviewMode(false);
    setShowAdvancedOptions(false);
  };

  // ========================================================================
  // RENDER HELPERS
  // ========================================================================

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'alert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'compose', name: 'Compose', icon: <MessageSquare className="w-4 h-4" /> },
      { id: 'targeting', name: 'Targeting', icon: <Users className="w-4 h-4" /> },
      { id: 'channels', name: 'Channels', icon: <Send className="w-4 h-4" /> },
      { id: 'review', name: 'Review', icon: <Eye className="w-4 h-4" /> }
    ];

    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                ${index <= currentIndex 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-gray-100 border-gray-300 text-gray-400'
                }
              `}
            >
              {step.icon}
            </div>
            <span className={`ml-2 text-sm font-medium ${index <= currentIndex ? 'text-gray-900' : 'text-gray-400'}`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div 
                className={`w-8 h-0.5 mx-4 ${index < currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`} 
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderComposeStep = () => (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Template or Create Custom</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {mockBroadcastTemplates.map(template => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500 border-blue-200' : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(template.severity)}
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <Badge className={getSeverityColor(template.severity)}>
                    {template.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.variables.length} variables</span>
                  <span>Used {template.usageCount} times</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Message Composition */}
      <div>
        <h3 className="text-lg font-medium mb-4">Broadcast Message</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={broadcastData.title}
              onChange={(e) => handleFieldUpdate('title', e.target.value)}
              placeholder="Enter broadcast title..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={broadcastData.message}
              onChange={(e) => handleFieldUpdate('message', e.target.value)}
              placeholder="Enter broadcast message..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{broadcastData.message?.length || 0}/160 characters</span>
              <span>SMS limit: 160 chars</span>
            </div>
          </div>

          {/* Template Variables */}
          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Template Variables</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.variables.map(variable => (
                  <div key={variable}>
                    <label className="block text-xs font-medium mb-1 capitalize">
                      {variable.replace('_', ' ')}
                    </label>
                    <Input
                      value={templateVariables[variable] || ''}
                      onChange={(e) => handleVariableUpdate(variable, e.target.value)}
                      placeholder={`Enter ${variable}...`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Severity and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Severity Level</label>
              <select
                value={broadcastData.severity}
                onChange={(e) => handleFieldUpdate('severity', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
                <option value="critical">Critical</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={broadcastData.priority}
                onChange={(e) => handleFieldUpdate('priority', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
                <option value="immediate">Immediate</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChannelsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select Broadcast Channels</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockChannels.map(channel => (
          <Card
            key={channel.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              broadcastData.channels?.includes(channel.id as any) ? 'ring-2 ring-blue-500 border-blue-200' : ''
            }`}
            onClick={() => handleChannelToggle(channel.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {channel.icon}
                  <span className="font-medium">{channel.name}</span>
                </div>
                {broadcastData.channels?.includes(channel.id as any) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Reach:</span>
                  <span>{channel.reach}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost:</span>
                  <span>{channel.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{channel.deliveryTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Language Selection */}
      <div>
        <h4 className="text-md font-medium mb-3">Select Languages</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {mockLanguages.map(language => (
            <label
              key={language.code}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-all
                ${broadcastData.languages?.includes(language.code)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="checkbox"
                checked={broadcastData.languages?.includes(language.code) || false}
                onChange={() => handleLanguageToggle(language.code)}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-sm">{language.name}</div>
                <div className="text-xs text-gray-500">{language.nativeName}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cost Estimation */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Estimated Cost & Reach</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Estimated Reach:</span>
              <div className="font-semibold text-lg">{estimatedReach.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Total Cost:</span>
              <div className="font-semibold text-lg">${estimatedCost.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-600">Channels:</span>
              <div className="font-semibold text-lg">{broadcastData.channels?.length || 0}</div>
            </div>
            <div>
              <span className="text-gray-600">Languages:</span>
              <div className="font-semibold text-lg">{broadcastData.languages?.length || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review & Send Broadcast</h3>

      {/* Message Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-md">Message Preview</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={previewLanguage}
                onChange={(e) => setPreviewLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {broadcastData.languages?.map(lang => {
                  const language = mockLanguages.find(l => l.code === lang);
                  return (
                    <option key={lang} value={lang}>
                      {language?.name || lang}
                    </option>
                  );
                })}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoicePreview}
                disabled={!broadcastData.message}
              >
                {voicePreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {voicePreviewPlaying ? 'Stop' : 'Preview'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              {getSeverityIcon(broadcastData.severity || 'info')}
              <h4 className="font-semibold">{broadcastData.title}</h4>
              <Badge className={getSeverityColor(broadcastData.severity || 'info')}>
                {broadcastData.severity}
              </Badge>
            </div>
            <p className="text-gray-700">{generatePreviewMessage(previewLanguage)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Broadcast Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Broadcast Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Target Audience:</span>
                <div className="capitalize">{broadcastData.targetAudience?.type}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Estimated Reach:</span>
                <div>{estimatedReach.toLocaleString()} people</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {broadcastData.channels?.map(channelId => {
                    const channel = mockChannels.find(c => c.id === channelId);
                    return (
                      <Badge key={channelId} variant="outline" className="text-xs">
                        {channel?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Languages:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {broadcastData.languages?.map(langCode => {
                    const language = mockLanguages.find(l => l.code === langCode);
                    return (
                      <Badge key={langCode} variant="outline" className="text-xs">
                        {language?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Priority:</span>
                <div className="capitalize">{broadcastData.priority}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Estimated Cost:</span>
                <div className="font-semibold">${estimatedCost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSendingStep = () => (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
        <Send className="w-8 h-8 text-blue-600 animate-pulse" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">Broadcasting Emergency Alert</h3>
        <p className="text-gray-600">
          Sending broadcast to {estimatedReach.toLocaleString()} recipients across {broadcastData.channels?.length} channels...
        </p>
      </div>

      <div className="space-y-3">
        {broadcastData.channels?.map((channelId, index) => {
          const channel = mockChannels.find(c => c.id === channelId);
          return (
            <motion.div
              key={channelId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {channel?.icon}
                <span className="font-medium">{channel?.name}</span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (index + 1) * 1.5 }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Broadcast sent successfully!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Emergency alert has been delivered to all selected channels and recipients.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  return (
    <Card className={`emergency-broadcast ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold">
          <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
          Emergency Broadcast System
        </CardTitle>
        {currentStep !== 'sending' && renderStepIndicator()}
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {currentStep === 'compose' && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderComposeStep()}
            </motion.div>
          )}

          {currentStep === 'targeting' && (
            <motion.div
              key="targeting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Audience Targeting</h3>
                <p className="text-gray-600">Advanced targeting features coming soon.</p>
                <p className="text-sm text-gray-500">Currently broadcasting to all users in the system.</p>
              </div>
            </motion.div>
          )}

          {currentStep === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderChannelsStep()}
            </motion.div>
          )}

          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderReviewStep()}
            </motion.div>
          )}

          {currentStep === 'sending' && (
            <motion.div
              key="sending"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {renderSendingStep()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep !== 'sending' && (
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                const steps = ['compose', 'targeting', 'channels', 'review'];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1] as any);
                }
              }}
              disabled={currentStep === 'compose'}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Reset
              </Button>

              {currentStep === 'review' ? (
                <Button
                  onClick={handleSendBroadcast}
                  disabled={isSending || !broadcastData.title || !broadcastData.message}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Emergency Broadcast
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const steps = ['compose', 'targeting', 'channels', 'review'];
                    const currentIndex = steps.indexOf(currentStep);
                    if (currentIndex < steps.length - 1) {
                      setCurrentStep(steps[currentIndex + 1] as any);
                    }
                  }}
                  disabled={!broadcastData.title || !broadcastData.message}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyBroadcast;