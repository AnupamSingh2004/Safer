/**
 * Smart Tourist Safety System - Custom Reports Generator
 * Component for creating and managing custom analytics reports
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  Mail,
  Share,
  Save,
  Play,
  Settings,
  Copy,
  Trash2,
  Eye,
  Edit,
  Plus,
  X,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

const reportSchema = z.object({
  name: z.string().min(3, 'Report name must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['tourist_analytics', 'safety_incidents', 'performance', 'location_analysis', 'custom']),
  format: z.enum(['pdf', 'excel', 'csv', 'json']),
  schedule: z.enum(['none', 'daily', 'weekly', 'monthly']),
  dateRange: z.object({
    from: z.string(),
    to: z.string(),
  }),
  metrics: z.array(z.string()),
  filters: z.object({
    locations: z.array(z.string()).optional(),
    userTypes: z.array(z.string()).optional(),
    severityLevels: z.array(z.string()).optional(),
    incidentTypes: z.array(z.string()).optional(),
  }),
  recipients: z.array(z.string()).optional(),
  includeCharts: z.boolean(),
  includeSummary: z.boolean(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface Report {
  id: string;
  name: string;
  description?: string;
  type: string;
  format: string;
  schedule: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  lastGenerated?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  downloadCount: number;
  size?: string;
}

interface CustomReportsProps {
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const REPORT_TYPES = [
  {
    value: 'tourist_analytics',
    label: 'Tourist Analytics',
    description: 'Comprehensive tourist behavior and demographics analysis',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    value: 'safety_incidents',
    label: 'Safety Incidents',
    description: 'Safety incident reports and analysis',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
  },
  {
    value: 'performance',
    label: 'System Performance',
    description: 'System performance metrics and health reports',
    icon: BarChart3,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    value: 'location_analysis',
    label: 'Location Analysis',
    description: 'Location-based tourism and safety analysis',
    icon: MapPin,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    value: 'custom',
    label: 'Custom Report',
    description: 'Build your own custom report with selected metrics',
    icon: Settings,
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

const AVAILABLE_METRICS = [
  { id: 'total_tourists', label: 'Total Tourists', category: 'tourism' },
  { id: 'new_registrations', label: 'New Registrations', category: 'tourism' },
  { id: 'active_users', label: 'Active Users', category: 'tourism' },
  { id: 'satisfaction_score', label: 'Satisfaction Score', category: 'tourism' },
  { id: 'safety_incidents', label: 'Safety Incidents', category: 'safety' },
  { id: 'response_time', label: 'Emergency Response Time', category: 'safety' },
  { id: 'resolution_rate', label: 'Incident Resolution Rate', category: 'safety' },
  { id: 'location_popularity', label: 'Location Popularity', category: 'location' },
  { id: 'hotspots', label: 'Safety Hotspots', category: 'location' },
  { id: 'system_uptime', label: 'System Uptime', category: 'performance' },
  { id: 'api_performance', label: 'API Performance', category: 'performance' },
];

const MOCK_REPORTS: Report[] = [
  {
    id: 'report-001',
    name: 'Monthly Tourist Safety Report',
    description: 'Comprehensive monthly analysis of tourist safety metrics',
    type: 'safety_incidents',
    format: 'pdf',
    schedule: 'monthly',
    createdBy: 'admin-001',
    createdByName: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
    lastGenerated: '2024-01-16T09:00:00Z',
    status: 'active',
    downloadCount: 23,
    size: '2.4 MB',
  },
  {
    id: 'report-002',
    name: 'Weekly Tourist Analytics',
    description: 'Weekly trends in tourist behavior and demographics',
    type: 'tourist_analytics',
    format: 'excel',
    schedule: 'weekly',
    createdBy: 'analyst-001',
    createdByName: 'Data Analyst',
    createdAt: '2024-01-05T00:00:00Z',
    lastGenerated: '2024-01-15T08:00:00Z',
    status: 'active',
    downloadCount: 45,
    size: '1.8 MB',
  },
  {
    id: 'report-003',
    name: 'Location Performance Analysis',
    description: 'Analysis of tourist locations and their performance metrics',
    type: 'location_analysis',
    format: 'pdf',
    schedule: 'none',
    createdBy: 'manager-001',
    createdByName: 'Operations Manager',
    createdAt: '2024-01-10T00:00:00Z',
    lastGenerated: '2024-01-16T10:30:00Z',
    status: 'completed',
    downloadCount: 12,
    size: '3.1 MB',
  },
  {
    id: 'report-004',
    name: 'System Health Dashboard',
    description: 'Daily system performance and health metrics',
    type: 'performance',
    format: 'json',
    schedule: 'daily',
    createdBy: 'tech-001',
    createdByName: 'Tech Lead',
    createdAt: '2024-01-12T00:00:00Z',
    lastGenerated: '2024-01-16T06:00:00Z',
    status: 'active',
    downloadCount: 67,
    size: '456 KB',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CustomReports({ className }: CustomReportsProps) {
  const { user, hasPermission } = useAuth();
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: 'tourist_analytics',
      format: 'pdf',
      schedule: 'none',
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
      },
      metrics: [],
      filters: {},
      recipients: [],
      includeCharts: true,
      includeSummary: true,
    },
  });

  const watchedValues = watch();

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle form submission
  const onSubmit = (data: ReportFormData) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      name: data.name,
      description: data.description,
      type: data.type,
      format: data.format,
      schedule: data.schedule,
      createdBy: user?.id || 'current-user',
      createdByName: user?.email || 'Current User',
      createdAt: new Date().toISOString(),
      status: 'draft',
      downloadCount: 0,
    };

    setReports(prev => [newReport, ...prev]);
    setShowCreateForm(false);
    reset();
  };

  // Generate report
  const handleGenerateReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            lastGenerated: new Date().toISOString(),
            status: 'completed',
            downloadCount: report.downloadCount + 1,
            size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`
          }
        : report
    ));
  };

  // Get report type info
  const getReportTypeInfo = (type: string) => {
    return REPORT_TYPES.find(t => t.value === type) || REPORT_TYPES[0];
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Custom Reports
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create, schedule, and manage custom analytics reports
            </p>
          </div>
          
          {hasPermission('create_reports') && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              {REPORT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const typeInfo = getReportTypeInfo(report.type);
          const Icon = typeInfo.icon;
          
          return (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={cn('p-3 rounded-full', typeInfo.bg)}>
                    <Icon className={cn('h-6 w-6', typeInfo.color)} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </h3>
                      
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(report.status))}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                        {typeInfo.label}
                      </span>
                    </div>
                    
                    {report.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {report.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {formatDate(report.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Format: {report.format.toUpperCase()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Schedule: {report.schedule === 'none' ? 'Manual' : report.schedule}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Downloads: {report.downloadCount}
                      </div>
                    </div>
                    
                    {report.lastGenerated && (
                      <div className="flex items-center text-sm text-green-600 mb-2">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Last generated: {formatDate(report.lastGenerated)}
                        {report.size && <span className="ml-2">({report.size})</span>}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Created by {report.createdByName}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleGenerateReport(report.id)}
                    className="flex items-center px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                    title="Generate report"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Generate
                  </button>
                  
                  {report.lastGenerated && (
                    <button className="p-2 text-gray-400 hover:text-blue-600" title="Download">
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {hasPermission('edit_reports') && (
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit report"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Duplicate report"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  {hasPermission('delete_reports') && (
                    <button
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Reports Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No reports match your current filters.'
              : 'Create your first custom report to get started.'}
          </p>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create Custom Report
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Basic Information</h4>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Report Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter report name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    {...register('description')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Brief description of the report"
                  />
                </div>
              </div>

              {/* Report Type */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Report Type</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REPORT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className="flex items-start p-4 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <input
                          type="radio"
                          value={type.value}
                          {...register('type')}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center mb-1">
                            <Icon className={cn('h-5 w-5 mr-2', type.color)} />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {type.label}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {type.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Format and Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Format *
                  </label>
                  <select
                    id="format"
                    {...register('format')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schedule
                  </label>
                  <select
                    id="schedule"
                    {...register('schedule')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="none">Manual</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('includeCharts')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include Charts
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('includeSummary')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include Summary
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Date Range</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      From Date *
                    </label>
                    <input
                      type="date"
                      id="dateFrom"
                      {...register('dateRange.from')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      To Date *
                    </label>
                    <input
                      type="date"
                      id="dateTo"
                      {...register('dateRange.to')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={cn(
                    'flex items-center px-6 py-2 text-sm text-white rounded-md',
                    isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  )}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomReports;
