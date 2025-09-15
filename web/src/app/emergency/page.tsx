/**
 * Emergency Alert Page - Demonstrates emergency transition
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Shield, 
  Users,
  ArrowLeft,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { emergencyPageVariants, childVariants, listItemVariants } from "@/lib/animations";

export default function EmergencyPage() {
  const [alertLevel, setAlertLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Simulate time elapsed
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const alertLevelConfig = {
    low: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertCircle,
      title: 'Low Priority Alert',
    },
    medium: {
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: AlertTriangle,
      title: 'Medium Priority Alert',
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertTriangle,
      title: 'High Priority Alert',
    },
    critical: {
      color: 'text-red-800',
      bg: 'bg-red-100',
      border: 'border-red-300',
      icon: AlertTriangle,
      title: 'CRITICAL EMERGENCY',
    },
  };

  const config = alertLevelConfig[alertLevel];
  const Icon = config.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={emergencyPageVariants}
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          variants={childVariants}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-sm text-gray-500">
            Demo Emergency Page
          </div>
        </motion.div>

        {/* Emergency Alert Header */}
        <motion.div
          variants={childVariants}
          className={`${config.bg} ${config.border} border-2 rounded-xl p-6 mb-8 shadow-lg`}
        >
          <div className="flex items-center space-x-4">
            <div className={`${config.color} p-3 bg-white rounded-full shadow-md`}>
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${config.color} mb-2`}>
                {config.title}
              </h1>
              <p className="text-gray-700">
                This page demonstrates the emergency transition system with scale animation 
                and red glow effects for urgent attention.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Time Elapsed</div>
              <div className={`text-xl font-mono font-bold ${config.color}`}>
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Actions Grid */}
        <motion.div
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            variants={listItemVariants}
            className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-red-500"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Emergency Services</span>
                <a href="tel:112" className="text-red-600 font-semibold hover:text-red-700">
                  112
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tourist Helpline</span>
                <a href="tel:1363" className="text-red-600 font-semibold hover:text-red-700">
                  1363
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Local Police</span>
                <a href="tel:100" className="text-red-600 font-semibold hover:text-red-700">
                  100
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={listItemVariants}
            className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500"
          >
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Location Services</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Share Location
              </button>
              <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                Find Nearest Hospital
              </button>
              <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                Safe Zone Map
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={listItemVariants}
            className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Safety Resources</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Dashboard
              </Link>
              <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                Emergency Checklist
              </button>
              <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                Safety Guidelines
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Alert Level Controls */}
        <motion.div
          variants={childVariants}
          className="bg-white rounded-lg p-6 shadow-lg mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Alert Level Demo Controls
          </h2>
          <p className="text-gray-600 mb-4">
            Change the alert level to see different visual states:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(alertLevelConfig).map(([level, config]) => (
              <button
                key={level}
                onClick={() => setAlertLevel(level as any)}
                className={`
                  px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                  ${alertLevel === level 
                    ? `${config.bg} ${config.border} ${config.color}` 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {config.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Transition Demo Info */}
        <motion.div
          variants={childVariants}
          className="bg-purple-50 border border-purple-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            🎬 Emergency Transition Features
          </h3>
          <ul className="text-purple-700 space-y-2 text-sm">
            <li>• Scale animation with spring physics for immediate attention</li>
            <li>• Red glow effect applied via CSS class for urgency</li>
            <li>• Faster animation timing for critical response</li>
            <li>• Automatic detection for /emergency routes</li>
            <li>• Optimized for touch devices and mobile screens</li>
            <li>• Maintains accessibility standards with reduced motion support</li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-purple-200">
            <Link
              href="/demo/transitions"
              className="inline-flex items-center text-purple-700 hover:text-purple-800 font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View All Transition Types
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}