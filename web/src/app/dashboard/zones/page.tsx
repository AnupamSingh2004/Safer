/**
 * Smart Tourist Safety System - Zone Management Page
 * Comprehensive zone monitoring and management interface
 */

'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Shield, 
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  Activity,
  Settings,
  Eye,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const ZoneManagementPage = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Mock zone data
  const zones = [
    {
      id: 'zone-001',
      name: 'Red Fort Area',
      status: 'active',
      touristCount: 145,
      riskLevel: 'low',
      lastUpdate: '2 minutes ago',
      coordinates: '28.6561° N, 77.2410° E',
      area: '2.5 km²'
    },
    {
      id: 'zone-002',
      name: 'India Gate Zone',
      status: 'active',
      touristCount: 89,
      riskLevel: 'medium',
      lastUpdate: '5 minutes ago',
      coordinates: '28.6129° N, 77.2295° E',
      area: '1.8 km²'
    },
    {
      id: 'zone-003',
      name: 'Connaught Place',
      status: 'monitoring',
      touristCount: 267,
      riskLevel: 'high',
      lastUpdate: '1 minute ago',
      coordinates: '28.6315° N, 77.2167° E',
      area: '3.2 km²'
    },
    {
      id: 'zone-004',
      name: 'Lotus Temple Area',
      status: 'active',
      touristCount: 78,
      riskLevel: 'low',
      lastUpdate: '3 minutes ago',
      coordinates: '28.5535° N, 77.2588° E',
      area: '1.5 km²'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
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
              Zone Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage tourist safety zones across the region
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{zones.length}</div>
              <div className="text-sm text-muted-foreground">Active Zones</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {zones.reduce((sum, zone) => sum + zone.touristCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tourists</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {zones.filter(z => z.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">High Risk Zones</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">98.5%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-card p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search zones..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option>All Status</option>
            <option>Active</option>
            <option>Monitoring</option>
            <option>Inactive</option>
          </select>
          <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option>All Risk Levels</option>
            <option>Low Risk</option>
            <option>Medium Risk</option>
            <option>High Risk</option>
          </select>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map((zone) => (
          <div key={zone.id} className="dashboard-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{zone.name}</h3>
                  <p className="text-sm text-muted-foreground">{zone.coordinates}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(zone.status)}`}>
                  {zone.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(zone.riskLevel)}`}>
                  {zone.riskLevel} risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{zone.touristCount}</div>
                <div className="text-xs text-muted-foreground">Tourists</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{zone.area}</div>
                <div className="text-xs text-muted-foreground">Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                </div>
                <div className="text-xs text-muted-foreground">{zone.lastUpdate}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center text-sm text-muted-foreground">
                <Activity className="w-4 h-4 mr-1" />
                Last updated {zone.lastUpdate}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Map Placeholder */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Zone Coverage Map</h3>
        <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Interactive zone map will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-1">Click on zones for detailed information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneManagementPage;