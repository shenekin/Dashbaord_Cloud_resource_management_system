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
}

export default function ReviewDryRunSection({
  formData,
  dryRunResult,
  dryRunLoading,
  onDryRun,
  onSubmit,
  submitLoading,
  submitError,
}: ReviewDryRunSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h2>
      <div className="space-y-4">
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
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onDryRun}
            disabled={dryRunLoading}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {dryRunLoading ? 'Running...' : 'Dry Run'}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitLoading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
          >
            {submitLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

