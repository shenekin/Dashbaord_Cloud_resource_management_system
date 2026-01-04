'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * Error Alert component
 */
export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

