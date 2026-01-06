'use client';

import { useProject } from '@/contexts/ProjectContext';

interface InstanceCountInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function InstanceCountInput({ value, onChange, error }: InstanceCountInputProps) {
  const { project } = useProject();
  
  // Get quota from ProjectContext
  const maxCount = project?.quota?.instanceCount || 100;
  const minCount = 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || minCount;
    // Validate against quota
    const validatedValue = Math.max(minCount, Math.min(newValue, maxCount));
    onChange(validatedValue);
  };

  const quotaRemaining = project?.quota?.instanceCount 
    ? project.quota.instanceCount - value 
    : null;

  return (
    <div>
      <label htmlFor="count-input" className="block text-sm font-semibold text-gray-700 mb-2">
        Instance Count <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          id="count-input"
          type="number"
          min={minCount}
          max={maxCount}
          value={value}
          onChange={handleChange}
          aria-label="Number of instances to create"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'count-error' : quotaRemaining !== null ? 'count-quota' : undefined}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        />
      </div>
      {quotaRemaining !== null && (
        <p id="count-quota" className="mt-2 text-sm text-gray-600 font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Quota remaining: <span className="font-semibold text-gray-900">{quotaRemaining}</span> instances
        </p>
      )}
      {error && (
        <p id="count-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

