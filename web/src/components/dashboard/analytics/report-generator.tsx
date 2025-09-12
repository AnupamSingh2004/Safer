/**
 * Smart Tourist Safety System - Report Generator
 * Custom report creation and export functionality for analytics data
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  Settings,
  Save,
  Share2,
  Eye,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAnalyticsStore } from '@/stores/analytics-store';
import type { AnalyticsFilter } from '@/types/analytics';

// ============================================================================
// LOCAL TYPES
// ============================================================================

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

interface ReportConfig {
  title: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  sections: string[];
  format: ExportFormat;
  options?: Record<string, any>;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  icon
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label: string;
  disabled?: boolean;
}) => (
  <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <div 
      className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-blue-400'
      }`}
      onClick={() => !disabled && onChange(!checked)}
    >
      {checked && <CheckSquare className="h-3 w-3 text-white" />}
      {!checked && <Square className="h-3 w-3 text-transparent" />}
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// ============================================================================
// REPORT CONFIGURATION TYPES
// ============================================================================

interface ReportSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  required?: boolean;
  options?: Record<string, any>;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  format: ExportFormat;
  schedule?: 'manual' | 'daily' | 'weekly' | 'monthly';
}

// ============================================================================
// MOCK DATA
// ============================================================================

const reportSections: ReportSection[] = [
  {
    id: 'overview',
    name: 'Executive Summary',
    description: 'High-level metrics and key performance indicators',
    icon: <BarChart3 className="h-4 w-4" />,
    enabled: true,
    required: true
  },
  {
    id: 'tourist-analytics',
    name: 'Tourist Analytics',
    description: 'Visitor demographics, patterns, and flow analysis',
    icon: <Users className="h-4 w-4" />,
    enabled: true,
    options: {
      includeHeatmap: true,
      includeFlowCharts: true,
      includeDemographics: true
    }
  },
  {
    id: 'safety-metrics',
    name: 'Safety & Security',
    description: 'Incident reports, safety scores, and threat analysis',
    icon: <Shield className="h-4 w-4" />,
    enabled: true,
    options: {
      includeIncidentDetails: false,
      includeTrendAnalysis: true,
      includeRiskAssessment: true
    }
  },
  {
    id: 'alert-analysis',
    name: 'Alert Management',
    description: 'Alert frequency, response times, and resolution status',
    icon: <AlertTriangle className="h-4 w-4" />,
    enabled: true,
    options: {
      includeResponseTimes: true,
      includeEscalationRates: true,
      includeAlertTypes: true
    }
  },
  {
    id: 'geographic-analysis',
    name: 'Geographic Insights',
    description: 'Location-based analytics and zone performance',
    icon: <MapPin className="h-4 w-4" />,
    enabled: false,
    options: {
      includeHeatmaps: true,
      includeZoneComparison: true,
      includePopularDestinations: true
    }
  },
  {
    id: 'performance-metrics',
    name: 'System Performance',
    description: 'Response times, uptime, and operational metrics',
    icon: <TrendingUp className="h-4 w-4" />,
    enabled: false,
    options: {
      includeUptimeStats: true,
      includeApiPerformance: true,
      includeUserSatisfaction: false
    }
  },
  {
    id: 'time-analysis',
    name: 'Temporal Analysis',
    description: 'Time-based patterns and seasonal trends',
    icon: <Clock className="h-4 w-4" />,
    enabled: false,
    options: {
      includeSeasonalTrends: true,
      includeHourlyPatterns: true,
      includeForecastData: false
    }
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-summary',
    name: 'Daily Summary Report',
    description: 'Daily operational overview with key metrics',
    sections: ['overview', 'tourist-analytics', 'safety-metrics', 'alert-analysis'],
    format: 'pdf',
    schedule: 'daily'
  },
  {
    id: 'weekly-detailed',
    name: 'Weekly Detailed Analysis',
    description: 'Comprehensive weekly performance report',
    sections: ['overview', 'tourist-analytics', 'safety-metrics', 'alert-analysis', 'geographic-analysis', 'time-analysis'],
    format: 'pdf',
    schedule: 'weekly'
  },
  {
    id: 'monthly-executive',
    name: 'Monthly Executive Report',
    description: 'High-level monthly summary for leadership',
    sections: ['overview', 'safety-metrics', 'performance-metrics'],
    format: 'pdf',
    schedule: 'monthly'
  },
  {
    id: 'incident-analysis',
    name: 'Incident Analysis Report',
    description: 'Detailed safety and security incident analysis',
    sections: ['safety-metrics', 'alert-analysis', 'geographic-analysis'],
    format: 'excel',
    schedule: 'manual'
  },
  {
    id: 'data-export',
    name: 'Raw Data Export',
    description: 'Complete data export for external analysis',
    sections: ['tourist-analytics', 'safety-metrics', 'alert-analysis', 'geographic-analysis'],
    format: 'csv',
    schedule: 'manual'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ReportGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customSections, setCustomSections] = useState<ReportSection[]>(reportSections);
  const [reportTitle, setReportTitle] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  const { analyticsData, isLoading } = useAnalyticsStore();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportTitle(template.name);
      setExportFormat(template.format);
      
      // Update sections based on template
      const updatedSections = customSections.map(section => ({
        ...section,
        enabled: template.sections.includes(section.id)
      }));
      setCustomSections(updatedSections);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setCustomSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleSectionOptionToggle = (sectionId: string, optionKey: string) => {
    setCustomSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              options: {
                ...section.options,
                [optionKey]: !section.options?.[optionKey]
              }
            }
          : section
      )
    );
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would call the analytics service
      const reportData = {
        title: reportTitle || 'Custom Analytics Report',
        dateRange,
        sections: customSections.filter(s => s.enabled),
        format: exportFormat,
        generatedAt: new Date().toISOString()
      };
      
      console.log('Generated report:', reportData);
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${Date.now()}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewReport = () => {
    setShowPreview(true);
  };

  const handleSaveTemplate = () => {
    // Save current configuration as a new template
    console.log('Saving template...');
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const enabledSectionsCount = customSections.filter(s => s.enabled).length;
  const isReportReady = reportTitle.trim() && enabledSectionsCount > 0;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            Report Generator
          </h2>
          <p className="text-gray-600 mt-1">Create custom analytics reports with flexible data export options</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleSaveTemplate}
            icon={<Save className="h-4 w-4" />}
          >
            Save Template
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePreviewReport}
            icon={<Eye className="h-4 w-4" />}
            disabled={!isReportReady}
          >
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Templates */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              Quick Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {template.format}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {template.sections.length} sections
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Report Configuration */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              Report Configuration
            </h3>
            
            <div className="space-y-4">
              {/* Report Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data</option>
                  <option value="json">JSON Data</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Section Selection */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-gray-600" />
              Report Sections ({enabledSectionsCount} selected)
            </h3>
            
            <div className="space-y-3">
              {customSections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={section.enabled}
                          onChange={() => handleSectionToggle(section.id)}
                          label=""
                          disabled={section.required}
                        />
                        <div className="flex items-center space-x-2">
                          {section.icon}
                          <div>
                            <h4 className="font-medium text-gray-900">{section.name}</h4>
                            <p className="text-sm text-gray-600">{section.description}</p>
                          </div>
                        </div>
                      </div>
                      {section.options && section.enabled && (
                        <button
                          onClick={() => toggleSectionExpansion(section.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Section Options */}
                    {section.options && section.enabled && expandedSections.has(section.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(section.options).map(([key, value]) => (
                            <Checkbox
                              key={key}
                              checked={Boolean(value)}
                              onChange={() => handleSectionOptionToggle(section.id, key)}
                              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Report Summary & Actions */}
        <div className="space-y-6">
          {/* Report Summary */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
              Report Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium text-gray-900">
                  {reportTitle || 'Untitled Report'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date Range:</span>
                <span className="font-medium text-gray-900">
                  {Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Sections:</span>
                <span className="font-medium text-gray-900">
                  {enabledSectionsCount} of {customSections.length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium text-gray-900 uppercase">
                  {exportFormat}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Size:</span>
                <span className="font-medium text-gray-900">
                  {enabledSectionsCount * 2 + Math.random() * 5 | 0} MB
                </span>
              </div>
            </div>
          </Card>

          {/* Generation Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
            
            <div className="space-y-3">
              <Button
                onClick={handleGenerateReport}
                disabled={!isReportReady || isGenerating}
                className="w-full"
                icon={isGenerating ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              >
                {isGenerating ? 'Generating...' : 'Generate & Download'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePreviewReport}
                disabled={!isReportReady}
                className="w-full"
                icon={<Eye className="h-4 w-4" />}
              >
                Preview Report
              </Button>
              
              <Button
                variant="ghost"
                icon={<Share2 className="h-4 w-4" />}
                className="w-full"
                disabled={!isReportReady}
              >
                Schedule Report
              </Button>
            </div>
            
            {!isReportReady && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please provide a report title and select at least one section to continue.
                </p>
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          {analyticsData && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Data Overview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tourists:</span>
                  <span className="font-medium text-gray-900">
                    {analyticsData.totalTourists.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Alerts:</span>
                  <span className="font-medium text-yellow-600">
                    {analyticsData.activeAlerts}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Score:</span>
                  <span className="font-medium text-green-600">
                    {Math.round((analyticsData.resolvedAlerts / analyticsData.totalAlerts) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response:</span>
                  <span className="font-medium text-gray-900">
                    {analyticsData.averageResponseTime}m
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Modal (placeholder) */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Report Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Report preview functionality will be implemented here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
