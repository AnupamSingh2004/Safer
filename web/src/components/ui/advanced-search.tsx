/**
 * Smart Tourist Safety System - Advanced Search Component
 * Multi-criteria search with autocomplete, filters, saved searches, and real-time suggestions
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  Save, 
  History, 
  Star, 
  Calendar, 
  MapPin, 
  User, 
  AlertTriangle,
  Users,
  Clock,
  Tag,
  Settings,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Trash2,
  Edit3,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

export interface SearchFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'between' | 'in' | 'not_in';
  value: any;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'range';
}

export interface SearchField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'range';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  validation?: (value: any) => boolean;
  transform?: (value: any) => any;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  emergency?: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  query: string;
  filters: SearchFilter[];
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  favorite?: boolean;
  shared?: boolean;
  category?: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggestion' | 'autocomplete';
  category?: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface AdvancedSearchProps {
  searchFields: SearchField[];
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onFilterChange?: (filters: SearchFilter[]) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  savedSearches?: SavedSearch[];
  onSaveSearch?: (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastUsed' | 'usageCount'>) => void;
  onDeleteSearch?: (searchId: string) => void;
  onLoadSearch?: (search: SavedSearch) => void;
  autoComplete?: boolean;
  showFilters?: boolean;
  showSavedSearches?: boolean;
  showSuggestions?: boolean;
  emergencyMode?: boolean;
  realTimeSearch?: boolean;
  debounceMs?: number;
  maxSuggestions?: number;
  className?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateSearchSuggestions = (
  query: string, 
  fields: SearchField[], 
  recentSearches: string[]
): SearchSuggestion[] => {
  const suggestions: SearchSuggestion[] = [];
  
  // Recent searches
  recentSearches
    .filter(search => search.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .forEach((search, index) => {
      suggestions.push({
        id: `recent-${index}`,
        text: search,
        type: 'recent',
        score: 0.9 - (index * 0.1)
      });
    });

  // Field-based suggestions
  fields.forEach(field => {
    if (field.label.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push({
        id: `field-${field.id}`,
        text: field.label,
        type: 'suggestion',
        category: field.category,
        metadata: { fieldId: field.id },
        score: 0.8
      });
    }

    // Option-based suggestions for select fields
    if (field.type === 'select' && field.options) {
      field.options
        .filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .forEach(option => {
          suggestions.push({
            id: `option-${field.id}-${option.value}`,
            text: `${field.label}: ${option.label}`,
            type: 'autocomplete',
            category: field.category,
            metadata: { fieldId: field.id, value: option.value },
            score: 0.7
          });
        });
    }
  });

  return suggestions
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 8);
};

const validateFilter = (filter: SearchFilter, field: SearchField): boolean => {
  if (!filter.value && filter.value !== 0) return false;
  
  if (field.validation) {
    return field.validation(filter.value);
  }

  return true;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchFields,
  onSearch,
  onFilterChange,
  placeholder = "Search everything...",
  suggestions = [],
  savedSearches = [],
  onSaveSearch,
  onDeleteSearch,
  onLoadSearch,
  autoComplete = true,
  showFilters = true,
  showSavedSearches = true,
  showSuggestions = true,
  emergencyMode = false,
  realTimeSearch = true,
  debounceMs = 300,
  maxSuggestions = 8,
  className
}) => {
  const { t } = useTranslation();

  // State management
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showSuggestionPanel, setShowSuggestionPanel] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized values
  const categorizedFields = useMemo(() => {
    const categories: Record<string, SearchField[]> = {};
    
    searchFields.forEach(field => {
      const category = field.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(field);
    });

    return categories;
  }, [searchFields]);

  const emergencyFields = useMemo(() => {
    return searchFields.filter(field => field.emergency || field.priority === 'high');
  }, [searchFields]);

  const displayFields = emergencyMode ? emergencyFields : searchFields;

  // Effect for real-time search
  useEffect(() => {
    if (!realTimeSearch) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (query || filters.length > 0) {
        setIsSearching(true);
        onSearch(query, filters);
        setTimeout(() => setIsSearching(false), 200);
      }
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, filters, realTimeSearch, debounceMs, onSearch]);

  // Effect for suggestions generation
  useEffect(() => {
    if (query.length > 0 && autoComplete) {
      const generatedSuggestions = generateSearchSuggestions(
        query, 
        displayFields, 
        recentSearches
      );
      
      const combinedSuggestions = [
        ...generatedSuggestions,
        ...suggestions.filter(s => 
          s.text.toLowerCase().includes(query.toLowerCase())
        )
      ].slice(0, maxSuggestions);

      setCurrentSuggestions(combinedSuggestions);
      setShowSuggestionPanel(true);
    } else {
      setCurrentSuggestions([]);
      setShowSuggestionPanel(false);
    }
  }, [query, suggestions, displayFields, recentSearches, autoComplete, maxSuggestions]);

  // Effect for filter change callback
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  // Event handlers
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [query.trim(), ...prev.filter(s => s !== query.trim())].slice(0, 10);
        localStorage.setItem('tourist-safety-recent-searches', JSON.stringify(updated));
        return updated;
      });
    }

    setIsSearching(true);
    onSearch(query, filters);
    setShowSuggestionPanel(false);
    setTimeout(() => setIsSearching(false), 300);
  }, [query, filters, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && currentSuggestions[selectedSuggestionIndex]) {
        handleSuggestionClick(currentSuggestions[selectedSuggestionIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        Math.min(prev + 1, currentSuggestions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestionPanel(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [selectedSuggestionIndex, currentSuggestions, handleSearch]);

  const addFilter = useCallback((field: SearchField, value?: any) => {
    const newFilter: SearchFilter = {
      id: `${field.id}-${Date.now()}`,
      field: field.id,
      operator: field.type === 'text' ? 'contains' : 'equals',
      value: value || '',
      label: field.label,
      type: field.type
    };

    setFilters(prev => [...prev, newFilter]);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'autocomplete' && suggestion.metadata?.fieldId) {
      // Add as filter
      const field = searchFields.find(f => f.id === suggestion.metadata!.fieldId);
      if (field) {
        addFilter(field, suggestion.metadata!.value);
      }
    } else {
      setQuery(suggestion.text);
    }
    
    setShowSuggestionPanel(false);
    setSelectedSuggestionIndex(-1);
  }, [searchFields, addFilter]);

  const updateFilter = useCallback((filterId: string, updates: Partial<SearchFilter>) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId ? { ...filter, ...updates } : filter
    ));
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== filterId));
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setFilters([]);
    setShowSuggestionPanel(false);
  }, []);

  const handleSaveSearch = useCallback(() => {
    if (!saveSearchName.trim() || !onSaveSearch) return;

    const newSearch: Omit<SavedSearch, 'id' | 'createdAt' | 'lastUsed' | 'usageCount'> = {
      name: saveSearchName.trim(),
      query,
      filters: [...filters],
      favorite: false,
      shared: false
    };

    onSaveSearch(newSearch);
    setShowSaveDialog(false);
    setSaveSearchName('');
  }, [saveSearchName, query, filters, onSaveSearch]);

  const handleLoadSearch = useCallback((search: SavedSearch) => {
    setQuery(search.query);
    setFilters([...search.filters]);
    setShowSavedPanel(false);
    
    if (onLoadSearch) {
      onLoadSearch(search);
    }
  }, [onLoadSearch]);

  // Load recent searches on mount
  useEffect(() => {
    const stored = localStorage.getItem('tourist-safety-recent-searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Render functions
  const renderSearchInput = () => (
    <div className="relative flex-1">
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
          isSearching && "animate-pulse"
        )} />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={emergencyMode ? "Emergency search..." : placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowSuggestionPanel(true)}
          className={cn(
            "pl-10 pr-10",
            emergencyMode && "border-red-300 focus:border-red-500 focus:ring-red-200"
          )}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Suggestions panel */}
      <AnimatePresence>
        {showSuggestionPanel && currentSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border z-50 max-h-64 overflow-y-auto"
          >
            {currentSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                ref={el => suggestionRefs.current[index] = el}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "px-4 py-2 cursor-pointer flex items-center gap-2 text-sm",
                  index === selectedSuggestionIndex ? "bg-primary/10" : "hover:bg-muted/50",
                  index === 0 && "rounded-t-md",
                  index === currentSuggestions.length - 1 && "rounded-b-md"
                )}
              >
                {suggestion.type === 'recent' && <History className="h-3 w-3 text-muted-foreground" />}
                {suggestion.type === 'suggestion' && <Tag className="h-3 w-3 text-muted-foreground" />}
                {suggestion.type === 'autocomplete' && <Filter className="h-3 w-3 text-muted-foreground" />}
                
                <span className="flex-1">{suggestion.text}</span>
                
                {suggestion.category && (
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.category}
                  </Badge>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex items-center gap-2">
      {showFilters && (
        <Button
          variant={showFiltersPanel ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {filters.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] rounded-full">
              {filters.length}
            </Badge>
          )}
        </Button>
      )}

      {showSavedSearches && savedSearches.length > 0 && (
        <Button
          variant={showSavedPanel ? "default" : "outline"}
          size="sm"
          onClick={() => setShowSavedPanel(!showSavedPanel)}
          className="gap-2"
        >
          <Bookmark className="h-4 w-4" />
          Saved
        </Button>
      )}

      <Button
        onClick={handleSearch}
        disabled={!query && filters.length === 0}
        className="gap-2"
        size="sm"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>

      {(query || filters.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}

      {onSaveSearch && (query || filters.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      )}
    </div>
  );

  const renderFiltersPanel = () => {
    if (!showFilters || !showFiltersPanel) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="border-t bg-muted/30 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Search Filters</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const field = displayFields[0];
              if (field) addFilter(field);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Filter
          </Button>
        </div>

        <div className="space-y-3">
          {filters.map(filter => {
            const field = searchFields.find(f => f.id === filter.field);
            if (!field) return null;

            return (
              <div key={filter.id} className="flex items-center gap-2 p-3 bg-white rounded-md border">
                <select
                  value={filter.field}
                  onChange={(e) => {
                    const newField = searchFields.find(f => f.id === e.target.value);
                    if (newField) {
                      updateFilter(filter.id, { 
                        field: e.target.value, 
                        label: newField.label,
                        type: newField.type,
                        value: ''
                      });
                    }
                  }}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {displayFields.map(field => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts with</option>
                  <option value="endsWith">Ends with</option>
                  {filter.type === 'number' && (
                    <>
                      <option value="gt">Greater than</option>
                      <option value="lt">Less than</option>
                    </>
                  )}
                </select>

                {field.type === 'select' && field.options ? (
                  <select
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Select...</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    placeholder={field.placeholder}
                    className="flex-1 h-8"
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(filter.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {Object.keys(categorizedFields).length > 1 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Quick add by category:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categorizedFields).map(([category, fields]) => (
                <div key={category} className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {category}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block min-w-48">
                    {fields.map(field => (
                      <div
                        key={field.id}
                        onClick={() => addFilter(field)}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      >
                        {field.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderSavedSearchesPanel = () => {
    if (!showSavedSearches || !showSavedPanel || savedSearches.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="border-t bg-muted/30 p-4"
      >
        <h3 className="font-medium mb-4">Saved Searches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedSearches.map(search => (
            <div
              key={search.id}
              className="p-3 bg-white rounded-md border hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => handleLoadSearch(search)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{search.name}</h4>
                <div className="flex items-center gap-1">
                  {search.favorite && <Star className="h-3 w-3 text-yellow-500" />}
                  {onDeleteSearch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSearch(search.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              {search.description && (
                <p className="text-xs text-muted-foreground mb-2">{search.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Used {search.usageCount} times</span>
                <span>{new Date(search.lastUsed).toLocaleDateString()}</span>
              </div>
              
              {search.filters.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {search.filters.slice(0, 3).map(filter => (
                    <Badge key={filter.id} variant="secondary" className="text-xs">
                      {filter.label}
                    </Badge>
                  ))}
                  {search.filters.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{search.filters.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", emergencyMode && "border-red-300", className)}>
      <CardContent className="p-0">
        {/* Main search bar */}
        <div className="p-4 flex items-center gap-3">
          {renderSearchInput()}
          {renderActionButtons()}
        </div>

        {/* Active filters display */}
        {filters.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Badge key={filter.id} variant="secondary" className="gap-1">
                  {filter.label}: {String(filter.value)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFilter(filter.id)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Expandable panels */}
        <AnimatePresence>
          {renderFiltersPanel()}
          {renderSavedSearchesPanel()}
        </AnimatePresence>

        {/* Save search dialog */}
        <AnimatePresence>
          {showSaveDialog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t p-4 bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Save search as..."
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSaveSearch} disabled={!saveSearchName.trim()}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;