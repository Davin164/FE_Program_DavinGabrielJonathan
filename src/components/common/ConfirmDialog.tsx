import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      btn: 'bg-danger hover:bg-danger-hover text-white',
      iconBg: 'bg-danger-light text-danger',
    },
    warning: {
      btn: 'bg-warning hover:bg-warning-hover text-text-primary',
      iconBg: 'bg-warning-light text-warning-dark',
    },
    primary: {
      btn: 'bg-primary hover:bg-primary-hover text-white',
      iconBg: 'bg-primary-light text-primary',
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-card p-6 border border-border"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${variantStyles.iconBg}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-text-secondary leading-relaxed pl-12">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors border border-border"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm ${variantStyles.btn}`}
          >
            {isLoading && <LoadingSpinner size="sm" className="p-0 text-white" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
