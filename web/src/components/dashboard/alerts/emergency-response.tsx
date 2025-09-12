/**
 * Emergency Response Component - Coordinated emergency actions
 */

'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle,
  Send,
  UserPlus
} from 'lucide-react';
import type { Alert } from '@/types/alert';

interface EmergencyResponseProps {
  alert: Alert;
  onClose: () => void;
}

const EmergencyResponse: React.FC<EmergencyResponseProps> = ({ alert, onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [responseNotes, setResponseNotes] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const emergencyTeams = [
    { id: 'medical', name: 'Medical Team', status: 'available', eta: '5 min' },
    { id: 'security', name: 'Security Team', status: 'available', eta: '3 min' },
    { id: 'rescue', name: 'Rescue Team', status: 'busy', eta: '12 min' },
    { id: 'fire', name: 'Fire Department', status: 'available', eta: '8 min' }
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'primary' },
    { name: 'Tourist Police', number: '+1-555-0123', type: 'local' },
    { name: 'Embassy Contact', number: '+1-555-0456', type: 'consulate' }
  ];

  const handleDeployTeam = () => {
    if (!selectedTeam) return;
    setIsDeploying(true);
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false);
      alert(`Team deployed for ${alert.title}`);
    }, 2000);
  };

  const handleCallEmergency = (number: string) => {
    // In real app, would integrate with phone system
    alert(`Calling ${number}...`);
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Emergency Response
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getAlertSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Alert ID: {alert.id}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Alert Summary */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              {alert.title}
            </h3>
            <p className="text-red-800 dark:text-red-200 mb-3">
              {alert.description}
            </p>
            {alert.location && (
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{alert.location}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Teams */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Deploy Emergency Team
              </h3>
              
              <div className="space-y-3 mb-4">
                {emergencyTeams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTeam === team.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTeam(team.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {team.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ETA: {team.eta}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          team.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {team.status}
                        </span>
                        {selectedTeam === team.id && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                placeholder="Response notes and instructions..."
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                rows={3}
              />

              <button
                onClick={handleDeployTeam}
                disabled={!selectedTeam || isDeploying}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {isDeploying ? 'Deploying...' : 'Deploy Team'}
              </button>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </h3>
              
              <div className="space-y-3 mb-6">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {contact.number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCallEmergency(contact.number)}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                ))}
              </div>

              {/* Response Timeline */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Response Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Alert triggered</span>
                    <span className="text-gray-400 ml-auto">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-500">Response initiated</span>
                    <span className="text-gray-400 ml-auto">Now</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-50">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-500">Team deployed</span>
                    <span className="text-gray-400 ml-auto">Pending</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-50">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-500">Situation resolved</span>
                    <span className="text-gray-400 ml-auto">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4" />
              Send Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;
