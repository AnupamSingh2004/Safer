"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Siren, 
  Phone, 
  MapPin, 
  Clock,
  Settings,
  ChevronDown,
  CheckCircle,
  XCircle,
  Radio
} from 'lucide-react';

interface EmergencyModeToggleProps {
  onModeChange: (emergencyMode: boolean) => void;
  initialMode?: boolean;
  className?: string;
  showStatus?: boolean;
  autoDetectEmergency?: boolean;
}

interface EmergencyStatus {
  active: boolean;
  level: 'low' | 'medium' | 'high' | 'critical';
  type: 'medical' | 'fire' | 'police' | 'natural' | 'security' | 'technical';
  location?: string;
  duration: number;
  responders: number;
}

export const EmergencyModeToggle: React.FC<EmergencyModeToggleProps> = ({
  onModeChange,
  initialMode = false,
  className = '',
  showStatus = true,
  autoDetectEmergency = false
}) => {
  const [emergencyMode, setEmergencyMode] = useState(initialMode);
  const [isToggling, setIsToggling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>({
    active: false,
    level: 'low',
    type: 'medical',
    duration: 0,
    responders: 0
  });

  // Auto-detect emergency simulation (in real app, this would connect to emergency services)
  useEffect(() => {
    if (!autoDetectEmergency) return;

    const detectEmergency = () => {
      // Simulate emergency detection logic
      const hasEmergency = Math.random() < 0.05; // 5% chance every 30 seconds
      
      if (hasEmergency && !emergencyMode) {
        setEmergencyStatus({
          active: true,
          level: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          type: ['medical', 'fire', 'police', 'natural', 'security'][Math.floor(Math.random() * 5)] as any,
          location: 'Tourist Area - Zone A',
          duration: 0,
          responders: Math.floor(Math.random() * 5) + 1
        });
        
        // Auto-activate emergency mode
        handleToggle(true);
      }
    };

    const interval = setInterval(detectEmergency, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [autoDetectEmergency, emergencyMode]);

  // Emergency duration timer
  useEffect(() => {
    if (!emergencyStatus.active) return;

    const interval = setInterval(() => {
      setEmergencyStatus(prev => ({
        ...prev,
        duration: prev.duration + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [emergencyStatus.active]);

  const handleToggle = useCallback(async (forceMode?: boolean) => {
    setIsToggling(true);
    
    try {
      const newMode = forceMode !== undefined ? forceMode : !emergencyMode;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setEmergencyMode(newMode);
      onModeChange(newMode);
      
      if (newMode) {
        // Activate emergency status if not already active
        if (!emergencyStatus.active) {
          setEmergencyStatus(prev => ({
            ...prev,
            active: true,
            duration: 0
          }));
        }
        
        // Send emergency activation notification (simulation)
        console.log('Emergency mode activated - All emergency services notified');
      } else {
        // Deactivate emergency status
        setEmergencyStatus(prev => ({
          ...prev,
          active: false,
          duration: 0
        }));
        
        console.log('Emergency mode deactivated');
      }
      
    } catch (error) {
      console.error('Failed to toggle emergency mode:', error);
    } finally {
      setIsToggling(false);
    }
  }, [emergencyMode, emergencyStatus.active, onModeChange]);

  const getEmergencyIcon = () => {
    switch (emergencyStatus.type) {
      case 'medical': return Phone;
      case 'fire': return AlertTriangle;
      case 'police': return Shield;
      case 'natural': return Radio;
      case 'security': return Shield;
      default: return Siren;
    }
  };

  const getLevelColor = () => {
    switch (emergencyStatus.level) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200 animate-pulse';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const EmergencyIcon = getEmergencyIcon();

  return (
    <div className={`relative ${className}`}>
      {/* Main Toggle Button */}
      <motion.div
        className={`
          relative overflow-hidden rounded-lg border-2 transition-all duration-300
          ${emergencyMode 
            ? 'border-red-500 bg-red-50 shadow-lg shadow-red-500/25' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => handleToggle()}
          disabled={isToggling}
          className={`
            relative flex items-center justify-between w-full p-4 transition-all duration-300
            ${emergencyMode ? 'text-red-800' : 'text-gray-700'}
            ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          `}
        >
          {/* Left side - Icon and label */}
          <div className="flex items-center space-x-3">
            <motion.div
              animate={emergencyMode ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
              transition={{ duration: 0.5, repeat: emergencyMode ? Infinity : 0, repeatDelay: 2 }}
              className={`
                p-2 rounded-full transition-colors duration-300
                ${emergencyMode 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              {isToggling ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Settings className="w-5 h-5" />
                </motion.div>
              ) : emergencyMode ? (
                <Siren className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </motion.div>
            
            <div className="text-left">
              <h3 className="font-semibold text-sm">
                {emergencyMode ? 'Emergency Mode Active' : 'Emergency Mode'}
              </h3>
              <p className="text-xs opacity-70">
                {emergencyMode 
                  ? 'All emergency services activated' 
                  : 'Click to activate emergency response'
                }
              </p>
            </div>
          </div>

          {/* Right side - Status and settings */}
          <div className="flex items-center space-x-2">
            {/* Status indicator */}
            <motion.div
              className={`
                w-3 h-3 rounded-full transition-colors duration-300
                ${emergencyMode ? 'bg-red-500' : 'bg-gray-400'}
              `}
              animate={emergencyMode ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: emergencyMode ? Infinity : 0 }}
            />
            
            {/* Settings button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <motion.div
                animate={{ rotate: showSettings ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </button>

        {/* Emergency overlay effect */}
        <AnimatePresence>
          {emergencyMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-sm text-gray-900">Emergency Settings</h4>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoDetectEmergency}
                    onChange={(e) => {
                      // In real app, this would update settings
                      console.log('Auto-detect:', e.target.checked);
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>Auto-detect emergencies</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showStatus}
                    onChange={(e) => {
                      // In real app, this would update settings
                      console.log('Show status:', e.target.checked);
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>Show emergency status</span>
                </label>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Test emergency mode
                    setEmergencyStatus({
                      active: true,
                      level: 'high',
                      type: 'medical',
                      location: 'Test Location',
                      duration: 0,
                      responders: 3
                    });
                    handleToggle(true);
                    setShowSettings(false);
                  }}
                  className="w-full px-3 py-2 text-sm bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                >
                  Test Emergency Mode
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Status Panel */}
      <AnimatePresence>
        {showStatus && emergencyStatus.active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-red-200 rounded-lg shadow-lg z-40"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <EmergencyIcon className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-red-800 text-sm">
                    Active Emergency
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor()}`}>
                  {emergencyStatus.level.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{emergencyStatus.type}</span>
                </div>
                
                {emergencyStatus.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {emergencyStatus.location}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(emergencyStatus.duration)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Responders:</span>
                  <span className="font-medium">{emergencyStatus.responders} active</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleToggle(false)}
                  className="w-full px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Deactivate Emergency Mode</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default EmergencyModeToggle;