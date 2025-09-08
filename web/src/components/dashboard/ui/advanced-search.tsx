/**
 * Smart Tourist Safety System - Advanced Search Component
 * Comprehensive search with filters, suggestions, and advanced options
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  X,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  Clock,
  Star,
  Tag,
  SlidersHorizontal,
  History,
  TrendingUp,
  Navigation,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SearchResult {
  id: string;
  type: 'tourist' | 'location' | 'incident' | 'service' | 'alert';
  title: string;
  subtitle?: string;
  description: string;
  metadata: {
    [key: string]: any;
  };
  relevance: number;
  lastUpdated: string;
}

interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'range' | 'text';
  options?: { value: string; label: string }[];
  value: any;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'filter' | 'entity';
  category: string;
  count?: number;
}

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  onFiltersChange?: (filters: SearchFilter[]) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const SEARCH_CATEGORIES = [
  { value: 'all', label: 'All Results', icon: Search },
  { value: 'tourists', label: 'Tourists', icon: Users },
  { value: 'locations', label: 'Locations', icon: MapPin },
  { value: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { value: 'services', label: 'Services', icon: Navigation },
  { value: 'alerts', label: 'Alerts', icon: Clock },
];

const INITIAL_FILTERS: SearchFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: SEARCH_CATEGORIES.slice(1),
    value: 'all',
  },
  {
    id: 'location',
    label: 'Location',
    type: 'multiselect',
    options: [
      { value: 'red-fort', label: 'Red Fort' },
      { value: 'india-gate', label: 'India Gate' },
      { value: 'lotus-temple', label: 'Lotus Temple' },
      { value: 'qutub-minar', label: 'Qutub Minar' },
      { value: 'humayuns-tomb', label: "Humayun's Tomb" },
    ],
    value: [],
  },
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'date',
    value: { from: '', to: '' },
  },
  {
    id: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ],
    value: '',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'pending', label: 'Pending' },
      { value: 'closed', label: 'Closed' },
    ],
    value: [],
  },
];

const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: 'sug-001', text: 'Red Fort', type: 'entity', category: 'location', count: 245 },
  { id: 'sug-002', text: 'safety incidents', type: 'query', category: 'incident' },
  { id: 'sug-003', text: 'tourist assistance', type: 'query', category: 'service' },
  { id: 'sug-004', text: 'India Gate', type: 'entity', category: 'location', count: 312 },
  { id: 'sug-005', text: 'emergency alerts', type: 'query', category: 'alert' },
  { id: 'sug-006', text: 'John Smith', type: 'entity', category: 'tourist' },
  { id: 'sug-007', text: 'medical emergency', type: 'query', category: 'incident' },
  { id: 'sug-008', text: 'Lotus Temple', type: 'entity', category: 'location', count: 189 },
];

const MOCK_RESULTS: SearchResult[] = [
  {
    id: 'result-001',
    type: 'tourist',
    title: 'Sarah Chen',
    subtitle: 'Tourist ID: TC-2024-001',
    description: 'Active tourist currently visiting Red Fort area. Last check-in 2 hours ago.',
    metadata: {
      location: 'Red Fort',
      checkinTime: '2024-01-16T14:30:00Z',
      contactNumber: '+91-9876543210',
      emergencyContact: '+1-555-123-4567',
      nationality: 'Canadian',
      group: 'Family (4 members)',
    },
    relevance: 0.95,
    lastUpdated: '2024-01-16T16:30:00Z',
  },
  {
    id: 'result-002',
    type: 'incident',
    title: 'Medical Emergency - Red Fort',
    subtitle: 'Incident ID: INC-2024-156',
    description: 'Tourist reported feeling dizzy during fort visit. Resolved by on-site medical team.',
    metadata: {
      severity: 'Medium',
      status: 'Resolved',
      location: 'Red Fort - Entrance Gate',
      responseTime: '8 minutes',
      reportedBy: 'Tourist Guide',
      resolvedBy: 'Medical Team Alpha',
    },
    relevance: 0.87,
    lastUpdated: '2024-01-16T15:45:00Z',
  },
  {
    id: 'result-003',
    type: 'location',
    title: 'Red Fort (Lal Qila)',
    subtitle: 'Historical Monument',
    description: 'UNESCO World Heritage site and major tourist attraction in Delhi.',
    metadata: {
      address: 'Netaji Subhash Marg, Chandni Chowk, New Delhi',
      currentVisitors: 245,
      capacity: 500,
      safetyRating: 4.8,
      facilities: ['First Aid', 'Security', 'Guides', 'Restrooms'],
      timings: '9:30 AM - 4:30 PM',
    },
    relevance: 0.92,
    lastUpdated: '2024-01-16T16:00:00Z',
  },
  {
    id: 'result-004',
    type: 'service',
    title: 'Tourist Information Center - Red Fort',
    subtitle: 'Information & Assistance',
    description: 'Main tourist information center providing assistance and emergency services.',
    metadata: {
      serviceType: 'Information & Emergency',
      contact: '+91-11-2327-7705',
      email: 'info@redfort.delhi.gov.in',
      languages: ['Hindi', 'English', 'French', 'German'],
      services: ['Maps', 'Guides', 'Emergency', 'Lost & Found'],
      availability: '24/7',
    },
    relevance: 0.78,
    lastUpdated: '2024-01-16T12:00:00Z',
  },
  {
    id: 'result-005',
    type: 'alert',
    title: 'Crowd Alert - Red Fort Area',
    subtitle: 'Active Alert',
    description: 'High crowd density detected near main entrance. Alternative routes recommended.',
    metadata: {
      alertType: 'Crowd Management',
      severity: 'Medium',
      affectedArea: 'Main Entrance & Parking',
      recommendation: 'Use alternate entrance via Lahori Gate',
      estimatedDuration: '2-3 hours',
      status: 'Active',
    },
    relevance: 0.83,
    lastUpdated: '2024-01-16T16:15:00Z',
  },
];

const RECENT_SEARCHES = [
  'tourist assistance Red Fort',
  'safety incidents India Gate',
  'Sarah Chen contact',
  'medical emergency today',
  'crowd alerts',
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AdvancedSearch({
  onResultSelect,
  onFiltersChange,
  placeholder = "Search tourists, locations, incidents...",
  className,
}: AdvancedSearchProps) {
  const { user, hasPermission } = useAuth();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilter[]>(INITIAL_FILTERS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input change
  useEffect(() => {
    if (query.length > 0) {
      // Simulate API call for suggestions
      const filteredSuggestions = MOCK_SUGGESTIONS.filter(
        suggestion => suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowResults(false);
    }
  }, [query]);

  // Handle search execution
  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter results based on query and filters
    let filteredResults = MOCK_RESULTS.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredResults = filteredResults.filter(result => {
        const categoryMap: { [key: string]: string } = {
          'tourists': 'tourist',
          'locations': 'location',
          'incidents': 'incident',
          'services': 'service',
          'alerts': 'alert',
        };
        return result.type === categoryMap[selectedCategory];
      });
    }

    // Apply other filters
    const activeFilters = filters.filter(filter => {
      if (filter.type === 'multiselect') return filter.value.length > 0;
      if (filter.type === 'date') return filter.value.from || filter.value.to;
      return filter.value && filter.value !== '';
    });

    // Sort by relevance
    filteredResults.sort((a, b) => b.relevance - a.relevance);

    setResults(filteredResults);
    setShowResults(true);
    setIsSearching(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    const updatedFilters = filters.map(filter => 
      filter.id === filterId ? { ...filter, value } : filter
    );
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
  };

  // Get result icon
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'tourist': return Users;
      case 'location': return MapPin;
      case 'incident': return AlertTriangle;
      case 'service': return Navigation;
      case 'alert': return Clock;
      default: return Search;
    }
  };

  // Get result color
  const getResultColor = (type: string) => {
    switch (type) {
      case 'tourist': return 'text-blue-600';
      case 'location': return 'text-green-600';
      case 'incident': return 'text-red-600';
      case 'service': return 'text-purple-600';
      case 'alert': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  // Format metadata for display
  const formatMetadata = (metadata: any, type: string) => {
    const items: Array<{ icon: any; label: string; value: string }> = [];

    switch (type) {
      case 'tourist':
        if (metadata.location) items.push({ icon: MapPin, label: 'Location', value: metadata.location });
        if (metadata.contactNumber) items.push({ icon: Phone, label: 'Contact', value: metadata.contactNumber });
        if (metadata.nationality) items.push({ icon: Globe, label: 'Nationality', value: metadata.nationality });
        break;
      case 'incident':
        if (metadata.severity) items.push({ icon: AlertTriangle, label: 'Severity', value: metadata.severity });
        if (metadata.status) items.push({ icon: Tag, label: 'Status', value: metadata.status });
        if (metadata.responseTime) items.push({ icon: Clock, label: 'Response Time', value: metadata.responseTime });
        break;
      case 'location':
        if (metadata.currentVisitors) items.push({ icon: Users, label: 'Current Visitors', value: metadata.currentVisitors.toString() });
        if (metadata.safetyRating) items.push({ icon: Star, label: 'Safety Rating', value: `${metadata.safetyRating}/5` });
        if (metadata.timings) items.push({ icon: Clock, label: 'Timings', value: metadata.timings });
        break;
      case 'service':
        if (metadata.contact) items.push({ icon: Phone, label: 'Contact', value: metadata.contact });
        if (metadata.email) items.push({ icon: Mail, label: 'Email', value: metadata.email });
        if (metadata.availability) items.push({ icon: Clock, label: 'Availability', value: metadata.availability });
        break;
      case 'alert':
        if (metadata.severity) items.push({ icon: AlertTriangle, label: 'Severity', value: metadata.severity });
        if (metadata.affectedArea) items.push({ icon: MapPin, label: 'Area', value: metadata.affectedArea });
        if (metadata.status) items.push({ icon: Tag, label: 'Status', value: metadata.status });
        break;
    }

    return items.slice(0, 3); // Show max 3 metadata items
  };

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setShowResults(false);
                  setShowSuggestions(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-1 rounded transition-colors',
                showFilters 
                  ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' 
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center mt-3 space-x-2 overflow-x-auto">
          {SEARCH_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.value;
            
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Advanced Filters</h4>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && (
                  <select
                    value={filter.value}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {filter.type === 'date' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filter.value.from}
                      onChange={(e) => handleFilterChange(filter.id, { ...filter.value, from: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <input
                      type="date"
                      value={filter.value.to}
                      onChange={(e) => handleFilterChange(filter.id, { ...filter.value, to: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => {
                setFilters(INITIAL_FILTERS);
                setSelectedCategory('all');
              }}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear All
            </button>
            <button
              onClick={() => handleSearch()}
              className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
              Suggestions
            </div>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {suggestion.category}
                    {suggestion.count && ` • ${suggestion.count} results`}
                  </div>
                </div>
                <TrendingUp className="h-3 w-3 text-gray-400" />
              </button>
            ))}
          </div>
          
          {/* Recent Searches */}
          {query.length === 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                Recent Searches
              </div>
              {RECENT_SEARCHES.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick({ id: `recent-${index}`, text: search, type: 'query', category: 'recent' })}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <History className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {results.length} result{results.length !== 1 ? 's' : ''} found
                {query && <span className="text-gray-500 dark:text-gray-400"> for "{query}"</span>}
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => {
                  const Icon = getResultIcon(result.type);
                  const iconColor = getResultColor(result.type);
                  const metadata = formatMetadata(result.metadata, result.type);
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className={cn('h-5 w-5', iconColor)} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {result.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {Math.round(result.relevance * 100)}% match
                            </span>
                          </div>
                          
                          {result.subtitle && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {result.subtitle}
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                            {result.description}
                          </p>
                          
                          {metadata.length > 0 && (
                            <div className="flex items-center space-x-4 mt-2">
                              {metadata.map((item, index) => {
                                const MetaIcon = item.icon;
                                return (
                                  <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                    <MetaIcon className="h-3 w-3 mr-1" />
                                    <span>{item.label}: {item.value}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  No results found. Try adjusting your search terms or filters.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
