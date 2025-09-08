/**
 * Smart Tourist Safety System - Advanced UI Components Demo Page
 * Showcase and testing page for advanced UI components
 */

'use client';

import React, { useState } from 'react';
import {
  Users,
  MapPin,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  Star,
  Shield,
  Activity,
  BarChart3,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { AdvancedSearch, DataGrid, InteractiveDashboard } from '@/components/dashboard/ui';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// MOCK DATA FOR COMPONENTS
// ============================================================================

// Sample data for DataGrid
const sampleTourists = [
  {
    id: 'T001',
    name: 'Sarah Chen',
    nationality: 'Canadian',
    location: 'Red Fort',
    status: 'Active',
    checkIn: '2024-01-16T10:30:00Z',
    contact: '+91-9876543210',
    emergencyContact: '+1-555-123-4567',
    group: 4,
    safetyScore: 95,
    lastUpdate: '2024-01-16T16:30:00Z',
  },
  {
    id: 'T002',
    name: 'John Smith',
    nationality: 'American',
    location: 'India Gate',
    status: 'Active',
    checkIn: '2024-01-16T09:15:00Z',
    contact: '+91-9876543211',
    emergencyContact: '+1-555-123-4568',
    group: 2,
    safetyScore: 88,
    lastUpdate: '2024-01-16T16:15:00Z',
  },
  {
    id: 'T003',
    name: 'Emma Johnson',
    nationality: 'British',
    location: 'Lotus Temple',
    status: 'Check-out',
    checkIn: '2024-01-16T11:00:00Z',
    contact: '+91-9876543212',
    emergencyContact: '+44-20-7123-4567',
    group: 1,
    safetyScore: 92,
    lastUpdate: '2024-01-16T15:45:00Z',
  },
  {
    id: 'T004',
    name: 'Raj Patel',
    nationality: 'Indian',
    location: 'Qutub Minar',
    status: 'Alert',
    checkIn: '2024-01-16T08:45:00Z',
    contact: '+91-9876543213',
    emergencyContact: '+91-9876543214',
    group: 3,
    safetyScore: 76,
    lastUpdate: '2024-01-16T16:00:00Z',
  },
  {
    id: 'T005',
    name: 'Maria Garcia',
    nationality: 'Spanish',
    location: 'Red Fort',
    status: 'Active',
    checkIn: '2024-01-16T12:20:00Z',
    contact: '+91-9876543215',
    emergencyContact: '+34-91-123-4567',
    group: 2,
    safetyScore: 91,
    lastUpdate: '2024-01-16T16:20:00Z',
  },
];

// Columns for DataGrid
const touristColumns = [
  {
    id: 'name',
    header: 'Tourist Name',
    accessorKey: 'name' as keyof typeof sampleTourists[0],
    enableSorting: true,
    enableFiltering: true,
    cell: ({ row, value }: any) => (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {value.charAt(0)}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.nationality}</div>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    id: 'location',
    header: 'Current Location',
    accessorKey: 'location' as keyof typeof sampleTourists[0],
    enableSorting: true,
    enableFiltering: true,
    filterType: 'select' as const,
    filterOptions: [
      { value: 'Red Fort', label: 'Red Fort' },
      { value: 'India Gate', label: 'India Gate' },
      { value: 'Lotus Temple', label: 'Lotus Temple' },
      { value: 'Qutub Minar', label: 'Qutub Minar' },
    ],
    cell: ({ value }: any) => (
      <div className="flex items-center">
        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-900 dark:text-white">{value}</span>
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status' as keyof typeof sampleTourists[0],
    enableSorting: true,
    enableFiltering: true,
    filterType: 'select' as const,
    filterOptions: [
      { value: 'Active', label: 'Active' },
      { value: 'Check-out', label: 'Check-out' },
      { value: 'Alert', label: 'Alert' },
    ],
    cell: ({ value }: any) => {
      const statusColors = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        'Check-out': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        Alert: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          {value}
        </span>
      );
    },
    width: 120,
  },
  {
    id: 'safetyScore',
    header: 'Safety Score',
    accessorKey: 'safetyScore' as keyof typeof sampleTourists[0],
    enableSorting: true,
    enableFiltering: true,
    filterType: 'number' as const,
    cell: ({ value }: any) => (
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
          <div 
            className={`h-2 rounded-full ${value >= 90 ? 'bg-green-500' : value >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}%</span>
      </div>
    ),
    width: 150,
  },
  {
    id: 'group',
    header: 'Group Size',
    accessorKey: 'group' as keyof typeof sampleTourists[0],
    enableSorting: true,
    cell: ({ value }: any) => (
      <div className="flex items-center">
        <Users className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-900 dark:text-white">{value} people</span>
      </div>
    ),
    width: 120,
  },
  {
    id: 'contact',
    header: 'Contact',
    accessorKey: 'contact' as keyof typeof sampleTourists[0],
    enableSorting: false,
    enableFiltering: false,
    cell: ({ value }: any) => (
      <div className="flex items-center space-x-2">
        <button className="p-1 text-blue-600 hover:text-blue-800 rounded">
          <Phone className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      </div>
    ),
    width: 180,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableFiltering: false,
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <button className="p-1 text-blue-600 hover:text-blue-800 rounded" title="View Details">
          <Eye className="h-4 w-4" />
        </button>
        <button className="p-1 text-gray-600 hover:text-gray-800 rounded" title="Edit">
          <Edit className="h-4 w-4" />
        </button>
        <button className="p-1 text-red-600 hover:text-red-800 rounded" title="Remove">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
    width: 100,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdvancedUIPage() {
  const { user, hasPermission } = useAuth();
  const [selectedResults, setSelectedResults] = useState<any[]>([]);
  const [selectedTourists, setSelectedTourists] = useState<any[]>([]);

  const handleSearchResult = (result: any) => {
    console.log('Selected search result:', result);
  };

  const handleTouristSelection = (tourists: any[]) => {
    setSelectedTourists(tourists);
    console.log('Selected tourists:', tourists);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exporting data as ${format}`);
    // Implement export functionality
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Advanced UI Components
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Demonstration of advanced user interface components for the Smart Tourist Safety System.
        </p>
      </div>

      {/* Advanced Search Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Advanced Search Component
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive search with filters, suggestions, and category-based results.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <AdvancedSearch
            onResultSelect={handleSearchResult}
            placeholder="Search tourists, locations, incidents, services..."
            className="w-full"
          />
        </div>
        
        {selectedResults.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Selected Results ({selectedResults.length})
            </h3>
            <div className="space-y-2">
              {selectedResults.map((result, index) => (
                <div key={index} className="text-sm text-blue-800 dark:text-blue-200">
                  {result.title} - {result.type}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Data Grid Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Advanced Data Grid Component
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sophisticated table with sorting, filtering, pagination, and export capabilities.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <DataGrid
            data={sampleTourists}
            columns={touristColumns}
            rowIdAccessor="id"
            enableSorting={true}
            enableFiltering={true}
            enablePagination={true}
            enableSelection={true}
            enableColumnVisibility={true}
            enableExport={true}
            pageSize={10}
            searchPlaceholder="Search tourists..."
            onRowSelect={handleTouristSelection}
            onExport={handleExport}
          />
        </div>
        
        {selectedTourists.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
              Selected Tourists ({selectedTourists.length})
            </h3>
            <div className="space-y-1">
              {selectedTourists.map((tourist) => (
                <div key={tourist.id} className="text-sm text-green-800 dark:text-green-200">
                  {tourist.name} ({tourist.id}) - {tourist.location}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Interactive Dashboard Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Interactive Dashboard Component
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customizable dashboard with widgets, real-time updates, and responsive layout.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <InteractiveDashboard
            enableEdit={true}
            autoRefresh={true}
            refreshInterval={30000}
          />
        </div>
      </section>

      {/* Component Features */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Component Features
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Advanced Search Features */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Search className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Advanced Search
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Real-time suggestions</li>
              <li>• Category-based filtering</li>
              <li>• Advanced filter options</li>
              <li>• Recent search history</li>
              <li>• Multi-type result display</li>
              <li>• Relevance scoring</li>
            </ul>
          </div>
          
          {/* Data Grid Features */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Data Grid
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Multi-column sorting</li>
              <li>• Advanced filtering</li>
              <li>• Row selection</li>
              <li>• Column visibility control</li>
              <li>• Export functionality</li>
              <li>• Responsive pagination</li>
            </ul>
          </div>
          
          {/* Dashboard Features */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Interactive Dashboard
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Customizable widgets</li>
              <li>• Real-time updates</li>
              <li>• Drag & drop layout</li>
              <li>• Widget visibility control</li>
              <li>• Multiple chart types</li>
              <li>• Auto-refresh capability</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
