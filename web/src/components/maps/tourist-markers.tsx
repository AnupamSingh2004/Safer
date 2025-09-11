'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapMarker, MapPopup } from './interactive-map';
import { useTouristStore, SimpleTourist } from '@/stores/simple-tourist-store';

// Tourist Marker Icons based on status
const getMarkerIcon = (status: string, safetyScore: number) => {
  const baseClasses = "w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center text-white font-bold text-sm";
  
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-500 border-green-600`;
    case 'inactive':
      return `${baseClasses} bg-yellow-500 border-yellow-600`;
    case 'emergency':
      return `${baseClasses} bg-red-500 border-red-600 animate-pulse`;
    case 'checked_out':
      return `${baseClasses} bg-gray-400 border-gray-500`;
    default:
      return `${baseClasses} bg-blue-500 border-blue-600`;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return '✓';
    case 'inactive':
      return '⚠';
    case 'emergency':
      return '🚨';
    case 'checked_out':
      return '○';
    default:
      return '?';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50';
    case 'inactive':
      return 'text-yellow-600 bg-yellow-50';
    case 'emergency':
      return 'text-red-600 bg-red-50';
    case 'checked_out':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-blue-600 bg-blue-50';
  }
};

const getSafetyScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

// Individual Tourist Marker Component
interface TouristMarkerProps {
  tourist: SimpleTourist;
  onClick?: (tourist: SimpleTourist) => void;
}

const TouristMarker: React.FC<TouristMarkerProps> = ({ tourist, onClick }) => {
  if (!tourist.currentLocation) return null;

  return (
    <MapMarker
      position={{
        lat: tourist.currentLocation.latitude,
        lng: tourist.currentLocation.longitude
      }}
      onClick={() => onClick?.(tourist)}
    >
      <motion.div
        className={getMarkerIcon(tourist.status, tourist.safetyScore)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: Math.random() * 0.5 }}
      >
        {getStatusIcon(tourist.status)}
      </motion.div>
      
      {/* Pulsing effect for emergency status */}
      {tourist.status === 'emergency' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </MapMarker>
  );
};

// Tourist Popup Content
interface TouristPopupContentProps {
  tourist: SimpleTourist;
  onTrack?: (tourist: SimpleTourist) => void;
  onContact?: (tourist: SimpleTourist) => void;
  onCreateAlert?: (tourist: SimpleTourist) => void;
}

const TouristPopupContent: React.FC<TouristPopupContentProps> = ({
  tourist,
  onTrack,
  onContact,
  onCreateAlert
}) => {
  return (
    <div className="space-y-3">
      {/* Tourist Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {tourist.fullName.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{tourist.fullName}</h3>
          <p className="text-sm text-gray-600">{tourist.nationality}</p>
        </div>
      </div>

      {/* Status and Safety Score */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(tourist.status)}`}>
          {tourist.status.toUpperCase()}
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Safety Score</span>
          <div className={`font-bold ${getSafetyScoreColor(tourist.safetyScore)}`}>
            {tourist.safetyScore}/100
          </div>
        </div>
      </div>

      {/* Location Info */}
      {tourist.currentLocation && (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">Current Location</div>
          <div className="text-sm">
            {tourist.currentLocation.latitude.toFixed(4)}, {tourist.currentLocation.longitude.toFixed(4)}
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(tourist.currentLocation.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <motion.button
          onClick={() => onTrack?.(tourist)}
          className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Track
        </motion.button>
        <motion.button
          onClick={() => onContact?.(tourist)}
          className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Contact
        </motion.button>
        {tourist.status !== 'emergency' && (
          <motion.button
            onClick={() => onCreateAlert?.(tourist)}
            className="flex-1 px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Alert
          </motion.button>
        )}
      </div>
    </div>
  );
};

// Main Tourist Markers Component
interface TouristMarkersProps {
  className?: string;
  statusFilter?: string[];
  onTouristSelect?: (tourist: SimpleTourist) => void;
  onTrackTourist?: (tourist: SimpleTourist) => void;
  onContactTourist?: (tourist: SimpleTourist) => void;
  onCreateAlert?: (tourist: SimpleTourist) => void;
}

const TouristMarkers: React.FC<TouristMarkersProps> = ({
  className = '',
  statusFilter,
  onTouristSelect,
  onTrackTourist,
  onContactTourist,
  onCreateAlert
}) => {
  const { tourists } = useTouristStore();
  const [selectedTourist, setSelectedTourist] = useState<SimpleTourist | null>(null);

  // Filter tourists based on status filter
  const filteredTourists = statusFilter 
    ? tourists.filter(tourist => statusFilter.includes(tourist.status))
    : tourists;

  // Filter tourists with location data
  const touristsWithLocation = filteredTourists.filter(tourist => tourist.currentLocation);

  const handleMarkerClick = (tourist: SimpleTourist) => {
    setSelectedTourist(tourist);
    onTouristSelect?.(tourist);
  };

  const handleClosePopup = () => {
    setSelectedTourist(null);
  };

  const handleTrack = (tourist: SimpleTourist) => {
    onTrackTourist?.(tourist);
    handleClosePopup();
  };

  const handleContact = (tourist: SimpleTourist) => {
    onContactTourist?.(tourist);
    handleClosePopup();
  };

  const handleCreateAlert = (tourist: SimpleTourist) => {
    onCreateAlert?.(tourist);
    handleClosePopup();
  };

  return (
    <div className={className}>
      {/* Tourist Markers */}
      {touristsWithLocation.map((tourist) => (
        <TouristMarker
          key={tourist.id}
          tourist={tourist}
          onClick={handleMarkerClick}
        />
      ))}

      {/* Tourist Popup */}
      {selectedTourist && selectedTourist.currentLocation && (
        <MapPopup
          position={{
            lat: selectedTourist.currentLocation.latitude,
            lng: selectedTourist.currentLocation.longitude
          }}
          isOpen={true}
          onClose={handleClosePopup}
        >
          <TouristPopupContent
            tourist={selectedTourist}
            onTrack={handleTrack}
            onContact={handleContact}
            onCreateAlert={handleCreateAlert}
          />
        </MapPopup>
      )}
    </div>
  );
};

// Tourist Markers Summary Component
interface TouristMarkersSummaryProps {
  tourists: SimpleTourist[];
}

export const TouristMarkersSummary: React.FC<TouristMarkersSummaryProps> = ({ tourists }) => {
  const statusCounts = tourists.reduce((acc, tourist) => {
    acc[tourist.status] = (acc[tourist.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Tourist Distribution</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.div
            key={status}
            className={`flex items-center justify-between p-2 rounded-lg ${getStatusColor(status)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getStatusIcon(status)}</span>
              <span className="text-sm font-medium">{status.toUpperCase()}</span>
            </div>
            <span className="font-bold">{count}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Tourists</span>
          <span className="font-semibold">{tourists.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TouristMarkers;
