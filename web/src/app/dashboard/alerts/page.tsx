/**
 * Smart Tourist Safety System - Alerts Management Page
 * Main page for alert management with routing between list, detail, and resolution views
 */

'use client';

import React, { useState } from 'react';
import { AlertList, AlertDetail, AlertResolution } from '@/components/dashboard/alerts';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type AlertView = 'list' | 'detail' | 'resolution' | 'create';

interface AlertsPageState {
  view: AlertView;
  selectedAlertId?: string;
  showCreateForm?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function AlertsPage() {
  const [pageState, setPageState] = useState<AlertsPageState>({
    view: 'list',
  });

  // Navigation handlers
  const showAlertList = () => {
    setPageState({ view: 'list' });
  };

  const showAlertDetail = (alertId: string) => {
    setPageState({ view: 'detail', selectedAlertId: alertId });
  };

  const showAlertResolution = (alertId: string) => {
    setPageState({ view: 'resolution', selectedAlertId: alertId });
  };

  const showCreateForm = () => {
    setPageState({ view: 'create', showCreateForm: true });
  };

  // Action handlers
  const handleViewAlert = (alertId: string) => {
    showAlertDetail(alertId);
  };

  const handleEditAlert = (alertId: string) => {
    // Navigate to edit form (could be implemented later)
    // Edit functionality for alert: ${alertId}
  };

  const handleDeleteAlert = async (alertId: string) => {
    // Handle alert deletion
    // Delete functionality for alert: ${alertId}
    // After deletion, return to list
    showAlertList();
  };

  const handleResolveAlert = (alertId: string) => {
    showAlertResolution(alertId);
  };

  const handleDismissAlert = async (alertId: string) => {
    // Handle alert dismissal
    // Dismiss functionality for alert: ${alertId}
    // After dismissal, return to list
    showAlertList();
  };

  const handleAlertResolution = async (alertId: string, resolutionData: any) => {
    // Handle resolution submission
    // Resolve functionality for alert: ${alertId}
    // After resolution, return to list
    showAlertList();
  };

  // Render appropriate view
  const renderCurrentView = () => {
    switch (pageState.view) {
      case 'detail':
        if (!pageState.selectedAlertId) {
          return renderNotFound();
        }
        return (
          <AlertDetail
            alertId={pageState.selectedAlertId}
            onEdit={handleEditAlert}
            onDelete={handleDeleteAlert}
            onResolve={handleResolveAlert}
            onDismiss={handleDismissAlert}
            onBack={showAlertList}
          />
        );

      case 'resolution':
        if (!pageState.selectedAlertId) {
          return renderNotFound();
        }
        return (
          <AlertResolution
            alertId={pageState.selectedAlertId}
            onResolve={handleAlertResolution}
            onCancel={showAlertList}
          />
        );

      case 'create':
        return renderCreateForm();

      case 'list':
      default:
        return (
          <AlertList
            onViewAlert={handleViewAlert}
            onEditAlert={handleEditAlert}
            onDeleteAlert={handleDeleteAlert}
            onResolveAlert={handleResolveAlert}
            onDismissAlert={handleDismissAlert}
            onCreateAlert={showCreateForm}
          />
        );
    }
  };

  const renderNotFound = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Alert Not Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        The requested alert could not be found.
      </p>
      <button
        onClick={showAlertList}
        className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Alerts
      </button>
    </div>
  );

  const renderCreateForm = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Create Alert Form
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Alert creation form will be implemented once schema validation issues are resolved.
      </p>
      <button
        onClick={showAlertList}
        className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Alerts
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header - Only show on list view */}
      {pageState.view === 'list' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Emergency Alerts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and manage emergency alerts and safety notifications
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default AlertsPage;
