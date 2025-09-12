/**
 * Smart Tourist Safety System - Map Controls
 * Advanced map controls with layer toggles, search functionality, zoom controls, and emergency mode
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Zap, Settings, Navigation, Filter, Download, RefreshCw } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface MapLayer {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  description?: string;
  category: 'base' | 'overlay' | 'data';
}

interface SearchResult {
  id: string;
  name: string;
  type: 'tourist' | 'zone' | 'location' | 'poi';
  coordinates: [number, number];
  description?: string;
  status?: string;
}

interface MapControlsProps {
  layers: MapLayer[];
  onLayerToggle: (layerId: string, enabled: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onEmergencyToggle?: (enabled: boolean) => void;
  onSearch?: (query: string) => SearchResult[];
  onLocationSelect?: (coordinates: [number, number]) => void;
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  onRefresh?: () => void;
  emergencyMode?: boolean;
  currentZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  showLayerControl?: boolean;
  showSearchControl?: boolean;
  showZoomControl?: boolean;
  showEmergencyControl?: boolean;
  showExportControl?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

interface SearchControlProps {
  onSearch?: (query: string) => SearchResult[];
  onLocationSelect?: (coordinates: [number, number]) => void;
  placeholder?: string;
}

const SearchControl: React.FC<SearchControlProps> = ({
  onSearch,
  onLocationSelect,
  placeholder = "Search tourists, zones, locations..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !onSearch) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = onSearch(searchQuery);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  const handleResultClick = (result: SearchResult) => {
    onLocationSelect?.(result.coordinates);
    setQuery(result.name);
    setIsOpen(false);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tourist': return '👤';
      case 'zone': return '🏛️';
      case 'location': return '📍';
      case 'poi': return '🎯';
      default: return '📍';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'safe': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'emergency': return 'text-red-600';
      case 'offline': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          onFocus={() => query && setIsOpen(true)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {results.map((result) => (
              <motion.div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getResultIcon(result.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      {result.status && (
                        <span className={`text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {result.type} • {result.coordinates[0].toFixed(4)}, {result.coordinates[1].toFixed(4)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && results.length === 0 && query && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500 text-sm"
        >
          No results found for "{query}"
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// LAYER CONTROL COMPONENT
// ============================================================================

interface LayerControlProps {
  layers: MapLayer[];
  onLayerToggle: (layerId: string, enabled: boolean) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({ layers, onLayerToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerCategories = {
    base: 'Base Layers',
    overlay: 'Overlay Layers', 
    data: 'Data Layers'
  };

  const groupedLayers = layers.reduce((acc, layer) => {
    if (!acc[layer.category]) acc[layer.category] = [];
    acc[layer.category].push(layer);
    return acc;
  }, {} as Record<string, MapLayer[]>);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all ${
          isOpen ? 'bg-blue-50 border-blue-300' : ''
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Layers className="w-5 h-5 text-gray-700" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute top-0 right-full mr-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-64"
          >
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Map Layers
              </h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedLayers).map(([category, categoryLayers]) => (
                <div key={category} className="p-3 border-b border-gray-100 last:border-b-0">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    {layerCategories[category as keyof typeof layerCategories]}
                  </h4>
                  <div className="space-y-2">
                    {categoryLayers.map((layer) => (
                      <motion.label
                        key={layer.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        whileHover={{ backgroundColor: '#f9fafb' }}
                      >
                        <input
                          type="checkbox"
                          checked={layer.enabled}
                          onChange={(e) => onLayerToggle(layer.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-lg">{layer.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{layer.name}</div>
                          {layer.description && (
                            <div className="text-xs text-gray-600">{layer.description}</div>
                          )}
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// ZOOM CONTROL COMPONENT
// ============================================================================

interface ZoomControlProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  currentZoom?: number;
  maxZoom?: number;
  minZoom?: number;
}

const ZoomControl: React.FC<ZoomControlProps> = ({
  onZoomIn,
  onZoomOut,
  currentZoom = 10,
  maxZoom = 18,
  minZoom = 1
}) => {
  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <motion.button
        onClick={onZoomIn}
        disabled={currentZoom >= maxZoom}
        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-200 transition-colors"
        whileHover={{ scale: currentZoom < maxZoom ? 1.05 : 1 }}
        whileTap={{ scale: currentZoom < maxZoom ? 0.95 : 1 }}
      >
        <span className="text-lg font-bold text-gray-700">+</span>
      </motion.button>
      
      <div className="px-2 py-1 text-xs text-center text-gray-600 bg-gray-50 border-b border-gray-200">
        {currentZoom}
      </div>
      
      <motion.button
        onClick={onZoomOut}
        disabled={currentZoom <= minZoom}
        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: currentZoom > minZoom ? 1.05 : 1 }}
        whileTap={{ scale: currentZoom > minZoom ? 0.95 : 1 }}
      >
        <span className="text-lg font-bold text-gray-700">−</span>
      </motion.button>
    </div>
  );
};

// ============================================================================
// EMERGENCY CONTROL COMPONENT
// ============================================================================

interface EmergencyControlProps {
  emergencyMode: boolean;
  onToggle: (enabled: boolean) => void;
}

const EmergencyControl: React.FC<EmergencyControlProps> = ({
  emergencyMode,
  onToggle
}) => {
  return (
    <motion.button
      onClick={() => onToggle(!emergencyMode)}
      className={`p-2 border rounded-lg shadow-sm transition-all ${
        emergencyMode
          ? 'bg-red-600 border-red-700 text-white animate-pulse'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={emergencyMode ? 'Disable Emergency Mode' : 'Enable Emergency Mode'}
    >
      <Zap className={`w-5 h-5 ${emergencyMode ? 'text-white' : 'text-red-600'}`} />
    </motion.button>
  );
};

// ============================================================================
// EXPORT CONTROL COMPONENT
// ============================================================================

interface ExportControlProps {
  onExport: (format: 'png' | 'pdf' | 'csv') => void;
}

const ExportControl: React.FC<ExportControlProps> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { format: 'png' as const, label: 'Export as PNG', icon: '🖼️' },
    { format: 'pdf' as const, label: 'Export as PDF', icon: '📄' },
    { format: 'csv' as const, label: 'Export Data (CSV)', icon: '📊' }
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Export Map"
      >
        <Download className="w-5 h-5 text-gray-700" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
          >
            <div className="p-2">
              {exportOptions.map((option) => (
                <motion.button
                  key={option.format}
                  onClick={() => {
                    onExport(option.format);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center space-x-2 text-sm"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// MAIN MAP CONTROLS COMPONENT
// ============================================================================

const MapControls: React.FC<MapControlsProps> = ({
  layers,
  onLayerToggle,
  onZoomIn,
  onZoomOut,
  onEmergencyToggle,
  onSearch,
  onLocationSelect,
  onExport,
  onRefresh,
  emergencyMode = false,
  currentZoom = 10,
  maxZoom = 18,
  minZoom = 1,
  showLayerControl = true,
  showSearchControl = true,
  showZoomControl = true,
  showEmergencyControl = true,
  showExportControl = true,
  position = 'top-right',
  className = ''
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} z-[1000] ${className}`}>
      <div className="flex flex-col space-y-3">
        {/* Search Control */}
        {showSearchControl && onSearch && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-80"
          >
            <SearchControl
              onSearch={onSearch}
              onLocationSelect={onLocationSelect}
            />
          </motion.div>
        )}

        {/* Control Buttons Row */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          {/* Layer Control */}
          {showLayerControl && (
            <LayerControl layers={layers} onLayerToggle={onLayerToggle} />
          )}

          {/* Emergency Control */}
          {showEmergencyControl && onEmergencyToggle && (
            <EmergencyControl
              emergencyMode={emergencyMode}
              onToggle={onEmergencyToggle}
            />
          )}

          {/* Export Control */}
          {showExportControl && onExport && (
            <ExportControl onExport={onExport} />
          )}

          {/* Refresh Control */}
          {onRefresh && (
            <motion.button
              onClick={onRefresh}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh Map Data"
            >
              <RefreshCw className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}
        </motion.div>

        {/* Zoom Control */}
        {showZoomControl && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="self-end"
          >
            <ZoomControl
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              currentZoom={currentZoom}
              maxZoom={maxZoom}
              minZoom={minZoom}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default MapControls;
export { SearchControl, LayerControl, ZoomControl, EmergencyControl, ExportControl };
export type { MapControlsProps, MapLayer, SearchResult };