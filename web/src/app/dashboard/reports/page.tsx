/**
 * Smart Tourist Safety System - Reports Page
 * Comprehensive reporting and analytics interface
 */

'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Search
} from 'lucide-react';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedType, setSelectedType] = useState('all');

  // Mock report data
  const reports = [
    {
      id: 'RPT-001',
      title: 'Daily Safety Summary',
      type: 'safety',
      date: '2025-01-15',
      status: 'completed',
      incidents: 3,
      tourists: 1247,
      zones: 12
    },
    {
      id: 'RPT-002',
      title: 'Weekly Tourist Analytics',
      type: 'analytics',
      date: '2025-01-14',
      status: 'completed',
      incidents: 15,
      tourists: 8456,
      zones: 15
    },
    {
      id: 'RPT-003',
      title: 'Emergency Response Analysis',
      type: 'emergency',
      date: '2025-01-13',
      status: 'completed',
      incidents: 8,
      tourists: 892,
      zones: 8
    },
    {
      id: 'RPT-004',
      title: 'Zone Performance Report',
      type: 'zones',
      date: '2025-01-12',
      status: 'processing',
      incidents: 12,
      tourists: 2341,
      zones: 18
    }
  ];

  const recentIncidents = [
    {
      id: 'INC-001',
      type: 'medical',
      location: 'Red Fort Area',
      time: '14:30',
      status: 'resolved',
      response_time: '4 min'
    },
    {
      id: 'INC-002',
      type: 'security',
      location: 'India Gate Zone',
      time: '12:15',
      status: 'investigating',
      response_time: '2 min'
    },
    {
      id: 'INC-003',
      type: 'assistance',
      location: 'Connaught Place',
      time: '11:45',
      status: 'resolved',
      response_time: '3 min'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'processing': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'medical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'security': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'assistance': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Safety Reports
            </h1>
            <p className="text-muted-foreground">
              Comprehensive safety analytics and incident reports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">98.2%</div>
              <div className="text-sm text-muted-foreground">Safety Rate</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">12,486</div>
              <div className="text-sm text-muted-foreground">Tourists Monitored</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">38</div>
              <div className="text-sm text-muted-foreground">Total Incidents</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">3.2 min</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Generated Reports</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Types</option>
                  <option value="safety">Safety</option>
                  <option value="analytics">Analytics</option>
                  <option value="emergency">Emergency</option>
                  <option value="zones">Zones</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-medium text-foreground">{report.date}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Incidents</div>
                      <div className="font-medium text-foreground">{report.incidents}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tourists</div>
                      <div className="font-medium text-foreground">{report.tourists.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Zones</div>
                      <div className="font-medium text-foreground">{report.zones}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      Generated on {report.date}
                    </div>
                    <button className="btn-secondary btn-sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div>
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Incidents</h3>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getIncidentColor(incident.type)}`}>
                      {incident.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{incident.time}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span className="text-foreground">{incident.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status: {incident.status}</span>
                    <span className="text-muted-foreground">Response: {incident.response_time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Analytics Report
              </button>
              <button className="w-full btn-secondary justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency Summary
              </button>
              <button className="w-full btn-secondary justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trend Analysis
              </button>
              <button className="w-full btn-secondary justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;