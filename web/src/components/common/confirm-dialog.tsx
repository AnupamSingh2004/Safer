'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Shield, 
  AlertCircle,
  Check,
  ExternalLink
} from 'lucide-react';
import { LoadingButton } from '@/components/common/loading';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
  destructive?: boolean;
  requireConfirmation?: boolean;
  confirmationText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  loading = false,
  destructive = false,
  requireConfirmation = false,
  confirmationText = ''
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (requireConfirmation && confirmationInput !== confirmationText) {
      return;
    }

    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    if (!loading && !isConfirming) {
      setConfirmationInput('');
      onClose();
    }
  };

  const typeConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      borderColor: 'border-red-200'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      borderColor: 'border-yellow-200'
    },
    info: {
      icon: Shield,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-200'
    },
    success: {
      icon: Check,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      borderColor: 'border-green-200'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const isConfirmDisabled = requireConfirmation && confirmationInput !== confirmationText;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`
          relative bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${config.borderColor}
          transform transition-all duration-200 scale-100 opacity-100
        `}>
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className={`${config.iconBg} p-2 rounded-full`}>
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              disabled={loading || isConfirming}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>

            {/* Destructive Warning */}
            {destructive && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <strong>Warning:</strong> This action cannot be undone. Please proceed with caution.
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Input */}
            {requireConfirmation && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{confirmationText}</code> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={confirmationText}
                  disabled={loading || isConfirming}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleClose}
              disabled={loading || isConfirming}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>
            <LoadingButton
              loading={isConfirming}
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className={`text-white ${config.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {confirmText}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Specialized confirmation dialogs
export const DeleteConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  itemName: string;
  itemType?: string;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, itemName, itemType = 'item', loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title={`Delete ${itemType}`}
    message={`Are you sure you want to delete "${itemName}"? This action cannot be undone and will permanently remove all associated data.`}
    confirmText="Delete"
    type="danger"
    destructive={true}
    loading={loading}
  />
);

export const LogoutConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Sign Out"
    message="Are you sure you want to sign out? You will need to sign in again to access the dashboard."
    confirmText="Sign Out"
    type="warning"
    loading={loading}
  />
);

export const AlertDismissDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  alertType: string;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, alertType, loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Dismiss Alert"
    message={`Are you sure you want to dismiss this ${alertType} alert? Make sure the issue has been properly resolved before dismissing.`}
    confirmText="Dismiss Alert"
    type="warning"
    loading={loading}
  />
);

export const SystemResetDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Reset System"
    message="This will reset all system settings to their default values. All custom configurations, preferences, and cached data will be lost."
    confirmText="Reset System"
    type="danger"
    destructive={true}
    requireConfirmation={true}
    confirmationText="RESET"
    loading={loading}
  />
);

export const DataExportDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  dataType: string;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, dataType, loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Export Data"
    message={`Export ${dataType} data to a downloadable file. This may take a few moments depending on the amount of data.`}
    confirmText="Export"
    type="info"
    loading={loading}
  />
);

export const EmergencyResponseDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  touristName: string;
  location: string;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, touristName, location, loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Emergency Response"
    message={`Dispatch emergency response team to assist ${touristName} at ${location}? This will immediately alert local emergency services and begin response protocols.`}
    confirmText="Dispatch Response"
    type="danger"
    loading={loading}
  />
);

export const BlockchainTransactionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  transactionType: string;
  gasEstimate?: string;
  loading?: boolean;
}> = ({ isOpen, onClose, onConfirm, transactionType, gasEstimate, loading = false }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Blockchain Transaction"
    message={
      `Confirm ${transactionType} on the blockchain. ` +
      (gasEstimate ? `Estimated gas fee: ${gasEstimate}. ` : '') +
      'This transaction will be recorded permanently on the blockchain.'
    }
    confirmText="Confirm Transaction"
    type="info"
    loading={loading}
  />
);

// Hook for managing confirm dialogs
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    type?: 'danger' | 'warning' | 'info' | 'success';
    destructive?: boolean;
    requireConfirmation?: boolean;
    confirmationText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirmDialog = (config: Omit<typeof dialogState, 'isOpen'>) => {
    setDialogState({ ...config, isOpen: true });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      message={dialogState.message}
      type={dialogState.type}
      destructive={dialogState.destructive}
      requireConfirmation={dialogState.requireConfirmation}
      confirmationText={dialogState.confirmationText}
    />
  );

  return {
    showConfirmDialog,
    closeDialog,
    ConfirmDialogComponent
  };
};
