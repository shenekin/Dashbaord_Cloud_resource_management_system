'use client';

import { useProject } from '@/contexts/ProjectContext';
import { useState, useEffect } from 'react';

// Simple icon component
const ExclamationCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface RegionSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onResetDownstream?: () => void;
}

export default function RegionSelector({ value, error, onChange, onResetDownstream }: RegionSelectorProps) {
  const { project } = useProject();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    // Load regions from ProjectContext
    if (project?.regionScope) {
      setLoading(true);
      // Simulate async loading
      setTimeout(() => {
        const regionOptions = project.regionScope.map((region) => ({
          value: region,
          label: region, // You can enhance this with a mapping if needed
        }));
        setRegions(regionOptions);
        setLoading(false);
      }, 100);
    } else {
      setRegions([]);
    }
  }, [project]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Reset downstream sections when region changes
    if (onResetDownstream && newValue !== value) {
      onResetDownstream();
    }
  };

  return (
    <div>
      <label htmlFor="region-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Region <span className="text-red-500">*</span>
      </label>
      {loading ? (
        <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center shadow-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-3"></div>
          <span className="text-sm text-gray-600 font-medium">Loading regions...</span>
        </div>
      ) : (
        <select
          id="region-select"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          aria-label="Select deployment region"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'region-error' : undefined}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        >
          <option value="">Select a region</option>
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      )}
      {error && (
        <p id="region-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <ExclamationCircleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

