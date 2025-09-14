/**
 * Smart Tourist Safety System - Enhanced Not Found Page
 * 404 page with emergency access, navigation options, and modern design
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ArrowLeft, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Shield,
  Search,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const quickActions = [
    {
      icon: Home,
      title: "Go Home",
      description: "Return to the main dashboard",
      href: "/dashboard",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Access",
      description: "Quick access to emergency services",
      href: "/dashboard/alerts/active",
      color: "from-red-500 to-red-600"
    },
    {
      icon: MapPin,
      title: "Tourist Tracking",
      description: "View live tourist locations",
      href: "/dashboard/tourists",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "System Status",
      description: "Check system health and alerts",
      href: "/dashboard/overview",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const emergencyContacts = [
    { name: "Emergency Services", number: "112", icon: Phone },
    { name: "Tourist Helpline", number: "1363", icon: HelpCircle },
    { name: "Police Control", number: "100", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main 404 Section */}
        <div className="mb-12">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Search className="w-16 h-16 text-white/60" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, you can still access all emergency services and safety features.
          </p>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-300">
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
            <Phone className="w-6 h-6 mr-2 text-red-400" />
            Emergency Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="group flex items-center p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-red-400/50 transition-all duration-300"
              >
                <contact.icon className="w-5 h-5 text-red-400 mr-3" />
                <div className="text-left">
                  <div className="text-white font-medium">{contact.name}</div>
                  <div className="text-red-300 font-bold">{contact.number}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="text-center text-gray-400 text-sm">
          <p>Smart Tourist Safety System • Government of India Initiative</p>
          <p className="mt-1">For technical support, contact your system administrator</p>
        </div>
      </div>
    </div>
  );
}
