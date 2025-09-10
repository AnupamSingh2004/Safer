'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Map Component Types
interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}

interface InteractiveMapProps {
  center?: MapPosition;
  height?: string;
  onMapClick?: (lat: number, lng: number) => void;
  children?: React.ReactNode;
  className?: string;
}

// Mock Map Implementation (Leaflet-style API)
const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = { lat: 25.2744, lng: 91.7322, zoom: 10 }, // Shillong, Meghalaya
  height = '400px',
  onMapClick,
  children,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState(center);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to approximate lat/lng
    const lat = center.lat + (rect.height / 2 - y) * 0.001;
    const lng = center.lng + (x - rect.width / 2) * 0.001;
    
    onMapClick(lat, lng);
  };

  const zoomIn = () => {
    setCurrentPosition(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 18)
    }));
  };

  const zoomOut = () => {
    setCurrentPosition(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1)
    }));
  };

  if (isLoading) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading map...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden border-2 border-gray-200 ${className}`}
      style={{ height }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-crosshair relative"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Map Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full opacity-20">
            {/* Simulate map tiles */}
            <div className="grid grid-cols-8 grid-rows-6 w-full h-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-300 bg-gradient-to-br from-green-100 to-blue-100"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                      <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
                        <rect width='20' height='20' fill='%23f0f9ff'/>
                        <path d='M 0 20 L 20 0' stroke='%23e0e7ff' stroke-width='0.5'/>
                        <path d='M 0 0 L 20 20' stroke='%23e0e7ff' stroke-width='0.5'/>
                      </svg>
                    `)}")`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <motion.button
            onClick={zoomIn}
            className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gray-700 font-bold text-lg">+</span>
          </motion.button>
          <motion.button
            onClick={zoomOut}
            className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gray-700 font-bold text-lg">−</span>
          </motion.button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm text-gray-600">Zoom: {currentPosition.zoom}</span>
        </div>

        {/* Center Coordinates Display */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm text-gray-600">
            {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
          </span>
        </div>

        {/* Children (markers, overlays, etc.) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
        Smart Tourist Safety Map
      </div>
    </motion.div>
  );
};

// Map Marker Component
interface MapMarkerProps {
  position: { lat: number; lng: number };
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  position,
  children,
  onClick,
  className = ''
}) => {
  // Convert lat/lng to pixel position (simplified)
  const style = {
    position: 'absolute' as const,
    left: `${50 + (position.lng - 91.7322) * 1000}%`,
    top: `${50 - (position.lat - 25.2744) * 1000}%`,
    transform: 'translate(-50%, -100%)',
    zIndex: 1000
  };

  return (
    <motion.div
      style={style}
      className={`pointer-events-auto cursor-pointer ${className}`}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// Map Popup Component
interface MapPopupProps {
  position: { lat: number; lng: number };
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  position,
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null;

  const style = {
    position: 'absolute' as const,
    left: `${50 + (position.lng - 91.7322) * 1000}%`,
    top: `${50 - (position.lat - 25.2744) * 1000}%`,
    transform: 'translate(-50%, -100%)',
    zIndex: 2000
  };

  return (
    <motion.div
      style={style}
      className="pointer-events-auto"
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 mb-2 min-w-48 max-w-64">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
        >
          ×
        </button>
        {children}
      </div>
      {/* Popup arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;
