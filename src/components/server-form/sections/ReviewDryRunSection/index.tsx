'use client';

import { ServerFormData } from '@/types/server';
import SummaryCard from './SummaryCard';
import ValidationResult from './ValidationResult';

interface ReviewDryRunSectionProps {
  formData: ServerFormData;
  dryRunResult: any;
  dryRunLoading: boolean;
  onDryRun: () => void;
  onSubmit: () => void;
  submitLoading: boolean;
  submitError: string | null;
  errors?: Record<string, string>;
  isValid?: boolean;
}

export default function ReviewDryRunSection({
  formData,
  dryRunResult,
  dryRunLoading,
  onDryRun,
  onSubmit,
  submitLoading,
  submitError,
  errors = {},
  isValid = false,
}: ReviewDryRunSectionProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 px-8 py-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">8</span>
          </div>
          Review & Submit
        </h2>
        <p className="text-violet-100 text-sm mt-1.5">Review your configuration and create the server</p>
      </div>
      <div className="p-8">
        <div className="space-y-6">
          <SummaryCard title="Basic" data={formData.basic} />
          <SummaryCard title="Compute" data={formData.compute} />
          <SummaryCard title="Storage" data={formData.storage} />
          <SummaryCard title="Network" data={formData.network} />
          <SummaryCard title="Billing" data={formData.billing} />
          <ValidationResult
            result={dryRunResult}
            loading={dryRunLoading}
            error={submitError}
          />
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
          <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onDryRun}
            disabled={dryRunLoading || !isValid}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-gray-500/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {dryRunLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Running...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Dry Run
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitLoading || !isValid}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {submitLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Server
              </>
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

