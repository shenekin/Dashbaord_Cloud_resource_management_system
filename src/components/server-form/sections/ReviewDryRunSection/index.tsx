'use client';

import { ServerFormData } from '@/types/server';
import SummaryCard from './SummaryCard';
import ValidationResult from './ValidationResult';

interface ReviewDryRunSectionProps {
  formData: ServerFormData;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  dryRunResult?: any;
  dryRunLoading?: boolean;
  onDryRun?: () => void;
  submitError?: string | null;
  errors?: Record<string, string>;
}

/**
 * Review and Submit Section Component
 * Displays form summary and allows user to review before submission
 * Includes confirmation and cancellation options
 */
export default function ReviewDryRunSection({
  formData,
  onConfirm,
  onCancel,
  loading = false,
  dryRunResult,
  dryRunLoading = false,
  onDryRun,
  submitError,
  errors = {},
}: ReviewDryRunSectionProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">8</span>
          </div>
          Review & Submit
        </h2>
        <p className="text-violet-100 text-xs mt-0.5">Review your configuration and create the server</p>
      </div>
      <div className="p-4">
        <div className="space-y-6">
          <SummaryCard title="Basic" data={formData.basic} />
          <SummaryCard title="Compute" data={formData.compute} />
          <SummaryCard title="Storage" data={formData.storage} />
          <SummaryCard title="Network" data={formData.network} />
          <SummaryCard title="Billing" data={formData.billing} />
          {dryRunResult && (
            <ValidationResult
              result={dryRunResult}
              loading={dryRunLoading}
              error={submitError || null}
            />
          )}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Validation Errors</h3>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{field}: {message}</li>
                ))}
              </ul>
            </div>
          )}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">{submitError}</p>
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-red-800 mb-2">Validation Errors</h3>
              <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{field}: {message}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {onDryRun && (
              <button
                type="button"
                onClick={onDryRun}
                disabled={dryRunLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md shadow-gray-500/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                {dryRunLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Dry Run
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm & Create Server
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

